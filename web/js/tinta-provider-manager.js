/* Gestor de proveedores OpenAI-compatible. Las claves viven solo en memoria de sesión. */
(function(root){
 'use strict';
 const STORAGE='tinta-ai-providers-v1', keys=new Map();
 const read=()=>{try{const x=JSON.parse(root.localStorage.getItem(STORAGE)||'[]');return Array.isArray(x)?x:[];}catch(_){return[];}};
 const write=x=>{try{root.localStorage.setItem(STORAGE,JSON.stringify(x));return true;}catch(_){return false;}};
 const cleanBase=v=>{const u=new URL(String(v||'').trim());if(u.username||u.password||u.search||u.hash)throw Error('El endpoint no debe incluir credenciales, parámetros ni fragmentos.');if(!['https:','http:'].includes(u.protocol))throw Error('Usa una URL HTTPS. HTTP solo se permite en localhost.');if(u.protocol==='http:'&&!['localhost','127.0.0.1'].includes(u.hostname))throw Error('HTTP solo se permite para localhost.');return u.href.replace(/\/+$/,'');};
 const path=(base,p)=>base+'/'+String(p||'').trim().replace(/^\/+/, '');
 const parseModels=data=>{const list=Array.isArray(data?.data)?data.data:Array.isArray(data?.models)?data.models:Array.isArray(data)?data:[];return [...new Set(list.map(x=>typeof x==='string'?x:x?.id).filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))];};
 async function request(url,key,options={},timeout=18000,authMode='bearer'){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const response=await fetch(url,{...options,signal:controller.signal,headers:{...(authMode==='x-api-key'?{'x-api-key':key}:authMode==='api-key'?{'api-key':key}:{Authorization:'Bearer '+key}),'Content-Type':'application/json',...(options.headers||{})}});
   const body=await response.text();let data;try{data=body?JSON.parse(body):{};}catch(_){data={raw:body.slice(0,500)};}
   if(!response.ok)throw Error('HTTP '+response.status+': '+String(data?.error?.message||data?.message||body||response.statusText).slice(0,220));
   return data;
  }catch(e){if(e.name==='AbortError')throw Error('Tiempo de espera agotado.');if(e instanceof TypeError)throw Error('No se pudo conectar. Comprueba CORS, endpoint y red.');throw e;}
  finally{clearTimeout(timer);}
 }
 async function discover({endpoint,modelsPath='/models',key,authMode='bearer'}){
  const base=cleanBase(endpoint);if(!key)throw Error('Falta la clave API.');
  const data=await request(path(base,modelsPath),key,{method:'GET'},18000,authMode);
  return {base,models:parseModels(data)};
 }
 async function testModel({endpoint,chatPath='/chat/completions',key,model,authMode='bearer'}){
  const base=cleanBase(endpoint);if(!key)throw Error('Falta la clave API.');
  const data=await request(path(base,chatPath),key,{method:'POST',body:JSON.stringify({model,messages:[{role:'user',content:'Responde únicamente: TINTA_OK'}],max_tokens:12,temperature:0})},25000,authMode);
  const content=data?.choices?.[0]?.message?.content??data?.output_text??data?.message?.content;
  const text=typeof content==='string'?content:Array.isArray(content)?content.map(x=>x?.text||'').join(' '):'';
  if(!text.trim())throw Error('El endpoint respondió, pero no devolvió texto compatible.');
  return {ok:true,model,text:text.trim().slice(0,80),reportedModel:data?.model||model};
 }

 async function complete({endpoint,chatPath='/chat/completions',key,model,authMode='bearer',messages,maxTokens=1400}){
  const base=cleanBase(endpoint);if(!key)throw Error('Falta la clave API.');
  const data=await request(path(base,chatPath),key,{method:'POST',body:JSON.stringify({model,messages,max_tokens:maxTokens,temperature:0.2})},45000,authMode);
  const content=data?.choices?.[0]?.message?.content??data?.output_text??data?.message?.content;
  const text=typeof content==='string'?content:Array.isArray(content)?content.map(x=>x?.text||'').join(' '):'';
  if(!text.trim())throw Error('El modelo no devolvió contenido de texto.');
  return text.trim();
 }
 function saveProvider(profile){const list=read(),i=list.findIndex(x=>x.id===profile.id);if(i>=0)list[i]={...list[i],...profile};else list.unshift(profile);write(list);return list;}
 function rememberKey(id,key){keys.set(id,key);}
 function getKey(id){return keys.get(id)||'';}
 function list(){return read().map(x=>({...x,connected:keys.has(x.id)}));}
 function remove(id){keys.delete(id);write(read().filter(x=>x.id!==id));}
 function updateWorking(id,models){const list=read(),p=list.find(x=>x.id===id);if(!p)return; p.workingModels=[...new Set(models)];write(list);}
 root.TintaProviderManager={discover,testModel,complete,saveProvider,rememberKey,getKey,list,remove,updateWorking,cleanBase};
 if(typeof module!=='undefined')module.exports=root.TintaProviderManager;
})(typeof window!=='undefined'?window:globalThis);
