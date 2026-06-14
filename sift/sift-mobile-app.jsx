// Sift Mobile — app: session state, decisions, swipe deck flow, tweaks.
const { useState: mUseS, useEffect: mUseFx, useRef: mUseRf, useMemo: mUseM } = React;

const M_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "black",
  "accent": "#C792EA",
  "hints": true,
  "haptics": true
}/*EDITMODE-END*/;

const M_ALBUMS = window.SIFT_DATA.albums;
const M_LIB = {
  name: 'Sample import',
  items: window.SIFT_DATA.items,
  allPhotos: window.SIFT_DATA.allPhotos
};

const M_FOLDERS_KEY = 'sift-mobile-folders-v1';
const M_PRO_KEY = 'sift-mobile-pro-v1';
const M_AUTH_KEY = 'sift-mobile-auth-v1';
const M_FREE_LIMIT = 25;
function mLoadPro() { try { return localStorage.getItem(M_PRO_KEY) === '1'; } catch (e) { return false; } }
function mLoadAuth() { try { const r = localStorage.getItem(M_AUTH_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function mLoadFolders() {
  try {
    const raw = localStorage.getItem(M_FOLDERS_KEY);
    if (raw) { const a = JSON.parse(raw); if (Array.isArray(a) && a.length) return a; }
  } catch (e) { /* ignore */ }
  return M_ALBUMS.map(function (a) { return { id: a.id, name: a.name }; });
}

const M_KEY = 'sift-mobile-session-v1';
function mFresh() {
  return { decisions: {}, queue: M_LIB.items.map(function (i) { return i.id; }), index: 0, finished: false, deleted: [], history: [] };
}
function mLoad() {
  try {
    const raw = localStorage.getItem(M_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.queue) {
        const valid = {};
        M_LIB.items.forEach(function (i) { valid[i.id] = 1; });
        const queue = s.queue.filter(function (id) { return valid[id]; });
        if (queue.length) return Object.assign(mFresh(), s, { queue: queue, index: Math.min(s.index || 0, queue.length), history: [] });
      }
    }
  } catch (e) { /* ignore */ }
  return mFresh();
}
function mStats(s) {
  let kept = 0, archived = 0, trashed = 0, later = 0, decided = 0;
  M_LIB.allPhotos.forEach(function (p) {
    if (s.deleted.indexOf(p.id) >= 0) { decided++; return; }
    const d = s.decisions[p.id];
    if (!d) return;
    decided++;
    if (d.verdict === 'keep') kept++;
    else if (d.verdict === 'archive') archived++;
    else if (d.verdict === 'trash') trashed++;
    else later++;
  });
  return { kept: kept, archived: archived, trashed: trashed, later: later, remaining: M_LIB.allPhotos.length - decided };
}

function MobileApp() {
  const [t, setTweak] = useTweaks(M_TWEAK_DEFAULTS);
  const [s, setS] = mUseS(mLoad);
  const [folders, setFolders] = mUseS(mLoadFolders);
  const [pro, setPro] = mUseS(mLoadPro);
  const [auth, setAuth] = mUseS(mLoadAuth);
  const [sheet, setSheet] = mUseS(false);
  const [settingsOpen, setSettingsOpen] = mUseS(false);
  const [loginOpen, setLoginOpen] = mUseS(false);
  const [payOpen, setPayOpen] = mUseS(false);
  const [exiting, setExiting] = mUseS(null);
  const wrapRef = mUseRf(null);

  // Scale the phone to fit the viewport (panel stays unscaled — it's a sibling)
  mUseFx(function () {
    function fit() {
      const el = wrapRef.current;
      if (!el) return;
      const sc = Math.min(1, (window.innerHeight - 40) / 874, (window.innerWidth - 40) / 402);
      el.style.transform = 'scale(' + sc + ')';
    }
    fit();
    window.addEventListener('resize', fit);
    return function () { window.removeEventListener('resize', fit); };
  }, []);

  const ITEMS_BY_ID = mUseM(function () {
    const m = {};
    M_LIB.items.forEach(function (i) { m[i.id] = i; });
    return m;
  }, []);

  mUseFx(function () {
    try { localStorage.setItem(M_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }, [s]);

  mUseFx(function () {
    try { localStorage.setItem(M_FOLDERS_KEY, JSON.stringify(folders)); } catch (e) { /* ignore */ }
  }, [folders]);

  mUseFx(function () {
    try { localStorage.setItem(M_PRO_KEY, pro ? '1' : '0'); } catch (e) { /* ignore */ }
  }, [pro]);

  mUseFx(function () {
    try { if (auth) localStorage.setItem(M_AUTH_KEY, JSON.stringify(auth)); else localStorage.removeItem(M_AUTH_KEY); } catch (e) { /* ignore */ }
  }, [auth]);

  function signIn(user) { setAuth(user); setLoginOpen(false); }
  function signOut() { setAuth(null); }
  function subscribe() { setPro(true); setPayOpen(false); }
  function unsubscribe() { setPro(false); }

  const folderCounts = mUseM(function () {
    const c = {};
    M_LIB.allPhotos.forEach(function (p) {
      const d = s.decisions[p.id];
      if (d && d.verdict === 'keep' && d.album && d.album !== 'keep') c[d.album] = (c[d.album] || 0) + 1;
    });
    return c;
  }, [s.decisions]);

  function addFolder(name) {
    const id = 'f' + Date.now().toString(36);
    setFolders(function (prev) { return prev.concat([{ id: id, name: name }]); });
    return id;
  }
  function renameFolder(id, name) {
    setFolders(function (prev) { return prev.map(function (f) { return f.id === id ? { id: f.id, name: name } : f; }); });
  }
  function deleteFolder(id) {
    setFolders(function (prev) { return prev.filter(function (f) { return f.id !== id; }); });
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      Object.keys(d).forEach(function (pid) {
        if (d[pid] && d[pid].verdict === 'keep' && d[pid].album === id) d[pid] = { verdict: 'keep', album: 'keep' };
      });
      return Object.assign({}, prev, { decisions: d });
    });
  }
  function buzz() { try { if (t.haptics !== false && navigator.vibrate) navigator.vibrate(8); } catch (e) { /* ignore */ } }

  mUseFx(function () {
    document.body.dataset.theme = t.theme;
    document.body.style.setProperty('--accent', t.accent);
  }, [t.theme, t.accent]);

  const item = !s.finished && s.index < s.queue.length ? ITEMS_BY_ID[s.queue[s.index]] : null;
  const isLight = t.theme === 'light' || t.theme === 'sand';
  const isStack = item && item.kind === 'stack';
  const stats = mStats(s);
  const decided = M_LIB.allPhotos.length - stats.remaining;
  const locked = !pro && !!item && decided >= M_FREE_LIMIT;

  // Preload next item's full image (one decode ahead; skip videos)
  mUseFx(function () {
    const it = ITEMS_BY_ID[s.queue[s.index + 1]];
    const ph = it && it.photos[0];
    if (ph && ph.type !== 'video') { const im = new Image(); im.src = ph.src; }
  }, [s.index, s.queue, ITEMS_BY_ID]);

  function advance(map) {
    buzz();
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      const prevEntry = {};
      Object.keys(map).forEach(function (pid) { prevEntry[pid] = prev.decisions[pid] || null; d[pid] = map[pid]; });
      const h = prev.history.concat([{ index: prev.index, queue: prev.queue, prev: prevEntry }]).slice(-60);
      return Object.assign({}, prev, { decisions: d, history: h, index: prev.index + 1 });
    });
  }

  // Called by the card after its fly-off animation completes
  function onDecide(verdict, album) {
    setExiting(null);
    if (!item) return;
    const map = {};
    item.photos.forEach(function (p) {
      if (verdict === 'keep') map[p.id] = { verdict: 'keep', album: album || 'keep' };
      else if (verdict === 'archive') map[p.id] = { verdict: 'archive' };
      else map[p.id] = { verdict: verdict };
    });
    advance(map);
  }

  // Button taps / organize sheet → set the exit verdict; the card animates then calls onDecide
  function flingTop(verdict, meta) {
    if (!item || isStack || exiting) return;
    setExiting({ verdict: verdict, album: meta && meta.album });
  }
  function chooseKeepGeneral() { setSheet(false); flingTop('keep', { album: 'keep' }); }
  function chooseArchive() { setSheet(false); flingTop('archive'); }
  function chooseFolder(folderId) { setSheet(false); flingTop('keep', { album: folderId }); }
  function createFolder(name) { const id = addFolder(name); setSheet(false); flingTop('keep', { album: id }); }

  // Stack decisions (no card fling — direct)
  function pickWinners(indices) {
    if (!item || !indices || !indices.length) return;
    const keepSet = {};
    indices.forEach(function (i) { keepSet[i] = true; });
    const map = {};
    item.photos.forEach(function (p, j) { map[p.id] = keepSet[j] ? { verdict: 'keep', album: 'keep' } : { verdict: 'trash' }; });
    advance(map);
  }
  function stackAll(verdict) {
    if (!item) return;
    const map = {};
    item.photos.forEach(function (p) { map[p.id] = verdict === 'keep' ? { verdict: 'keep', album: 'keep' } : { verdict: verdict }; });
    advance(map);
  }

  function undo() {
    setExiting(null);
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
  function resume() { setS(function (prev) { return Object.assign({}, prev, { finished: false }); }); }
  function reviewSkipped() {
    setS(function (prev) {
      const laterItems = M_LIB.items.filter(function (it) {
        return it.photos.some(function (p) { const d = prev.decisions[p.id]; return d && d.verdict === 'later'; });
      }).map(function (it) { return it.id; });
      const d = Object.assign({}, prev.decisions);
      laterItems.forEach(function (id) { ITEMS_BY_ID[id].photos.forEach(function (p) { delete d[p.id]; }); });
      return Object.assign({}, prev, { decisions: d, queue: laterItems, index: 0, finished: false, history: [] });
    });
  }
  function confirmDelete(ids) { setS(function (prev) { return Object.assign({}, prev, { deleted: prev.deleted.concat(ids), history: [] }); }); }
  function keepInstead(pid) {
    setS(function (prev) {
      const d = Object.assign({}, prev.decisions);
      d[pid] = { verdict: 'keep', album: 'keep' };
      return Object.assign({}, prev, { decisions: d });
    });
  }
  function startOver() { setExiting(null); setS(mFresh()); }

  const screen = item ? (
    <div className="m-screen" data-screen-label="Review">
      <MHeader lib={M_LIB} stats={stats} onWrapUp={wrapUp} onSettings={function () { setSettingsOpen(true); }} />
      <main className="m-stage">
        {isStack
          ? <MStackCompare item={item} onConfirm={pickWinners} onKeepAll={function () { stackAll('keep'); }} onTrashAll={function () { stackAll('trash'); }} />
          : (
            <React.Fragment>
              <CardDeck queue={s.queue} index={s.index} itemsById={ITEMS_BY_ID} onDecide={onDecide} exit={exiting} />
              {t.hints && <div className="m-hints"><span className="trash-c">← Trash</span><span className="later-c">↓ Later</span><span className="keep-c">Keep →</span></div>}
            </React.Fragment>
          )}
      </main>
      <MActionBar
        isStack={isStack}
        canUndo={s.history.length > 0}
        onUndo={undo}
        onTrash={function () { flingTop('trash'); }}
        onLater={function () { flingTop('later'); }}
        onKeep={function () { flingTop('keep', { album: 'keep' }); }}
        onOrganize={function () { setSheet(true); }}
      />
      <OrganizeSheet
        open={sheet}
        folders={folders}
        counts={folderCounts}
        onKeepGeneral={chooseKeepGeneral}
        onArchive={chooseArchive}
        onPickFolder={chooseFolder}
        onCreate={createFolder}
        onClose={function () { setSheet(false); }}
      />
    </div>
  ) : (
    <div className="m-screen scroll">
      <MFinish
        lib={M_LIB}
        folders={folders}
        decisions={s.decisions}
        deleted={s.deleted}
        stats={stats}
        onResume={resume}
        onReviewSkipped={reviewSkipped}
        onConfirmDelete={confirmDelete}
        onKeepInstead={keepInstead}
        onStartOver={startOver}
        onSettings={function () { setSettingsOpen(true); }}
      />
    </div>
  );

  return (
    <div className="m-root">
      <div className="device-wrap" ref={wrapRef}>
        <IOSDevice dark={!isLight}>
          <div style={{ position: 'relative', height: '100%' }}>
            {screen}
            {locked && <MPaywall
              mode="limit"
              used={decided}
              limit={M_FREE_LIMIT}
              pro={false}
              onSubscribe={subscribe}
              onSeeResults={function () { wrapUp(); }}
            />}
            {settingsOpen && <MSettings
              open={settingsOpen}
              onClose={function () { setSettingsOpen(false); }}
              t={t}
              setTweak={setTweak}
              folders={folders}
              counts={folderCounts}
              onAddFolder={addFolder}
              onRenameFolder={renameFolder}
              onDeleteFolder={deleteFolder}
              onStartOver={startOver}
              auth={auth}
              pro={pro}
              used={decided}
              limit={M_FREE_LIMIT}
              onOpenLogin={function () { setLoginOpen(true); }}
              onOpenPay={function () { setPayOpen(true); }}
              onSignOut={signOut}
            />}
            {loginOpen && <MLogin onAuth={signIn} onClose={function () { setLoginOpen(false); }} />}
            {payOpen && <MPaywall
              mode="browse"
              used={decided}
              limit={M_FREE_LIMIT}
              pro={pro}
              onSubscribe={subscribe}
              onManage={unsubscribe}
              onClose={function () { setPayOpen(false); }}
            />}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Surface" value={t.theme} options={['charcoal', 'black', 'warm', 'midnight', 'light', 'sand']} onChange={function (v) { setTweak('theme', v); }} />
        <TweakColor label="Accent" value={t.accent} options={['#C792EA', '#5B9DFF', '#3FBFAE', '#E8A33D', '#F2627E', '#FFFFFF', '#9CA2AE']} onChange={function (v) { setTweak('accent', v); }} />
        <TweakSection label="Review" />
        <TweakToggle label="Swipe hints" value={t.hints} onChange={function (v) { setTweak('hints', v); }} />
        <TweakToggle label="Haptic feedback" value={t.haptics !== false} onChange={function (v) { setTweak('haptics', v); }} />
        <TweakSection label="Session" />
        <TweakButton label="Reset session (start over)" onClick={startOver} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MobileApp />);
