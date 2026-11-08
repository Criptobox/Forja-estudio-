const assert=require('node:assert/strict');
const P=require('../web/js/tinta-palettes.js');
const pairs=[['#ff0000',{h:0,s:100,l:50}],['#00ff00',{h:120,s:100,l:50}],['#0000ff',{h:240,s:100,l:50}],['#ffffff',{h:0,s:0,l:100}],['#000000',{h:0,s:0,l:0}]];
for(const [hex,hsl] of pairs){assert.deepEqual(P.hexToHsl(hex),hsl);assert.equal(P.hslToHex(hsl.h,hsl.s,hsl.l),hex);}
assert.equal(P.all().length,8);assert.ok(P.all().every(P.valid));
const made=P.createFromHsl({name:'Prueba HSL',h:210,s:70,l:55});
assert.ok(made&&P.valid(made));assert.equal(P.get(made.id).name,'Prueba HSL');assert.ok(P.contrast(made.ink,made.bg)>=7);assert.ok(P.contrast(made.ink,made.surface)>=7);assert.ok(P.contrast(made.accent,P.onAccent(made.accent))>=4.5);
assert.equal(P.removeCustom(made.id),true);assert.equal(P.get(made.id),null);
assert.equal(P.hslToHex(12,100,65),'#ff704d');
console.log('Pruebas HSL correctas: conversiones, generación, contraste y eliminación.');
