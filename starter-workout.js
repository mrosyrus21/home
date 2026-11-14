// Guided starter: navigation is local UI state; only Finish writes completion.
const STARTER_FORM_GUIDES={
  'Counter pushup':{file:'counter-pushup.png',alt:'Counter pushup form: hands on a fixed counter, body straight, chest moving toward the counter and then away.',cue:'Keep your body straight. Bring your chest toward the counter, then push away.'},
  'Bodyweight mini-squat':{file:'mini-squat.png',alt:'Bodyweight mini-squat form: a small bend at the hips and knees, with heels on the floor, then standing tall.',cue:'Make a small, comfortable bend. Keep your heels down, then stand tall.'},
  'Supported one-arm row':{file:'supported-row.png',alt:'Supported one-arm row form: free hand on a fixed counter, wrist straight, working elbow pulling toward the hip.',cue:'Support your free hand. Keep the working wrist straight and pull your elbow toward your hip.'},
  'Unloaded hip hinge':{file:'hip-hinge.png',alt:'Unloaded hip-hinge form: soft knees, hips moving backward, torso tipping forward with a comfortably straight back.',cue:'Push your hips back with soft knees. Keep your back comfortably straight.'},
  'suitcase-hold':{file:'suitcase-hold.png',alt:'Optional suitcase hold form: standing tall with one dumbbell at the side and a straight wrist.',cue:'Optional: stand tall, hold at your side, keep your wrist straight, and breathe. Lighter or skip is fine.'},
  'hammer-curl':{file:'hammer-curl.png',alt:'Light hammer curl form: thumbs up, elbow beside the body, curling without swinging and lowering slowly.',cue:'Thumb up, elbow by your side. Curl without swinging, then lower slowly.'},
  'floor-press':{file:'floor-press.png',alt:'One-arm floor press form: lying face up with bent knees, upper arm angled away from the body and forearm upright, then pressing above the chest.',cue:'Lie face up with knees bent. Press above your chest; lower until your upper arm rests on the floor.'},
  'triceps-kickback':{file:'triceps-kickback.png',alt:'Supported triceps kickback form: free hand on a fixed counter, upper arm alongside the ribs, straightening the working elbow behind the body.',cue:'Keep your upper arm still beside your ribs. Straighten the elbow behind you, then slowly bend.'}
};
function starterFormHtml(key){const guide=STARTER_FORM_GUIDES[key];if(!guide)return '';const e=almanacEsc;return '<figure class="sg-form"><img src="./images/starter-form/'+guide.file+'?v=20261114190000" width="800" height="420" loading="eager" decoding="async" alt="'+e(guide.alt)+'"><figcaption>'+e(guide.cue)+'</figcaption></figure>';}
function starterConfig(){return hcCfg().workouts.starter;}
function starterApplies(date){const c=starterConfig();return !!c&&date>=c.startDate;}
function starterDone(date){return !!laundry['well-workout-'+date]||!!laundry['health-workout-'+date];}
function starterCompletedDates(date){
  const c=starterConfig(), dates=new Set();
  Object.keys(laundry).forEach(key=>{const m=/^(?:well|health)-workout-(\d{4}-\d{2}-\d{2})$/.exec(key);if(m&&laundry[key]&&m[1]>=(c.historyStartDate||c.startDate)&&m[1]<=date)dates.add(m[1]);});
  return Array.from(dates).sort();
}
function starterPlanForDate(date){
  const c=starterConfig(), count=starterCompletedDates(date).length;
  const dow=new Date(date+'T12:00:00').getDay();
  const scheduled=date===c.startDate||(date!==c.recoveryDate&&c.strengthDays.includes(dow));
  const review=count>=c.targetSessions;
  return {starter:true,type:scheduled?'strength':'mobility',workoutKey:'starter',
    title:scheduled?c.title:'Comfortable walk / recovery',
    badge:(date===c.startDate?'Day 1 · ':'')+(scheduled?'Strength':'Recovery')+' · '+count+' sessions logged',
    duration:c.duration,rpe:'Easy practice · several good reps left',dose:'1 set of each of 4 exercises. No automatic increases.',
    coach:scheduled?'Smooth movement. Stop before strain.':'No lifting planned today. Easy walking or rest is enough.',
    list:c.exercises.map(x=>x.title+' — '+x.dose),completed:count,scheduled:scheduled,review:review};
}
function starterUi(date){
  if(!window.__starterUI||window.__starterUI.date!==date){
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('hg-starter-'+date));}catch(_){}
    window.__starterUI={date:date,step:Math.max(0,Math.min(5,Number(saved&&saved.step)||0)),started:!!(saved&&saved.started),safe:!!(saved&&saved.safe)};
  }
  return window.__starterUI;
}
function starterStore(){try{sessionStorage.setItem('hg-starter-'+window.__starterUI.date,JSON.stringify(window.__starterUI));}catch(_){} }
function starterVisibleSurface(){return typeof document.querySelectorAll==='function'?Array.from(document.querySelectorAll('[data-starter-surface]')).find(el=>el.getClientRects().length>0):document.querySelector('[data-starter-surface]');}
function starterFocusSnapshot(){const el=document.activeElement,surface=starterVisibleSurface();if(!el||!surface||!surface.contains(el))return null;const label=el.getAttribute('aria-label');return ['Previous workout step','Next workout step','Previous stretch','Next stretch'].includes(label)?label:el.matches('input[type="checkbox"]')?'safety':null;}
function starterRestoreFocus(key){if(!key)return;const surface=starterVisibleSurface();const el=surface&&surface.querySelector(key==='safety'?'input[type="checkbox"]':'button[aria-label="'+key+'"]');if(el&&!el.disabled)el.focus({preventScroll:true});}
function starterRefresh(){
  const state=starterUi(todayKey());starterStore();
  const focus=starterFocusSnapshot(),el=starterVisibleSurface(), top=el&&el.getBoundingClientRect().top;
  renderAll();
  const fresh=starterVisibleSurface();starterRestoreFocus(focus);
  if(fresh&&top!=null)window.scrollBy(0,fresh.getBoundingClientRect().top-top);
}
function starterNavigate(delta){const s=starterUi(todayKey());s.step=Math.max(0,Math.min(5,s.step+delta));starterRefresh();const surface=starterVisibleSurface(),step=surface&&surface.querySelector('.sg-step');if(step){const r=step.getBoundingClientRect();if(r.top<0||r.top>window.innerHeight/2)step.scrollIntoView({block:'start'});}}
function starterSafety(checked){starterUi(todayKey()).safe=!!checked;starterRefresh();}
function starterReadiness(date){const n=new Date();return healthCoachState(date,n.getHours()*60+n.getMinutes(),new Date(date+'T12:00:00').getDay());}
function starterCanBegin(date){const p=starterPlanForDate(date);return !!window.__stateHydrated&&p.type==='strength'&&!starterDone(date)&&starterUi(date).safe&&fitnessPlanAllowed(starterReadiness(date),p);}
function starterBegin(){
  const date=todayKey();if(!starterCanBegin(date)){toast('Food, water and a safe, well-rested body first. The guide stays readable.');return;}
  const s=starterUi(date);s.started=true;s.step=1;starterRefresh();
}
function starterFinish(){
  const date=todayKey(), s=starterUi(date);
  if(starterDone(date)||window.__starterLogPending)return;
  if(s.step!==5||!s.started||!starterCanBegin(date)){toast('Only log a completed, safe starter session.');return;}
  const key='well-workout-'+date, updates={};updates['laundry/'+key]=true;
  window.__starterLogPending=true;laundry[key]=true;
  try{
    const request=ST.update(updates);
    if(request&&typeof request.catch==='function')request.catch(()=>{delete laundry[key];window.__starterLogPending=false;toast('Could not save. Please reconnect and try Finish again.');renderAll();});
  }catch(error){delete laundry[key];window.__starterLogPending=false;toast('Could not save. Please reconnect and try Finish again.');renderAll();return;}
  window.__starterLogPending=false;starterStore();renderAll();
}
function starterOpen(){
  if(window.__checklistDisclosure)window.__checklistDisclosure.open.morning=true;
  starterUi(todayKey());renderAll();
  const el=starterVisibleSurface();if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}
function starterSurfaceHtml(date){
  const p=starterPlanForDate(date), c=starterConfig(), s=starterUi(date), e=almanacEsc, done=starterDone(date);
  const st=starterReadiness(date), allowed=starterCanBegin(date);
  let content='';
  if(done){content='<h3>Session logged ✓</h3><p>You showed up. Recover, eat your normal next meal and keep water available.</p><p>'+p.completed+' strength sessions logged.</p>'+(p.review?'<h3>Review recovery</h3><p>Review comfort and recovery before changing anything; no automatic increase. Your current full plan remains available.</p>':'');}
  else if(s.step===0){content='<h3>Warm up first</h3><p class="sg-dose">5 easy minutes</p><p>Walk or march, then try a few comfortable practice squats and hip hinges. This is practice, not a test.</p><p>Eat and drink first. Breakfast counts—no extra snack needed if you have eaten.</p><label class="sg-safety"><input type="checkbox" onchange="starterSafety(this.checked)" '+(s.safe?'checked':'')+'>I feel well and rested, with no new pain, tingling, numbness or weakness.</label><button type="button" class="sg-primary" onclick="starterBegin()" '+(!allowed?'disabled':'')+'>Start after warm-up</button><p class="sg-hint">'+e(fitnessGateMessage(st,p))+' You can preview all instructions with Next.</p>';}
  else if(s.step===5){content='<h3>Finish, then recover</h3><p>Walk slowly until breathing settles. No extra required sets today.</p>'+starterFormHtml('suitcase-hold')+'<details class="sg-optional-grip"><summary>Optional grip / forearm: suitcase hold</summary><p>Not a fifth required exercise. Stand tall, wrist straight, and hold one 20 lb dumbbell at your side for 10–15 seconds each side, once. Breathe normally. Use a lighter secure handled item or skip if needed. No gripper maxes; no straining or failure.</p><p>Skip if you are not recovered, safely fueled and hydrated, or have any pain, tingling, numbness or weakness. It has no separate completion requirement. Choose this OR a curl/kickback, never on top of them. If you already finished today, do not restart for an add-on.</p></details><p>Only log if you actually completed the four exercises. Reading this page does not count.</p><button type="button" class="sg-primary" onclick="starterFinish()" '+(!allowed||!s.started?'disabled':'')+'>Finish and log session</button>'+(!s.started?'<p>Preview only. Go back to warm-up and Start when ready.</p>':'')+'<p class="sg-hint">'+e(fitnessGateMessage(st,p))+'</p>';}
  else {const x=c.exercises[s.step-1];content='<div class="sg-count">'+s.step+' of 4 exercises</div><h3>'+e(x.title)+'</h3><p class="sg-dose">'+e(x.dose)+'</p><p class="sg-load">'+e(x.load)+'</p><div class="sg-form-layout">'+starterFormHtml(x.title)+'<div><ol>'+x.steps.map(t=>'<li>'+e(t)+'</li>').join('')+'</ol><p class="sg-rest">Rest '+e(c.rest)+'</p><details><summary>Easier option &amp; technique</summary><p>'+e(x.easier)+'</p><a href="'+e(x.demo[1])+'" target="_blank" rel="noopener noreferrer">'+e(x.demo[0])+' ↗</a></details></div></div>';}
  const navigation=!done?'<nav class="sg-nav" aria-label="Workout steps"><button type="button" aria-label="Previous workout step" onclick="starterNavigate(-1)" '+(s.step===0?'disabled':'')+'>← <span>Back</span></button><span>'+(['Warm-up','1 / 4','2 / 4','3 / 4','4 / 4','Finish'][s.step])+'</span><button type="button" aria-label="Next workout step" onclick="starterNavigate(1)" '+(s.step===5?'disabled':'')+'><span>Next</span> →</button></nav>':'';
  return '<section class="sg-workout" data-starter-surface aria-label="Guided starter workout"><header><div class="sg-kicker">'+e(p.badge)+'</div><h2>'+e(p.title)+'</h2><p>'+e(p.scheduled?c.duration+' · one set each':p.coach)+'</p></header>'+'<button type="button" class="sg-open-stretches" onclick="starterOpenStretches()">Open stretches</button>'+(typeof starterArmsHtml==='function'?'<button type="button" class="sg-open-arms" onclick="starterOpenArms()">Full workout · chest &amp; arms</button>':'')+(!p.scheduled?'<p class="sg-notice">Recovery day. Preview is available; completion logging is off. Next planned strength: '+e(starterNextDate(date))+'.</p>':'')+'<div class="sg-step" aria-live="polite">'+content+'</div>'+navigation+(typeof starterArmsHtml==='function'?starterArmsHtml(date):'')+starterStretchHtml(date)+'<p class="sg-hint">Leave several good reps in reserve; no failure. Stop for pain, tingling, numbness, weakness, illness or unusual breathlessness. Do not train impaired, exhausted or past bedtime.</p></section>';
}
function starterStretchUi(date){
  if(!window.__starterStretchUI||window.__starterStretchUI.date!==date){let saved=null;try{saved=JSON.parse(sessionStorage.getItem('hg-stretches-'+date));}catch(_){}window.__starterStretchUI={date:date,step:Math.max(0,Math.min(4,Math.floor(Number(saved&&saved.step)||0))),open:!!(saved&&saved.open)};}
  return window.__starterStretchUI;
}
function starterStretchStore(){const s=window.__starterStretchUI;try{sessionStorage.setItem('hg-stretches-'+s.date,JSON.stringify(s));}catch(_){} }
function starterStretchToggle(open){starterStretchUi(todayKey()).open=!!open;starterStretchStore();}
function starterStretchNavigate(delta){const s=starterStretchUi(todayKey());s.step=Math.max(0,Math.min(4,s.step+delta));s.open=true;starterStretchStore();starterRefresh();const surface=starterVisibleSurface(),el=surface&&surface.querySelector('.sg-stretch-step');if(el)el.scrollIntoView({block:'start'});}
function starterOpenStretches(){starterStretchUi(todayKey()).open=true;starterStretchStore();if(starterVisibleSurface())renderAll();else switchTab('wellness');const surface=starterVisibleSurface(),el=surface&&surface.querySelector('[data-starter-stretches]');if(el){el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'});}}
function starterStretchHtml(date){
  const s=starterStretchUi(date),x=starterConfig().stretches[s.step],e=almanacEsc;
  return '<details class="sg-stretches" data-starter-stretches '+(s.open?'open ':'')+'ontoggle="starterStretchToggle(this.open)"><summary>Optional stretch routine · 5–6 minutes</summary><p>First walk slowly until your breathing settles. Stretch while warm after lifting, or after a five-minute easy walk on a recovery day.</p><p>Gentle pulling only. Breathe normally; no bouncing. Stop for pain, pins and needles, numbness, dizziness or unusual symptoms. Skip anything uncomfortable.</p><div class="sg-stretch-step" aria-live="polite"><div class="sg-count">'+(s.step+1)+' of 5 stretches</div><h3>'+e(x.title)+'</h3><p class="sg-dose">'+e(x.hold)+'</p><p><strong>Feel:</strong> '+e(x.feel)+'</p><ol>'+x.steps.map(t=>'<li>'+e(t)+'</li>').join('')+'</ol><p><strong>Easier / skip:</strong> '+e(x.easier)+'</p><a href="'+e(x.demo[1])+'" target="_blank" rel="noopener noreferrer">'+e(x.demo[0])+' ↗</a></div><nav class="sg-nav" aria-label="Optional stretch steps"><button type="button" aria-label="Previous stretch" onclick="starterStretchNavigate(-1)" '+(s.step===0?'disabled':'')+'>← Back</button><span>'+(s.step+1)+' / 5</span><button type="button" aria-label="Next stretch" onclick="starterStretchNavigate(1)" '+(s.step===4?'disabled':'')+'>Next →</button></nav><p class="sg-hint">Optional beginner introduction, not injury treatment or a proven optimal dose. Nothing to log; skipping does not affect your workout.</p><a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931" target="_blank" rel="noopener noreferrer">Mayo: stretching safety ↗</a></details>';
}
function starterNextDate(date){const d=new Date(date+'T12:00:00');for(let n=0;n<14;n++){d.setDate(d.getDate()+1);const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(starterPlanForDate(key).scheduled)return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}return 'review with coach';}
function starterScheduleHtml(date){
  const e=almanacEsc,p=starterPlanForDate(date);
  return '<section class="sg-schedule"><h3>Starter schedule</h3><p>Normally Monday &amp; Thursday · 7 AM. Other days: comfortable walks or recovery.</p>'+(date<=starterConfig().recoveryDate?'<p>Saturday Nov 14: Day 1 if ready. Sunday Nov 15: recovery. Monday Nov 16 only if recovered; otherwise wait until Thursday Nov 19.</p>':'')+'<p>Next planned strength: '+e(starterNextDate(date))+'. Only if recovered; otherwise skip to the next planned day.</p><p>'+p.completed+' strength sessions logged. This full plan stays available today and on later strength days. Repeat the current four-move base, with up to one optional finisher only if fresh, fed, hydrated and ready. Review recovery before changing resistance; change one thing at a time. Leave several good reps in reserve; no failure. No catch-up sessions.</p><details><summary>Later / reference: A, B and C</summary><p>Reference only—not today’s starter. Calendar weeks below do not advance this starter.</p>'+['strengthA','strengthB','strengthC'].map((key,i)=>'<details><summary>Strength '+['A','B','C'][i]+' reference</summary>'+fitnessWorkoutDetailsHtml({workoutKey:key,week:1})+'</details>').join('')+'</details></section>';
}
