(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.IELTSAudioStorage=factory();})(typeof window!=='undefined'?window:this,()=>{
 'use strict';
 function extension(type=''){return type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';}
 function record(id,blob,indexedDB=globalThis.indexedDB){return new Promise((resolve,reject)=>{
  let db,settled=false,result,requestError;
  const finish=(error)=>{if(settled)return;settled=true;db?.close();if(error)reject(error);else resolve(result);};
  try{
   const opening=indexedDB.open('study-english-audio-v1',1);
   opening.onupgradeneeded=()=>{const d=opening.result;if(!d.objectStoreNames.contains('recordings'))d.createObjectStore('recordings');};
   opening.onerror=()=>finish(opening.error||Error('Recording storage could not open'));
   opening.onblocked=()=>finish(Error('Recording storage is busy in another tab'));
   opening.onsuccess=()=>{
    db=opening.result;if(settled){db.close();return;}db.onversionchange=()=>db.close();
    try{
     const tx=db.transaction('recordings',blob?'readwrite':'readonly');
     tx.oncomplete=()=>finish();
     tx.onabort=()=>finish(tx.error||requestError||Error('Recording storage was interrupted'));
     tx.onerror=()=>finish(tx.error||requestError||Error('Recording storage failed'));
     const store=tx.objectStore('recordings'),request=blob?store.put(blob,id):store.get(id);
     // A request can succeed and its transaction still fail afterwards. Only
     // transaction completion may tell the learner that the recording is saved.
     request.onsuccess=()=>{result=request.result;};
     request.onerror=()=>{requestError=request.error;};
    }catch(error){finish(error);}
   };
  }catch(error){finish(error);}
 });}
 return {record,extension};
});
