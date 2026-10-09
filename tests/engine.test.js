'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/engine.js');
const {levels,chapters}=require('../src/levels.js');
const clone=x=>JSON.parse(JSON.stringify(x));
test('60 unique levels in five complete chapters',()=>{
  assert.equal(levels.length,60);assert.equal(chapters.length,5);
  assert.equal(new Set(levels.map(l=>l.name)).size,60);
  for(let i=0;i<5;i++)assert.equal(levels.filter(l=>l.chapter===i).length,12);
});
for(const level of levels)test(`关卡 ${level.id} ${level.name}：解法、资源、机关依赖`,()=>{
  assert.equal(new Set(level.path).size,level.path.length,'Canonical path cannot revisit a road');
  for(const at of [...level.placeable,...Object.keys(level.fixed)]){const [x,y]=E.xy(at);assert.ok(x>=0&&y>=0&&x<level.size&&y<level.size);}
  assert.ok(Object.keys(level.solution).every(at=>level.placeable.includes(at)));
  assert.ok(Object.keys(level.fixed).every(at=>!level.placeable.includes(at)));
  const remaining=E.remaining(level,level.solution);assert.ok(remaining.straight>=0&&remaining.curve>=0);
  const frozen=JSON.stringify(level);const result=E.simulate(level,level.solution);
  assert.equal(result.status,'success',JSON.stringify(result));
  assert.equal(result.state.at,level.goal);
  for(const id of level.requiredItems)assert.ok(result.state.items.includes(id));
  for(const at of level.requiredCheckpoints)assert.ok(result.state.passed.includes(at));
  for(const m of level.mechanisms){
    if(m.type==='bridge')assert.ok(result.state.buttons.includes(m.requires));
    if(m.type==='door')assert.ok(result.state.items.includes(m.requires));
  }
  assert.equal(JSON.stringify(level),frozen,'Simulation must not change level data');
  assert.equal(E.score(level,level.solution,1),3);
  assert.equal(E.simulate(level,{}).status,'failed','An empty layout must not finish');
});
test('Road rotation handles all straight and curved connections',()=>{for(let a=0;a<4;a++)for(let b=0;b<4;b++)if(a!==b)assert.deepEqual(E.ports(E.roadFor(a,b)).sort(),[a,b].sort());});
test('A missing road gives its exact cell, and wrong orientation is distinguished',()=>{
  const level=levels[0],roads=clone(level.solution);delete roads.C3;
  assert.equal(E.simulate(level,roads).reason,'gap');assert.equal(E.simulate(level,roads).at,'C3');
  roads.C3={type:'straight',rotation:1};assert.equal(E.simulate(level,roads).reason,'direction');
});
test('A closed bridge rejects crossing; a button opens it only for the current run',()=>{
  const level=clone(levels[4]);level.mechanisms=level.mechanisms.filter(m=>m.type!=='button');
  const result=E.simulate(level,level.solution);assert.equal(result.reason,'bridge');assert.equal(result.at,'D3');
  const success=E.simulate(levels[4],levels[4].solution);assert.ok(success.state.buttons.includes('b1'));
  assert.deepEqual(E.initialState(levels[4]).buttons,[]);
});
test('Arriving without the required gear fails even with connected roads',()=>{
  const level=clone(levels[7]);level.mechanisms=[];
  assert.equal(E.simulate(level,level.solution).reason,'item');
});
test('Shortcuts cannot silently bypass required mechanisms',()=>{
  const level=levels[5],shortcut={B3:{type:'straight',rotation:0},C3:{type:'straight',rotation:0},D3:{type:'straight',rotation:0}};
  const result=E.simulate(level,shortcut);assert.equal(result.reason,'checkpoint');assert.ok(result.detail.includes('D2'));
});
test('Matching keys are required before doors',()=>{
  const level=clone(levels[28]);const missing=level.mechanisms.find(m=>m.type==='key');
  level.mechanisms=level.mechanisms.filter(m=>m!==missing);
  const result=E.simulate(level,level.solution);assert.equal(result.reason,'door');assert.equal(result.detail,missing.id);
});
test('Reverse direction on a one-way road is rejected',()=>{
  const level=clone(levels[36]);const arrow=level.mechanisms.find(m=>m.type==='arrow');arrow.direction=(arrow.direction+2)%4;
  assert.equal(E.simulate(level,level.solution).reason,'arrow');
});
test('Portal jumps to paired exit and preserves declared exit direction',()=>{
  const level=levels[59],result=E.simulate(level,level.solution),portal=level.mechanisms.find(m=>m.target);
  const exit=result.trace.find(r=>r.state.teleported);assert.ok(exit);assert.equal(exit.state.at,portal.target);assert.equal(result.status,'success');
});
test('Looping roads stop with an actionable reason',()=>{
  const level={size:4,start:'A1',startDirection:1,goal:'D4',fixed:{},mechanisms:[],requiredItems:[]};
  const roads={B1:E.roadFor(3,2),B2:E.roadFor(0,3),A2:E.roadFor(1,0),A1:E.roadFor(2,1)};
  assert.equal(E.simulate(level,roads).reason,'loop');
});
test('Repeated attempts affect bonus only; first seven levels are welcoming',()=>{assert.equal(E.score(levels[0],levels[0].solution,4),3);assert.equal(E.score(levels[7],levels[7].solution,4),2);});
test('Corrupt saves are sanitized and cannot inject impossible unlock values',()=>{
  assert.equal(E.cleanSave(null).current,1);
  const save=E.cleanSave({stars:{1:3,2:1,3:99,4:'3'},current:999,unlocked:999});
  assert.deepEqual(save.stars,{1:3,2:1});assert.equal(save.unlocked,3);assert.equal(save.current,3);
  assert.equal(E.cleanSave({stars:Object.fromEntries(levels.map(l=>[l.id,3])),current:60}).unlocked,60);
});
