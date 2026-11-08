const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8');
const checks=[
['inspector amplía radio a 48 px',/editorInnerRadius[^>]*max="48"/.test(html)],
['control de grosor de borde',/editorInnerBorderWidth/.test(html)&&/style\.borderWidth=borderWidth\+'px'/.test(js)],
['control de opacidad',/editorInnerOpacity/.test(html)&&/style\.opacity=String\(Number\(\$\('editorInnerOpacity'\)\.value\)\/100\)/.test(js)],
['control de relleno interior',/editorInnerPadding/.test(html)&&/style\.padding=Number\(\$\('editorInnerPadding'\)\.value\)\+'px'/.test(js)],
['ancho conserva valor original por defecto',/editorInnerWidth/.test(html)&&/value==='original'\)style\.removeProperty\('width'\)/.test(js)],
['presets de sombra',/editorInnerShadow/.test(html)&&/0 10px 28px/.test(js)],
['SVG relleno con activación explícita',/editorInnerSvgFillEnabled/.test(html)&&/editorInnerSvgFillEnabled'\)\.checked\)vector\.setAttribute\('fill'/.test(js)],
['SVG trazo con activación explícita',/editorInnerSvgStrokeEnabled/.test(html)&&/editorInnerSvgStrokeEnabled'\)\.checked\)/.test(js)],
['edición SVG por atributos',/setAttribute\('stroke-width'/.test(js)&&/setAttribute\('fill'/.test(js)],
['cambios se guardan en estructura del bloque',/persistInnerDom\('Personalizar elemento interno'\)/.test(js)],
['capas internas muestran descripción',/const raw=\(el\.getAttribute\('aria-label'\)/.test(js)],
['controles responsivos presentes',/editor-inner-grid select/.test(css)&&/editor-inner-grid input\[type=checkbox\]/.test(css)],
['versión 15.14 visible',/ESTILOS 15\.(?:13|14) · EDITOR/.test(html)]
];
let failed=0;for(const [name,pass] of checks){console.log((pass?'OK ':'FAIL ')+name);if(!pass)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones de 15.14 superadas.');
