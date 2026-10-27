const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),src=path.join(root,'src'),out=path.join(root,'docs');fs.mkdirSync(out,{recursive:true});
const list=(d,p='')=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?list(path.join(d,x.name),p+x.name+'/'):[p+x.name]);
for(const file of list(src).filter(p=>p!=='backup-sw.js')){fs.mkdirSync(path.dirname(path.join(out,file)),{recursive:true});fs.copyFileSync(path.join(src,file),path.join(out,file));}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const manifest=list(src).filter(p=>p!=='backup-sw.js').sort().map(p=>{const b=fs.readFileSync(path.join(src,p));return {path:p,size:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),group:p.startsWith('ielts-audio/')?'audio':'core'};});
const release=crypto.createHash('sha256').update(JSON.stringify(manifest)+fs.readFileSync(path.join(src,'backup-sw.js'))).digest('hex').slice(0,16);
fs.writeFileSync(path.join(out,'backup-sw.js'),fs.readFileSync(path.join(src,'backup-sw.js'),'utf8').replace('__RELEASE__',JSON.stringify(release)).replace('__PACK__',JSON.stringify(manifest)));
fs.writeFileSync(path.join(root,'release.json'),JSON.stringify({release,coreBytes:manifest.filter(a=>a.group==='core').reduce((n,a)=>n+a.size,0),audioBytes:manifest.filter(a=>a.group==='audio').reduce((n,a)=>n+a.size,0),files:manifest.length},null,2)+'\n');
console.log(fs.readFileSync(path.join(root,'release.json'),'utf8'));
