// Sift Desktop — Settings, Login, and Paywall overlays (centered modals). Exported to window.
const { useState: dUseState } = React;

const D_THEMES = [
  { v: 'charcoal', l: 'Charcoal' }, { v: 'black', l: 'Black' }, { v: 'warm', l: 'Warm' },
  { v: 'midnight', l: 'Midnight' }, { v: 'light', l: 'Light' }, { v: 'sand', l: 'Sand' }
];
const D_ACCENTS = ['#C792EA', '#7C83FF', '#5B9DFF', '#3FBFAE', '#4FB573', '#E8C84D', '#E8A33D', '#F2784B', '#F2627E', '#ED6FB3', '#FFFFFF', '#CBD0D9', '#9CA2AE'];
const D_BENEFITS = ['Unlimited photos & videos', 'Every folder and the archive', 'Burst & duplicate compare', 'Apply moves on disk, no cap', 'All future updates'];

function Modal({ onClose, wide, children, label }) {
  return (
    <div className="d-scrim" onMouseDown={onClose}>
      <div className={'d-modal' + (wide ? ' wide' : '')} data-screen-label={label} onMouseDown={function (e) { e.stopPropagation(); }}>
        {children}
      </div>
    </div>
  );
}

// ---- Settings ----
function DSettings({ onClose, t, setTweak, folders, counts, onAddFolder, onRenameFolder, onDeleteFolder, onStartOver, auth, pro, used, limit, onOpenLogin, onOpenPay, onSignOut }) {
  const [newName, setNewName] = dUseState('');
  function addNew() { const n = newName.trim(); if (!n) return; onAddFolder(n); setNewName(''); }
  const totalItems = (window.SIFT_DATA && window.SIFT_DATA.allPhotos.length) || 0;

  return (
    <Modal onClose={onClose} wide label="Settings">
      <div className="d-modal-head">
        <h2>Settings</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><SIcon name="close" size={16} /></button>
      </div>
      <div className="d-settings-body">
        <div className="d-sgroup">
          <div className="d-slabel">Account</div>
          <div className="d-scard">
            {auth ? (
              <div className="d-srow">
                <span className="d-avatar">{auth.email[0].toUpperCase()}</span>
                <span className="d-prof"><span className="d-prof-name">{auth.name || 'Signed in'}</span><span className="d-prof-sub">{auth.email}</span></span>
                <button className="btn ghost small" onClick={onSignOut}>Sign out</button>
              </div>
            ) : (
              <button className="d-srow click" onClick={onOpenLogin}>
                <span className="d-sico"><SIcon name="user" size={17} /></span>
                <span className="d-sflex">Sign in or create account</span>
                <SIcon name="chevR" size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="d-sgroup">
          <div className="d-slabel">Subscription</div>
          <div className="d-scard">
            <button className="d-srow click" onClick={onOpenPay}>
              <span className="d-sico accent-i"><SIcon name="crown" size={17} /></span>
              <span className="d-sflex">Sift Plus</span>
              {pro ? <span className="d-badge">ACTIVE</span> : <span className="d-sval">{used} / {limit} free</span>}
              <SIcon name="chevR" size={15} />
            </button>
          </div>
          <p className="d-snote">{pro ? 'Unlimited photos and videos unlocked.' : 'Free covers ' + limit + ' photos. Plus removes the cap.'}</p>
        </div>

        <div className="d-sgroup">
          <div className="d-slabel">Appearance</div>
          <div className="d-scard pad">
            <div className="d-field-label">Surface</div>
            <div className="d-theme-grid">
              {D_THEMES.map(function (o) {
                return (
                  <button className={'d-theme t-' + o.v + (t.theme === o.v ? ' on' : '')} key={o.v} onClick={function () { setTweak('theme', o.v); }}>
                    <span className="d-theme-swatch"></span><span className="d-theme-name">{o.l}</span>
                  </button>
                );
              })}
            </div>
            <div className="d-field-label" style={{ marginTop: 16 }}>Accent</div>
            <div className="d-swatches">
              {D_ACCENTS.map(function (c) {
                return <button className={'d-swatch' + (t.accent === c ? ' on' : '')} key={c} style={{ background: c }} aria-label={'Accent ' + c} onClick={function () { setTweak('accent', c); }}></button>;
              })}
            </div>
          </div>
        </div>

        <div className="d-sgroup">
          <div className="d-slabel">Folders</div>
          <div className="d-scard">
            {folders.map(function (f) {
              return (
                <div className="d-folder" key={f.id}>
                  <span className="d-sico"><SIcon name="folder" size={16} /></span>
                  <input className="d-folder-name" value={f.name} onChange={function (e) { onRenameFolder(f.id, e.target.value); }} />
                  {counts[f.id] > 0 && <span className="d-fcount">{counts[f.id]}</span>}
                  <button className="d-del" onClick={function () { onDeleteFolder(f.id); }} aria-label={'Delete ' + f.name}><SIcon name="trash" size={15} /></button>
                </div>
              );
            })}
            <div className="d-folder-new">
              <input value={newName} placeholder="New folder — e.g. Mom, Dog, Travel" onChange={function (e) { setNewName(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') addNew(); }} />
              <button className="btn small primary" onClick={addNew} disabled={!newName.trim()}>Add</button>
            </div>
          </div>
          <p className="d-snote">Rename by editing the name. Deleting a folder keeps its photos — they fall back to the general Keep pile.</p>
        </div>

        <div className="d-sgroup">
          <div className="d-slabel">Data &amp; privacy</div>
          <div className="d-scard">
            <button className="d-srow click danger" onClick={function () { onStartOver(); onClose(); }}>
              <span className="d-sico"><SIcon name="undo" size={16} /></span>
              <span className="d-sflex">Start over — clear all decisions</span>
            </button>
          </div>
          <p className="d-snote">Private by design. Your photos and choices stay on this device — nothing is uploaded.</p>
        </div>

        <div className="d-sgroup">
          <div className="d-slabel">About</div>
          <div className="d-scard">
            <div className="d-srow"><span className="d-sflex">Version</span><span className="d-sval">1.0.0 (beta)</span></div>
            <div className="d-srow"><span className="d-sflex">Library</span><span className="d-sval">{totalItems} items</span></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ---- Login ----
function DLogin({ onAuth, onClose }) {
  const [email, setEmail] = dUseState('');
  const [pw, setPw] = dUseState('');
  const [mode, setMode] = dUseState('in');
  const valid = /.+@.+\..+/.test(email) && pw.length >= 4;
  function submit() { if (!valid) return; onAuth({ email: email, name: email.split('@')[0] }); }
  return (
    <Modal onClose={onClose} label="Account">
      <div className="d-login">
        <button className="icon-btn d-modal-x" onClick={onClose} aria-label="Close"><SIcon name="close" size={16} /></button>
        <div className="d-login-logo">SIFT</div>
        <h2 className="d-login-title">{mode === 'in' ? 'Sign in' : 'Create account'}</h2>
        <p className="d-login-tag">{mode === 'in' ? 'Sync your folders and Plus across devices.' : 'Save your folders and subscription.'}</p>
        <input className="d-input" type="email" autoCapitalize="none" placeholder="Email" value={email} onChange={function (e) { setEmail(e.target.value); }} />
        <input className="d-input" type="password" placeholder="Password" value={pw} onChange={function (e) { setPw(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') submit(); }} />
        <button className="btn primary block" disabled={!valid} onClick={submit}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <div className="d-or"><span>or</span></div>
        <button className="btn block" onClick={function () { onAuth({ email: 'you@icloud.com', name: 'You', provider: 'Apple' }); }}>Continue with Apple</button>
        <button className="btn block" onClick={function () { onAuth({ email: 'you@gmail.com', name: 'You', provider: 'Google' }); }}>Continue with Google</button>
        <button className="d-link" onClick={function () { setMode(mode === 'in' ? 'up' : 'in'); }}>{mode === 'in' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
        <p className="d-fine">Beta build — sign-in is simulated and stays on this device.</p>
      </div>
    </Modal>
  );
}

// ---- Paywall ----
function DPaywall({ mode, used, limit, pro, onSubscribe, onManage, onClose, onSeeResults }) {
  const [plan, setPlan] = dUseState('year');
  if (pro) {
    return (
      <Modal onClose={onClose} label="Sift Plus">
        <div className="d-pay">
          <button className="icon-btn d-modal-x" onClick={onClose} aria-label="Close"><SIcon name="close" size={16} /></button>
          <div className="d-pay-crown"><SIcon name="crown" size={28} /></div>
          <div className="d-pay-kicker">SIFT PLUS</div>
          <h2 className="d-pay-title">You're on Plus</h2>
          <p className="d-pay-sub">Unlimited photos and videos are unlocked. Thanks for supporting Sift.</p>
          <div className="d-benefits">{D_BENEFITS.map(function (b) { return <div className="d-benefit" key={b}><span className="d-check"><SIcon name="check" size={14} /></span>{b}</div>; })}</div>
          <button className="btn block" onClick={onManage}>Cancel subscription</button>
          <p className="d-fine">Beta build — no real charge was made.</p>
        </div>
      </Modal>
    );
  }
  return (
    <Modal onClose={mode === 'limit' ? function () {} : onClose} wide label="Sift Plus">
      <div className="d-pay wide">
        {mode !== 'limit' && <button className="icon-btn d-modal-x" onClick={onClose} aria-label="Close"><SIcon name="close" size={16} /></button>}
        <div className="d-pay-left">
          <div className="d-pay-crown"><SIcon name="crown" size={28} /></div>
          <div className="d-pay-kicker">SIFT PLUS</div>
          <h2 className="d-pay-title">{mode === 'limit' ? 'You\u2019ve sorted ' + (used || limit) + ' photos' : 'Sort your whole library'}</h2>
          <p className="d-pay-sub">{mode === 'limit' ? 'That\u2019s the free limit. Upgrade to Plus to keep sifting your entire library.' : 'Free covers your first ' + limit + ' photos. Plus unlocks everything, with no cap.'}</p>
          <div className="d-benefits">{D_BENEFITS.map(function (b) { return <div className="d-benefit" key={b}><span className="d-check"><SIcon name="check" size={14} /></span>{b}</div>; })}</div>
        </div>
        <div className="d-pay-right">
          <button className={'d-plan' + (plan === 'year' ? ' on' : '')} onClick={function () { setPlan('year'); }}>
            <div className="d-plan-top"><span className="d-plan-name">Yearly</span><span className="d-tag">SAVE 44%</span></div>
            <div className="d-plan-price">$19.99<span>/yr</span></div><div className="d-plan-sub">just $1.67/mo</div>
          </button>
          <button className={'d-plan' + (plan === 'month' ? ' on' : '')} onClick={function () { setPlan('month'); }}>
            <div className="d-plan-top"><span className="d-plan-name">Monthly</span></div>
            <div className="d-plan-price">$2.99<span>/mo</span></div><div className="d-plan-sub">billed monthly</div>
          </button>
          <button className="btn primary block big" onClick={function () { onSubscribe(plan); }}>Start Plus</button>
          {mode === 'limit'
            ? <button className="d-link" onClick={onSeeResults}>See my results so far</button>
            : <button className="d-link" onClick={onClose}>Not now</button>}
          <p className="d-fine">Beta build — no real charge. Cancel anytime.</p>
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { DSettings, DLogin, DPaywall });
