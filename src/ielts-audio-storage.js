(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IELTSAudioStorage=factory();})(typeof window!=='undefined'?window:this,()=>{
 'use strict';
 function extension(type=''){return type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';}
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
      tx.onabort=()=>finish(tx.error||requestError||Error('Recording storage was interrupted'));
      tx.onerror=()=>finish(tx.error||requestError||Error('Recording storage failed'));
      const request=operation(tx.objectStore('recordings'));
      // Successful requests can still be followed by a transaction abort.
      request.onsuccess=()=>{result=request.result;};
      request.onerror=()=>{requestError=request.error;};
     }catch(error){finish(error);}
    };
   }catch(error){finish(error);}
  });}
  return {
   record:(id,value,db)=>value===undefined||value===null?run('readonly',s=>s.get(id),db):run('readwrite',s=>s.put(value,id),db),
   remove:(id,db)=>run('readwrite',s=>s.delete(id),db),
   keys:db=>run('readonly',s=>s.getAllKeys(),db)
  };
 }
 return {record:createRecordingStore('study-english-audio-v1').record,extension,createRecordingStore};
});
