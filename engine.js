function parseCSV(t){const R=[];let r=[],f="",q=false;t=t.replace(/^\uFEFF/,"");
 for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;else if(c===","){r.push(f);f=""}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&t[i+1]==="\n")i++;r.push(f);f="";R.push(r);r=[]}
  else f+=c}
 if(f!==""||r.length){r.push(f);R.push(r)}return R.slice(1)}
const cl=s=>(s||"").replace(/\s+/g," ").trim().replace(/^"+|"+$/g,"").trim();
const cu=u=>(u||"").trim().replace(/\?si=[\w-]+/,"");
const isU=u=>/^https?:\/\//.test((u||"").trim());
function pd(s){s=(s||"").trim();let m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
 if(m)return m[3]+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0");
 m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[0];
 if(/^\d{5}$/.test(s)){return new Date(Date.UTC(1899,11,30)+(+s)*864e5).toISOString().slice(0,10)}
 return null}
function y25(rows){const o=[];let prev=null;
 for(const r of rows){let d=pd(r[1]);const t=cl(r[2]),l=(r[3]||"").trim();if(!d||!t)continue;
  if(prev&&d<prev){const nd=d.slice(0,5)+prev.slice(5,7)+d.slice(7);if(nd>=prev)d=nd}
  prev=d;o.push([d,t,isU(l)?[["",cu(l)]]:[]])}return o}
function y26(rows){const ev=[];let cur=null,date=null;
 for(const r of rows){const dc=(r[1]||"").trim(),title=cl(r[2]),link=(r[3]||"").trim(),label=cl(r[4]);
  const dated=dc!=="";if(dated){const p=pd(dc);if(p)date=p}
  if(!date||!(title||link))continue;
  const ll=isU(link)?[label,cu(link)]:null;
  if(dated&&title){if(cur&&cur[0]===date&&cur[1]===title){if(ll)cur[2].push(ll)}else{cur=[date,title,ll?[ll]:[]];ev.push(cur)}}
  else if(dated){if(cur&&ll)cur[2].push(ll)}
  else if(title&&title.includes("#")&&!(cur&&cur[1]===title&&cur[0]===date)){cur=[date,title,ll?[ll]:[]];ev.push(cur)}
  else if(cur){if(title&&title!==cur[1]){if(ll)cur[2].push([ll[0]?title+" - "+ll[0]:title,ll[1]])}else if(ll)cur[2].push(ll)}}
 return ev}
function series(rows,name){const o=[];let cur=null;
 for(const r of rows){const d=(r[0]||"").trim(),ep=cl(r[1]),h=cl(r[2]).replace("#.","#"),l=(r[3]||"").trim();
  if(d){const p=pd(d);if(!p){cur=null;continue}const tg=h.match(/#\S+/);
   cur={d:p,t:h.startsWith("#")?(name+" "+ep+" "+h).trim():h,tag:tg?tg[0]:null,links:[]};o.push(cur);
   if(isU(l))cur.links.push(["📸 Stills",cu(l)])}
  else if(cur&&isU(l))cur.links.push([h||"Link",cu(l)])}return o}
function qs(rows){const o=[];
 for(const r of rows){const d=pd(r[0]),q=cl(r[1]),h=cl(r[2]),l=(r[3]||"").trim();if(!d||!isU(l))continue;
  let t;if(/^\d+$/.test(q))t=("You Maniac Q"+q+" "+h).trim();
  else if(h.startsWith("#"))t=("You Maniac "+q+" "+h).trim();
  else if(h.includes("#")){const m=q.match(/\((.*)\)/);t=h+(m?" ("+m[1]+")":"")}
  else t="You Maniac "+(h||q);
  o.push([d,t,[["",cu(l)]]])}return o}
const cmp=(a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0;
function buildAll(S){let D=[...y25(S.y25||[]),...y26(S.y26||[])].sort(cmp);
 const have=new Set(D.flatMap(e=>e[2].map(x=>x[1])));
 for(const e of qs(S.mq||[])){if(have.has(e[2][0][1]))continue;D.push(e)}
 D.sort(cmp);
 for(const n of [...series(S.tp||[],"ThamePo"),...series(S.ms||[],"You Maniac")]){
  const h=D.find(e=>e[0]===n.d&&n.tag&&e[1].includes(n.tag));
  if(h){const hv=new Set(h[2].map(x=>x[1]));n.links.forEach(x=>{if(!hv.has(x[1]))h[2].push(x)})}
  else D.push([n.d,n.t,n.links])}
 return D.sort(cmp)}
if(typeof module!=="undefined")module.exports={parseCSV,buildAll};
