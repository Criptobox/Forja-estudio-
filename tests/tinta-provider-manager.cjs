const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../web/js/tinta-provider-manager.js'),'utf8');
const storage=new Map(),calls=[],profiles=[];
const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const ctx={URL,localStorage,AbortController,setTimeout,clearTimeout,Map,JSON,Array,String,Error,fetch:async(url,options={})=>{
 const parsed=new URL(url),p=parsed.pathname,method=options.method||(options.body?'POST':'GET'),body=options.body?JSON.parse(options.body):{};
 calls.push({url,options,body});
 if(p==='/auth/login')return new Response(JSON.stringify({token:'session-token-not-provider-key',expiresIn:28800}),{status:200});
 if(p==='/api/providers'&&method==='GET')return new Response(JSON.stringify({providers:profiles}),{status:200});
 if(p==='/api/providers'&&options.method==='POST'){
  const item={id:body.id,name:body.name,endpoint:body.endpoint,modelsPath:body.modelsPath,chatPath:body.chatPath,authMode:body.authMode,workingModels:[],connected:true};
  const i=profiles.findIndex(x=>x.id===item.id);if(i>=0)profiles[i]=item;else profiles.push(item);
  return new Response(JSON.stringify({provider:item}),{status:200});
 }
 if(p.endsWith('/models'))return new Response(JSON.stringify({models:['model-safe','model-second']}),{status:200});
 if(p.endsWith('/test')){const item=profiles.find(x=>p.includes(x.id));item.workingModels=[body.model];return new Response(JSON.stringify({ok:true,model:body.model,workingModels:item.workingModels}),{status:200});}
 if(p.endsWith('/chat'))return new Response(JSON.stringify({text:'{"operations":[],"summary":["ok"]}',model:body.model}),{status:200});
 if(method==='DELETE'){const id=p.split('/').at(-1);const i=profiles.findIndex(x=>x.id===id);if(i>=0)profiles.splice(i,1);return new Response(JSON.stringify({ok:true}),{status:200});}
 return new Response(JSON.stringify({error:'route not found'}),{status:404});
}};
ctx.globalThis=ctx;vm.runInNewContext(source,ctx);
(async()=>{
 const M=ctx.TintaProviderManager,base='https://tinta-private-ai.example.workers.dev',admin='admin-password-never-store-123456',providerKey='provider-api-key-never-store-abcdef',id='provider-test-12345';
 assert.equal(M.isAuthenticated(),false);
 await M.login({url:base,password:admin});
 assert.equal(M.isAuthenticated(),true);
 assert.equal(M.getBackendUrl(),base);
 assert.equal(M.list().length,0);
 assert.equal(storage.get('tinta-private-ai-backend-v1'),base);
 assert.equal([...storage.values()].some(v=>String(v).includes(admin)||String(v).includes(providerKey)||String(v).includes('session-token')),false,'ni la contraseña ni el token ni la API key se persisten');
 await M.saveProvider({id,name:'Proveedor test',endpoint:'https://api.example.test/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer'},providerKey);
 assert.equal(M.list()[0].id,id);
 assert.equal(calls.at(-1).body.key,providerKey,'la clave solo se envía al endpoint privado de alta');
 assert.ok(calls.at(-1).url.startsWith(base+'/api/providers'));
 const found=await M.discover({providerId:id});assert.deepEqual(Array.from(found.models),['model-safe','model-second']);
 const tested=await M.testModel({providerId:id,model:'model-safe'});assert.equal(tested.ok,true);
 assert.deepEqual(Array.from(M.get(id).workingModels),['model-safe']);
 const answer=await M.complete({providerId:id,model:'model-safe',messages:[{role:'user',content:'prueba'}]});
 assert.match(answer,/operations/);
 const chatCall=calls.at(-1);assert.ok(chatCall.url.startsWith(base+'/api/providers/'+id+'/chat'));
 assert.equal(JSON.stringify(chatCall.body).includes(providerKey),false,'el chat envía solo ID, modelo y contexto');
 assert.equal(chatCall.options.headers.Authorization,'Bearer session-token-not-provider-key','el navegador autentica la sesión, no adjunta la clave del proveedor');
 assert.equal(typeof M.getKey,'undefined','el cliente no mantiene getter de API keys');
 assert.equal(calls.every(x=>x.url.startsWith(base+'/')),true,'no hay llamadas directas al proveedor');
 await M.remove(id);assert.equal(M.list().length,0);
 M.logout();assert.equal(M.isAuthenticated(),false);
 assert.equal(storage.get('tinta-private-ai-backend-v1'),base,'solo se conserva la URL pública del Worker');
 assert.equal([...storage.values()].some(v=>String(v).includes(admin)||String(v).includes(providerKey)||String(v).includes('session-token')),false);
 console.log('Gateway cliente: 18 comprobaciones de sesión, almacenamiento efímero y proxy completadas.');
})().catch(e=>{console.error(e);process.exit(1);});
