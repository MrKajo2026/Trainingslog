// Trainingslog Service Worker: App sofort aus dem Cache öffnen, im Hintergrund aktualisieren
const C="tl-app";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add("./").catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin!==location.origin||u.pathname.endsWith("version.json")||u.searchParams.has("nocache"))return;   // Versionsprüfung immer live
  if(r.mode==="navigate"){
    if(u.searchParams.has("v")){   // Update-Neuladen: immer frisch vom Server
      e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put("./",cl))}return res}).catch(()=>caches.match("./")));return}
    e.respondWith(caches.open(C).then(async c=>{const hit=await c.match("./");
      const net=fetch(r,{cache:"no-store"}).then(res=>{if(res.ok)c.put("./",res.clone());return res}).catch(()=>hit);
      return hit||net}));
  }
});
