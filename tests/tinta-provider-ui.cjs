const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),provider=fs.readFileSync(path.join(root,'web/js/tinta-provider-manager.js'),'utf8'),sw=fs.readFileSync(path.join(root,'web/sw.js'),'utf8');
const checks=[
['panel de conexiones accesible',/id="aiConnectionsDialog"/.test(html)&&/aria-labelledby="aiConnectionsTitle"/.test(html)],
['endpoint y clave configurables',/id="aiProviderEndpoint"/.test(html)&&/id="aiProviderKey"/.test(html)],
['rutas de modelos y chat editables',/id="aiModelsPath"/.test(html)&&/id="aiChatPath"/.test(html)],
['modos de autenticación configurables',/id="aiAuthMode"/.test(html)&&/x-api-key/.test(html)&&/api-key/.test(html)],
['descubrimiento desde endpoint',/TintaProviderManager\.discover/.test(js)],
['prueba individual por modelo',/TintaProviderManager\.testModel/.test(js)],
['alta manual de modelo',/id="aiManualModelForm"/.test(html)],
['separación de modelos fallidos',/id="aiFailedModels"/.test(html)],
['claves solo en memoria',/const STORAGE/.test(provider)&&/keys=new Map/.test(provider)&&!/apiKey\s*:/.test(provider)],
['perfiles sin clave',/workingModels/.test(js)&&/rememberKey/.test(js)],
['campo de clave se limpia tras la prueba',/aiProviderKey'\)\.value=''/.test(js)],
['protocolo seguro',/HTTPS/.test(provider)&&/localhost/.test(provider)],
['estado de CORS informado',/CORS/.test(provider)&&/CORS/.test(html)],
['archivo incluido en PWA',/js\/tinta-provider-manager\.js/.test(sw)],
['caché nueva',/tinta-2026\.11\.17/.test(sw)],
['completar chat real',/async function complete/.test(provider)&&/TintaProviderManager\.complete/.test(js)],
['selector de modelo del agente',/id="agentAIModel"/.test(html)&&/aiRefreshAgentModels/.test(js)],
['validación antes de aplicar',/agentApplyPlan\(plan\)/.test(js)&&/JSON\.parse/.test(js)],
['entrada sincronizada',fs.readFileSync(path.join(root,'web/index.html'),'utf8')===html]
];
let fail=0;for(const [name,ok] of checks){console.log((ok?'OK ':'FAIL ')+name);if(!ok)fail++;}if(fail)process.exit(1);console.log(checks.length+' comprobaciones estructurales 15.14 superadas.');
