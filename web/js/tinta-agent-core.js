/* Contrato seguro de operaciones del agente Tinta. No ejecuta HTML ni JavaScript remoto. */
(function(root){'use strict';
 const ROLES=['header','inputs','data','cards','list','chat','avatars','templates','forms','sheets','notices','actions','nav'];
 const TYPES={set_palette:['type','paletteId'],add_component:['type','blockId','role'],remove_component:['type','role'],replace_component:['type','role','blockId'],update_text:['type','blockId','fieldIndex','value']};
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function validatePlan(operations,ctx={}){
  const errors=[];if(!Array.isArray(operations)||operations.length>12)return {ok:false,errors:['El plan debe contener entre 1 y 12 operaciones.']};
  if(!operations.length)return {ok:false,errors:['El plan está vacío.']};
  operations.forEach((op,i)=>{
   const fail=m=>errors.push('Operación '+(i+1)+': '+m);
   if(!op||typeof op!=='object'||Array.isArray(op)){fail('formato inválido.');return;}
   const keys=Object.prototype.hasOwnProperty.call(TYPES,op.type)?TYPES[op.type]:null;if(!keys){fail('tipo no permitido.');return;}
   if(Object.keys(op).some(k=>!keys.includes(k))||keys.some(k=>!own(op,k))){fail('propiedades no permitidas o incompletas.');return;}
   if(op.type==='set_palette'&&(op.paletteId!==null&&(typeof op.paletteId!=='string'||op.paletteId.length>80||!ctx.hasPalette?.(op.paletteId))))fail('paleta desconocida.');
   if(['add_component','replace_component','update_text'].includes(op.type)&&(typeof op.blockId!=='string'||op.blockId.length>120||!ctx.hasBlock?.(op.blockId)))fail('componente desconocido.');
   if(['add_component','replace_component','remove_component'].includes(op.type)&&!ROLES.includes(op.role))fail('categoría no permitida.');
   if(op.type==='add_component'&&ctx.roleOf?.(op.blockId)!==op.role)fail('la categoría no coincide con el componente.');
   if(op.type==='replace_component'&&ctx.roleOf?.(op.blockId)!==op.role)fail('la categoría no coincide con el reemplazo.');
   if(op.type==='update_text'&&(!Number.isInteger(op.fieldIndex)||op.fieldIndex<0||op.fieldIndex>30||(ctx.fieldCount&&op.fieldIndex>=ctx.fieldCount(op.blockId))||typeof op.value!=='string'||!op.value.trim()||op.value.length>100))fail('texto o campo inválido.');
  });
  return {ok:errors.length===0,errors};
 }
 function makePlan(operations,summary){return {version:1,mode:'local-rules',operations,summary:Array.isArray(summary)?summary.slice(0,12):[]};}
 root.TintaAgentCore={ROLES,validatePlan,makePlan};
 if(typeof module!=='undefined')module.exports=root.TintaAgentCore;
})(typeof window!=='undefined'?window:globalThis);
