const C=require('./core.js'),assert=require('assert');
const now=new Date(2026,10,11,12).getTime();let s=C.DEF(),id=0;
const add=(type,amt,o={})=>s.tx.push({id:++id,ts:now,type,amt,...o});
// mes sin ingresos
let r=C.summary(s,now);assert.equal(r.income,0);assert.equal(r.avail,0);
s.initial=100000;r=C.summary(s,now);assert.equal(r.avail,100000);assert.equal(r.dailyBase,Math.floor(100000/20));
// ingreso variable
add('in',200000);r=C.summary(s,now);assert.equal(r.real,300000);
const t=Object.values(r.alloc).reduce((a,b)=>a+b,0);assert.equal(t,200000);
// obligaciones tienen prioridad con poco ingreso
s.bills=[{id:1,name:'Arriendo',amt:150000}];r=C.summary(s,now);assert.equal(r.alloc.obl,150000);assert.ok(Object.values(r.alloc).every(v=>v>=0));
// transferencias no cambian saldo real
const real0=r.real;add('save',10000,{goal:'emer'});add('inv',5000);r=C.summary(s,now);assert.equal(r.real,real0);
// gasto reduce saldo; editar/eliminar recalcula
add('out',30000,{cat:'ali'});r=C.summary(s,now);assert.equal(r.real,real0-30000);
s.tx.pop();assert.equal(C.summary(s,now).real,real0);
// no reservar dinero inexistente
assert.equal(C.canReserve(s,10**9),false);assert.equal(C.canReserve(s,1000),true);
// gastar de más no da disponible negativo
add('out',500000,{cat:'dia'});r=C.summary(s,now);assert.ok(r.avail>=0);
// meta
const g=C.goalNeed({target:300000,deadline:'2026-12-11'},0,now);assert.ok(g.day>0&&g.week>=g.day);
console.log('OK',JSON.stringify(r.alloc));
