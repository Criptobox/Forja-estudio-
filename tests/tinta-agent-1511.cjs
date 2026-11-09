const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8'),sw=fs.readFileSync(path.join(root,'web/sw.js'),'utf8'),core=fs.readFileSync(path.join(root,'web/js/tinta-agent-core.js'),'utf8');
const checks=[
['panel de conversación dentro de revisión',/id="agentChatForm"/.test(html)&&/id="agentChatInput"/.test(html)],
['mensajes accesibles',/id="agentChatLog" role="log" aria-live="polite"/.test(html)],
['ejemplos rápidos de instrucciones',/data-agent-example="Usa una paleta azul"/.test(html)&&/data-agent-example="Añade un botón"/.test(html)],
['envío con botón y Enter',/agentChatForm.*addEventListener\('submit'/.test(js)&&/agentChatInput.*addEventListener\('keydown'/.test(js)],
['detección de categorías',/agentRoleWords/.test(js)&&/agentFindBlock/.test(js)],
['constructor de plan local',/function agentBuildPlan\(raw\)/.test(js)],
['aplicación de plan validado',/function agentApplyPlan\(plan\)/.test(js)&&/TintaAgentCore\.validatePlan/.test(js)],
['operaciones de paleta',/type:'set_palette'/.test(js)],
['operaciones de alta y baja',/type:'add_component'/.test(js)&&/type:'remove_component'/.test(js)],
['reemplazo y edición de texto',/type:'replace_component'/.test(js)&&/type:'update_text'/.test(js)],
['historial conserva cambios',/save\('Agente: '/.test(js)],
['vista previa se actualiza',/paintPalettes\(\);renderReview\(\);renderPhone\(\)/.test(js)],
['operaciones con lista permitida',/const TYPES=/.test(core)&&/hasOwnProperty\.call\(TYPES/.test(core)],
['rechazo de propiedades extra',/propiedades no permitidas/.test(core)],
['sin evaluación de código arbitrario',!/eval\(|new Function\(/.test(core)],
['caché 15.15',/tinta-2026\.11\.08-private-ai/.test(sw)&&/js\/tinta-agent-core\.js/.test(sw)],
['módulo cargado antes del editor',html.indexOf('js/tinta-agent-core.js')<html.indexOf('js/crear.js')],
['diseño adaptable en móvil',/@media\(max-width:520px\)\{\.agent-chat/.test(css)],
];
let failed=0;for(const [name,ok] of checks){console.log((ok?'OK ':'FAIL ')+name);if(!ok)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones estructurales del agente superadas.');
