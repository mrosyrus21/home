// Wrap-up screen: organized keeps, skipped pile, trash, and disk actions.
const FS = { useState: React.useState };

function FThumb({ photo, action, onAction, dim }) {
  return (
    <figure className={'fthumb' + (dim ? ' dim' : '')}>
      <div className="fthumb-media">
        <DiskThumb photo={photo} />
        {photo.type === 'video' && <span className="fplay"><SIcon name="play" size={14} /></span>}
        {photo.type === 'video' && photo.dur && <span className="fthumb-dur">{photo.dur}</span>}
      </div>
      <figcaption>{photo.name}</figcaption>
      {action && <button className="fthumb-action" onClick={function () { onAction(photo.id); }}>{action}</button>}
    </figure>
  );
}

function FinishScreen({ lib, folders, decisions, deleted, stats, destFor, onResume, onReviewSkipped, onConfirmDelete, onKeepInstead, onStartOver, onApply, applying, applied, onDownloadScript, onOpenFolder }) {
  const [armed, setArmed] = FS.useState(false);
  const mode = lib.source; // 'demo' | 'fs' | 'plan'
  const all = lib.allPhotos;
  const deletedSet = {};
  deleted.forEach(function (id) { deletedSet[id] = true; });

  const kept = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'keep'; });
  const archived = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'archive'; });
  const trashed = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'trash' && !deletedSet[p.id]; });
  const later = all.filter(function (p) { const d = decisions[p.id]; return d && d.verdict === 'later'; });
  const moveCount = kept.length + trashed.length + archived.length;

  // Build ordered keep groups: user folders first, then the general Keep pile.
  const groups = [];
  folders.forEach(function (a) {
    const ph = kept.filter(function (p) { return decisions[p.id].album === a.id; });
    if (ph.length) groups.push({ title: a.name, sub: 'folder', photos: ph });
  });
  const general = kept.filter(function (p) { const al = decisions[p.id].album; return !al || al === 'keep' || al === 'library'; });
  if (general.length) groups.push({ title: 'Keep — sort later', sub: 'general', photos: general });

  return (
    <div className="finish" data-screen-label="Wrap-up">
      <div className="finish-inner">
        <header className="finish-head">
          <h1>Wrap up</h1>
          <p className="finish-sub">
            <span className="keep-c">{stats.kept} kept</span> · <span className="archive-c">{stats.archived} archived</span> · <span className="trash-c">{stats.trashed + deleted.length} trashed</span> · <span className="later-c">{stats.later} for later</span>
            {stats.remaining > 0 && <span className="dim-c"> · {stats.remaining} unreviewed</span>}
          </p>
          <div className="finish-actions">
            {stats.remaining > 0 && <button className="btn primary" onClick={onResume}>Resume reviewing ({stats.remaining} left)</button>}
            {later.length > 0 && <button className="btn" onClick={onReviewSkipped}>Review skipped ({later.length})</button>}
            <button className="btn ghost" onClick={onStartOver}>Start over</button>
          </div>
        </header>

        {mode === 'fs' && moveCount > 0 && (
          <section className="fsection">
            <div className="apply-box">
              {applied ? (
                <div>
                  <p className="apply-title keep-c">Done — moved {applied.moved} files on disk.</p>
                  {applied.failed.length > 0 && <p className="apply-note trash-c">{applied.failed.length} failed: {applied.failed.join(', ')}</p>}
                  <button className="btn" onClick={onOpenFolder}>Rescan folder</button>
                </div>
              ) : applying ? (
                <p className="apply-title">Moving file {applying.done} of {applying.total}…</p>
              ) : (
                <div>
                  <button className="btn primary" onClick={onApply}>Apply to disk — move {kept.length} keeps, {archived.length} to Archive, {trashed.length} to _Trash</button>
                  <p className="apply-note">Keeps move into <span className="mono">Sorted/&lt;folder&gt;</span> inside “{lib.name}”, archived into <span className="mono">Archive/</span>, trash into <span className="mono">_Trash/</span> — nothing is permanently deleted.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {mode === 'plan' && moveCount > 0 && (
          <section className="fsection">
            <div className="apply-box">
              <button className="btn primary" onClick={onDownloadScript}>Download organize script (.bat) — {moveCount} moves</button>
              <p className="apply-note">This browser can’t move files directly. Put <span className="mono">sift-organize.bat</span> inside “{lib.name}” and double-click it: keeps move into <span className="mono">Sorted/</span>, trash into <span className="mono">_Trash/</span>.</p>
            </div>
          </section>
        )}

        <section className="fsection">
          <h2>Kept &amp; organized</h2>
          {groups.length === 0 && <p className="fempty">Nothing kept yet.</p>}
          {groups.map(function (g) {
            return (
              <div className="fgroup" key={g.title}>
                <h3>{g.title} <span className="fcount">{g.photos.length}</span> <span className="fsub">{mode === 'demo' ? g.sub : '→ ' + destFor(g.photos[0])}</span></h3>
                <div className="fgrid">
                  {g.photos.map(function (p) { return <FThumb photo={p} key={p.id} />; })}
                </div>
              </div>
            );
          })}
        </section>

        {archived.length > 0 && (
          <section className="fsection">
            <h2 className="archive-c">Archived <span className="fcount">{archived.length}</span></h2>
            <p className="fempty">{mode === 'demo' ? 'Tucked away, out of your main library — hover to bring one back.' : (applied ? 'Moved to Archive/.' : 'These move to an Archive/ folder — hover a photo to keep it instead.')}</p>
            <div className="fgrid">
              {archived.map(function (p) { return <FThumb photo={p} key={p.id} dim action="Keep" onAction={onKeepInstead} />; })}
            </div>
          </section>
        )}

        {later.length > 0 && (
          <section className="fsection">
            <h2>Decide later <span className="fcount">{later.length}</span></h2>
            <p className="fempty">These stay where they are.</p>
            <div className="fgrid">
              {later.map(function (p) { return <FThumb photo={p} key={p.id} />; })}
            </div>
          </section>
        )}

        <section className="fsection">
          <h2 className="trash-c">Trash <span className="fcount">{trashed.length}</span></h2>
          {trashed.length === 0 && deleted.length === 0 && <p className="fempty">Trash is empty.</p>}
          {deleted.length > 0 && <p className="fempty">{deleted.length} photos permanently deleted.</p>}
          {trashed.length > 0 && (
            <div>
              {mode !== 'demo' && <p className="fempty">{applied ? 'Moved to _Trash/.' : 'These move to the _Trash folder — hover a photo to rescue it.'}</p>}
              <div className="fgrid">
                {trashed.map(function (p) { return <FThumb photo={p} key={p.id} dim action="Keep instead" onAction={onKeepInstead} />; })}
              </div>
              {mode === 'demo' && !armed && <button className="btn danger" onClick={function () { setArmed(true); }}>Delete {trashed.length} photos…</button>}
              {mode === 'demo' && armed && (
                <span className="confirm-row">
                  <button className="btn danger" onClick={function () { setArmed(false); onConfirmDelete(trashed.map(function (p) { return p.id; })); }}>Permanently delete {trashed.length} photos</button>
                  <button className="btn ghost" onClick={function () { setArmed(false); }}>Cancel</button>
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { FinishScreen });
