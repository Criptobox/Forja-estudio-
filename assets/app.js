const screens=[...document.querySelectorAll('.screen')],nav=document.getElementById('bottomNav'),back=document.getElementById('backBtn');let current='welcome',historyStack=[];
function go(name,push=true){const target=document.querySelector(`[data-screen="${name}"]`);if(!target)return;if(push&&current!==name)historyStack.push(current);screens.forEach(s=>s.classList.toggle('active',s===target));current=name;back.classList.toggle('hidden',['welcome','home'].includes(name));nav.style.display=['welcome','progress','result','screens','editor','components','style','preview','export'].includes(name)?(name==='welcome'?'none':'flex'):'none';nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.go===name || (['style','preview','export'].includes(name)&&b.dataset.go==='projects')));window.scrollTo(0,0)}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
back.addEventListener('click',()=>go(historyStack.pop()||'home',false));
document.querySelectorAll('[data-idea]').forEach(b=>b.onclick=()=>{document.getElementById('idea').value=b.dataset.idea;document.getElementById('idea').focus()});
function build(){go('progress');let p=62;const out=document.getElementById('percent');const t=setInterval(()=>{p=Math.min(100,p+7);out.textContent=p+'%';if(p===100)clearInterval(t)},250)}
document.getElementById('startBuild').onclick=()=>build();document.getElementById('confirmBuild').onclick=()=>build();document.getElementById('finishBuild').onclick=()=>go('result');
document.getElementById('chatSend').onclick=()=>{const i=document.getElementById('chatInput');if(!i.value.trim())return;const b=document.createElement('div');b.className='bubble user';b.textContent=i.value;document.getElementById('chat').appendChild(b);i.value='';document.getElementById('chat').scrollTop=9999};
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const toast=document.getElementById('toast');toast.textContent=b.dataset.add+' añadido al proyecto';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1600)});
document.querySelectorAll('.theme-swatch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.theme-swatch').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
document.getElementById('radiusRange').oninput=e=>document.getElementById('radiusValue').textContent=e.target.value+' px';
document.getElementById('exportBtn').onclick=()=>{const html='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TechStore</title><style>body{font:16px system-ui;background:#101019;color:white;margin:0;padding:24px}main{max-width:480px;margin:auto}header{color:#ff8a20;font-weight:bold}.hero{padding:28px;border-radius:20px;background:linear-gradient(120deg,#28202f,#9b4b14)}button{background:#ff7900;color:white;border:0;padding:12px 18px;border-radius:20px}</style><main><header>◢ TechStore</header><section class="hero"><h1>Tecnología sin límites</h1><p>Descubre lo último en gadgets</p><button>Ver ofertas</button></section><h2>Ofertas destacadas</h2><p>Tu tienda, creada con FORJA STUDIO.</p></main></html>';const blob=new Blob([html],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='techstore-preview.html';a.click();URL.revokeObjectURL(a.href);document.getElementById('exportNote').textContent='Archivo HTML de ejemplo generado correctamente.'};
go('welcome',false);

// Biblioteca de diseño: filtros, búsqueda, favoritos, ficha y selección.
const libraryGrid=document.getElementById('componentGrid');
if(libraryGrid){
  const cards=[...libraryGrid.querySelectorAll('.library-card')];
  const search=document.getElementById('componentSearch');
  const count=document.getElementById('libraryCount');
  const title=document.getElementById('libraryTitle');
  const empty=document.getElementById('emptyLibrary');
  const favoritesOnly=document.getElementById('favoritesOnly');
  const addedLabel=document.getElementById('addedCount');
  let category='Todos',onlyFavorites=false,added=0,selectedCard=null;
  let favorites=new Set();
  try{favorites=new Set(JSON.parse(localStorage.getItem('forja-library-favorites')||'[]'))}catch(e){}
  cards.forEach(card=>{if(favorites.has(card.dataset.name))card.querySelector('.fav').classList.add('on'),card.querySelector('.fav').textContent='♥'});
  function filterLibrary(){
    const q=(search.value||'').trim().toLowerCase();let visible=0;
    cards.forEach(card=>{
      const matchCategory=category==='Todos'||card.dataset.category===category;
      const matchText=(card.dataset.name+' '+card.dataset.tags+' '+card.dataset.desc).toLowerCase().includes(q);
      const matchFav=!onlyFavorites||favorites.has(card.dataset.name);
      const show=matchCategory&&matchText&&matchFav;
      card.classList.toggle('hidden',!show);if(show)visible++;
    });
    count.textContent=visible+' recursos';
    title.textContent=onlyFavorites?'Tus favoritos':category==='Todos'?'Explorar componentes':category;
    empty.classList.toggle('hidden',visible!==0);
  }
  document.querySelectorAll('.lib-filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.lib-filter').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');category=btn.dataset.category;onlyFavorites=false;favoritesOnly.classList.remove('active');filterLibrary();
  }));
  search.addEventListener('input',filterLibrary);
  document.getElementById('clearSearch').addEventListener('click',()=>{search.value='';filterLibrary();search.focus()});
  favoritesOnly.addEventListener('click',()=>{onlyFavorites=!onlyFavorites;favoritesOnly.classList.toggle('active',onlyFavorites);filterLibrary()});
  document.getElementById('showAll').addEventListener('click',()=>{category='Todos';onlyFavorites=false;search.value='';favoritesOnly.classList.remove('active');document.querySelectorAll('.lib-filter').forEach(x=>x.classList.toggle('active',x.dataset.category==='Todos'));filterLibrary()});
  function toggleFavorite(card,button){
    const name=card.dataset.name;
    if(favorites.has(name)){favorites.delete(name);button.classList.remove('on');button.textContent='♡'}
    else{favorites.add(name);button.classList.add('on');button.textContent='♥'}
    try{localStorage.setItem('forja-library-favorites',JSON.stringify([...favorites]))}catch(e){}
  }
  function addComponent(card){
    added++;addedLabel.textContent=added+' componente'+(added===1?' añadido':'s añadidos');
    const toast=document.getElementById('toast');toast.textContent=card.dataset.name+' añadido al editor';toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),1700);
    card.classList.add('just-added');setTimeout(()=>card.classList.remove('just-added'),650);
    if(window.FORJA_EDITOR)window.FORJA_EDITOR.add(card.dataset.name);
  }
  const detail=document.getElementById('componentDetail');
  function openDetail(card){
    selectedCard=card;
    document.getElementById('detailName').textContent=card.dataset.name;
    document.getElementById('detailDesc').textContent=card.dataset.desc;
    document.getElementById('detailCategory').textContent=card.dataset.category;
    const preview=document.getElementById('detailPreview');preview.innerHTML='';
    preview.appendChild(card.querySelector('.component-art').cloneNode(true));
    detail.classList.remove('hidden');
  }
  document.addEventListener('click',e=>{
    const card=e.target.closest('.library-card');if(!card)return;
    if(e.target.closest('.fav')){e.stopPropagation();toggleFavorite(card,card.querySelector('.fav'));return}
    if(e.target.closest('.add-mini')){e.stopPropagation();addComponent(card);return}
    openDetail(card);
  });
  detail.querySelectorAll('[data-close-detail]').forEach(el=>el.addEventListener('click',()=>detail.classList.add('hidden')));
  document.getElementById('detailAdd').addEventListener('click',()=>{if(selectedCard)addComponent(selectedCard);detail.classList.add('hidden')});
  filterLibrary();
}

// Editor visual real: los elementos seleccionados de la biblioteca se insertan,
// se pueden seleccionar, reordenar, duplicar, renombrar y eliminar.
(()=>{
 const stage=document.getElementById('addedComponents');
 if(!stage)return;
 const sourceCards=[...document.querySelectorAll('.library-card')];
 const selectedInfo=document.getElementById('editorSelection');
 let selected=null,items=[];
 const previewStage=document.querySelector('[data-screen="preview"] .device-preview');
 function sourceFor(name){return sourceCards.find(c=>c.dataset.name===name)}
 function createItem(name,id){
   const source=sourceFor(name);if(!source)return null;
   const el=document.createElement('div');el.className='editable-component';el.dataset.id=id||('fc-'+Date.now()+'-'+Math.random().toString(16).slice(2,6));
   const head=document.createElement('div');head.className='editable-head';
   const label=document.createElement('b');label.textContent=name;
   const actions=document.createElement('span');actions.textContent='⋮';
   head.append(label,actions);
   const art=source.querySelector('.component-art').cloneNode(true);
   art.classList.add('inserted-art');
   el.append(head,art);
   el.addEventListener('click',()=>select(el));
   return el;
 }
 function select(el){
   if(selected)selected.classList.remove('selected');
   selected=el;selected.classList.add('selected');
   const name=el.querySelector('.editable-head b').textContent;
   selectedInfo.innerHTML='<b>'+escapeText(name)+'</b><small>Seleccionado · Puedes moverlo, duplicarlo, renombrarlo o eliminarlo.</small>';
 }
 function escapeText(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function renderPreview(){
   if(!previewStage)return;
   let target=previewStage.querySelector('.added-components-preview');
   if(!target){target=document.createElement('div');target.className='added-components-preview';previewStage.appendChild(target)}
   target.innerHTML='';
   [...stage.children].forEach(item=>{
     const copy=item.querySelector('.inserted-art').cloneNode(true);
     copy.classList.add('preview-inserted-art');target.appendChild(copy);
   });
 }
 function save(){
   try{localStorage.setItem('forja-editor-items',JSON.stringify([...stage.children].map(el=>({name:el.querySelector('.editable-head b').textContent,id:el.dataset.id}))))}catch(e){}
   renderPreview();
 }
 function add(name){
   const el=createItem(name);if(!el)return;
   stage.querySelector('.editor-empty')?.remove();
   stage.appendChild(el);select(el);save();
   document.querySelector('[data-screen="editor"]')?.classList.contains('active')||null;
 }
 function restore(){
   let saved=[];try{saved=JSON.parse(localStorage.getItem('forja-editor-items')||'[]')}catch(e){}
   saved.forEach(x=>{const el=createItem(x.name,x.id);if(el)stage.appendChild(el)});
   if(stage.children.length){select(stage.lastElementChild)}else{
     const empty=document.createElement('div');empty.className='editor-empty';empty.innerHTML='＋<b>Tu composición empieza aquí</b><small>Añade elementos desde la biblioteca</small>';stage.appendChild(empty);
   }
   renderPreview();
 }
 function requireSelected(){if(!selected){selectedInfo.innerHTML='<b>No hay elemento seleccionado</b><small>Primero toca un componente dentro de la vista previa.</small>';return false}return true}
 document.getElementById('moveUp').onclick=()=>{if(!requireSelected())return;const prev=selected.previousElementSibling;if(prev){stage.insertBefore(selected,prev);save()}};
 document.getElementById('duplicateBlock').onclick=()=>{if(!requireSelected())return;const name=selected.querySelector('.editable-head b').textContent;const clone=createItem(name);stage.insertBefore(clone,selected.nextSibling);select(clone);save()};
 document.getElementById('deleteBlock').onclick=()=>{if(!requireSelected())return;const old=selected;selected=null;old.remove();if(!stage.children.length){const empty=document.createElement('div');empty.className='editor-empty';empty.innerHTML='＋<b>Tu composición empieza aquí</b><small>Añade elementos desde la biblioteca</small>';stage.appendChild(empty);selectedInfo.textContent='Selecciona un componente para editarlo'}else select(stage.lastElementChild);save()};
 document.getElementById('editBlock').onclick=()=>{if(!requireSelected())return;const label=selected.querySelector('.editable-head b');const next=window.prompt('Nuevo nombre del componente',label.textContent);if(next&&next.trim()){label.textContent=next.trim();select(selected);save()}};
 document.getElementById('addBlock').onclick=()=>{document.querySelector('[data-screen="components"]')&&document.querySelector('[data-go="components"]')?.click()};
 window.FORJA_EDITOR={add};
 restore();
})();
