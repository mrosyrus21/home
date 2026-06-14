// Sift Mobile — wrap-up screen with sorting. Exported to window at the bottom.
const mFS = { useState: React.useState };

// Segmented control (Apple-style)
function MSeg({ value, options, onChange }) {
  return (
    <div className="m-seg">
      {options.map(function (o) {
        return <button key={o.v} className={'opt' + (value === o.v ? ' on' : '')} onClick={function () { onChange(o.v); }}>{o.l}</button>;
      })}
    </div>
  );
}

// Thumbnail (photo or video, with optional rescue action)
function MThumb({ photo, dim, action, onAction }) {
  return (
    <figure className={'m-fthumb' + (dim ? ' dim' : '')}>
      <img src={photo.thumb || photo.poster || photo.src} alt={photo.name} draggable="false" loading="lazy" decoding="async" />
      {photo.type === 'video' && <span className="m-play"><MIcon name="play" size={15} /></span>}
      {photo.type === 'video' && photo.dur && <span className="m-thumb-dur">{photo.dur}</span>}
      {action && <button className="m-fthumb-act" onClick={function () { onAction(photo.id); }}>{action}</button>}
    </figure>
  );
}

function MFinish({ lib, folders, decisions, deleted, stats, onResume, onReviewSkipped, onConfirmDelete, onKeepInstead, onStartOver, onSettings }) {
  const [armed, setArmed] = mFS.useState(false);
  const [keptSort, setKeptSort] = mFS.useState('date');   // date | album | type
  const [trashSort, setTrashSort] = mFS.useState('date'); // date | name
  const all = lib.allPhotos;
  const deletedSet = {};
  deleted.forEach(function (id) { deletedSet[id] = true; });

  const kept = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'keep'; });
  const archived = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'archive'; });
  const trashed = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'trash' && !deletedSet[p.id]; });
  const later = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'later'; });

  function byDate(list) { return list.slice().sort(function (a, b) { return a.sortKey === b.sortKey ? (a.name < b.name ? -1 : 1) : (a.sortKey < b.sortKey ? -1 : 1); }); }
  function byName(list) { return list.slice().sort(function (a, b) { return a.name < b.name ? -1 : 1; }); }

  // ---- Kept grouping ----
  let groups = [];
  if (keptSort === 'type') {
    const phs = kept.filter(function (p) { return p.type !== 'video'; });
    const vids = kept.filter(function (p) { return p.type === 'video'; });
    if (phs.length) groups.push({ title: 'Photos', sub: phs.length + (phs.length === 1 ? ' file' : ' files'), photos: byDate(phs) });
    if (vids.length) groups.push({ title: 'Videos', sub: vids.length + (vids.length === 1 ? ' file' : ' files'), photos: byDate(vids) });
  } else if (keptSort === 'album') {
    folders.forEach(function (a) {
      const ph = kept.filter(function (p) { return decisions[p.id].album === a.id; });
      if (ph.length) groups.push({ title: a.name, sub: 'folder', photos: byDate(ph) });
    });
    const libr = kept.filter(function (p) { const al = decisions[p.id].album; return !al || al === 'keep' || al === 'library'; });
    if (libr.length) groups.push({ title: 'Keep — unsorted', sub: 'sort later', photos: byDate(libr) });
  } else {
    const months = {};
    kept.forEach(function (p) { (months[p.sortKey] = months[p.sortKey] || { title: p.month, sub: 'by date', sortKey: p.sortKey, photos: [] }).photos.push(p); });
    groups = Object.values(months).sort(function (a, b) { return a.sortKey < b.sortKey ? -1 : 1; }).map(function (g) { g.photos = byName(g.photos); return g; });
  }

  const trashedSorted = trashSort === 'name' ? byName(trashed) : byDate(trashed).reverse(); // date = newest first

  return (
    <div className="m-finish" data-screen-label="Wrap-up">
      <div className="m-finish-head">
        <div className="m-finish-top">
          <h1>Wrap up</h1>
          {onSettings && <button className="m-iconbtn" onClick={onSettings} aria-label="Settings"><MIcon name="settings" size={18} /></button>}
        </div>
        <div className="m-tallies">
          <div className="m-tally"><span className="num keep-c">{stats.kept}</span><span className="lbl">kept</span></div>
          <div className="m-tally"><span className="num archive-c">{stats.archived}</span><span className="lbl">archived</span></div>
          <div className="m-tally"><span className="num trash-c">{stats.trashed + deleted.length}</span><span className="lbl">trashed</span></div>
          <div className="m-tally"><span className="num later-c">{stats.later}</span><span className="lbl">later</span></div>
        </div>
        <div className="m-finish-actions">
          {stats.remaining > 0 && <button className="m-btn primary" onClick={onResume}>Resume ({stats.remaining} left)</button>}
          {later.length > 0 && <button className="m-btn" onClick={onReviewSkipped}>Review skipped ({later.length})</button>}
          <button className="m-btn ghost" onClick={onStartOver}>Start over</button>
        </div>
      </div>

      <section className="m-fsection">
        <div className="m-fsection-head">
          <h2>Kept &amp; organized</h2>
          <MSeg value={keptSort} onChange={setKeptSort} options={[{ v: 'date', l: 'Date' }, { v: 'album', l: 'Folder' }, { v: 'type', l: 'Type' }]} />
        </div>
        {groups.length === 0 && <p className="m-fempty">Nothing kept yet.</p>}
        {groups.map(function (g) {
          return (
            <div className="m-fgroup" key={g.title}>
              <h3>{g.title} <span className="fcount">{g.photos.length}</span> <span className="fsub">{g.sub}</span></h3>
              <div className="m-fgrid">{g.photos.map(function (p) { return <MThumb photo={p} key={p.id} />; })}</div>
            </div>
          );
        })}
      </section>

      {archived.length > 0 && (
        <section className="m-fsection">
          <h2 className="archive-c">Archived <span className="fcount">{archived.length}</span></h2>
          <p className="m-fempty">Tucked away, out of your main library. Tap Keep to bring one back.</p>
          <div className="m-fgrid">{byDate(archived).map(function (p) { return <MThumb photo={p} key={p.id} dim action="Keep" onAction={onKeepInstead} />; })}</div>
        </section>
      )}

      {later.length > 0 && (
        <section className="m-fsection">
          <h2 className="later-c">Decide later <span className="fcount">{later.length}</span></h2>
          <p className="m-fempty">These stay where they are.</p>
          <div className="m-fgrid">{byDate(later).map(function (p) { return <MThumb photo={p} key={p.id} />; })}</div>
        </section>
      )}

      <section className="m-fsection">
        <div className="m-fsection-head">
          <h2 className="trash-c">Trash <span className="fcount">{trashed.length}</span></h2>
          {trashed.length > 1 && <MSeg value={trashSort} onChange={setTrashSort} options={[{ v: 'date', l: 'Newest' }, { v: 'name', l: 'Name' }]} />}
        </div>
        {trashed.length === 0 && deleted.length === 0 && <p className="m-fempty">Trash is empty.</p>}
        {deleted.length > 0 && <p className="m-fempty">{deleted.length} files deleted.</p>}
        {trashed.length > 0 && (
          <div>
            <p className="m-fempty">Tap a file’s badge to rescue it.</p>
            <div className="m-fgrid">{trashedSorted.map(function (p) { return <MThumb photo={p} key={p.id} dim action="Keep" onAction={onKeepInstead} />; })}</div>
            {!armed && <button className="m-btn danger" onClick={function () { setArmed(true); }}>Delete {trashed.length} files…</button>}
            {armed && (
              <div className="m-confirm">
                <button className="m-btn danger" onClick={function () { setArmed(false); onConfirmDelete(trashed.map(function (p) { return p.id; })); }}>Permanently delete {trashed.length}</button>
                <button className="m-btn ghost" onClick={function () { setArmed(false); }}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

Object.assign(window, { MFinish, MSeg, MThumb });
