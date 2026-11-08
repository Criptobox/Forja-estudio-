const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8');
const checks=[
['árbol de capas jerárquico',/function paintInnerLayerList\(\)[\s\S]*?add\(root,0,0\)/.test(js)],
['selección desde cualquier nodo del árbol',/editorInnerNode=el;editorInnerNodes=new Set\(\[el\]\);editorInnerSelector=innerSelector/.test(js)],
['límite de rendimiento del árbol',/const max=120,maxDepth=7/.test(js)],
['capas accesibles desde panel',/aria-label="Árbol jerárquico de capas internas"/.test(html)],
['actualización manual del árbol',/editor-inner-layer-refresh/.test(html)&&/paintInnerLayerList\(\)/.test(js)],
['gestos de puntero instalados en elemento',/function attachInnerPointerMove\(target,root\)/.test(js)&&/addEventListener\('pointerdown'/.test(js)],
['exclusión de controles interactivos',/button,a,input,select,textarea,\[contenteditable="true"\]/.test(js)],
['snap de bordes y centros',/kind:'left'/.test(js)&&/kind:'right'/.test(js)&&/kind:'center'/.test(js)],
['tolerancia magnética de 7 px',/Math\.abs\(v\.d\)<=7/.test(js)],
['persistencia del movimiento',/persistInnerDom\('Mover y alinear elemento interno'\)/.test(js)],
['marcas visuales de alineación',/editor-snap-match/.test(css)&&/editor-snap-guide/.test(css)],
['panel táctil optimizado',/@media\(max-width:640px\)[\s\S]*?editor-layer-tree-item/.test(css)],
['versión 15.14 visible',/ESTILOS 15\.(?:13|14) · EDITOR/.test(html)],
['actualización de cache',/tinta-2026\.11\.17/.test(fs.readFileSync(path.join(root,'web/sw.js'),'utf8'))]
];
let failed=0;for(const [name,pass] of checks){console.log((pass?'OK ':'FAIL ')+name);if(!pass)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones de 15.14 superadas.');
