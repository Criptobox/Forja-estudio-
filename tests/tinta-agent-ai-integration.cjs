const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:900}});
 const pageErrors=[];let inferenceCalls=0,planMode='valid';page.on('pageerror',e=>pageErrors.push(e.message));
;
 await page.goto('http://127.0.0.1:18080/crear.html');
 const testPaletteId=await page.evaluate(()=>TintaPalettes.all()[0].id);
 await page.route('https://api.example.test/**',async route=>{
  const req=route.request(),method=req.method(),headers={'access-control-allow-origin':'*','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'authorization, content-type, x-api-key, api-key','content-type':'application/json'};
  if(method==='OPTIONS')return route.fulfill({status:204,headers});
  if(method==='GET')return route.fulfill({status:200,headers,body:JSON.stringify({data:[{id:'model-ok'}]})});
  const body=req.postDataJSON(),content=body.messages?.[0]?.content||'';
  if(content.includes('Responde únicamente: TINTA_OK'))return route.fulfill({status:200,headers,body:JSON.stringify({choices:[{message:{content:'TINTA_OK'}}],model:'model-ok'})});
  inferenceCalls++;const paletteId=testPaletteId;
  const plan=planMode==='valid'?{operations:[{type:'set_palette',paletteId}],summary:['Paleta de prueba aplicada.']}:{operations:[{type:'set_palette',paletteId:'palette-no-existe'}],summary:['Plan inválido.']};
  return route.fulfill({status:200,headers,body:JSON.stringify({choices:[{message:{content:JSON.stringify(plan)}}],model:'model-ok'})});
 })
 await page.locator('#idea').fill('Una cafetería moderna con pedidos y tarjetas de producto.');
 await page.locator('#briefForm button[type=submit]').click();
 await page.locator('#agentChatInput').waitFor({state:'visible'});
 await page.locator('.menu-button').click();
 await page.locator('#siteMenu [data-act=open-ai-connections]').click();
 await page.locator('#aiConnectionsDialog').waitFor({state:'visible'});
 await page.locator('#aiProviderEndpoint').fill('https://api.example.test/v1');await page.locator('#aiProviderKey').fill('test-key-not-real');await page.locator('#aiProviderForm').evaluate(form=>form.requestSubmit());
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('#agentAIModel option')).some(o=>o.value==='model-ok'),null,{timeout:20000});
 assert.equal(await page.locator('#agentAIModel option').count(),2,'el modelo aparece junto al modo local');
 await page.evaluate(()=>{const s=document.getElementById('agentAIModel');s.value='model-ok';s.dispatchEvent(new Event('change',{bubbles:true}));});
 const initial=JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette;
 await page.locator('#agentChatInput').fill('Cambia a una paleta de prueba');await page.locator('#agentChatSend').click();
 await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('Modelo model-ok'),null,{timeout:20000});
 const applied=JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette;assert.notEqual(applied,initial,'el plan válido modifica el diseño');assert.equal(inferenceCalls,1,'el modelo recibe la instrucción del agente');
 assert.ok((await page.locator('#agentChatLog').innerText()).includes('Modelo model-ok'),'el chat identifica el modelo utilizado');
 planMode='invalid';await page.locator('#agentChatInput').fill('Haz otro cambio');await page.locator('#agentChatSend').click();
 await page.waitForFunction(()=>document.getElementById('agentChatLog').innerText.includes('No se aplicó ningún cambio'),null,{timeout:20000});
 assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('estilos-tinta-prototype-v1'))).palette,applied,'el plan inválido no modifica el diseño');
 assert.ok((await page.locator('#agentChatLog').innerText()).includes('No se aplicó ningún cambio'),'el chat informa el rechazo del plan');
 assert.deepEqual(pageErrors,[],'sin errores JavaScript');await browser.close();console.log('Integración IA: conexión, prueba, selector, aplicación y rechazo de planes correctos.');
})().catch(error=>{console.error(error);process.exit(1);});
