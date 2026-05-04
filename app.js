
function safeToast(message){
  try{
    const toastEl = document.getElementById('toast');
    if(toastEl){
      toastEl.textContent = String(message || '');
      toastEl.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 1800);
      return;
    }
  }catch(e){}
  try{ console.log('[toast]', message); }catch(e){}
}

/* Meu Álbum da Copa 2026 — v1.0 clean */
const VERSION = '1.7.22-pwa-auto-update';
const VERSION_LABEL = 'v1.7.22';
const VERSION_CHANGE = 'Ajuste do PWA: atualização automática do service worker, assets principais em modo network-first e redução de versão antiga presa no celular.';
const STORAGE_KEY = 'meu-album-copa-2026-v1-state';
const LEGACY_KEYS = ['checklist-mundial-state-v6','checklist-mundial-state-v5','checklist-mundial-state-v4'];
const CLOUD_COLLECTION = 'meu_album_copa_v1_users';
const FAMILY_COLLECTION = 'meu_album_copa_v1_family_albums';
const OPEN_SECTIONS_KEY = 'meu-album-copa-open-sections';
const ONBOARDING_KEY = 'meu-album-copa-onboarding-v1';
const QUICK_HELP_KEY = 'meu-album-copa-quick-help-open-v1';
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const debounce = (fn, wait=120) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};

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
let homeGreetingIndex = Math.floor(Math.random() * 68);
const HOME_GREETINGS = [
  'Coé',
  'Salve',
  'E aí',
  'Bora',
  'Chegou',
  'Fala',
  'Partiu álbum',
  'Tá na área',
  'É tetra',
  'Vai que é tua, {name}!',
  'Olha o que ele fez',
  'Haja coração',
  'Bem, amigos',
  'Pode isso, {name}?',
  'A regra é clara',
  'No peito, na grama!',
  'Que beleza',
  'Explode coração',
  'Gooooool do Brasil',
  'O Brasil está na final',
  'Acabou! É campeão',
  'É do Brasil',
  'Sabe de quem',
  'Gol de placa',
  'Pintou o campeão',
  'É teste pra cardíaco',
  'Que golaço',
  'Ele não perdoa',
  'Tá lá dentro',
  'Balançou o barbante',
  'A bola pune',
  'Quem não faz, toma',
  'O impossível aconteceu',
  'Senhoras e senhores, que jogo!',
  'É Copa do Mundo, amigo!',
  'Com emoção',
  'A bola viaja',
  'Subiu mais que todo mundo',
  'Defesaça',
  'Milagre do goleiro',
  'Na trave',
  'Por centímetros',
  'O estádio vem abaixo',
  'É decisão',
  'Agora é matar ou morrer',
  'Drama total',
  'É loteria',
  'Ele chamou a responsabilidade',
  'O camisa 10 resolveu',
  'Craque é craque',
  'Isso é futebol',
  'O futebol é maravilhoso',
  'Histórico',
  'Inacreditável',
  'É pra guardar na memória',
  'Nunca duvide do futebol',
  'A taça é deles',
  'Pode soltar o grito',
  'Haja figurinha',
  'É tetra de repetida',
  'Vai que é tua, colecionador',
  'A regra é clara: repetida vai pra troca',
  'Tá lá dentro do álbum',
  'Quem não cola, troca',
  'Balançou o pacotinho',
  'O álbum pune',
  'Drama total na última faltante',
  'Acabou! É álbum fechado',
  '{name}! Sentiu!'
];
const HOME_GREETINGS_EXACT = new Set([
  'Pode isso, {name}?',
  'Vai que é tua, {name}!',
  'No peito, na grama!',
  'Senhoras e senhores, que jogo!',
  'É Copa do Mundo, amigo!',
  '{name}! Sentiu!'
]);

async function copyText(text){
  const value = String(text || '').trim();
  if(!value){
    safeToast('Nada para copiar.');
    return;
  }

  try{
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(value);
      safeToast('Copiado!');
      return;
    }
  }catch(e){
    console.warn('clipboard API failed, using fallback', e);
  }

  try{
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    const ok = document.execCommand('copy');
    document.body.removeChild(ta);

    if(ok){
      safeToast('Copiado!');
      return;
    }
  }catch(e){
    console.warn('execCommand copy failed', e);
  }

  openCopyModal(value);
}

function openCopyModal(text){
  const existing = document.getElementById('copyModal');
  if(existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'copyModal';
  modal.className = 'info-modal copy-modal';
  modal.innerHTML = `<div class="info-modal-card">
    <button class="modal-close" type="button" aria-label="Fechar">×</button>
    <h2>Copiar manualmente</h2>
    <p class="muted">Seu navegador bloqueou a cópia automática. Selecione o texto abaixo e copie.</p>
    <textarea id="manualCopyText" rows="12" readonly>${escapeHtml(text)}</textarea>
  </div>`;
  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('.modal-close')?.addEventListener('click', close);
  modal.addEventListener('click', e => { if(e.target === modal) close(); });

  setTimeout(() => {
    const ta = document.getElementById('manualCopyText');
    if(ta){
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
    }
  }, 50);
}



function userDisplayName(){
  const fromGoogle = cloud.user?.displayName || cloud.user?.email || '';
  const localName = state?.userName || '';
  return fromGoogle || localName || 'Colecionador';
}
function userFirstName(){
  const name = userDisplayName();
  const clean = String(name).split('@')[0].trim();
  return clean.split(/\s+/)[0] || 'Colecionador';
}
function userPhotoMarkup(size='md'){
  const src = cloud.user?.photoURL || '';
  const name = userDisplayName();
  const initial = (userFirstName()[0] || 'C').toUpperCase();
  if(src){
    return `<span class="user-avatar user-avatar-${size}"><img src="${escapeAttr(src)}" alt="${escapeAttr(name)}" referrerpolicy="no-referrer" onerror="this.parentElement.classList.add('avatar-fallback'); this.remove();"><b>${escapeHtml(initial)}</b></span>`;
  }
  return `<span class="user-avatar user-avatar-${size} avatar-fallback"><b>${escapeHtml(initial)}</b></span>`;
}
function saveStatusText(){
  if(isOffline()) return 'Offline · salvo neste aparelho';
  if(cloud.user) return 'Sincronizado com Google';
  return 'Salvo localmente';
}
function saveStatusMarkup(){
  const cls = isOffline() ? 'offline' : (cloud.user ? 'cloud' : 'local');
  return `<span class="save-status ${cls}"><i></i>${escapeHtml(saveStatusText())}</span>`;
}
function lastUsedTeam(){
  const code = localStorage.getItem('meu-album-copa-last-team') || '';
  if(!code) return null;
  return SECTION_LIST.find(t => codeOf(t) === code || t.code === code) || null;
}
function setLastUsedTeamFromItem(item){
  if(!item) return;
  const sec = SECTION_LIST.find(t => t.id === item.teamId || t.code === item.team || codeOf(t) === item.team);
  if(sec) localStorage.setItem('meu-album-copa-last-team', codeOf(sec));
}
function rememberView(view){
  if(view) localStorage.setItem('meu-album-copa-last-view', view);
}
function lastView(){
  return localStorage.getItem('meu-album-copa-last-view') || 'quick';
}
function continueLabel(){
  const team = lastUsedTeam();
  if(team) return `Continuar em ${escapeHtml(codeOf(team))}`;
  const view = lastView();
  const labels = {home:'Início', quick:'Rápido', add:'Adicionar', trades:'Trocas', profile:'Perfil'};
  return `Continuar em ${labels[view] || 'Rápido'}`;
}
function continueLastSession(){
  const team = lastUsedTeam();
  if(team){
    localStorage.setItem('meu-album-copa-quick-group', codeOf(team));
    switchView('quick');
    return;
  }
  const view = lastView();
  switchView(VIEW_ORDER.includes(view) && view !== 'home' ? view : 'quick');
}
function shouldShowOnboarding(){
  return localStorage.getItem('meu-album-copa-onboarding-v170') !== 'done';
}
function closeOnboarding(){
  localStorage.setItem('meu-album-copa-onboarding-v170', 'done');
  const el = document.querySelector('.onboarding-card');
  if(el) el.remove();
}
function renderOnboardingCard(){
  if(!shouldShowOnboarding()) return '';
  return `<section class="card onboarding-card">
    <div class="onboarding-head">
      ${userPhotoMarkup('sm')}
      <div>
        <span class="label">Primeiros passos</span>
        <h3>Bem-vindo, ${escapeHtml(userFirstName())}</h3>
      </div>
    </div>
    <div class="onboarding-steps">
      <span><b>1</b>Marque no Rápido</span>
      <span><b>2</b>Adicione por código/lote</span>
      <span><b>3</b>Copie listas em Trocas</span>
      <span><b>4</b>Ative Google para salvar</span>
    </div>
    <div class="button-row compact-row">
      <button class="btn primary" id="startOnboardingBtn" type="button">Começar agora</button>
      <button class="btn" id="hideOnboardingBtn" type="button">Não mostrar novamente</button>
    </div>
  </section>`;
}
function bindOnboarding(){
  $('#startOnboardingBtn')?.addEventListener('click', () => {
    closeOnboarding();
    switchView('quick');
  });
  $('#hideOnboardingBtn')?.addEventListener('click', closeOnboarding);
}

function firstNameFromGoogle(){
  const raw = cloud.user?.displayName || '';
  const first = raw.trim().split(/\s+/)[0] || '';
  return first;
}
function formatHomeGreeting(template, name){
  const resolved = template.replaceAll('{name}', name);
  if(HOME_GREETINGS_EXACT.has(template)) return resolved;
  return `${resolved.replace(/[.!?…]+$/g, '').trim()}, ${name}!`;
}
function homeTitle(){
  const name = firstNameFromGoogle();
  if(!name) return 'Gaijin na área...';
  const template = HOME_GREETINGS[homeGreetingIndex % HOME_GREETINGS.length];
  return formatHomeGreeting(template, name);
}
let cloud = { ready:false, auth:null, db:null, provider:null, user:null, loading:false };
let syncTimer = null;
let cloudUnsubscribe = null;
let activeAlbumMode = localStorage.getItem('meu-album-copa-active-mode') || 'personal';
let familyAlbumId = localStorage.getItem('meu-album-copa-family-id') || '';
let familyAlbumMeta = null;
let applyingRemoteState = false;
let lastCloudServerMs = 0;
let packSession = [];
let lastUndo = null;
const gestureLastTapById = new Map();
const gestureSuppressClickUntil = new Map();
let albumSortMode = localStorage.getItem('meu-album-copa-sort-mode') || 'album';
const openSections = new Set(loadOpenSections());
let firstHomeRenderDone = false;

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
  const safeCode = escapeAttr(String(code).toUpperCase());
  const safeLabel = escapeAttr(label || code);
  const src = `./flags/${normalized}.svg`;
  return `<span class="flag-wrap" data-code="${safeCode}"><img class="flag-img" src="${src}" alt="${safeLabel}" loading="lazy" decoding="async" onerror="this.closest('.flag-wrap')?.classList.add('flag-failed'); this.remove();"></span>`;
}
function flagMark(code, label=''){
  return flagImg(code, label) || `<span class="flag-wrap flag-failed" data-code="${escapeAttr(code || '')}"></span>`;
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

function isOffline(){
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}
function connectionLabel(){
  return isOffline() ? 'Offline' : 'Online';
}



function safeGoView(view){
  try{
    if(typeof switchView === 'function'){
      switchView(view);
      return;
    }
    if(typeof setView === 'function'){
      setView(view);
      return;
    }
    if(typeof navigate === 'function'){
      navigate(view);
      return;
    }
    if(typeof goToView === 'function'){
      goToView(view);
      return;
    }
    if(typeof render === 'function'){
      currentView = view;
      render();
      return;
    }
  }catch(e){
    console.warn('safeGoView failed', e);
  }
}
function ensureAppModal(){
  let modal = document.querySelector('#modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  return modal;
}

function bindHeaderShortcuts(){
  const goHome = (ev) => {
    ev?.preventDefault?.();
    safeGoView('home');
  };
  const goProfile = (ev) => {
    ev?.preventDefault?.();
    safeGoView('profile');
  };

  const logoTargets = [
    $('#brandHomeBtn'),
    document.querySelector('.brand-logo'),
    document.querySelector('.brand-text'),
    document.querySelector('.brand')
  ].filter(Boolean);

  logoTargets.forEach(el => {
    if(el.dataset.boundHome === '1') return;
    el.dataset.boundHome = '1';
    el.style.cursor = 'pointer';
    el.addEventListener('click', goHome);
    el.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' '){
        goHome(ev);
      }
    });
  });

  const avatarBtn = $('#headerIdentity');
  if(avatarBtn && avatarBtn.dataset.boundProfile !== '1'){
    avatarBtn.dataset.boundProfile = '1';
    avatarBtn.addEventListener('click', goProfile);
    avatarBtn.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' '){
        goProfile(ev);
      }
    });
  }
}

function updateHeaderIdentity(){
  const el = $('#headerIdentity');
  if(!el) return;
  el.innerHTML = `${userPhotoMarkup('xs')}<span>${escapeHtml(userFirstName())}</span>`;
}

function updateConnectionBadge(){
  const badge = $('#connectionBadge');
  if(!badge) return;
  const offline = isOffline();
  badge.textContent = offline ? 'Offline · salvo localmente' : 'Online';
  badge.classList.toggle('offline', offline);
}
function bindConnectionEvents(){
  window.addEventListener('online', () => {
    updateConnectionBadge();
updateHeaderIdentity();
    safeToast('Online novamente. Sincronizando...');
    if(cloud.user) syncNow();
  });
  window.addEventListener('offline', () => {
    updateConnectionBadge();
    safeToast('Você está offline. Alterações ficam salvas neste aparelho.');
  });
}

function syncLabel(){ return cloud.user ? 'Google conectado' : 'Modo local'; }
function syncHint(){ return cloud.user ? `${activeAlbumLabel()} · sincronização em tempo real ativa` : 'Seus dados estão salvos neste aparelho'; }
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

function currentStateSummary(value=state){
  const normalized = normalizeState(value);
  const owned = Object.values(normalized.quantities || {}).filter(v => Number(v)>0).length;
  const physical = Object.values(normalized.quantities || {}).reduce((sum,v)=>sum+Math.max(0, Number(v)||0),0);
  const duplicates = Object.values(normalized.quantities || {}).reduce((sum,v)=>sum+Math.max(0, (Number(v)||0)-1),0);
  return {owned, physical, duplicates, updatedAt: normalized.updatedAt || ''};
}
function makeBackupPayload(reason='manual'){
  return {
    app:'Meu Álbum da Copa 2026',
    kind:'backup-json',
    reason,
    exportedAt:new Date().toISOString(),
    version:VERSION,
    activeAlbumMode,
    familyAlbumId: familyAlbumId || '',
    summary: currentStateSummary(state),
    state: normalizeState(state)
  };
}
function downloadJson(filename, payload){
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}
function backupFilename(prefix='meu-album-copa-backup'){
  const stamp = new Date().toISOString().slice(0,19).replace(/[-:T]/g,'');
  const mode = activeAlbumMode === 'family' ? 'familiar' : 'pessoal';
  return `${prefix}-${mode}-${stamp}.json`;
}
function exportJson(){
  downloadJson(backupFilename(), makeBackupPayload('manual-export'));
  safeToast('Backup JSON exportado.');
}
function extractImportedState(raw){
  if(raw?.state && raw?.kind === 'backup-json') return raw.state;
  if(raw?.state && raw?.app) return raw.state;
  if(raw?.quantities) return raw;
  return null;
}
async function importJson(ev){
  const input = ev?.target;
  const file = input?.files?.[0];
  if(!file) return;

  try{
    const text = await file.text();
    const raw = JSON.parse(text);
    const importedRaw = extractImportedState(raw);
    if(!importedRaw) throw new Error('Formato inválido');

    const imported = normalizeState(importedRaw);
    const before = currentStateSummary(state);
    const after = currentStateSummary(imported);

    const msg = [
      'Importar este JSON vai substituir a coleção atual neste aparelho.',
      '',
      `Atual: ${before.owned} coladas, ${before.duplicates} repetidas.`,
      `Arquivo: ${after.owned} coladas, ${after.duplicates} repetidas.`,
      '',
      'Recomendação: exporte um backup antes de importar.',
      '',
      'Deseja continuar?'
    ].join('\n');

    if(!confirm(msg)){
      if(input) input.value = '';
      return;
    }

    if(confirm('Quer exportar um backup de segurança antes de substituir?')){
      downloadJson(backupFilename('backup-antes-de-importar'), makeBackupPayload('before-import'));
    }

    state = imported;
    state.updatedAt = new Date().toISOString();
    saveState('JSON importado');
    if(input) input.value = '';
    render();
    safeToast('JSON importado com segurança.');
  }catch(e){
    console.warn('import json failed', e);
    if(input) input.value = '';
    alert('Não consegui importar este JSON. Verifique se o arquivo é um backup válido do app.');
  }
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
function setQty(id, value, label, options={}){
  const item = itemById(id);
  setLastUsedTeamFromItem(item); if(!item) return;
  const before = qty(id);
  const after = Math.max(0, Number(value)||0);
  if(before === after) return;
  preserveMissingVisualIfNeeded(id, before, after);
  state.quantities[id] = after;
  lastUndo = {id, qty:before, label:`${item.ref} voltou para ${before}`};
  saveState(label || `${item.ref} atualizada`);
  render();
  toastAction(`${item.ref}: ${qty(id)} unidade(s)`, 'Desfazer', undoLastAction);
}
function addQty(id, delta){ const item = itemById(id);
  setLastUsedTeamFromItem(item); if(item) setQty(id, Math.max(0, qty(id)+delta), `${item.ref} ${delta>0?'adicionada':'removida'}`); }
function quickToggle(id){ const item = itemById(id); if(item) setQty(id, qty(id)>0 ? 0 : 1, `${item.ref} ${qty(id)>0?'marcada como falta':'marcada como tenho'}`); }

function flashGesture(el, className){
  el?.classList.add(className);
  setTimeout(() => el?.classList.remove(className), 180);
}
function bindStickerGesture(el, id, onSingle, onClear){
  const LONG_PRESS_MS = 420;
  const MOVE_TOLERANCE = 12;
  const SUPPRESS_AFTER_CLEAR_MS = 900;
  let pressTimer = null;
  let longTriggered = false;
  let pointerActive = false;
  let startX = 0;
  let startY = 0;
  let activePointerId = null;

  const targetEl = () => el.closest('.sticker') || el.closest('.quick-sticker') || el;

  const clearPressTimer = () => {
    if(pressTimer){
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const resetPressState = () => {
    clearPressTimer();
    pointerActive = false;
    activePointerId = null;
    el.classList.remove('pressing');
  };

  const triggerLongPress = () => {
    if(!pointerActive) return;
    longTriggered = true;
    gestureSuppressClickUntil.set(id, Date.now() + SUPPRESS_AFTER_CLEAR_MS);
    clearPressTimer();
    onClear(id);
    flashGesture(targetEl(), 'long-press');
    try{
      if(typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(18);
    }catch(e){}
  };

  el.addEventListener('pointerdown', ev => {
    if(ev.button !== undefined && ev.button !== 0) return;

    const suppressUntil = gestureSuppressClickUntil.get(id) || 0;
    if(Date.now() < suppressUntil){
      ev.preventDefault();
      return;
    }

    pointerActive = true;
    longTriggered = false;
    activePointerId = ev.pointerId;
    startX = ev.clientX || 0;
    startY = ev.clientY || 0;
    el.classList.add('pressing');
    clearPressTimer();
    pressTimer = setTimeout(triggerLongPress, LONG_PRESS_MS);
  }, {passive:false});

  el.addEventListener('pointermove', ev => {
    if(!pointerActive || activePointerId !== ev.pointerId) return;
    const dx = Math.abs((ev.clientX || 0) - startX);
    const dy = Math.abs((ev.clientY || 0) - startY);
    if(dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE){
      clearPressTimer();
      el.classList.remove('pressing');
    }
  }, {passive:true});

  const finishPress = (ev, shouldFireSingle = true) => {
    if(activePointerId !== null && ev.pointerId !== undefined && activePointerId !== ev.pointerId) return;

    const wasLong = longTriggered;
    resetPressState();

    const suppressUntil = gestureSuppressClickUntil.get(id) || 0;
    if(wasLong || Date.now() < suppressUntil){
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    if(shouldFireSingle){
      ev.preventDefault();
      ev.stopPropagation();
      onSingle(id);
      flashGesture(targetEl(), 'tap-feedback');
    }
  };

  el.addEventListener('pointerup', ev => finishPress(ev, true), {passive:false});
  el.addEventListener('pointercancel', ev => finishPress(ev, false), {passive:false});
  el.addEventListener('pointerleave', ev => {
    if(!pointerActive) return;
    clearPressTimer();
    el.classList.remove('pressing');
  }, {passive:true});

  el.addEventListener('click', ev => {
    const suppressUntil = gestureSuppressClickUntil.get(id) || 0;
    if(Date.now() < suppressUntil){
      ev.preventDefault();
      ev.stopPropagation();
    }
  }, true);

  el.addEventListener('dragstart', ev => ev.preventDefault());
  el.addEventListener('contextmenu', ev => ev.preventDefault());
}

function quickAddOne(id){
  const item = itemById(id);
  if(!item) return;
  setQty(id, qty(id) + 1, `${item.ref} +1 no visual rápido`);
}
function quickClear(id){
  const item = itemById(id);
  if(!item) return;
  setQty(id, 0, `${item.ref} zerada no visual rápido`);
}
function bindQuickActions(scope=document){
  $$('[data-quick-id]', scope).forEach(el => {
    bindStickerGesture(
      el,
      el.dataset.quickId,
      quickAddOne,
      quickClear
    );
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
  if(currentView !== view) clearPreservedMissingWhenLeaving(view);
  currentView = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#viewTitle').textContent = view === 'home' ? homeTitle() : (({album:'Álbum', quick:'Visual rápido', add:'Adicionar', trades:'Trocas', missing:'Faltantes', profile:'Perfil'})[view] || 'Meu Álbum');
  render();
}

const VIEW_ORDER = ['home','quick','add','trades','profile'];

function canSwipeFromTarget(target){
  if(!target) return false;
  return !target.closest('input, textarea, select, button, a, label, .sticker, .quick-cell, .trade-item, .drawer-head, .modal, .info-modal, .bottom-nav, .nav-btn, [data-team], [data-expand], [data-info]');
}

function initSwipeNavigation(){
  const root = document.querySelector('.screen-wrap') || document.querySelector('.app') || document.body;
  if(!root || root.dataset.swipeReady === '1') return;
  root.dataset.swipeReady = '1';

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let tracking = false;

  root.addEventListener('touchstart', (ev) => {
    if(ev.touches.length !== 1) return;
    const touch = ev.touches[0];
    if(!canSwipeFromTarget(ev.target)) return;
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    tracking = true;
  }, {passive:true});

  root.addEventListener('touchmove', (ev) => {
    if(!tracking || ev.touches.length !== 1) return;
    const touch = ev.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if(Math.abs(dy) > 42 && Math.abs(dy) > Math.abs(dx) * 1.2){
      tracking = false;
    }
  }, {passive:true});

  root.addEventListener('touchend', (ev) => {
    if(!tracking) return;
    tracking = false;

    const touch = ev.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const elapsed = Date.now() - startTime;

    if(Math.abs(dx) < 70) return;
    if(Math.abs(dx) < Math.abs(dy) * 1.35) return;
    if(elapsed > 700) return;

    const index = VIEW_ORDER.indexOf(currentView);
    if(index < 0) return;

    const nextIndex = dx < 0 ? index + 1 : index - 1;
    if(nextIndex < 0 || nextIndex >= VIEW_ORDER.length) return;

    const nextView = VIEW_ORDER[nextIndex];
    document.querySelector('.screen-wrap')?.classList.add(dx < 0 ? 'swipe-next' : 'swipe-prev');
    setTimeout(() => document.querySelector('.screen-wrap')?.classList.remove('swipe-next','swipe-prev'), 220);
    switchView(nextView);
  }, {passive:true});
}



function render(){
  bindStatusFilterBridge();
  
  
  bindHeaderShortcuts();
  updateHeaderIdentity();
  if(currentView === 'home') renderHome();
  if(currentView === 'album') renderAlbum();
  if(currentView === 'quick') renderQuickView();
  if(currentView === 'add') renderAdd();
  if(currentView === 'trades') renderTrades();
  if(currentView === 'missing') renderMissing();
  if(currentView === 'profile') renderProfile();

  bindStatusFilter('album');
  bindStatusFilter('quick');
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


function closeAllSectionsOnFirstHome(){
  if(firstHomeRenderDone) return;
  openSections.clear();
  saveOpenSections();
  firstHomeRenderDone = true;
}

function renderHome(){
  const s = stats();
  const level = collectorLevel(s.progress);
  const groups = [...new Set(window.ALBUM_DATA.teams.map(t => t.group))];
  const showOnboarding = !onboardingSeen();

  $('#view-home').innerHTML = `
    ${renderOnboardingCard()}
    <section class="card continue-card">
      <div class="continue-main">
        ${userPhotoMarkup('md')}
        <div><span class="label">Sua coleção</span><h3>${escapeHtml(userFirstName())}, bora continuar?</h3><p class="muted">${saveStatusMarkup()}</p></div>
      </div>
      <button class="btn primary" id="continueSessionBtn" type="button">${continueLabel()}</button>
    </section>
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
        <span class="sync-badge ${cloud.user ? 'cloud' : 'local'}">${escapeHtml(syncLabel())}</span><span class="sync-badge mode">${escapeHtml(activeAlbumLabel())}</span>
        <small>${escapeHtml(syncHint())}</small>
      </div>
      <div class="status-subline">Última atualização local: ${escapeHtml(formatUpdatedAt(state.updatedAt))}</div>
    </section>

    ${googleReminderCard()}

    ${renderAdsPlaceholder('home')}

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

    ${renderStatusFilter('album')}

    <section class="card filter-drawer-card">
      <button id="filterDrawerToggle" class="drawer-toggle" type="button" aria-expanded="false">
        <span>
          <small class="label">Filtros do álbum</small>
          <strong>Buscar seleções</strong>
        </span>
        <b class="drawer-chevron">⌄</b>
      </button>
      <div id="filterDrawerPanel" class="drawer-panel">
        <div class="drawer-inner">
          <div class="filters">
            <input id="albumSearch" class="search" type="search" placeholder="Buscar: BRA 10, Brasil, Vini Jr, falta...">
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
        </div>
      </div>
    </section>

    <section class="card sort-card">
      <div class="album-sort-row">
        <span class="muted">Organizar seleções</span>
        <button id="sortModeBtn" class="sort-switch dual-sort-switch" type="button" aria-pressed="false">
          <span class="sort-option sort-album">Ordem do álbum</span>
          <span class="switch-track"><i></i></span>
          <span class="sort-option sort-alpha">Ordem alfabética</span>
        </button>
      </div>
    </section>

    <div id="teamList" class="team-list"></div>`;

  const sync = () => renderTeamList();
  const syncSearch = debounce(sync, 120);
  $('#statusFilter').value = statusFilterToNativeValue(getStatusFilter('album'));
  $('#albumSearch').addEventListener('input', syncSearch);
  $('#groupFilter').addEventListener('change', sync);
  $('#statusFilter').addEventListener('change', () => {
    setStatusFilter('album', nativeStatusToButtonValue($('#statusFilter')?.value || ''));
    updateKpiActions();
    bindStatusFilter('album');
    sync();
  });
  $('#clearFilters').addEventListener('click', () => {
    $('#albumSearch').value='';
    $('#groupFilter').value='';
    $('#statusFilter').value='';
    setStatusFilter('album', 'all');
    updateKpiActions();
    bindStatusFilter('album');
    sync();
  });
  $$('.kpi-action').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.kpiFilter === 'all' ? '' : btn.dataset.kpiFilter;
    $('#statusFilter').value = target;
    setStatusFilter('album', nativeStatusToButtonValue(target));
    updateKpiActions();
    bindStatusFilter('album');
    closeAllSectionsOnFirstHome();
    renderTeamList();
    $('#teamList')?.scrollIntoView({behavior:'smooth', block:'start'});
  }));
  $('#homeGoogleLogin')?.addEventListener('click', signInCloud);
  $('#filterDrawerToggle')?.addEventListener('click', () => {
    const card = $('#filterDrawerToggle').closest('.filter-drawer-card');
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    $('#filterDrawerToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  });
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
  closeAllSectionsOnFirstHome();
  renderTeamList();

  bindOnboarding();
  $('#continueSessionBtn')?.addEventListener('click', continueLastSession);
}


const STATUS_FILTERS = [
  {key:'all', label:'Todas'},
  {key:'missing', label:'Faltantes'},
  {key:'owned', label:'Tenho'},
  {key:'duplicates', label:'Repetidas'}
];

function getStatusFilter(scope){
  return localStorage.getItem(`meu-album-copa-status-filter-${scope}`) || 'all';
}
function setStatusFilter(scope, value){
  const allowed = STATUS_FILTERS.some(f => f.key === value) ? value : 'all';
  localStorage.setItem(`meu-album-copa-status-filter-${scope}`, allowed);
  if(allowed !== 'missing') clearPreservedMissing(scope);
}

const PRESERVED_MISSING_BY_SCOPE = {
  album: new Set(),
  quick: new Set()
};

function scopeForCurrentView(){
  if(currentView === 'quick') return 'quick';
  if(currentView === 'album') return 'album';
  return null;
}
function preserveMissingVisualIfNeeded(id, beforeQty, afterQty){
  const scope = scopeForCurrentView();
  if(!scope) return;
  if(getStatusFilter(scope) !== 'missing') return;
  if(Number(beforeQty || 0) === 0 && Number(afterQty || 0) > 0){
    PRESERVED_MISSING_BY_SCOPE[scope]?.add(id);
  }
}
function isPreservedMissing(scope, id){
  return !!PRESERVED_MISSING_BY_SCOPE[scope]?.has(id);
}
function clearPreservedMissing(scope){
  if(scope && PRESERVED_MISSING_BY_SCOPE[scope]){
    PRESERVED_MISSING_BY_SCOPE[scope].clear();
  }
}
function clearPreservedMissingWhenLeaving(nextView){
  if(nextView !== 'album') clearPreservedMissing('album');
  if(nextView !== 'quick') clearPreservedMissing('quick');
}

function stickerMatchesStatusFilter(item, filter, scope=null){
  const q = qty(item.id);
  if(filter === 'missing') return q === 0 || (scope && isPreservedMissing(scope, item.id));
  if(filter === 'owned') return q > 0;
  if(filter === 'duplicates') return q > 1;
  return true;
}




function statusFilterToNativeValue(value){
  if(value === 'all') return '';
  if(value === 'duplicates') return 'duplicate';
  return value || '';
}
function nativeStatusToButtonValue(value){
  if(value === 'duplicate') return 'duplicates';
  return value || 'all';
}
function applyStatusFilterBridge(scope, filter){
  const safeFilter = STATUS_FILTERS.some(f=>f.key === filter) ? filter : 'all';
  setStatusFilter(scope, safeFilter);

  const nativeValue = statusFilterToNativeValue(safeFilter);

  if(scope === 'quick'){
    const select = $('#quickStatusFilter');
    if(select) select.value = nativeValue;
    if(typeof renderQuickSections === 'function') renderQuickSections();
  }else{
    const select = $('#statusFilter');
    if(select) select.value = nativeValue;
    if(typeof updateKpiActions === 'function') updateKpiActions();
    if(typeof renderTeamList === 'function') renderTeamList();
  }

  $$(`[data-status-scope="${scope}"] [data-status-filter]`).forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.statusFilter === safeFilter);
  });
}
function bindStatusFilterBridge(){
  if(document.body.dataset.statusFilterBridge === '1') return;
  document.body.dataset.statusFilterBridge = '1';

  document.body.addEventListener('click', ev=>{
    const btn = ev.target.closest('[data-status-filter]');
    if(!btn) return;
    const wrap = btn.closest('[data-status-scope]');
    const scope = wrap?.dataset?.statusScope || (currentView === 'quick' ? 'quick' : 'album');
    ev.preventDefault();
    ev.stopPropagation();
    applyStatusFilterBridge(scope, btn.dataset.statusFilter || 'all');
  }, true);
}

function renderStatusFilter(scope){
  const active = getStatusFilter(scope);
  return `<div class="status-filter-card" data-status-scope="${escapeAttr(scope)}">
    <span class="label">Visualizar figurinhas</span>
    <div class="status-filter-row" role="group" aria-label="Filtro de status">
      ${STATUS_FILTERS.map(f=>`<button type="button" class="status-filter-btn ${active === f.key ? 'active' : ''}" data-status-filter="${escapeAttr(f.key)}">${escapeHtml(f.label)}</button>`).join('')}
    </div>
  </div>`;
}
function bindStatusFilter(scope){
  const active = getStatusFilter(scope);
  $$(`[data-status-scope="${scope}"] [data-status-filter]`).forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.statusFilter === active);
  });
}


function statusFilterSummary(scope, items){
  const filter = getStatusFilter(scope);
  if(filter === 'all') return '';
  const label = STATUS_FILTERS.find(f=>f.key===filter)?.label || 'Todas';
  return `<p class="muted status-filter-summary">Mostrando apenas: <strong>${escapeHtml(label)}</strong> · ${items.length} figurinha(s)</p>`;
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
function applySortSwitch(btn){
  if(!btn) return;
  const alpha = albumSortMode === 'alpha';
  btn.classList.toggle('is-alpha', alpha);
  btn.setAttribute('aria-pressed', alpha ? 'true' : 'false');
  const label = btn.querySelector('b');
  if(label) label.textContent = alpha ? 'Ordem alfabética' : 'Ordem do álbum';
  btn.title = alpha ? 'Organizando em ordem alfabética' : 'Organizando na ordem do álbum';
}
function updateSortButton(){ applySortSwitch($('#sortModeBtn')); }
function updateQuickSortButton(){ applySortSwitch($('#quickSortModeBtn')); }
function updateChips(){}
function matchItem(item, q, status){ const hay = `${item.ref} ${item.code} ${item.section} ${item.name} ${item.type} ${statusLabel(item)} ${item.group}`.toLowerCase(); return (!q || hay.includes(q)) && (!status || statusOf(item) === status); }

function loadAlbumSectionGrid(card, key){
  if(!card || !key) return;
  const grid = card.querySelector('.sticker-grid');
  if(!grid) return;
  if(grid.dataset.loaded === '1' && grid.innerHTML.trim()) return;

  const sec = SECTION_LIST.find(s => String(s.sectionKey || s.code) === String(key));
  if(!sec) return;

  grid.innerHTML = sectionItems(sec).map(stickerCard).join('');
  grid.dataset.loaded = '1';
  bindStickerActions(grid);
}

function renderTeamList(){
  const container = $('#teamList');
  if(!container) return;

  const q = ($('#albumSearch')?.value || '').trim().toLowerCase();
  const group = $('#groupFilter')?.value || '';
  const status = $('#statusFilter')?.value || '';

  let sections = sortedSectionsForAlbum();
  if(!Array.isArray(sections) || !sections.length) sections = SECTION_LIST;
  sections = sections.filter(sec => sec && (!group || sec.group === group));

  // v1.1.8: Home inicia com todas as seleções fechadas.

  const cards = [];
  for(const sec of sections){
    const key = sec.sectionKey || sec.code;
    const allItems = sectionItems(sec);
    const statusButton = nativeStatusToButtonValue(status);
    const items = allItems.filter(i => matchItem(i, q, '') && stickerMatchesStatusFilter(i, statusButton, 'album'));
    if(!items.length) continue;

    const st = sectionStats(sec);
    const groupLabel = sec.group === 'EXTRAS' ? 'Extras' : `Grupo ${sec.group}`;
    const isOpen = openSections.has(key);

    const stickerHtml = isOpen ? items.map(stickerCard).join('') : '';
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
          <div class="sticker-grid" data-grid-section="${escapeAttr(key)}">${stickerHtml}</div>
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
    setStatusFilter('album', 'all');
    updateKpiActions();
    bindStatusFilter('album');
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

    if(open){
      loadAlbumSectionGrid(card, key);
    }
  }));

  $$('.album-page.open', container).forEach(card => {
    loadAlbumSectionGrid(card, card.dataset.section);
  });

  bindStickerActions(container);
}
function stickerCard(item){
  const q = qty(item.id); const s = statusOf(item); const name = stickerDisplayName(item); const meta = stickerDisplayMeta(item); const special = item.type === 'especial' || item.type === 'history' || item.type === 'coca-cola'; const shield = item.type === 'escudo'; const n = String(item.number).padStart(2,'0'); const badge = (!special && item.code) ? flagMark(item.code, item.section) : escapeHtml(initials(name, item.code));
  return `<div class="sticker ${s} ${special?'special':''} ${shield?'shield':''}"><button class="sticker-main" data-toggle="${item.id}" aria-label="${escapeAttr(item.ref)} ${escapeAttr(name)}"><span class="status ${s}">${s==='missing'?'FALTA':s==='owned'?'TENHO':`REP +${extras(item)}`}</span><span class="sticker-face"><span class="sticker-top"><span class="code">${escapeHtml(codeOf(item))}</span><span class="num">${escapeHtml(n)}</span></span><span class="art"><span class="emblem">${special?'★':badge}</span></span><span class="sticker-info"><strong class="sticker-name">${escapeHtml(name)}</strong><span class="sticker-meta">${escapeHtml(meta)}</span></span></span></button><div class="qty"><button class="qty-btn" data-dec="${item.id}">−</button><b>${q}</b><button class="qty-btn" data-inc="${item.id}">+</button></div></div>`;
}
function bindStickerActions(ctx=document){
  $$('[data-toggle]',ctx).forEach(b=>{
    if(b.dataset.gestureBound === '1') return;
    b.dataset.gestureBound = '1';

    bindStickerGesture(
      b,
      b.dataset.toggle,
      id => addQty(id, 1),
      id => {
        const item = itemById(id);
        if(item) setQty(id, 0, `${item.ref} zerada`);
      }
    );
  });

  $$('[data-inc]',ctx).forEach(b=>{
    if(b.dataset.qtyBound === '1') return;
    b.dataset.qtyBound = '1';

    b.addEventListener('pointerup',ev=>{
      ev.preventDefault();
      ev.stopPropagation();
      addQty(b.dataset.inc,1);
    });
  });

  $$('[data-dec]',ctx).forEach(b=>{
    if(b.dataset.qtyBound === '1') return;
    b.dataset.qtyBound = '1';

    b.addEventListener('pointerup',ev=>{
      ev.preventDefault();
      ev.stopPropagation();
      addQty(b.dataset.dec,-1);
    });
  });
}


function quickStatusMatches(item){
  return stickerMatchesStatusFilter(item, getStatusFilter('quick'), 'quick');
}
function albumStatusMatches(item){
  return stickerMatchesStatusFilter(item, getStatusFilter('album'), 'album');
}

function renderQuickView(){
  const quickStatusFilter = getStatusFilter('quick');
  const groups = [...new Set(window.ALBUM_DATA.teams.map(t => t.group))];
  const helpOpen = localStorage.getItem(QUICK_HELP_KEY) === '1';
  $('#view-quick').innerHTML = `
    ${renderStatusFilter('quick')}
    <section class="card filter-drawer-card quick-help-card ${helpOpen ? 'open' : ''}">
      <button id="quickHelpToggle" class="drawer-toggle" type="button" aria-expanded="${helpOpen ? 'true' : 'false'}">
        <span>
          <small class="label">Visual rápido</small>
          <strong>Como usar?</strong>
        </span>
        <b class="drawer-chevron">⌄</b>
      </button>
      <div class="drawer-panel">
        <div class="drawer-inner">
          <div class="quick-legend">
            <span class="legend-item"><i class="legend-box quick missing"></i> Faltante</span>
            <span class="legend-item"><i class="legend-box quick owned"></i> Tenho</span>
            <span class="legend-item"><i class="legend-box quick duplicate"></i> Tenho repetida</span>
          </div>
          <p class="muted">Nesta aba, cada quadrado mostra só o número da figurinha. Preto com número dourado = falta. Dourado com número preto = tenho. Dourado com ponto preto = tenho repetida.</p>
          <p class="muted">Toque uma vez para adicionar +1. Toque longo para zerar. No celular, segure até sentir/visualizar o retorno e solte.</p>

          <div class="quick-inline-filters">
            <span class="label">Filtros rápidos</span>
            <div class="filters quick-filters quick-filters-inside">
              <select id="quickGroupFilter"><option value="">Todos os grupos</option>${groups.map(g=>`<option value="${g}">Grupo ${g}</option>`).join('')}<option value="EXTRAS">Extras</option></select>
              <select id="quickStatusFilter"><option value="">Todas</option><option value="missing">Só faltantes</option><option value="duplicate">Só repetidas</option><option value="owned">Só tenho</option></select>
              <input id="quickSearch" class="search" type="search" placeholder="Buscar seleção ou sigla: BRA, Brasil..." autocomplete="off" autocapitalize="characters" spellcheck="false">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card sort-card">
      <div class="album-sort-row quick-sort-row">
        <span class="muted">Organizar seleções</span>
        <button id="quickSortModeBtn" class="sort-switch dual-sort-switch" type="button" aria-pressed="false"><span class="sort-option sort-album">Ordem do álbum</span><span class="switch-track"><i></i></span><span class="sort-option sort-alpha">Ordem alfabética</span></button>
      </div>
    </section>

    <div id="quickSectionList" class="quick-sections"></div>`;

  $('#quickHelpToggle')?.addEventListener('click', ()=>{
    const card = $('.quick-help-card');
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    $('#quickHelpToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    localStorage.setItem(QUICK_HELP_KEY, open ? '1' : '0');
  });

  const sync = () => renderQuickSections();
  const syncSearch = debounce(sync, 120);
  $('#quickStatusFilter').value = statusFilterToNativeValue(getStatusFilter('quick'));
  $('#quickGroupFilter')?.addEventListener('change', sync);
  $('#quickStatusFilter')?.addEventListener('change', ()=>{
    setStatusFilter('quick', nativeStatusToButtonValue($('#quickStatusFilter')?.value || ''));
    sync();
    bindStatusFilter('quick');
  });
  $('#quickSearch')?.addEventListener('input', syncSearch);
  $('#quickSortModeBtn')?.addEventListener('click', () => {
    albumSortMode = albumSortMode === 'album' ? 'alpha' : 'album';
    localStorage.setItem('meu-album-copa-sort-mode', albumSortMode);
    updateQuickSortButton();
    renderQuickSections();
  });
  updateQuickSortButton();
  renderQuickSections();

  bindStatusFilter('quick');
}

function renderQuickSections(){
  const group = $('#quickGroupFilter')?.value || '';
  const query = ($('#quickSearch')?.value || '').trim().toLowerCase();
  const status = getStatusFilter('quick');
  const html = sortedSectionsForAlbum()
    .filter(sec => !group || sec.group === group)
    .filter(sec => {
      if(!query) return true;
      const hay = `${sec.code} ${codeOf(sec)} ${sec.name} ${sec.group}`.toLowerCase();
      return hay.includes(query);
    })
    .map(sec => {
      const items = sectionItems(sec).filter(i => stickerMatchesStatusFilter(i, status, 'quick'));
      if(!items.length) return '';
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
        <div class="quick-grid">${items.map(quickStickerCell).join('')}</div>
      </article>`;
    }).filter(Boolean).join('');
  $('#quickSectionList').innerHTML = html || '<div class="empty">Nenhuma figurinha encontrada nesse filtro.</div>';
  bindQuickActions($('#quickSectionList'));
}

function quickStickerCell(item){
  const q = qty(item.id);
  const stateClass = q > 1 ? 'duplicate' : q === 1 ? 'owned' : 'missing';
  const n = item.number === 0 ? '00' : String(item.number).padStart(2,'0');
  const title = `${item.ref} · ${stickerDisplayName(item)} · ${statusLabel(item)} · toque = +1 · toque duplo = zerar`;
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


function parseBatchText(raw){
  return String(raw || '')
    .split(/[\n,;]+/)
    .map(v => v.trim())
    .filter(Boolean);
}
function addBatchFromText(raw){
  const tokens = parseBatchText(raw);
  const found = [];
  const missing = [];
  tokens.forEach(token => {
    const matches = findCandidates(token);
    if(matches.length === 1){
      addQty(matches[0].id, 1);
      found.push(matches[0]);
      packSession = [{ref:matches[0].ref, name:stickerDisplayName(matches[0])}, ...packSession].slice(0,50);
    }else{
      missing.push(token);
    }
  });
  render();
  setView('add');
  setTimeout(() => {
    const box = $('#batchResult');
    if(box){
      box.innerHTML = `<div class="batch-summary"><strong>${found.length} adicionadas</strong><span>${missing.length ? `${missing.length} não encontradas: ${escapeHtml(missing.join(', '))}` : 'Tudo certo no pacotinho.'}</span></div>`;
    }
  }, 30);
  toast(`${found.length} figurinhas adicionadas em lote.`);
}
function packStats(){
  const unique = new Set(packSession.map(p=>p.ref)).size;
  const total = packSession.length;
  const counts = {};
  packSession.forEach(p => counts[p.ref] = (counts[p.ref] || 0) + 1);
  const dup = Object.values(counts).reduce((s,v)=>s+Math.max(0,v-1),0);
  return {unique,total,dup};
}


function renderAdd(){
  const ps = packStats();
  $('#view-add').innerHTML = `
    <section class="card">
      <span class="label">Modo pacotinho</span>
      <h2>Adicionar figurinhas</h2>
        <div class="add-flow-hint"><span>Código único</span><span>Lote</span><span>Pacotinho</span></div>
      <p class="muted">Digite o código do verso: <strong>BRA 10</strong>, <strong>HAI08</strong>, <strong>FWC 1</strong>, <strong>CC 1</strong> ou <strong>00</strong>.</p>
      <div class="filters">
        <input id="addInput" class="search" type="search" placeholder="Ex: BRA 10" autocomplete="off">
        <button id="addSearch" class="btn primary">Buscar</button>
      </div>
      <div class="chips">
        <button class="pill" data-fill="BRA 10">BRA 10</button>
        <button class="pill" data-fill="MEX 3">MEX 3</button>
        <button class="pill" data-fill="FWC 1">FWC 1</button>
        <button class="pill" data-fill="CC 1">CC 1</button>
      </div>
      <div id="addResults" class="list"></div>
    </section>

    <section class="card batch-card">
      <span class="label">Entrada em lote</span>
      <p class="muted">Cole uma lista com uma figurinha por linha. Ex.: BRA 10, MEX 03, FWC 01.</p>
      <textarea id="batchInput" rows="5" maxlength="8000" placeholder="BRA 10&#10;BRA 11&#10;MEX 03&#10;FWC 01"></textarea>
      <div class="button-row">
        <button class="btn primary" id="addBatch">Adicionar lote</button>
        <button class="btn" id="clearBatch">Limpar campo</button>
      </div>
      <div id="batchResult"></div>
    </section>

    <section class="card pack-card">
      <span class="label">Pacotinho atual</span>
      <div class="pack-stats">
        <span><strong>${ps.total}</strong><small>Total</small></span>
        <span><strong>${ps.unique}</strong><small>Únicas</small></span>
        <span><strong>${ps.dup}</strong><small>Repetidas no pacote</small></span>
      </div>
      <div id="packList" class="pack-list"></div>
      <div class="button-row">
        <button class="btn" id="clearPack">Limpar lista</button>
        <button class="btn primary" id="finishPack">Finalizar pacote</button>
      </div>
    </section>
    ${renderAddInsights()}`;
  $('#addInput').addEventListener('input', renderAddResults);
  $('#addSearch').addEventListener('click', renderAddResults);
  $('#addInput').addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const c = findCandidates(e.target.value);
      if(c.length === 1) addFromAdd(c[0].id);
      else renderAddResults();
    }
  });
  $$('[data-fill]').forEach(b=>b.addEventListener('click',()=>{
    $('#addInput').value=b.dataset.fill;
    renderAddResults();
    $('#addInput').focus();
  }));
  $('#addBatch').addEventListener('click',()=>addBatchFromText($('#batchInput').value));
  $('#clearBatch').addEventListener('click',()=>{$('#batchInput').value=''; $('#batchResult').innerHTML='';});
  $('#clearPack').addEventListener('click',()=>{packSession=[]; renderAdd();});
  $('#finishPack').addEventListener('click',()=>{const done=packStats(); packSession=[]; renderAdd(); toast(`Pacote finalizado: ${done.total} lançadas.`);});
  renderAddResults();
  renderPack();
  setTimeout(()=>$('#addInput')?.focus(),30);
}
function addFromAdd(id){ const item = itemById(id); if(!item) return; addQty(id,1); packSession = [{ref:item.ref, name:stickerDisplayName(item)}, ...packSession].slice(0,50); renderPack(); renderAddResults(); }
function renderAddResults(){ const raw=$('#addInput')?.value||''; const box=$('#addResults'); if(!box) return; if(!raw.trim()){ box.innerHTML='<div class="empty">Digite um código para começar.</div>'; return; } const candidates=findCandidates(raw); box.innerHTML = candidates.length ? candidates.map(i=>`<div class="row add-result compact"><div class="add-result-info"><strong>${escapeHtml(i.ref)} · ${escapeHtml(stickerDisplayName(i))}</strong><small>${escapeHtml(i.section)} · ${escapeHtml(typeLabel(i.type))} · ${statusLabel(i)} · qtd ${qty(i.id)}</small></div><div class="button-row add-actions"><button class="btn" data-adddec="${i.id}">−</button><button class="btn primary" data-addone="${i.id}">+1</button></div></div>`).join('') : '<div class="empty">Não encontrei esse código.</div>'; $$('[data-addone]',box).forEach(b=>b.addEventListener('pointerup',ev=>{ev.preventDefault(); addFromAdd(b.dataset.addone);})); $$('[data-adddec]',box).forEach(b=>b.addEventListener('pointerup',ev=>{ev.preventDefault(); addQty(b.dataset.adddec,-1);})); }
function renderPack(){ const box=$('#packList'); if(box) box.innerHTML = packSession.length ? packSession.map(p=>`<div class="row"><div><strong>${escapeHtml(p.ref)}</strong><small>${escapeHtml(p.name)}</small></div><b>+1</b></div>`).join('') : '<div class="empty">Nada lançado neste pacotinho ainda.</div>'; }

function formatList(filter, mode='default'){
  const rows=[];
  SECTION_LIST.forEach(sec => {
    const items = sectionItems(sec).filter(filter);
    if(items.length){
      const icon = mode==='dup' ? '🔁' : '📌';
      rows.push(`${icon} ${codeOf(sec)} · ${sec.name}`);
      rows.push(items.map(i => `${String(i.number).padStart(2,'0')}${mode==='dup'?` (+${extras(i)} / x${qty(i.id)})`:''}`).join(', '));
      rows.push('');
    }
  });
  return rows.join('\n').trim() || 'Nada por aqui ainda.';
}



function formatDuplicateTradeList(){
  const rows = [];
  SECTION_LIST.forEach(sec => {
    const items = sectionItems(sec)
      .filter(i => qty(i.id) > 1)
      .sort((a,b)=>a.number-b.number);

    if(items.length){
      rows.push(`${codeOf(sec)}:`);
      rows.push(items.map(i => `${Number(i.number)} (${extras(i)} ${extras(i) === 1 ? 'rep' : 'reps'})`).join(', '));
      rows.push('');
    }
  });

  return rows.join('\n').trim() || 'Sem repetidas no momento.';
}


function formatMissingTradeList(){
  const rows = [];
  SECTION_LIST.forEach(sec => {
    const items = sectionItems(sec)
      .filter(i => qty(i.id) === 0)
      .sort((a,b)=>a.number-b.number);

    if(items.length){
      rows.push(`${codeOf(sec)}:`);
      rows.push(items.map(i => `${Number(i.number)}`).join(', '));
      rows.push('');
    }
  });

  return rows.join('\n').trim() || 'Sem faltantes no momento.';
}

function parseRefsFromText(raw){
  const text = String(raw || '').toUpperCase();
  const found = [];
  const seen = new Set();

  const pushItem = (item) => {
    if(!item || seen.has(item.id)) return;
    seen.add(item.id);
    found.push(item);
  };

  const tokens = text
    .replace(/[•|]/g, ' ')
    .split(/[\n,;]+/)
    .map(v => v.trim())
    .filter(Boolean);

  tokens.forEach(token => {
    const matches = findCandidates(token);
    if(matches.length === 1) pushItem(matches[0]);
  });

  const re = /\b([A-Z]{2,4}|FWC|CC|PAN)\s*[-:]?\s*(\d{1,2})\b/g;
  let m;
  while((m = re.exec(text))){
    const code = m[1];
    const num = Number(m[2]);
    const item = albumItems.find(i => (String(codeOf(i)).toUpperCase() === code || String(i.code).toUpperCase() === code) && Number(i.number) === num);
    pushItem(item);
  }

  return found;
}
function isSpecialTradeSticker(item){
  const code = String(codeOf(item) || item.code || '').toUpperCase();
  return code === 'FWC' || Number(item.number) === 1 || Number(item.number) === 13 || item.type === 'especial';
}


function tradeListText(items, prefix='-'){
  return items.length
    ? items.map(i => `${prefix} ${i.ref} — ${stickerDisplayName(i)}${isSpecialTradeSticker(i) ? ' [ESPECIAL]' : ''}`).join('\\n')
    : `${prefix} nada selecionado`;
}

function getLocalTrocaiCode(){
  const KEY = 'meu-album-copa-trocai-code';
  let code = localStorage.getItem(KEY);
  if(!code){
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    code = 'TROCA-';
    for(let i=0;i<5;i++) code += chars[Math.floor(Math.random()*chars.length)];
    localStorage.setItem(KEY, code);
  }
  return code;
}

function renderCompareTool(){
  return `<section class="card compare-card trocai-card trocai-card-premium">
    <span class="label">Trocaí Beta</span>
    <h3>Proposta de troca</h3>
    <p class="muted">Compare com alguém pelo Trocaí ou use listas manuais quando a outra pessoa ainda não usa o app.</p>

    <div class="trocai-switch-row">
      <button id="trocaiModeBtn" class="sort-switch dual-sort-switch trocai-dual-switch" type="button" aria-pressed="false" aria-label="Alternar entre Manual e Trocaí">
        <span class="sort-option sort-manual">Manual</span>
        <span class="switch-track"><i></i></span>
        <span class="sort-option sort-trocai">Trocaí</span>
      </button>
    </div>
    <p class="muted trocai-switch-help"><strong>Manual</strong> para colar listas. <strong>Trocaí</strong> para comparar por código.</p>

    <div id="manualTradeMode" class="trocai-mode-panel active">
      <label class="compare-label">Repetidas da outra pessoa <small>O que ela pode te enviar</small></label>
      <textarea id="otherDupInput" rows="3" placeholder="Ex.: BRA 10&#10;MEX 15&#10;FWC 01"></textarea>

      <label class="compare-label">Faltantes da outra pessoa <small>O que ela precisa de você</small></label>
      <textarea id="otherMissingInput" rows="3" placeholder="Ex.: RSA 04&#10;ARG 07&#10;BRA 13"></textarea>

      <div class="button-row compact-row">
        <button class="btn primary" id="runCompare" type="button">Gerar proposta</button>
        <button class="btn" id="clearCompare" type="button">Limpar</button>
      </div>
    </div>

    <div id="codeTradeMode" class="trocai-mode-panel" hidden>
      <div class="trocai-code-box">
        <span class="label">Meu código Trocaí</span>
        <strong id="myTrocaiCode">${escapeHtml(getLocalTrocaiCode())}</strong>
        <small class="muted">Modo preparado para a comparação por nuvem da próxima fase.</small>
      </div>

      <label class="compare-label">Código da outra pessoa <small>Para quem também usa o app</small></label>
      <input id="otherTrocaiCode" class="search" placeholder="Ex.: TROCA-8K2P7" autocomplete="off" autocapitalize="characters" spellcheck="false">

      <div class="button-row compact-row">
        <button class="btn primary" id="compareTrocaiCode" type="button">Verificar código</button>
        <button class="btn" id="copyMyTrocaiCode" type="button">Copiar meu código</button>
      </div>

      <p class="muted tools-note compact-note">Nesta etapa, o código já fica pronto. A leitura pública pela nuvem entra na próxima evolução do Trocaí.</p>
    </div>

    <div id="compareResult" class="compare-result empty">Escolha Manual ou Trocaí e siga com a proposta.</div>
  </section>`;
}
function renderProposalItem(item, side, checked=true){
  const special = isSpecialTradeSticker(item);
  return `<label class="proposal-item ${special ? 'special' : ''}">
    <input type="checkbox" data-proposal-${side}="${escapeAttr(item.id)}" ${checked ? 'checked' : ''}>
    <span>
      <strong>${escapeHtml(item.ref)}</strong>
      <small>${escapeHtml(stickerDisplayName(item))}</small>
    </span>
    <b>${special ? 'Especial' : 'Normal'}<em>${special ? 'destaque' : 'comum'}</em></b>
  </label>`;
}
function renderCompareResultFromFields(){
  const otherDupItems = parseRefsFromText($('#otherDupInput')?.value || '');
  const otherMissingItems = parseRefsFromText($('#otherMissingInput')?.value || '');

  const receiveCandidates = otherDupItems.filter(i => qty(i.id) === 0);
  const sendCandidates = otherMissingItems.filter(i => qty(i.id) > 1);

  $('#compareResult').classList.remove('empty');
  $('#compareResult').innerHTML = `
    <div class="proposal-summary">
      <div><strong id="receiveCount">${receiveCandidates.length}</strong><span>possíveis para você receber</span></div>
      <div><strong id="sendCount">${sendCandidates.length}</strong><span>possíveis para você enviar</span></div>
      <div><strong id="specialCount">0</strong><span>especiais selecionadas</span></div>
    </div>

    <div class="proposal-grid">
      <div class="proposal-box receive">
        <h4>Você recebe</h4>
        <p class="muted">Ela tem repetida e está faltando para você.</p>
        <div class="proposal-list" id="receiveProposalList">
          ${receiveCandidates.length ? receiveCandidates.map(i=>renderProposalItem(i,'receive',true)).join('') : '<div class="empty">Nada cruzou aqui.</div>'}
        </div>
      </div>

      <div class="proposal-box send">
        <h4>Você envia</h4>
        <p class="muted">Você tem repetida e ela precisa.</p>
        <div class="proposal-list" id="sendProposalList">
          ${sendCandidates.length ? sendCandidates.map(i=>renderProposalItem(i,'send',true)).join('') : '<div class="empty">Nada cruzou aqui.</div>'}
        </div>
      </div>
    </div>

    <div class="proposal-extra-card">
      <span class="label">Adicionar manualmente</span>
      <div class="proposal-extra-grid">
        <input id="manualReceiveInput" class="search" placeholder="Adicionar ao que recebo. Ex.: FWC 01">
        <button class="btn" id="manualReceiveBtn" type="button">Adicionar em recebo</button>
        <input id="manualSendInput" class="search" placeholder="Adicionar ao que envio. Ex.: BRA 13">
        <button class="btn" id="manualSendBtn" type="button">Adicionar em envio</button>
      </div>
    </div>

    <div class="button-row compare-copy-row">
      <button class="btn primary" id="copyProposal" type="button">Copiar proposta completa</button>
      <button class="btn" id="copyProposalShort" type="button">Copiar resumo</button>
    </div>`;

  function selectedItems(side){
    return $$(`[data-proposal-${side}]`)
      .filter(el => el.checked)
      .map(el => itemById(el.dataset[`proposal${side[0].toUpperCase()+side.slice(1)}`]))
      .filter(Boolean);
  }

  function updateSummary(){
    const receive = selectedItems('receive');
    const send = selectedItems('send');
    const specialTotal = [...receive, ...send].filter(isSpecialTradeSticker).length;
    $('#receiveCount').textContent = receive.length;
    $('#sendCount').textContent = send.length;
    $('#specialCount').textContent = specialTotal;
  }
  function bindChecks(){
    $$('[data-proposal-receive], [data-proposal-send]').forEach(el => el.addEventListener('change', updateSummary));
  }

  function addManual(side){
    const input = side === 'receive' ? $('#manualReceiveInput') : $('#manualSendInput');
    const list = side === 'receive' ? $('#receiveProposalList') : $('#sendProposalList');
    const match = findCandidates(input.value || '')[0];
    if(!match) return toast('Não encontrei essa figurinha.');
    const empty = list.querySelector('.empty');
    if(empty) empty.remove();
    list.insertAdjacentHTML('beforeend', renderProposalItem(match, side, true));
    input.value = '';
    bindChecks();
    updateSummary();
  }

  $('#manualReceiveBtn')?.addEventListener('click', () => addManual('receive'));
  $('#manualSendBtn')?.addEventListener('click', () => addManual('send'));

  $('#copyProposal')?.addEventListener('click', () => {
    const receive = selectedItems('receive');
    const send = selectedItems('send');
    copyText(`Proposta de troca:\n\nEu recebo:\n${tradeListText(receive)}\n\nEu envio:\n${tradeListText(send)}\n\nObservação:\nFigurinhas marcadas como [ESPECIAL] foram apenas destacadas. A equivalência da troca fica a combinar.`);
  });

  $('#copyProposalShort')?.addEventListener('click', () => {
    const receive = selectedItems('receive');
    const send = selectedItems('send');
    const specialTotal = [...receive, ...send].filter(isSpecialTradeSticker).length;
    copyText(`Troca: recebo ${receive.length} e envio ${send.length}. Especiais destacadas: ${specialTotal}.`);
  });

  bindChecks();
  updateSummary();
}
function bindCompareTool(){
  let trocaiMode = 'manual';

  const setMode = (mode) => {
    trocaiMode = mode === 'code' ? 'code' : 'manual';

    const toggle = $('#trocaiModeBtn');
    if(toggle){
      toggle.classList.toggle('is-code', trocaiMode === 'code');
      toggle.setAttribute('aria-pressed', trocaiMode === 'code' ? 'true' : 'false');
    }

    const manual = $('#manualTradeMode');
    const code = $('#codeTradeMode');

    if(manual){
      manual.hidden = trocaiMode !== 'manual';
      manual.classList.toggle('active', trocaiMode === 'manual');
    }
    if(code){
      code.hidden = trocaiMode !== 'code';
      code.classList.toggle('active', trocaiMode === 'code');
    }

    const result = $('#compareResult');
    if(result){
      result.className = 'compare-result empty';
      result.textContent = trocaiMode === 'manual'
        ? 'Cole as listas e gere uma proposta manual.'
        : 'Digite um código Trocaí quando a comparação por nuvem estiver ativada.';
    }
  };

  $('#trocaiModeBtn')?.addEventListener('click', () => setMode(trocaiMode === 'manual' ? 'code' : 'manual'));

  $('#runCompare')?.addEventListener('click', renderCompareResultFromFields);
  $('#clearCompare')?.addEventListener('click', () => {
    if($('#otherDupInput')) $('#otherDupInput').value = '';
    if($('#otherMissingInput')) $('#otherMissingInput').value = '';
    const result = $('#compareResult');
    if(result){
      result.className = 'compare-result empty';
      result.textContent = 'Cole as listas e toque em gerar proposta.';
    }
  });

  $('#copyMyTrocaiCode')?.addEventListener('click', () => copyText(`Meu código Trocaí: ${getLocalTrocaiCode()}`));
  $('#compareTrocaiCode')?.addEventListener('click', () => {
    const code = ($('#otherTrocaiCode')?.value || '').trim().toUpperCase();
    const result = $('#compareResult');
    if(!code){
      safeToast('Digite um código Trocaí.');
      return;
    }
    if(result){
      result.className = 'compare-result empty';
      result.innerHTML = `<div class="empty">Código <strong>${escapeHtml(code)}</strong> recebido. A comparação automática por código entra na próxima fase do Trocaí. Por enquanto, use <strong>Manual</strong> para colar as listas da pessoa.</div>`;
    }
  });

  setMode('manual');
}

function schoolListRows(mode='school'){
  const rows = [];
  SECTION_LIST.forEach(sec => {
    const items = sectionItems(sec).sort((a,b)=>a.number-b.number);
    const filtered = items.filter(item => {
      const q = qty(item.id);
      if(mode === 'owned') return q > 0;
      if(mode === 'duplicates') return q > 1;
      if(mode === 'missing') return q === 0;
      return true;
    });

    if(!filtered.length) return;

    rows.push({
      type:'section',
      code: codeOf(sec),
      name: sec.name || sec.title || codeOf(sec),
      owned: items.filter(i=>qty(i.id)>0).length,
      missing: items.filter(i=>qty(i.id)===0).length,
      duplicates: items.reduce((sum, i) => sum + extras(i), 0),
      total: items.length
    });

    filtered.forEach(item => {
      const q = qty(item.id);
      rows.push({
        type:'item',
        ref:item.ref,
        number:Number(item.number),
        name:stickerDisplayName(item),
        have:q > 0,
        missing:q === 0,
        repeats:extras(item),
        qty:q,
        status:q>1 ? `Tenho +${q-1}` : (q>0 ? 'Tenho' : 'Falta')
      });
    });
  });
  return rows;
}
function schoolListTitle(mode='school'){
  if(mode === 'owned') return 'Figurinhas que tenho';
  if(mode === 'duplicates') return 'Repetidas para troca';
  if(mode === 'missing') return 'Figurinhas faltantes';
  return 'Colinha escolar completa';
}
function schoolLegend(mode='school'){
  if(mode === 'owned') return 'Mostra apenas as figurinhas já coladas no álbum.';
  if(mode === 'duplicates') return 'Mostra só as repetidas, já com a quantidade extra para trocar.';
  if(mode === 'missing') return 'Mostra só o que ainda falta encontrar.';
  return 'Lista completa por seleção, já marcando o que você tem, as repetidas e o que ainda falta.';
}


function schoolCheck(checked){
  return `<span class="school-box ${checked ? 'checked' : ''}">${checked ? '✓' : ''}</span>`;
}
function schoolStatusClass(item){
  const q = qty(item.id);
  if(q > 1) return 'duplicate';
  if(q > 0) return 'owned';
  return 'missing';
}
function schoolStatusLabel(item, mode='default'){
  const q = qty(item.id);
  if(q > 1) return `+${q - 1}`;
  if(q > 0) return '✓';
  return mode === 'ultra' ? '□' : '';
}
function schoolGridColumnHead(){
  return Array.from({length:20}, (_, i) => `<th>${String(i + 1).padStart(2,'0')}</th>`).join('');
}
function schoolGridRow(section){
  const items = sectionItems(section).sort((a,b)=>a.number-b.number);
  const itemMapLocal = new Map(items.map(item => [Number(item.number), item]));
  const cells = Array.from({length:20}, (_, i) => {
    const item = itemMapLocal.get(i + 1);
    if(!item){
      return `<td class="school-grid-cell school-grid-na">—</td>`;
    }
    const statusClass = schoolStatusClass(item);
    const label = schoolStatusLabel(item);
    const aria = qty(item.id) > 1
      ? `${item.ref}, ${qty(item.id)-1} repetidas`
      : (qty(item.id) > 0 ? `${item.ref}, tenho` : `${item.ref}, faltando`);
    return `<td class="school-grid-cell ${statusClass}" title="${escapeHtml(aria)}"><span>${escapeHtml(label)}</span></td>`;
  }).join('');

  const rowCode = escapeHtml(codeOf(section));
  const rowName = escapeHtml(section.kind === 'team' ? section.name : (codeOf(section) === 'CC' ? 'Coca-Cola' : section.name));
  const summary = `${items.filter(i=>qty(i.id)>0).length}/${items.length}`;
  return `<tr>
    <th class="school-grid-rowhead">
      <div class="code">${rowCode}</div>
      <div class="name">${rowName}</div>
      <div class="sum">${summary}</div>
    </th>
    ${cells}
  </tr>`;
}
function renderSchoolOnePagePrintable(){
  const s = stats();
  const generated = new Date().toLocaleDateString('pt-BR');
  const rows = SECTION_LIST.map(s => schoolGridRow(s)).join('');
  return `<div class="school-print-sheet school-grid-sheet">
    <header class="school-grid-header">
      <div class="school-grid-brand">
        <img src="./brand-logo.png" alt="Meu Álbum da Copa">
        <div>
          <strong>Meu Álbum da Copa</strong>
          <span>Colinha Escolar · 1 folha</span>
        </div>
      </div>
      <div class="school-grid-meta">
        <strong>Resumo geral para levar impresso</strong>
        <span>${generated} · ${s.owned}/${s.total} coladas · ${s.duplicates} repetidas · ${s.total - s.owned} faltantes</span>
      </div>
    </header>
    <div class="school-grid-legend-card">
      <div class="school-grid-legend-title">Legenda rápida</div>
      <div class="school-grid-legend">
        <span><b class="legend-box missing"></b> Falta</span>
        <span><b class="legend-box owned">✓</b> Tenho</span>
        <span><b class="legend-box duplicate">+2</b> Repetidas</span>
        <span class="school-grid-note">Últimas linhas: FWC 01–20 e CC 01–14.</span>
      </div>
    </div>
    <table class="school-grid-table">
      <thead>
        <tr>
          <th class="corner">Seleção</th>
          ${schoolGridColumnHead()}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <footer class="school-grid-footer">Folha branca · A4 paisagem · consulta rápida</footer>
  </div>`;
}
function renderSchoolUltraPrintable(){
  const s = stats();
  const generated = new Date().toLocaleDateString('pt-BR');
  const pages = [SECTION_LIST.slice(0, 25), SECTION_LIST.slice(25)];
  const renderRows = (sections) => sections.map(section => {
    const items = sectionItems(section).sort((a,b)=>a.number-b.number);
    const itemMapLocal = new Map(items.map(item => [Number(item.number), item]));
    const cells = Array.from({length:20}, (_, i) => {
      const item = itemMapLocal.get(i + 1);
      if(!item){
        return `<td class="school-grid-cell school-grid-na">·</td>`;
      }
      const statusClass = schoolStatusClass(item);
      const label = schoolStatusLabel(item, 'ultra');
      return `<td class="school-grid-cell ${statusClass}"><span>${escapeHtml(label)}</span></td>`;
    }).join('');
    return `<tr>
      <th class="school-grid-rowhead ultra">
        <div class="code">${escapeHtml(codeOf(section))}</div>
      </th>
      ${cells}
    </tr>`;
  }).join('');

  const renderPage = (sections, pageIndex) => `
    <section class="school-print-sheet school-grid-sheet school-ultra-sheet ultra-page ${pageIndex < pages.length - 1 ? 'page-break' : ''}">
      <header class="school-grid-header ultra-head">
        <div class="school-grid-brand">
          <img src="./brand-logo.png" alt="Meu Álbum da Copa">
          <div>
            <strong>Meu Álbum da Copa</strong>
            <span>Colinha Escolar · Ultra · Página ${pageIndex + 1}/${pages.length}</span>
          </div>
        </div>
        <div class="school-grid-meta">
          <strong>Matriz seca</strong>
          <span>${generated} · ${s.owned}/${s.total}</span>
        </div>
      </header>
      ${pageIndex === 0 ? `
      <div class="school-grid-legend school-grid-legend-ultra">
        <span><b class="legend-box missing">□</b> Falta</span>
        <span><b class="legend-box owned">✓</b> Tenho</span>
        <span><b class="legend-box duplicate">+2</b> Repetidas</span>
      </div>` : ''}
      <table class="school-grid-table ultra-table">
        <thead>
          <tr>
            <th class="corner ultra-corner">Sigla</th>
            ${schoolGridColumnHead()}
          </tr>
        </thead>
        <tbody>${renderRows(sections)}</tbody>
      </table>
      <footer class="school-grid-footer">Folha branca · ultra escolar · só código e quadradinhos</footer>
    </section>`;

  return `<div class="school-print-stack ultra-stack">${pages.map((sections, i)=>renderPage(sections, i)).join('')}</div>`;
}
function renderSchoolDetailedPrintable(mode='school'){
  const rows = schoolListRows(mode);
  const s = stats();
  const generated = new Date().toLocaleDateString('pt-BR');
  const fullMode = mode === 'school';
  const itemRows = rows.map(row => {
    if(row.type === 'section'){
      return `<tr class="school-section-row"><td colspan="${fullMode ? 7 : 6}"><strong>${escapeHtml(row.code)} · ${escapeHtml(row.name)}</strong><span>${row.owned}/${row.total} · ${row.duplicates} reps · ${row.missing} faltam</span></td></tr>`;
    }
    if(fullMode){
      return `<tr>
        <td class="code">${escapeHtml(row.ref)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td class="center">${schoolCheck(row.have)}</td>
        <td class="center reps">${row.repeats > 0 ? row.repeats : ''}</td>
        <td class="center">${schoolCheck(row.missing)}</td>
        <td class="write"></td>
        <td class="write"></td>
      </tr>`;
    }
    return `<tr>
      <td class="code">${escapeHtml(row.ref)}</td>
      <td>${escapeHtml(row.name)}</td>
      <td class="center">${escapeHtml(row.status)}</td>
      <td class="center reps">${row.repeats > 0 ? row.repeats : ''}</td>
      <td class="write"></td>
      <td class="write"></td>
    </tr>`;
  }).join('');

  const head = fullMode
    ? `<tr>
        <th>Código</th>
        <th>Figurinha</th>
        <th>Tenho</th>
        <th>Reps</th>
        <th>Falta</th>
        <th>De quem</th>
        <th>Trocar por</th>
      </tr>`
    : `<tr>
        <th>Código</th>
        <th>Figurinha</th>
        <th>Status</th>
        <th>Reps</th>
        <th>De quem</th>
        <th>Trocar por</th>
      </tr>`;

  return `<div class="school-print-sheet school-detailed-sheet">
    <header class="school-print-header">
      <div class="school-brand">
        <img src="./brand-logo.png" alt="Meu Álbum da Copa">
        <div>
          <strong>Meu Álbum da Copa</strong>
          <span>Colinha Escolar · Detalhada</span>
        </div>
      </div>
      <div class="school-meta">
        <strong>${escapeHtml(schoolListTitle(mode))}</strong>
        <span>${generated} · ${s.owned}/${s.total} coladas · ${s.duplicates} repetidas · ${s.total - s.owned} faltantes</span>
      </div>
    </header>
    <div class="school-legend-bar">
      <span>${escapeHtml(schoolLegend(mode))}</span>
      ${fullMode ? `<div class="school-mini-legend"><span>${schoolCheck(true)} Tenho</span><span><b class="mini-reps">2</b> Repetidas</span><span>${schoolCheck(true)} Falta</span></div>` : ''}
    </div>
    <table class="school-table ${fullMode ? 'school-table-full' : 'school-table-partial'}">
      <thead>${head}</thead>
      <tbody>${itemRows || `<tr><td colspan="${fullMode ? 7 : 6}" class="center">Nada para listar neste filtro.</td></tr>`}</tbody>
    </table>
    <footer class="school-footer">Modelo detalhado · Folha branca para impressão · App independente de fãs · uso pessoal</footer>
  </div>`;
}
function renderSchoolPrintable(mode='school', layout='grid'){
  if(layout === 'detailed') return renderSchoolDetailedPrintable(mode);
  if(layout === 'ultra') return renderSchoolUltraPrintable();
  return renderSchoolOnePagePrintable();
}
function schoolPrintDocument(mode='school', layout='grid'){
  const preview = renderSchoolPrintable(mode, layout);
  const orientation = layout === 'detailed' ? 'portrait' : 'landscape';
  const printCss = `
    *{box-sizing:border-box}
    html,body{margin:0;padding:0;background:#fff;color:#111;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
    @page{size:A4 ${orientation};margin:6mm}
    html,body{overflow:visible !important}
    body{padding:0}
    .school-print-sheet{background:#fff;color:#111;width:100%}
    .school-grid-sheet{font-size:7.2px}
    .school-grid-header{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}
    .school-grid-brand,.school-brand{display:flex;gap:8px;align-items:center}
    .school-grid-brand img,.school-brand img{width:32px;height:32px;border-radius:8px}
    .school-grid-brand strong,.school-brand strong{display:block;font-size:12px}
    .school-grid-brand span,.school-brand span,.school-grid-meta span,.school-meta span{display:block;font-size:8px;color:#555}
    .school-grid-meta strong,.school-meta strong{display:block;font-size:10px}
    .school-grid-legend-card{margin-bottom:6px;padding:5px 7px;border:1px solid #e4ddcb;border-radius:8px;background:#fbf7ec}
    .school-grid-legend-title{font-size:7px;font-weight:800;color:#8d6b1f;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em}
    .school-grid-legend{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:7.2px}
    .school-grid-legend-ultra{margin:0 0 5px}
    .legend-box{display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px;border:1px solid #888;border-radius:3px;background:#fff;color:#111;font-weight:800;font-size:7px;margin-right:3px}
    .legend-box.owned{background:#ededed}
    .legend-box.duplicate{background:#f0d889;border-color:#a98813}
    .school-grid-note{margin-left:auto;color:#666}
    .school-grid-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .school-grid-table th,.school-grid-table td{border:1px solid #d5d5d5;text-align:center;padding:0}
    .school-grid-table thead th{background:#f5f5f5;height:14px;font-size:6.1px}
    .school-grid-table .corner{width:78px}
    .school-grid-rowhead{padding:1px 3px !important;text-align:left !important;background:#fafafa;width:78px}
    .school-grid-rowhead .code{font-size:8px;line-height:1;font-weight:900;color:#111}
    .school-grid-rowhead .name{margin-top:1px;font-size:5.7px;line-height:1.05;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .school-grid-rowhead .sum{margin-top:1px;font-size:5.3px;color:#888}
    .school-grid-rowhead.ultra{padding:0 4px !important}
    .school-grid-rowhead.ultra .code{font-size:8px}
    .ultra-corner{width:50px}
    .ultra-table .corner{width:50px}
    .ultra-table .school-grid-rowhead{width:50px}
    .ultra-table .school-grid-cell{height:12px;font-size:6.8px}
    .school-grid-cell{height:14px;font-size:7px;font-weight:900;color:#111}
    .school-grid-cell span{display:flex;align-items:center;justify-content:center;width:100%;height:100%}
    .school-grid-cell.missing{background:#fff}
    .school-grid-cell.owned{background:#ededed}
    .school-grid-cell.duplicate{background:#f0d889}
    .school-grid-cell.school-grid-na{background:#fafafa;color:#bbb;font-size:5px}
    .school-grid-footer{margin-top:5px;font-size:7px;color:#555;text-align:right}
    .school-print-header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}
    .school-meta{max-width:54%;text-align:right}
    .school-legend-bar{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px;font-size:10px;color:#555}
    .school-mini-legend{display:flex;gap:10px;align-items:center}
    .school-table{width:100%;border-collapse:collapse;font-size:10px}
    .school-table th,.school-table td{border:1px solid #ddd;padding:5px 6px;vertical-align:middle}
    .school-table th{background:#f5f5f5}
    .school-table .center{text-align:center}
    .school-table .write{width:68px}
    .school-section-row td{background:#faf3df;font-weight:700}
    .school-box{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border:1px solid #888;border-radius:3px}
    .school-box.checked{background:#ececec}
    .reps{font-weight:700}
    .school-footer{margin-top:8px;font-size:9px;color:#555;text-align:right}
  `;
  const title = layout === 'detailed' ? 'Colinha Escolar Detalhada' : (layout === 'ultra' ? 'Colinha Escolar Ultra' : 'Colinha Escolar 1 Folha');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${printCss}</style></head><body>${preview}</body></html>`;
}
function printSchoolList(mode='school', layout='grid'){
  const html = schoolPrintDocument(mode, layout);
  const printWindow = window.open('', '_blank');
  if(!printWindow){
    safeToast('O navegador bloqueou a impressão. Libere pop-up e tente de novo.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    try{
      printWindow.focus();
      printWindow.print();
    }catch(e){
      console.error(e);
      safeToast('Não consegui abrir a impressão automaticamente.');
    }
  }, 500);
}
function openSchoolList(){
  const modal = ensureAppModal();
  modal.classList.add('show');
  modal.innerHTML = `<div class="modal-card school-modal-card">
    <button class="modal-close" id="closeSchoolList" type="button">×</button>
    <span class="label">Colinha Escolar</span>
    <h3>Planilha branca para imprimir</h3>
    <p class="muted">Escolha o modelo ideal para impressão: 1 folha, ultra escolar ou detalhada.</p>
    <div class="school-controls school-controls-v178">
      <div id="schoolModeWrap">
        <select id="schoolListMode">
          <option value="school">Colinha completa</option>
          <option value="missing">Só faltantes</option>
          <option value="duplicates">Só repetidas</option>
          <option value="owned">Só tenho</option>
        </select>
      </div>

      <button id="schoolLayoutSwitch" class="school-layout-switch school-layout-switch-3" type="button" aria-label="Alternar modelo da colinha">
        <span class="layout-option ultra-label is-active">Ultra</span>
        <span class="layout-option grid-label">1 folha</span>
        <span class="layout-option detailed-label">Detalhada</span>
      </button>

      <button class="btn primary" id="printSchoolList" type="button">Imprimir / PDF</button>
      <button class="btn" id="copySchoolCsv" type="button">Copiar CSV</button>
    </div>
    <div id="schoolPrintPreview">${renderSchoolPrintable('school', 'ultra')}</div>
  </div>`;

  const close = () => {
    modal?.classList?.remove('show');
    if(modal) modal.innerHTML = '';
  };
  const layouts = ['ultra','grid','detailed'];
  let schoolLayoutIndex = 0;

  const updateLayoutButton = () => {
    const current = layouts[schoolLayoutIndex];
    const btn = $('#schoolLayoutSwitch');
    if(!btn) return;
    $$('.layout-option', btn).forEach(el => el.classList.remove('is-active'));
    $('.ultra-label', btn)?.classList.toggle('is-active', current === 'ultra');
    $('.grid-label', btn)?.classList.toggle('is-active', current === 'grid');
    $('.detailed-label', btn)?.classList.toggle('is-active', current === 'detailed');
  };

  const refreshSchoolPreview = () => {
    const schoolLayout = layouts[schoolLayoutIndex];
    const mode = $('#schoolListMode')?.value || 'school';
    const modeWrap = $('#schoolModeWrap');
    if(modeWrap) modeWrap.hidden = schoolLayout !== 'detailed';
    const preview = $('#schoolPrintPreview');
    if(preview) preview.innerHTML = renderSchoolPrintable(mode, schoolLayout);
    updateLayoutButton();
  };

  $('#closeSchoolList')?.addEventListener('click', close);
  $('#schoolListMode')?.addEventListener('change', refreshSchoolPreview);
  $('#schoolLayoutSwitch')?.addEventListener('click', () => {
    schoolLayoutIndex = (schoolLayoutIndex + 1) % layouts.length;
    refreshSchoolPreview();
  });
  $('#printSchoolList')?.addEventListener('click', () => {
    const mode = $('#schoolListMode')?.value || 'school';
    const schoolLayout = layouts[schoolLayoutIndex];
    printSchoolList(mode, schoolLayout);
  });
  $('#copySchoolCsv')?.addEventListener('click', () => {
    const mode = $('#schoolListMode')?.value || 'school';
    const rows = schoolListRows(mode).filter(r=>r.type === 'item');
    const fullMode = mode === 'school';
    const csv = [fullMode
      ? 'Codigo;Figurinha;Tenho;Repetidas;Falta;De quem;Trocar por'
      : 'Codigo;Figurinha;Status;Repetidas;De quem;Trocar por']
      .concat(rows.map(r => fullMode
        ? `${r.ref};${String(r.name).replaceAll(';', ',')};${r.have ? 'SIM' : ''};${r.repeats || ''};${r.missing ? 'SIM' : ''};;`
        : `${r.ref};${String(r.name).replaceAll(';', ',')};${r.status};${r.repeats || ''};;`))
      .join('\n');
    copyText(csv);
  });

  refreshSchoolPreview();
}


function renderTrades(){
  const statusOptions = ['Disponível','Em negociação','Reservada','Concluída'];
  const normalizeTradeStatus = (value) => {
    const raw = String(value || '').trim();
    if(!raw) return '';
    if(raw === 'Trocada') return 'Concluída';
    if(raw === 'Aguardando') return 'Em negociação';
    return raw;
  };

  const allTradeRows = albumItems
    .filter(i => qty(i.id) > 1 || state.tradeStatus[i.id] || state.contacts[i.id] || state.notes[i.id])
    .sort((a,b)=>a.order-b.order);

  const derivedStatus = (item) => {
    const manual = normalizeTradeStatus(state.tradeStatus[item.id]);
    if(manual) return manual;
    return qty(item.id) > 1 ? 'Disponível' : '';
  };

  const counters = {
    available: allTradeRows.filter(i => derivedStatus(i) === 'Disponível').length,
    negotiating: allTradeRows.filter(i => derivedStatus(i) === 'Em negociação').length,
    reserved: allTradeRows.filter(i => derivedStatus(i) === 'Reservada').length,
    done: allTradeRows.filter(i => derivedStatus(i) === 'Concluída').length
  };

  const expanded = new Set();
  let visibleLimit = 24;
  let listWasOpened = false;

  $('#view-trades').innerHTML = `

    <section class="grid kpis trade-kpis trade-overview">
      ${kpi('Disponíveis', counters.available)}
      ${kpi('Negociação', counters.negotiating)}
      ${kpi('Reservadas', counters.reserved)}
      ${kpi('Concluídas', counters.done)}
    </section>

    <section class="card trade-summary-card trade-summary-card-refined">
      <div class="trade-summary-head">
        <div>
          <span class="label">Listas para compartilhar</span>
          <h3>Resumo rápido de trocas</h3>
          <p class="muted">Copie suas listas formatadas para WhatsApp e use a proposta abaixo para cruzar figurinhas com outra pessoa.</p>
        </div>
        <div class="trade-mini-stats">
          <span><strong>${stats().duplicates}</strong><small>repetidas</small></span>
          <span><strong>${stats().missing}</strong><small>faltantes</small></span>
        </div>
      </div>
      <div class="button-row trade-actions refined-actions">
        <button class="btn primary" id="copyDup">Copiar repetidas</button>
        <button class="btn" id="copyMissing">Copiar faltantes</button>
        <button class="btn" id="openSchoolFromTrades" type="button">Colinha escolar</button>
      </div>
    </section>

    ${renderCompareTool()}

    <section class="card trade-manager-card">
      <button class="drawer-head" id="tradeListToggle" type="button" aria-expanded="false">
        <span>
          <span class="label">Gestão de trocas</span>
          <strong>Ver minhas repetidas</strong>
          <small>${allTradeRows.length} figurinhas com repetidas/status</small>
        </span>
        <b class="chevron">⌄</b>
      </button>

      <div id="tradeListPanel" class="trade-list-panel" hidden>
        <p class="muted">Lista carregada sob demanda para deixar a tela de Trocas mais leve no celular.</p>

        <div class="trade-toolbar">
          <input id="tradeSearch" class="search" type="search" placeholder="Buscar figurinha, seleção ou código" autocomplete="off" autocapitalize="characters" spellcheck="false">
          <select id="tradeStatusFilter">
            <option value="">Todos os status</option>
            ${statusOptions.map(v=>`<option value="${v}">${v}</option>`).join('')}
          </select>
        </div>

        <div id="tradeList" class="trade-list"></div>
        <div class="button-row trade-load-row">
          <button class="btn" id="loadMoreTrades" type="button">Carregar mais</button>
        </div>
      </div>
    </section>`;

  $('#copyDup').addEventListener('click', async (ev)=>{
    ev.preventDefault();
    await copyText(`🔁 Repetidas:\n${formatDuplicateTradeList()}`);
  });
  $('#openSchoolFromTrades')?.addEventListener('click', openSchoolList);
  $('#copyMissing').addEventListener('click', async (ev)=>{
    ev.preventDefault();
    await copyText(`📌 Faltantes:\n${formatMissingTradeList()}`);
  });

  bindCompareTool();

  const toggle = $('#tradeListToggle');
  const panel = $('#tradeListPanel');

  toggle?.addEventListener('click', () => {
    listWasOpened = !listWasOpened;
    panel.hidden = !listWasOpened;
    toggle.setAttribute('aria-expanded', listWasOpened ? 'true' : 'false');
    toggle.classList.toggle('open', listWasOpened);
    if(listWasOpened) renderTradeList();
  });

  function copyTradeMessage(item){
    const teamCode = codeOf(item);
    const name = stickerDisplayName(item);
    const msg = `Oi! Tenho a figurinha ${item.ref} (${teamCode} · ${name}) repetida para troca. Se quiser, me chama aqui.`;
    copyText(msg);
  }

  function clearTradeFields(id){
    delete state.tradeStatus[id];
    delete state.contacts[id];
    delete state.notes[id];
    saveState('Dados da troca limpos');
  }

  function filteredTradeRows(){
    const searchEl = $('#tradeSearch');
    const statusEl = $('#tradeStatusFilter');
    const q = (searchEl?.value || '').trim().toLowerCase();
    const statusFilter = statusEl?.value || '';

    return allTradeRows.filter(item => {
      const hay = `${item.ref} ${codeOf(item)} ${stickerDisplayName(item)}`.toLowerCase();
      const itemStatus = derivedStatus(item);
      const matchSearch = !q || hay.includes(q);
      const matchStatus = !statusFilter || itemStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }

  function renderTradeList(){
    if(!listWasOpened) return;
    const listEl = $('#tradeList');
    if(!listEl) return;

    const filtered = filteredTradeRows();
    const visible = filtered.slice(0, visibleLimit);

    listEl.innerHTML = visible.map(item => {
      const itemStatus = derivedStatus(item);
      const slug = itemStatus.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
      const open = expanded.has(item.id);
      const contact = String(state.contacts[item.id] || '').trim();

      return `<article class="trade-item ${open ? 'open' : ''}">
        <button class="trade-item-head" type="button" data-expand="${item.id}" aria-expanded="${open ? 'true' : 'false'}">
          <div class="trade-item-main">
            <strong>${escapeHtml(item.ref)}</strong>
            <small>${escapeHtml(stickerDisplayName(item))}</small>
            <span class="trade-item-meta">Qtd ${qty(item.id)}${contact ? ` • ${escapeHtml(contact)}` : ''}</span>
          </div>
          <div class="trade-item-side">
            <span class="trade-status-chip status-${slug || 'vazio'}">${escapeHtml(itemStatus || 'Sem status')}</span>
            <b class="trade-chevron">⌄</b>
          </div>
        </button>

        <div class="trade-item-body">
          <div class="trade-form-grid">
            <label>Qtd total no app
              <input type="number" min="0" value="${qty(item.id)}" data-q="${item.id}">
            </label>

            <label>Status
              <select data-trade="${item.id}">
                <option value=""></option>
                ${statusOptions.map(v=>`<option value="${v}" ${itemStatus===v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </label>

            <label>Contato
              <input value="${escapeAttr(state.contacts[item.id] || '')}" data-contact="${item.id}" placeholder="Ex.: Lucas / WhatsApp">
            </label>

            <label>Obs.
              <input value="${escapeAttr(state.notes[item.id] || '')}" data-note="${item.id}" placeholder="Ex.: trocar por BRA 14">
            </label>
          </div>

          <div class="button-row trade-inline-actions">
            <button class="btn" type="button" data-copy-trade="${item.id}">Copiar mensagem</button>
            <button class="btn danger" type="button" data-clear-trade="${item.id}">Limpar dados</button>
          </div>
        </div>
      </article>`;
    }).join('') || '<div class="empty trade-empty">Nenhuma figurinha encontrada para esse filtro.</div>';

    const loadBtn = $('#loadMoreTrades');
    if(loadBtn){
      loadBtn.hidden = visible.length >= filtered.length;
      loadBtn.textContent = `Carregar mais (${visible.length}/${filtered.length})`;
    }

    $$('[data-expand]', listEl).forEach(el => el.addEventListener('click', () => {
      const id = el.dataset.expand;
      if(expanded.has(id)) expanded.delete(id);
      else expanded.add(id);
      renderTradeList();
    }));

    $$('[data-q]', listEl).forEach(el => el.addEventListener('change', () => {
      setQty(el.dataset.q, el.value, `${itemById(el.dataset.q)?.ref || 'Figurinha'} atualizada em Trocas`);
    }));

    $$('[data-trade]', listEl).forEach(el => el.addEventListener('change', () => {
      const id = el.dataset.trade;
      const value = el.value;
      if(value) state.tradeStatus[id] = value;
      else delete state.tradeStatus[id];
      saveState('Status da troca atualizado');
      renderTradeList();
    }));

    $$('[data-contact]', listEl).forEach(el => el.addEventListener('change', () => {
      const id = el.dataset.contact;
      const value = String(el.value || '').trim();
      if(value) state.contacts[id] = value;
      else delete state.contacts[id];
      saveState('Contato da troca atualizado');
      renderTradeList();
    }));

    $$('[data-note]', listEl).forEach(el => el.addEventListener('change', () => {
      const id = el.dataset.note;
      const value = String(el.value || '').trim();
      if(value) state.notes[id] = value;
      else delete state.notes[id];
      saveState('Observação da troca atualizada');
      renderTradeList();
    }));

    $$('[data-copy-trade]', listEl).forEach(el => el.addEventListener('click', () => {
      const item = itemById(el.dataset.copyTrade);
      if(item) copyTradeMessage(item);
    }));

    $$('[data-clear-trade]', listEl).forEach(el => el.addEventListener('click', () => {
      const id = el.dataset.clearTrade;
      clearTradeFields(id);
      renderTradeList();
    }));
  }

  $('#tradeSearch')?.addEventListener('input', () => {
    visibleLimit = 24;
    renderTradeList();
  });
  $('#tradeStatusFilter')?.addEventListener('change', () => {
    visibleLimit = 24;
    renderTradeList();
  });
  $('#loadMoreTrades')?.addEventListener('click', () => {
    visibleLimit += 24;
    renderTradeList();
  });
}

function renderMissing(){ const missing=formatList(i=>qty(i.id)===0); const owned=formatList(i=>qty(i.id)>0); const dup=formatDuplicateTradeList(); $('#view-missing').innerHTML = `<section class="card"><span class="label">Faltantes</span><div id="missingBox" class="copy-box">${escapeHtml(missing)}</div><button class="btn primary full" data-copy="missingBox">Copiar faltantes</button></section><section class="card"><span class="label">Tenho</span><div id="ownedBox" class="copy-box">${escapeHtml(owned)}</div><button class="btn full" data-copy="ownedBox">Copiar tenho</button></section><section class="card"><span class="label">Repetidas</span><div id="dupBox" class="copy-box">${escapeHtml(dup)}</div><button class="btn full" data-copy="dupBox">Copiar repetidas</button></section>`; $$('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText($(`#${b.dataset.copy}`).textContent))); }

function profileStatsCards(){
  const s = stats();
  const ranked = ranking();
  const mostComplete = ranked[0];
  const leastComplete = [...ranked].reverse().find(t => sectionStats(t).owned < sectionStats(t).total) || ranked[ranked.length-1];
  const topDup = albumItems.filter(i=>qty(i.id)>1).sort((a,b)=>extras(b)-extras(a)).slice(0,3);
  return `<section class="card stats-card"><span class="label">Estatísticas</span>
    <div class="stats-grid">
      <div class="stat-tile"><strong>${s.completeTeams}</strong><span>seleções completas</span></div>
      <div class="stat-tile"><strong>${escapeHtml(mostComplete?.code || '-')}</strong><span>mais avançada</span></div>
      <div class="stat-tile"><strong>${escapeHtml(leastComplete?.code || '-')}</strong><span>mais atrasada</span></div>
      <div class="stat-tile"><strong>${topDup.length ? escapeHtml(topDup[0].ref) : '-'}</strong><span>top repetida</span></div>
    </div>
    <div class="mini-list">${topDup.length ? topDup.map(i=>`<div class="row"><div><strong>${escapeHtml(i.ref)}</strong><small>${escapeHtml(stickerDisplayName(i))}</small></div><b>+${extras(i)}</b></div>`).join('') : '<div class="empty">Sem repetidas ainda.</div>'}</div>
  </section>`;
}


function appShareUrl(){
  return location.origin || 'https://meu-album-da-copa-2026.vercel.app';
}
async function shareApp(){
  const url = location.origin + location.pathname;
  const text = 'Meu Álbum da Copa 2026 — controle suas figurinhas, repetidas e faltantes.';
  try{
    if(navigator.share){
      await navigator.share({title:'Meu Álbum da Copa 2026', text, url});
      return;
    }
  }catch(e){
    console.warn('share failed', e);
  }
  await copyText(`${text}\n${url}`);
}
function renderShareCard(){
  return `<section class="card share-card">
    <span class="label">Compartilhar app</span>
    <h3>Chama geral pro álbum</h3>
    <p class="muted">Envie o link para quem também quer controlar figurinhas, repetidas e trocas.</p>
    <button id="shareAppBtn" class="btn primary full" type="button">Compartilhar app</button>
  </section>`;
}


function albumEconomyStats(){
  const s = stats();
  const packSize = Number(localStorage.getItem('meu-album-copa-pack-size') || 7);
  const packPrice = Number(localStorage.getItem('meu-album-copa-pack-price') || 5);
  const packsBought = packSize ? Math.ceil(s.physical / packSize) : 0;
  const packsToComplete = packSize ? Math.ceil(s.missing / packSize) : 0;
  const invested = packsBought * packPrice;
  const repeatedValue = Math.ceil(s.duplicates / Math.max(1, packSize)) * packPrice;
  const toCompleteValue = packsToComplete * packPrice;
  return {packSize, packPrice, packsBought, packsToComplete, invested, repeatedValue, toCompleteValue};
}
function brl(value){
  return Number(value || 0).toLocaleString('pt-BR',{style:'currency', currency:'BRL'});
}
function renderEstimatePanel(){
  const e = albumEconomyStats();
  const s = stats();
  return `<section class="card estimate-card">
    <span class="label">Painel de estimativa</span>
    <h3>Quanto falta pra fechar?</h3>
    <div class="estimate-grid">
      <div><strong>${e.packsBought}</strong><span>pacotes estimados comprados</span></div>
      <div><strong>${e.packsToComplete}</strong><span>pacotes estimados para completar</span></div>
      <div><strong>${brl(e.invested)}</strong><span>investido estimado</span></div>
      <div><strong>${brl(e.toCompleteValue)}</strong><span>para completar aprox.</span></div>
    </div>
    <p class="muted">Base: ${e.packSize} figurinhas por pacote e ${brl(e.packPrice)} por pacote. Faltam ${s.missing} figurinhas únicas.</p>
    <div class="mini-settings">
      <label>Figurinhas por pacote<input id="packSizeInput" type="number" min="1" value="${e.packSize}"></label>
      <label>Preço do pacote<input id="packPriceInput" type="number" min="0" step="0.01" value="${e.packPrice}"></label>
    </div>
  </section>`;
}
function bindEstimatePanel(){
  $('#packSizeInput')?.addEventListener('change', e => {
    localStorage.setItem('meu-album-copa-pack-size', Math.max(1, Number(e.target.value)||7));
    render();
  });
  $('#packPriceInput')?.addEventListener('change', e => {
    localStorage.setItem('meu-album-copa-pack-price', Math.max(0, Number(e.target.value)||5));
    render();
  });
}
function renderTipsCards(){
  const tips = [
    ['⚡','Marcação rápida','Toque uma vez na figurinha para adicionar +1. Dois toques rápidos zeram a figurinha.'],
    ['📦','Modo pacotinho','Use a aba Adicionar para lançar uma lista inteira de códigos de uma vez.'],
    ['☁️','Backup na nuvem','Entre com Google antes de marcar muita coisa. Assim o álbum fica protegido.'],
    ['🔁','Trocas','Use a aba Trocas para copiar listas de repetidas e faltantes em formato de WhatsApp.'],
    ['👨‍👩‍👧‍👦','Álbum familiar','Crie um álbum familiar no Perfil e compartilhe o código com outra conta Google.'],
    ['📊','Painel','Configure preço do pacote e veja estimativas de gasto e pacotes para completar.']
  ];
  return `<section class="card tips-card">
    <span class="label">Dicas</span>
    <h3>Como tirar mais do app</h3>
    <div class="tips-grid">${tips.map(t=>`<article><b>${t[0]}</b><strong>${t[1]}</strong><span>${t[2]}</span></article>`).join('')}</div>
  </section>`;
}
function renderAdsPlaceholder(slot='perfil'){
  return `<section class="ad-placeholder" aria-label="Espaço reservado para anúncio">
    <span>Publicidade</span>
    <strong>Espaço reservado para anúncio</strong>
    <small>${slot === 'home' ? 'Área discreta da Home' : 'Área discreta do Perfil'}</small>
  </section>`;
}
function openInfoModal(title, body){
  const existing = $('#infoModal');
  if(existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'infoModal';
  modal.className = 'info-modal';
  modal.innerHTML = `<div class="info-modal-card">
    <button class="modal-close" type="button" aria-label="Fechar">×</button>
    <h2>${escapeHtml(title)}</h2>
    <div class="info-body">${body}</div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click',()=>modal.remove());
  modal.addEventListener('click', e => { if(e.target === modal) modal.remove(); });
}
function legalText(){
  return `<p>Este aplicativo é uma criação independente de fãs e não é afiliado, endossado ou conectado à FIFA, Panini, organizações oficiais de futebol, fabricantes oficiais de figurinhas ou parceiros oficiais do torneio.</p>
  <p>Todas as marcas registradas, nomes, escudos, seleções, competições e referências pertencem aos seus respectivos donos.</p>
  <p>O objetivo do app é apenas ajudar colecionadores a controlar figurinhas, repetidas, faltantes e trocas.</p>`;
}
function privacyText(){
  return `<p>O app salva os dados do álbum no próprio navegador e, quando o usuário entra com Google, também pode sincronizar com Firebase/Firestore.</p>
  <p>Os dados usados são: e-mail/nome da conta Google para login, lista de figurinhas marcadas, repetidas, informações de trocas e dados do álbum familiar quando ativado.</p>
  <p>Não vendemos dados pessoais. Anúncios, quando ativados no futuro, poderão usar tecnologias de terceiros conforme as políticas dessas plataformas.</p>`;
}
function termsText(){
  return `<p>Ao usar o app, você concorda em utilizar a ferramenta apenas para controle pessoal, familiar ou de trocas entre colecionadores.</p>
  <p>O app pode receber atualizações, mudanças visuais e ajustes de funcionamento. Faça backup/exportação sempre que necessário.</p>
  <p>O recurso de álbum familiar permite que membros editem o mesmo álbum. Compartilhe o código apenas com pessoas de confiança.</p>`;
}
function aboutAppText(){
  return `<p><strong>Meu Álbum da Copa 2026</strong> é um app/PWA para controlar figurinhas, repetidas, faltantes, trocas, progresso e álbum familiar.</p>
  <p>Versão atual: <strong>${VERSION_LABEL}</strong> · ${escapeHtml(VERSION)}</p>
  <p>Projeto pensado para uso real: controle, trocas, sincronização e organização do álbum em um só lugar.</p>`;
}
function sendFeedback(){
  const subject = encodeURIComponent('Feedback - Meu Álbum da Copa 2026');
  const body = encodeURIComponent(`Oi! Tenho um feedback sobre o Meu Álbum da Copa 2026:\n\n`);
  location.href = `mailto:?subject=${subject}&body=${body}`;
}
function renderSettingsHub(){
  return `<section class="card settings-hub settings-hub-compact">
    <div class="settings-hub-head">
      <div>
        <span class="label">Ajuda e informações</span>
        <h3>Acessos rápidos</h3>
      </div>
      <p class="muted">Tudo o que você precisa sobre uso, suporte e documentos.</p>
    </div>
    <div class="settings-list compact-settings-list">
      <button data-info="tips"><span>💡</span><b>Dicas de uso</b><small>Atalhos principais</small></button>
      <button data-info="feedback"><span>⭐</span><b>Feedback</b><small>Sugestão ou problema</small></button>
      <button data-info="about"><span>ℹ️</span><b>Sobre o app</b><small>Versão e detalhes</small></button>
      <button data-info="privacy"><span>🛡️</span><b>Privacidade</b><small>Dados e Firebase</small></button>
      <button data-info="terms"><span>📄</span><b>Termos de uso</b><small>Uso e responsabilidade</small></button>
      <button data-info="legal"><span>⚖️</span><b>Aviso legal</b><small>App independente</small></button>
    </div>
  </section>`;
}
function bindSettingsHub(){
  $$('[data-info]').forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.info;
    if(type === 'feedback') return sendFeedback();
    if(type === 'tips') return openInfoModal('Dicas de uso', renderTipsCards());
    if(type === 'about') return openInfoModal('Sobre o app', aboutAppText());
    if(type === 'privacy') return openInfoModal('Política de Privacidade', privacyText());
    if(type === 'terms') return openInfoModal('Termos de Uso', termsText());
    if(type === 'legal') return openInfoModal('Aviso Legal', legalText());
  }));
}

function renderProfile(){
  const s = stats();
  const level = collectorLevel(s.progress);
  const email = cloud.user?.email || '';
  const ranked = ranking();
  const mostComplete = ranked[0];
  const leastComplete = [...ranked].reverse().find(t => sectionStats(t).owned < sectionStats(t).total) || ranked[ranked.length-1];
  const topDup = albumItems.filter(i=>qty(i.id)>1).sort((a,b)=>extras(b)-extras(a)).slice(0,3);

  $('#view-profile').innerHTML = `
    <section class="card hero profile-collector-panel" style="--p:${Math.round(s.progress*100)}%">
      <div class="collector-top">
        <div class="collector-head">
          <span class="label">Painel do colecionador</span>
          <h2>${escapeHtml(level.name)}</h2>
          <p class="muted">${escapeHtml(level.desc)}</p>
          <div class="collector-summary-row">
            <span class="pill soft">${s.owned} coladas</span>
            <span class="pill soft">${s.duplicates} repetidas</span>
          </div>
        </div>
        <div class="ring"><div><strong>${pct(s.progress)}</strong><span>total</span></div></div>
      </div>
      <div class="stats-grid compact-stats">
        <div class="stat-tile"><strong>${s.completeTeams}</strong><span>seleções completas</span></div>
        <div class="stat-tile"><strong>${escapeHtml(mostComplete?.code || '-')}</strong><span>mais avançada</span></div>
        <div class="stat-tile"><strong>${escapeHtml(leastComplete?.code || '-')}</strong><span>mais atrasada</span></div>
        <div class="stat-tile"><strong>${topDup.length ? escapeHtml(topDup[0].ref) : '-'}</strong><span>top repetida</span></div>
      </div>
      <div class="mini-list compact-mini-list">
        ${topDup.length ? topDup.map(i=>`<div class="row"><div><strong>${escapeHtml(i.ref)}</strong><small>${escapeHtml(stickerDisplayName(i))}</small></div><b>+${extras(i)}</b></div>`).join('') : '<div class="empty">Sem repetidas ainda.</div>'}
      </div>
    </section>
    ${renderEstimatePanel()}
    <section class="profile-section-block">
      <div class="profile-section-title">
        <span class="label">Perfil</span>
        <h3>Família e conta</h3>
        <p class="muted">Gerencie quem edita o álbum e como ele sincroniza.</p>
      </div>
      <div class="profile-grid profile-grid-refined profile-paired-grid">
        ${renderFamilyCard()}
        <section class="card profile-account-card">
          <div class="account-headline">${userPhotoMarkup('md')}<div><span class="label">Conta e sincronização</span><h3>${cloud.user ? 'Google conectado' : 'Modo local'}</h3></div></div>
          <p class="muted">${cloud.user ? escapeHtml(email) : 'Entre com Google para salvar na nuvem.'}</p>
          <p class="muted sync-mini">Modo atual: <strong>${activeAlbumLabel()}</strong> · Última alteração local: ${state.updatedAt ? new Date(state.updatedAt).toLocaleString('pt-BR') : 'sem registro'}</p>
          <div class="button-row">
            <button class="btn primary" id="loginBtn">${cloud.user ? 'Trocar conta' : 'Entrar com Google'}</button>
            <button class="btn" id="logoutBtn">Sair</button>
            <button class="btn" id="syncNow">Sincronizar</button>
          </div>
        </section>
      </div>
    </section>
    ${renderAdsPlaceholder('perfil')}
    <section class="profile-section-block">
      <div class="profile-section-title">
        <span class="label">Ferramentas</span>
        <h3>Dados e compartilhamento</h3>
        <p class="muted">Compartilhe o app, exporte backup e restaure seu álbum quando precisar.</p>
      </div>
      <div class="profile-grid profile-grid-refined">
        <section class="card profile-tools-card">
          <span class="label">Backup e ferramentas</span>
          <h3>Proteção dos seus dados</h3>
          <p class="muted">Faça backup antes de mudanças grandes. JSON é para segurança e restauração; álbum familiar é sincronização compartilhada.</p>
          <div class="button-row tools-actions">
            <button class="btn primary" id="shareAppBtn" type="button">Compartilhar app</button>
            <button class="btn" id="exportJson">Exportar backup</button>
            <button class="btn" id="schoolListBtn" type="button">Colinha escolar</button>
            <label class="btn import-json-btn"><input id="importJson" type="file" accept="application/json" hidden><span>Restaurar JSON</span></label>
            <button class="btn danger" id="resetAll">Zerar tudo</button>
          </div>
          <p class="muted tools-note">Use <strong>Exportar backup</strong> antes de importar, sair de álbum ou trocar de modo. <strong>Restaurar JSON</strong> substitui o álbum atual.</p>
        </section>
      </div>
    </section>
    <section class="profile-section-block">
      <div class="profile-section-title">
        <span class="label">Ajuda & legal</span>
        <h3>Suporte e documentos</h3>
        <p class="muted">Atalhos rápidos para dicas, feedback, política, termos e informações do app.</p>
      </div>
      <div class="profile-grid profile-grid-refined profile-help-grid">
        ${renderSettingsHub()}
        <section class="card profile-version-footnote">
          <span class="label">Versão atual</span>
          <h3>${VERSION_LABEL}</h3>
          <div class="version-box"><strong>${VERSION_LABEL}</strong><span>${VERSION}</span></div>
          <p class="muted"><strong>Mudança desta versão:</strong> ${escapeHtml(VERSION_CHANGE)}</p>
          <p class="muted">O detalhamento completo continua disponível no atalho <strong>Sobre o app</strong>.</p>
        </section>
      </div>
    </section>`;
  bindEstimatePanel();
  bindSettingsHub();
  bindFamilyCard();
  $('#loginBtn').addEventListener('click', signInCloud);
  $('#logoutBtn').addEventListener('click', signOutCloud);
  $('#syncNow').addEventListener('click', syncNow);
  $('#shareAppBtn')?.addEventListener('click', shareApp);
  $('#exportJson').addEventListener('click', exportJson);
  $('#schoolListBtn')?.addEventListener('click', openSchoolList);
  $('#importJson').addEventListener('change', importJson);
  $('#resetAll').addEventListener('click', () => {
    if(confirm('Zerar toda a coleção deste álbum ativo?\n\nRecomendação: exporte um backup antes.\n\nDeseja continuar?')){
      state = emptyState();
      saveState('Coleção zerada');
      render();
    }
  });
}
function toastAction(msg, actionLabel, action){
  const el=$('#toast');
  el.innerHTML = `${escapeHtml(msg)} <button class="toast-action" type="button">${escapeHtml(actionLabel)}</button>`;
  el.classList.add('show');
  const btn = el.querySelector('.toast-action');
  btn?.addEventListener('click', () => {
    clearTimeout(toast.t);
    el.classList.remove('show');
    action?.();
  });
  clearTimeout(toast.t);
  toast.t=setTimeout(()=>el.classList.remove('show'),3600);
}
function undoLastAction(){
  if(!lastUndo) return toast('Nada para desfazer.');
  const entry = lastUndo;
  lastUndo = null;
  const item = itemById(entry.id);
  if(!item) return;
  state.quantities[entry.id] = Math.max(0, Number(entry.qty)||0);
  saveState(entry.label || 'Ação desfeita');
  render();
  toast(`${item.ref}: ação desfeita.`);
}

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
        if(activeAlbumMode === 'family' && familyAlbumId){
          try{
            const famSnap = await familyCloudDoc(familyAlbumId).get();
            familyAlbumMeta = famSnap.exists ? famSnap.data() : null;
            if(!famSnap.exists || !familyAlbumMeta?.members?.[user.uid]){
              setActiveAlbumMode('personal');
              familyAlbumMeta = null;
            }
          }catch(e){
            console.warn('family album unavailable', e);
            setActiveAlbumMode('personal');
            familyAlbumMeta = null;
          }
        }
        await loadCloud(true);
        startRealtimeSync();
      }
      render();
      if(currentView === 'home') $('#viewTitle').textContent = homeTitle();
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

function generateFamilyCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'FAM-';
  for(let i=0;i<5;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}
function memberInfo(){
  return {
    uid: cloud.user?.uid || '',
    name: cloud.user?.displayName || cloud.user?.email || 'Colecionador',
    email: cloud.user?.email || '',
    photoURL: cloud.user?.photoURL || '',
    role: 'editor',
    joinedAt: new Date().toISOString()
  };
}
function familyInviteText(){
  const code = familyAlbumMeta?.inviteCode || familyAlbumId || '';
  return `Entre no meu Álbum Familiar da Copa 2026 usando o código: ${code}`;
}

async function copyPersonalToFamilyAlbum(){
  if(!cloud.user) return safeToast('Entre com Google antes.');
  if(!familyAlbumId) return safeToast('Crie ou entre em um álbum familiar primeiro.');

  const currentMode = activeAlbumMode;
  const currentFamilyId = familyAlbumId;

  if(!confirm('Isso vai copiar seu álbum pessoal atual para o álbum familiar e substituir o progresso familiar atual. Deseja continuar?')) return;

  try{
    const personalSnap = await personalCloudDoc().get();
    const personalState = personalSnap.exists && personalSnap.data().state ? normalizeState(personalSnap.data().state) : normalizeState(state);

    await familyCloudDoc(currentFamilyId).set({
      state: personalState,
      version: VERSION,
      members: {[cloud.user.uid]: memberInfo()},
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});

    if(currentMode === 'family'){
      state = personalState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    await loadCloud(true);
    startRealtimeSync();
    render();
    safeToast('Álbum pessoal copiado para a família.');
  }catch(e){
    console.warn('copy personal to family failed', e);
    safeToast('Não consegui copiar para o familiar.');
  }
}

async function createFamilyAlbum(){
  if(!cloud.user) return toast('Entre com Google antes de criar um álbum familiar.');
  const summary = currentStateSummary(state);
  const useCurrent = summary.owned > 0 ? confirm(`Você tem ${summary.owned} figurinhas coladas e ${summary.duplicates} repetidas neste aparelho.\n\nOK = Começar familiar com meu álbum atual.\nCancelar = Começar familiar zerado.`) : false;
  const code = generateFamilyCode();
  const doc = familyCloudDoc(code);
  const payload = {
    inviteCode: code,
    ownerUid: cloud.user.uid,
    ownerEmail: cloud.user.email || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    version: VERSION,
    members: {[cloud.user.uid]: memberInfo()},
    state: useCurrent ? normalizeState(state) : emptyState()
  };
  await doc.set(payload);
  familyAlbumMeta = {inviteCode: code, ownerUid: cloud.user.uid, members: {[cloud.user.uid]: memberInfo()}};
  setActiveAlbumMode('family', code);
  await loadCloud(true);
  startRealtimeSync();
  render();
  toast(`Álbum familiar criado: ${code}`);
}
async function joinFamilyAlbum(code){
  if(!cloud.user) return toast('Entre com Google antes de entrar em um álbum familiar.');
  const cleaned = String(code || '').trim().toUpperCase();
  if(!cleaned) return toast('Digite o código do álbum familiar.');
  if(currentStateSummary(state).owned > 0 && confirm('Antes de entrar, quer exportar um backup do álbum atual deste aparelho?')){
    downloadJson(backupFilename('backup-antes-de-entrar-familia'), makeBackupPayload('before-join-family'));
  }
  const doc = familyCloudDoc(cleaned);
  try{
    const memberPath = `members.${cloud.user.uid}`;
    const payload = {updatedAt: firebase.firestore.FieldValue.serverTimestamp()};
    payload[memberPath] = memberInfo();
    await doc.update(payload);
    const snap = await doc.get();
    if(!snap.exists) return toast('Código não encontrado.');
    familyAlbumMeta = snap.data();
    setActiveAlbumMode('family', cleaned);
    await loadCloud(true);
    startRealtimeSync();
    render();
    toast('Você entrou no álbum familiar.');
  }catch(e){
    console.warn('join family failed', e);
    toast('Código não encontrado ou sem permissão.');
  }
}
async function switchToPersonalAlbum(){
  if(!cloud.user) return;
  setActiveAlbumMode('personal');
  familyAlbumMeta = null;
  await loadCloud(true);
  startRealtimeSync();
  render();
  toast('Álbum pessoal ativado.');
}
async function switchToFamilyAlbum(){
  if(!cloud.user || !familyAlbumId) return toast('Você ainda não entrou em um álbum familiar.');
  setActiveAlbumMode('family', familyAlbumId);
  await loadCloud(true);
  startRealtimeSync();
  render();
  toast('Álbum familiar ativado.');
}
async function shareFamilyInvite(){
  const text = familyInviteText();
  try{
    if(navigator.share){
      await navigator.share({title:'Álbum Familiar da Copa', text});
      return;
    }
  }catch(e){
    console.warn('family share failed', e);
  }
  await copyText(text);
}
async function leaveFamilyAlbum(){
  if(!cloud.user || !familyAlbumId) return;
  if(!confirm('Sair do álbum familiar neste aparelho? Seu álbum pessoal continuará salvo.')) return;
  const id = familyAlbumId;
  try{
    await familyCloudDoc(id).set({
      members: {[cloud.user.uid]: firebase.firestore.FieldValue.delete()},
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
  }catch(e){}
  familyAlbumMeta = null;
  setActiveAlbumMode('personal');
  await loadCloud(true);
  startRealtimeSync();
  render();
  toast('Você saiu do álbum familiar.');
}
function renderFamilyCard(){
  const members = familyAlbumMeta?.members || {};
  const memberList = Object.values(members).filter(Boolean);
  const code = familyAlbumMeta?.inviteCode || familyAlbumId || '';
  const isFamily = activeAlbumMode === 'family' && familyAlbumId;
  return `<section class="card family-card">
    <span class="label">Álbum familiar</span>
    <h3>${isFamily ? 'Família conectada' : 'Compartilhe com a família'}</h3>
    <p class="muted">${isFamily ? 'Todos os membros editam o mesmo álbum em tempo real. Backup JSON continua sendo apenas restauração manual.' : 'Crie ou entre em um álbum familiar para duas ou mais contas Google marcarem juntas.'}</p>
    <div class="family-identity-row">${userPhotoMarkup('sm')}<span>${escapeHtml(userDisplayName())}</span></div>
    ${isFamily ? `<div class="family-code"><span>Código</span><strong>${escapeHtml(code)}</strong></div>` : ''}
    ${isFamily ? `<div class="family-members">${memberList.map(m=>`<span>${escapeHtml((m.name || m.email || 'Membro').split(' ')[0])}</span>`).join('') || '<span>Você</span>'}</div>` : ''}
    <div class="button-row family-actions">
      <button class="btn ${isFamily ? '' : 'primary'}" id="createFamilyAlbum">${isFamily ? 'Novo familiar' : 'Criar álbum familiar'}</button>
      <button class="btn" id="joinFamilyAlbum">Entrar com código</button>
      ${isFamily ? '<button class="btn primary" id="shareFamilyInvite">Compartilhar convite</button>' : ''}
      ${familyAlbumId ? `<button class="btn" id="switchPersonal">${isFamily ? 'Usar pessoal' : 'Usar familiar'}</button>` : ''}
      ${familyAlbumId ? '<button class="btn" id="copyPersonalToFamily">Copiar pessoal → familiar</button>' : ''}
      ${isFamily ? '<button class="btn danger" id="leaveFamilyAlbum">Sair do familiar</button>' : ''}
    </div>
    ${familyAlbumId ? '<p class="muted tools-note">Use “Copiar pessoal → familiar” só quando quiser substituir o álbum familiar pelo seu álbum pessoal.</p>' : ''}
  </section>`;
}
function bindFamilyCard(){
  $('#createFamilyAlbum')?.addEventListener('click', createFamilyAlbum);
  $('#joinFamilyAlbum')?.addEventListener('click', async () => {
    const code = prompt('Digite o código do álbum familiar. Ex.: FAM-8K2P');
    if(code) await joinFamilyAlbum(code);
  });
  $('#shareFamilyInvite')?.addEventListener('click', shareFamilyInvite);
  $('#switchPersonal')?.addEventListener('click', () => {
    if(activeAlbumMode === 'family') switchToPersonalAlbum();
    else switchToFamilyAlbum();
  });
  $('#copyPersonalToFamily')?.addEventListener('click', copyPersonalToFamilyAlbum);
  $('#leaveFamilyAlbum')?.addEventListener('click', leaveFamilyAlbum);
}

function startRealtimeSync(){
  if(!cloud.ready || !cloud.user || !cloud.db) return;
  if(cloudUnsubscribe) cloudUnsubscribe();

  cloudUnsubscribe = cloudDoc().onSnapshot(snap => {
    if(!snap.exists || !snap.data().state) return;
    if(snap.metadata?.hasPendingWrites) return;

    const data = snap.data();
    if(activeAlbumMode === 'family') familyAlbumMeta = data;
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
        safeToast('Álbum atualizado pela nuvem.');
      }
    }
  }, err => {
    console.warn('realtime sync failed', err);
    if(!isOffline()) safeToast('Sincronização instável. Dados locais preservados.');
  });
}
function personalCloudDoc(){ return cloud.db.collection(CLOUD_COLLECTION).doc(cloud.user.uid); }
function familyCloudDoc(id=familyAlbumId){ return cloud.db.collection(FAMILY_COLLECTION).doc(id); }
function activeCloudDoc(){
  if(activeAlbumMode === 'family' && familyAlbumId) return familyCloudDoc(familyAlbumId);
  return personalCloudDoc();
}
function cloudDoc(){ return activeCloudDoc(); }
function activeAlbumLabel(){
  return activeAlbumMode === 'family' && familyAlbumId ? 'Álbum familiar' : 'Álbum pessoal';
}
function setActiveAlbumMode(mode, id=''){
  activeAlbumMode = mode === 'family' && id ? 'family' : 'personal';
  familyAlbumId = activeAlbumMode === 'family' ? id : '';
  localStorage.setItem('meu-album-copa-active-mode', activeAlbumMode);
  if(familyAlbumId) localStorage.setItem('meu-album-copa-family-id', familyAlbumId);
  else localStorage.removeItem('meu-album-copa-family-id');
}
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
function queueCloudSave(){ if(!cloud.ready || !cloud.user || isOffline()) return; clearTimeout(syncTimer); syncTimer=setTimeout(()=>saveCloud(),900); }
async function saveCloud(){
  if(!cloud.ready || !cloud.user) return;
  if(isOffline()) return safeToast('Offline: salvo localmente.');
  try{
    const payload = {state, updatedAt:firebase.firestore.FieldValue.serverTimestamp(), version:VERSION};
    if(activeAlbumMode === 'family'){
      payload.members = {[cloud.user.uid]: memberInfo()};
    }
    await activeCloudDoc().set(payload,{merge:true});
  }catch(e){
    console.warn('save cloud failed', e);
  }
}
async function loadCloud(silent=false){
  if(!cloud.ready || !cloud.user) return;
  if(isOffline()){ if(!silent) safeToast('Offline: usando dados locais.'); return; }
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
        if(!silent) safeToast('Nuvem carregada.');
        render();
      }
    } else {
      await saveCloud();
    }
  }catch(e){
    console.warn('load cloud failed', e);
    if(!silent) safeToast('Falha na sincronização.');
  }
}
async function syncNow(){ if(!cloud.user) return safeToast('Entre com Google no Perfil.'); if(isOffline()) return safeToast('Offline: sincronizo quando a conexão voltar.'); await loadCloud(); await saveCloud(); safeToast('Sincronizado.'); updateConnectionBadge(); }

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
initSwipeNavigation();
bindHeaderShortcuts();
bindConnectionEvents();
updateConnectionBadge();
$('#syncButton').addEventListener('click',syncNow);
// PWA update guard: evita o app instalado ficar preso em app.js/styles/data antigos.
if('serviceWorker' in navigator){
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{
    if(refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg=>{
        // Procura atualização logo ao abrir e depois periodicamente enquanto o app estiver aberto.
        reg.update().catch(()=>{});
        setInterval(()=>reg.update().catch(()=>{}), 60 * 1000);
      })
      .catch(()=>{});
  });
}
initCloud();
render();
setTimeout(() => {
  if(!cloud.user && currentView === 'home') toast('Lembrete: conecte com Google para salvar na nuvem.');
}, 1600);
