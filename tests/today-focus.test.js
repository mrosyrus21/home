"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'today-checklist.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const transition = html.slice(html.indexOf('function todaySectionStep'), html.indexOf('function todaySectionBox'));

function fixture(date = '2026-09-24', hour = 8) {
  const view = {innerHTML:''}, laundry = {}, sections = {}, steps = {}, writes = [], announcements = [];
  let clock = new Date(date + 'T' + String(hour).padStart(2,'0') + ':00:00').getTime();
  class TestDate extends Date { constructor(...args) { super(...(args.length ? args : [clock])); } static now() { return clock; } }
  const c = {Date:TestDate, TODAY_CLEAR_MS:950, laundry, wateringStateLoaded:true, beautyPurchased:{}, __stateHydrated:true,
    document:{getElementById:() => view}, todayKey:() => date,
    ALMANAC_MORNING:['bed','outdoor-water','health','breakfast','walk','work'].map(id => ({id})),
    almanacEsc:s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
    almanacLogKey:(id,d) => 'morning-' + id + '-' + d,
    almanacRoutineDone:id => !!laundry['morning-' + id + '-' + date],
    almanacRoutineTasks:() => c.ALMANAC_MORNING.filter(t => t.id !== 'work' || ![0,6].includes(new TestDate().getDay())).map(t => ({...t,label:t.id,detail:t.id === 'outdoor-water' ? 'Check the soil; water only if needed.' : 'One simple step.'})),
    almanacStepState:id => steps[id] || (steps[id] = {}),
    almanacPersist:x => writes.push(x),
    almanacDone:id => {laundry['morning-' + id + '-' + date] = true; writes.push({morning:id});c.renderAll();},
    waterCount:() => c.water, waterGoal:() => 3, waterServing:() => 1, water:0,
    waterAdd:() => {c.water++;c.renderAll();}, waterUndo:() => {c.water=Math.max(0,c.water-1);c.renderAll();},
    healthCoachState:() => ({workoutDone:!!laundry['well-workout-' + date] || !!laundry['health-workout-' + date]}),
    fitnessMonth1PlanForDate:() => ({type:[1,3,5].includes(new TestDate().getDay())?'strength':'mobility', title:'Strength B', list:['One exercise'],coach:'Easy practice.',duration:'20–30 min'}),
    fitnessGateMessage:() => 'Ready when you are.', windDownDone:() => !!laundry['winddown-' + date],
    toggleWellness:id => {const key='well-'+id+'-'+date;laundry[key]=!laundry[key];c.renderAll();},
    toggleMeal:id => {const key='meal-'+id+'-'+date;laundry[key]=!laundry[key];c.renderAll();},
    toggleNewHomeOneThing:() => {const key='newhome-one-'+date;laundry[key]=!laundry[key];c.renderAll();},
    toggleWindDown:() => {laundry['winddown-'+date]=!laundry['winddown-'+date];c.renderAll();},
    ST:{update:x => writes.push(x)}, toast:() => {}, todayAnnounce:x => announcements.push(x),
    beautyItems:() => [{id:'cleanser'},{id:'sunscreen'}], beautyShoppingTodayHtml:() => '<div>Shopping contents</div>',
  };
  c.window=c;
  vm.createContext(c);vm.runInContext(transition,c);
  c.todaySectionState=(key,done) => {
    if(!c.__stateHydrated) return {mode:done?'hidden':'active',entered:false};
    const result=c.todaySectionStep(sections[key],done,clock);sections[key]=result.state;return result;
  };
  vm.runInContext(source,c);c.renderAll=() => c.renderTodayChecklist();
  return {c,view,laundry,writes,announcements,advance:ms => {clock+=ms;c.renderAll();}};
}

function run() {
  const f=fixture();f.c.renderAll();
  assert.equal(f.writes.length,0,'rendering must never record completion');
  assert.match(f.view.innerHTML,/Morning routine/);
  assert.match(f.view.innerHTML,/Begin paid work/);
  assert.doesNotMatch(f.view.innerHTML,/data-task="movement"/,'Thursday recovery must not duplicate the morning walk and mobility');
  assert.match(f.view.innerHTML,/<details class="td-shopping" ontoggle=/,'shopping must initially be collapsed');
  assert.match(f.view.innerHTML,/aria-valuemax="12"/,'shopping must not count toward daily progress');
  f.c.todayChecklistAction('lunch',false);
  assert.match(f.view.innerHTML,/td-clearing[^>]*data-task="lunch"/,'new completion must briefly celebrate');
  assert.doesNotMatch(f.view.innerHTML,/class="td-done-row"/,'completed row must clear before entering Done');
  assert.equal(f.announcements.length,1);
  f.c.renderAll();assert.equal(f.announcements.length,1,'sync echo must not repeat feedback');
  f.advance(1000);assert.doesNotMatch(f.view.innerHTML,/data-task="lunch"/);
  assert.match(f.view.innerHTML,/Done today/);
  f.c.todayChecklistAction('lunch',true);assert.match(f.view.innerHTML,/data-task="lunch"/,'Undo restores the row');
  f.c.todayChecklistDisclosure('shopping',true);f.c.renderAll();assert.match(f.view.innerHTML,/<details class="td-shopping" open/,'shopping must stay open across saved-state renders');
  f.c.water=2;f.c.renderAll();f.c.todayChecklistAction('water',false);f.advance(1000);
  assert.doesNotMatch(f.view.innerHTML,/data-task="water"/,'water goal clears only when reached');
  f.c.todayChecklistAction('water',true);assert.match(f.view.innerHTML,/data-task="water"/);
  const loaded=fixture();loaded.laundry['meal-lunch-2026-09-24']=true;loaded.c.renderAll();
  assert.doesNotMatch(loaded.view.innerHTML,/td-clearing/,'refresh must not celebrate saved completion');
  const weekend=fixture('2026-09-26');weekend.c.renderAll();assert.doesNotMatch(weekend.view.innerHTML,/Begin paid work/);
  const early=fixture('2026-09-24',7);early.c.renderAll();assert.match(early.view.innerHTML,/Complete: Begin paid work[^>]*disabled/);
  const strength=fixture('2026-09-23',18);strength.laundry['health-workout-2026-09-23']=true;strength.c.renderAll();
  strength.c.todayChecklistAction('movement',true);assert.equal(strength.laundry['health-workout-2026-09-23'],false);assert.equal(strength.laundry['well-workout-2026-09-23'],false);
  assert.match(strength.view.innerHTML,/data-task="movement"/,'legacy workout undo must restore its row');
  const morning=fixture();morning.c.renderAll();morning.c.todayChecklistAction('morning:bed',false);morning.advance(1000);morning.c.todayChecklistAction('morning:bed',true);
  assert.equal(morning.laundry['morning-bed-2026-09-24'],false);assert.equal(morning.c.almanacStepState('bed').status,'active');
  const loading=fixture();loading.c.__stateHydrated=false;loading.c.renderAll();loading.c.todayChecklistAction('lunch',false);assert.equal(loading.laundry['meal-lunch-2026-09-24'],undefined);
  console.log('Today checklist behavior checks passed');
}
if(require.main===module)run();
module.exports={fixture};
