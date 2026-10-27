// Remove the one-time invitation from the address before the app loads.
(()=>{const m=location.hash.match(/^#pair=([A-Za-z0-9_-]{43})$/);if(!m)return;try{sessionStorage.setItem('study-pocket:invitation',m[1]);history.replaceState(null,'',location.pathname+location.search);}catch{history.replaceState(null,'',location.pathname+location.search);}})();
