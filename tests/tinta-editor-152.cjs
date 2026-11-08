const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'web/crear.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'web/js/crear.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web/css/crear.css'), 'utf8');
const has = (pattern, source, label) => assert.match(source, pattern, label);
has(/id="visualEditor"/, html, 'visual editor section exists');
has(/id="editorLayerList"/, html, 'layer list exists');
has(/id="editorInspectorFields"/, html, 'contextual inspector exists');
for (const id of ['editorWidth','editorGap','editorOpacity','editorRadius','editorAlign']) {
  has(new RegExp('id="'+id+'"'), html, `inspector field ${id} exists`);
}
has(/data-act="editor-multi-toggle"/, html, 'touch-friendly multi-selection toggle exists');
for (const action of ['editor-toggle','editor-multi-toggle','editor-select','editor-copy','editor-paste','editor-reset','editor-up','editor-down']) {
  has(new RegExp("case '"+action+"'"), js, `action ${action} is wired`);
}
has(/layout:state\.layout,layerOrder:state\.layerOrder/, js, 'layout and layer order are included in saved draft');
has(/layout,layerOrder};/, js, 'layout and layer order are restored from project data');
has(/function applyEditorLayout/, js, 'editor layout is applied to preview blocks');
has(/width:n\(v\.width,60,100,5\)\?\?100/, js, 'malformed imported widths fall back to a safe default');
has(/host\.classList\.add\('editor-layer'\)/, js, 'existing component hosts remain direct preview layers');
has(/function moveEditorLayer/, js, 'layer reordering is implemented');
has(/function pasteEditorStyle/, js, 'copy/paste style is implemented');
has(/function exportHTML\(\)[\s\S]*layout-layer/, js, 'HTML export preserves visual layout settings');
has(/selectEditorLayer\(it\.id,editorMultiMode\|\|ev\.shiftKey\|\|ev\.ctrlKey\|\|ev\.metaKey\)/, js, 'multi-selection by modifier key is implemented');
has(/editorMode\)\{el\.tabIndex=0/, js, 'keyboard focus is enabled while editing');
has(/\.editor-workbench\{grid-template-columns:1fr\}/, css, 'editor switches to single column on mobile');
console.log('Estilos 15.2: 20 comprobaciones de editor visual, capas, inspector, persistencia y móvil correctas.');
