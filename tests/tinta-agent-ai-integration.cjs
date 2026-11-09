const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:900}});
 const pageErrors=[];let inferenceCalls=0,repairCalls=0,planMode='valid',savedKeySeen=false,providerId='';
 const apiKey='provider-key-never-leaves-private-save',backend='https://tinta-private-ai.example.workers.dev',session='test-session-token-only',requests=[];
 page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto('http://127.0.0.1:18080/crear.html');
 const testPaletteId=await page.evaluate(()=>TintaPalettes.all()[0].id);
 await page.route(backend+'/**',async route=>{
  const req=route.request(),url=new URL(req.url()),method=req.method(),headers={'access-control-allow-origin':'*','access-control-allow-methods':'GET, POST, DELETE, OPTIONS','access-control-allow-headers':'authorization, content-type','access-control-max-age':'600','content-type':'application/json'};
  if(method==='OPTIONS')return route.fulfill({status:204,headers});
  const body=req.postDataJSON?.()||{};requests.push({path:url.pathname,method,headers:req.headers(),body});
  if(url.pathname==='/auth/login'&&method==='POST'){assert.ok(body.password.length>=24,'el formulario envía la contraseña privada');return route.fulfill({status:200,headers,body:JSON.stringify({token:session,expiresIn:28800})});}
  if(url.pathname==='/api/providers'&&method==='GET')return route.fulfill({status:200,headers,body:JSON.stringify({providers:[]})});
  if(url.pathname==='/api/usage'&&method==='GET')return route.fulfill({status:200,headers,body:JSON.stringify({days:7,from:'2026-11-03',to:'2026-11-09',totals:{requests:2,successes:2,errors:0,promptTokens:40,completionTokens:20,totalTokens:60},providers:[]})});
  if(url.pathname==='/api/providers'&&method==='POST'){providerId=body.id;savedKeySeen=body.key===apiKey;const profile={id:providerId,name:body.name,endpoint:body.endpoint,modelsPath:body.modelsPath,chatPath:body.chatPath,authMode:body.authMode,workingModels:[],connected:true};return route.fulfill({status:200,headers,body:JSON.stringify({provider:profile})});}
  const match=url.pathname.match(/^\/api\/providers\/([^/]+)\/(models|test|chat)$/);
  if(match){const [,id,action]=match;if(!providerId||id!==providerId)return route.fulfill({status:404,headers,body:JSON.stringify({error:'Proveedor desconocido'})});if(action==='models')return route.fulfill({status:200,headers,body:JSON.stringify({models:['model-ok']})});if(action==='test')return route.fulfill({status:200,headers,body:JSON.stringify({ok:true,model:body.model,workingModels:[body.model]})});if(action==='chat'){inferenceCalls++;const repaired=planMode==='repair'&&repairCalls++>0,valid=planMode==='valid'||repaired;const plan=valid?{operations:[{type:'set_palette',paletteId:testPaletteId}],summary:['Paleta de prueba aplicada.']}:{operations:[{type:'set_palette',paletteId:'palette-no-existe'}],summary:['Plan inválido.']};return route.fulfill({status:200,headers,body:JSON.stringify({text:JSON.stringify(plan),model:body.model})});}}
  return route.fulfill({status:404,headers,body:JSON.stringify({error:'Ruta de prueba no implementada: '+url.pathname})});
 });
 await page.locator('#idea').fill('Una cafetería moderna con pedidos y tarjetas de producto.');await page.locator('#briefForm button[type=submit]').click();await page.locator('#agentChatInput').waitFor({state:'visible'});
 await page.locator('.menu-button').click();await page.locator('#siteMenu [data-act=open-ai-connections]').click();await page.locator('#aiConnectionsDialog').waitFor({state:'visible'});
 await page.locator('#aiBackendUrl').fill(backend);await page.locator('#aiBackendPassword').fill('admin-password-for-private-worker-123456');await page.locator('#aiBackendLoginForm').evaluate(form=>form.requestSubmit());
 await page.waitForFunction(()=>document.getElementById('aiBackendStatus').dataset.kind==='success',null,{timeout:10000});
 await page.locator('#aiProviderEndpoint').fill('https://api.example.com/v1');await page.locator('#aiProviderKey').fill(apiKey);await page.locator('#aiProviderForm').evaluate(form=>form.requestSubmit());
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('#agentAIModel option')).some(o=>o.value==='model-ok'),null,{timeout:20000});
 assert.ok(providerId.length>=8,'se crea un identificador de proveedor válido');assert.equal(savedKeySeen,true,'la API key se envía al Worker solo al guardar');assert.equal(await page.locator('#aiProviderKey').inputValue(),'','el campo se vacía inmediatamente tras el guardado cifrado');assert.equal(await page.locator('#agentAIModel option').count(),3,'modo local, Auto y modelo manual aparecen en el selector');
 await page.evaluate(()=>{const s=document.getElementById('agentAIModel');s.value='model-ok';s.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.locator('#aiConnectionsDialog [data-act=close-ai-connections]').click();await page.locator('#aiConnectionsDialog').waitFor({state:'hidden'});
 const initial=JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette;
 await page.locator('#agentChatInput').fill('Cambia a una paleta de prueba');await page.locator('#agentChatSend').click();
 await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('Modelo model-ok'),null,{timeout:20000});
 const applied=JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette;assert.notEqual(applied,initial,'el plan válido modifica el diseño');assert.equal(inferenceCalls,1,'el modelo recibe la instrucción del agente');
 const call=requests.filter(x=>x.path.endsWith('/chat')).at(-1);assert.ok(call,'existe una petición al chat del Worker');assert.equal(call.headers.authorization,'Bearer '+session,'el chat autentica la sesión privada');assert.equal(JSON.stringify(call.body).includes(apiKey),false,'la API key no se envía en la conversación');assert.equal(requests.every(x=>x.path==='/auth/login'||x.path.startsWith('/api/providers')||x.path==='/api/usage'),true,'todas las solicitudes pasan por el gateway privado');
 const autoOption=await page.locator('#agentAIModel option[value="__auto__"]').count();assert.equal(autoOption,1,'el selector ofrece enrutamiento automático con modelos probados');await page.locator('#agentAIModel').selectOption('__auto__');planMode='valid';await page.locator('#agentChatInput').fill('Ajusta la paleta con selección automática');await page.locator('#agentChatSend').click();await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('Modelo model-ok'),null,{timeout:20000});assert.equal(inferenceCalls,2,'el modo automático ejecuta la tarea con un modelo probado');
 planMode='repair';repairCalls=0;await page.locator('#agentChatInput').fill('Corrige un plan que necesite reparación');await page.locator('#agentChatSend').click();await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('Modelo model-ok'),null,{timeout:20000});assert.equal(inferenceCalls,4,'el agente hace exactamente una segunda llamada cuando el plan necesita reparación');assert.equal(repairCalls,2,'el simulador recibió la respuesta inválida y su reparación');
 planMode='invalid';await page.locator('#agentChatInput').fill('Haz otro cambio');await page.locator('#agentChatSend').click();
 await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('No se aplicó ningún cambio'),null,{timeout:20000});
 assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette,applied,'un plan inválido incluso tras la reparación no modifica el diseño');assert.equal(inferenceCalls,6,'el agente limita a un intento de reparación y rechaza planes persistentemente inválidos');assert.deepEqual(pageErrors,[],'sin errores JavaScript');
 await browser.close();console.log('Integración IA privada: login, guardado cifrado, prueba, selector, chat proxy y rechazo de planes correctos.');
})().catch(error=>{console.error(error);process.exit(1);});
