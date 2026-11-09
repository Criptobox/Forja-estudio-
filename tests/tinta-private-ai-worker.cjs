const assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path'),{pathToFileURL}=require('node:url');
if(!globalThis.crypto)globalThis.crypto=crypto.webcrypto;
class FakeDB{
 constructor(){this.providers=new Map();this.attempts=[];}
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
  else if(s.startsWith('insert into providers'))this.db.providers.set(a[0],{id:a[0],name:a[1],endpoint:a[2],models_path:a[3],chat_path:a[4],auth_mode:a[5],key_iv:a[6],key_ciphertext:a[7],working_models:a[8],created_at:a[9],updated_at:a[10]});
  else if(s.startsWith('update providers set working_models')){const p=this.db.providers.get(a[2]);if(p){p.working_models=a[0];p.updated_at=a[1];}}
  else if(s.startsWith('delete from providers'))this.db.providers.delete(a[0]);
  return{success:true};
 }
 async first(){
  const a=this.args,s=this.sql;
  if(s.startsWith('select count(*) as total from login_attempts'))return{total:this.db.attempts.filter(x=>x.ip_hash===a[0]&&x.attempted_at>a[1]).length};
  if(s.includes(' from providers where id = ?'))return this.db.providers.get(a[0])||null;
  return null;
 }
 async all(){
  if(this.sql.includes('from providers'))return{results:[...this.db.providers.values()].map(({id,name,endpoint,models_path,chat_path,auth_mode,working_models,created_at,updated_at})=>({id,name,endpoint,models_path,chat_path,auth_mode,working_models,created_at,updated_at}))};
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
  return new Response(JSON.stringify({model:body.model,choices:[{message:{content:body.messages?.[0]?.content==='Responde únicamente: TINTA_OK'?'TINTA_OK':'{"operations":[],"summary":["plan validado"]}'}}]}),{status:200,headers:{'Content-Type':'application/json'}});
 };
 const origin='https://criptobox.github.io',base='https://tinta-private-ai.example.workers.dev';
 const send=async(route,{method='GET',body,token,originValue=origin,ip='192.0.2.10'}={})=>{
  const headers={Origin:originValue,'CF-Connecting-IP':ip};if(body!==undefined)headers['Content-Type']='application/json';if(token)headers.Authorization='Bearer '+token;
  return worker.fetch(new Request(base+route,{method,headers,...(body!==undefined?{body:JSON.stringify(body)}:{})}),env);
 };
 try{
  let r=await send('/api/providers');assert.equal(r.status,401,'las rutas privadas requieren sesión');
  r=await send('/health',{originValue:'https://evil.example'});assert.equal(r.status,403,'CORS rechaza orígenes externos');
  r=await send('/auth/login',{method:'POST',body:{password:'bad'},ip:'192.0.2.11'});assert.equal(r.status,401,'contraseña incorrecta denegada');
  r=await send('/auth/login',{method:'POST',body:{password:admin}});assert.equal(r.status,200);const login=await r.json(),token=login.token;assert.ok(token.length>40);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-test-12345',name:'Proveedor test',endpoint:'https://api.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',key:apiKey}});
  assert.equal(r.status,200);const saved=await r.json();assert.equal(saved.provider.id,'provider-test-12345');
  assert.equal(JSON.stringify(saved).includes(apiKey),false,'la respuesta de alta nunca devuelve la clave');
  const stored=db.providers.get('provider-test-12345');assert.ok(stored.key_ciphertext);assert.notEqual(stored.key_ciphertext,apiKey);assert.notEqual(stored.key_iv,apiKey);
  r=await send('/api/providers',{token});const listing=await r.json();assert.equal(listing.providers.length,1);assert.equal(JSON.stringify(listing).includes(apiKey),false,'el listado no expone secretos');
  r=await send('/api/providers/provider-test-12345/models',{method:'POST',token,body:{}});const models=await r.json();assert.deepEqual(models.models,['model-good','model-next']);
  r=await send('/api/providers/provider-test-12345/test',{method:'POST',token,body:{model:'model-good'}});assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-test-12345',name:'Proveedor test',endpoint:'https://api.example.com/v1',modelsPath:'/models',chatPath:'/chat/completions',authMode:'bearer',key:apiKey+'-rotated'}});assert.equal(r.status,200);assert.deepEqual((await r.json()).provider.workingModels,[],'al rotar la clave invalida modelos probados con credenciales anteriores');
  r=await send('/api/providers/provider-test-12345/test',{method:'POST',token,body:{model:'model-good'}});assert.equal(r.status,200,'se vuelve a probar con la clave nueva');
  assert.ok(upstreamCalls[1].options.headers.Authorization.includes(apiKey),'el Worker recupera y envía la clave al proveedor');
  r=await send('/api/providers/provider-test-12345/chat',{method:'POST',token,body:{model:'model-unverified',messages:[{role:'user',content:'hola'}]}});assert.equal(r.status,400,'un modelo no probado se rechaza');
  r=await send('/api/providers/provider-test-12345/chat',{method:'POST',token,body:{model:'model-good',messages:[{role:'user',content:'hola'}]}});assert.equal(r.status,200);const answer=await r.json();assert.match(answer.text,/operations/);assert.equal(JSON.stringify(answer).includes(apiKey),false);
  r=await send('/api/providers',{method:'POST',token,body:{id:'provider-invalid-123',name:'local',endpoint:'https://127.0.0.1/v1',key:apiKey}});assert.equal(r.status,400,'el proxy bloquea endpoints con IP local');
  r=await send('/api/providers/provider-test-12345',{method:'DELETE',token});assert.equal(r.status,200);assert.equal(db.providers.size,0);
  const opts=await worker.fetch(new Request(base+'/health',{method:'OPTIONS',headers:{Origin:origin}}),env);assert.equal(opts.status,204);
  console.log('Worker privado: 20 comprobaciones de auth, CORS, AES-GCM, proxy y validación superadas.');
 }finally{globalThis.fetch=originalFetch;}
})().catch(e=>{console.error(e);process.exit(1);});
