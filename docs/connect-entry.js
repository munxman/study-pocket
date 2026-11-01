// Capture a setup fragment both on page load and when a new link reuses an open tab.
(()=>{
 function capture(){const m=location.hash.match(/^#pair=([A-Za-z0-9_-]{43})$/);if(!m)return false;try{sessionStorage.setItem('study-pocket:invitation',m[1]);history.replaceState(null,'',location.pathname+location.search);return true;}catch{history.replaceState(null,'',location.pathname+location.search);return false;}}
 capture();
 window.addEventListener('hashchange',async()=>{if(!capture())return;await window.BackupStore?.flush();if(window.BackupStore&&!window.BackupStore.isSaved()&&Object.keys(window.BackupStore.snapshot().modules).length)return;location.reload();});
})();
