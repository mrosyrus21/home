// Sift Mobile — swipe-deck UI pieces. Exported to window at the bottom.
const { useState: mUseState, useEffect: mUseEffect, useRef: mUseRef, forwardRef: mForwardRef, useImperativeHandle: mUseImperative } = React;

const SWIPE_THRESHOLD = 62;   // px past which a release commits
const FLICK_V = 0.45;         // px/ms flick velocity that commits even under the threshold
const FLING_MS = 230;

// ---- Icons (stroke, currentColor) ----
function MIcon({ name, size = 22 }) {
  const p = {
    trash: <g><path d="M3.5 6h17" /><path d="M8.5 6V4.5A1.5 1.5 0 0 1 10 3h4a1.5 1.5 0 0 1 1.5 1.5V6" /><path d="M6 6l1 14.5h10L18 6" /><path d="M10 10v7M14 10v7" /></g>,
    keep: <path d="M4.5 12.5l5 5L19.5 7" />,
    later: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.5 2" /></g>,
    undo: <g><path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H10" /><path d="M8.5 14L4 9.5 8.5 5" /></g>,
    album: <g><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h4l2 2.2H19.5A1.5 1.5 0 0 1 21 10.7V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" /></g>,
    stack: <g><rect x="3" y="7" width="14" height="11" rx="1.5" /><path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4H19a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-1.5" /></g>,
    check: <path d="M5 12.5l4.5 4.5L19 6.5" />,
    play: <path d="M8 5l11 7-11 7z" fill="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
    archive: <g><rect x="3" y="4" width="18" height="4.5" rx="1.2" /><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5" /><path d="M9.5 12.5h5" /></g>,
    plus: <g><path d="M12 5v14M5 12h14" /></g>,
    settings: <g><path d="M4 7h8M16 7h4" /><path d="M4 12h4M12 12h8" /><path d="M4 17h10M18 17h2" /><circle cx="14" cy="7" r="2.2" /><circle cx="10" cy="12" r="2.2" /><circle cx="16" cy="17" r="2.2" /></g>,
    crown: <g><path d="M4 8.5l4.2 3.2L12 5l3.8 6.7L20 8.5l-1.6 9.5H5.6z" /><path d="M5.6 18h12.8" /></g>,
    user: <g><circle cx="12" cy="8.2" r="3.7" /><path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" /></g>,
    chevL: <path d="M15 5l-7 7 7 7" />,
    chevR: <path d="M9 5l7 7-7 7" />,
    close: <g><path d="M5 5l14 14M19 5L5 19" /></g>
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p}</svg>
  );
}

// ---- Video that plays where reachable; always shows a poster image behind it
// (so it renders even when the media host is blocked / in screenshot capture). ----
function AutoVideo({ src, poster, className }) {
  const r = mUseRef(null);
  const [playing, setPlaying] = mUseState(false);
  mUseEffect(function () {
    const v = r.current;
    if (!v) return;
    v.muted = true;
    const pr = v.play();
    if (pr && pr.catch) pr.catch(function () { /* autoplay blocked — poster shows */ });
  }, [src]);
  return (
    <div className={(className || '') + ' m-videowrap'}>
      <img className="m-vlayer" src={poster} alt="" draggable="false" decoding="async" />
      <video ref={r} className="m-vlayer m-vid" src={src} poster={poster} muted loop playsInline autoPlay preload="metadata"
        draggable="false" onPlaying={function () { setPlaying(true); }} style={{ opacity: playing ? 1 : 0 }} />
    </div>
  );
}

// ---- Header: brand, progress, counts, settings + wrap up ----
function MHeader({ lib, stats, onWrapUp, onSettings }) {
  const total = lib.allPhotos.length;
  const done = total - stats.remaining;
  const pct = function (n) { return (n / total * 100) + '%'; };
  return (
    <header className="m-header">
      <div className="m-head-row">
        <div className="m-brand">
          <span className="m-logo">SIFT</span>
          <span className="m-sub">{done} of {total}</span>
        </div>
        <div className="m-head-actions">
          <button className="m-iconbtn" onClick={onSettings} aria-label="Settings"><MIcon name="settings" size={18} /></button>
          <button className="m-wrap" onClick={onWrapUp}>Wrap up</button>
        </div>
      </div>
      <div className="m-progress">
        <span className="pb keep" style={{ width: pct(stats.kept) }}></span>
        <span className="pb archive" style={{ width: pct(stats.archived || 0) }}></span>
        <span className="pb trash" style={{ width: pct(stats.trashed) }}></span>
        <span className="pb later" style={{ width: pct(stats.later) }}></span>
      </div>
      <div className="m-counts">
        <span className="keep-c">{stats.kept} kept</span>
        <span className="archive-c">{stats.archived || 0} archived</span>
        <span className="trash-c">{stats.trashed} trash</span>
        <span className="dim-c">{stats.remaining} left</span>
      </div>
    </header>
  );
}

// ---- Single swipe card (top of deck): drag gestures + prop-driven exit ----
function SwipeCard({ item, onDecide, exit }) {
  const p = item.photos[0];
  const isVid = p.type === 'video';
  const [drag, setDrag] = mUseState(null);     // {dx,dy} while pointer down
  const [fly, setFly] = mUseState(null);        // {x,y,rot} during exit
  const startRef = mUseRef(null);
  const activeRef = mUseRef(false);
  const velRef = mUseRef({ x: 0, y: 0, t: 0, vx: 0, vy: 0 });

  function vector(verdict) {
    if (verdict === 'keep') return { x: 460, y: -40, rot: 16 };
    if (verdict === 'archive') return { x: 320, y: -560, rot: 8 };
    if (verdict === 'trash') return { x: -460, y: -40, rot: -16 };
    return { x: 0, y: 560, rot: 0 }; // later
  }
  function commit(verdict, meta) {
    if (fly) return;
    setDrag(null);
    setFly(vector(verdict));
    setTimeout(function () { onDecide(verdict, meta && meta.album); }, FLING_MS);
  }

  // Action-bar taps / album sheet drive the exit through this prop
  mUseEffect(function () {
    if (exit) commit(exit.verdict, { album: exit.album });
  }, [exit]);

  function onDown(e) {
    if (fly) return;
    activeRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    velRef.current = { x: e.clientX, y: e.clientY, t: performance.now(), vx: 0, vy: 0 };
    setDrag({ dx: 0, dy: 0 });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  function onMove(e) {
    if (!activeRef.current || !startRef.current) return;
    const now = performance.now();
    const v = velRef.current;
    const dt = Math.max(1, now - v.t);
    velRef.current = { x: e.clientX, y: e.clientY, t: now, vx: (e.clientX - v.x) / dt, vy: (e.clientY - v.y) / dt };
    setDrag({ dx: e.clientX - startRef.current.x, dy: e.clientY - startRef.current.y });
  }
  function onUp() {
    if (!activeRef.current) return;
    activeRef.current = false;
    const d = drag || { dx: 0, dy: 0 };
    const v = velRef.current;
    const horiz = Math.abs(d.dx) > Math.abs(d.dy);
    if (horiz && (d.dx > SWIPE_THRESHOLD || (v.vx > FLICK_V && d.dx > 12))) return commit('keep', { album: 'keep' });
    if (horiz && (d.dx < -SWIPE_THRESHOLD || (v.vx < -FLICK_V && d.dx < -12))) return commit('trash');
    if (!horiz && (d.dy > SWIPE_THRESHOLD || (v.vy > FLICK_V && d.dy > 12))) return commit('later');
    setDrag(null); // snap back
  }

  let transform = 'none', transition = 'transform ' + FLING_MS + 'ms cubic-bezier(.4,0,.2,1)', op = 1;
  if (fly) { transform = 'translate(' + fly.x + 'px,' + fly.y + 'px) rotate(' + fly.rot + 'deg)'; op = 0; }
  else if (drag) { transform = 'translate(' + drag.dx + 'px,' + drag.dy + 'px) rotate(' + (drag.dx * 0.05) + 'deg) scale(' + (activeRef.current ? 1.03 : 1) + ')'; transition = activeRef.current ? 'none' : 'transform .32s cubic-bezier(.34,1.4,.5,1)'; }

  const dx = drag ? drag.dx : 0, dy = drag ? drag.dy : 0;
  const horizDom = Math.abs(dx) >= Math.abs(dy);
  const keepOp = horizDom ? Math.max(0, Math.min(1, dx / SWIPE_THRESHOLD)) : 0;
  const trashOp = horizDom ? Math.max(0, Math.min(1, -dx / SWIPE_THRESHOLD)) : 0;
  const laterOp = !horizDom ? Math.max(0, Math.min(1, dy / SWIPE_THRESHOLD)) : 0;

  return (
    <div className="m-card top" style={{ transform: transform, transition: transition, opacity: op, touchAction: 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="m-card-photo">
        <img className="m-card-fill" src={p.poster || p.src} alt="" draggable="false" decoding="async" aria-hidden="true" />
        {isVid
          ? <AutoVideo className="m-media" src={p.src} poster={p.poster} />
          : <img className="m-media" src={p.src} alt={p.name} draggable="false" decoding="async" />}
        {isVid && <span className="m-media-badge"><MIcon name="play" size={11} /> {p.dur}</span>}
        <span className="stamp keep" style={{ opacity: keepOp }}>KEEP</span>
        <span className="stamp trash" style={{ opacity: trashOp }}>TRASH</span>
        <span className="stamp later" style={{ opacity: laterOp }}>LATER</span>
      </div>
      <div className="m-card-cap">
        <span className="cap-name">{p.name}</span>
        <span className="cap-meta">{p.date} · {p.meta}</span>
      </div>
    </div>
  );
}

// ---- Static card behind the top one (deck depth) ----
function PeekCard({ item, offset }) {
  const p = item.photos[0];
  return (
    <div className={'m-card behind o' + offset}>
      <div className="m-card-photo">
        <img className="m-card-fill" src={p.poster || p.thumb || p.src} alt="" draggable="false" decoding="async" aria-hidden="true" />
        <img className="m-media" src={p.poster || p.thumb || p.src} alt="" draggable="false" decoding="async" />
        {p.type === 'video' && <span className="m-media-badge"><MIcon name="play" size={11} /></span>}
      </div>
      <div className="m-card-cap"><span className="cap-name">{p.name}</span></div>
    </div>
  );
}

// ---- The deck: top swipe card + up to two peeks ----
function CardDeck({ queue, index, itemsById, onDecide, exit }) {
  const ids = queue.slice(index, index + 3);
  return (
    <div className="m-deck">
      {ids.slice(1).reverse().map(function (id, i) {
        const off = ids.slice(1).length - i; // 2 then 1
        return <PeekCard key={id} item={itemsById[id]} offset={off} />;
      })}
      {ids[0] && <SwipeCard key={ids[0]} item={itemsById[ids[0]]} onDecide={onDecide} exit={exit} />}
    </div>
  );
}

// ---- Stack compare: pick one OR MANY keepers; rest go to trash. Collage grid. ----
function MStackCompare({ item, onConfirm, onKeepAll, onTrashAll }) {
  const n = item.photos.length;
  const [sel, setSel] = mUseState({});
  const selected = [];
  for (let i = 0; i < n; i++) if (sel[i]) selected.push(i);
  const count = selected.length;

  function toggle(i) {
    setSel(function (s) { const c = Object.assign({}, s); if (c[i]) delete c[i]; else c[i] = true; return c; });
  }

  return (
    <div className="m-stack">
      <div className="m-stack-head">
        <span className="m-stack-flag"><MIcon name="stack" size={15} /> Similar shots · {n}</span>
        <span className="m-stack-hint">{count ? count + ' to keep — the rest go to trash' : 'Tap every keeper — pick as many as you like'}</span>
      </div>
      <div className="m-stack-grid" data-n={n}>
        {item.photos.map(function (p, i) {
          const on = !!sel[i];
          return (
            <figure className={'m-stack-cell' + (on ? ' sel' : '')} key={p.id} onClick={function () { toggle(i); }}>
              {p.type === 'video'
                ? <AutoVideo className="m-media" src={p.src} poster={p.poster} />
                : <img className="m-media" src={p.src} alt={p.name} draggable="false" decoding="async" loading="lazy" />}
              <span className="m-cellbadge">{on ? <MIcon name="check" size={14} /> : <span className="m-cellnum">{i + 1}</span>}</span>
              {p.type === 'video' && <span className="m-cellvid"><MIcon name="play" size={11} /></span>}
            </figure>
          );
        })}
      </div>
      <div className="m-stack-actions">
        <button className="m-pill trash" onClick={onTrashAll}><MIcon name="trash" size={17} /> Trash all</button>
        {count > 0
          ? <button className="m-pill keep primary" onClick={function () { onConfirm(selected); }}><MIcon name="keep" size={17} /> Keep {count} · trash {n - count}</button>
          : <button className="m-pill keep" onClick={onKeepAll}><MIcon name="keep" size={17} /> Keep all</button>}
      </div>
    </div>
  );
}

// ---- Bottom action bar ----
function MActionBar({ isStack, canUndo, onUndo, onTrash, onLater, onKeep, onOrganize }) {
  if (isStack) {
    return (
      <div className="m-actions">
        <button className="m-fab small" onClick={onUndo} disabled={!canUndo} aria-label="Undo"><MIcon name="undo" size={20} /></button>
        <span className="m-actions-note">Tap keepers above</span>
        <span style={{ width: 48 }}></span>
      </div>
    );
  }
  return (
    <div className="m-actions">
      <button className="m-fab small" onClick={onUndo} disabled={!canUndo} aria-label="Undo"><MIcon name="undo" size={20} /></button>
      <button className="m-fab trash" onClick={onTrash} aria-label="Trash"><MIcon name="trash" size={26} /></button>
      <button className="m-fab later" onClick={onLater} aria-label="Later"><MIcon name="later" size={22} /></button>
      <button className="m-fab keep" onClick={onKeep} aria-label="Keep"><MIcon name="keep" size={27} /></button>
      <button className="m-fab small" onClick={onOrganize} aria-label="Move to folder or archive"><MIcon name="album" size={21} /></button>
    </div>
  );
}

// ---- Organize bottom sheet: general Keep, Archive, folders, + new folder ----
function OrganizeSheet({ open, folders, counts, onKeepGeneral, onArchive, onPickFolder, onCreate, onClose }) {
  const [adding, setAdding] = mUseState(false);
  const [name, setName] = mUseState('');
  function reset() { setAdding(false); setName(''); }
  mUseEffect(function () { if (!open) reset(); }, [open]);
  function close() { reset(); onClose(); }
  function submit() { const n = name.trim(); if (!n) return; onCreate(n); reset(); }
  return (
    <div className={'m-sheet-scrim' + (open ? ' open' : '')} onClick={close}>
      <div className={'m-sheet' + (open ? ' open' : '')} onClick={function (e) { e.stopPropagation(); }}>
        <div className="m-sheet-grab"></div>
        <div className="m-sheet-title">Move this to…</div>
        <button className="m-sheet-row" onClick={onKeepGeneral}>
          <span className="m-sheet-ico"><MIcon name="keep" size={18} /></span>
          <span>Keep — sort later</span>
          <span className="m-sheet-go"><MIcon name="keep" size={16} /></span>
        </button>
        <button className="m-sheet-row" onClick={onArchive}>
          <span className="m-sheet-ico archive"><MIcon name="archive" size={18} /></span>
          <span>Archive</span>
          <span className="m-sheet-go"><MIcon name="archive" size={16} /></span>
        </button>
        <div className="m-sheet-section">Folders</div>
        {folders.map(function (f) {
          return (
            <button className="m-sheet-row" key={f.id} onClick={function () { onPickFolder(f.id); }}>
              <span className="m-sheet-ico"><MIcon name="album" size={18} /></span>
              <span>{f.name}</span>
              {counts && counts[f.id] > 0 && <span className="m-sheet-count">{counts[f.id]}</span>}
              <span className="m-sheet-go"><MIcon name="keep" size={16} /></span>
            </button>
          );
        })}
        {adding ? (
          <div className="m-sheet-new">
            <input className="m-sheet-input" value={name} autoFocus placeholder="Folder name — e.g. Mom, Dog"
              onChange={function (e) { setName(e.target.value); }}
              onKeyDown={function (e) { if (e.key === 'Enter') submit(); }} />
            <button className="m-sheet-add" onClick={submit} disabled={!name.trim()}>Create</button>
          </div>
        ) : (
          <button className="m-sheet-row plain" onClick={function () { setAdding(true); }}>
            <span className="m-sheet-ico"><MIcon name="plus" size={18} /></span>
            <span>New folder…</span>
          </button>
        )}
        <button className="m-sheet-cancel" onClick={close}>Cancel</button>
      </div>
    </div>
  );
}

Object.assign(window, { MIcon, AutoVideo, MHeader, SwipeCard, CardDeck, MStackCompare, MActionBar, OrganizeSheet });
