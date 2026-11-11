'use strict';
// Studying opens first. The study page already offers nonblocking update controls.
(()=>{
 const target=new URL('./index.html',location.href);
 try{history.replaceState(null,'',location.pathname);}catch{}
 location.replace(target.href);
})();
