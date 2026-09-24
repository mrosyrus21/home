// Today is a view over the existing logs. Rendering never records completion.
function todayChecklistDisclosure(name, open) {
  window.__checklistDisclosure.open[name] = open;
}
function todayChecklistAction(key, undo) {
  if (!window.__stateHydrated) { toast('Still loading your saved progress.'); return; }
  const date = todayKey();
  if (key.indexOf('morning:') === 0) {
    const id = key.slice(8);
    if (!ALMANAC_MORNING.some(t => t.id === id)) return;
    if (!undo) return almanacDone(id);
    const state = almanacStepState(id), log = almanacLogKey(id, date), updates = {};
    state.status = 'active'; delete state.completedAt; delete state.snoozedUntil;
    laundry[log] = false; updates['laundry/' + log] = false;
    almanacPersist(updates); renderAll(); return;
  }
  if (key === 'vitamin') return toggleWellness('litfulo');
  if (key === 'water') return undo ? waterUndo() : waterAdd();
  if (key === 'lunch' || key === 'dinner') return toggleMeal(key);
  if (key === 'newhome') return toggleNewHomeOneThing();
  if (key === 'winddown') return toggleWindDown();
  if (key === 'movement') {
    if (!undo) return toggleWellness('workout');
    // Older records can use either key; undo the completed workout explicitly.
    const updates = {};
    ['well-workout-', 'health-workout-'].forEach(prefix => {
      laundry[prefix + date] = false; updates['laundry/' + prefix + date] = false;
    });
    ST.update(updates); renderAll();
  }
}
function todayChecklistItems(date, nowM, hc) {
  const shortNames = {bed:'Make the bed', 'outdoor-water':'Check plants due today', health:'Five minutes of mobility', breakfast:'Protein breakfast', walk:'Walk Zoey', work:'Begin paid work'};
  const morning = almanacRoutineTasks(hc).map(t => ({
    key:'morning:' + t.id, label:shortNames[t.id] || t.label, note:t.detail,
    done:almanacRoutineDone(t.id), morning:true,
    locked:t.id === 'work' && nowM < 480 || t.id === 'outdoor-water' && !wateringStateLoaded,
    time:t.id === 'work' ? '8 AM' : '',
  }));
  const items = [
    {key:'vitamin', label:'Vitamins + Litfulo', note:'With breakfast · your morning lineup', done:!!laundry['well-litfulo-' + date]},
    {key:'water', label:'Water', done:waterCount() >= waterGoal(), water:true},
    {key:'lunch', label:'Protein lunch', note:'Something easy counts.', time:'Noon', done:!!laundry['meal-lunch-' + date]},
    {key:'newhome', label:'Make one spot feel like home', note:'One box, shelf, or surface. Then stop.', time:'10–15 min', done:!!laundry['newhome-one-' + date]},
  ];
  const plan = fitnessMonth1PlanForDate(date);
  // Walk + mobility already live in the morning list. Never synthesize a workout log.
  if (plan.type === 'strength') items.push({key:'movement', label:plan.title, note:fitnessGateMessage(hc, plan), time:plan.duration, done:hc.workoutDone, plan:plan});
  items.push(
    {key:'dinner', label:'Dinner', note:'Keep it easy. Feed yourself well.', time:'7 PM', done:!!laundry['meal-dinner-' + date]},
    {key:'winddown', label:'Phone in the other room', note:'Evening wind-down · reading, then lights out', time:'10 PM', done:windDownDone()},
  );
  return {morning:morning, items:items};
}
function todayChecklistRow(item, next, disclosures) {
  const e = almanacEsc, ready = !!window.__stateHydrated && !item.locked;
  const clearing = item.mode === 'celebrate';
  const label = e(item.label), action = "todayChecklistAction('" + item.key + "',false)";
  let html = '<div class="td-item' + (next ? ' td-next' : '') + (clearing ? ' td-clearing' : '') + '" data-task="' + item.key + '">';
  html += '<button type="button" class="td-check" aria-label="Complete: ' + label + '" onclick="' + action + '"' + (!ready || clearing ? ' disabled' : '') + '><span>' + (clearing ? '✓' : '') + '</span></button>';
  html += '<div class="td-copy"><div class="td-label">' + label + (next ? '<span class="td-next-tag">Next</span>' : '') + '</div>';
  if (item.note && (!item.morning || next || item.locked)) html += '<div class="td-note">' + e(item.locked && item.key === 'morning:work' ? 'Available at 8 AM. Work preparation is paid time.' : item.note) + '</div>';
  if (item.plan) html += '<details class="td-plan"' + (disclosures.workout ? ' open' : '') + ' ontoggle="todayChecklistDisclosure(\'workout\',this.open)"><summary>See workout</summary><p>' + e(item.plan.coach) + '</p><ul>' + item.plan.list.map(x => '<li>' + e(x) + '</li>').join('') + '</ul></details>';
  html += '</div>' + (item.time ? '<span class="td-time">' + e(item.time) + '</span>' : '') + '</div>';
  return html;
}
function todayChecklistWater(item) {
  const count = waterCount(), goal = waterGoal(), step = waterServing(), clearing = item.mode === 'celebrate';
  const pct = Math.min(100, Math.round(count / goal * 100)), disabled = !window.__stateHydrated || clearing;
  return '<div class="td-water' + (clearing ? ' td-clearing' : '') + '" data-task="water"><div class="td-water-top"><span class="td-water-icon">💧</span><div class="td-copy"><div class="td-label">' + (clearing ? 'Water goal reached' : 'Water') + '</div><div class="td-note">' + count + ' / ' + goal + ' bottles · 32 oz each</div></div><button class="td-water-add" type="button" onclick="todayChecklistAction(\'water\',false)"' + (disabled ? ' disabled' : '') + '>+' + step + ' bottle' + (step === 1 ? '' : 's') + '</button></div><div class="td-water-track" role="progressbar" aria-label="Daily water goal" aria-valuemin="0" aria-valuemax="' + goal + '" aria-valuenow="' + Math.min(count,goal) + '"><span style="width:' + pct + '%"></span></div><div class="td-water-tools"><button type="button" onclick="todayChecklistAction(\'water\',true)"' + (count <= 0 || disabled ? ' disabled' : '') + '>Undo ' + Math.min(step,count) + '</button><button type="button" onclick="waterSetGoal()">Goal: ' + goal + '</button><button type="button" onclick="waterSetServing()">Per tap: ' + step + '</button></div></div>';
}
function renderTodayChecklist() {
  const el = document.getElementById('view-today'); if (!el) return;
  const date = todayKey(), now = new Date(), nowM = now.getHours()*60 + now.getMinutes(), day = new Date(date + 'T12:00:00');
  const hc = healthCoachState(date, nowM, day.getDay()), model = todayChecklistItems(date, nowM, hc);
  if (!window.__checklistDisclosure || window.__checklistDisclosure.date !== date) window.__checklistDisclosure = {date:date, open:{morning:nowM < 720, shopping:false, workout:false, done:false}};
  const disclosures = window.__checklistDisclosure.open, all = model.morning.concat(model.items);
  all.forEach(item => {
    const state = todaySectionState('checklist:' + item.key, item.done); item.mode = state.mode;
    if (state.entered) todayAnnounce(item.label + ' complete. One less thing.');
  });
  const done = all.filter(x => x.done), activeMorning = model.morning.filter(x => x.mode !== 'hidden');
  const nextMorning = model.morning.find(x => !x.done && !x.locked);
  let next = nowM < 720 && nextMorning ? nextMorning : model.items.find(x => !x.done && x.key !== 'water' && (x.key !== 'dinner' || nowM >= 1080) && (x.key !== 'winddown' || nowM >= 1260) && (x.key !== 'movement' || nowM >= 1020));
  if (!next) next = nextMorning;
  const progress = Math.round(done.length / all.length * 100), remaining = all.length - done.length;
  const subtitle = !window.__stateHydrated ? 'Loading your saved progress…' : remaining === 0 ? 'Your list is clear. Enjoy your evening.' : done.length === 0 ? 'Start small. Every check makes room.' : done.length + ' little wins. Keep the good feeling going.';
  let html = '<div class="td-page"><header class="td-header"><div class="td-eyebrow">' + day.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'}) + ' · ' + ([0,6].includes(day.getDay()) ? 'Your own pace' : 'Workday') + '</div><div class="td-title-line"><h2>A little more done.</h2><span class="td-score">' + (window.__stateHydrated ? done.length + '<small> / ' + all.length + '</small>' : '…') + '</span></div><p>' + subtitle + '</p><div class="td-progress" role="progressbar" aria-label="Daily checklist" aria-valuemin="0" aria-valuemax="' + all.length + '" aria-valuenow="' + done.length + '"><span style="width:' + progress + '%"></span></div></header><section class="td-list" aria-label="Daily checklist">';
  if (activeMorning.length) {
    const morningCount = model.morning.filter(x => x.done).length;
    html += '<details class="td-morning"' + (disclosures.morning ? ' open' : '') + ' ontoggle="todayChecklistDisclosure(\'morning\',this.open)"><summary><span class="td-morning-icon">☀</span><span class="td-copy"><span class="td-label">Morning routine</span><span class="td-note">' + morningCount + ' of ' + model.morning.length + ' steps' + (nextMorning ? ' · ' + almanacEsc(nextMorning.label) : '') + '</span></span><span class="td-chevron">⌄</span></summary><div class="td-morning-steps">' + activeMorning.map(x => todayChecklistRow(x, next === x, disclosures)).join('') + '</div></details>';
  }
  model.items.filter(x => x.mode !== 'hidden').forEach(item => { html += item.water ? todayChecklistWater(item) : todayChecklistRow(item, next === item, disclosures); });
  if (!remaining && !all.some(x => x.mode === 'celebrate')) html += '<div class="td-clear"><span>✓</span><strong>Look at that breathing room.</strong><p>You showed up for yourself today.</p></div>';
  html += '</section>';
  const cleared = done.filter(x => x.mode === 'hidden');
  if (cleared.length) html += '<details class="td-done"' + (disclosures.done ? ' open' : '') + ' ontoggle="todayChecklistDisclosure(\'done\',this.open)"><summary><span>✓ Done today</span><span>' + cleared.length + ' <span class="td-chevron">⌄</span></span></summary>' + cleared.map(x => '<div class="td-done-row"><span>✓</span><span>' + almanacEsc(x.label) + '</span><button type="button" onclick="todayChecklistAction(\'' + x.key + '\',true)">Undo</button>' + (x.water ? '<button type="button" onclick="todayChecklistAction(\'water\',false)">+' + waterServing() + '</button>' : '') + '</div>').join('') + '</details>';
  const products = beautyItems(), needed = products.filter(x => !beautyPurchased[x.id]).length;
  html += '<details class="td-shopping"' + (disclosures.shopping ? ' open' : '') + ' ontoggle="todayChecklistDisclosure(\'shopping\',this.open)"><summary><span class="td-shopping-icon">✦</span><span class="td-copy"><span class="td-label">Beauty products to buy</span><span class="td-note">' + needed + ' on your list · whenever you shop</span></span><span class="td-chevron">⌄</span></summary>' + beautyShoppingTodayHtml() + '</details></div>';
  el.innerHTML = html;
}
