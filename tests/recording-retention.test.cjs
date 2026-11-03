const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../src/ielts-audio-storage.js');
const store = A.createRecordingStore('practice');
const now=1793640000000;

function database(data = new Map()) {
  const api = {
    open() {
      const req={};
      queueMicrotask(()=>{
        req.result={close(){},transaction(_name,mode) {
          assert.equal(mode,'readwrite');
          const working=new Map(data);
          const tx={abort(){queueMicrotask(()=>tx.onabort());},objectStore(){return {
            openCursor(){
              const cursor={},items=[...working],commit=()=>{
                data.clear();for(const x of working)data.set(...x);
                tx.oncomplete();
              };
              const visit=i=>queueMicrotask(()=>{
                let aborted=false;
                tx.abort=()=>{aborted=true;queueMicrotask(()=>tx.onabort());};
                const item=items[i];
                cursor.result=item?{key:item[0],value:item[1],delete(){working.delete(item[0]);},continue(){visit(i+1);}}:null;
                cursor.onsuccess();if(!item&&!aborted)queueMicrotask(commit);
              });
              visit(0);return cursor;
            },
            put(value,id){working.set(id,value);}
          };}};
          return tx;
        }};req.onsuccess();
      });
      return req;
    }
  };
  return api;
}
test('Keeping a clip stamps its original recording date and expiry, with a count and byte budget',async()=>{
 const files=new Map(),db=database(files),clip={at:now-3600000,topic:'Biology',blob:new Blob(['practice'])};
 const saved=await store.keepForWeek('1',clip,now,db);
 assert.equal(saved.expiresAt,clip.at+A.WEEK);assert.deepEqual(files.get('1'),saved);
 await store.keepForWeek('2',clip,now,db);await store.keepForWeek('3',clip,now,db);
 await assert.rejects(store.keepForWeek('4',clip,now,db),e=>e.code==='limit');assert.equal(files.size,3);
 await assert.rejects(store.keepForWeek('2',{...clip,blob:new Blob([new Uint8Array(A.MAX_BYTES)])},now,db),e=>e.code==='limit');
 assert.equal(files.get('2').blob.size,clip.blob.size);
});
test('Expired retained clips are removed in the same write transaction; legacy files remain untouched',async()=>{
 const legacy=new Blob(['legacy']);const old={topic:'old',at:now-2*A.WEEK,blob:legacy};const files=new Map([['legacy blob',legacy],['legacy object',old]]);
 const db=database(files);
 await store.keepForWeek('timed',{blob:new Blob(['new']),at:now},now,db);
 await assert.rejects(store.keepForWeek('legacy object',{blob:new Blob(['replace']),at:now},now,db),e=>e.code==='legacy');
 await store.purgeExpired(now+A.WEEK-1,db);assert.equal(files.size,3);
 await store.purgeExpired(now+A.WEEK,db);assert.deepEqual([...files],[['legacy blob',legacy],['legacy object',old]]);
 await assert.rejects(store.keepForWeek('expired',{blob:new Blob(['x']),at:now},now+A.WEEK,db),e=>e.code==='expired');
});
