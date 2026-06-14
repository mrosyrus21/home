// Sift Mobile — in-app Settings screen (iOS-style grouped list). Exported to window.
const { useState: sUseState } = React;

// iOS-style toggle switch
function SSwitch({ on, onChange }) {
  return (
    <button type="button" className={'s-switch' + (on ? ' on' : '')} role="switch" aria-checked={on}
      onClick={function () { onChange(!on); }}></button>
  );
}

const S_THEMES = [
  { v: 'charcoal', l: 'Charcoal' }, { v: 'black', l: 'Black' }, { v: 'warm', l: 'Warm' },
  { v: 'midnight', l: 'Midnight' }, { v: 'light', l: 'Light' }, { v: 'sand', l: 'Sand' }
];
// Well-rounded accent palette across the hue wheel, plus neutral white & grays
const S_ACCENTS = ['#C792EA', '#7C83FF', '#5B9DFF', '#3FBFAE', '#4FB573', '#E8C84D', '#E8A33D', '#F2784B', '#F2627E', '#ED6FB3', '#FFFFFF', '#CBD0D9', '#9CA2AE'];

function MSettings({ open, onClose, t, setTweak, folders, counts, onAddFolder, onRenameFolder, onDeleteFolder, onStartOver, auth, pro, used, limit, onOpenLogin, onOpenPay, onSignOut }) {
  const [newName, setNewName] = sUseState('');
  function addNew() { const n = newName.trim(); if (!n) return; onAddFolder(n); setNewName(''); }
  const totalItems = (window.SIFT_DATA && window.SIFT_DATA.allPhotos.length) || 0;
  const initial = auth && auth.email ? auth.email[0].toUpperCase() : '?';

  return (
    <div className="s-screen" data-screen-label="Settings">
      <div className="s-nav">
        <button className="s-back" onClick={onClose}><MIcon name="chevL" size={20} /> Done</button>
        <span className="s-title">Settings</span>
      </div>

      <div className="s-body">
        <div className="s-group">
          <div className="s-card">
            {auth ? (
              <button className="s-profile" onClick={onSignOut}>
                <span className="s-avatar">{initial}</span>
                <span className="s-prof-text">
                  <span className="s-prof-name">{auth.name || 'Signed in'}</span>
                  <span className="s-prof-sub">{auth.email}</span>
                </span>
                <span className="s-value">Sign out</span>
              </button>
            ) : (
              <button className="s-row" onClick={onOpenLogin}>
                <span className="s-ico"><MIcon name="user" size={18} /></span>
                <span className="s-label">Sign in or create account</span>
                <span className="s-chev"><MIcon name="chevR" size={16} /></span>
              </button>
            )}
          </div>
          <p className="s-note">Sign in to sync your folders and Plus subscription across devices.</p>
        </div>

        <div className="s-group">
          <div className="s-group-label">Subscription</div>
          <div className="s-card">
            <button className="s-row" onClick={onOpenPay}>
              <span className="s-ico" style={{ color: 'var(--accent)' }}><MIcon name="crown" size={18} /></span>
              <span className="s-label">Sift Plus</span>
              {pro
                ? <span className="s-badge">ACTIVE</span>
                : <span className="s-value">{used} / {limit} free</span>}
              <span className="s-chev"><MIcon name="chevR" size={16} /></span>
            </button>
          </div>
          <p className="s-note">{pro ? 'Unlimited photos and videos. Thanks for supporting Sift.' : 'Free covers ' + limit + ' photos. Go unlimited with Plus.'}</p>
        </div>

        <div className="s-group">
          <div className="s-group-label">Appearance</div>
          <div className="s-card">
            {S_THEMES.map(function (o) {
              return (
                <button className="s-row" key={o.v} onClick={function () { setTweak('theme', o.v); }}>
                  <span className="s-label">{o.l}</span>
                  {t.theme === o.v && <span className="s-check"><MIcon name="check" size={18} /></span>}
                </button>
              );
            })}
          </div>
          <div className="s-group-label" style={{ marginTop: 16 }}>Accent color</div>
          <div className="s-card">
            <div className="s-swatches">
              {S_ACCENTS.map(function (c) {
                return <button className={'s-swatch' + (t.accent === c ? ' on' : '')} key={c} style={{ background: c }}
                  aria-label={'Accent ' + c} onClick={function () { setTweak('accent', c); }}></button>;
              })}
            </div>
          </div>
        </div>

        <div className="s-group">
          <div className="s-group-label">Review</div>
          <div className="s-card">
            <div className="s-row">
              <span className="s-label">Swipe hints</span>
              <SSwitch on={t.hints !== false} onChange={function (v) { setTweak('hints', v); }} />
            </div>
            <div className="s-row">
              <span className="s-label">Haptic feedback</span>
              <SSwitch on={t.haptics !== false} onChange={function (v) { setTweak('haptics', v); }} />
            </div>
          </div>
          <p className="s-note">Swipe right to keep, left to trash, down for later — a quick flick counts too.</p>
        </div>

        <div className="s-group">
          <div className="s-group-label">Folders</div>
          <div className="s-card">
            {folders.map(function (f) {
              return (
                <div className="s-folder" key={f.id}>
                  <span className="s-ico"><MIcon name="album" size={18} /></span>
                  <input className="s-folder-name" value={f.name} aria-label="Folder name"
                    onChange={function (e) { onRenameFolder(f.id, e.target.value); }} />
                  {counts && counts[f.id] > 0 && <span className="s-folder-count">{counts[f.id]}</span>}
                  <button className="s-del" onClick={function () { onDeleteFolder(f.id); }} aria-label={'Delete ' + f.name}><MIcon name="trash" size={17} /></button>
                </div>
              );
            })}
            <div className="s-new">
              <input value={newName} placeholder="New folder — e.g. Mom, Dog"
                onChange={function (e) { setNewName(e.target.value); }}
                onKeyDown={function (e) { if (e.key === 'Enter') addNew(); }} />
              <button onClick={addNew} disabled={!newName.trim()}>Add</button>
            </div>
          </div>
          <p className="s-note">Rename a folder by tapping its name. Deleting one keeps its photos — they move back to your general Keep pile.</p>
        </div>

        <div className="s-group">
          <div className="s-group-label">Data &amp; privacy</div>
          <div className="s-card">
            <button className="s-row danger" onClick={function () { onStartOver(); onClose(); }}>
              <span className="s-ico"><MIcon name="undo" size={18} /></span>
              <span className="s-label">Start over — clear all decisions</span>
            </button>
          </div>
          <p className="s-note">Private by design. Your photos and choices stay on this device — nothing is ever uploaded.</p>
        </div>

        <div className="s-group">
          <div className="s-group-label">About</div>
          <div className="s-card">
            <div className="s-row"><span className="s-label">Version</span><span className="s-value">1.0.0 (beta)</span></div>
            <div className="s-row"><span className="s-label">Library</span><span className="s-value">{totalItems} items</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MSettings, SSwitch });
