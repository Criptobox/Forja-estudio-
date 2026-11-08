const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8');
const checks=[
['estado interno inicializado',/innerHtml:\{\}/.test(js)],
['estructura interna aplicada al render',/function applyInnerMarkup\(block\)[\s\S]*?state\.innerHtml\[block\.id\]/.test(js)],
['normalización con límite de tamaño',/markup\.length>120000/.test(js)],
['eliminación de scripts y etiquetas peligrosas',/querySelectorAll\('script,iframe,object,embed,link,meta,base'\)/.test(js)],
['eliminación de atributos peligrosos',/srcdoc/.test(js)&&/formaction/.test(js)&&/javascript:/.test(js)],
['snapshot guarda estructura',/innerHtml:state\.innerHtml/.test(js)],
['reordenación interna arriba y abajo',/function moveInnerElement/.test(js)&&/editor-inner-up/.test(js)&&/editor-inner-down/.test(js)],
['duplicación de nodo',/cloneNode\(true\)/.test(js)&&/editor-inner-duplicate/.test(js)],
['agrupación de hermanos',/function groupInnerElements/.test(js)&&/editor-inner-group/.test(js)],
['desagrupación',/function ungroupInnerElement/.test(js)&&/editor-inner-ungroup/.test(js)],
['drag and drop entre hermanos',/ondragstart/.test(js)&&/ondrop/.test(js)&&/insertBefore\(editorDraggingNode,dropTarget\)/.test(js)],
['selección múltiple interna',/ev\.ctrlKey\|\|ev\.metaKey/.test(js)&&/editorInnerNodes/.test(js)],
['capas internas en inspector',/editorInnerLayers/.test(html)&&/function paintInnerLayerList/.test(js)],
['historial registra operaciones internas',/save\(action,'editor-inner'\)/.test(js)],
['controles visibles en interfaz',/editor-inner-actions/.test(css)&&/editor-inner-duplicate/.test(html)]
];
let failed=0;for(const [n,ok] of checks){console.log((ok?'OK ':'FAIL ')+n);if(!ok)failed++;}if(failed)process.exit(1);console.log(`${checks.length} comprobaciones superadas.`);
