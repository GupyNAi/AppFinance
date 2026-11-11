(function(root){
const CATS={obl:'Obligaciones y necesidades',ali:'Alimentación y transporte',dia:'Gastos diarios',gus:'Gustos y antojos',hab:'Cigarrillos y hábitos',metas:'Metas de ahorro',emer:'Fondo de emergencia',inv:'Inversiones'};
const SPEND=['obl','ali','dia','gus','hab'];
const DEF=()=>({initial:0,pct:{obl:30,ali:20,dia:10,gus:8,hab:5,metas:12,emer:8,inv:7},prio:['obl','ali','dia','metas','emer','gus','hab','inv'],lim:{gus:[0,0],hab:[0,0]},emerTarget:0,theme:'auto',bills:[],tx:[],goals:[],lastBackup:0});
const mkey=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const sum=a=>a.reduce((x,t)=>x+t.amt,0);
function alloc(inc,pct,prio,floorObl){let rem=inc;const a={};for(const c of prio){const raw=Math.floor(inc*(pct[c]||0)/100);const want=c==='obl'?Math.max(raw,floorObl):raw;a[c]=Math.max(0,Math.min(rem,want));rem-=a[c];}a.libre=rem;return a;}
function summary(s,now){
 const ym=mkey(now),d=new Date(now),M=s.tx.filter(t=>mkey(t.ts)===ym);
 const by=(arr,ty)=>arr.filter(t=>t.type===ty);
 const income=sum(by(M,'in')),spent=sum(by(M,'out'));
 const real=s.initial+sum(by(s.tx,'in'))-sum(by(s.tx,'out'));
 const billsTotal=s.bills.reduce((x,b)=>x+b.amt,0);
 const a=alloc(income,s.pct,s.prio,billsTotal);
 const used={};for(const c of SPEND)used[c]=sum(by(M,'out').filter(t=>t.cat===c));
 const saveM=by(M,'save');
 used.metas=sum(saveM.filter(t=>t.goal!=='emer'));used.emer=sum(saveM.filter(t=>t.goal==='emer'));used.inv=sum(by(M,'inv'));
 const env={};for(const c in CATS)env[c]=a[c]-used[c];
 const emerSaved=sum(by(s.tx,'save').filter(t=>t.goal==='emer'));
 const goalsSaved=sum(by(s.tx,'save').filter(t=>t.goal!=='emer'));
 const invested=sum(by(s.tx,'inv'));
 const oblPending=Math.max(0,env.obl);
 const reserved=oblPending+Math.max(0,env.metas)+Math.max(0,env.emer)+Math.max(0,env.inv)+emerSaved+goalsSaved+invested;
 const avail=Math.max(0,real-reserved);
 const dim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(),daysLeft=dim-d.getDate()+1;
 const today=M.filter(t=>t.type==='out'&&new Date(t.ts).getDate()===d.getDate());
 const spentToday=sum(today);
 const dailyBase=Math.floor((avail+spentToday)/daysLeft);
 const emerOk=emerSaved>=s.emerTarget;
 return {income,spent,real,alloc:a,used,env,emerSaved,goalsSaved,invested,reserved,avail,daysLeft,spentToday,dailyBase,leftToday:dailyBase-spentToday,oblPending,billsTotal,
  investable:emerOk?Math.max(0,env.inv):0,emerOk,saveRate:income?Math.round(100*(goalsSaved+emerSaved+invested)/income):0};
}
function canReserve(s,amt,excludeId){const t=s.tx.filter(x=>x.id!==excludeId);const real=s.initial+sum(t.filter(x=>x.type==='in'))-sum(t.filter(x=>x.type==='out'));return amt<=real-sum(t.filter(x=>x.type==='save'||x.type==='inv'));}
function goalNeed(g,saved,now){const rem=Math.max(0,g.target-saved),days=Math.max(1,Math.ceil((new Date(g.deadline+'T23:59:59')-now)/864e5));const day=Math.ceil(rem/days);return {rem,days,day,week:Math.ceil(rem/(days/7)),month:Math.ceil(rem/(days/30.44))};}
function csv(s){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return ['fecha,tipo,monto,categoria_o_meta,descripcion'].concat(s.tx.slice().sort((a,b)=>a.ts-b.ts).map(t=>[new Date(t.ts).toISOString(),t.type,t.amt,t.cat||t.goal||'',t.desc||''].map(q).join(','))).join('\n');}
const API={CATS,SPEND,DEF,mkey,alloc,summary,canReserve,goalNeed,csv,sum};
if(typeof module!=='undefined')module.exports=API;else root.Core=API;
})(this);
