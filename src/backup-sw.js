'use strict';
const RELEASE=__RELEASE__,PACK=__PACK__,CACHE='study-pocket-pack-'+RELEASE;
const base=self.registration.scope,absolute=p=>new URL(p,base).href,marker=absolute('__complete__');
async function complete(cache){return !!(await cache.match(marker));}
async function checked(asset,r){if(!r.ok||r.redirected)throw Error('Download failed: '+asset.path);const bytes=await r.arrayBuffer();if(bytes.byteLength!==asset.size)throw Error('Incomplete download: '+asset.path);const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==asset.sha256)throw Error('Version mismatch: '+asset.path);return new Response(bytes,{status:200,headers:r.headers});}
async function verified(asset){const r=await fetch(absolute(asset.path),{cache:'reload',redirect:'error'});if(r.url!==absolute(asset.path))throw Error('Unexpected address');return checked(asset,r);}
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);if(await complete(cache))return;try{for(const a of PACK.filter(a=>a.group==='core'))await cache.put(absolute(a.path),await verified(a));await cache.put(marker,new Response(RELEASE));}catch(e){await caches.delete(CACHE);throw e;}
 // Reuse unchanged, verified listening files. A small lesson update must not require another 16 MB download.
 const older=(await caches.keys()).filter(k=>k.startsWith('study-pocket-pack-')&&k!==CACHE).reverse();
 for(const a of PACK.filter(a=>a.group==='audio'))for(const name of older){try{const old=await caches.open(name),hit=await old.match(absolute(a.path));if(hit){await cache.put(absolute(a.path),await checked(a,hit));break;}}catch{/* A missing or incompatible old audio file remains downloadable. */}}
})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function status(){const cache=await caches.open(CACHE);let audio=0;for(const a of PACK.filter(a=>a.group==='audio'))if(await cache.match(absolute(a.path)))audio++;return {release:RELEASE,core:await complete(cache),audio,totalAudio:PACK.filter(a=>a.group==='audio').length};}
let download=null;
self.addEventListener('message',event=>{
 const reply=value=>event.ports?.[0]?.postMessage(value);
 if(event.data?.type==='status')event.waitUntil(status().then(reply));
 if(event.data?.type==='activate'){self.skipWaiting();reply({ok:true});}
 if(event.data?.type==='download')event.waitUntil((async()=>{try{if(!download)download=(async()=>{const cache=await caches.open(CACHE);for(const a of PACK.filter(a=>a.group==='audio')){if(!await cache.match(absolute(a.path)))await cache.put(absolute(a.path),await verified(a));reply({progress:true,...await status()});}})().finally(()=>download=null);await download;reply({done:true,...await status()});}catch(e){reply({error:String(e.message||e),...await status()});}})());
});
function range(header,size){const m=/^bytes=(\d*)-(\d*)$/.exec(header||'');if(!m||(!m[1]&&!m[2]))return null;let start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2])),end=m[1]&&m[2]?Math.min(size-1,Number(m[2])):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return null;return {start,end};}
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);if(event.request.method!=='GET'||!u.href.startsWith(base))return;
 let path=u.pathname.slice(new URL(base).pathname.length);if(!path)path='index.html';const a=PACK.find(a=>a.path===path);if(!a)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(absolute(path));if(hit){if(event.request.headers.has('range')&&a.group==='audio'){const bytes=await hit.arrayBuffer(),r=range(event.request.headers.get('range'),bytes.byteLength);if(!r)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+bytes.byteLength}});return new Response(bytes.slice(r.start,r.end+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'audio/mp4','Content-Length':String(r.end-r.start+1),'Content-Range':`bytes ${r.start}-${r.end}/${bytes.byteLength}`,'Accept-Ranges':'bytes'}});}return hit;}
 try{return await fetch(event.request);}catch{return new Response('This item has not been downloaded. Open the backup online and download the offline pack.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}})());
});
