(function(root){
  'use strict';
  const E=root.KadaEngine||(typeof require==='function'?require('./engine.js'):null);
  const chapters=[
    {name:'面包街',en:'BAKERY LANE',color:'#e7ab66',icon:'bakery',intro:'清晨，面包街没有飘来熟悉的香味。烤炉停了，小路也散开了。豆豆从工具箱里探出头：“我们从第一块小路开始吧！”',ending:'最后一颗齿轮咔哒归位，烤炉亮起暖光。面包师递来一封信：河边的水车也停了。豆豆把热面包装进背包，准备出发。',mission:'让面包街重新飘起香气。'},
    {name:'河边公园',en:'RIVERSIDE PARK',color:'#78b9b6',icon:'park',intro:'面包师的信把你们带到河边。园丁阿芽正在等水浇花，两岸的小桥却接连失灵。每一座桥，都有属于它的按钮。',ending:'两岸的小桥一座接一座展开，水车又唱起歌。漂来的邮袋里，装着一封从未送到的邀请函：请到邮局街找小邮差。',mission:'接通小桥，让花园喝到水。'},
    {name:'邮局街',en:'POST OFFICE',color:'#c4a0bc',icon:'post',intro:'小邮差米米的邮袋挂满钥匙。风把信件吹进了锁着的院子。先找到对应的钥匙，再穿过门，把迟到的问候送回家。',ending:'最后一封信终于送到。信里是一张风车节的邀请函，可农场的风车已经很久没有转动。米米指向山坡：“它们在等我们呢。”',mission:'找到钥匙，把问候送到家。'},
    {name:'风车农场',en:'WINDMILL FARM',color:'#a7b576',icon:'mill',intro:'山坡上的麦子熟了，风车却停着。农场的运粮小路只能顺着箭头走。豆豆展开地图：“这次，我们要先把每一步想清楚。”',ending:'风车转动，麦粒变成细细的面粉。一阵风送来钟楼管理员的纸飞机：大钟还停在冬天，小镇需要最后一次修理。',mission:'沿着箭头，让风车重新转动。'},
    {name:'钟楼广场',en:'CLOCKTOWER SQUARE',color:'#8ca6c4',icon:'clock',intro:'钟楼下面藏着发光的传送环。跨过入口，就能到达远处的出口。把一路学会的机关连起来，让小镇的时间再次向前。',ending:'咔哒——大钟终于响了。面包师、园丁、米米和农场主都来到广场。豆豆把最后一块小路放进工具箱：“原来，一点点改变，就能让整座小镇重新动起来。”',mission:'修复大钟，点亮整座小镇。'}
  ];
  const titles=[
    ['第一次出发','拐个弯','补上缺口','零件不用全用完','桥为什么不开','先绕一下','近路的秘密','找回齿轮','不能直接回家','按钮、桥和齿轮','零件刚刚好','面包街大维修'],
    ['河边的来信','第一座花桥','水车的开关','两岸的约定','蓝桥与橙桥','先去对岸看看','睡莲池旁','给喷泉一颗齿轮','穿过小小湿地','两条河的回声','园丁的最后一桶水','公园重新开花'],
    ['迟到的邀请函','钥匙在花坛里','第一扇小门','邮差的绕行路线','两把不同的钥匙','门后的问候','跨桥送信','请先打开院门','挂钟下的包裹','信箱连成一条线','最后一封信','邮局亮灯了'],
    ['去山坡的路','顺着风的方向','运粮小径','箭头的约定','不能回头的弯道','风车需要两颗齿轮','麦田里的小桥','钥匙跟着风走','磨坊前的选择','风车联动','收获前的准备','风车节开始了'],
    ['钟楼的纸飞机','第一次穿过光环','出口在另一边','隔空的问候','钟摆的钥匙','双桥与传送环','穿过旧时光','星星齿轮','通往塔顶的路','最后的机关链','小镇的约定','让时间重新出发']
  ];
  const moments=[
    ['面包师正等着第一袋面粉。','豆豆发现，小路还可以转弯。','旧路还在，只缺你手里这一块。','工具箱很大，但不必全部用上。','桥边的按钮，藏着一个小秘密。','先绕一下，才能走得更远。','看起来近的路，也要亲自验证。','烤炉的小齿轮滚到了街角。','到家之前，记得带上小齿轮。','把几件小事，排成正确的顺序。','用刚刚好的零件，接好这条路。','面包街的最后一盏灯，等你点亮。'],
    ['阿芽在桥头向你招手。','花盆里的嫩芽有点口渴。','水车的齿轮需要重新咬合。','桥上的编号，和按钮一一对应。','两个按钮，分别照顾一座桥。','绕过水池，风景也很好。','睡莲开花前，先把桥修好。','喷泉少了一颗会唱歌的齿轮。','湿地小径弯弯曲曲，慢慢看。','记住谁先打开，谁才能通过。','阿芽已经备好了新的花种。','让水车、喷泉和花园一起醒来。'],
    ['米米把邮袋交到豆豆手里。','每把钥匙，都有自己的门。','先找钥匙，再试试小门。','送信的路，偶尔需要绕一绕。','认准编号，钥匙不会开错门。','院子里，有人在等一声问候。','带着钥匙，走过会动的小桥。','门打开后，下一段路才开始。','别把包裹上的齿轮落下。','每一封信，都有它的目的地。','天黑以前，完成最后的托付。','信箱响了，整条街都亮了。'],
    ['风吹过麦田，豆豆挥了挥手。','单向小路，跟着箭头前进。','粮车走过的路，有固定方向。','把道路接好，也要看清箭头。','弯道之后，仍要顺着风走。','少一颗齿轮，风车都转不起来。','麦田的小桥也需要按钮唤醒。','在门前，检查钥匙有没有带好。','先观察所有机关，再出发。','一座风车，牵动整片麦田。','再检查一次这条送粮路线。','风车节的旗帜，终于飘起来了。'],
    ['管理员在钟楼前留下了纸飞机。','踏进入口，就会来到远处出口。','找找同一编号的两个光环。','光环之间，不需要再铺小路。','即使会传送，也别忘了钥匙。','先开桥，再穿过光环。','豆豆听见，齿轮正在轻轻作响。','带上星星齿轮，去唤醒钟摆。','塔顶的灯，已经近在眼前。','让每个机关都在正确时刻醒来。','大家在广场上，等最后一声钟响。','这一次，把一路的发现连起来。']
  ];
  const levels=[];
  function line(points){let out=[E.cell(...points[0])];for(let j=1;j<points.length;j++){let [x,y]=E.xy(out.at(-1));const [tx,ty]=points[j];if(x!==tx&&y!==ty)throw Error('Diagonal waypoint');while(x!==tx||y!==ty){x+=Math.sign(tx-x);y+=Math.sign(ty-y);out.push(E.cell(x,y));}}return out;}
  function make(id,size,path,options={}){
    const chapter=Math.floor((id-1)/12),within=(id-1)%12;
    const level={id,chapter,size,name:titles[chapter][within],story:moments[chapter][within],start:path[0],goal:path.at(-1),startDirection:E.direction(path[0],path[1]),placeable:[],fixed:{},mechanisms:options.mechanisms||[],requiredItems:[],inventory:{straight:0,curve:0},solution:{},path,par:0};
    for(let i=1;i<path.length-1;i++){
      const at=path[i],entrance=level.mechanisms.find(m=>m.type==='portal'&&m.cell===at&&m.target),exit=level.mechanisms.find(m=>m.type==='portal'&&m.target===at);
      const incoming=exit?(exit.exitDirection+2)%4:E.direction(at,path[i-1]);
      const outgoing=entrance?(incoming+2)%4:E.direction(at,path[i+1]);
      const road=E.roadFor(incoming,outgoing);
      if((options.fixed||[]).includes(at)||level.mechanisms.some(m=>m.cell===at&&['bridge','portal','door'].includes(m.type))){level.fixed[at]=road;}else{level.solution[at]=road;level.inventory[road.type]++;level.placeable.push(at);}
    }
    for(const at of options.decoys||[]){if(at!==level.start&&at!==level.goal&&!level.placeable.includes(at)&&!level.fixed[at])level.placeable.push(at);}
    level.inventory.straight+=options.extra?.straight||0;level.inventory.curve+=options.extra?.curve||0;
    level.par=Object.keys(level.solution).length;
    level.requiredItems=level.mechanisms.filter(m=>m.type==='cog').map(m=>m.id);
    level.requiredButtons=level.mechanisms.filter(m=>m.type==='bridge').map(m=>m.requires);
    level.requiredCheckpoints=level.mechanisms.filter(m=>['bridge','door','arrow','portal'].includes(m.type)).map(m=>m.cell);
    levels.push(level);return level;
  }
  const button=(cell,id='b1')=>({type:'button',cell,id});
  const bridge=(cell,requires='b1')=>({type:'bridge',cell,requires,id:'h'+requires.slice(1)});
  const cog=(cell,id='c1')=>({type:'cog',cell,id});
  const key=(cell,id='k1')=>({type:'key',cell,id});
  const door=(cell,requires='k1')=>({type:'door',cell,requires,id:'d'+requires.slice(1)});
  make(1,5,'A3 B3 C3 D3 E3'.split(' '));
  make(2,5,'A4 B4 C4 D4 D3 D2 E2'.split(' '));
  make(3,5,'A4 B4 C4 C3 C2 D2 E2'.split(' '),{fixed:['B4','C3','C2','D2']});
  make(4,5,'A4 B4 B3 B2 C2 D2'.split(' '),{extra:{straight:2,curve:1},decoys:['C4','D4','C3']});
  make(5,5,'A3 B3 B2 C2 D2 D3 E3'.split(' '),{mechanisms:[button('B2'),bridge('D3')],decoys:['B4','C4','D4'],extra:{straight:1,curve:1}});
  make(6,5,'A3 B3 B2 B1 C1 D1 D2 D3 E3'.split(' '),{mechanisms:[button('B1'),bridge('D2')],decoys:['C3','B4','C4','D4']});
  make(7,5,'A3 B3 B2 B1 C1 D1 D2 D3 E3'.split(' '),{mechanisms:[button('B1'),bridge('D2')],fixed:['D3'],decoys:['C3','B4','C4','D4']});
  make(8,5,'A3 B3 C3 C2 C1 D1 D2 E2 E3'.split(' '),{mechanisms:[cog('C1')],decoys:['C4','D4','E4']});
  make(9,5,'A3 B3 B2 C2 C1 D1 D2 D3 E3'.split(' '),{mechanisms:[cog('C1')],decoys:['B4','C4','D4']});
  make(10,6,'A3 B3 B2 B1 C1 D1 D2 D3 E3 E2 F2 F3'.split(' '),{mechanisms:[button('B1'),bridge('D3'),cog('E2')],decoys:['B4','B5','C5','D5','D4','E4']});
  make(11,6,'A3 B3 B4 C4 D4 D3 D2 C2 C1 D1 E1 E2 E3 F3'.split(' '),{mechanisms:[button('C1'),cog('C4'),bridge('E3')],decoys:['B2','B5','C5','D5','E4']});
  make(12,6,'A3 B3 B2 B1 C1 D1 E1 E2 D2 D3 E3 F3'.split(' '),{mechanisms:[button('B1'),bridge('D3'),cog('D2')],decoys:['B4','B5','C5','D5','D4','E5'],extra:{straight:1,curve:1}});
  function template(n,k){
    const hi=n-2,last=n-1;
    const patterns=[
      [[0,hi],[1,hi],[1,1],[hi,1],[hi,hi],[last,hi]],
      [[0,1],[2,1],[2,hi],[hi,hi],[hi,0],[last,0]],
      [[0,hi],[1,hi],[1,2],[3,2],[3,hi],[hi,hi],[hi,0],[last,0]],
      [[0,1],[1,1],[1,hi],[3,hi],[3,2],[hi,2],[hi,last],[last,last]],
      [[0,hi],[2,hi],[2,1],[hi,1],[hi,hi],[3,hi],[3,last],[last,last]],
      [[0,1],[1,1],[1,hi],[hi,hi],[hi,2],[3,2],[3,0],[last,0]]
    ];
    let p=line(patterns[k%6]);
    return p.map(at=>{let [x,y]=E.xy(at);if(k%2)y=last-y;if(k>=6)[x,y]=[y,x];return E.cell(x,y);});
  }
  for(let id=13;id<=60;id++){
    const ch=Math.floor((id-1)/12),k=(id-1)%12,n=ch===1?6:ch===4?8:7;
    let p=template(n,k),ms=[];
    // Mechanisms are placed in route order. Additional buildable cells create alternatives.
    if(ch===4){const entry=5,exit=9;const target=p[exit];const exitDirection=E.direction(target,p[exit+1]);ms.push({type:'portal',id:'p1',cell:p[entry],target,exitDirection},{type:'portal',id:'p1',cell:target,exit:true});p=[...p.slice(0,entry+1),...p.slice(exit)];}
    const end=p.length-2,used=new Set(ms.map(m=>m.cell));
    function free(fraction){let index=Math.max(1,Math.min(end,Math.round(end*fraction)));while(index<=end&&used.has(p[index]))index++;if(index>end){index=1;while(used.has(p[index]))index++;}used.add(p[index]);return p[index];}
    if(ch===1){ms.push(button(free(.17)),bridge(free(.45)));if(k>=3)ms.push(button(free(.56),'b2'),bridge(free(.86),'b2'));if(k>=7)ms.push(cog(free(.70)));}
    if(ch===2){ms.push(key(free(.18)),door(free(.48)));if(k>=4)ms.push(key(free(.55),'k2'),door(free(.86),'k2'));if(k>=6)ms.push(button(free(.08)),bridge(free(.70)));if(k>=8)ms.push(cog(free(.78)));}
    if(ch===3){ms.push(cog(free(.60)));if(k>=5)ms.push(cog(free(.82),'c2'));if(k>=3)ms.push(button(free(.12)),bridge(free(.42)));if(k>=7)ms.push(key(free(.25)),door(free(.72)));for(const f of (k<3?[.35]:[.32,.9])){const at=free(f);ms.push({type:'arrow',cell:at,direction:E.direction(p[p.indexOf(at)-1],at)});}}
    if(ch===4){ms.push(cog(free(.8)));if(k>=2)ms.push(button(free(.08)),bridge(free(.7)));if(k>=4)ms.push(key(free(.16)),door(free(.9)));if(k>=5)ms.push(button(free(.25),'b2'),bridge(free(.76),'b2'));if(k>=7)ms.push(cog(free(.6),'c2'));if(k>=8){const at=free(.4);ms.push({type:'arrow',cell:at,direction:E.direction(p[p.indexOf(at)-1],at)});}}
    const decoys=[];for(let y=0;y<n;y++)for(let x=0;x<n;x++){const at=E.cell(x,y);if(!p.includes(at)&&((x+y+id)%4!==0))decoys.push(at);}
    make(id,n,p,{mechanisms:ms,decoys,extra:k<3?{straight:2,curve:1}:k<9?{straight:1,curve:1}:{}});
  }
  const api={chapters,levels};if(typeof module!=='undefined')module.exports=api;root.KadaData=api;
})(typeof globalThis!=='undefined'?globalThis:this);
