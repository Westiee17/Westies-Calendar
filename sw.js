try{importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js")}catch(e){}
const C="we-calendar-v5";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r})
    .catch(()=>caches.match(e.request).then(m=>m||(e.request.mode==="navigate"?caches.match("./"):undefined))));
});
self.addEventListener("periodicsync",e=>{if(e.tag==="we-check")e.waitUntil(Promise.all([check(),checkSheets()]))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(l=>l.length?l[0].focus():self.clients.openWindow("./")))});
const ver=t=>((t.match(/const VER="(\w+)"/)||[])[1]);
async function check(){
  try{
    const c=await caches.open(C);
    const r=await fetch("./index.html",{cache:"no-store"});
    if(!r.ok)return;
    const nv=ver(await r.clone().text());
    const old=(await c.match("./"))||(await c.match("./index.html"));
    const ov=old?ver(await old.text()):null;
    if(nv&&nv!==ov){
      await c.put("./index.html",r.clone());await c.put("./",r);
      await self.registration.showNotification("WE Calendar 💙",{body:"New moments were added. Open the app to see what's new.",icon:"icon-192.png",badge:"icon-192.png",tag:"we-update"});
    }
  }catch(err){}
}
try{importScripts("engine.js")}catch(e){}
const SH={y25:"1oTQrgXB5KeheJNQMmnFe9QRgKF-HXZ9EhJtMexMlJgE",y26:"1_T949f5mqfcmhXfojxC58Py-tQy2a_PKMbEWQ3w2FBw",tp:"1VQnNRNmOEHDyaEV_rhLUwYn92R9WGmP85mnYGkhbrqk",mq:"1vOhs8LpiOOfYt5MNRCa9WK7SKFLK0ptmQU3KK8hCGLU",ms:"1Kiep-2cuBPkYdcC33Z4VW0utwQa4QSDOB7_Kwito8Qo"};
async function checkSheets(){try{
 if(typeof buildAll!=="function")return;
 const rows={};
 for(const k of Object.keys(SH)){const r=await fetch("https://docs.google.com/spreadsheets/d/"+SH[k]+"/gviz/tq?tqx=out:csv",{cache:"no-store"});if(!r.ok)return;rows[k]=parseCSV(await r.text())}
 const keys=buildAll(rows).map(e=>e[0]+"|"+e[1]+"|"+e[2].length);
 const c=await caches.open("we-data"),m=await c.match("keys");if(!m)return;
 const old=new Set(await m.json()),add=keys.filter(k=>!old.has(k));if(!add.length)return;
 await c.put("keys",new Response(JSON.stringify([...new Set([...old,...keys])])));
 await self.registration.showNotification("WE Calendar 💙",{body:add.length+" new or updated moment"+(add.length>1?"s":"")+" added. Open the app to see.",icon:"icon-192.png",badge:"icon-192.png",tag:"we-update"});
}catch(err){}}
