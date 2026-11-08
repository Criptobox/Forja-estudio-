const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),root=path.resolve(__dirname,'..');
const assets=fs.readFileSync(path.join(root,'web/js/tinta-assets.js'),'utf8'),editor=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8');
const checks=[
['ajuste cover/contain/fill normalizado',/\['cover','contain','fill'\]/.test(assets)],
['posición horizontal y vertical limitada 0–100',/positionX:position\(value\.positionX\)/.test(assets)&&/positionY:position\(value\.positionY\)/.test(assets)],
['radio limitado a 48 px',/Math\.min\(48,Math\.max\(0,Math\.round\(Number\(value\.radius\)\)\)\)/.test(assets)],
['object-fit aplicado al HTML',/object-fit:'\+\(image\.fit\|\|'cover'\)/.test(assets)],
['object-position aplicado al HTML',/object-position:/.test(assets)],
['redondeo de imagen aplicado',/img\.style\.borderRadius=image\.radius\+'px'/.test(assets)],
['controles de ajuste presentes',/data-media-fit/.test(editor)&&/data-media-position-x/.test(editor)&&/data-media-position-y/.test(editor)&&/data-media-radius/.test(editor)],
['ajustes se guardan al aplicar',/next\.images\[i\]=src\?\{src,alt,fit,positionX,positionY,radius\}/.test(editor)],
['compatibilidad con fotos antiguas',/value\?\.fit\|\|'cover'/.test(editor)&&/value\?\.positionX\?\?50/.test(editor)],
['controles adaptados a móvil',/#mediaFields input,#mediaFields select/.test(css)&&/input\[type=range\]/.test(css)],
['versión del editor visible',/ESTILOS 15\.(?:13|14) · EDITOR/.test(html)]
];
// Prueba funcional de normalización: límites, valores válidos y compatibilidad antigua.
const api=vm.runInNewContext(assets+';TintaAssets',{URL});
const catalog={'demo':{id:'demo'}};
const normalized=api.normalize({demo:{images:[
 {src:'https://example.com/photo.jpg',alt:'Foto',fit:'contain',positionX:130,positionY:-8,radius:70},
 {src:'https://example.com/old.jpg',alt:'Antigua'}
]}},catalog);
assert.equal(normalized.demo.images[0].fit,'contain');
assert.equal(normalized.demo.images[0].positionX,100);
assert.equal(normalized.demo.images[0].positionY,0);
assert.equal(normalized.demo.images[0].radius,48);
assert.equal(normalized.demo.images[1].fit,'cover');
assert.equal(normalized.demo.images[1].positionX,50);
assert.equal(normalized.demo.images[1].radius,null);
checks.push(['normalización funcional y compatibilidad antigua',true]);
let failed=0;for(const [name,pass] of checks){console.log((pass?'OK ':'FAIL ')+name);if(!pass)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones de 15.14 superadas.');
