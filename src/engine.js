(function (root) {
  'use strict';
  const V = [[0,-1],[1,0],[0,1],[-1,0]];
  const xy = cell => [cell.charCodeAt(0)-65, Number(cell.slice(1))-1];
  const cell = (x,y) => String.fromCharCode(65+x)+(y+1);
  function direction(a,b) { const [x,y]=xy(a),[u,v]=xy(b); return V.findIndex(([dx,dy])=>x+dx===u&&y+dy===v); }
  function ports(road) { if(!road)return []; const r=((road.rotation||0)%4+4)%4; return road.type==='straight' ? (r%2?[0,2]:[1,3]) : [r,(r+1)%4]; }
  function roadFor(incoming,outgoing) { if(incoming===outgoing||incoming<0||outgoing<0)throw new Error('Invalid road ports'); if((incoming+2)%4===outgoing)return {type:'straight',rotation:incoming%2===0?1:0}; for(let r=0;r<4;r++)if([r,(r+1)%4].includes(incoming)&&[r,(r+1)%4].includes(outgoing))return {type:'curve',rotation:r}; }
  function initialState(level) { return {at:level.start,dir:level.startDirection,buttons:[],items:[],passed:[],visited:[],steps:0,teleported:false}; }
  function advance(level,placed,previous) {
    const state=JSON.parse(JSON.stringify(previous));
    const fail=(reason,at,detail)=>({status:'failed',reason,at,detail,state});
    if(state.steps++>level.size*level.size*8)return fail('loop',state.at);
    let next;
    const portal=(level.mechanisms||[]).find(m=>m.type==='portal'&&m.cell===state.at&&m.target);
    if(portal){next=portal.target;state.dir=portal.exitDirection;state.teleported=true;} else {const [x,y]=xy(state.at),[dx,dy]=V[state.dir];next=cell(x+dx,y+dy);state.teleported=false;}
    const [nx,ny]=xy(next);
    if(nx<0||ny<0||nx>=level.size||ny>=level.size)return fail('edge',state.at);
    if(next===level.goal){const missing=(level.requiredItems||[]).filter(id=>!state.items.includes(id)); if(missing.length)return fail('item',next,missing);const checkpoints=(level.requiredCheckpoints||[]).filter(at=>!state.passed.includes(at));if(checkpoints.length)return fail('checkpoint',next,checkpoints); state.at=next;return {status:'success',state,events:[{type:'goal'}]};}
    const road=level.fixed[next]||placed[next];
    if(!road)return fail('gap',next);
    const connections=ports(road),entry=(state.dir+2)%4;
    if(!connections.includes(entry))return fail('direction',next);
    const events=[];
    for(const m of level.mechanisms.filter(m=>m.cell===next)){
      if(m.type==='bridge'&&!state.buttons.includes(m.requires))return fail('bridge',next,m.requires);
      if(m.type==='door'&&!state.items.includes(m.requires))return fail('door',next,m.requires);
      if(m.type==='arrow'&&state.dir!==m.direction)return fail('arrow',next,m.direction);
      if(m.type==='button'&&!state.buttons.includes(m.id)){state.buttons.push(m.id);events.push(m);}
      if((m.type==='cog'||m.type==='key')&&!state.items.includes(m.id)){state.items.push(m.id);events.push(m);}
    }
    if(!state.passed.includes(next))state.passed.push(next);
    state.at=next;state.dir=connections.find(d=>d!==entry);
    const signature=[state.at,state.dir,state.buttons.slice().sort().join(','),state.items.slice().sort().join(',')].join('|');
    if(state.visited.includes(signature))return fail('loop',next);
    state.visited.push(signature);
    return {status:'running',state,events};
  }
  function simulate(level,placed) { let state=initialState(level),trace=[];for(let i=0;i<2048;i++){const result=advance(level,placed,state);trace.push(result);if(result.status!=='running')return {...result,trace};state=result.state;}throw new Error('Simulation did not terminate'); }
  function remaining(level,placed){const count={...level.inventory};for(const road of Object.values(placed))count[road.type]--;return count;}
  function score(level,placed,attempts){return 1+(Object.keys(placed).length<=level.par?1:0)+(level.id<8||attempts===1?1:0);}
  function cleanSave(input,count=60){const source=input&&typeof input==='object'?input:{};const stars={};for(let id=1;id<=count;id++){const n=source.stars?.[id];if(Number.isInteger(n)&&n>=1&&n<=3)stars[id]=n;}let unlocked=1;while(unlocked<count&&stars[unlocked])unlocked++;return {version:1,stars,current:Math.min(unlocked,Math.max(1,Number.isInteger(source.current)?source.current:1)),unlocked,sound:source.sound===true};}
  const api={V,xy,cell,direction,ports,roadFor,initialState,advance,simulate,remaining,score,cleanSave};
  if(typeof module!=='undefined')module.exports=api;root.KadaEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
