const assert = require('node:assert/strict');
const Model = require('../web/js/document-model.js');

function sampleBuilder() {
  return {
    title: 'Proyecto base', subtitle: 'Prueba de migración', palette: '#635BFF', bg: '#F5F6FA',
    font: 'Inter', radius: 20, device: 'm', exportDark: false, imageQuality: 'mid',
    activeScreenIndex: 1,
    screens: [
      { id: 'screen-home', title: 'Inicio', subtitle: 'Resumen', hero: true, nav: true, activeLayer: 0,
        selected: ['tar-1'], layers: [{ uid: 'layer-a', label: 'Saldo', bg: '#fff', locked: true, mediaEdits: { image: 'idb:asset-1' } }] },
      { id: 'screen-profile', title: 'Perfil', subtitle: 'Cuenta', hero: false, nav: true, activeLayer: 0,
        selected: ['bot-1'], layers: [{ uid: 'layer-b', label: 'Guardar', radius: 18, textEdits: { title: 'Hola' } }] }
    ]
  };
}

let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks += 1; };
const source = sampleBuilder();
const document = Model.fromLegacyBuilder(source, { projectId: 'test-project', updatedAt: '2026-11-08T00:00:00.000Z' });
ok(document.schema === 'estilos-document', 'schema assigned');
ok(document.schemaVersion === 1, 'schema version assigned');
ok(document.screens.length === 2, 'all screens converted');
ok(document.activeScreenId === 'screen-profile', 'active screen preserved');
ok(document.screens[0].nodes[0].componentId === 'tar-1', 'component ID preserved');
ok(document.screens[0].nodes[0].props.locked === true, 'layer lock preserved');
ok(document.screens[0].nodes[0].props.mediaEdits.image === 'idb:asset-1', 'media reference preserved');
ok(document.screens[1].nodes[0].props.textEdits.title === 'Hola', 'text overrides preserved');
ok(Model.validate(document).valid, 'converted document validates');
const roundTrip = Model.toLegacyBuilder(document);
ok(roundTrip.screens.length === source.screens.length, 'screen count round-trips');
ok(roundTrip.activeScreenIndex === source.activeScreenIndex, 'active screen index round-trips');
ok(JSON.stringify(roundTrip.screens.map(s => [s.id, s.selected, s.layers])) === JSON.stringify(source.screens.map(s => [s.id, s.selected, s.layers])), 'screen layers and component IDs round-trip');
ok(roundTrip.palette === source.palette && roundTrip.bg === source.bg, 'global visual settings round-trip');
const parsed = Model.parse(Model.serialize(document));
ok(parsed.ok, 'serialize/parse round-trip');
const duplicate = Model.clone(document);
duplicate.screens[1].nodes[0].props.label = 'Changed';
ok(document.screens[1].nodes[0].props.label === 'Guardar', 'clone is deeply independent');
const invalid = Model.clone(document);
invalid.screens[1].nodes[0].uid = invalid.screens[0].nodes[0].uid;
ok(!Model.validate(invalid).valid, 'duplicate node IDs rejected');
ok(!Model.parse('{broken').ok, 'malformed JSON rejected safely');
const emptyLegacy = Model.fromLegacyBuilder({ title: 'Vacío' });
ok(emptyLegacy.screens.length === 1 && emptyLegacy.screens[0].nodes.length === 0, 'legacy single-screen project supported');
const partialLegacy = Model.fromLegacyBuilder({ selected: ['bot-1'], layers: [] });
ok(partialLegacy.screens[0].nodes.length === 1 && partialLegacy.screens[0].nodes[0].componentId === 'bot-1', 'component survives missing legacy layer properties');
console.log(`${checks} comprobaciones del modelo de documento correctas.`);
