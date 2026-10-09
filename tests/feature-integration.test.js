"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const source=fs.readFileSync(path.join(root,"sleep-finance.js"),"utf8");
const data=fs.readFileSync(path.join(root,"data.js"),"utf8");
const {RHYTHM,FINANCE}=new Function(data+";return {RHYTHM,FINANCE};")();
const serialize=value=>JSON.stringify(value);

assert.match(html,/<script src="\.\/sleep-finance\.js\?v=\d+"><\/script>/,"selected helpers must actually be loaded");
assert.ok(html.indexOf('src="./sleep-finance.js')<html.indexOf("function renderWellness"),"load helpers before app render calls");
assert.doesNotMatch(html,/<script[^>]+src=["'][^"']*v2-features\.js/,"do not activate the unrelated legacy feature hooks");
assert.doesNotMatch(source,/hgRecapHtml|hgJournal|hgRoomPhotoHtml|renderToday\s*=/);
assert.doesNotMatch(source,/melatonin|L-theanine|7h30 goal/i,"obsolete bedtime-medication assumptions must stay dormant");

let now="2026-10-08T12:00:00";
class FixedDate extends Date { constructor(...args){super(...(args.length?args:[now]));} }
const elements={"hg-bed":{value:"23:00"},"hg-wake":{value:"08:00"},"view-wellness":{innerHTML:""},"view-finance":{innerHTML:""},"view-rooms":{innerHTML:""}};
const calls={save:0,render:0,confirm:0,permission:0,notifications:0,localWrites:0};
const timers=[],readers=[],messages=[],reminderKeys=new Map();
let resolvePermission;
class FakeNotification {
  static permission="granted";
  static requestPermission(){calls.permission++;return new Promise(resolve=>{resolvePermission=resolve;});}
  constructor(title,options){calls.notifications++;messages.push(title+" "+options.body);}
}
class FakeReader { constructor(){readers.push(this);}readAsText(file){this.result=file.text;} }
const originalToday=()=>{};
const originalGarden=()=>{};
const context=vm.createContext({
  Date:FixedDate,window:{__stateHydrated:false,Notification:FakeNotification},Notification:FakeNotification,
  setInterval(fn,ms){timers.push({fn,ms});},
  document:{getElementById(id){return elements[id]||null;}},
  FileReader:FakeReader,
  localStorage:{getItem(k){return reminderKeys.get(k);},setItem(k,v){calls.localWrites++;reminderKeys.set(k,v);}},
  toast(message){messages.push(message);},confirm(){calls.confirm++;return true;},
  todayKey(){return "2026-10-08";},saveSleep(){calls.save++;},renderWellness(){calls.render++;},
  renderToday:originalToday,renderGarden:originalGarden,
  RHYTHM,FINANCE
});

// Loading before main state exists is safe; nothing reads or changes application data.
vm.runInContext(source,context,{filename:"sleep-finance.js"});
assert.equal(context.renderToday,originalToday);
assert.equal(context.renderGarden,originalGarden);
assert.equal(calls.save,0);
assert.equal(calls.render,0);
assert.equal(timers.length,1);
assert.equal(timers[0].ms,20000);
assert.doesNotThrow(()=>timers[0].fn());
for(const name of ["hgSleepSectionHtml","hgDebtChartsHtml","hgBillsTimelineHtml"]){
  assert.equal(typeof context[name],"function",name+" must resolve when the existing app calls it");
  assert.match(html,new RegExp(name+"\\("));
}
context.sleep={"2026-10-07":{bed:"22:45",wake:"07:15",mins:510,q:4,src:"m"},_prefs:{on:true,wind:"22:00",custom:"preserve"}};
context.fin={debt:{c6605:{"2026-10-06":400}},bills:{"rent-2026-10":true},cancel:{},todoDone:{},todoCustom:{},monday:{},side:{phase:{},prod:{}}};
const financeStart=html.indexOf("let finEdit="),financeEnd=html.indexOf("function renderRecipeBox",financeStart);
vm.runInContext(html.slice(financeStart,financeEnd),context);
const earlyState=serialize(context.sleep);
context.hgSleepSave();
context.hgSleepDelete("2026-10-07");
context.hgRemindWind("21:30");
context.hgRemindToggle();
context.hgSleepImport({files:[{text:"ignored"}],value:"selected"});
assert.equal(serialize(context.sleep),earlyState,"blocked actions must not mutate even local sleep state");
assert.equal(calls.save,0);
assert.equal(calls.confirm,0,"reject deletion before asking for confirmation");
assert.equal(calls.permission,0,"reject notification changes before requesting permission");
assert.equal(readers.length,0,"reject imports before starting the asynchronous reader");
assert.match(messages.join("\n"),/Saved data is still loading/);

async function main(){
  context.window.__stateHydrated=true;
  const initialSleep=serialize(context.sleep),initialFinance=serialize(context.fin);
  const sleepHtml=context.hgSleepSectionHtml("2026-10-08");
  assert.match(sleepHtml,/id="sleep-section"/);
  assert.match(sleepHtml,/Last 14 nights/);
  assert.match(sleepHtml,/9h planned window/,"chart reference follows the configured lights-out/wake window");
  assert.match(sleepHtml,/value="22:45"/,"prefill can use the last saved night");
  assert.match(sleepHtml,/wake 8:00 AM/);
  assert.match(sleepHtml,/Log-last-night nudge at 08:30/);
  const empty=context.sleep;context.sleep={};
  const emptyHtml=context.hgSleepSectionHtml("2026-10-08");
  assert.match(emptyHtml,/id="hg-bed"[^>]+value="23:00"/);
  assert.match(emptyHtml,/id="hg-wake"[^>]+value="08:00"/,"new-entry defaults follow current rhythm, not old June defaults");
  context.sleep=empty;
  for(const match of sleepHtml.matchAll(/on(?:click|change)="(hg\w+)\(/g))assert.equal(typeof context[match[1]],"function","every generated Sleep handler must exist");
  assert.equal(serialize(context.sleep),initialSleep,"rendering must not alter sleep entries or preferences");

  const debtHtml=context.hgDebtChartsHtml();
  assert.match(debtHtml,/Debt balance trend/);
  assert.match(debtHtml,/4 loans without a starting balance not included/);
  assert.doesNotMatch(debtHtml,/NaN|Infinity/);
  const billsHtml=context.hgBillsTimelineHtml(FINANCE.bills,"2026-10");
  assert.match(billsHtml,/The month at a glance/);
  assert.match(billsHtml,/paid ✓/);
  assert.equal((billsHtml.match(/title="payday"/g)||[]).length,2);
  assert.equal((context.hgBillsTimelineHtml(FINANCE.bills,"2030-10").match(/title="payday"/g)||[]).length,3,"payday ticks must not silently stop after 60 periods from the anchor");
  assert.equal(context.hgBillsTimelineHtml(FINANCE.bills,"2026-13"),"");
  assert.equal(serialize(context.fin),initialFinance,"the restored chart helpers never write Finance state");
  assert.equal(calls.save,0);

  // Exercise the existing full renderers with their real data and restored helper definitions.
  const wellnessStart=html.indexOf("function renderWellness()"),wellnessEnd=html.indexOf("let finEdit=",wellnessStart);
  for(const name of ["healthDailyAnchorsHtml","fitnessSectionHtml","healthCoachSectionHtml","beautyCareSectionHtml","litRefillHtml"])context[name]=()=>"";
  context.painLog={};context.laundry={};context.streakOf=()=>0;
  vm.runInContext(html.slice(wellnessStart,wellnessEnd),context);
  context.renderWellness();
  assert.match(elements["view-wellness"].innerHTML,/id="sleep-section"/,"Sleep must appear in the real Health render");
  context.finSub="bills";context.renderFinance();
  assert.match(elements["view-finance"].innerHTML,/The month at a glance/,"timeline must appear on real Bills sub-tab");
  context.finSub="debts";context.renderFinance();
  assert.match(elements["view-finance"].innerHTML,/Tracked debt balances/,"trend must appear on real Debts sub-tab");

  context.hgQSet(5);context.hgSleepSave();
  assert.equal(context.sleep["2026-10-08"].mins,540);
  assert.equal(context.sleep["2026-10-08"].q,5);
  assert.equal(context.sleep["2026-10-08"].src,"m");
  assert.equal(context.sleep._prefs.custom,"preserve");
  assert.deepEqual(context.sleep["2026-10-07"],JSON.parse(initialSleep)["2026-10-07"]);
  const beforeBad=serialize(context.sleep),beforeBadSave=calls.save;
  elements["hg-bed"].value="invalid";context.hgSleepSave();
  assert.equal(serialize(context.sleep),beforeBad);
  assert.equal(calls.save,beforeBadSave);
  elements["hg-bed"].value="23:00";

  const csv='metadata\ncom.samsung.shealth.sleep.start_time,com.samsung.shealth.sleep.end_time,note\n"2026-10-06 23:00:00","2026-10-07 07:00:00","quoted, cell"\n2026-10-07 23:00:00,2026-10-08 07:00:00,manual\n2026-10-05 23:00:00,2026-10-06 07:00:00,watch';
  assert.equal(context.hgParseSamsungSleep(csv)["2026-10-07"].mins,480);
  context.hgSleepImport({files:[{text:csv}],value:"selected"});
  context.window.__stateHydrated=false;
  const beforeCallback=serialize(context.sleep),beforeCallbackSave=calls.save;
  readers.at(-1).onload();
  assert.equal(serialize(context.sleep),beforeCallback,"FileReader callback must recheck readiness");
  assert.equal(calls.save,beforeCallbackSave);
  context.window.__stateHydrated=true;
  context.sleep["2026-10-05"]={bed:"23:10",wake:"07:10",mins:480}; // Legacy entry without src is also manual.
  const manual=serialize(context.sleep["2026-10-08"]);
  context.hgSleepImport({files:[{text:csv+'\n2026-10-04 23:00:00,2026-10-05 07:00:00,legacy'}],value:"selected"});
  readers.at(-1).onload();
  assert.equal(serialize(context.sleep["2026-10-08"]),manual,"watch import must not overwrite manual logs");
  assert.equal(context.sleep["2026-10-05"].bed,"23:10","watch import must not overwrite legacy manual logs");
  assert.equal(context.sleep["2026-10-06"].src,"w");
  assert.equal(context.sleep["2026-10-06"].mins,480);
  context.hgSleepDelete("2026-10-06");
  assert.equal(context.sleep["2026-10-06"],undefined);
  assert.equal(context.sleep._prefs.custom,"preserve");

  context.hgRemindWind("21:45");
  assert.equal(context.sleep._prefs.wind,"21:45");
  assert.equal(context.sleep._prefs.custom,"preserve");
  context.hgRemindToggle(); // Turn an existing enabled preference off.
  assert.equal(context.sleep._prefs.on,false);
  context.hgRemindToggle(); // Turning on awaits notification permission.
  context.window.__stateHydrated=false;
  const prefsBefore=serialize(context.sleep._prefs),saveBefore=calls.save;
  resolvePermission("granted");await Promise.resolve();
  assert.equal(serialize(context.sleep._prefs),prefsBefore,"permission callback must recheck readiness");
  assert.equal(calls.save,saveBefore);
  context.window.__stateHydrated=true;
  context.hgRemindToggle();
  context.sleep._prefs.extra="arrived while permission pending";
  resolvePermission("granted");await Promise.resolve();
  assert.equal(context.sleep._prefs.on,true);
  assert.equal(context.sleep._prefs.extra,"arrived while permission pending","async preferences must merge with current state");

  now="2026-10-08T21:45:00";
  context.window.__stateHydrated=false;context.hgSleepReminderTick();
  assert.equal(calls.notifications,0);
  assert.equal(calls.localWrites,0,"no reminder delivery marker may be stored before hydration");
  context.window.__stateHydrated=true;context.hgSleepReminderTick();context.hgSleepReminderTick();
  assert.equal(calls.notifications,1,"reminders are deduplicated for the same day");
  assert.equal(calls.localWrites,1);
  assert.doesNotMatch(messages.join("\n"),/melatonin|L-theanine/i);

  // Real Rooms renderer must destructure the task object and preserve easy's numeric rank 0.
  const roomStart=html.indexOf("function renderRooms()"),roomEnd=html.indexOf("function plantsDueOn",roomStart);
  context.expandedRoom="priority";context.checked={};context.taskCustom={};context.hgRoomPhotoHtml=()=>"";
  context.ROOMS=Object.fromEntries(["priority","kitchen","living","office","bedroom","bathroom","backyard","garage"].map(id=>[id,{name:id,emoji:"",color:"#fff"}]));
  context.roomTaskEntries=id=>id==="priority"?[["hard-first",{label:"Hard task",level:"hard"}],["unknown",{label:"Unranked task",level:"unknown"}],["easy",{label:"Easy task",level:"easy"}],["medium",{label:"Moderate task",level:"moderate"}]]:[];
  context.levelBadge=()=>"";
  vm.runInContext(html.slice(roomStart,roomEnd),context);
  context.renderRooms();
  const rendered=elements["view-rooms"].innerHTML;
  assert.ok(rendered.indexOf("Easy task")<rendered.indexOf("Unranked task"));
  assert.ok(rendered.indexOf("Unranked task")<rendered.indexOf("Moderate task"),"same-rank tasks keep their source order");
  assert.ok(rendered.indexOf("Moderate task")<rendered.indexOf("Hard task"));
  console.log("selected Sleep/Finance integration and Rooms sorting regression checks passed");
}
main().catch(err=>{console.error(err);process.exitCode=1;});
