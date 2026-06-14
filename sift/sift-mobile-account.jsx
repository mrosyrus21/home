// Sift Mobile — Account (login) + Subscription (paywall) screens. Exported to window.
const { useState: aUseState } = React;

// ---- Login / create account ----
function MLogin({ onAuth, onClose }) {
  const [email, setEmail] = aUseState('');
  const [pw, setPw] = aUseState('');
  const [mode, setMode] = aUseState('in'); // 'in' | 'up'
  const valid = /.+@.+\..+/.test(email) && pw.length >= 4;
  function submit() { if (!valid) return; onAuth({ email: email, name: email.split('@')[0] }); }

  return (
    <div className="s-screen s-top" data-screen-label="Account">
      <div className="s-nav">
        <button className="s-back" onClick={onClose}><MIcon name="chevL" size={20} /> Settings</button>
        <span className="s-title">{mode === 'in' ? 'Sign in' : 'Create account'}</span>
      </div>
      <div className="lg-body">
        <div className="lg-logo">SIFT</div>
        <p className="lg-tag">{mode === 'in' ? 'Sign in to sync your folders and Plus across devices.' : 'Create an account to save your folders and subscription.'}</p>

        <div className="lg-field">
          <input className="lg-input" type="email" inputMode="email" autoCapitalize="none" placeholder="Email"
            value={email} onChange={function (e) { setEmail(e.target.value); }} />
        </div>
        <div className="lg-field">
          <input className="lg-input" type="password" placeholder="Password"
            value={pw} onChange={function (e) { setPw(e.target.value); }}
            onKeyDown={function (e) { if (e.key === 'Enter') submit(); }} />
        </div>
        <button className="lg-cta" disabled={!valid} onClick={submit}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>

        <div className="lg-or"><span>or</span></div>
        <button className="lg-social" onClick={function () { onAuth({ email: 'you@icloud.com', name: 'You', provider: 'Apple' }); }}>Continue with Apple</button>
        <button className="lg-social" onClick={function () { onAuth({ email: 'you@gmail.com', name: 'You', provider: 'Google' }); }}>Continue with Google</button>

        <button className="lg-switch" onClick={function () { setMode(mode === 'in' ? 'up' : 'in'); }}>
          {mode === 'in' ? "New here? Create an account" : 'Already have an account? Sign in'}
        </button>
        <p className="lg-fine">Beta build — sign-in is simulated and stays on this device. No password is sent anywhere.</p>
      </div>
    </div>
  );
}

// ---- Paywall / subscription ----
const PW_BENEFITS = ['Unlimited photos & videos', 'Every folder and the archive', 'Burst & duplicate compare', 'All future updates'];

function MPaywall({ mode, used, limit, pro, onSubscribe, onManage, onClose, onSeeResults }) {
  const [plan, setPlan] = aUseState('year');

  if (pro) {
    return (
      <div className="s-screen s-top" data-screen-label="Sift Plus">
        <div className="s-nav">
          <button className="s-back" onClick={onClose}><MIcon name="chevL" size={20} /> Settings</button>
          <span className="s-title">Sift Plus</span>
        </div>
        <div className="pw-body">
          <div className="pw-hero">
            <div className="pw-crown"><MIcon name="crown" size={30} /></div>
            <div className="pw-kicker">SIFT PLUS</div>
            <h1 className="pw-title">You're on Plus</h1>
            <p className="pw-sub">Unlimited photos and videos are unlocked. Thanks for supporting Sift.</p>
          </div>
          <div className="pw-benefits">
            {PW_BENEFITS.map(function (b) { return <div className="pw-benefit" key={b}><span className="pw-check"><MIcon name="check" size={16} /></span>{b}</div>; })}
          </div>
          <button className="pw-cta" onClick={onManage}>Cancel subscription</button>
          <p className="pw-fine">Beta build — no real charge was made.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="s-screen s-top" data-screen-label="Sift Plus">
      <div className="pw-body">
        {mode !== 'limit' && <button className="pw-close" onClick={onClose} aria-label="Close"><MIcon name="close" size={20} /></button>}
        <div className="pw-hero">
          <div className="pw-crown"><MIcon name="crown" size={30} /></div>
          <div className="pw-kicker">SIFT PLUS</div>
          <h1 className="pw-title">{mode === 'limit' ? 'You\u2019ve sorted ' + (used || limit) + ' photos' : 'Sort your whole library'}</h1>
          <p className="pw-sub">{mode === 'limit'
            ? 'That\u2019s the free limit. Upgrade to Plus to keep sifting your entire camera roll.'
            : 'Free covers your first ' + limit + ' photos. Plus unlocks everything, with no cap.'}</p>
        </div>

        <div className="pw-benefits">
          {PW_BENEFITS.map(function (b) { return <div className="pw-benefit" key={b}><span className="pw-check"><MIcon name="check" size={16} /></span>{b}</div>; })}
        </div>

        <div className="pw-plans">
          <button className={'pw-plan' + (plan === 'year' ? ' on' : '')} onClick={function () { setPlan('year'); }}>
            <div className="pw-plan-top"><span className="pw-plan-name">Yearly</span><span className="pw-tag">SAVE 44%</span></div>
            <div className="pw-plan-price">$19.99<span>/yr</span></div>
            <div className="pw-plan-sub">just $1.67/mo</div>
          </button>
          <button className={'pw-plan' + (plan === 'month' ? ' on' : '')} onClick={function () { setPlan('month'); }}>
            <div className="pw-plan-top"><span className="pw-plan-name">Monthly</span></div>
            <div className="pw-plan-price">$2.99<span>/mo</span></div>
            <div className="pw-plan-sub">billed monthly</div>
          </button>
        </div>

        <button className="pw-cta" onClick={function () { onSubscribe(plan); }}>Start Plus</button>
        {mode === 'limit'
          ? <button className="pw-dismiss" onClick={onSeeResults}>See my results so far</button>
          : <button className="pw-dismiss" onClick={onClose}>Not now</button>}
        <p className="pw-fine">Beta build — no real charge. Cancel anytime.</p>
      </div>
    </div>
  );
}

Object.assign(window, { MLogin, MPaywall });
