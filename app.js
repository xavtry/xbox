/* GSN — plain HTML/CSS/JavaScript edition. No build tools or dependencies. */
(() => {
  'use strict';
  const STORAGE_KEY = 'gsn-static-state-v1';
  const DEFAULT_STATE = {
    profile: { username: 'Player One', status: 'Online', message: 'Ready for the next adventure.', avatar: '' },
    accent: '#80d742', theme: 'Emerald', backgroundMode: 'dynamic', backgroundImage: '',
    favorites: [], recents: [], overrides: {}, customGames: [], deleted: [],
    customCollections: ['Platformers', 'Arcade', 'Sandbox', 'Puzzle', 'Adventure', 'Music'],
    homeGroups: { games: true, customize: true, music: true, chat: true },
    settings: { sound: true, volume: 55, reduceMotion: false, showFps: true, defaultListView: false },
    messages: [{ who: 'GSN Bot', text: 'Welcome to GSN Chat. This is a local demo chat; messages stay in this browser.', time: Date.now() }],
    musicUrl: ''
  };
  const PALETTE = [
    { name: 'Green', value: '#80d742' }, { name: 'Blue', value: '#4389ff' },
    { name: 'Purple', value: '#b47aff' }, { name: 'Red', value: '#ff595e' },
    { name: 'Orange', value: '#ff9e3d' }, { name: 'Cyan', value: '#31dfe8' }, { name: 'White', value: '#eeeeee' }
  ];
  const THEMES = {
    Emerald: ['#071c17', '#0a3025', '#80d742'], Midnight: ['#080d1c', '#14213d', '#4389ff'],
    Ocean: ['#061d29', '#0a3947', '#31dfe8'], Violet: ['#170e22', '#342046', '#b47aff'],
    Crimson: ['#210d12', '#401923', '#ff595e'], Graphite: ['#111111', '#262626', '#eeeeee']
  };
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const icon = name => ({
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="7.5" r="4"/><path d="M4.5 21v-2.2a7.5 7.5 0 0 1 15 0V21"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h4v16H4zM11 4h4v16h-4zM18 4h2v16h-2z"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h16l-1 11H5L4 9Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/><path d="M9 13v3m6-3v3"/></svg>',
    community: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m7 7 4 2-2 4-2-6Zm10 0-4 2 2 4 2-6ZM8 17l4-2 4 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="7.1"/><path d="m16 16 5 5"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.1 1.9-1.9 3.2-2.3-.5a8 8 0 0 1-1.7 1l-.7 2.2h-3.8l-.7-2.2a8 8 0 0 1-1.7-1l-2.3.5-1.9-3.2 1.1-1.9a8 8 0 0 1 0-2l-1.1-1.9L5.5 8l2.3.5a8 8 0 0 1 1.7-1l.7-2.2H14l.7 2.2a8 8 0 0 1 1.7 1l2.3-.5 1.9 3.2-1.1 1.9a8 8 0 0 1-.1 2Z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 18a4 4 0 0 1-.1-8A6.5 6.5 0 0 1 18 9a4.5 4.5 0 0 1 0 9H6Z"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v13H9l-5 4V4Z"/><path d="M8 9h8M8 13h6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 5-7 7 7 7M8 12h13"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg>',
    monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5h12M9 12h12M9 19h12"/><circle cx="4" cy="5" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="19" r="1"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M4 12h16"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 15h8"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>'
  }[name] || '•');
  const defaultIcon = () => icon('profile');
  const loadState = () => {
    try {
      const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...structuredCloneSafe(DEFAULT_STATE), ...loaded,
        profile: { ...DEFAULT_STATE.profile, ...(loaded.profile || {}) },
        homeGroups: { ...DEFAULT_STATE.homeGroups, ...(loaded.homeGroups || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(loaded.settings || {}) } };
    } catch { return structuredCloneSafe(DEFAULT_STATE); }
  };
  const structuredCloneSafe = obj => JSON.parse(JSON.stringify(obj));
  let state = loadState();
  let builtinGames = [];
  let dataError = '';
  let searchText = '';
  let sortMode = 'Name';
  let collectionMode = 'All collections';
  let currentLibraryMode = 'all';
  let libraryPageSize = 120;
  let preserveLibraryPageSize = false;
  let editingGameId = '';
  let overlayOpen = false;
  let snakeTimer = null;
  let snakeKeyHandler = null;
  let playingAudio = null;
  let musicAudio = null;
  let toastTimer = null;

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { toast('Your browser storage is full. Some changes may not persist.'); }
    applyTheme();
  }
  function applyTheme() {
    const theme = THEMES[state.theme] || THEMES.Emerald;
    document.documentElement.style.setProperty('--accent', state.accent || theme[2]);
    document.documentElement.style.setProperty('--accent-soft', `${state.accent || theme[2]}28`);
    document.documentElement.style.setProperty('--theme-a', theme[0]);
    document.documentElement.style.setProperty('--theme-b', theme[1]);
    document.body.classList.toggle('reduced-motion', !!state.settings.reduceMotion);
  }
  function allGames() {
    const result = [];
    const byId = new Map();
    builtinGames.forEach(g => {
      if (state.deleted.includes(g.id)) return;
      const merged = { ...g, ...(state.overrides[g.id] || {}) };
      if (!merged.title || !merged.id) return;
      byId.set(merged.id, merged);
    });
    state.customGames.forEach(g => { if (g && g.id && g.title && !state.deleted.includes(g.id)) byId.set(g.id, g); });
    state.deleted.forEach(id => byId.delete(id));
    byId.forEach(g => result.push(g));
    return result;
  }
  function getGame(id) { return allGames().find(g => g.id === id); }
  function safeImage(image) { return typeof image === 'string' && image.trim() ? image.trim() : 'assets/covers/gsn.svg'; }
  function gameArt(g) { return safeImage(g?.image); }
  function avatarHTML(size = '') {
    const image = state.profile.avatar;
    if (image) return `<div class="avatar ${size}" style="background-image:url('${escapeHTML(image).replace(/'/g, '%27')}')"></div>`;
    return `<div class="avatar ${size}">${icon('profile')}</div>`;
  }
  function statusDot() { return state.profile.status === 'Online' ? '<span class="online-dot"></span>' : ''; }
  function statusArea() {
    return `<div class="status-badges"><span class="launcher-badge">Launcher</span>${state.settings.showFps ? '<span class="fps-badge">240 FPS</span>' : ''}</div>`;
  }
  function hints() {
    return `<div class="controller-hints"><span class="hint"><b class="keycap">A</b> Select</span><span class="hint"><b class="keycap">B</b> Back</span><span class="hint"><b class="keycap">Y</b> Search</span><span class="hint"><b class="keycap menu">☰</b> More options</span></div>`;
  }
  function navigate(route) {
    const next = `#${route}`;
    if (location.hash === next) render(); else location.hash = next;
  }
  function route() { return decodeURIComponent(location.hash.replace(/^#\/?/, '') || 'home'); }
  function setTitle(text) { document.title = `${text} — GSN`; }
  function toast(message) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = message;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el?.remove(), 3000);
  }
  function playSelectionSound() {
    if (!state.settings.sound) return;
    try {
      const audio = new Audio('assets/audio/game-select.mp3');
      audio.volume = Math.max(0, Math.min(1, Number(state.settings.volume) / 100));
      audio.onerror = () => {};
      const p = audio.play(); if (p && p.catch) p.catch(() => {});
    } catch { /* No sound file is included by default. */ }
  }
  function recordRecent(id) {
    state.recents = [{ id, at: Date.now() }, ...state.recents.filter(x => x.id !== id)].slice(0, 10);
    persist();
  }
  function showOverlay(title, body, className = '') {
    closeOverlay(); overlayOpen = true;
    const wrapper = document.createElement('div'); wrapper.className = 'overlay'; wrapper.id = 'active-overlay';
    wrapper.innerHTML = `<section class="modal ${className}" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}"><header class="modal-head"><h2>${escapeHTML(title)}</h2><button data-action="close-overlay" aria-label="Close">${icon('close')}</button></header><div class="modal-body">${body}</div></section>`;
    wrapper.addEventListener('click', e => { if (e.target === wrapper) closeOverlay(); });
    document.body.appendChild(wrapper);
    $('.modal-head button', wrapper)?.focus();
    return wrapper;
  }
  function closeOverlay() {
    overlayOpen = false;
    if (snakeTimer) { clearInterval(snakeTimer); snakeTimer = null; }
    if (snakeKeyHandler) { document.removeEventListener('keydown', snakeKeyHandler); snakeKeyHandler = null; }
    if (playingAudio) { try { playingAudio.pause(); } catch {} playingAudio = null; }
    $('#active-overlay')?.remove();
  }
  function header(title, closeRoute = 'home') {
    return `<header class="app-header"><button class="back-button" data-action="back" aria-label="Go back">${icon('back')}</button><h1>${escapeHTML(title)}</h1><button class="close-page" data-route="${escapeHTML(closeRoute)}" aria-label="Close">${icon('close')}</button></header>`;
  }
  function renderHome() {
    setTitle('Home');
    const games = allGames().filter(g => g.type === 'game');
    const selected = games.find(g => g.id === 'ovo-3') || games[0];
    const recents = state.recents.map(x => getGame(x.id)).filter(Boolean).slice(0, 6);
    const homeMode = state.backgroundMode;
    const customBackground = homeMode === 'custom' && validImagePath(state.backgroundImage) ? `style="background-image:linear-gradient(90deg,rgba(1,13,12,.93),rgba(1,20,16,.84)),url('${escapeHTML(state.backgroundImage)}');background-size:cover;background-position:center"` : '';
    const homeGames = state.homeGroups.games ? `<div class="feature-row" aria-label="Favorite games">${games.map((g, i) => `<button class="feature-tile ${i === 0 ? 'is-focused' : ''}" data-action="open-game" data-id="${escapeHTML(g.id)}" aria-label="Open ${escapeHTML(g.title)}"><img src="${escapeHTML(gameArt(g))}" alt="" loading="lazy" onerror="this.src='assets/covers/gsn.svg'"><span class="tile-label">${escapeHTML(g.title)}</span></button>`).join('')}</div>` : '';
    const panels = [];
    if (state.homeGroups.customize) panels.push(`<button class="home-panel" data-route="personalization"><span class="panel-graphic">${icon('monitor')}</span><strong>Customize your Home</strong></button>`);
    if (state.homeGroups.music) panels.push(`<button class="home-panel music" data-route="music"><span class="panel-graphic">${icon('music')}</span><strong>Music. While you play.</strong></button>`);
    if (state.homeGroups.chat) panels.push(`<button class="home-panel chat" data-route="chat"><span class="panel-graphic">${icon('chat')}</span><strong>Your people. GSN Chat.</strong></button>`);
    if (!panels.length) panels.push(`<button class="home-panel browse" data-route="library"><span class="panel-graphic">${icon('library')}</span><strong>Browse your games</strong></button>`);
    $('#app').innerHTML = `${statusArea()}<main class="app-shell shell-home mode-${escapeHTML(homeMode)}" ${customBackground}><div class="home-content"><div class="home-top"><button class="profile-chip" data-route="profile">${avatarHTML()}<span><span class="username">${escapeHTML(state.profile.username)}</span><span class="online-label">${statusDot()}${escapeHTML(state.profile.status)}</span></span></button><nav class="top-nav" aria-label="Main navigation"><button class="round-nav" data-route="library" title="Library" aria-label="Library">${icon('library')}</button><button class="round-nav" data-action="store" title="Store" aria-label="Store">${icon('store')}</button><button class="round-nav" data-route="friends" title="Community" aria-label="Community">${icon('community')}</button><button class="round-nav" data-route="search" title="Search" aria-label="Search">${icon('search')}</button><button class="round-nav" data-route="settings" title="Settings" aria-label="Settings">${icon('settings')}</button></nav><div class="home-right"><button class="quiet-icon" data-route="friends" aria-label="Notifications">♧</button><span>⌁</span><span id="clock">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div></div><section class="home-middle">${homeGames}<div class="bottom-panels"><button class="home-panel browse" data-route="library"><span class="panel-graphic">${icon('library')}</span><strong>Browse your games</strong></button>${panels.join('')}</div></section>${hints()}</div></main>`;
    applyTheme();
    const shell = $('.shell-home');
    if (shell && homeMode === 'game-art' && selected) shell.style.backgroundImage = `linear-gradient(90deg,rgba(0,14,13,.90),rgba(0,20,15,.75)),url("${gameArt(selected)}")`;
    else if (shell && homeMode === 'static') shell.style.background = 'linear-gradient(135deg,#101010,#202020)';
    if (recents.length) { /* intentionally kept locally for the Profile page, not cluttering the dashboard */ }
  }
  function sidebar(mode) {
    const games = allGames().filter(g => g.type === 'game').length;
    const apps = allGames().filter(g => g.type === 'app').length;
    const items = [
      ['all','grid','All',''], ['games','community','Games',games], ['apps','apps','Apps',apps], ['cloud','cloud','Cloud Gaming','']
    ];
    return `<aside class="sidebar"><button class="side-profile" data-route="profile">${avatarHTML()}<span><span>${escapeHTML(state.profile.username)}</span><br><small style="font-size:12px;color:#9eeb7a">${statusDot()}${escapeHTML(state.profile.status)}</small></span></button><button class="side-search" data-route="search">${icon('search')}<span>Search</span></button><nav class="side-nav" aria-label="Library navigation">${items.map(([id,ico,label,count]) => `<button class="${mode === id ? 'active' : ''}" data-action="library-mode" data-mode="${id}"><span class="nav-icon">${icon(ico)}</span><span>${label}</span>${count !== '' ? `<span class="nav-count">${count}</span>` : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><button data-route="manage">${icon('settings')}<span>Manage games</span></button></div></aside>`;
  }
  function filteredGames(mode = currentLibraryMode) {
    let games = allGames();
    if (mode === 'games') games = games.filter(g => g.type === 'game');
    else if (mode === 'apps') games = games.filter(g => g.type === 'app');
    else if (mode === 'cloud') games = games.filter(g => g.cloudUrl || g.collection === 'Cloud Gaming');
    const query = searchText.trim().toLowerCase();
    if (query) games = games.filter(g => [g.title, g.description, g.developer, ...(g.aliases || []), ...(g.tags || []), ...(g.genres || []), g.collection].filter(Boolean).join(' ').toLowerCase().includes(query));
    if (collectionMode === 'Favorites') games = games.filter(g => state.favorites.includes(g.id));
    else if (collectionMode === 'Recently added') games = games.filter(g => g.dateAdded).sort((a,b) => String(b.dateAdded).localeCompare(String(a.dateAdded)));
    else if (collectionMode === 'Recently played') games = games.filter(g => state.recents.some(r => r.id === g.id)).sort((a,b) => state.recents.findIndex(r => r.id === a.id) - state.recents.findIndex(r => r.id === b.id));
    else if (collectionMode !== 'All collections' && collectionMode !== 'All games') games = games.filter(g => g.collection === collectionMode);
    if (sortMode === 'Name') games.sort((a,b) => a.title.localeCompare(b.title));
    else if (sortMode === 'Recently added') games.sort((a,b) => String(b.dateAdded || '').localeCompare(String(a.dateAdded || '')) || a.title.localeCompare(b.title));
    else if (sortMode === 'Recently played') games.sort((a,b) => (state.recents.findIndex(r => r.id === a.id) < 0 ? 9999 : state.recents.findIndex(r => r.id === a.id)) - (state.recents.findIndex(r => r.id === b.id) < 0 ? 9999 : state.recents.findIndex(r => r.id === b.id)) || a.title.localeCompare(b.title));
    else if (sortMode === 'Release year') games.sort((a,b) => (b.releaseYear || 0) - (a.releaseYear || 0));
    return games;
  }
  function renderLibrary(mode = 'all') {
    currentLibraryMode = mode;
    if (!preserveLibraryPageSize) libraryPageSize = 120;
    const resultGames = filteredGames(mode);
    const titles = { all: searchText ? 'Search GSN' : 'Search GSN', games: 'Games', apps: 'Applications', cloud: 'Cloud Gaming' };
    setTitle(titles[mode] || 'Library');
    const collections = ['All collections','Favorites','Recently added','Recently played','All games', ...new Set([...state.customCollections, ...allGames().map(g => g.collection).filter(Boolean)])];
    const viewList = state.settings.defaultListView;
    $('#app').innerHTML = `${statusArea()}<main class="library-layout">${sidebar(mode)}<section class="library-main"><h1 class="library-title">${titles[mode]}</h1><div class="search-toolbar"><div class="search-box">${icon('search')}<input id="library-search" type="search" data-action="search-input" placeholder="Search GSN" value="${escapeHTML(searchText)}" aria-label="Search GSN"><button class="quiet-icon" data-action="clear-search" aria-label="Clear search">×</button></div><button class="toolbar-button" data-action="keyboard">Keyboard</button><button class="toolbar-button" data-action="toggle-view">${viewList ? 'Grid' : 'List'}</button></div><div class="filter-row"><select class="select-control" data-action="sort"><option ${sortMode==='Name'?'selected':''}>Name</option><option ${sortMode==='Recently added'?'selected':''}>Recently added</option><option ${sortMode==='Recently played'?'selected':''}>Recently played</option><option ${sortMode==='Release year'?'selected':''}>Release year</option></select><select class="select-control" data-action="collection"><option ${collectionMode==='All collections'?'selected':''}>All collections</option>${collections.filter(c=>c!=='All collections').map(c=>`<option ${collectionMode===c?'selected':''}>${escapeHTML(c)}</option>`).join('')}</select><span class="results-count">${resultGames.length.toLocaleString()} ITEMS</span></div><div class="game-grid ${viewList?'list-view':''}">${renderGameCards(resultGames.slice(0,libraryPageSize), viewList)}</div>${resultGames.length>libraryPageSize?`<div style="text-align:center;padding:8px 0 35px"><button class="secondary-button" data-action="load-more">Load more games (${Math.min(libraryPageSize,resultGames.length)} of ${resultGames.length})</button></div>`:''}</section></main><nav class="bottom-nav-strip"><span class="strip-label">Search in</span><button data-route="music">GSN Music</button><button data-route="movies">Movies</button><button data-route="chat">Chat</button><button data-route="settings">Settings</button><button data-route="profile">Profile</button><button data-route="personalization">Personalization</button><button data-route="settings">Audio</button></nav>`;
    applyTheme();
  }
  function renderGameCards(games, list = false) {
    if (!games.length) return `<div class="empty-state"><strong>No games found</strong><span>Try a different search or collection.</span><button class="small-button" data-action="clear-filters">Clear search and filters</button></div>`;
    return games.map(g => `<button class="game-card ${list ? 'list-item' : ''}" data-action="open-game" data-id="${escapeHTML(g.id)}" aria-label="Open ${escapeHTML(g.title)}"><img src="${escapeHTML(gameArt(g))}" alt="" loading="lazy" onerror="this.src='assets/covers/gsn.svg'"><span class="card-title">${escapeHTML(g.title)}</span></button>`).join('');
  }
  function renderProfile() {
    setTitle('My profile');
    const recent = state.recents.map(r => getGame(r.id)).filter(Boolean);
    const favorites = state.favorites.map(id => getGame(id)).filter(Boolean);
    $('#app').innerHTML = `${statusArea()}<main class="page">${header('My profile')}<section class="profile-hero"><div class="profile-avatar" style="${state.profile.avatar ? `background-image:url('${escapeHTML(state.profile.avatar)}')` : ''};background-size:cover;background-position:center">${state.profile.avatar ? '' : icon('profile')}${statusDot()}</div><div><div class="profile-name">${escapeHTML(state.profile.username)}</div><div class="profile-status">${escapeHTML(state.profile.status)}</div><div class="profile-message">${escapeHTML(state.profile.message)}</div></div></section><div class="profile-actions"><button class="rect-button" data-action="edit-profile">Edit profile</button><button class="rect-button" data-route="friends">Friends &amp; account</button></div><section class="profile-section"><h2 class="section-title">Recently played</h2><div class="horizontal-row">${recent.length ? recent.map(g => `<button class="recent-card" data-action="open-game" data-id="${escapeHTML(g.id)}"><img src="${escapeHTML(gameArt(g))}" alt="" loading="lazy" onerror="this.src='assets/covers/gsn.svg'"><span>${escapeHTML(g.title)}</span></button>`).join('') : '<p class="muted">Your played games will show up here.</p>'}</div></section><section class="profile-section favorites-row"><button class="wide-action" data-action="show-favorites"><span>Favorite games${favorites.length ? ` · ${favorites.length}` : ''}</span><span>›</span></button><div class="horizontal-row" style="margin-top:13px">${favorites.length ? favorites.map(g => `<button class="recent-card" data-action="open-game" data-id="${escapeHTML(g.id)}"><img src="${escapeHTML(gameArt(g))}" alt=""><span>${escapeHTML(g.title)}</span></button>`).join('') : ''}</div></section>${hints()}</main>`;
    applyTheme();
  }
  function validImagePath(value) { return /^(https?:\/\/|\.\/|\.\.\/|assets\/|games\/|data:image\/)/i.test(String(value || '')); }
  function renderPersonalization() {
    setTitle('Personalization');
    const modes = [
      ['game-art','Game art'], ['dynamic','GSN dynamic'], ['static','Static'], ['custom','Your image']
    ];
    $('#app').innerHTML = `${statusArea()}<main class="panel-page">${header('Personalization')}<p class="crumb">General / Personalization / My background</p><h2 class="panel-heading">Make Home yours</h2><div class="background-options">${modes.map(([id,label]) => `<button class="background-option ${state.backgroundMode===id?'selected':''}" data-action="background-mode" data-mode="${id}"><span class="background-preview ${id==='game-art'?'gameart':id==='dynamic'?'dynamic':id==='static'?'static':'custom'}" ${id==='custom' && validImagePath(state.backgroundImage) ? `style="background-image:url('${escapeHTML(state.backgroundImage)}');background-size:cover"` : ''}></span><span class="option-title">${label}${state.backgroundMode===id?' ✓':''}</span></button>`).join('')}</div><div class="settings-list"><div class="setting-row"><div><div>Accent color</div><div class="preset-colors">${PALETTE.map(c=>`<button class="color-swatch ${state.accent===c.value?'selected':''}" style="background:${c.value}" data-action="accent" data-color="${c.value}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}</div></div><input type="color" aria-label="Custom accent color" data-action="custom-accent" value="${escapeHTML(state.accent)}"></div><div class="setting-row"><span>Background theme</span><select class="theme-select" data-action="theme">${Object.keys(THEMES).map(t=>`<option ${state.theme===t?'selected':''}>${t}</option>`).join('')}</select></div><button class="wide-action" data-action="home-groups"><span>▦ &nbsp; Home groups</span><span>›</span></button><button class="wide-action" data-action="profile-appearance"><span>${icon('profile')} &nbsp; Profile appearance</span><span>›</span></button><div class="setting-row"><div><div>Your image URL</div><div class="setting-help">Use a path such as assets/backgrounds/wallpaper.jpg or an https image URL.</div></div><input type="url" data-action="background-url" placeholder="Image URL or project path" value="${escapeHTML(state.backgroundImage)}"></div><div class="setting-row"><div><div>Custom image file</div><div class="setting-help">Choose an image from your computer; it is saved locally in this browser.</div></div><input type="file" accept="image/*" data-action="background-file"></div></div>${hints()}</main>`;
    applyTheme();
  }
  function renderSettings() {
    setTitle('Settings');
    const toggle = (key, label, help = '') => `<div class="setting-row"><div><div>${label}</div>${help ? `<div class="setting-help">${help}</div>` : ''}</div><button class="toggle" role="switch" aria-checked="${!!state.settings[key]}" data-action="setting-toggle" data-key="${key}" aria-label="${label}"></button></div>`;
    $('#app').innerHTML = `${statusArea()}<main class="panel-page">${header('Settings')}<p class="crumb">General / Settings</p><h2 class="panel-heading">Make GSN yours</h2><div class="settings-list"><button class="wide-action" data-route="personalization"><span>Appearance &amp; personalization</span><span>›</span></button><div class="setting-row"><span>Accent color</span><div class="compact-buttons">${PALETTE.slice(0,4).map(c=>`<button class="color-swatch ${state.accent===c.value?'selected':''}" style="background:${c.value}" data-action="accent" data-color="${c.value}" aria-label="${c.name}"></button>`).join('')}<button class="small-button" data-route="personalization">More</button></div></div><div class="setting-row"><span>Background theme</span><select class="theme-select" data-action="theme">${Object.keys(THEMES).map(t=>`<option ${state.theme===t?'selected':''}>${t}</option>`).join('')}</select></div><div class="setting-row"><span>Default library view</span><select data-action="default-view"><option value="grid" ${!state.settings.defaultListView?'selected':''}>Grid</option><option value="list" ${state.settings.defaultListView?'selected':''}>List</option></select></div>${toggle('reduceMotion','Reduce animations','Turn off most movement and transitions.')}${toggle('sound','Enable sound effects','Ready for public/assets/audio/game-select.mp3 when you add it.')}${toggle('showFps','Show FPS badge','This is a decorative demo value, not a measured FPS counter.')}<div class="setting-row"><div><div>Sound volume</div><div class="setting-help">Selection sound volume: ${state.settings.volume}%</div></div><input type="range" min="0" max="100" value="${state.settings.volume}" data-action="volume" aria-label="Sound volume"></div><button class="wide-action" data-route="manage"><span>Manage Games</span><span>›</span></button><button class="wide-action" data-action="export-settings"><span>Export settings</span><span>↓</span></button><button class="wide-action" data-action="import-settings"><span>Import settings</span><span>↑</span></button><button class="wide-action" data-action="clear-recents"><span>Clear recent history</span><span>›</span></button><button class="wide-action" data-action="reset-settings"><span>Reset personalization and settings</span><span>›</span></button></div>${hints()}</main>`;
    applyTheme();
  }
  function renderGameDetails(id) {
    const g = getGame(id);
    if (!g) { navigate('library'); toast('That game could not be found in your library.'); return; }
    setTitle(g.title);
    const favorite = state.favorites.includes(id);
    $('#app').innerHTML = `${statusArea()}<main class="page-content">${header('Game details')}<div class="details-hero"><img class="details-art" src="${escapeHTML(gameArt(g))}" alt="${escapeHTML(g.title)} artwork" onerror="this.src='assets/covers/gsn.svg'"><section><h2 class="details-title">${escapeHTML(g.title)}</h2><div class="muted">${escapeHTML(g.developer || 'Developer not listed')}${g.releaseYear ? ` · ${g.releaseYear}` : ''}</div><div class="tag-row">${(g.genres || []).map(tag=>`<span class="tag">${escapeHTML(tag)}</span>`).join('')}${g.type==='app'?'<span class="tag">Application</span>':''}</div><p class="details-description">${escapeHTML(g.description || 'No description has been added for this item yet.')}</p><div class="details-actions"><button class="primary-button" data-action="launch" data-id="${escapeHTML(g.id)}">▶ &nbsp; ${g.launchType==='builtin'?'Play now':'Launch'}</button><button class="secondary-button" data-action="favorite" data-id="${escapeHTML(g.id)}">${favorite?'★ Remove favorite':'☆ Add to favorites'}</button><button class="secondary-button" data-action="game-options" data-id="${escapeHTML(g.id)}">More options</button></div><p class="muted" style="font-size:12px;margin-top:22px">Launch method: ${escapeHTML(g.launchType || 'url')}${g.launchType==='builtin'?' · runs inside GSN': ''}</p></section></div>${hints()}</main>`;
    applyTheme();
  }
  function renderManage() {
    setTitle('Manage games');
    const games = allGames().sort((a,b)=>a.title.localeCompare(b.title));
    $('#app').innerHTML = `${statusArea()}<main class="page-content">${header('Manage Games')}<p class="notice">Add a game here without editing code, or update <code>data/games.json</code> in your GitHub repository. Changes made in this page are stored only in this browser until you export the JSON and commit it to GitHub.</p><div class="manage-toolbar"><button class="primary-button" data-action="new-game">＋ Add a game</button><button class="secondary-button" data-action="import-games">Import JSON</button><button class="secondary-button" data-action="export-games">Export JSON</button><button class="secondary-button" data-action="reset-game-library">Reset local game changes</button></div><input id="import-file" type="file" accept="application/json,.json" class="hidden"><div class="notice">${games.length} items in your launcher. For a browser game hosted in this repository, set launch type to <code>local-page</code> and use a path like <code>games/my-game/index.html</code>. For external games, use a full https URL.</div><div id="game-form-slot"></div><div class="manage-list">${games.map(g=>`<div class="manage-entry"><img src="${escapeHTML(gameArt(g))}" alt="" onerror="this.src='assets/covers/gsn.svg'"><div class="manage-entry-info"><strong>${escapeHTML(g.title)}</strong><span>${escapeHTML(g.type)} · ${escapeHTML(g.collection || 'No collection')} · ${escapeHTML(g.launchType || 'url')}</span></div><button data-action="edit-game" data-id="${escapeHTML(g.id)}">Edit</button><button data-action="delete-game" data-id="${escapeHTML(g.id)}">Delete</button></div>`).join('')}</div>${hints()}</main>`;
    applyTheme();
  }
  function gameForm(g = {}) {
    const isEdit = !!g.id;
    editingGameId = isEdit ? g.id : '';
    const genres = (g.genres || []).join(', '), tags = (g.tags || []).join(', '), aliases = (g.aliases || []).join(', ');
    return `<form class="manage-form" id="game-form"><label class="field">Game ID *<input name="id" required pattern="[a-zA-Z0-9_-]+" placeholder="my-awesome-game" value="${escapeHTML(g.id || '')}" ${isEdit?'readonly':''}></label><label class="field">Title *<input name="title" required placeholder="My Awesome Game" value="${escapeHTML(g.title || '')}"></label><label class="field">Type<select name="type"><option value="game" ${g.type!=='app'?'selected':''}>Game</option><option value="app" ${g.type==='app'?'selected':''}>Application</option></select></label><label class="field">Cover image path<input name="image" placeholder="assets/covers/my-game.svg" value="${escapeHTML(g.image || '')}"></label><label class="field">Developer<input name="developer" value="${escapeHTML(g.developer || '')}"></label><label class="field">Release year<input name="releaseYear" type="number" min="1970" max="2100" value="${escapeHTML(g.releaseYear || '')}"></label><label class="field">Genres (comma-separated)<input name="genres" value="${escapeHTML(genres)}" placeholder="Arcade, Platformer"></label><label class="field">Tags (comma-separated)<input name="tags" value="${escapeHTML(tags)}" placeholder="browser, action"></label><label class="field">Collection<input name="collection" value="${escapeHTML(g.collection || 'Arcade')}"></label><label class="field">Date added<input name="dateAdded" type="date" value="${escapeHTML(g.dateAdded || new Date().toISOString().slice(0,10))}"></label><label class="field">Launch type<select name="launchType"><option value="builtin" ${g.launchType==='builtin'?'selected':''}>Built-in GSN game</option><option value="url" ${!g.launchType||g.launchType==='url'?'selected':''}>External URL</option><option value="new-tab" ${g.launchType==='new-tab'?'selected':''}>Open in new tab</option><option value="iframe" ${g.launchType==='iframe'?'selected':''}>Embed in GSN (iframe)</option><option value="local-page" ${g.launchType==='local-page'?'selected':''}>Local page in this repo</option></select></label><label class="field">Launch URL / path<input name="launchUrl" required placeholder="https://example.com/game or games/my-game/index.html" value="${escapeHTML(g.launchUrl || '')}"></label><label class="field">Aliases (comma-separated)<input name="aliases" value="${escapeHTML(aliases)}"></label><label class="field">Open external URLs in new tab?<select name="openInNewTab"><option value="true" ${(g.openInNewTab!==false)?'selected':''}>Yes</option><option value="false" ${g.openInNewTab===false?'selected':''}>No (try embedded player)</option></select></label><label class="field full">Description<textarea name="description" placeholder="A short description">${escapeHTML(g.description || '')}</textarea></label><div class="form-actions"><button class="primary-button" type="submit">${isEdit?'Save changes':'Add game'}</button><button class="secondary-button" type="button" data-action="cancel-game-form">Cancel</button></div></form>`;
  }
  function renderFriends() {
    setTitle('Friends & account');
    $('#app').innerHTML = `${statusArea()}<main class="panel-page">${header('Friends & account')}<p class="crumb">Profile / Friends &amp; account</p><h2 class="panel-heading">Your account</h2><div class="settings-list"><div class="setting-row"><div><div>Profile name</div><div class="setting-help">${escapeHTML(state.profile.username)}</div></div><button class="small-button" data-action="edit-profile">Edit</button></div><div class="setting-row"><div><div>Account status</div><div class="setting-help">This is a local profile. GSN does not have an online account backend.</div></div><span>${escapeHTML(state.profile.status)}</span></div><div class="setting-row"><div><div>Friends</div><div class="setting-help">Demo-only friends list; it is not connected to real accounts.</div></div><span>0 online</span></div><button class="wide-action" data-route="chat"><span>Open GSN Chat demo</span><span>›</span></button></div><h2 class="panel-subheading" style="margin-top:36px">People you may know</h2><div class="manage-list" style="max-width:720px"><div class="manage-entry">${avatarHTML()}<div class="manage-entry-info"><strong>GSN Bot</strong><span>System profile · Demo contact</span></div><button data-route="chat">Message</button></div></div>${hints()}</main>`;
    applyTheme();
  }
  function renderMusic() {
    setTitle('GSN Music');
    $('#app').innerHTML = `${statusArea()}<main class="page-content">${header('GSN Music')}<p class="crumb">Music / While you play</p><h2 class="panel-heading">Music. While you play.</h2><p class="details-description">GSN can play a valid audio URL that you provide. No streaming service is connected and no tracks are bundled.</p><div class="manage-toolbar"><button class="primary-button" data-action="set-music-url">＋ Add audio URL</button><button class="secondary-button" data-action="music-play">▶ Play</button><button class="secondary-button" data-action="music-pause">Ⅱ Pause</button><button class="secondary-button" data-action="music-stop">■ Stop</button></div><div class="notice">Current audio source: ${state.musicUrl ? escapeHTML(state.musicUrl) : 'No audio source configured. Click “Add audio URL” and use an audio file URL you have permission to play.'}</div><div class="music-list"><div class="track"><button data-action="music-play">▶</button><strong>${state.musicUrl ? escapeHTML(state.musicUrl.split('/').pop().split('?')[0] || 'Custom track') : 'No track configured'}</strong><small>${state.musicUrl ? 'Custom audio' : 'Waiting for audio'}</small></div></div>${hints()}</main>`;
    applyTheme();
  }
  function renderChat() {
    setTitle('GSN Chat');
    $('#app').innerHTML = `${statusArea()}<main class="page-content">${header('GSN Chat')}<p class="crumb">Social / Local chat demo</p><div class="notice">Local demo only: messages are saved in this browser and are not sent to real friends.</div><div class="chat-layout"><aside class="chat-list"><button>GSN Bot<br><small>System messages</small></button><button data-action="clear-chat">Clear local chat</button></aside><section class="chat-thread"><div class="chat-messages" id="chat-messages">${state.messages.map(m=>`<div class="chat-bubble ${m.who==='You'?'own':''}"><strong>${escapeHTML(m.who)}</strong><br>${escapeHTML(m.text)}<br><small style="opacity:.6">${new Date(m.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small></div>`).join('')}</div><form class="chat-send" id="chat-form"><input name="message" placeholder="Type a message…" required maxlength="500" autocomplete="off"><button class="primary-button" type="submit">Send</button></form></section></div>${hints()}</main>`;
    applyTheme();
    const msg = $('#chat-messages'); if (msg) msg.scrollTop = msg.scrollHeight;
  }
  function renderMovies() {
    setTitle('Movies');
    $('#app').innerHTML = `${statusArea()}<main class="panel-page">${header('Movies')}<h2 class="panel-heading">Movies &amp; TV</h2><div class="empty-state" style="max-width:750px"><strong>No media catalog configured</strong><span>GSN Movies is a placeholder. Add your own links or connect a media catalog in a future version.</span></div>${hints()}</main>`;
    applyTheme();
  }
  function render(routeValue = route()) {
    closeOverlay();
    const parts = routeValue.split('/');
    const page = parts[0] || 'home';
    if (dataError && page !== 'manage') {
      // Continue with the offline starter set while showing the error inside the library.
    }
    switch (page) {
      case 'home': renderHome(); break;
      case 'library': renderLibrary(parts[1] || 'all'); break;
      case 'search': searchText = searchText || ''; renderLibrary('all'); setTimeout(() => $('#library-search')?.focus(), 0); break;
      case 'apps': renderLibrary('apps'); break;
      case 'cloud': renderLibrary('cloud'); break;
      case 'profile': renderProfile(); break;
      case 'personalization': renderPersonalization(); break;
      case 'settings': renderSettings(); break;
      case 'manage': renderManage(); break;
      case 'friends': renderFriends(); break;
      case 'music': renderMusic(); break;
      case 'chat': renderChat(); break;
      case 'movies': renderMovies(); break;
      case 'game': renderGameDetails(parts.slice(1).join('/')); break;
      default: renderHome();
    }
  }
  function openGame(id) {
    const game = getGame(id); if (!game) { toast('Game not found.'); return; }
    playSelectionSound(); navigate(`game/${encodeURIComponent(id)}`);
  }
  function toggleFavorite(id) {
    state.favorites = state.favorites.includes(id) ? state.favorites.filter(x => x !== id) : [id, ...state.favorites];
    persist(); toast(state.favorites.includes(id) ? 'Added to favorites.' : 'Removed from favorites.');
  }
  function launchGame(id) {
    const g = getGame(id); if (!g) return toast('Game not found.');
    playSelectionSound(); recordRecent(id);
    if (g.launchType === 'builtin' && g.launchUrl === 'snake') { startSnake(g); return; }
    const target = String(g.launchUrl || '').trim();
    if (!target || !validLaunchTarget(target, g.launchType)) {
      toast('This game does not have a valid launch URL yet. Update it in Manage Games.'); return;
    }
    if (/^https?:\/\//i.test(target) && (g.launchType === 'new-tab' || (g.openInNewTab !== false && g.launchType !== 'iframe'))) {
      const win = window.open(target, '_blank', 'noopener,noreferrer');
      if (win) toast(`Opening ${g.title} in a new tab.`);
      else toast('Your browser blocked the new tab. Allow pop-ups for this GitHub Pages site and try again.');
      return;
    }
    const targetUrl = resolveProjectPath(target);
    if (g.launchType === 'iframe' || g.launchType === 'local-page' || g.openInNewTab === false) {
      showOverlay(g.title, `<p class="muted" style="margin-top:0">Some websites do not allow embedding. If this game stays blank, edit its launch settings to open in a new tab.</p><iframe src="${escapeHTML(targetUrl)}" title="${escapeHTML(g.title)}" style="width:100%;height:min(65vh,620px);border:0;background:#111" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-downloads"></iframe><p><a href="${escapeHTML(targetUrl)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">Open this game in a new tab ↗</a></p>`);
    } else toast('That launch type is not supported in a browser.');
  }
  function validLaunchTarget(target, type) {
    if (type === 'builtin') return target === 'snake';
    if (/^https?:\/\//i.test(target)) return true;
    return /^(\.\/|\.\.\/|[a-zA-Z0-9_.-]+\/)/.test(target) && !target.includes('..//') && !target.toLowerCase().startsWith('javascript:');
  }
  function resolveProjectPath(target) {
    if (/^https?:\/\//i.test(target)) return target;
    return new URL(target.replace(/^\//, ''), document.baseURI).href;
  }
  function startSnake(game) {
    const body = `<div class="player-canvas-wrap"><p class="player-help">Use the arrow keys to move. Eat the red square. Don’t hit the walls or yourself.</p><canvas id="snake-canvas" width="400" height="400" aria-label="Snake game canvas"></canvas><p class="player-help">Arrow keys to move · Space to restart · Esc to close</p><div class="compact-buttons" style="justify-content:center"><button class="secondary-button" data-action="snake-restart">Restart</button><button class="secondary-button" data-action="close-overlay">Exit game</button></div></div>`;
    const wrap = showOverlay(game.title, body, 'snake-modal');
    const canvas = $('#snake-canvas', wrap), ctx = canvas.getContext('2d');
    const cells = 20, unit = canvas.width / cells;
    let snake = [{x:9,y:10},{x:8,y:10},{x:7,y:10}], dir = {x:1,y:0}, next = {x:1,y:0}, food = {x:15,y:10}, score = 0, over = false;
    const randFood = () => { let p; do { p={x:Math.floor(Math.random()*cells),y:Math.floor(Math.random()*cells)}; } while(snake.some(s=>s.x===p.x&&s.y===p.y)); return p; };
    const draw = () => {
      ctx.fillStyle='#0d141c';ctx.fillRect(0,0,400,400);
      ctx.strokeStyle='#1a2830';ctx.lineWidth=1;for(let n=0;n<=cells;n++){ctx.beginPath();ctx.moveTo(n*unit,0);ctx.lineTo(n*unit,400);ctx.stroke();ctx.beginPath();ctx.moveTo(0,n*unit);ctx.lineTo(400,n*unit);ctx.stroke();}
      ctx.fillStyle='#ff5961';ctx.fillRect(food.x*unit+3,food.y*unit+3,unit-6,unit-6);
      snake.forEach((s,i)=>{ctx.fillStyle=i===0?'#d5ffb1':'#80d742';ctx.fillRect(s.x*unit+2,s.y*unit+2,unit-4,unit-4);});
      ctx.fillStyle='#f4f4f4';ctx.font='bold 15px Arial';ctx.fillText(`SCORE ${score}`,12,22);
      if(over){ctx.fillStyle='#000b';ctx.fillRect(0,0,400,400);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 30px Arial';ctx.fillText('GAME OVER',200,188);ctx.font='16px Arial';ctx.fillText('Press Space or Restart',200,220);ctx.textAlign='left';}
    };
    const tick = () => {
      if(over)return;dir=next;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(head.x<0||head.y<0||head.x>=cells||head.y>=cells||snake.some((s,i)=>i<snake.length-1&&s.x===head.x&&s.y===head.y)){over=true;draw();return;}
      snake.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;food=randFood();}else snake.pop();draw();
    };
    const restart = () => {snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];dir={x:1,y:0};next={x:1,y:0};food=randFood();score=0;over=false;draw();};
    snakeKeyHandler = e => {
      if(!$('#active-overlay'))return;
      const keys={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
      if(keys[e.key]){e.preventDefault();const want=keys[e.key];if(want.x!==-dir.x||want.y!==-dir.y)next=want;}
      if(e.code==='Space'){e.preventDefault();restart();}
    };
    document.addEventListener('keydown',snakeKeyHandler);draw();snakeTimer=setInterval(tick,125);
    wrap.dataset.game='snake'; wrap._restart = restart;
  }
  function editProfile() {
    const p = state.profile;
    showOverlay('Edit profile', `<form id="profile-form" class="manage-form" style="margin:0;max-width:none"><label class="field full">Username<input name="username" required maxlength="28" value="${escapeHTML(p.username)}"></label><label class="field">Status<select name="status"><option ${p.status==='Online'?'selected':''}>Online</option><option ${p.status==='Away'?'selected':''}>Away</option><option ${p.status==='Offline'?'selected':''}>Offline</option></select></label><label class="field">Avatar image URL/path<input name="avatar" placeholder="assets/avatars/my-avatar.png" value="${escapeHTML(p.avatar)}"></label><label class="field full">Status message<textarea name="message" maxlength="130">${escapeHTML(p.message)}</textarea></label><div class="form-actions"><button class="primary-button" type="submit">Save profile</button><button class="secondary-button" type="button" data-action="close-overlay">Cancel</button></div></form>`);
  }
  function editHomeGroups() {
    const labels = {games:'Featured games row',customize:'Customize your Home panel',music:'GSN Music panel',chat:'GSN Chat panel'};
    showOverlay('Home groups', `<p class="muted">Choose which dashboard rows and panels are shown.</p><div class="settings-list">${Object.entries(labels).map(([key,label])=>`<div class="setting-row"><span>${label}</span><button class="toggle" role="switch" aria-checked="${!!state.homeGroups[key]}" data-action="group-toggle" data-key="${key}"></button></div>`).join('')}</div><p style="margin:20px 0 0"><button class="primary-button" data-action="close-overlay">Done</button></p>`);
  }
  function profileAppearance() {
    showOverlay('Profile appearance', `<p class="muted">Edit your avatar and banner appearance. These settings are saved locally.</p><label class="field">Avatar URL or project path<input id="appearance-avatar" value="${escapeHTML(state.profile.avatar)}" placeholder="assets/avatars/avatar.png"></label><div style="height:12px"></div><label class="field">Banner accent<select id="appearance-banner"><option value="blue">Blue</option><option value="green">Green</option><option value="purple">Purple</option></select></label><div class="form-actions" style="margin-top:18px"><button class="primary-button" data-action="save-profile-appearance">Save appearance</button></div>`);
  }
  function showKeyboard() {
    const letters = ['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','-','_'];
    showOverlay('On-screen keyboard', `<p class="muted">Choose a key to add it to your GSN search.</p><div class="keyboard-grid">${letters.map(k=>`<button data-action="keyboard-key" data-key="${k}">${k}</button>`).join('')}<button class="wide" data-action="keyboard-key" data-key="SPACE">Space</button><button class="wide" data-action="keyboard-key" data-key="BACKSPACE">⌫ Backspace</button><button class="wide primary-button" data-action="keyboard-key" data-key="ENTER">Search ↵</button></div>`);
  }
  function openGameOptions(id) {
    const g = getGame(id); if (!g) return;
    showOverlay('Game options', `<div class="settings-list"><button class="wide-action" data-action="launch" data-id="${escapeHTML(id)}"><span>▶ Play / Launch</span><span>›</span></button><button class="wide-action" data-action="favorite" data-id="${escapeHTML(id)}"><span>${state.favorites.includes(id)?'★ Remove from favorites':'☆ Add to favorites'}</span><span>›</span></button><button class="wide-action" data-action="edit-game-from-details" data-id="${escapeHTML(id)}"><span>Edit in Manage Games</span><span>›</span></button><button class="wide-action" data-action="copy-game-id" data-id="${escapeHTML(id)}"><span>Copy game ID</span><span>›</span></button></div>`);
  }
  function fileDownload(filename, text, type = 'application/json') {
    const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 800);
  }
  function exportGames() { fileDownload('games.json', JSON.stringify(allGames().map(g => ({...g, favorite:state.favorites.includes(g.id)})), null, 2)); toast('Game library JSON exported. Upload or copy it into data/games.json in your repository.'); }
  function parseGameRecords(value) {
    if (!Array.isArray(value)) throw new Error('JSON needs to be an array of game records.');
    const seen = new Set();
    return value.filter((g,i) => {
      if (!g || typeof g !== 'object' || typeof g.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(g.id) || typeof g.title !== 'string' || !g.title.trim()) { console.warn(`GSN skipped invalid game record at index ${i}.`); return false; }
      if (seen.has(g.id)) { console.warn(`GSN skipped duplicate ID: ${g.id}`); return false; }
      seen.add(g.id);
      g.type = g.type === 'app' ? 'app' : 'game';
      g.image = safeImage(g.image);
      if (g.launchUrl && !validLaunchTarget(String(g.launchUrl), g.launchType || 'url')) { console.warn(`GSN invalid launch target for ${g.id}.`); g.launchUrl = ''; }
      return true;
    });
  }
  function importGames(file) {
    const reader = new FileReader();
    reader.onerror = () => toast('Could not read that file.');
    reader.onload = () => {
      try {
        const records = parseGameRecords(JSON.parse(String(reader.result)));
        const builtInIds = new Set(builtinGames.map(g=>g.id));
        const existing = new Map(allGames().map(g=>[g.id,g]));
        records.forEach(g => {
          if (builtInIds.has(g.id)) state.overrides[g.id] = g;
          else { const index=state.customGames.findIndex(x=>x.id===g.id); if(index>=0)state.customGames[index]=g;else state.customGames.push(g); }
          state.deleted = state.deleted.filter(id=>id!==g.id);
          if (g.favorite && !state.favorites.includes(g.id)) state.favorites.push(g.id);
        });
        persist(); render('manage'); toast(`Imported ${records.length} game records.`);
      } catch (err) { toast(`Import failed: ${err.message}`); }
    };
    reader.readAsText(file);
  }
  function exportSettings() { fileDownload('gsn-settings.json', JSON.stringify({ version:1, state }, null, 2)); toast('Settings exported.'); }
  function importSettings(file) {
    const reader = new FileReader(); reader.onload = () => {
      try { const val=JSON.parse(String(reader.result)); const incoming=val.state||val; if(!incoming||typeof incoming!=='object')throw new Error('Invalid settings file'); state={...structuredCloneSafe(DEFAULT_STATE),...incoming,profile:{...DEFAULT_STATE.profile,...incoming.profile},settings:{...DEFAULT_STATE.settings,...incoming.settings},homeGroups:{...DEFAULT_STATE.homeGroups,...incoming.homeGroups}};persist();render('settings');toast('Settings imported.'); }
      catch(err){toast(`Settings import failed: ${err.message}`);}
    }; reader.onerror=()=>toast('Could not read that settings file.'); reader.readAsText(file);
  }
  function newGame() { const slot=$('#game-form-slot'); if (slot) { slot.innerHTML=gameForm(); slot.scrollIntoView({behavior:state.settings.reduceMotion?'auto':'smooth',block:'start'}); $('input[name="id"]',slot)?.focus(); } }
  function editGame(id) { const g=getGame(id); if (!g) return; const slot=$('#game-form-slot'); if(slot){slot.innerHTML=gameForm(g); slot.scrollIntoView({behavior:state.settings.reduceMotion?'auto':'smooth',block:'start'});} }
  function saveGameFromForm(form) {
    const fd=new FormData(form); const id=String(fd.get('id')||'').trim(); const title=String(fd.get('title')||'').trim();
    if(!id||!title||!/^[a-zA-Z0-9_-]+$/.test(id)){toast('Use a unique game ID with letters, numbers, dashes, or underscores, and add a title.');return;}
    const g={id,title,type:fd.get('type')==='app'?'app':'game',image:safeImage(fd.get('image')),developer:String(fd.get('developer')||'').trim(),releaseYear:fd.get('releaseYear')?Number(fd.get('releaseYear')):null,genres:splitCSV(fd.get('genres')),tags:splitCSV(fd.get('tags')),collection:String(fd.get('collection')||'').trim(),dateAdded:String(fd.get('dateAdded')||new Date().toISOString().slice(0,10)),launchType:String(fd.get('launchType')||'url'),launchUrl:String(fd.get('launchUrl')||'').trim(),openInNewTab:fd.get('openInNewTab')==='true',aliases:splitCSV(fd.get('aliases')),description:String(fd.get('description')||'').trim()};
    if(!validLaunchTarget(g.launchUrl,g.launchType)){toast('Launch URL must be https/http or a project-relative path.');return;}
    if(editingGameId){const builtIn=builtinGames.some(x=>x.id===editingGameId);if(builtIn)state.overrides[editingGameId]=g;else{const i=state.customGames.findIndex(x=>x.id===editingGameId);if(i>=0)state.customGames[i]=g;else state.customGames.push(g);}}
    else {if(allGames().some(x=>x.id===id)){toast('That ID already exists. Choose a unique ID.');return;}state.customGames.push(g);}
    state.deleted=state.deleted.filter(x=>x!==id);persist();render('manage');toast(editingGameId?'Game updated.':'Game added to your local library. Export JSON to commit it to GitHub.');editingGameId='';
  }
  function splitCSV(value) { return String(value||'').split(',').map(x=>x.trim()).filter(Boolean); }
  function deleteGame(id) {
    const g=getGame(id);if(!g)return;
    if(!confirm(`Delete “${g.title}” from this browser's GSN library? This does not delete files from your GitHub repository.`))return;
    if(builtinGames.some(x=>x.id===id)){state.deleted.push(id);delete state.overrides[id];}else state.customGames=state.customGames.filter(x=>x.id!==id);
    state.favorites=state.favorites.filter(x=>x!==id);state.recents=state.recents.filter(x=>x.id!==id);persist();render('manage');toast('Game removed from the local library.');
  }
  function clearRecents() { if(confirm('Clear all recently played history?')){state.recents=[];persist();render();toast('Recent history cleared.');} }
  function resetSettings() {
    if(!confirm('Reset personalization, profile, and launcher settings? Your game library and data/games.json will not be deleted.'))return;
    const keep={favorites:state.favorites,recents:state.recents,overrides:state.overrides,customGames:state.customGames,deleted:state.deleted,customCollections:state.customCollections};
    state={...structuredCloneSafe(DEFAULT_STATE),...keep};persist();render('settings');toast('Settings reset.');
  }
  function setMusicUrl() {
    const url=prompt('Paste a direct https:// audio file URL or a path to an audio file in your repository: ',state.musicUrl||'');
    if(url===null)return;
    if(url&&!validLaunchTarget(url,'url'))return toast('Use an https/http URL or a relative project path.');
    state.musicUrl=url.trim();persist();render('music');
  }
  function musicPlay() {
    if(!state.musicUrl)return toast('Add an audio URL first.');
    try { if(musicAudio) musicAudio.pause();musicAudio=new Audio(resolveProjectPath(state.musicUrl));musicAudio.volume=Math.max(0,Math.min(1,state.settings.volume/100));musicAudio.onerror=()=>toast('This audio URL could not be played. Check the URL and file permissions.');musicAudio.play().then(()=>toast('Playing your audio source.')).catch(()=>toast('Playback was blocked or the audio URL is invalid.')); }
    catch { toast('Could not start audio playback.'); }
  }
  function handleAction(target) {
    const action=target.dataset.action,id=target.dataset.id,key=target.dataset.key;
    switch(action){
      case 'close-overlay': closeOverlay();break;
      case 'back': { if(overlayOpen){closeOverlay();break;} if(history.length>1)history.back();else navigate('home');break; }
      case 'open-game': openGame(id);break;
      case 'launch': closeOverlay(); launchGame(id);break;
      case 'favorite': { const hadOverlay=overlayOpen; if(hadOverlay)closeOverlay(); toggleFavorite(id); if(route().startsWith('game/'))renderGameDetails(id);else if(route()==='profile')renderProfile();else if(route()==='manage')renderManage();else render();break; }
      case 'game-options': openGameOptions(id);break;
      case 'edit-game-from-details': closeOverlay(); navigate('manage'); setTimeout(()=>editGame(id),0);break;
      case 'copy-game-id': navigator.clipboard?.writeText(id).then(()=>toast(`Copied ${id}`)).catch(()=>toast(`Game ID: ${id}`));break;
      case 'edit-profile': editProfile();break;
      case 'store': toast('GSN Store is a placeholder—purchases are not connected.');break;
      case 'keyboard': showKeyboard();break;
      case 'keyboard-key': {
        const k=target.dataset.key;
        if(k==='ENTER'){closeOverlay();renderLibrary(currentLibraryMode);break;}
        if(k==='BACKSPACE')searchText=searchText.slice(0,-1);else searchText+=k==='SPACE'?' ':k;
        closeOverlay();renderLibrary(currentLibraryMode);const input=$('#library-search');if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}break;
      }
      case 'clear-search': searchText='';renderLibrary(currentLibraryMode);$('#library-search')?.focus();break;
      case 'clear-filters': searchText='';collectionMode='All collections';sortMode='Name';renderLibrary(currentLibraryMode);break;
      case 'toggle-view': state.settings.defaultListView=!state.settings.defaultListView;persist();renderLibrary(currentLibraryMode);break;
      case 'load-more': libraryPageSize += 120; preserveLibraryPageSize = true; renderLibrary(currentLibraryMode); preserveLibraryPageSize = false; break;
      case 'library-mode': searchText='';collectionMode='All collections';renderLibrary(target.dataset.mode);break;
      case 'background-mode': state.backgroundMode=target.dataset.mode;persist();renderPersonalization();toast(`Background set to ${target.textContent.replace('✓','').trim()}.`);break;
      case 'accent': state.accent=target.dataset.color;persist();render(route());break;
      case 'theme': state.theme=target.value;state.accent=THEMES[state.theme][2];persist();render(route());break;
      case 'custom-accent': state.accent=target.value;persist();break;
      case 'setting-toggle': state.settings[key]=!state.settings[key];persist();render('settings');break;
      case 'default-view': state.settings.defaultListView=target.value==='list';persist();break;
      case 'volume': state.settings.volume=Number(target.value);persist();const help=$('.setting-help',target.parentElement);if(help)help.textContent=`Selection sound volume: ${state.settings.volume}%`;break;
      case 'background-url': break;
      case 'home-groups': editHomeGroups();break;
      case 'group-toggle': state.homeGroups[key]=!state.homeGroups[key];persist();editHomeGroups();break;
      case 'profile-appearance': profileAppearance();break;
      case 'save-profile-appearance': {const v=$('#appearance-avatar')?.value.trim();if(v&&!validImagePath(v)){toast('Use an https/http image URL or a relative project path.');break;}state.profile.avatar=v||'';persist();closeOverlay();render('personalization');toast('Profile appearance saved.');break;}
      case 'show-favorites': collectionMode='Favorites';searchText='';navigate('library');break;
      case 'new-game': newGame();break;
      case 'cancel-game-form': editingGameId='';$('#game-form-slot').innerHTML='';break;
      case 'edit-game': editGame(id);break;
      case 'delete-game': deleteGame(id);break;
      case 'export-games': exportGames();break;
      case 'import-games': $('#import-file')?.click();break;
      case 'reset-game-library': if(confirm('Remove local game additions, overrides, and deletion markers? This returns the library to data/games.json.')){state.overrides={};state.customGames=[];state.deleted=[];persist();render('manage');toast('Local game changes reset.');}break;
      case 'export-settings': exportSettings();break;
      case 'import-settings': {const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{if(i.files?.[0])importSettings(i.files[0]);};i.click();break;}
      case 'clear-recents': clearRecents();break;
      case 'reset-settings': resetSettings();break;
      case 'set-music-url': setMusicUrl();break;
      case 'music-play': musicPlay();break;
      case 'music-pause': if(musicAudio)musicAudio.pause();else toast('No track is playing.');break;
      case 'music-stop': if(musicAudio){musicAudio.pause();musicAudio.currentTime=0;}else toast('No track is playing.');break;
      case 'clear-chat': if(confirm('Clear local demo messages?')){state.messages=[];persist();render('chat');}break;
      case 'snake-restart': $('#active-overlay')?._restart?.();break;
    }
  }

  document.addEventListener('click', e => {
    const routeButton=e.target.closest('[data-route]');
    if(routeButton){e.preventDefault();closeOverlay();navigate(routeButton.dataset.route);return;}
    const actionButton=e.target.closest('[data-action]');
    if(actionButton){
      // Inputs and selects use their native interactions; their change/input events handle state.
      if(['INPUT','SELECT','TEXTAREA'].includes(actionButton.tagName)) return;
      e.preventDefault();handleAction(actionButton);
    }
  });
  document.addEventListener('change', e => {
    const el=e.target;
    if(el.matches('[data-action="sort"]')){sortMode=el.value;renderLibrary(currentLibraryMode);}
    else if(el.matches('[data-action="collection"]')){collectionMode=el.value;renderLibrary(currentLibraryMode);}
    else if(el.matches('[data-action="theme"]')){state.theme=el.value;state.accent=THEMES[state.theme][2];persist();render(route());}
    else if(el.matches('[data-action="default-view"]')){state.settings.defaultListView=el.value==='list';persist();}
    else if(el.matches('[data-action="custom-accent"]')){state.accent=el.value;persist();}
    else if(el.matches('[data-action="background-url"]')){const val=el.value.trim();if(val&&!validImagePath(val)){toast('Image path must be https/http or a relative asset path.');return;}state.backgroundImage=val;state.backgroundMode='custom';persist();renderPersonalization();}
    else if(el.matches('[data-action="background-file"]')){
      const file=el.files?.[0];if(!file)return;if(!file.type.startsWith('image/'))return toast('Choose an image file.');if(file.size>2.5*1024*1024)return toast('Choose an image smaller than 2.5 MB so browser storage does not fill up.');const reader=new FileReader();reader.onload=()=>{state.backgroundImage=String(reader.result);state.backgroundMode='custom';persist();renderPersonalization();toast('Custom background saved in this browser.');};reader.onerror=()=>toast('Could not read that image.');reader.readAsDataURL(file);
    } else if(el.matches('[data-action="volume"]')){state.settings.volume=Number(el.value);persist();const help=$('.setting-help',el.parentElement);if(help)help.textContent=`Selection sound volume: ${state.settings.volume}%`;}
    else if(el.matches('#import-file')){if(el.files?.[0])importGames(el.files[0]);el.value='';}
  });
  document.addEventListener('input', e => {
    const el=e.target;
    if(el.matches('[data-action="search-input"]')){
      const cursor=el.selectionStart;searchText=el.value;const routeNow=route();
      // Update the cards and count without rebuilding the input on each keystroke.
      const grid=$('.game-grid'),count=$('.results-count');const result=filteredGames(currentLibraryMode);if(grid)grid.innerHTML=renderGameCards(result.slice(0,libraryPageSize),state.settings.defaultListView);if(count)count.textContent=`${result.length.toLocaleString()} ITEMS`;const more=$('[data-action="load-more"]');if(more)more.closest('div')?.remove();if(result.length>libraryPageSize){const load=document.createElement('div');load.style.cssText='text-align:center;padding:8px 0 35px';load.innerHTML=`<button class="secondary-button" data-action="load-more">Load more games (${Math.min(libraryPageSize,result.length)} of ${result.length})</button>`;grid?.after(load);}
      return;
    }
    if(el.matches('[data-action="volume"]')){state.settings.volume=Number(el.value);const help=$('.setting-help',el.parentElement);if(help)help.textContent=`Selection sound volume: ${state.settings.volume}%`;persist();}
  });
  document.addEventListener('submit', e => {
    const form=e.target;
    if(form.id==='game-form'){e.preventDefault();saveGameFromForm(form);}
    else if(form.id==='profile-form'){
      e.preventDefault();const fd=new FormData(form),avatar=String(fd.get('avatar')||'').trim();if(avatar&&!validImagePath(avatar)){toast('Use an https/http image URL or a relative project path.');return;}state.profile={username:String(fd.get('username')).trim()||'Player One',status:String(fd.get('status')||'Online'),message:String(fd.get('message')||'').trim(),avatar};persist();closeOverlay();render(route());toast('Profile updated.');
    }
    else if(form.id==='chat-form'){
      e.preventDefault();const fd=new FormData(form),message=String(fd.get('message')||'').trim();if(!message)return;state.messages.push({who:'You',text:message,time:Date.now()});persist();render('chat');
    }
  });
  document.addEventListener('keydown', e => {
    if(overlayOpen){if(e.key==='Escape'){e.preventDefault();closeOverlay();}return;}
    const target=e.target;
    if(target.matches('input,textarea,select,[contenteditable="true"]')){
      if(e.key==='Escape'){target.blur();}
      return;
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'||e.key==='/') {e.preventDefault();searchText='';navigate('search');setTimeout(()=>$('#library-search')?.focus(),20);return;}
    if(e.key==='Escape'){e.preventDefault();if(route().startsWith('game/'))navigate('library');else navigate('home');return;}
    if(e.key==='Backspace'){e.preventDefault();if(route().startsWith('library')||route()==='search'){searchText=searchText.slice(0,-1);renderLibrary(currentLibraryMode);}return;}
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
      const cards=$$('.game-card, .feature-tile, .recent-card');if(!cards.length)return;
      const active=document.activeElement;let index=cards.indexOf(active);if(index<0)index=0;else index=(index+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+cards.length)%cards.length;e.preventDefault();cards[index].focus();
    }
  });
  window.addEventListener('hashchange', () => render());
  window.addEventListener('storage', e => {if(e.key===STORAGE_KEY){state=loadState();render();}});

  async function init() {
    applyTheme();
    try {
      const response = await fetch('data/games.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Could not load data/games.json (HTTP ${response.status})`);
      const raw = await response.json();
      builtinGames = parseGameRecords(raw);
    } catch (err) {
      dataError = err.message;
      console.error('GSN library data failed to load:', err);
      builtinGames = [{id:'snake-gsn',title:'Snake: GSN Arcade',type:'game',image:'assets/covers/snake.svg',description:'A tiny arcade classic built into GSN.',genres:['Arcade'],tags:['offline'],collection:'Arcade',dateAdded:'2026-10-17',launchType:'builtin',launchUrl:'snake',openInNewTab:false}];
    }
    if (!location.hash) history.replaceState(null,'',`${location.pathname}${location.search}#home`);
    render();
    if (dataError) toast('The JSON library could not load. If you opened index.html directly, upload to GitHub Pages and try again.');
  }
  init();
})();
