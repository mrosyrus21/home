"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
function section(start, end) {
  const a = html.indexOf(start), b = html.indexOf(end, a);
  assert.ok(a >= 0 && b > a, "test section must exist: " + start);
  return html.slice(a, b);
}
function context(values) { const c = {...values}; c.window = c; vm.createContext(c); return c; }

assert.doesNotMatch(section("function updateHeaderBg()", "let WXF="), /url\(/, "hidden legacy header photo must not download before the late styles parse");
assert.match(html, /@media \(max-width:768px\)\{\s*body\{background-attachment:scroll\}\s*body::after\{display:none\}/, "phone must disable the actual grain pseudo-element");
assert.match(html, /da-snow-layer\.on\{animation:none!important\}/, "later Day Arc CSS must not restart mobile weather animations");

async function writesRequireHydration() {
  const writes = [], reads = [], messages = [];
  function ref(key) {
    return {key, child(id) { return ref(this.key + "/" + id); },
      set(value) { writes.push({path:this.key, value}); return Promise.resolve(); },
      update(value) { writes.push({path:this.key, value}); return Promise.resolve(); },
      remove() { writes.push({path:this.key}); return Promise.resolve(); },
      transaction(change) { writes.push({path:this.key, value:change(null)}); return Promise.resolve(); },
      on() { reads.push(this.key); }, onDisconnect() { return ref(this.key); },
      push(value) { const child = ref(this.key + "/new-key"); if(arguments.length) child.set(value); return child; }
    };
  }
  const raw = ref("state"); raw.parent = ref(""); raw.root = raw.parent; raw.ref = raw;
  const c = context({__stateHydrated:false, toast:x => messages.push(x), Promise, Proxy, WeakMap, Reflect});
  vm.runInContext(section("const hgStateRefs", "const ST ="), c);
  const safe = c.hgGuardStateRef(raw);
  await assert.rejects(safe.child("checked").set({draft:true}), /has not loaded/);
  await assert.rejects(safe.update({laundry:{}}), /has not loaded/);
  await assert.rejects(safe.child("fin").remove(), /has not loaded/);
  await assert.rejects(safe.onDisconnect().set({}), /has not loaded/);
  await assert.rejects(safe.root.child("state").set({}), /has not loaded/);
  await assert.rejects(safe.ref.set({}), /has not loaded/);
  await assert.rejects(safe.transaction(() => { throw new Error("must not run"); }), /has not loaded/);
  await assert.rejects(safe.push({draft:true}), /has not loaded/);
  await assert.rejects(safe.push().set({draft:true}), /has not loaded/);
  assert.equal(writes.length, 0, "no underlying mutation may run before hydration");
  safe.on("value", () => {}); assert.deepEqual(reads, ["state"], "read methods retain their reference binding");
  c.__stateHydrated = true;
  await safe.child("checked").set({saved:true});
  await safe.update({"laundry/today":true});
  assert.equal(writes.length, 2);
  assert.equal(writes[0].path, "state/checked");
  assert.ok(messages.length >= 8);
}

function startupAndHydration() {
  let starts = 0, renders = 0, queued = 0, weather = 0, carries = 0, waiting = 0;
  const c = context({__stateHydrated:false, currentTab:"today", document:{getElementById:() => ({remove(){}}), addEventListener(){}},
    hgLoadingState:() => waiting++, queueRenderAll:() => queued++, renderAll:() => renders++,
    autoCarryOverdue:() => carries++, setTabBg(){}, loadWeather:() => weather++, setInterval(){return 1;}, addEventListener(){}});
  vm.runInContext(section("function showApp()", "// ── 🔒 AUTH GATE"), c);
  c.showApp(); assert.equal(waiting, 1); assert.equal(weather, 0); assert.equal(renders, 0);
  c.__stateHydrated = true; c.showApp(); c.showApp();
  assert.deepEqual({renders, queued, weather, carries}, {renders:1, queued:1, weather:1, carries:1});

  let valueListener, errorListener, timeout;
  const hydrated = context({__dataStarted:false, __stateHydrated:false, fbTimeout:null,
    ST:{on(_event, value, error){ starts++; valueListener=value; errorListener=error; }, child(){throw new Error("unexpected migration write");}, update(){throw new Error("unexpected migration write");}},
    setTimeout(fn){timeout=fn;return 1;}, clearTimeout(){}, showApp:() => {}, hgLoadingState:() => waiting++,
    localStorage:{getItem:() => null}, console:{warn(){}}});
  vm.runInContext(section("function startData()", "// ── 🔒 AUTH BOOT"), hydrated);
  hydrated.startData(); hydrated.startData(); assert.equal(starts, 1, "attach only one state listener");
  timeout(); assert.equal(hydrated.__stateHydrated, false, "fallback is never an empty-state authorization");
  const flags = Object.fromEntries([...html.matchAll(/!flags\['([^']+)'\]/g)].map(m => [m[1], "done"]));
  valueListener({val:() => ({flags, watered:{}, checked:{keep:true}})});
  assert.equal(hydrated.__stateHydrated, true); assert.equal(hydrated.checked.keep, true);
  valueListener({val:() => []}); assert.equal(hydrated.__stateHydrated, false, "invalid state must disable mutations");
  valueListener({val:() => ({flags, watered:{}, checked:{keep:true}})});
  errorListener(new Error("offline")); assert.equal(hydrated.__stateHydrated, false, "read errors must not authorize writes");
}

function viewStateAndCoalescing() {
  const frames = new Map(); let frameId = 0, renders = 0;
  const root = {querySelectorAll(){return this.items;}, items:[]};
  const doc = {activeElement:null, getElementById:() => root};
  function field(id, value, tag = "INPUT") {
    return {id, value, tagName:tag, type:"text", name:"", options:[{value:"tomorrow"},{value:"today"}],
      selectionStart:2, selectionEnd:5, selectionDirection:"forward", focus(){doc.activeElement=this;},
      setSelectionRange(a,b,d){this.selectionStart=a;this.selectionEnd=b;this.selectionDirection=d;}};
  }
  function details(count) { return {id:"", name:"", tagName:"DETAILS", className:"instructions", open:false,
    querySelector:() => ({textContent:"Later treatments · " + count + " still needed"}), closest:() => null}; }
  root.items = [field("grocInput", "Unsaved test draft"), field("ckDay", "tomorrow", "SELECT"), details(3)];
  root.items[2].open = true; doc.activeElement = root.items[0];
  const c = context({currentTab:"grocery", document:doc, updateHeader(){},
    renderGrocery(){renders++;root.items=[field("grocInput", ""),field("ckDay", "today", "SELECT"), details(2)];},
    requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;}, cancelAnimationFrame(id){frames.delete(id);}});
  vm.runInContext(section("function hgViewStateKey", "// ── FIREBASE REAL-TIME LISTENER"), c);
  c.queueRenderAll(); c.queueRenderAll(); assert.equal(frames.size, 1, "sync echoes coalesce");
  c.renderAll(); assert.equal(frames.size, 0, "an immediate user render supersedes a pending echo");
  assert.equal(renders, 1); assert.equal(root.items[0].value, "Unsaved test draft");
  assert.equal(root.items[1].value, "tomorrow"); assert.equal(root.items[2].open, true);
  assert.equal(doc.activeElement, root.items[0]); assert.equal(root.items[0].selectionEnd, 5);
}

async function weatherDeduplication() {
  let clock = Date.parse("2026-10-08T12:00:00Z"), resolvePoints, requestCount = 0, renders = 0;
  const urls = [], timers = new Map(); let timerId = 0;
  class TestDate extends Date { static now(){return clock;} }
  const forecast = {properties:{periods:[{startTime:"2026-10-08T06:00:00-06:00",temperature:60,windSpeed:"5 mph",shortForecast:"Clear",probabilityOfPrecipitation:{value:0},relativeHumidity:{value:30}}]}};
  const c = context({Date:TestDate, Promise, URL, AbortController, WXF:{ready:false}, currentTab:"today", todayKey:() => "2026-10-08",
    nwsWindSpeed:() => 5, nwsCode:() => 0, renderHeaderWeather(){}, queueRenderAll:() => renders++,
    setTimeout(fn){timers.set(++timerId,fn);return timerId;}, clearTimeout(id){timers.delete(id);},
    fetch(url){ urls.push(url); requestCount++; if(requestCount===1) return new Promise(resolve => {resolvePoints=resolve;}); return Promise.resolve({ok:true,json:async() => forecast}); }});
  vm.runInContext(section("let hgWeatherFlight", "function renderHeaderWeather"), c);
  const first = c.loadWeather(); assert.equal(c.loadWeather(), first, "concurrent/focus calls share one request chain");
  assert.equal(requestCount, 1);
  resolvePoints({ok:true,json:async() => ({properties:{forecastHourly:"https://api.weather.gov/gridpoints/PUB/1,1/forecast/hourly"}})});
  await first; assert.equal(requestCount, 2); assert.equal(renders, 1); assert.equal(c.WXF.ready, true); assert.equal(timers.size, 0);
  await c.loadWeather(); assert.equal(requestCount, 2, "fresh weather must not refetch on focus or snapshot");
  clock += 2700001; await c.loadWeather(); assert.equal(requestCount, 3, "cache the stable NWS grid endpoint");
  assert.ok(urls.every(url => new URL(url).hostname === "api.weather.gov"), "weather requests remain NWS-only");
  clock += 2700001; c.fetch = async url => {urls.push(url); requestCount++; throw new Error("offline");};
  await c.loadWeather(); await c.loadWeather(); assert.equal(requestCount, 4, "failed refreshes are briefly throttled");
  assert.equal(c.WXF.ready, true, "retain the last successful forecast after a failed refresh");
}

async function authDoesNotBypassTimeout() {
  let timer, started = 0, login = 0, resolveProbe;
  const c = context({firebase:{auth:() => ({onAuthStateChanged(){}})}, __dataStarted:false,
    db:{ref:() => ({once:() => new Promise(resolve => {resolveProbe=resolve;})})},
    setTimeout(fn){timer=fn;return 1;}, clearTimeout(){}, startData:() => started++,
    hgShowLogin:() => login++, hgHideLogin(){}, hgLoadingState(){}, document:{getElementById:() => ({textContent:""})}});
  vm.runInContext(section("(function hgAuthBoot()", "const HEADER_NIGHT"), c);
  timer(); assert.equal(started, 0, "probe timeout must not bypass auth/rules"); assert.equal(login, 1);
  resolveProbe(); await Promise.resolve(); await Promise.resolve(); assert.equal(started, 1, "a successful public-read probe may proceed");
}

function singleFoodWrite() {
  const writes = [];
  const c = context({ST:{update:x => writes.push(x)}, inventory:{}, grocCustom:{}, grocPurchased:{}, shopping:{},
    GROC_BUILTIN:[{id:"eggs",label:"🥚 Eggs"}], renderGrocery(){}, toast(){}, saveShopping(){}});
  vm.runInContext(section("function saveFood()", "function ingFood("), c);
  c.buyGroc("eggs"); assert.equal(writes.length, 1, "one purchase must make one atomic food-state write");
  assert.deepEqual(Object.keys(writes[0]).sort(), ["grocCustom","grocPurchased","inventory"]);
}

(async function(){
  await writesRequireHydration(); startupAndHydration(); viewStateAndCoalescing();
  await weatherDeduplication(); await authDoesNotBypassTimeout(); singleFoodWrite();
  console.log("runtime hydration, draft preservation, auth timeout, weather deduplication and food-write checks passed");
})().catch(err => {console.error(err);process.exitCode=1;});
