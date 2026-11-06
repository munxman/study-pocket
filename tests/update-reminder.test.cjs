const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const SOURCE=fs.readFileSync('src/backup-client.js','utf8');
const tick=async()=>{await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);};
class Emitter{
 constructor(){this.listeners=new Map();}
 addEventListener(type,fn){const list=this.listeners.get(type)||[];list.push(fn);this.listeners.set(type,list);}
 removeEventListener(type,fn){this.listeners.set(type,(this.listeners.get(type)||[]).filter(x=>x!==fn));}
 emit(type,extra={}){for(const fn of this.listeners.get(type)||[])fn({type,target:this,...extra});}
}
class Element extends Emitter{
 constructor(tag){super();this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.attributes={};this.dataset={};this.hidden=false;this.disabled=false;this._text='';this.className='';this.style={};this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...names])].join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(x=>!names.includes(x)).join(' ');},toggle:(name,on)=>{const wanted=on??!this.className.split(' ').includes(name);wanted?this.classList.add(name):this.classList.remove(name);return wanted;}};}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(x=>typeof x==='string'?x:x.textContent).join('');}
 setAttribute(key,value){this.attributes[key]=String(value);if(key==='class')this.className=String(value);if(key==='id')this.id=String(value);if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_m,c)=>c.toUpperCase())]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 removeAttribute(key){delete this.attributes[key];}
 append(...items){for(const item of items){if(item&&typeof item!=='string')item.parentNode=this;this.children.push(item);}}
 appendChild(item){this.append(item);return item;}
 focus(){}
 async click(){if(this.disabled)return;await this.onclick?.({target:this});this.emit('click');}
 prepend(...items){for(const item of items)if(item&&typeof item!=='string')item.parentNode=this;this.children.unshift(...items);}
 insertAdjacentElement(where,node){if(where==='afterend'&&this.parentNode){const siblings=this.parentNode.children;node.parentNode=this.parentNode;siblings.splice(siblings.indexOf(this)+1,0,node);}else this.append(node);}
 querySelectorAll(selector){const matches=node=>selector.startsWith('.')?node.className.split(' ').includes(selector.slice(1)):selector.startsWith('#')?node.id===selector.slice(1):node.tagName.toLowerCase()===selector;const found=[];for(const child of this.children){if(typeof child==='string')continue;if(matches(child))found.push(child);found.push(...child.querySelectorAll(selector));}return found;}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
class Worker extends Emitter{
 constructor(state='activated',core=true){super();this.state=state;this.core=core;this.messages=[];}
 postMessage(message,ports=[]){this.messages.push(message.type);if(message.type==='status')ports[0]?.postMessage({release:'isolated-test-pack',core:this.core,audio:8,totalAudio:8});}
 setState(value){this.state=value;this.emit('statechange');}
}
class Registration extends Emitter{
 constructor(){super();this.active=new Worker();this.waiting=null;this.installing=null;this.updateCalls=0;this.failUpdate=false;}
 async update(){this.updateCalls++;if(this.failUpdate)throw Error('offline');}
}
async function harness({waiting=false,initial=false,installing=false,offline=false,unsaved=false,corrupt=false,storageUnavailable=false}={}){
 let now=Date.UTC(2026,10,7,10),reloads=0,installCalls=0,activateCalls=0,flushCalls=0;
 const order=[],reg=new Registration(),sw=new Emitter(),doc=new Emitter(),win=new Emitter();
 if(initial){reg.active=null;reg.installing=new Worker('installing');}if(installing)reg.installing=new Worker('installing');if(waiting)reg.waiting=new Worker('installed');reg.failUpdate=offline;
 sw.controller=initial?null:reg.active;sw.register=async()=>reg;sw.ready=Promise.resolve(reg);
 const body=new Element('body'),header=new Element('header');body.append(header);doc.body=body;doc.hidden=false;Object.defineProperty(doc,'visibilityState',{get:()=>doc.hidden?'hidden':'visible'});doc.documentElement={lang:'et'};doc.createElement=tag=>new Element(tag);doc.querySelector=selector=>selector==='header'?header:body.querySelector(selector);doc.querySelectorAll=selector=>body.querySelectorAll(selector);
 const intervals=new Map(),timeouts=new Map(),session=new Map();let timer=0;
 class Clock extends Date{static now(){return now;}}
 class Channel{constructor(){this.port1={onmessage:null,close(){}};this.port2={postMessage:data=>this.port1.onmessage?.({data}),close(){}};}}
 const context={window:win,document:doc,navigator:{serviceWorker:sw,onLine:!offline,storage:{persist:async()=>true}},location:{reload(){reloads++;order.push('reload');}},Date:Clock,MessageChannel:Channel,
   setTimeout:(fn,ms)=>{const id=++timer;timeouts.set(id,{fn,ms});return id;},clearTimeout:id=>timeouts.delete(id),setInterval:(fn,ms)=>{const id=++timer;intervals.set(id,{fn,ms});return id;},clearInterval:id=>intervals.delete(id),
   sessionStorage:{getItem:key=>{if(storageUnavailable)throw Error('storage unavailable');return session.get(key)||null;},setItem:(key,value)=>{if(storageUnavailable)throw Error('storage unavailable');session.set(key,value);},removeItem:key=>session.delete(key)}};
 win.PocketUpdate={async install(){installCalls++;return reg.waiting;},async activate(worker){assert.ok(worker);activateCalls++;order.push('activate');sw.controller=worker;reg.active=worker;reg.waiting=null;sw.emit('controllerchange');}};
 win.BackupStore={async flush(){flushCalls++;order.push('flush');},corrupt:()=>corrupt,isSaved:()=>!unsaved,snapshot:()=>({modules:{'isolated-test':{version:1}}})};
 win.sessionStorage=context.sessionStorage;win.setInterval=context.setInterval;win.setTimeout=context.setTimeout;
 vm.createContext(context);await vm.runInContext(SOURCE,context);await tick();
 return {reg,sw,doc,body,win,session,order,navigator:context.navigator,
   get notice(){return body.querySelector('.backup-update-notice');},get reloads(){return reloads;},get installCalls(){return installCalls;},get activateCalls(){return activateCalls;},get flushCalls(){return flushCalls;},
   findButton(text){return body.querySelectorAll('button').find(node=>node.textContent===text);},
   async click(text){const node=this.findButton(text);assert.ok(node,'button '+text+' exists');if(node.disabled)return;await node.onclick?.({target:node});node.emit('click');await tick();},
   async event(target,type){target.emit(type);await tick();},
   async advance(ms){now+=ms;for(const interval of intervals.values())if(interval.ms<=ms)interval.fn();await tick();},
   async installWaiting(){const worker=new Worker('installing');reg.installing=worker;reg.emit('updatefound');await tick();assert.equal(this.notice?.hidden??true,true,'installing is not ready');reg.waiting=worker;reg.installing=null;worker.setState('installed');await tick();return worker;}
 };
}
test('a ready waiting update has a visible nonblocking reminder without auto-activation',async()=>{
 const h=await harness({waiting:true});assert.ok(h.notice);assert.equal(h.notice.hidden,false);assert.match(h.notice.textContent,/Uuendus on valmis/);assert.ok(h.findButton('Uuenda nüüd'));assert.ok(h.findButton('Hiljem'));assert.equal(h.notice.getAttribute('aria-modal'),null);
 assert.equal(h.installCalls,0);assert.equal(h.activateCalls,0);assert.equal(h.reloads,0);assert.equal(h.findButton('Rakenda valmis uuendus').dataset.updateReady,'true');
});
test('Later hides the reminder but preserves the manual toolbar action and study state',async()=>{
 const h=await harness({waiting:true});await h.click('Hiljem');assert.equal(h.notice.hidden,true);assert.ok(h.findButton('Rakenda valmis uuendus'));assert.equal(h.reloads,0);assert.equal(h.flushCalls,0);
 await h.event(h.win,'online');await h.event(h.doc,'visibilitychange');assert.equal(h.notice.hidden,true,'foreground does not immediately nag after Later');assert.equal(h.activateCalls,0);
 await h.advance(31*60000);assert.equal(h.notice.hidden,false,'a still-ready update can be offered after the dismissal interval');
});
test('a later updatefound and installed worker trigger the reminder only after it becomes waiting',async()=>{
 const h=await harness();assert.equal(h.notice?.hidden??true,true);await h.installWaiting();assert.equal(h.notice.hidden,false);assert.equal(h.activateCalls,0);assert.equal(h.reloads,0);
});
test('initial installation is not announced as an update waiting to be applied',async()=>{
 const h=await harness({initial:true}),worker=h.reg.installing;assert.equal(h.notice?.hidden??true,true);h.reg.active=worker;h.reg.installing=null;h.sw.controller=worker;worker.setState('activated');await tick();assert.equal(h.notice?.hidden??true,true,'initial installation is not a waiting update');
});
test('an already-installing update is observed without needing another updatefound event',async()=>{
 const h=await harness({installing:true}),worker=h.reg.installing;assert.equal(h.notice?.hidden??true,true);
 h.reg.waiting=worker;h.reg.installing=null;worker.setState('installed');await tick();assert.equal(h.notice.hidden,false);assert.equal(h.reloads,0);
});
test('installed state alone does not advertise an update without registration.waiting',async()=>{
 const h=await harness({installing:true}),worker=h.reg.installing;h.reg.installing=null;worker.setState('installed');await tick();
 assert.equal(h.notice.hidden,true);assert.equal(h.findButton('Kontrolli uuendust').dataset.updateReady,'false');assert.equal(h.reloads,0);
});
test('no update and offline check errors never create a ready reminder or reload',async()=>{
 for(const offline of [false,true]){const h=await harness({offline});assert.equal(h.notice?.hidden??true,true);await h.event(h.win,'online');await h.event(h.doc,'visibilitychange');await h.advance(60000);assert.equal(h.notice?.hidden??true,true);assert.equal(h.installCalls,0);assert.equal(h.activateCalls,0);assert.equal(h.reloads,0);}
});
test('foreground and reconnect checks are throttled and cannot activate the waiting update',async()=>{
 const h=await harness(),initial=h.reg.updateCalls;for(let i=0;i<4;i++){await h.event(h.win,'online');await h.event(h.doc,'visibilitychange');}assert.ok(h.reg.updateCalls-initial<=1);
 const before=h.reg.updateCalls;await h.advance(60000);assert.equal(h.reg.updateCalls,before);await h.advance(16*60000);await h.event(h.doc,'visibilitychange');assert.ok(h.reg.updateCalls>before);assert.equal(h.installCalls,0);assert.equal(h.reloads,0);
});
test('Update now preserves the existing flush-before-activation guard',async()=>{
 const h=await harness({waiting:true});await h.click('Uuenda nüüd');assert.equal(h.installCalls,1);assert.equal(h.flushCalls,1);assert.equal(h.activateCalls,1);assert.equal(h.reloads,1);assert.deepEqual(h.order,['flush','activate','reload']);
});
test('unsaved or unreadable study data prevents reminder-triggered activation',async()=>{
 for(const state of [{unsaved:true},{corrupt:true}]){const h=await harness({waiting:true,...state});await h.click('Uuenda nüüd');assert.equal(h.flushCalls,1);assert.equal(h.activateCalls,0);assert.equal(h.reloads,0);assert.ok(h.reg.waiting);assert.match(h.body.textContent,/Uuendust ei rakendatud/);}
});
test('Later works on the current page when session storage is unavailable',async()=>{
 const h=await harness({waiting:true,storageUnavailable:true});await h.click('Hiljem');assert.equal(h.notice.hidden,true);
 await h.event(h.win,'online');await h.advance(60000);assert.equal(h.notice.hidden,true);assert.ok(h.findButton('Rakenda valmis uuendus'));assert.equal(h.activateCalls,0);
 await h.click('Rakenda valmis uuendus');assert.equal(h.activateCalls,1);assert.equal(h.reloads,1);
});
test('background checks skip network updates while hidden or offline, then resume on reconnect',async()=>{
 const h=await harness();h.doc.hidden=true;await h.advance(16*60000);await h.event(h.win,'online');assert.equal(h.reg.updateCalls,0);
 h.doc.hidden=false;h.navigator.onLine=false;await h.event(h.doc,'visibilitychange');assert.equal(h.reg.updateCalls,0);
 h.navigator.onLine=true;await h.event(h.win,'online');assert.equal(h.reg.updateCalls,1);assert.equal(h.reloads,0);
});
test('a failed online background check is silent and cannot create a false ready notice',async()=>{
 const h=await harness();h.reg.failUpdate=true;await h.advance(16*60000);assert.equal(h.reg.updateCalls,1);assert.equal(h.notice.hidden,true);assert.equal(h.activateCalls,0);assert.equal(h.reloads,0);
});
test('an in-flight background update check is not duplicated by foreground events',async()=>{
 const h=await harness();let release;h.reg.update=()=>{h.reg.updateCalls++;return new Promise(resolve=>release=resolve);};
 await h.advance(16*60000);await h.event(h.win,'online');await h.event(h.doc,'visibilitychange');assert.equal(h.reg.updateCalls,1);
 release();await tick();assert.equal(h.notice.hidden,true);assert.equal(h.activateCalls,0);
});
test('a waiting worker becoming redundant removes the notice on the next status check',async()=>{
 const h=await harness({waiting:true});h.reg.waiting.setState('redundant');await h.event(h.win,'online');assert.equal(h.notice.hidden,true);assert.equal(h.findButton('Kontrolli uuendust').dataset.updateReady,'false');assert.equal(h.reloads,0);
});
