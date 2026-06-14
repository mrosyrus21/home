// Shared UI pieces for Sift. Exported to window at the bottom.
const { useState, useEffect, useRef } = React;

// ---- Lazy, throttled disk-thumbnail generator -------------------------------
// Real camera files are huge; decoding many full-res frames at once is what
// makes the strip/grid crawl. We downscale each disk photo once (off the main
// image path), cache the small blob URL on the photo, and only generate when
// the thumb is near the viewport. Demo photos already ship a small thumb URL.
const SiftThumbQ = { running: 0, max: 3, q: [] };
function siftPump() {
  while (SiftThumbQ.running < SiftThumbQ.max && SiftThumbQ.q.length) {
    const job = SiftThumbQ.q.shift();
    SiftThumbQ.running++;
    Promise.resolve().then(job.task).then(job.done, job.done).then(function () {
      SiftThumbQ.running--; siftPump();
    });
  }
}
function siftQueueThumb(task) { return new Promise(function (done) { SiftThumbQ.q.push({ task: task, done: done }); siftPump(); }); }

async function makeDiskThumb(file) {
  try {
    let bmp;
    try { bmp = await createImageBitmap(file, { resizeWidth: 400, resizeQuality: 'low' }); }
    catch (e) { bmp = await createImageBitmap(file); }
    const tw = Math.min(bmp.width, 400);
    const th = Math.max(1, Math.round(bmp.height * (tw / bmp.width)));
    const c = document.createElement('canvas');
    c.width = tw; c.height = th;
    c.getContext('2d').drawImage(bmp, 0, 0, tw, th);
    if (bmp.close) bmp.close();
    const blob = await new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.82); });
    return blob ? URL.createObjectURL(blob) : null;
  } catch (e) {
    return null; // unsupported/corrupt file — caller shows a placeholder, never a broken img
  }
}

function DiskThumb({ photo, className }) {
  const isDisk = !!(photo._file && photo._file.file);
  const [url, setUrl] = useState(photo._thumbUrl || (isDisk ? null : photo.thumb));
  const ref = useRef(null);
  useEffect(function () {
    if (!isDisk) return;
    if (photo._thumbUrl) { if (!url) setUrl(photo._thumbUrl); return; }
    let cancelled = false;
    let started = false;
    function generate() {
      if (started || cancelled) return;
      if (photo._thumbUrl) { setUrl(photo._thumbUrl); return; }
      started = true;
      siftQueueThumb(function () { return makeDiskThumb(photo._file.file); }).then(function (u) {
        if (cancelled) { if (typeof u === 'string') URL.revokeObjectURL(u); return; }
        if (typeof u === 'string') { photo._thumbUrl = u; setUrl(u); }
        // else: leave url null -> placeholder box (no broken-image error events)
      });
    }
    const node = ref.current;
    let io = null;
    if (node && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) { generate(); if (io) { io.disconnect(); io = null; } }
      }, { rootMargin: '300px' });
      io.observe(node);
    } else {
      generate();
    }
    return function () { cancelled = true; if (io) io.disconnect(); };
  }, [photo]);
  if (!url) return <div ref={ref} className={(className || '') + ' thumb-ph'} title={photo.name}></div>;
  return <img className={className} src={url} alt={photo.name} draggable="false" loading="lazy" decoding="async" />;
}

function SIcon({ name, size = 15 }) {
  const p = {
    trash: <g><path d="M3.5 6h17" /><path d="M8.5 6V4.5A1.5 1.5 0 0 1 10 3h4a1.5 1.5 0 0 1 1.5 1.5V6" /><path d="M6 6l1 14.5h10L18 6" /><path d="M10 10v7M14 10v7" /></g>,
    keep: <path d="M4.5 12.5l5 5L19.5 7" />,
    later: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.5 2" /></g>,
    undo: <g><path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H10" /><path d="M8.5 14L4 9.5 8.5 5" /></g>,
    stack: <g><rect x="3" y="7" width="14" height="11" rx="1.5" /><path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4H19a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-1.5" /></g>,
    play: <path d="M8 5l11 7-11 7z" fill="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
    flag: <g><path d="M5 21V4" /><path d="M5 4h13l-3 4.5 3 4.5H5" /></g>,
    archive: <g><rect x="3" y="4" width="18" height="4.5" rx="1.2" /><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5" /><path d="M9.5 12.5h5" /></g>,
    folder: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17.5z" />,
    settings: <g><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" /></g>,
    crown: <g><path d="M4 8.5l4.2 3.2L12 5l3.8 6.7L20 8.5l-1.6 9.5H5.6z" /><path d="M5.6 18h12.8" /></g>,
    user: <g><circle cx="12" cy="8.2" r="3.7" /><path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" /></g>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M5 12.5l4.5 4.5L19 6.5" />,
    chevR: <path d="M9 5l7 7-7 7" />,
    chevL: <path d="M15 5l-7 7 7 7" />,
    close: <path d="M5 5l14 14M19 5L5 19" />
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p}</svg>
  );
}

function Kbd({ children }) {
  return <span className="kbd">{children}</span>;
}

// ---- Top bar: brand, per-photo progress strip, session stats ----
function TopBar({ lib, decisions, deleted, currentItem, stats, onWrapUp, onOpenFolder, finished, pro, used, limit, auth, onSettings, onAccount, onPlus }) {
  const all = lib.allPhotos;
  const currentIds = currentItem ? currentItem.photos.map(function (p) { return p.id; }) : [];
  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">SIFT</span>
        <span className="brand-sub">{lib.name} · {all.length} photos</span>
      </div>
      <div className="progress-strip" title="Session progress">
        {all.length <= 80 ? all.map(function (p) {
          const d = decisions[p.id];
          const cls = deleted.indexOf(p.id) >= 0 ? 'trash' : (d ? d.verdict : '');
          const cur = currentIds.indexOf(p.id) >= 0 && !finished ? ' current' : '';
          return <span key={p.id} className={'seg ' + cls + cur}></span>;
        }) : (function () {
          const total = all.length;
          const pct = function (n) { return (n / total * 100) + '%'; };
          const done = total - stats.remaining;
          return (
            <div className="progress-bar">
              <span className="pb keep" style={{ width: pct(stats.kept) }}></span>
              <span className="pb archive" style={{ width: pct(stats.archived || 0) }}></span>
              <span className="pb trash" style={{ width: pct(stats.trashed + (deleted ? deleted.length : 0)) }}></span>
              <span className="pb later" style={{ width: pct(stats.later) }}></span>
              <span className="pb-label">{done} / {total}</span>
            </div>
          );
        })()}
      </div>
      <div className="stats">
        <span className="stat keep-c">{stats.kept} kept</span>
        <span className="stat archive-c">{stats.archived || 0} arch</span>
        <span className="stat trash-c">{stats.trashed} trash</span>
        <span className="stat dim-c">{stats.remaining} left</span>
      </div>
      {!pro && <button className="btn plus-pill" onClick={onPlus} title="Sift Plus"><SIcon name="crown" size={13} /> {used}/{limit}</button>}
      {pro && <button className="btn plus-pill on" onClick={onPlus} title="Sift Plus active"><SIcon name="crown" size={13} /> Plus</button>}
      <button className="btn ghost small" onClick={onOpenFolder} title="Review a folder of photos from your PC">Open folder…</button>
      {!finished && <button className="btn ghost small" onClick={onWrapUp}>Wrap up</button>}
      <button className="icon-btn" onClick={onAccount} title={auth ? auth.email : 'Sign in'} aria-label="Account">
        {auth ? <span className="tb-avatar">{auth.email[0].toUpperCase()}</span> : <SIcon name="user" size={16} />}
      </button>
      <button className="icon-btn" onClick={onSettings} title="Settings" aria-label="Settings"><SIcon name="settings" size={16} /></button>
    </header>
  );
}

// ---- Video stage: poster image behind the <video> so a clip never shows an
// empty black frame when the stream is still loading / blocked (parity w/ mobile). ----
function VideoStage({ photo }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(function () {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const pr = v.play();
    if (pr && pr.catch) pr.catch(function () { /* autoplay/stream blocked — poster shows */ });
  }, [photo.src]);
  return (
    <div className="video-stage">
      <img className="video-poster" src={photo.poster} alt="" draggable="false" decoding="async" />
      <video ref={ref} className="video-layer" src={photo.src} poster={photo.poster} muted loop playsInline autoPlay decoding="async"
        draggable="false" onPlaying={function () { setPlaying(true); }} style={{ opacity: playing ? 1 : 0 }} />
    </div>
  );
}

// ---- Single-photo stage (full-bleed or card mechanic) ----
function PhotoView({ item, mechanic, exiting, density, onDragStart, onDragEnd }) {
  const p = item.photos[0];
  const anim = exiting ? 'exit-' + exiting : 'enter';
  const isVid = p.type === 'video';
  const media = isVid
    ? <VideoStage photo={p} />
    : <img className="photo-img" src={p.src} alt={p.name} draggable="false" decoding="async" />;
  const badge = isVid ? <span className="media-badge"><SIcon name="play" size={12} /> {p.dur}</span> : null;
  const dragProps = {
    draggable: true,
    onDragStart: function (e) { try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', p.id); } catch (err) {} if (onDragStart) onDragStart(); },
    onDragEnd: function () { if (onDragEnd) onDragEnd(); }
  };
  if (mechanic === 'card') {
    return (
      <div className={'photo-card draggable ' + anim} key={item.id} {...dragProps}>
        {media}
        {badge}
        <span className="drag-hint">Drag to a folder →</span>
        <div className="card-caption">
          <span className="cap-name">{p.name}</span>
          <span className="cap-meta">{p.date}{density === 'comfortable' ? ' · ' + p.meta : ''}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={'photo-bleed draggable ' + anim} key={item.id} {...dragProps}>
      {media}
      {badge}
      <span className="drag-hint">Drag to a folder →</span>
      <div className="bleed-caption">
        <span className="cap-name">{p.name}</span>
        <span className="cap-meta">{p.date}{density === 'comfortable' ? ' · ' + p.meta : ''}</span>
      </div>
    </div>
  );
}

// ---- Similar-shot compare: pick the best, rest go to trash ----
function StackCompare({ item, exiting, onPick }) {
  const n = item.photos.length;
  const anim = exiting ? 'exit-' + exiting : 'enter';
  return (
    <div className={'stack-wrap ' + anim} key={item.id}>
      <div className="stack-head">
        <span className="stack-flag"><SIcon name="stack" size={14} /> Similar shots · {n} frames</span>
        <span className="stack-hint">Pick the best — press <Kbd>1</Kbd>–<Kbd>{String(n)}</Kbd> or click. The rest go to trash.</span>
      </div>
      <div className="stack-grid" style={{ gridTemplateColumns: 'repeat(' + (n <= 1 ? 1 : (n <= 4 ? 2 : 3)) + ', minmax(0, 1fr))' }}>
        {item.photos.map(function (p, i) {
          return (
            <figure className="stack-cell" key={p.id} onClick={function () { onPick(i); }} title={'Keep ' + p.name + ', trash the rest'}>
              {p.type === 'video'
                ? <video src={p.src} poster={p.poster} muted loop playsInline autoPlay decoding="async" ref={function (v) { if (v) { v.muted = true; const pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } }} />
                : <img src={p.src} alt={p.name} draggable="false" decoding="async" loading="lazy" />}
              {p.type === 'video' && <span className="stack-vid-badge"><SIcon name="play" size={12} /></span>}
              <figcaption className="stack-cap">
                <span className="kbd accent">{i + 1}</span>
                <span className="cap-name">{p.name}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

// ---- Bottom action bar ----
function ActionBar({ isStack, verbose, onTrash, onLater, onKeep, onArchive, onUndo, canUndo }) {
  return (
    <div className="actionbar">
      <div className="ab-side left">
        <button className="btn ghost" onClick={onUndo} disabled={!canUndo} title="Undo last decision (Z)">
          <SIcon name="undo" />{verbose && <span>Undo</span>}<Kbd>Z</Kbd>
        </button>
      </div>
      <div className="ab-main">
        <button className="act trash" onClick={onTrash} title={isStack ? 'Trash all frames' : 'Move to trash'}>
          <SIcon name="trash" size={17} />
          {verbose && <span>{isStack ? 'Trash all' : 'Trash'}</span>}
          <Kbd>{isStack ? 'X' : '←'}</Kbd>
        </button>
        <button className="act later" onClick={onLater} title="Decide later">
          <SIcon name="later" size={17} />
          {verbose && <span>Later</span>}
          <Kbd>↓</Kbd>
        </button>
        <button className="act keep" onClick={onKeep} title={isStack ? 'Keep all frames' : 'Keep — sort later'}>
          <SIcon name="keep" size={17} />
          {verbose && <span>{isStack ? 'Keep all' : 'Keep'}</span>}
          <Kbd>{isStack ? 'A' : '→'}</Kbd>
        </button>
        {!isStack && (
          <button className="act archive" onClick={onArchive} title="Archive">
            <SIcon name="archive" size={16} />
            {verbose && <span>Archive</span>}
            <Kbd>E</Kbd>
          </button>
        )}
      </div>
      <div className="ab-side right">
        {verbose && <span className="chip-hint">{isStack ? 'pick the keeper' : 'or send to a folder →'}</span>}
      </div>
    </div>
  );
}

// ---- Folder rail: persistent drop targets for keep-into-folder, archive, trash ----
function FolderRail({ folders, counts, dragging, dropTarget, isStack, onAssign, onArchive, onTrash, onKeepGeneral, onAddFolder, onManage, setDropTarget }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  function submit() { const n = name.trim(); if (!n) return; onAddFolder(n); setName(''); setAdding(false); }
  function dz(key, handler) {
    return {
      onDragOver: function (e) { if (dragging) { e.preventDefault(); try { e.dataTransfer.dropEffect = 'move'; } catch (err) {} if (dropTarget !== key) setDropTarget(key); } },
      onDragLeave: function () { if (dropTarget === key) setDropTarget(null); },
      onDrop: function (e) { e.preventDefault(); setDropTarget(null); handler(); }
    };
  }
  return (
    <aside className={'rail' + (dragging ? ' dragging' : '') + (isStack ? ' muted' : '')}>
      <div className="rail-head">
        <span className="rail-title">Sort into</span>
        <button className="rail-manage" onClick={onManage} title="Manage folders in Settings"><SIcon name="settings" size={14} /></button>
      </div>

      <button className={'rail-target keep' + (dropTarget === 'keep' ? ' over' : '')} onClick={onKeepGeneral} {...dz('keep', onKeepGeneral)} title="Keep — sort later (→)">
        <span className="rt-ico"><SIcon name="keep" size={17} /></span>
        <span className="rt-label">Keep — sort later</span>
        <Kbd>→</Kbd>
      </button>

      <div className="rail-scroll">
        {folders.map(function (f, i) {
          const key = 'f:' + f.id;
          return (
            <button className={'rail-target' + (dropTarget === key ? ' over' : '')} key={f.id} onClick={function () { onAssign(f.id); }} {...dz(key, function () { onAssign(f.id); })} title={'Keep into ' + f.name}>
              <span className="rt-ico"><SIcon name="folder" size={16} /></span>
              <span className="rt-label">{f.name}</span>
              {counts[f.id] > 0 && <span className="rt-count">{counts[f.id]}</span>}
              {i < 9 && <span className="kbd accent">{i + 1}</span>}
            </button>
          );
        })}
        {adding ? (
          <div className="rail-new">
            <input value={name} autoFocus placeholder="Folder name…" onChange={function (e) { setName(e.target.value); }}
              onKeyDown={function (e) { if (e.key === 'Enter') submit(); if (e.key === 'Escape') { setAdding(false); setName(''); } }} />
            <button className="btn small primary" onClick={submit} disabled={!name.trim()}>Add</button>
          </div>
        ) : (
          <button className="rail-add" onClick={function () { setAdding(true); }}><SIcon name="plus" size={14} /> New folder</button>
        )}
      </div>

      <button className={'rail-target archive' + (dropTarget === 'archive' ? ' over' : '')} onClick={onArchive} {...dz('archive', onArchive)} title="Archive (E)">
        <span className="rt-ico"><SIcon name="archive" size={15} /></span>
        <span className="rt-label">Archive</span>
        <Kbd>E</Kbd>
      </button>
      <button className={'rail-target trash' + (dropTarget === 'trash' ? ' over' : '')} onClick={onTrash} {...dz('trash', onTrash)} title="Trash (←)">
        <span className="rt-ico"><SIcon name="trash" size={15} /></span>
        <span className="rt-label">Trash</span>
        <Kbd>←</Kbd>
      </button>
    </aside>
  );
}

// ---- Filmstrip of the queue (click any frame to jump to it) ----
function Filmstrip({ queue, index, itemsById, decisions, onJump }) {
  const scroller = useRef(null);
  useEffect(function () {
    const sc = scroller.current;
    if (!sc) return;
    const el = sc.querySelector('.thumb.current');
    if (el) {
      const target = el.offsetLeft - (sc.clientWidth - el.clientWidth) / 2;
      sc.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
  }, [index, queue]);
  return (
    <div className="filmstrip" ref={scroller}>
      {queue.map(function (id, qi) {
        const item = itemsById[id];
        const p = item.photos[0];
        const d = decisions[p.id];
        const cls = 'thumb' + (qi === index ? ' current' : '') + (d ? ' done done-' + d.verdict : '');
        return (
          <button className={cls} key={id} onClick={function () { onJump(qi); }} title={'Go to ' + p.name} aria-label={'Go to ' + p.name}>
            <DiskThumb photo={p} />
            {p.type === 'video' && <span className="thumb-vid"><SIcon name="play" size={11} /></span>}
            {item.kind === 'stack' && <span className="thumb-stack"><SIcon name="stack" size={11} /> {item.photos.length}</span>}
            {d && <span className={'thumb-mark ' + d.verdict}><SIcon name={d.verdict} size={11} /></span>}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { SIcon, Kbd, TopBar, PhotoView, StackCompare, ActionBar, FolderRail, Filmstrip, DiskThumb });
