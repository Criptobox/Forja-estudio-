/* Paletas de Tinta: una capa de color para toda la pantalla (fondo, tarjetas y botones).
   Es una CAPA: no escribe estilos en cada bloque, así que se quita de un toque y alcanza también
   a los bloques que añadas después. Los estilos propios de un bloque (Diseño / Color) mandan sobre
   la paleta. Solo paletas claras: cabeceras y barras conservan su diseño original. */
(function (root) {
  'use strict';
  const LIST = [
    { id: 'tinta', name: 'Tinta', mood: 'Papel cálido y coral', bg: '#f5f4ef', surface: '#ffffff', accent: '#ff704b', accent2: '#ffb08f', ink: '#242421', line: '#e4e0d5' },
    { id: 'cafe', name: 'Café tostado', mood: 'Marrones cálidos', bg: '#f4ece1', surface: '#fffaf3', accent: '#8a5a3c', accent2: '#d9a066', ink: '#2b1d14', line: '#e7d8c4' },
    { id: 'oceano', name: 'Océano', mood: 'Azules limpios', bg: '#eaf3f6', surface: '#ffffff', accent: '#0e7490', accent2: '#67c6d9', ink: '#0f2a33', line: '#cfe3ea' },
    { id: 'bosque', name: 'Bosque', mood: 'Verdes naturales', bg: '#eef3ec', surface: '#fbfdf9', accent: '#2f6b3f', accent2: '#9fd3a8', ink: '#14281a', line: '#d4e2d1' },
    { id: 'lavanda', name: 'Lavanda', mood: 'Violetas suaves', bg: '#f1eefa', surface: '#ffffff', accent: '#6d5bd0', accent2: '#b7a9f0', ink: '#231d46', line: '#dcd6f2' },
    { id: 'atardecer', name: 'Atardecer', mood: 'Naranjas vivos', bg: '#fdf1ea', surface: '#fffaf6', accent: '#e4572e', accent2: '#ffb347', ink: '#3a1d12', line: '#f1d9cb' },
    { id: 'rosa', name: 'Rosa', mood: 'Rosas con carácter', bg: '#fbeff3', surface: '#ffffff', accent: '#c2335f', accent2: '#f4a6bf', ink: '#3a1224', line: '#f1d2dd' },
    { id: 'grafito', name: 'Grafito', mood: 'Neutros serios', bg: '#e9eaec', surface: '#ffffff', accent: '#2b2f36', accent2: '#8b93a1', ink: '#15171b', line: '#d5d8dd' }
  ];
  const HEX = /^#[0-9a-f]{6}$/i;
  const valid = p => !!p && ['bg', 'surface', 'accent', 'accent2', 'ink', 'line'].every(k => typeof p[k] === 'string' && HEX.test(p[k]));
  const CUSTOM_KEY = 'estilos-tinta-custom-palettes-v1';
  const clamp = (n,min,max)=>Math.min(max,Math.max(min,n));
  function hslToHex(h,s,l){
    h=((Number(h)%360)+360)%360;s=clamp(Number(s),0,100)/100;l=clamp(Number(l),0,100)/100;
    const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1));};
    return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
  }
  function hexToHsl(hex){
    if(!HEX.test(hex))return null;
    const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
    let h=0;const l=(max+min)/2;let sat=0;
    if(d){sat=d/(1-Math.abs(2*l-1));if(max===r)h=60*(((g-b)/d)%6);else if(max===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);}
    return {h:Math.round((h+360)%360),s:Math.round(sat*100),l:Math.round(l*100)};
  }
  const readCustom=()=>{try{const x=JSON.parse(root.localStorage?.getItem(CUSTOM_KEY)||'[]');return Array.isArray(x)?x.filter(valid):[];}catch(_){return [];}};
  let CUSTOM=readCustom();
  const all=()=>[...LIST,...CUSTOM];
  const get = id => all().find(p => p.id === id) || null;
  function createFromHsl({name,h,s,l}){
    name=String(name||'Mi paleta').trim().slice(0,32)||'Mi paleta';
    h=clamp(Number(h),0,360);s=clamp(Number(s),0,100);l=clamp(Number(l),5,90);
    const color=(light,sat=s)=>hslToHex(h,sat,light);
    const palette={id:'custom-'+Date.now().toString(36)+'-'+(CUSTOM.length+1),name,mood:'Creada con HSL',bg:color(97,Math.min(s,18)),surface:color(100,Math.min(s,8)),accent:color(l,s),accent2:color(Math.min(88,l+24),Math.min(72,s)),ink:color(13,Math.min(28,s)),line:color(88,Math.min(24,s))};
    if(!valid(palette))return null;
    CUSTOM.push(palette);try{root.localStorage?.setItem(CUSTOM_KEY,JSON.stringify(CUSTOM));}catch(_){}
    return palette;
  }
  function removeCustom(id){const n=CUSTOM.length;CUSTOM=CUSTOM.filter(p=>p.id!==id);try{root.localStorage?.setItem(CUSTOM_KEY,JSON.stringify(CUSTOM));}catch(_){}return CUSTOM.length!==n;}
  const hslFor=hexToHsl;
  const lum = c => { const [r, g, b] = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4); return r * .2126 + g * .7152 + b * .0722; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  /* Texto sobre el acento: el que más contraste dé. */
  const onAccent = c => contrast(c, '#ffffff') >= contrast(c, '#000000') ? '#ffffff' : '#000000';
  const normalize = id => (typeof id === 'string' && get(id)) ? id : null;
  root.TintaPalettes = { LIST, all, get, contrast, onAccent, normalize, valid, hslToHex, hexToHsl, hslFor, createFromHsl, removeCustom };
  if (typeof module !== 'undefined') module.exports = root.TintaPalettes;
})(typeof window !== 'undefined' ? window : globalThis);
