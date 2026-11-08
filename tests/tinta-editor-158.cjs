const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8');
const checks=[
['desplazamiento libre horizontal y vertical',/editorInnerX/.test(html)&&/editorInnerY/.test(html)&&/style\.translate=x\+'px '\+y\+'px'/.test(js)],
['rejilla magnética configurable',/editorInnerSnap/.test(html)&&/Math\.round\(Number\(v\)\/snap\)\*snap/.test(js)],
['separación entre hijos del contenedor',/editorInnerGap/.test(html)&&/target\.style\.rowGap/.test(js)&&/target\.style\.columnGap/.test(js)],
['alineación a izquierda y derecha',/editor-inner-align-left/.test(html)&&/editor-inner-align-right/.test(html)&&/pr\.right-er\.right/.test(js)],
['alineación superior e inferior',/editor-inner-align-top/.test(html)&&/editor-inner-align-bottom/.test(html)&&/pr\.bottom-er\.bottom/.test(js)],
['centrado horizontal y vertical',/editor-inner-align-x/.test(html)&&/editor-inner-align-y/.test(html)],
['restablecimiento de posición',/editor-inner-position-reset/.test(html)&&/removeProperty\('translate'\)/.test(js)],
['tamaño de icono independiente',/editorInnerIconSizeEnabled/.test(html)&&/icon\.style\.width/.test(js)],
['rotación independiente del tamaño',/editorInnerIconRotate/.test(html)&&/if\(icon\)icon\.style\.rotate/.test(js)],
['relleno y trazo SVG controlables',/editorInnerSvgFillEnabled/.test(html)&&/editorInnerSvgStrokeEnabled/.test(html)&&/setAttribute\('stroke-linecap'/.test(js)],
['variantes de extremos y uniones SVG',/editorInnerSvgLinecap/.test(html)&&/editorInnerSvgLinejoin/.test(html)],
['posiciones guardadas en HTML interno',/persistInnerDom\('Alinear elemento '\+axis\)/.test(js)&&/persistInnerDom\('Personalizar elemento interno'\)/.test(js)],
['controles de inspector en móvil',/editor-inner-grid select/.test(css)&&/editor-inner-grid input\[type=checkbox\]/.test(css)],
['versión 15.14 visible',/ESTILOS 15\.(?:13|14) · EDITOR/.test(html)]
];
let failed=0;for(const [name,pass] of checks){console.log((pass?'OK ':'FAIL ')+name);if(!pass)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones de 15.14 superadas.');
