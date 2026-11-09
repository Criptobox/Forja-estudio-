const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'web/crear.html'),'utf8'),js=fs.readFileSync(path.join(root,'web/js/crear.js'),'utf8'),css=fs.readFileSync(path.join(root,'web/css/crear.css'),'utf8'),sw=fs.readFileSync(path.join(root,'web/sw.js'),'utf8');
const checks=[
['home centrado en describir la idea',/¿Qué quieres crear\?/.test(html)&&/Crear mi propuesta/.test(html)],
['recomendación para gastronomía',/caf\[eé\].*Cálido y cercano/s.test(js)],
['recomendación para finanzas',/finanza\|dinero\|banco\|balance/.test(js)&&/Fintech limpio/.test(js)],
['recomendación para comercio',/tienda\|vender\|ropa\|producto/.test(js)&&/Comercio visual/.test(js)],
['recomendación para bienestar',/gimnas\|fitness\|entren/.test(js)&&/Claro y activo/.test(js)],
['selección de receta según idea',/rec\.recipe\.forEach/.test(js)],
['flujo automático lleva a vista previa',/state\.composed=!!state\.selected\.length&&!conflicts\(\)\.length;save\('Preparar propuesta'[\s\S]*?go\('review'\)/.test(js)],
['texto se adapta cuando existe sector',/adaptTexts\(\);state\.composed=!!state\.selected\.length/.test(js)],
['panel explica estilo, paleta y estructura',/id="agentRecPoints"/.test(html)&&/Estilo visual/.test(js)&&/Paleta sugerida/.test(js)&&/Estructura/.test(js)],
['personalización manual queda opcional',/<details class="agent-advanced"><summary>Personalizar manualmente/.test(html)],
['editor profesional queda plegado',/<details class="agent-advanced agent-editor-advanced">/.test(html)],
['usuario puede volver a cambiar la idea',/data-act="agent-new-idea"/.test(html)&&/agent-new-idea/.test(js)],
['sin prometer IA conectada',/reglas de diseño locales/.test(html)],
['estilos de interfaz simplificada',/\.agent-recommendation/.test(css)&&/\.agent-advanced>summary/.test(css)],
['versión vigente visible',/ESTILOS 15\.14 · EDITOR/.test(html)],
['caché vigente actualizada',/tinta-2026\.11\.08-private-ai/.test(sw)]
];
let failed=0;for(const [name,ok] of checks){console.log((ok?'OK ':'FAIL ')+name);if(!ok)failed++;}if(failed)process.exit(1);console.log(checks.length+' comprobaciones de 15.10 superadas.');
