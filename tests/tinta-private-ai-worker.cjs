const assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path'),{pathToFileURL}=require('node:url');
if(!globalThis.crypto)globalThis.crypto=crypto.webcrypto;
class FakeDB{
 constructor(){this.providers=new Map();this.attempts=[];this.daily=new Map();this.models=new Map();}
 prepare(sql){return new FakeStatement(this,sql);}
}
class FakeStatement{
 constructor(db,sql){this.db=db;this.sql=sql.replace(/\s+/g,' ').trim().toLowerCase();this.args=[];}
 bind(...args){this.args=args;return this;}
 async run(){
  const a=this.args,s=this.sql;
  if(s.startsWith('delete from login_attempts where attempted_at'))this.db.attempts=this.db.attempts.filter(x=>x.attempted_at>=a[0]);
  else if(s.startsWith('delete from login_attempts where ip_hash'))this.db.attempts=this.db.attempts.filter(x=>x.ip_hash!==a[0]);
  else if(s.startsWith('insert into login_attempts'))this.db.attempts.push({ip_hash:a[0],attempted_at:a[1]});
  else if(s.startsWith('insert into providers'))this.db.providers.set(a[0],{id:a[0],name:a[1],endpoint:a[2],models_path:a[3],chat_path:a[4],auth_mode:a[5],key_iv:a[6],key_ciphertext:a[7],working_models:a[8],requests_per_day:a[9],requests_per_minute:a[10],created_at:a[11],updated_at:a[12]});
  else if(s.startsWith('update providers set working_models')){const p=this.db.providers.get(a[2]);if(p){p.working_models=a[0];p.updated_at=a[1];}}
  else if(s.startsWith('update provider_usage_daily set successes=')){const row=this.db.daily.get(a[5]+'|'+a[6]);if(row){row.successes+=a[0];row.errors+=a[1];row.prompt_tokens+=a[2];row.completion_tokens+=a[3];row.updated_at=a[4];}}
  else if(s.startsWith('insert into provider_usage_models')){const key=[a[0],a[1],a[2],a[3]].join('|'),old=this.db.models.get(key);if(old){old.requests++;old.successes+=a[4];old.errors+=a[5];old.prompt_tokens+=a[6];old.completion_tokens+=a[7];old.updated_at=a[8];}else this.db.models.set(key,{provider_id:a[0],usage_date:a[1],model:a[2],action:a[3],requests:1,successes:a[4],errors:a[5],prompt_tokens:a[6],completion_tokens:a[7],updated_at:a[8]});}
  else if(s.startsWith('delete from provider_usage_models where provider_id')){for(const [k,v] of this.db.models)if(v.provider_id===a[0])this.db.models.delete(k);}
  else if(s.startsWith('delete from provider_usage_daily where provider_id')){for(const [k,v] of this.db.daily)if(v.provider_id===a[0])this.db.daily.delete(k);}
  else if(s.startsWith('delete from providers'))this.db.providers.delete(a[0]);
  else if(s.startsWith('delete from provider_usage_daily where usage_date')){for(const [k,v] of this.db.daily)if(v.usage_date<a[0])this.db.daily.delete(k);}
  else if(s.startsWith('delete from provider_usage_models where usage_date')){for(const [k,v] of this.db.models)if(v.usage_date<a[0])this.db.models.delete(k);}
  return{success:true};
 }
 async first(){
  const a=this.args,s=this.sql;
  if(s.startsWith('select count(*) as total from login_attempts'))return{total:this.db.attempts.filter(x=>x.ip_hash===a[0]&&x.attempted_at>a[1]).length};
  if(s.startsWith('insert into provider_usage_daily')){
   const key=a[0]+'|'+a[1],old=this.db.daily.get(key),dailyLimit=a[4],minuteLimit=a[5];
   if(!old){const row={provider_id:a[0],usage_date:a[1],requests:1,successes:0,errors:0,prompt_tokens:0,completion_tokens:0,minute_bucket:a[2],requests_minute:1,updated_at:a[3]};this.db.daily.set(key,row);return{requests:1,requests_minute:1};}
   const minuteCount=old.minute_bucket===a[2]?old.requests_minute:0;
   if(old.requests>=dailyLimit||minuteCount>=minuteLimit)return null;
   old.requests++;old.requests_minute=minuteCount+1;old.minute_bucket=a[2];old.updated_at=a[3];return{requests:old.requests,requests_minute:old.requests_minute};
  }
  if(s.startsWith('select requests,requests_minute,minute_bucket from provider_usage_daily'))return this.db.daily.get(a[0]+'|'+a[1])||null;
  if(s.includes(' from providers where id = ?'))return this.db.providers.get(a[0])||null;
  return null;
 }
 async all(){
  const s=this.sql,a=this.args;
  if(s.includes('from providers'))return{results:[...this.db.providers.values()].map(p=>({id:p.id,name:p.name,endpoint:p.endpoint,models_path:p.models_path,chat_path:p.chat_path,auth_mode:p.auth_mode,working_models:p.working_models,requests_per_day:p.requests_per_day,requests_per_minute:p.requests_per_minute,created_at:p.created_at,updated_at:p.updated_at}))};
  if(s.startsWith('select provider_id,sum(requests) as requests from provider_usage_daily')){
   const grouped=new Map();for(const row of this.db.daily.values()){if(row.usage_date<a[0])continue;const x=grouped.get(row.provider_id)||{provider_id:row.provider_id,requests:0,successes:0,errors:0,prompt_tokens:0,completion_tokens:0};for(const k of ['requests','successes','errors','prompt_tokens','completion_tokens'])x[k]+=row[k];grouped.set(row.provider_id,x);}return{results:[...grouped.values()]};
  }
  if(s.startsWith('select provider_id,requests,requests_minute,minute_bucket from provider_usage_daily'))return{results:[...this.db.daily.values()].filter(x=>x.usage_date===a[0]).map(x=>({provider_id:x.provider_id,requests:x.requests,requests_minute:x.requests_minute,minute_bucket:x.minute_bucket}))};
  if(s.startsWith('select provider_id,model,action,sum(requests) as requests')){
   const grouped=new Map();for(const row of this.db.models.values()){if(row.usage_date<a[0])continue;const key=[row.provider_id,row.model,row.action].join('|'),x=grouped.get(key)||{provider_id:row.provider_id,model:row.model,action:row.action,requests:0,successes:0,errors:0,prompt_tokens:0,completion_tokens:0};for(const k of ['requests','successes','errors','prompt_tokens','completion_tokens'])x[k]+=row[k];grouped.set(key,x);}return{results:[...grouped.values()].sort((x,y)=>y.requests-x.requests).slice(0,300)};
  }
  return{results:[]};
 }
}
(async()=>{
 const worker=(await import(pathToFileURL(path.join(__dirname,'../backend/worker/src/index.mjs')).href+'?t='+Date.now())).default;
 const db=new FakeDB(),apiKey='UPSTREAM-KEY-DO-NOT-PERSIST-abc',admin='tinta-admin-password-at-least-24-chars',sessionSecret=crypto.randomBytes(48).toString('base64'),aes=crypto.randomBytes(32).toString('base64');
 const env={DB:db,ALLOWED_ORIGINS:'https://criptobox.github.io',TINTA_ADMIN_PASSWORD:admin,TINTA_SESSION_SECRET:sessionSecret,TINTA_ENCRYPTION_KEY:aes,SESSION_TTL_SECONDS:'28800'};
 const originalFetch=globalThis.fetch,upstreamCalls=[];
 globalThis.fetch=async(url,options={})=>{
  upstreamCalls.push({url:String(url),options});
  if(String(url).endsWith('/models'))return new Response(JSON.stringify({data:[{id:'model-good'},{id:'model-good'},{id:'model-next'}]}),{status:200,headers:{'Content-Type':'application/json'}});
  const body=JSON.parse(options.body||'{}');
  return new Response(JSON.stringify({model:body.model,usage:{prompt_tokens:20,completion_tokens:7},choices:[{message:{content:body.messages?.[0]?.content==='Responde únicamente: TINTA_OK'?'TINTA_OK':'{"operations":[],"summary":["plan validado"]}'}}]}),{status:200,headers:{'Content-Type':'application/json'}});
 };
 const origin='https://criptobox.github.io',base='https://tinta-private-ai.example.workers.dev';
 const send=async(route,{method='GET',body,token,originValue=origin,ip='192.0.2.10'}={})=>{const headers={Origin:originValue,'CF-Connecting-IP':ip};if(body!==undefined)headers['Content-Type']='application/json';if(token)headers.Authorization='Bearer '+token;return worker.fetch(new Request(base+route,{method,headers,...(body!==undefined?{body:JSON.stringify(body)}:{})}),env);};
 try{
  let r=await send('/api/providers');assert.equal(r.status,401,'las rutas privadas requieren sesión');
  r=await send('/api/usage');assert.equal(r.status,401,'las métricas requieren sesión');
  r=await send('/health',{originValue:'https://evil.example'});assert.equal(r.status,403,'CORS rechaza orígenes externos');
  r=await send('/auth/login',{method:'POST',body:{password:'bad'},ip:'192.0.2.11'});assert.equal(r.status,401,'contraseña incorrecta denegada');
  r=await send('/auth/login',{method:'POST',body:{password:admin}});assert.equal(r.status,200);const login=await r.json(),token=login.token;assert.ok(token.length>40);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-test-12345',name:'Proveedor test',endpoint:'https://api.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',key:apiKey}});
  assert.equal(r.status,200);let saved=await r.json();assert.equal(saved.provider.id,'provider-test-12345');assert.equal(saved.provider.requestsPerDay,300);assert.equal(saved.provider.requestsPerMinute,60);
  assert.equal(JSON.stringify(saved).includes(apiKey),false,'la respuesta de alta nunca devuelve la clave');
  const stored=db.providers.get('provider-test-12345');assert.ok(stored.key_ciphertext);assert.notEqual(stored.key_ciphertext,apiKey);assert.notEqual(stored.key_iv,apiKey);
  r=await send('/api/providers',{token});const listing=await r.json();assert.equal(listing.providers.length,1);assert.equal(JSON.stringify(listing).includes(apiKey),false,'el listado no expone secretos');
  r=await send('/api/providers/provider-test-12345/models',{method:'POST',token,body:{}});const models=await r.json();assert.deepEqual(models.models,['model-good','model-next']);
  r=await send('/api/providers/provider-test-12345/test',{method:'POST',token,body:{model:'model-good'}});assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-test-12345',name:'Proveedor test',endpoint:'https://api.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',key:apiKey+'-rotated'}});assert.equal(r.status,200);assert.deepEqual((await r.json()).provider.workingModels,[],'al rotar la clave invalida modelos probados con credenciales anteriores');
  r=await send('/api/providers/provider-test-12345/test',{method:'POST',token,body:{model:'model-good'}});assert.equal(r.status,200,'se vuelve a probar con la clave nueva');
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-test-12345',name:'Proveedor test',endpoint:'https://api.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',requestsPerDay:250,requestsPerMinute:45}});assert.equal(r.status,200);saved=await r.json();assert.deepEqual(saved.provider.workingModels,['model-good'],'cambiar solo los límites conserva los modelos probados');assert.equal(saved.provider.requestsPerDay,250);assert.equal(saved.provider.requestsPerMinute,45);
  assert.ok(upstreamCalls[1].options.headers.Authorization.includes(apiKey),'el Worker recupera y envía la clave al proveedor');
  r=await send('/api/providers/provider-test-12345/chat',{method:'POST',token,body:{model:'model-unverified',messages:[{role:'user',content:'hola'}]}});assert.equal(r.status,400,'un modelo no probado se rechaza');
  r=await send('/api/providers/provider-test-12345/chat',{method:'POST',token,body:{model:'model-good',messages:[{role:'user',content:'hola'}]}});assert.equal(r.status,200);const answer=await r.json();assert.match(answer.text,/operations/);assert.equal(JSON.stringify(answer).includes(apiKey),false);
  r=await send('/api/usage?days=7',{token});assert.equal(r.status,200);let usage=await r.json(),mainUsage=usage.providers.find(p=>p.id==='provider-test-12345');assert.equal(usage.days,7);assert.equal(mainUsage.requests,4);assert.equal(mainUsage.successes,4);assert.equal(mainUsage.promptTokens,60);assert.equal(mainUsage.completionTokens,21);assert.ok(mainUsage.models.some(m=>m.model==='model-good'&&m.action==='chat'));
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-limited-123',name:'Proveedor limitado',endpoint:'https://limited.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',key:apiKey,requestsPerDay:2,requestsPerMinute:1}});assert.equal(r.status,200);saved=await r.json();assert.equal(saved.provider.requestsPerDay,2);assert.equal(saved.provider.requestsPerMinute,1);
  r=await send('/api/providers/provider-limited-123/models',{method:'POST',token,body:{}});assert.equal(r.status,200,'la primera llamada respeta el límite');
  r=await send('/api/providers/provider-limited-123/models',{method:'POST',token,body:{}});assert.equal(r.status,429,'la segunda llamada supera el límite por minuto');let limited=await r.json();assert.equal(limited.limit,'minute');assert.ok(limited.retryAfter>0);
  const usageKey='provider-limited-123|'+new Date().toISOString().slice(0,10);db.daily.get(usageKey).minute_bucket='previous-minute';
  r=await send('/api/providers/provider-limited-123/models',{method:'POST',token,body:{}});assert.equal(r.status,200,'una vez transcurrido el minuto se permite la segunda del día');
  db.daily.get(usageKey).minute_bucket='previous-minute';
  r=await send('/api/providers/provider-limited-123/models',{method:'POST',token,body:{}});assert.equal(r.status,429,'la tercera llamada supera el límite diario');limited=await r.json();assert.equal(limited.limit,'daily');
  r=await send('/api/usage?days=7',{token});usage=await r.json();const limitedStats=usage.providers.find(p=>p.id==='provider-limited-123');assert.equal(limitedStats.requestsToday,2);assert.equal(limitedStats.requests,2);assert.equal(limitedStats.requestsPerDay,2);assert.equal(limitedStats.requestsPerMinute,1);assert.equal(limitedStats.successes,2);assert.equal(limitedStats.errors,0);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-invalid-123',name:'local',endpoint:'https://127.0.0.1/v1',key:apiKey}});assert.equal(r.status,400,'el proxy bloquea endpoints con IP local');
  r=await send('/api/providers/provider-limited-123',{method:'DELETE',token});assert.equal(r.status,200);assert.equal(db.providers.has('provider-limited-123'),false);assert.equal([...db.daily.values()].some(x=>x.provider_id==='provider-limited-123'),false);
  r=await send('/api/providers/provider-test-12345',{method:'DELETE',token});assert.equal(r.status,200);assert.equal(db.providers.size,0);
  const opts=await worker.fetch(new Request(base+'/health',{method:'OPTIONS',headers:{Origin:origin}}),env);assert.equal(opts.status,204);
  console.log('Worker privado: 40 comprobaciones de auth, AES-GCM, proxy, límites atómicos, métricas por modelo y tokens superadas.');
 }finally{globalThis.fetch=originalFetch;}
})().catch(e=>{console.error(e);process.exit(1);});
