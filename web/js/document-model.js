/* Estilos 15 · Modelo de documento compartido (adaptador inicial del constructor clásico).
   No se conecta al guardado principal hasta superar pruebas de equivalencia y migración. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EstilosDocumentModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCHEMA = 'estilos-document';
  const VERSION = 1;
  const MAX_SCREENS = 8;
  const MAX_NODES = 20;

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function uniqueId(value, fallback) {
    const id = typeof value === 'string' ? value.trim() : '';
    return (id || fallback).slice(0, 80);
  }

  function screenFromLegacy(screen, index) {
    const source = isObject(screen) ? screen : {};
    const selected = Array.isArray(source.selected) ? source.selected : [];
    const layers = Array.isArray(source.layers) ? source.layers : [];
    const nodes = [];
    for (let i = 0; i < Math.min(selected.length, MAX_NODES); i += 1) {
      const componentId = String(selected[i] || '').trim();
      if (!componentId) continue;
      const layer = isObject(layers[i]) ? clone(layers[i]) : {};
      const uid = uniqueId(layer.uid, `legacy-node-${index + 1}-${i + 1}`);
      layer.uid = uid;
      nodes.push({ uid, componentId, props: layer });
    }
    return {
      id: uniqueId(source.id, `screen-${index + 1}`),
      name: String(source.title || `Pantalla ${index + 1}`).slice(0, 60),
      description: String(source.subtitle || '').slice(0, 120),
      settings: {
        hero: source.hero !== false,
        nav: source.nav !== false,
        activeNodeId: nodes[Math.max(0, Math.min(nodes.length - 1, Number(source.activeLayer) || 0))]?.uid || null
      },
      nodes
    };
  }

  function fromLegacyBuilder(builder, options) {
    const source = isObject(builder) ? builder : {};
    const rawScreens = Array.isArray(source.screens) && source.screens.length
      ? source.screens.slice(0, MAX_SCREENS)
      : [{
          id: 'screen-home', title: source.title, subtitle: source.subtitle,
          hero: source.hero, nav: source.nav,
          selected: source.selected, layers: source.layers, activeLayer: source.activeLayer
        }];
    const screens = rawScreens.map(screenFromLegacy);
    const activeIndex = Math.max(0, Math.min(screens.length - 1, Number(source.activeScreenIndex) || 0));
    return {
      schema: SCHEMA,
      schemaVersion: VERSION,
      kind: 'app-builder',
      projectId: uniqueId(options && options.projectId, 'local-project'),
      updatedAt: options && typeof options.updatedAt === 'string' ? options.updatedAt : null,
      settings: {
        title: String(source.title || 'Mi nueva interfaz').slice(0, 60),
        subtitle: String(source.subtitle || 'Una experiencia diseñada a tu manera').slice(0, 100),
        palette: source.palette || '#635BFF',
        background: source.bg || '#F5F6FA',
        font: source.font || 'Inter',
        radius: Number(source.radius) || 20,
        device: source.device || 'm',
        exportDark: !!source.exportDark,
        imageQuality: source.imageQuality || 'mid'
      },
      activeScreenId: screens[activeIndex]?.id || screens[0].id,
      screens
    };
  }

  function validate(document) {
    const errors = [];
    if (!isObject(document)) return { valid: false, errors: ['El documento debe ser un objeto JSON.'] };
    if (document.schema !== SCHEMA) errors.push('Esquema de documento no reconocido.');
    if (document.schemaVersion !== VERSION) errors.push(`Versión de esquema no compatible: ${document.schemaVersion}.`);
    if (document.kind !== 'app-builder') errors.push('Tipo de documento no compatible.');
    if (!Array.isArray(document.screens) || document.screens.length < 1 || document.screens.length > MAX_SCREENS) {
      errors.push(`El documento debe contener entre 1 y ${MAX_SCREENS} pantallas.`);
    }
    const screenIds = new Set();
    const nodeIds = new Set();
    (Array.isArray(document.screens) ? document.screens : []).forEach((screen, si) => {
      if (!isObject(screen) || typeof screen.id !== 'string' || !screen.id.trim()) {
        errors.push(`La pantalla ${si + 1} no tiene un identificador válido.`);
        return;
      }
      if (screenIds.has(screen.id)) errors.push(`Identificador de pantalla duplicado: ${screen.id}.`);
      screenIds.add(screen.id);
      if (!Array.isArray(screen.nodes) || screen.nodes.length > MAX_NODES) {
        errors.push(`La pantalla ${screen.id} supera el límite de ${MAX_NODES} elementos o tiene nodos inválidos.`);
        return;
      }
      screen.nodes.forEach((node, ni) => {
        if (!isObject(node) || typeof node.uid !== 'string' || !node.uid.trim() || typeof node.componentId !== 'string' || !node.componentId.trim()) {
          errors.push(`Elemento ${ni + 1} de ${screen.id}: uid o componentId inválido.`);
          return;
        }
        if (nodeIds.has(node.uid)) errors.push(`Identificador de elemento duplicado: ${node.uid}.`);
        nodeIds.add(node.uid);
        if (!isObject(node.props)) errors.push(`Las propiedades de ${node.uid} deben ser un objeto.`);
      });
    });
    if (screenIds.size && !screenIds.has(document.activeScreenId)) errors.push('La pantalla activa no existe.');
    if (!isObject(document.settings)) errors.push('Faltan los ajustes del proyecto.');
    return { valid: errors.length === 0, errors };
  }

  function toLegacyBuilder(document) {
    const check = validate(document);
    if (!check.valid) {
      const error = new Error('No se puede convertir el documento: ' + check.errors.join(' '));
      error.validation = check;
      throw error;
    }
    const settings = clone(document.settings);
    const screens = document.screens.map((screen) => {
      const nodes = screen.nodes.map((node) => {
        const props = clone(node.props);
        props.uid = node.uid;
        return { componentId: node.componentId, props };
      });
      const activeLayer = Math.max(0, nodes.findIndex((node) => node.props.uid === screen.settings?.activeNodeId));
      return {
        id: screen.id,
        title: screen.name,
        subtitle: screen.description || '',
        hero: screen.settings?.hero !== false,
        nav: screen.settings?.nav !== false,
        selected: nodes.map((node) => node.componentId),
        layers: nodes.map((node) => node.props),
        activeLayer
      };
    });
    const activeScreenIndex = Math.max(0, screens.findIndex((screen) => screen.id === document.activeScreenId));
    const active = screens[activeScreenIndex];
    return {
      title: active.title || settings.title,
      subtitle: active.subtitle || settings.subtitle,
      palette: settings.palette,
      bg: settings.background,
      font: settings.font,
      radius: settings.radius,
      device: settings.device,
      exportDark: settings.exportDark,
      imageQuality: settings.imageQuality,
      screens,
      activeScreenIndex,
      selected: clone(active.selected),
      layers: clone(active.layers),
      activeLayer: active.activeLayer,
      hero: active.hero,
      nav: active.nav
    };
  }

  function serialize(document) {
    const check = validate(document);
    if (!check.valid) throw new Error('Documento inválido: ' + check.errors.join(' '));
    return JSON.stringify(document);
  }

  function parse(raw) {
    let value;
    try { value = typeof raw === 'string' ? JSON.parse(raw) : clone(raw); }
    catch (_) { return { ok: false, errors: ['El JSON está dañado o incompleto.'] }; }
    const result = validate(value);
    return result.valid ? { ok: true, document: value, errors: [] } : { ok: false, errors: result.errors };
  }

  return Object.freeze({ SCHEMA, VERSION, MAX_SCREENS, MAX_NODES, clone, fromLegacyBuilder, toLegacyBuilder, validate, serialize, parse });
});
