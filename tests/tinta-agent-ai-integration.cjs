const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:900}});
 const pageErrors=[];let inferenceCalls=0,planMode='valid';page.on('pageerror',e=>pageErrors.push(e.message));
 await page.route('https://api.example.test/**',async route=>{
  const req=route.request(),method=req.method(),headers={'access-control-allow-origin':'*','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'authorization, content-type, x-api-key, api-key','content-type':'application/json'};
  if(method==='OPTIONS')return route.fulfill({status:204,headers});
  if(method==='GET')return route.fulfill({status:200,headers,body:JSON.stringify({data:[{id:'model-ok'}]})});
  const body=req.postDataJSON(),content=body.messages?.[0]?.content||'';
  if(content.includes('Responde únicamente: TINTA_OK'))return route.fulfill({status:200,headers,body:JSON.stringify({choices:[{message:{content:'TINTA_OK'}}],model:'model-ok'})});
  inferenceCalls++;const paletteId=await page.evaluate(()=>TintaPalettes.all()[0].id);
  const plan=planMode==='valid'?{operations:[{type:'set_palette',paletteId}],summary:['Paleta de prueba aplicada.']}:{operations:[{type:'set_palette',paletteId:'palette-no-existe'}],summary:['Plan inválido.']};
  return route.fulfill({status:200,headers,body:JSON.stringify({choices:[{message:{content:JSON.stringify(plan)}}],model:'model-ok'})});
 });
 await page.goto('http://127.0.0.1:18080/crear.html');await page.evaluate(()=>aiOpen());
 await page.locator('#aiProviderEndpoint').fill('https://api.example.test/v1');await page.locator('#aiProviderKey').fill('test-key-not-real');await page.locator('#aiProviderForm').evaluate(form=>form.requestSubmit());
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('#agentAIModel option')).some(o=>o.value==='model-ok'),null,{timeout:20000});
 assert.equal(await page.locator('#agentAIModel option').count(),2,'el modelo aparece junto al modo local');
 await page.evaluate(()=>{const s=document.getElementById('agentAIModel');s.value='model-ok';s.dispatchEvent(new Event('change',{bubbles:true}));});
 const initial=await page.evaluate(()=>state.palette);await page.evaluate(async()=>submitAgentInstruction('Cambia a una paleta de prueba'));
 const applied=await page.evaluate(()=>state.palette);assert.notEqual(applied,initial,'el plan válido modifica el diseño');assert.equal(inferenceCalls,1,'el modelo recibe la instrucción del agente');
 assert.ok((await page.locator('#agentChatLog').innerText()).includes('Modelo model-ok'),'el chat identifica el modelo utilizado');
 planMode='invalid';await page.evaluate(async()=>submitAgentInstruction('Haz otro cambio'));
 assert.equal(await page.evaluate(()=>state.palette),applied,'el plan inválido no modifica el diseño');
 assert.ok((await page.locator('#agentChatLog').innerText()).includes('No se aplicó ningún cambio'),'el chat informa el rechazo del plan');
 assert.deepEqual(pageErrors,[],'sin errores JavaScript');await browser.close();console.log('Integración IA: conexión, prueba, selector, aplicación y rechazo de planes correctos.');
})().catch(error=>{console.error(error);process.exit(1);});