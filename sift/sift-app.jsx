// Sift — main app: library source (demo or real folder), session state, keyboard flow, tweaks.
const { useState: useS, useEffect: useFx, useRef: useRf, useMemo: useM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mechanic": "full-bleed",
  "density": "comfortable",
  "labels": "verbose",
  "theme": "black",
  "accent": "#C792EA"
}/*EDITMODE-END*/;

const ALBUMS = window.SIFT_DATA.albums;
const FREE_LIMIT = 25;
const FOLDERS_KEY = 'sift-desktop-folders-v1';
const PRO_KEY = 'sift-desktop-pro-v1';
const AUTH_KEY = 'sift-desktop-auth-v1';
function loadFolders() {
  try { const r = localStorage.getItem(FOLDERS_KEY); if (r) { const a = JSON.parse(r); if (Array.isArray(a) && a.length) return a; } } catch (e) {}
  return ALBUMS.map(function (a) { return { id: a.id, name: a.name }; });
}
function loadPro() { try { return localStorage.getItem(PRO_KEY) === '1'; } catch (e) { return false; } }
function loadAuth() { try { const r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
const DEMO_LIB = {
  source: 'demo', name: 'Sample import', handle: null,
  items: window.SIFT_DATA.items, allPhotos: window.SIFT_DATA.allPhotos
};

function sessionKey(lib) {
  return lib.source === 'demo' ? 'sift-session-v1' : 'sift-session-folder:' + lib.name;
}
function freshSession(lib) {
  return { decisions: {}, queue: lib.items.map(function (i) { return i.id; }), index: 0, finished: false, deleted: [], history: [] };
}
function loadSession(lib) {
  try {
    const raw = localStorage.getItem(sessionKey(lib));
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.queue) {
        const valid = {};
        lib.items.forEach(function (i) { valid[i.id] = 1; });
        const queue = s.queue.filter(function (id) { return valid[id]; });
        if (queue.length) {
          return Object.assign(freshSession(lib), s, { queue: queue, index: Math.min(s.index || 0, queue.length), history: [] });
        }
      }
    }
  } catch (e) { /* ignore */ }
  return freshSession(lib);
}

function computeStats(s, lib) {
  let kept = 0, archived = 0, trashed = 0, later = 0, decided = 0;
  lib.allPhotos.forEach(function (p) {
    if (s.deleted.indexOf(p.id) >= 0) { decided++; return; }
    const d = s.decisions[p.id];
    if (!d) return;
    decided++;
    if (d.verdict === 'keep') kept++;
    else if (d.verdict === 'archive') archived++;
    else if (d.verdict === 'trash') trashed++;
    else later++;
  });
  return { kept: kept, archived: archived, trashed: trashed, later: later, remaining: lib.allPhotos.length - decided };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lib, setLib] = useS(DEMO_LIB);
  const [s, setS] = useS(function () { return loadSession(DEMO_LIB); });
  const [folders, setFolders] = useS(loadFolders);
  const [pro, setPro] = useS(loadPro);
  const [auth, setAuth] = useS(loadAuth);
  const [settingsOpen, setSettingsOpen] = useS(false);
  const [loginOpen, setLoginOpen] = useS(false);
  const [payOpen, setPayOpen] = useS(false);
  const [dragging, setDragging] = useS(false);
  const [dropTarget, setDropTarget] = useS(null);
  const [exiting, setExiting] = useS(null);
  const [applying, setApplying] = useS(null);
  const [applied, setApplied] = useS(null);
  const exitingRef = useRf(false);
  const keyRef = useRf(null);
  const dirInputRef = useRf(null);

  const ITEMS_BY_ID = useM(function () {
    const m = {};
    lib.items.forEach(function (i) { m[i.id] = i; });
    return m;
  }, [lib]);

  // Persist session (per library)
  useFx(function () {
    try { localStorage.setItem(sessionKey(lib), JSON.stringify(s)); } catch (e) { /* ignore */ }
  }, [s, lib]);

  useFx(function () { try { localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders)); } catch (e) {} }, [folders]);
  useFx(function () { try { localStorage.setItem(PRO_KEY, pro ? '1' : '0'); } catch (e) {} }, [pro]);
  useFx(function () { try { if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} }, [auth]);

  const folderCounts = useM(function () {
    const c = {};
    lib.allPhotos.forEach(function (p) {
      const d = s.decisions[p.id];
      if (d && d.verdict === 'keep' && d.album && d.album !== 'keep' && d.album !== 'library') c[d.album] = (c[d.album] || 0) + 1;
    });
    return c;
  }, [s.decisions, lib]);

  const folderName = useM(function () {
    const m = {};
    folders.forEach(function (f) { m[f.id] = f.name; });
    return m;
  }, [folders]);

  function addFolder(name) { const id = 'f' + Date.now().toString(36); setFolders(function (p) { return p.concat([{ id: id, name: name }]); }); return id; }
  function renameFolder(id, name) { setFolders(function (p) { return p.map(function (f) { return f.id === id ? { id: f.id, name: name } : f; }); }); }
  function deleteFolder(id) {
    setFolders(function (p) { return p.filter(function (f) { return f.id !== id; }); });
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      Object.keys(d).forEach(function (pid) { if (d[pid] && d[pid].verdict === 'keep' && d[pid].album === id) d[pid] = { verdict: 'keep', album: 'keep' }; });
      return Object.assign({}, prev, { decisions: d });
    });
  }
  function signIn(u) { setAuth(u); setLoginOpen(false); }
  function signOut() { setAuth(null); }
  function subscribe() { setPro(true); setPayOpen(false); }
  function unsubscribe() { setPro(false); }

  // Apply theme tweaks
  useFx(function () {
    document.body.dataset.theme = t.theme;
    document.body.style.setProperty('--accent', t.accent);
  }, [t.theme, t.accent]);

  const item = !s.finished && s.index < s.queue.length ? ITEMS_BY_ID[s.queue[s.index]] : null;
  const stats = computeStats(s, lib);
  const verbose = t.labels === 'verbose';

  // Preload the next item's full image only (one decode ahead, not four)
  useFx(function () {
    const it = ITEMS_BY_ID[s.queue[s.index + 1]];
    const ph = it && it.photos[0];
    if (ph && ph.type !== 'video') { const im = new Image(); im.src = ph.src; }
  }, [s.index, s.queue, ITEMS_BY_ID]);

  // ---- Library source ----
  function adoptLib(newLib) {
    if (!newLib.items.length) { alert('No images found in that folder (already-sorted Sorted/ and _Trash/ folders are skipped).'); return; }
    exitingRef.current = false;
    setExiting(null); setApplied(null); setApplying(null);
    setLib(newLib);
    setS(loadSession(newLib));
  }
  async function openFolder() {
    if (window.SiftFS.supported) {
      try {
        adoptLib(await window.SiftFS.pickFolder());
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        // SecurityError etc (e.g. blocked in embedded view) → fall back to read-only picker
      }
    }
    if (dirInputRef.current) dirInputRef.current.click();
  }
  function onDirInput(e) {
    const fl = e.target.files;
    if (fl && fl.length) adoptLib(window.SiftFS.fromFileList(fl));
    e.target.value = '';
  }

  // ---- Destinations ----
  function destFor(p) {
    const d = s.decisions[p.id];
    if (!d) return '';
    if (d.verdict === 'trash') return '_Trash';
    if (d.verdict === 'archive') return 'Archive';
    if (d.album && d.album !== 'keep' && d.album !== 'library' && folderName[d.album]) return 'Sorted/' + folderName[d.album];
    return 'Sorted/Keep';
  }
  function buildMoves() {
    return lib.allPhotos.filter(function (p) {
      const d = s.decisions[p.id];
      return d && (d.verdict === 'keep' || d.verdict === 'trash' || d.verdict === 'archive') && s.deleted.indexOf(p.id) < 0;
    }).map(function (p) { return { photo: p, dest: destFor(p) }; });
  }
  async function applyToDisk() {
    const moves = buildMoves();
    if (!moves.length || !lib.handle) return;
    setApplying({ done: 0, total: moves.length });
    const res = await window.SiftFS.applyMoves(lib.handle, moves, function (d, tot) { setApplying({ done: d, total: tot }); });
    setApplying(null);
    setApplied(res);
  }
  function downloadScript() {
    const moves = buildMoves();
    if (!moves.length) return;
    window.SiftFS.downloadText(window.SiftFS.buildBatScript(moves), 'sift-organize.bat');
  }

  // ---- Decisions ----
  function commit(map, kind) {
    if (!item || exitingRef.current) return;
    exitingRef.current = true;
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      const prevEntry = {};
      Object.keys(map).forEach(function (pid) { prevEntry[pid] = prev.decisions[pid] || null; d[pid] = map[pid]; });
      const h = prev.history.concat([{ index: prev.index, queue: prev.queue, prev: prevEntry }]).slice(-60);
      return Object.assign({}, prev, { decisions: d, history: h });
    });
    setExiting(kind);
    setTimeout(function () {
      setS(function (prev) { return Object.assign({}, prev, { index: prev.index + 1 }); });
      setExiting(null);
      exitingRef.current = false;
    }, 170);
  }

  function decideAll(verdict, album) {
    if (!item) return;
    const map = {};
    item.photos.forEach(function (p) {
      if (verdict === 'keep') map[p.id] = { verdict: 'keep', album: album || 'keep' };
      else map[p.id] = { verdict: verdict };
    });
    commit(map, verdict === 'archive' ? 'keep' : verdict);
  }
  function keepInto(folderId) {
    if (!item || item.kind === 'stack') return;
    commit({ [item.photos[0].id]: { verdict: 'keep', album: folderId } }, 'keep');
  }
  function archiveItem() { decideAll('archive'); }
  function pickWinner(i) {
    if (!item) return;
    const map = {};
    item.photos.forEach(function (p, j) {
      map[p.id] = j === i ? { verdict: 'keep', album: 'keep' } : { verdict: 'trash' };
    });
    commit(map, 'keep');
  }
  function undo() {
    if (exitingRef.current) return;
    setS(function (prev) {
      if (!prev.history.length) return prev;
      const h = prev.history.slice();
      const e = h.pop();
      const d = Object.assign({}, prev.decisions);
      Object.keys(e.prev).forEach(function (pid) { if (e.prev[pid]) d[pid] = e.prev[pid]; else delete d[pid]; });
      return Object.assign({}, prev, { decisions: d, history: h, index: e.index, queue: e.queue, finished: false });
    });
  }
  function wrapUp() { setS(function (prev) { return Object.assign({}, prev, { finished: true }); }); }
  function jumpTo(qi) {
    if (exitingRef.current) return;
    setS(function (prev) {
      const i = Math.max(0, Math.min(qi, prev.queue.length - 1));
      return Object.assign({}, prev, { index: i, finished: false });
    });
  }
  function resume() { setS(function (prev) { return Object.assign({}, prev, { finished: false }); }); }
  function reviewSkipped() {
    setS(function (prev) {
      const laterItems = lib.items.filter(function (it) {
        return it.photos.some(function (p) { const d = prev.decisions[p.id]; return d && d.verdict === 'later'; });
      }).map(function (it) { return it.id; });
      const d = Object.assign({}, prev.decisions);
      laterItems.forEach(function (id) { ITEMS_BY_ID[id].photos.forEach(function (p) { delete d[p.id]; }); });
      return Object.assign({}, prev, { decisions: d, queue: laterItems, index: 0, finished: false, history: [] });
    });
  }
  function confirmDelete(ids) {
    setS(function (prev) { return Object.assign({}, prev, { deleted: prev.deleted.concat(ids), history: [] }); });
  }
  function keepInstead(pid) {
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      d[pid] = { verdict: 'keep', album: 'keep' };
      return Object.assign({}, prev, { decisions: d });
    });
  }
  function startOver() {
    setS(freshSession(lib));
    setApplied(null);
    setExiting(null);
    exitingRef.current = false;
  }

  // Keyboard — single listener, fresh handler via ref
  keyRef.current = function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (settingsOpen || loginOpen || payOpen) { if (e.key === 'Escape') { setSettingsOpen(false); setLoginOpen(false); if (!locked) setPayOpen(false); } return; }
    const k = e.key;
    if (k === 'z' || k === 'Z' || k === 'Backspace') { e.preventDefault(); undo(); return; }
    if (!item || locked) return;
    const isStack = item.kind === 'stack';
    if (k === 'ArrowRight') { e.preventDefault(); if (!isStack) decideAll('keep', 'keep'); }
    else if (k === 'ArrowLeft') { e.preventDefault(); if (!isStack) decideAll('trash'); }
    else if (k === 'ArrowDown') { e.preventDefault(); decideAll('later'); }
    else if (isStack && k >= '1' && k <= String(item.photos.length)) { pickWinner(Number(k) - 1); }
    else if (isStack && (k === 'a' || k === 'A')) { decideAll('keep', 'keep'); }
    else if (isStack && (k === 'x' || k === 'X')) { decideAll('trash'); }
    else if (!isStack && (k === 'e' || k === 'E')) { archiveItem(); }
    else if (!isStack && k >= '1' && k <= '9') {
      const f = folders[Number(k) - 1];
      if (f) keepInto(f.id);
    }
  };
  useFx(function () {
    const fn = function (e) { if (keyRef.current) keyRef.current(e); };
    window.addEventListener('keydown', fn);
    return function () { window.removeEventListener('keydown', fn); };
  }, []);

  const isStack = item && item.kind === 'stack';
  const decided = lib.allPhotos.length - stats.remaining;
  const locked = !pro && !!item && decided >= FREE_LIMIT;

  // Drag-to-folder handlers
  function onDragStart() { setDragging(true); }
  function onDragEnd() { setDragging(false); setDropTarget(null); }

  return (
    <div className="desktop">
      <div className="menubar">
        <div className="mb-left">
          <span className="mb-logo">◈</span>
          <span className="mb-app">Sift</span>
          <span className="mb-item">File</span>
          <span className="mb-item">Edit</span>
          <span className="mb-item">View</span>
          <span className="mb-item">Help</span>
        </div>
        <div className="mb-right">
          {auth ? <span className="mb-item">{auth.email}</span> : null}
          <span className="mb-item">Mon 9:41</span>
        </div>
      </div>

      <div className="window">
        <div className="titlebar">
          <div className="traffic"><span className="tl red"></span><span className="tl amber"></span><span className="tl green"></span></div>
          <div className="title-text">Sift — Picture Organizer</div>
          <div className="title-right"></div>
        </div>

        <div className="app">
          <input ref={dirInputRef} type="file" webkitdirectory="" multiple style={{ display: 'none' }} onChange={onDirInput} />
          <TopBar
            lib={lib} decisions={s.decisions} deleted={s.deleted} currentItem={item} stats={stats}
            onWrapUp={wrapUp} onOpenFolder={openFolder} finished={!item}
            pro={pro} used={decided} limit={FREE_LIMIT} auth={auth}
            onSettings={function () { setSettingsOpen(true); }}
            onAccount={function () { if (auth) setSettingsOpen(true); else setLoginOpen(true); }}
            onPlus={function () { setPayOpen(true); }}
          />
          {item ? (
            <React.Fragment>
              <div className="work">
                <main className="stage" data-screen-label="Review">
                  {isStack
                    ? <StackCompare item={item} exiting={exiting} onPick={pickWinner} />
                    : <PhotoView item={item} mechanic={t.mechanic} exiting={exiting} density={t.density} onDragStart={onDragStart} onDragEnd={onDragEnd} />}
                  {locked && <div className="gate-veil"></div>}
                </main>
                <FolderRail
                  folders={folders} counts={folderCounts} dragging={dragging} dropTarget={dropTarget} isStack={isStack}
                  onAssign={keepInto} onArchive={archiveItem} onTrash={function () { decideAll('trash'); }} onKeepGeneral={function () { decideAll('keep', 'keep'); }}
                  onAddFolder={addFolder} onManage={function () { setSettingsOpen(true); }} setDropTarget={setDropTarget}
                />
              </div>
              {t.density === 'comfortable' && <Filmstrip queue={s.queue} index={s.index} itemsById={ITEMS_BY_ID} decisions={s.decisions} onJump={jumpTo} />}
              <ActionBar
                isStack={isStack}
                verbose={verbose}
                onTrash={function () { decideAll('trash'); }}
                onLater={function () { decideAll('later'); }}
                onKeep={function () { decideAll('keep', 'keep'); }}
                onArchive={archiveItem}
                onUndo={undo}
                canUndo={s.history.length > 0}
              />
            </React.Fragment>
          ) : (
            <FinishScreen
              lib={lib}
              folders={folders}
              decisions={s.decisions}
              deleted={s.deleted}
              stats={stats}
              destFor={destFor}
              onResume={resume}
              onReviewSkipped={reviewSkipped}
              onConfirmDelete={confirmDelete}
              onKeepInstead={keepInstead}
              onStartOver={startOver}
              onApply={applyToDisk}
              applying={applying}
              applied={applied}
              onDownloadScript={downloadScript}
              onOpenFolder={openFolder}
            />
          )}

          {locked && <DPaywall mode="limit" used={decided} limit={FREE_LIMIT} pro={false} onSubscribe={subscribe} onSeeResults={wrapUp} />}
          {settingsOpen && <DSettings
            onClose={function () { setSettingsOpen(false); }} t={t} setTweak={setTweak}
            folders={folders} counts={folderCounts} onAddFolder={addFolder} onRenameFolder={renameFolder} onDeleteFolder={deleteFolder}
            onStartOver={startOver} auth={auth} pro={pro} used={decided} limit={FREE_LIMIT}
            onOpenLogin={function () { setSettingsOpen(false); setLoginOpen(true); }} onOpenPay={function () { setSettingsOpen(false); setPayOpen(true); }} onSignOut={signOut}
          />}
          {loginOpen && <DLogin onAuth={signIn} onClose={function () { setLoginOpen(false); }} />}
          {payOpen && <DPaywall mode="browse" used={decided} limit={FREE_LIMIT} pro={pro} onSubscribe={subscribe} onManage={unsubscribe} onClose={function () { setPayOpen(false); }} />}
        </div>

        <div className="dock">
          <div className="dock-app active" title="Sift">
            <span className="dock-icon"><span className="dock-glyph">◈</span></span>
          </div>
          <span className="dock-sep"></span>
          <div className="dock-app" title="Photos"><span className="dock-icon ph"></span></div>
          <div className="dock-app" title="Files"><span className="dock-icon fl"></span></div>
          <div className="dock-app" title="Trash"><span className="dock-icon tr"></span></div>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Review" />
        <TweakRadio label="Mechanic" value={t.mechanic} options={['full-bleed', 'card']} onChange={function (v) { setTweak('mechanic', v); }} />
        <TweakRadio label="Density" value={t.density} options={['compact', 'comfortable']} onChange={function (v) { setTweak('density', v); }} />
        <TweakRadio label="Labels" value={t.labels} options={['verbose', 'terse']} onChange={function (v) { setTweak('labels', v); }} />
        <TweakSection label="Theme" />
        <TweakRadio label="Surface" value={t.theme} options={['charcoal', 'black', 'warm', 'midnight', 'light', 'sand']} onChange={function (v) { setTweak('theme', v); }} />
        <TweakColor label="Accent" value={t.accent} options={['#C792EA', '#5B9DFF', '#3FBFAE', '#E8A33D', '#F2627E', '#FFFFFF', '#9CA2AE']} onChange={function (v) { setTweak('accent', v); }} />
        <TweakSection label="Session" />
        <TweakButton label="Reset session (start over)" onClick={startOver} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
