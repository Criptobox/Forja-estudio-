const fs=require('fs');const path=require('path');const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8');
const html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8');
const checks=[
['estado persistente de estilos internos',/innerStyles:\{\}/.test(js)],
['selector estable por ruta DOM',/function innerSelector\(el,root\)/.test(js)&&/nth-of-type/.test(js)],
['aplicación de estilos al render',/function applyInnerMarkup\(block\)/.test(js)&&/applyInnerMarkup\(editedBlock\(block/.test(js)],
['exportación incluye estilos internos',/function blockMarkup[\s\S]*?applyInnerMarkup\(editedBlock\(block/.test(js)],
['normalización de estilos internos',/const innerStyles=\{\};if\(raw\.innerStyles/.test(js)],
['snapshot conserva estilos internos',/innerStyles:state\.innerStyles/.test(js)],
['modo de selección interna',/editor-inner-toggle/.test(js)&&/editorInnerMode/.test(js)],
['edición de texto de elemento',/editorInnerText/.test(html)&&/typeof item\.text==='string'/.test(js)],
['controles visuales de elemento',/editorInnerColor/.test(html)&&/editorInnerRadius/.test(html)],
['acciones aplicar y restaurar',/editor-inner-apply/.test(js)&&/editor-inner-reset/.test(js)],
['estado accesible',/editorInnerStatus/.test(html)],
['límites de selector y valores',/x\.selector\.length<500/.test(js)&&/slice\(0,100\)/.test(js)]
];
let failed=0;for(const [name,ok] of checks){console.log((ok?'OK ':'FAIL ')+name);if(!ok)failed++;}
if(failed)process.exit(1);console.log(`${checks.length} comprobaciones superadas.`);
