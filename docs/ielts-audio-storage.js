(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IELTSAudioStorage=factory();})(typeof window!=='undefined'?window:this,()=>{
 'use strict';
 function extension(type=''){return type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';}
 const WEEK=7*86400000, MAX_CLIPS=3, MAX_BYTES=10*1024*1024;
 const isManaged=clip=>clip?.retention==='week-v1'&&Number.isFinite(clip.expiresAt);
 const expired=(clip,now)=>isManaged(clip)&&clip.expiresAt<=now;
 function refusal(code,message){return Object.assign(Error(message),{code});}
 function createRecordingStore(name){
  function run(mode,operation,indexedDB=globalThis.indexedDB){return new Promise((resolve,reject)=>{
   let db,settled=false,result,requestError;
   const finish=error=>{if(settled)return;settled=true;db?.close();if(error)reject(error);else resolve(result);};
   try{
    const opening=indexedDB.open(name,1);
    opening.onupgradeneeded=()=>{const d=opening.result;if(!d.objectStoreNames.contains('recordings'))d.createObjectStore('recordings');};
    opening.onerror=()=>finish(opening.error||Error('Recording storage could not open'));
    opening.onblocked=()=>finish(Error('Recording storage is busy in another tab'));
    opening.onsuccess=()=>{
     db=opening.result;if(settled){db.close();return;}db.onversionchange=()=>db.close();
     try{
      const tx=db.transaction('recordings',mode);
      tx.oncomplete=()=>finish();
      tx.onabort=()=>finish(requestError||tx.error||Error('Recording storage was interrupted'));
      tx.onerror=()=>finish(tx.error||requestError||Error('Recording storage failed'));
      const request=operation(tx.objectStore('recordings'),value=>{result=value;},error=>{
       requestError=error;tx.abort();
      });
      if(!request)return;
      // Successful requests can still be followed by a transaction abort.
      request.onsuccess=()=>{result=request.result;};
      request.onerror=()=>{requestError=request.error;};
     }catch(error){finish(error);}
    };
   }catch(error){finish(error);}
  });}
  // One read-write transaction covers expiry, quota checks, and the new write.
  // IndexedDB serialises this across tabs. Legacy records have no retention marker.
  function maintain(id,clip,now,db){
   return run('readwrite',(store,done,abort)=>{
    let count=0,bytes=0;
    const cursor=store.openCursor();
    cursor.onsuccess=()=>{
     const row=cursor.result;
     if(row){
      const value=row.value;
      if(expired(value,now))row.delete();
      else if(clip&&row.key===id){
       if(!isManaged(value)){abort(refusal('legacy','Existing recording requires manual removal'));return;}
      }else{
       count++;
       bytes+=Number((value?.blob||value)?.size)||0;
      }
      row.continue();
      return;
     }
     if(!clip){done();return;}
     if(count>=MAX_CLIPS||bytes+clip.blob.size>MAX_BYTES){abort(refusal('limit','Local recording limit reached'));return;}
     const at=Number.isFinite(clip.at)?Math.min(clip.at,now):now;
     if(at+WEEK<=now){abort(refusal('expired','Recording retention period elapsed'));return;}
     const retained={...clip,at,retention:'week-v1',expiresAt:at+WEEK};
     store.put(retained,id);done(retained);
    };
   },db);
  }
  return {
   keepForWeek:(id,clip,now=Date.now(),db)=>clip?.blob?.size>0?maintain(id,clip,now,db):Promise.reject(Error('Empty recording')),
   purgeExpired:(now=Date.now(),db)=>maintain(null,null,now,db),
   record:(id,value,db)=>value===undefined||value===null?run('readonly',s=>s.get(id),db).then(v=>expired(v,Date.now())?undefined:v):run('readwrite',s=>s.put(value,id),db),
   remove:(id,db)=>run('readwrite',s=>s.delete(id),db),
   keys:db=>run('readonly',s=>s.getAllKeys(),db)
  };
 }
 return {record:createRecordingStore('study-english-audio-v1').record,extension,createRecordingStore,WEEK,MAX_CLIPS,MAX_BYTES};
});
