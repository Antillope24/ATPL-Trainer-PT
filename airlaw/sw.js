const CACHE='airlaw-2026.11.11-1030';
const FILES=['./','index.html','three.min.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r);})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('airlaw-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const fresh=async req=>{const c=await caches.open(CACHE);const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),4000);
  try{const n=await fetch(req.url,{cache:'no-cache',signal:ctl.signal});clearTimeout(t);if(n.ok){c.put(req,n.clone());return n;}throw 0;}
  catch(_){clearTimeout(t);return (await c.match(req,{ignoreSearch:true}))||(await c.match('index.html'));}};
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){e.respondWith(fresh(e.request));return;}
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true})).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return n;})));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting();});
