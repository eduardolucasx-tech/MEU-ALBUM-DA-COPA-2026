/* Meu Álbum da Copa 2026 — v1.0 clean */
const VERSION = '1.0.32-sync-server-timestamp';
const VERSION_LABEL = 'v1.0.32';
const VERSION_CHANGE = 'Sincronização em tempo real ajustada para usar o timestamp do servidor Firebase, evitando diferença de relógio entre celular e desktop e deixando o fluxo nos dois sentidos mais imediato.';
const STORAGE_KEY = 'meu-album-copa-2026-v1-state';
const LEGACY_KEYS = ['checklist-mundial-state-v6','checklist-mundial-state-v5','checklist-mundial-state-v4'];
const CLOUD_COLLECTION = 'meu_album_copa_v1_users';
const OPEN_SECTIONS_KEY = 'meu-album-copa-open-sections';
const ONBOARDING_KEY = 'meu-album-copa-onboarding-v1';
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

const RAW_SECTIONS = Array.isArray(window.ALBUM_DATA.sections) ? window.ALBUM_DATA.sections.filter(Boolean) : [];
const FALLBACK_SECTIONS = [
  ...window.ALBUM_DATA.teams.map(t => ({...t, kind:'team', sectionKey:t.code})),
  ...window.ALBUM_DATA.specialSections.map(s => ({...s, kind:'special', sectionKey:s.sectionKey || `${s.code}-${s.start || 1}-${s.count}`}))
];
const SECTION_LIST = (RAW_SECTIONS.length ? RAW_SECTIONS : FALLBACK_SECTIONS).map(sec => ({
  ...sec,
  kind: sec.kind || (sec.count ? 'special' : 'team'),
  sectionKey: sec.sectionKey || sec.code
}));

const albumItems = SECTION_LIST.flatMap((section, sectionIndex) => {
  const isTeam = section.kind === 'team' || !section.count;
  const count = isTeam ? 20 : section.count;
  const start = isTeam ? 1 : (section.start || 1);
  const sectionKey = section.sectionKey || section.code;
  return Array.from({length: count}, (_, i) => {
    const number = start + i;
    const id = `${section.code}-${String(number).padStart(2,'0')}`;
    const ref = refOf(section, number);
    const aliases = [id, ref.replace(' ', '-'), `${codeOf(section)}-${String(number).padStart(2,'0')}`];
    const meta = aliases.map(k => (window.STICKER_META || {})[k]).find(Boolean) || {};
    const defaultType = isTeam ? (i === 0 ? 'escudo' : i === 12 ? 'especial' : 'jogador') : (section.code === 'COC' ? 'coca-cola' : 'especial');
    return { id, code: section.code, displayCode: section.displayCode, number, ref, group: section.group || 'EXTRAS', section: section.name, sectionKey, name: meta.name || '', type: meta.type || defaultType, order: sectionIndex * 100 + i + 1 };
  });
});
const itemMap = new Map(albumItems.map(i => [i.id, i]));

let state = loadState();
let currentView = 'home';
let cloud = { ready:false, auth:null, db:null, provider:null, user:null, loading:false };
let syncTimer = null;
let cloudUnsubscribe = null;
let applyingRemoteState = false;
let lastCloudServerMs = 0;
let packSession = [];
let albumSortMode = localStorage.getItem('meu-album-copa-sort-mode') || 'album';
const openSections = new Set(loadOpenSections());

function codeOf(obj){ return obj.displayCode || obj.code; }
function refOf(obj, number){ return Number(number) === 0 ? '00' : `${codeOf(obj)} ${String(number).padStart(2,'0')}`; }
function escapeHtml(s){ return String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function escapeAttr(s){ return escapeHtml(s).replaceAll("'",'&#39;'); }
function pct(n){ return `${Math.round((Number(n)||0)*100)}%`; }
function typeLabel(type){ return ({jogador:'Jogador', escudo:'Escudo', especial:'Especial', history:'História', 'coca-cola':'Extra'})[type] || 'Figurinha'; }
function stickerDisplayName(item){
  return item && item.code === 'FWC' ? 'ESPECIAL FIFA' : (item?.name || item?.section || '');
}
function stickerDisplayMeta(item){
  return item && item.code === 'FWC' ? 'ESPECIAL · FIFA' : `${typeLabel(item?.type)} · ${item?.section || ''}`;
}
function itemById(id){ return itemMap.get(id); }
function qty(id){ return Math.max(0, Number(state.quantities[id] || 0)); }
function extras(item){ return Math.max(qty(item.id)-1, 0); }
function statusOf(item){ const q = qty(item.id); if(q <= 0) return 'missing'; if(q === 1) return 'owned'; return 'duplicate'; }
function statusLabel(item){ const s = statusOf(item); return s === 'missing' ? 'Falta' : s === 'owned' ? 'Tenho' : `Repetida +${extras(item)}`; }
function initials(text, fallback){ return String(text || fallback || '').split(/\s+|\/+|-+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase() || '★'; }
function flagEmoji(code){ return ''; }
function flagImg(code, label=''){
  if(!code) return '';
  const normalized = String(code).toUpperCase() === 'CC' ? 'coc' : String(code).toLowerCase();
  const src = `./flags/${normalized}.svg`;
  return `<img class="flag-img" src="${src}" alt="${escapeAttr(label || code)}" loading="lazy" decoding="async">`;
}
function flagMark(code, label=''){
  return flagImg(code, label) || escapeHtml(code || '');
}
function loadOpenSections(){
  try{
    const saved = JSON.parse(localStorage.getItem(OPEN_SECTIONS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(Boolean) : [];
  }catch(e){ return []; }
}
function saveOpenSections(){
  try{ localStorage.setItem(OPEN_SECTIONS_KEY, JSON.stringify([...openSections])); }catch(e){}
}
function defaultOpenCount(){
  if(window.matchMedia('(max-width: 759px) and (orientation: portrait)').matches) return 2;
  return 3;
}
function ensureDefaultOpenSections(sections){
  if(openSections.size || !sections.length) return;
  sections.slice(0, defaultOpenCount()).forEach(sec => openSections.add(sec.sectionKey || sec.code));
  saveOpenSections();
}
function onboardingSeen(){ return localStorage.getItem(ONBOARDING_KEY) === '1'; }
function markOnboardingSeen(){ localStorage.setItem(ONBOARDING_KEY, '1'); }
function syncLabel(){ return cloud.user ? 'Google conectado' : 'Modo local'; }
function syncHint(){ return cloud.user ? 'Sincronização em tempo real ativa' : 'Seus dados estão salvos neste aparelho'; }
function googleReminderCard(){
  if(cloud.user) return '';
  return `<section class="card google-reminder-card">
    <span class="label">Lembrete importante</span>
    <h3>Conecte com Google para salvar na nuvem</h3>
    <p class="muted">Antes de marcar muitas figurinhas, entre com Google. Assim o álbum fica protegido se trocar de celular, limpar cache ou abrir em outro navegador.</p>
    <button id="homeGoogleLogin" class="btn primary full">Conectar com Google</button>
  </section>`;
}
function formatUpdatedAt(v){
  const d = new Date(v || Date.now());
  if(Number.isNaN(d.getTime())) return 'agora';
  return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
}


function emptyState(){
  return { version: VERSION, quantities: Object.fromEntries(albumItems.map(i => [i.id,0])), tradeStatus:{}, contacts:{}, notes:{}, favorite:'', history:[], updatedAt:new Date().toISOString() };
}
function normalizeState(raw){
  const base = emptyState();
  if(!raw || typeof raw !== 'object') return base;
  const quantities = {...base.quantities};
  Object.entries(raw.quantities || {}).forEach(([id,value]) => { if(quantities[id] !== undefined) quantities[id] = Math.max(0, Number(value)||0); });
  return {...base, ...raw, quantities, tradeStatus: raw.tradeStatus || {}, contacts: raw.contacts || {}, notes: raw.notes || {}, history: Array.isArray(raw.history) ? raw.history.slice(0,80) : [], version: VERSION};
}
function loadState(){
  try{
    const current = localStorage.getItem(STORAGE_KEY);
    if(current) return normalizeState(JSON.parse(current));
    for(const key of LEGACY_KEYS){
      const old = localStorage.getItem(key);
      if(old){ const migrated = normalizeState(JSON.parse(old)); localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)); return migrated; }
    }
  }catch(e){ console.warn('state load failed', e); }
  return emptyState();
}
function saveState(label){
  state.updatedAt = new Date().toISOString();
  if(label) state.history = [{label, at:new Date().toISOString()}, ...(state.history || [])].slice(0,80);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueCloudSave();
}
function setQty(id, value, label){
  const item = itemById(id); if(!item) return;
  state.quantities[id] = Math.max(0, Number(value)||0);
  saveState(label || `${item.ref} atualizada`);
  render();
  toast(`${item.ref}: ${qty(id)} unidade(s)`);
}
function addQty(id, delta){ const item = itemById(id); if(item) setQty(id, qty(id)+delta, `${item.ref} ${delta>0?'adicionada':'removida'}`); }
function quickToggle(id){ const item = itemById(id); if(item) setQty(id, qty(id)>0 ? 0 : 1, `${item.ref} ${qty(id)>0?'marcada como falta':'marcada como tenho'}`); }
function quickAddOne(id){
  const item = itemById(id);
  if(!item) return;
  setQty(id, qty(id) + 1, `${item.ref} adicionada no visual rápido`);
}
function quickClear(id){
  const item = itemById(id);
  if(!item) return;
  setQty(id, 0, `${item.ref} limpa no visual rápido`);
}
function bindQuickActions(scope=document){
  const LONG_PRESS_MS = 520;
  $$('[data-quick-id]', scope).forEach(el => {
    let timer = null;
    let longTriggered = false;

    const start = (ev) => {
      ev.preventDefault();
      longTriggered = false;
      el.classList.add('pressing');
      timer = setTimeout(() => {
        longTriggered = true;
        el.classList.remove('pressing');
        quickClear(el.dataset.quickId);
      }, LONG_PRESS_MS);
    };

    const cancel = () => {
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      el.classList.remove('pressing');
    };

    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', () => {
      const hadTimer = !!timer;
      cancel();
      if(hadTimer && !longTriggered){
        quickAddOne(el.dataset.quickId);
      }
    });
    el.addEventListener('pointerleave', cancel);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('contextmenu', ev => ev.preventDefault());
  });
}

function stats(){
  const total = albumItems.length;
  const owned = albumItems.filter(i => qty(i.id)>0).length;
  const duplicates = albumItems.reduce((s,i)=>s+extras(i),0);
  const physical = albumItems.reduce((s,i)=>s+qty(i.id),0);
  const completeTeams = window.ALBUM_DATA.teams.filter(t => sectionStats(t).owned === 20).length;
  return { total, owned, missing: total-owned, duplicates, physical, completeTeams, progress: total ? owned/total : 0 };
}
const COLLECTOR_LEVELS = [
  { min:0, max:9, name:'Turista da Banca', desc:'Foi só “dar uma olhadinha” e já saiu com álbum na mão.' },
  { min:10, max:19, name:'Primeiro Pacote', desc:'Ainda acredita que vai completar sem gastar muito. Fofo.' },
  { min:20, max:29, name:'Caça-Repetida', desc:'A pilha de repetidas começou e nasceu o negociador.' },
  { min:30, max:39, name:'Troca-Troca FC', desc:'Já chega no grupo perguntando “quais faltam aí?”.' },
  { min:40, max:49, name:'Banca VIP', desc:'O dono da banca já sabe seu nome e separa pacotinho “bom”.' },
  { min:50, max:59, name:'Camisa 10', desc:'Controla número, confere lista e ainda dá assistência nas trocas.' },
  { min:60, max:69, name:'Professor Álbum', desc:'Sabe de cabeça quem falta, quem sobra e quem ninguém acha.' },
  { min:70, max:79, name:'Modo Desespero', desc:'Agora cada faltante parece pênalti aos 49 do segundo tempo.' },
  { min:80, max:89, name:'Caçador Final', desc:'Faltam poucas, mas cada uma virou uma novela mexicana.' },
  { min:90, max:97, name:'Lenda da Banca', desc:'Já virou referência no bairro: “pergunta pra ele, ele tem lista”.' },
  { min:98, max:99, name:'Última Maldita', desc:'O álbum inteiro refém de uma figurinha invisível.' },
  { min:100, max:100, name:'Glória Eterna', desc:'Álbum fechado. Pode desfilar na banca em carro aberto.' }
];
function collectorLevel(progress){
  const p = Math.min(100, Math.max(0, Math.floor((Number(progress)||0) * 100)));
  return COLLECTOR_LEVELS.find(l => p >= l.min && p <= l.max) || COLLECTOR_LEVELS[0];
}
function sectionItems(section){
  const key = String(section.sectionKey || section.code || '');
  let items = albumItems.filter(i => String(i.sectionKey || i.code) === key);
  if(!items.length && section.code) items = albumItems.filter(i => String(i.code) === String(section.code));
  return items;
}
function sectionStats(section){ const items = sectionItems(section); const owned = items.filter(i=>qty(i.id)>0).length; const duplicates = items.reduce((s,i)=>s+extras(i),0); return { total:items.length, owned, missing:items.length-owned, duplicates, progress: items.length ? owned/items.length : 0 }; }
function ranking(){ return window.ALBUM_DATA.teams.map(t => ({...t, ...sectionStats(t)})).sort((a,b)=>b.progress-a.progress || a.missing-b.missing); }

function setView(view){
  currentView = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#viewTitle').textContent = ({home:'Início', album:'Álbum', quick:'Visual rápido', add:'Adicionar', trades:'Trocas', missing:'Faltantes', profile:'Perfil'})[view] || 'Meu Álbum';
  render();
}
function render(){
  if(currentView === 'home') renderHome();
  if(currentView === 'album') renderAlbum();
  if(currentView === 'quick') renderQuickView();
  if(currentView === 'add') renderAdd();
  if(currentView === 'trades') renderTrades();
  if(currentView === 'missing') renderMissing();
  if(currentView === 'profile') renderProfile();
}
function kpi(label, value, sub=''){ return `<div class="kpi"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}${sub ? ` · ${escapeHtml(sub)}` : ''}</span></div>`; }
function kpiAction(label, value, filter, hint='Toque para filtrar'){
  return `<button class="kpi kpi-action" type="button" data-kpi-filter="${escapeAttr(filter)}"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span><small>${escapeHtml(hint)}</small></button>`;
}
function updateKpiActions(){
  const current = $('#statusFilter')?.value || '';
  $$('.kpi-action').forEach(btn => {
    const target = btn.dataset.kpiFilter || '';
    const active = current === target || (!current && target === 'all');
    btn.classList.toggle('active', active);
  });
}

function renderHome(){
  const s = stats();
  const level = collectorLevel(s.progress);
  const groups = [...new Set(window.ALBUM_DATA.teams.map(t => t.group))];
  const showOnboarding = !onboardingSeen();

  $('#view-home').innerHTML = `
    <section class="card hero compact-hero hero-level-card" style="--p:${Math.round(s.progress*100)}%">
      <div>
        <span class="label">Coleção oficial</span>
        <h2>${pct(s.progress)} completo</h2>
        <div class="hero-level-block">
          <strong>${escapeHtml(level.name)}</strong>
          <p>${escapeHtml(level.desc)}</p>
        </div>
      </div>
      <div class="ring"><div><strong>${pct(s.progress)}</strong><span>álbum</span></div></div>
    </section>

    <section class="card status-card">
      <div class="status-strip">
        <span class="sync-badge ${cloud.user ? 'cloud' : 'local'}">${escapeHtml(syncLabel())}</span>
        <small>${escapeHtml(syncHint())}</small>
      </div>
      <div class="status-subline">Última atualização local: ${escapeHtml(formatUpdatedAt(state.updatedAt))}</div>
    </section>

    ${googleReminderCard()}

    <section class="grid kpis home-kpis">
      ${kpiAction('Tenho', s.owned, 'owned')}
      ${kpiAction('Faltam', s.missing, 'missing')}
      ${kpiAction('Repetidas', s.duplicates, 'duplicate')}
      ${kpiAction('Físicas', s.physical, 'all', 'Figurinhas na mão')}
    </section>

    ${showOnboarding ? `
    <section class="card onboarding-card">
      <span class="label">Primeiros passos</span>
      <h3>Seu álbum já está pronto para uso</h3>
      <p class="muted">Toque em uma seleção para abrir as figurinhas. Use os cards acima para filtrar rápido e o modo Visual rápido na barra inferior.</p>
      <div class="onboarding-pills">
        <span class="pill soft">Abra seleções</span>
        <span class="pill soft">Filtre rápido</span>
        <span class="pill soft">Use o visual rápido</span>
      </div>
      <div class="button-row">
        <button id="dismissOnboarding" class="btn primary">Entendi</button>
      </div>
    </section>` : ''}

    <section class="card">
      <span class="label">Filtros do álbum</span>
      <div class="filters">
        <input id="albumSearch" class="search" type="search" placeholder="Buscar: BRA 10, Brasil, Neymar, falta...">
        <select id="groupFilter">
          <option value="">Todos os grupos</option>
          ${groups.map(g=>`<option value="${g}">Grupo ${g}</option>`).join('')}
          <option value="EXTRAS">Extras</option>
        </select>
        <select id="statusFilter">
          <option value="">Todos status</option>
          <option value="missing">Faltantes</option>
          <option value="owned">Tenho</option>
          <option value="duplicate">Repetidas</option>
        </select>
        <button id="clearFilters" class="btn">Limpar</button>
      </div>
      <div class="album-sort-row">
        <span class="muted">Organizar seleções</span>
        <button id="sortModeBtn" class="btn sort-btn" type="button"></button>
      </div>
    </section>

    <div id="teamList" class="team-list"></div>`;

  const sync = () => renderTeamList();
  $('#albumSearch').addEventListener('input', sync);
  $('#groupFilter').addEventListener('change', sync);
  $('#statusFilter').addEventListener('change', () => { updateKpiActions(); sync(); });
  $('#clearFilters').addEventListener('click', () => {
    $('#albumSearch').value='';
    $('#groupFilter').value='';
    $('#statusFilter').value='';
    updateKpiActions();
    sync();
  });
  $$('.kpi-action').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.kpiFilter === 'all' ? '' : btn.dataset.kpiFilter;
    $('#statusFilter').value = target;
    updateKpiActions();
    renderTeamList();
    $('#teamList')?.scrollIntoView({behavior:'smooth', block:'start'});
  }));
  $('#homeGoogleLogin')?.addEventListener('click', signInCloud);
  $('#sortModeBtn')?.addEventListener('click', () => {
    albumSortMode = albumSortMode === 'album' ? 'alpha' : 'album';
    localStorage.setItem('meu-album-copa-sort-mode', albumSortMode);
    updateSortButton();
    renderTeamList();
  });
  $('#dismissOnboarding')?.addEventListener('click', () => {
    markOnboardingSeen();
    renderHome();
    toast('Dicas iniciais ocultadas.');
  });
  updateSortButton();
  updateKpiActions();
  renderTeamList();
}

function renderAlbum(){
  // Compatibilidade: a aba Álbum foi unificada ao Início.
  setView('home');
}
function sortedSectionsForAlbum(){
  const list = [...SECTION_LIST];
  if(albumSortMode === 'alpha'){
    return list.sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR') || String(a.group || 'ZZ').localeCompare(String(b.group || 'ZZ')) || String(codeOf(a)).localeCompare(String(codeOf(b)), 'pt-BR'));
  }
  return list;
}
function updateSortButton(){
  const btn = $('#sortModeBtn');
  if(!btn) return;
  btn.textContent = albumSortMode === 'alpha' ? 'Ordem alfabética' : 'Ordem do álbum';
  btn.title = 'Clique para alternar a organização';
}
function updateChips(){}
function matchItem(item, q, status){ const hay = `${item.ref} ${item.code} ${item.section} ${item.name} ${item.type} ${statusLabel(item)} ${item.group}`.toLowerCase(); return (!q || hay.includes(q)) && (!status || statusOf(item) === status); }
function renderTeamList(){
  const container = $('#teamList');
  if(!container) return;

  const q = ($('#albumSearch')?.value || '').trim().toLowerCase();
  const group = $('#groupFilter')?.value || '';
  const status = $('#statusFilter')?.value || '';

  let sections = sortedSectionsForAlbum();
  if(!Array.isArray(sections) || !sections.length) sections = SECTION_LIST;
  sections = sections.filter(sec => sec && (!group || sec.group === group));

  if(!q && !group && !status) ensureDefaultOpenSections(sections);

  const cards = [];
  for(const sec of sections){
    const key = sec.sectionKey || sec.code;
    const allItems = sectionItems(sec);
    const items = allItems.filter(i => matchItem(i, q, status));
    if(!items.length) continue;

    const st = sectionStats(sec);
    const groupLabel = sec.group === 'EXTRAS' ? 'Extras' : `Grupo ${sec.group}`;
    const isOpen = openSections.has(key);

    cards.push(`<article class="team-card album-page ${st.progress===1?'complete':''} ${isOpen?'open':''}" data-section="${escapeAttr(key)}">
      <button class="team-head team-toggle" type="button" data-section-toggle="${escapeAttr(key)}" aria-expanded="${isOpen ? 'true':'false'}">
        <div class="team-badge">${flagMark(sec.code, sec.name) || escapeHtml(codeOf(sec)).slice(0,2)}</div>
        <div>
          <h3>${escapeHtml(codeOf(sec))} · ${escapeHtml(sec.name)}</h3>
          <p>${groupLabel} · ${st.owned}/${st.total} · ${st.missing} faltam · ${st.duplicates} repetidas</p>
          <div class="progress"><span style="width:${pct(st.progress)}"></span></div>
        </div>
        <div class="team-right">
          <strong class="team-pct">${pct(st.progress)}</strong>
          <span class="chevron" aria-hidden="true">⌄</span>
        </div>
      </button>
      <div class="section-slide">
        <div class="slide-inner">
          <div class="slide-surface"></div>
          <div class="sticker-grid">${items.map(stickerCard).join('')}</div>
        </div>
      </div>
    </article>`);
  }

  if(cards.length){
    container.innerHTML = cards.join('');
  } else if(q || group || status){
    container.innerHTML = `<div class="empty advanced-empty">
      <strong>Nenhuma seleção encontrada</strong>
      <p>Os filtros atuais não retornaram resultados.</p>
      <button id="clearFiltersEmpty" class="btn primary">Limpar filtros</button>
    </div>`;
  } else {
    const fallbackTeams = window.ALBUM_DATA.teams || [];
    container.innerHTML = `<div class="empty advanced-empty">
      <strong>Não consegui montar o álbum</strong>
      <p>Base carregada: ${albumItems.length} figurinhas · ${fallbackTeams.length} seleções. Tente recarregar a página.</p>
      <button id="forceAlbumRender" class="btn primary">Tentar novamente</button>
    </div>`;
  }

  $('#clearFiltersEmpty')?.addEventListener('click', () => {
    $('#albumSearch').value='';
    $('#groupFilter').value='';
    $('#statusFilter').value='';
    updateKpiActions();
    renderTeamList();
  });

  $('#forceAlbumRender')?.addEventListener('click', () => {
    openSections.clear();
    ensureDefaultOpenSections(SECTION_LIST);
    renderTeamList();
  });

  $$('[data-section-toggle]', container).forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.sectionToggle;
    const card = btn.closest('.album-page');
    if(openSections.has(key)) openSections.delete(key);
    else openSections.add(key);
    saveOpenSections();
    const open = openSections.has(key);
    card?.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }));

  bindStickerActions(container);
}
function stickerCard(item){
  const q = qty(item.id); const s = statusOf(item); const name = stickerDisplayName(item); const meta = stickerDisplayMeta(item); const special = item.type === 'especial' || item.type === 'history' || item.type === 'coca-cola'; const shield = item.type === 'escudo'; const n = String(item.number).padStart(2,'0'); const badge = (!special && item.code) ? flagMark(item.code, item.section) : escapeHtml(initials(name, item.code));
  return `<div class="sticker ${s} ${special?'special':''} ${shield?'shield':''}"><button class="sticker-main" data-toggle="${item.id}" aria-label="${escapeAttr(item.ref)} ${escapeAttr(name)}"><span class="status ${s}">${s==='missing'?'FALTA':s==='owned'?'TENHO':`REP +${extras(item)}`}</span><span class="sticker-face"><span class="sticker-top"><span class="code">${escapeHtml(codeOf(item))}</span><span class="num">${escapeHtml(n)}</span></span><span class="art"><span class="emblem">${special?'★':badge}</span></span><span class="sticker-info"><strong class="sticker-name">${escapeHtml(name)}</strong><span class="sticker-meta">${escapeHtml(meta)}</span></span></span></button><div class="qty"><button class="qty-btn" data-dec="${item.id}">−</button><b>${q}</b><button class="qty-btn" data-inc="${item.id}">+</button></div></div>`;
}
function bindStickerActions(ctx=document){ $$('[data-inc]',ctx).forEach(b=>b.addEventListener('click',()=>addQty(b.dataset.inc,1))); $$('[data-dec]',ctx).forEach(b=>b.addEventListener('click',()=>addQty(b.dataset.dec,-1))); $$('[data-toggle]',ctx).forEach(b=>b.addEventListener('click',()=>quickToggle(b.dataset.toggle))); }


function renderQuickView(){
  const groups = [...new Set(window.ALBUM_DATA.teams.map(t => t.group))];
  $('#view-quick').innerHTML = `
    <section class="card">
      <span class="label">Legenda da visualização rápida</span>
      <div class="quick-legend">
        <span class="legend-item"><i class="legend-box quick missing"></i> Faltante</span>
        <span class="legend-item"><i class="legend-box quick owned"></i> Tenho</span>
        <span class="legend-item"><i class="legend-box quick duplicate"></i> Tenho repetida</span>
      </div>
      <p class="muted">Nesta aba, cada quadrado mostra só o número da figurinha. Preto com número dourado = falta. Dourado com número preto = tenho. Dourado com ponto preto = tenho repetida.</p>
      <div class="filters quick-filters">
        <select id="quickGroupFilter"><option value="">Todos os grupos</option>${groups.map(g=>`<option value="${g}">Grupo ${g}</option>`).join('')}<option value="EXTRAS">Extras</option></select>
        <input id="quickSearch" class="search" type="search" placeholder="Buscar seleção ou sigla: BRA, Brasil...">
        <button id="quickToAlbum" class="btn">Ir para álbum completo</button>
      </div>
    </section>
    <div id="quickSectionList" class="quick-sections"></div>`;

  const sync = () => renderQuickSections();
  $('#quickGroupFilter')?.addEventListener('change', sync);
  $('#quickSearch')?.addEventListener('input', sync);
  $('#quickToAlbum')?.addEventListener('click', () => setView('album'));
  renderQuickSections();
}

function renderQuickSections(){
  const group = $('#quickGroupFilter')?.value || '';
  const query = ($('#quickSearch')?.value || '').trim().toLowerCase();
  const html = SECTION_LIST
    .filter(sec => !group || sec.group === group)
    .filter(sec => {
      if(!query) return true;
      const hay = `${sec.code} ${codeOf(sec)} ${sec.name} ${sec.group}`.toLowerCase();
      return hay.includes(query);
    })
    .map(sec => {
      const st = sectionStats(sec);
      const groupLabel = sec.group === 'EXTRAS' ? 'Extras' : `Grupo ${sec.group}`;
      return `<article class="quick-section ${st.progress===1?'complete':''}">
        <header class="quick-section-head">
          <div>
            <strong>${escapeHtml(codeOf(sec))} · ${escapeHtml(sec.name)}</strong>
            <small>${groupLabel} · ${st.owned}/${st.total} · ${st.duplicates} repetidas</small>
          </div>
          <span class="pill">${pct(st.progress)}</span>
        </header>
        <div class="quick-grid">${sectionItems(sec).map(quickStickerCell).join('')}</div>
      </article>`;
    }).join('');
  $('#quickSectionList').innerHTML = html || '<div class="empty">Nenhuma seção encontrada.</div>';
  bindQuickActions($('#quickSectionList'));
}

function quickStickerCell(item){
  const q = qty(item.id);
  const stateClass = q > 1 ? 'duplicate' : q === 1 ? 'owned' : 'missing';
  const n = item.number === 0 ? '00' : String(item.number).padStart(2,'0');
  const title = `${item.ref} · ${stickerDisplayName(item)} · ${statusLabel(item)} · toque = +1 · toque longo = limpar`;
  return `<button type="button" class="quick-sticker ${stateClass}" data-quick-id="${escapeAttr(item.id)}" title="${escapeAttr(title)}" aria-label="${escapeAttr(title)}"><span>${escapeHtml(n)}</span></button>`;
}

function normalizeCode(raw){ return String(raw||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,''); }
function findCandidates(raw){
  const value = normalizeCode(raw); if(!value) return [];
  if(value === '00') return albumItems.filter(i=>i.ref === '00' || i.code === 'ZERO');
  const m = value.match(/^([A-Z]{2,4})(\d{1,2})$/); if(!m) return albumItems.filter(i => normalizeCode(`${i.ref}${i.name}`).includes(value)).slice(0,25);
  let code = m[1]; const num = Number(m[2]); if(code === 'CC') code = 'COC';
  return albumItems.filter(i => (i.code === code || codeOf(i) === code) && i.number === num);
}

function renderAddInsights(){
  const top = ranking().slice(0,6);
  const recent = (state.history || []).slice(0,5);
  return `
    <section class="card">
      <span class="label">Seleções mais avançadas</span>
      <div class="list">${top.map(t=>`<div class="row"><div><strong>${escapeHtml(t.code)} · ${escapeHtml(t.name)}</strong><small>${t.owned}/${t.total} figurinhas</small></div><strong class="team-pct">${pct(t.progress)}</strong></div>`).join('')}</div>
    </section>
    <section class="card">
      <span class="label">Histórico recente</span>
      <div class="list">${recent.length ? recent.map(h=>`<div class="row"><div><strong>${escapeHtml(h.label)}</strong><small>${new Date(h.at).toLocaleString('pt-BR')}</small></div></div>`).join('') : '<div class="empty">Nada marcado ainda.</div>'}</div>
    </section>`;
}

function renderAdd(){
  $('#view-add').innerHTML = `<section class="card"><span class="label">Modo pacotinho</span><h2>Adicionar figurinhas</h2><p class="muted">Digite o código do verso: <strong>BRA 10</strong>, <strong>HAI08</strong>, <strong>FWC 1</strong>, <strong>CC 1</strong> ou <strong>00</strong>.</p><div class="filters"><input id="addInput" class="search" type="search" placeholder="Ex: BRA 10" autocomplete="off"><button id="addSearch" class="btn primary">Buscar</button></div><div class="chips"><button class="pill" data-fill="BRA 10">BRA 10</button><button class="pill" data-fill="MEX 3">MEX 3</button><button class="pill" data-fill="FWC 1">FWC 1</button><button class="pill" data-fill="CC 1">CC 1</button></div><div id="addResults" class="list"></div></section><section class="card"><span class="label">Pacotinho atual</span><div id="packList" class="pack-list"></div><div class="button-row"><button class="btn" id="clearPack">Limpar lista</button></div></section>${renderAddInsights()}`;
  $('#addInput').addEventListener('input', renderAddResults); $('#addSearch').addEventListener('click', renderAddResults); $('#addInput').addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); const c = findCandidates(e.target.value); if(c.length === 1) addFromAdd(c[0].id); else renderAddResults(); }});
  $$('[data-fill]').forEach(b=>b.addEventListener('click',()=>{ $('#addInput').value=b.dataset.fill; renderAddResults(); $('#addInput').focus(); }));
  $('#clearPack').addEventListener('click',()=>{packSession=[]; renderPack();}); renderAddResults(); renderPack(); setTimeout(()=>$('#addInput')?.focus(),30);
}
function addFromAdd(id){ const item = itemById(id); if(!item) return; addQty(id,1); packSession = [{ref:item.ref, name:stickerDisplayName(item)}, ...packSession].slice(0,20); renderPack(); renderAddResults(); }
function renderAddResults(){ const raw=$('#addInput')?.value||''; const box=$('#addResults'); if(!box) return; if(!raw.trim()){ box.innerHTML='<div class="empty">Digite um código para começar.</div>'; return; } const candidates=findCandidates(raw); box.innerHTML = candidates.length ? candidates.map(i=>`<div class="row add-result compact"><div class="add-result-info"><strong>${escapeHtml(i.ref)} · ${escapeHtml(stickerDisplayName(i))}</strong><small>${escapeHtml(i.section)} · ${escapeHtml(typeLabel(i.type))} · ${statusLabel(i)} · qtd ${qty(i.id)}</small></div><div class="button-row add-actions"><button class="btn" data-adddec="${i.id}">−</button><button class="btn primary" data-addone="${i.id}">+1</button></div></div>`).join('') : '<div class="empty">Não encontrei esse código.</div>'; $$('[data-addone]',box).forEach(b=>b.addEventListener('click',()=>addFromAdd(b.dataset.addone))); $$('[data-adddec]',box).forEach(b=>b.addEventListener('click',()=>addQty(b.dataset.adddec,-1))); }
function renderPack(){ const box=$('#packList'); if(box) box.innerHTML = packSession.length ? packSession.map(p=>`<div class="row"><div><strong>${escapeHtml(p.ref)}</strong><small>${escapeHtml(p.name)}</small></div><b>+1</b></div>`).join('') : '<div class="empty">Nada lançado neste pacotinho ainda.</div>'; }

function formatList(filter, mode='default'){ const rows=[]; SECTION_LIST.forEach(sec => { const items = sectionItems(sec).filter(filter); if(items.length){ rows.push(`${codeOf(sec)} · ${sec.name}: ` + items.map(i => `${String(i.number).padStart(2,'0')} · ${i.name || i.section}${mode==='dup'?` (+${extras(i)} / x${qty(i.id)})`:''}`).join(', ')); }}); return rows.join('\n') || 'Nada por aqui ainda.'; }
function renderTrades(){
  const rows = albumItems.filter(i => qty(i.id)>1 || state.tradeStatus[i.id]).sort((a,b)=>a.order-b.order);
  $('#view-trades').innerHTML = `<section class="grid kpis trade-kpis">${kpi('Repetidas',stats().duplicates)}${kpi('Itens',rows.length)}${kpi('Faltantes',stats().missing)}${kpi('Físicas',stats().physical)}</section><section class="card trade-summary-card"><span class="label">Resumo para WhatsApp</span><p class="muted">Gere rapidamente a lista para mandar no grupo ou para um contato específico.</p><div class="button-row trade-actions"><button class="btn primary" id="copyDup">Copiar repetidas</button><button class="btn" id="copyMissing">Copiar faltantes</button></div></section><section class="card trade-control-card"><span class="label">Controle de trocas</span><div class="table-scroll trade-table-wrap"><table class="trade-table"><thead><tr><th>Figurinha</th><th>Qtd</th><th>Status</th><th>Contato</th><th>Obs.</th></tr></thead><tbody>${rows.map(i=>`<tr><td><strong>${i.ref}</strong><br><small>${escapeHtml(i.name || i.section)}</small></td><td><input type="number" min="0" value="${qty(i.id)}" data-q="${i.id}"></td><td><select data-trade="${i.id}"><option></option>${['Disponível','Reservada','Trocada','Aguardando'].map(v=>`<option ${state.tradeStatus[i.id]===v?'selected':''}>${v}</option>`).join('')}</select></td><td><input value="${escapeAttr(state.contacts[i.id]||'')}" data-contact="${i.id}"></td><td><input value="${escapeAttr(state.notes[i.id]||'')}" data-note="${i.id}"></td></tr>`).join('') || '<tr><td colspan="5" class="empty">Marque repetidas para aparecerem aqui.</td></tr>'}</tbody></table></div></section>`;
  $('#copyDup').addEventListener('click',()=>copyText(`Repetidas:\n${formatList(i=>qty(i.id)>1,'dup')}`));
  $('#copyMissing').addEventListener('click',()=>copyText(`Faltantes:\n${formatList(i=>qty(i.id)===0)}`));
  $$('[data-q]').forEach(el=>el.addEventListener('change',()=>setQty(el.dataset.q,el.value)));
  $$('[data-trade]').forEach(el=>el.addEventListener('change',()=>{state.tradeStatus[el.dataset.trade]=el.value; saveState('Troca atualizada'); render();}));
  $$('[data-contact]').forEach(el=>el.addEventListener('change',()=>{state.contacts[el.dataset.contact]=el.value; saveState();}));
  $$('[data-note]').forEach(el=>el.addEventListener('change',()=>{state.notes[el.dataset.note]=el.value; saveState();}));
}
function renderMissing(){ const missing=formatList(i=>qty(i.id)===0); const owned=formatList(i=>qty(i.id)>0); const dup=formatList(i=>qty(i.id)>1,'dup'); $('#view-missing').innerHTML = `<section class="card"><span class="label">Faltantes</span><div id="missingBox" class="copy-box">${escapeHtml(missing)}</div><button class="btn primary full" data-copy="missingBox">Copiar faltantes</button></section><section class="card"><span class="label">Tenho</span><div id="ownedBox" class="copy-box">${escapeHtml(owned)}</div><button class="btn full" data-copy="ownedBox">Copiar tenho</button></section><section class="card"><span class="label">Repetidas</span><div id="dupBox" class="copy-box">${escapeHtml(dup)}</div><button class="btn full" data-copy="dupBox">Copiar repetidas</button></section>`; $$('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText($(`#${b.dataset.copy}`).textContent))); }
function renderProfile(){ const s=stats(); const level=collectorLevel(s.progress); const email=cloud.user?.email || ''; $('#view-profile').innerHTML = `<section class="card hero" style="--p:${Math.round(s.progress*100)}%"><div><span class="label">Colecionador</span><h2>${escapeHtml(level.name)}</h2><p>${escapeHtml(level.desc)}</p><p class="muted">${s.owned} figurinhas coladas · ${s.duplicates} repetidas · ${s.completeTeams} seleções completas.</p></div><div class="ring"><div><strong>${pct(s.progress)}</strong><span>total</span></div></div></section><section class="profile-grid"><div class="card"><span class="label">Sincronização</span><h3>${cloud.user?'Google conectado':'Modo local'}</h3><p class="muted">${cloud.user ? escapeHtml(email) : 'Entre com Google para salvar na nuvem.'}</p><div class="button-row"><button class="btn primary" id="loginBtn">${cloud.user?'Trocar conta':'Entrar com Google'}</button><button class="btn" id="logoutBtn">Sair</button><button class="btn" id="syncNow">Sincronizar</button></div></div><div class="card"><span class="label">Backup</span><div class="button-row"><button class="btn" id="exportJson">Exportar JSON</button><label class="btn"><input id="importJson" type="file" accept="application/json" hidden>Importar JSON</label><button class="btn danger" id="resetAll">Zerar tudo</button></div></div><div class="card about-card"><span class="label">Sobre</span><h3>Meu Álbum da Copa 2026</h3><div class="version-box"><strong>${VERSION_LABEL}</strong><span>${VERSION}</span></div><p class="muted"><strong>Mudança desta versão:</strong> ${escapeHtml(VERSION_CHANGE)}</p><p class="muted">Base preservada com ${albumItems.length} figurinhas.</p></div></section>`; $('#loginBtn').addEventListener('click',signInCloud); $('#logoutBtn').addEventListener('click',signOutCloud); $('#syncNow').addEventListener('click',syncNow); $('#exportJson').addEventListener('click',exportJson); $('#importJson').addEventListener('change',importJson); $('#resetAll').addEventListener('click',()=>{ if(confirm('Zerar toda a coleção?')){ state=emptyState(); saveState('Coleção zerada'); render(); }}); }

function copyText(text){ navigator.clipboard?.writeText(text).then(()=>toast('Copiado!')).catch(()=>toast('Não consegui copiar.')); }
function exportJson(){ const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='meu-album-copa-backup.json'; a.click(); URL.revokeObjectURL(a.href); }
async function importJson(e){ const file=e.target.files?.[0]; if(!file) return; try{ state=normalizeState(JSON.parse(await file.text())); saveState('Backup importado'); render(); toast('Backup importado.'); }catch(err){ toast('Arquivo inválido.'); } }
function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2200); }

function initCloud(){
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg || !cfg.apiKey || !window.firebase) return;
  try{
    if(!firebase.apps.length) firebase.initializeApp(cfg);
    cloud.auth=firebase.auth();
    cloud.db=firebase.firestore();
    cloud.provider=new firebase.auth.GoogleAuthProvider();
    cloud.ready=true;
    cloud.auth.onAuthStateChanged(async user=>{
      if(cloudUnsubscribe){
        cloudUnsubscribe();
        cloudUnsubscribe = null;
      }
      cloud.user=user;
      if(user){
        await loadCloud(true);
        startRealtimeSync();
      }
      render();
    });
  }catch(e){
    console.warn('Firebase indisponível', e);
  }
}
function cloudServerTimeMs(data){
  const ts = data?.updatedAt;
  if(ts && typeof ts.toMillis === 'function') return ts.toMillis();
  if(ts && typeof ts.seconds === 'number') return ts.seconds * 1000;
  return Date.parse(data?.state?.updatedAt || 0) || Date.now();
}
function stateSignature(value){
  try{
    return JSON.stringify({
      quantities:value?.quantities || {},
      tradeStatus:value?.tradeStatus || {},
      contacts:value?.contacts || {},
      notes:value?.notes || {},
      favorite:value?.favorite || ''
    });
  }catch(e){
    return '';
  }
}
function startRealtimeSync(){
  if(!cloud.ready || !cloud.user || !cloud.db) return;
  if(cloudUnsubscribe) cloudUnsubscribe();

  cloudUnsubscribe = cloudDoc().onSnapshot(snap => {
    if(!snap.exists || !snap.data().state) return;
    if(snap.metadata?.hasPendingWrites) return;

    const data = snap.data();
    const remoteServerMs = cloudServerTimeMs(data);
    const remote = normalizeState(data.state);

    const remoteSig = stateSignature(remote);
    const localSig = stateSignature(state);

    if(remoteServerMs > lastCloudServerMs || remoteSig !== localSig){
      lastCloudServerMs = Math.max(lastCloudServerMs, remoteServerMs);
      if(remoteSig !== localSig){
        applyingRemoteState = true;
        state = remote;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        applyingRemoteState = false;
        render();
        toast('Álbum atualizado pela nuvem.');
      }
    }
  }, err => {
    console.warn('realtime sync failed', err);
  });
}
function cloudDoc(){ return cloud.db.collection(CLOUD_COLLECTION).doc(cloud.user.uid); }
async function signInCloud(){ if(!cloud.ready) return toast('Firebase não configurado.'); try{ await cloud.auth.signInWithPopup(cloud.provider); }catch(e){ toast('Não consegui entrar com Google.'); } }
async function signOutCloud(){
  if(cloudUnsubscribe){
    cloudUnsubscribe();
    cloudUnsubscribe = null;
  }
  lastCloudServerMs = 0;
  if(cloud.auth) await cloud.auth.signOut();
  toast('Conta desconectada.');
  render();
}
function queueCloudSave(){ if(!cloud.ready || !cloud.user) return; clearTimeout(syncTimer); syncTimer=setTimeout(()=>saveCloud(),700); }
async function saveCloud(){ if(!cloud.ready || !cloud.user) return; try{ await cloudDoc().set({state, updatedAt:firebase.firestore.FieldValue.serverTimestamp(), version:VERSION},{merge:true}); }catch(e){ console.warn('save cloud failed', e); } }
async function loadCloud(silent=false){
  if(!cloud.ready || !cloud.user) return;
  try{
    const snap = await cloudDoc().get();
    if(snap.exists && snap.data().state){
      const data = snap.data();
      const remote = normalizeState(data.state);
      const remoteServerMs = cloudServerTimeMs(data);
      lastCloudServerMs = Math.max(lastCloudServerMs, remoteServerMs);

      if(stateSignature(remote) !== stateSignature(state)){
        state = remote;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if(!silent) toast('Nuvem carregada.');
        render();
      }
    } else {
      await saveCloud();
    }
  }catch(e){
    console.warn('load cloud failed', e);
    if(!silent) toast('Falha na sincronização.');
  }
}
async function syncNow(){ if(!cloud.user) return toast('Entre com Google no Perfil.'); await loadCloud(); await saveCloud(); toast('Sincronizado.'); }

$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
const appEl = $('#app');
function updateNavToggle(){
  const expanded = appEl.classList.contains('landscape-nav-expanded');
  const btn = $('#navToggle');
  if(!btn) return;
  btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  btn.querySelector('span').textContent = expanded ? '×' : '☰';
  btn.querySelector('b').textContent = expanded ? 'Fechar' : 'Menu';
}
$('#navToggle')?.addEventListener('click', ()=>{ appEl.classList.toggle('landscape-nav-expanded'); updateNavToggle(); });
window.addEventListener('resize', ()=>{ if(!window.matchMedia('(orientation: landscape) and (max-height: 560px)').matches){ appEl.classList.remove('landscape-nav-expanded'); updateNavToggle(); } });
updateNavToggle();
$('#syncButton').addEventListener('click',syncNow);
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
initCloud();
render();
setTimeout(() => {
  if(!cloud.user && currentView === 'home') toast('Lembrete: conecte com Google para salvar na nuvem.');
}, 1600);
