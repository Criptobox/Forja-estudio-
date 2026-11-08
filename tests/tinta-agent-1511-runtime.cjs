const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8');
const TintaAgentCore=require('../web/js/tinta-agent-core.js');
const start=source.indexOf('const agentRoleWords='),end=source.indexOf('function suggest(){',start);
if(start<0||end<0)throw Error('No se encontró el intérprete del agente');
const engine=source.slice(start,end);
const BY_ID={
 'h-search':{id:'h-search',role:'header',name:'Saludo + buscador',desc:'Cabecera minimalista',metadata:{subcategory:'minimalista'}},
 'nav-dark':{id:'nav-dark',role:'nav',name:'Barra inferior oscura',desc:'Navegación inferior'},
 'c-cards':{id:'c-cards',role:'cards',name:'Tarjetas destacadas',desc:'Tarjetas visuales'},
 'a-main':{id:'a-main',role:'actions',name:'Botón principal',desc:'Acción primaria'}
};
const palettes={oceano:{id:'oceano',name:'Océano'},bosque:{id:'bosque',name:'Bosque'},cafe:{id:'cafe',name:'Café tostado'},lavanda:{id:'lavanda',name:'Lavanda'},rosa:{id:'rosa',name:'Rosa'},atardecer:{id:'atardecer',name:'Atardecer'},grafito:{id:'grafito',name:'Grafito'},tinta:{id:'tinta',name:'Tinta'}};
const state={brief:'',selected:['h-search','nav-dark','c-cards'],choices:{header:null,nav:null},content:{},palette:null,composed:true};
const calls=[];
const ctx={TintaAgentCore,BY_ID,ROLES:{header:'Encabezado',nav:'Barra inferior',cards:'Tarjetas',actions:'Botones'},state,
 TintaPalettes:{get:id=>palettes[id]||null},idsFor:r=>state.selected.filter(id=>BY_ID[id].role===r),
 conflicts:()=>[],save:(...a)=>calls.push(['save',...a]),paintPalettes:()=>calls.push(['paint']),
 renderReview:()=>calls.push(['review']),renderPhone:()=>calls.push(['phone']),trackRecent:id=>calls.push(['recent',id]),
 contentModel:block=>({fields:[{label:'Título',value:'Título original'},{label:'Acción',value:'Continuar'}]}),
 $:()=>null,document:{createElement:()=>({className:'',append(){}})},esc:s=>String(s)
};
vm.createContext(ctx);vm.runInContext(engine,ctx);
const run=q=>vm.runInContext(`agentApplyInstruction(${JSON.stringify(q)})`,ctx);
ctx.agentNormalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const checks=[];
let r=run('Usa una paleta azul');checks.push(['aplica paleta azul',r.ok&&state.palette==='oceano']);
r=run('Añade un botón');checks.push(['añade componente de acción',r.ok&&state.selected.includes('a-main')]);
r=run('Quita la barra inferior');checks.push(['quita barra inferior',r.ok&&!state.selected.includes('nav-dark')]);
r=run('Cambia el título por Mi espacio');checks.push(['edita título conservando acentos del texto',r.ok&&state.content['h-search']?.[0]==='Mi espacio']);
r=run('Cambia el texto del botón a Continuar ahora');checks.push(['edita texto del botón con acento en la instrucción',r.ok&&state.content['a-main']?.[1]==='Continuar ahora']);
const before=state.selected.slice(),palette=state.palette;
r=run('Hazlo espectacular con magia');checks.push(['rechaza instrucción desconocida sin mutar',!r.ok&&JSON.stringify(before)===JSON.stringify(state.selected)&&palette===state.palette]);
for(const [name,ok] of checks)console.log((ok?'OK ':'FAIL ')+name);
if(checks.some(x=>!x[1]))process.exit(1);
console.log(checks.length+' pruebas funcionales de intérprete superadas.');
