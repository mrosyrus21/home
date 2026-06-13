/* ═══════════════════════════════════════════════════════════════
   v2-features.js — ADDITIVE features layer (Jun 12 2026)
   Loads after the main inline app script; nothing here removes or
   restyles existing content — it only adds:
     😴 Sleep — log, 14-night chart, smartwatch CSV import, reminders
     📜 Weekly recap card on Today (with 7-day sparkbars)
     💰 Finance charts — debt trend line + bills month timeline
     📸 Harvest journal with photos (Plants → Harvest)
     🏠 Room photo headers (shows automatically when images/room_<id>.jpg exists)
   Deploy note: copy this file alongside index.html (and add it to sw.js SHELL).
   ═══════════════════════════════════════════════════════════════ */

// ── tiny helpers ──────────────────────────────────────────────────
function hgEsc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function hgDayKey(offset){ const d=new Date(); d.setDate(d.getDate()+offset); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function hgNiceDay(k){ const M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; const p=String(k).split("-"); return M[+p[1]-1]+" "+(+p[2]); }
function hgMin2h(m){ if(!m&&m!==0) return "—"; const h=Math.floor(m/60), mm=Math.round(m%60); return h+"h"+(mm?" "+String(mm).padStart(2,"0")+"m":""); }
function hgSpark(arr,max,color){ // 7 tiny glow bars
  const m=Math.max(1,max);
  return '<div style="display:flex;gap:3px;align-items:flex-end;height:22px;flex-shrink:0">'+arr.map(function(v){
    const h=Math.max(8,Math.round(Math.min(v/m,1)*100));
    const on=v>0;
    return '<div style="width:6px;height:'+h+'%;border-radius:2px;background:'+(on?color:'rgba(255,255,255,.10)')+';'+(on?'box-shadow:0 0 6px '+color+'66':'')+'"></div>';
  }).join("")+'</div>';
}

// ═══ 😴 SLEEP — the rebuild ═══════════════════════════════════════
const HG_SLEEP_GOAL = 450; // 7h30 in minutes — the green zone center
let _hgQ = 3;              // transient quality picker state

function hgSleepPrefs(){ sleep._prefs = sleep._prefs || {}; return sleep._prefs; }
function hgSleepKeys(){ return Object.keys(sleep).filter(function(k){ return /^\d{4}-/.test(k); }).sort(); }
function hgSleepCalcMins(bed,wake){ const b=bed.split(":"), w=wake.split(":"); let bm=+b[0]*60+(+b[1]), wm=+w[0]*60+(+w[1]); if(wm<=bm) wm+=1440; return wm-bm; }
function hgSleepColor(m){ return m<360?"#F87171":m<420?"#FACC15":m<=560?"#4AD490":"#38BDF8"; }

function hgQSet(n){ _hgQ=n; for(let i=1;i<=5;i++){ const e=document.getElementById("hg-moon-"+i); if(e) e.classList.toggle("on", i<=n); } }
function hgSleepSave(){
  const b=document.getElementById("hg-bed"), w=document.getElementById("hg-wake");
  if(!b||!w||!b.value||!w.value){ try{toast("Set both times first");}catch(e){} return; }
  const t=todayKey(), mins=hgSleepCalcMins(b.value,w.value);
  sleep[t]={ bed:b.value, wake:w.value, mins:mins, q:_hgQ, src:"m" };
  saveSleep();
  try{ toast("😴 "+hgMin2h(mins)+" logged — the picture builds"); }catch(e){}
  renderWellness();
}
function hgSleepDelete(k){ if(!confirm("Remove the "+hgNiceDay(k)+" night?")) return; delete sleep[k]; saveSleep(); renderWellness(); }

function hgSleepStats(){
  const keys=hgSleepKeys();
  const last7=[]; for(let i=6;i>=0;i--){ const k=hgDayKey(-i); if(sleep[k]&&sleep[k].mins) last7.push(sleep[k]); }
  const avg=last7.length? Math.round(last7.reduce(function(s,e){return s+e.mins;},0)/last7.length) : 0;
  // streak of nights ≥7h, walking back from today (today not yet logged doesn't break it)
  let streak=0, i0=sleep[todayKey()]?0:1;
  for(let i=i0;i<60;i++){ const e=sleep[hgDayKey(-i)]; if(e&&e.mins>=420) streak++; else break; }
  if(sleep[todayKey()]&&sleep[todayKey()].mins>=420) streak=Math.max(streak,1);
  // bedtime consistency over the last 7 logged nights
  const beds=last7.filter(function(e){return e.bed;}).map(function(e){ const p=e.bed.split(":"); let m=+p[0]*60+(+p[1]); if(m<720) m+=1440; return m; });
  const drift=beds.length>1? Math.max.apply(null,beds)-Math.min.apply(null,beds) : null;
  return { n:keys.length, avg:avg, n7:last7.length, streak:streak, drift:drift };
}

function hgSleepChartHtml(){
  let bars="";
  for(let i=13;i>=0;i--){
    const k=hgDayKey(-i), e=sleep[k];
    const m=e?e.mins:0;
    const h=e? Math.max(6,Math.min(100,Math.round(m/600*100))) : 5;
    const c=e? hgSleepColor(m) : "rgba(255,255,255,.08)";
    bars+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0">'
      +'<div style="width:70%;height:'+h+'%;min-height:4px;border-radius:4px 4px 2px 2px;background:'+c+';'+(e?'box-shadow:0 0 10px '+c+'55;':'')+'margin-top:auto" title="'+hgNiceDay(k)+(e?' · '+hgMin2h(m):' · not logged')+'"></div>'
      +'<div style="font-size:8.5px;color:var(--text3);font-family:\'Lora\',serif">'+(i%2===0?(+k.slice(8)):'')+'</div>'
      +'</div>';
  }
  return '<div style="position:relative;height:120px;display:flex;align-items:stretch;gap:2px;padding-top:6px">'
    +'<div style="position:absolute;left:0;right:0;bottom:calc('+Math.round(HG_SLEEP_GOAL/600*100)+'% + 14px);border-top:1px dashed rgba(167,139,250,.5)"><span style="position:absolute;right:0;top:-14px;font-size:9px;color:#A78BFA;font-family:\'Lora\',serif">7h30 goal</span></div>'
    +bars+'</div>';
}

function hgSleepSectionHtml(today){
  const P="#A78BFA";
  const e=sleep[today];
  const keys=hgSleepKeys();
  const last=keys.length?sleep[keys[keys.length-1]]:null;
  const def=e||last||{bed:"23:00",wake:"07:00",q:3};
  _hgQ=(e&&e.q)||3;
  const st=hgSleepStats();
  const prefs=sleep._prefs||{};
  let out='<div class="section-label" id="sleep-section">😴 Sleep — the rebuild</div>';

  // ── log card ──
  out+='<div style="background:linear-gradient(135deg,rgba(167,139,250,.13),rgba(167,139,250,.03));border:1px solid rgba(167,139,250,.4);border-radius:var(--rad);padding:16px 18px;margin-bottom:12px;box-shadow:0 2px 16px rgba(167,139,250,.1)">'
    +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">'
    +'<div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:700;color:var(--text)">'+(e?"Last night — logged ✓":"Log last night")+'</div>'
    +(e?'<div style="font-size:13px;color:'+hgSleepColor(e.mins)+';font-family:\'Lora\',serif;font-weight:700">'+hgMin2h(e.mins)+'</div>':'')
    +(st.streak>=2?'<span style="font-size:11px;color:#FB923C;border:1px solid #FB923C55;border-radius:10px;padding:1px 7px">🔥 '+st.streak+' nights ≥7h</span>':'')
    +'</div>'
    +'<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;align-items:flex-end">'
    +'<div><div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:'+P+';font-family:\'Lora\',serif;margin-bottom:4px">In bed</div><input id="hg-bed" type="time" class="hg-time" value="'+hgEsc((e&&e.bed)||def.bed||"23:00")+'"></div>'
    +'<div><div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:'+P+';font-family:\'Lora\',serif;margin-bottom:4px">Woke up</div><input id="hg-wake" type="time" class="hg-time" value="'+hgEsc((e&&e.wake)||def.wake||"07:00")+'"></div>'
    +'<div style="flex:1;min-width:120px"><div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:'+P+';font-family:\'Lora\',serif;margin-bottom:4px">How did it feel?</div><div style="display:flex;gap:4px">'
    +[1,2,3,4,5].map(function(i){ return '<span id="hg-moon-'+i+'" class="hg-moon'+(i<=_hgQ?" on":"")+'" onclick="hgQSet('+i+')">🌙</span>'; }).join("")
    +'</div></div>'
    +'<button onclick="hgSleepSave()" style="background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.55);border-radius:12px;padding:12px 20px;color:#C4B5FD;font-size:14px;font-weight:700;font-family:\'Lora\',serif;cursor:pointer;min-height:44px">'+(e?"Update":"Save")+'</button>'
    +'</div>'
    +(e?'<div style="font-size:11px;color:var(--text3);font-family:\'Lora\',serif;font-style:italic;margin-top:8px;cursor:pointer" onclick="hgSleepDelete(\''+today+'\')">✕ remove tonight\'s entry</div>':'')
    +'</div>';

  // ── chart + stats card ──
  out+='<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:var(--rad);padding:15px 17px;margin-bottom:12px">'
    +'<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:'+P+';font-family:\'Lora\',serif;margin-bottom:2px">Last 14 nights</div>'
    +hgSleepChartHtml()
    +'<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.06)">'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:19px;font-weight:700;color:'+(st.avg?hgSleepColor(st.avg):"var(--text3)")+'">'+(st.avg?hgMin2h(st.avg):"—")+'</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">7-day average'+(st.n7?' · '+st.n7+' logged':'')+'</div></div>'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:19px;font-weight:700;color:#FB923C">'+st.streak+'</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">nights ≥7h in a row</div></div>'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:19px;font-weight:700;color:'+(st.drift==null?"var(--text3)":(st.drift<=60?"#4AD490":st.drift<=120?"#FACC15":"#F87171"))+'">'+(st.drift==null?"—":"±"+Math.round(st.drift/2)+"m")+'</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">bedtime drift (7d)</div></div>'
    +'</div>'
    +'<div style="font-size:11.5px;color:var(--text2);font-family:\'Lora\',serif;font-style:italic;line-height:1.55;margin-top:10px">The two levers that matter most: a <b style="color:#C4B5FD">consistent bedtime</b> (drift under ±30m) and <b style="color:#C4B5FD">morning sunlight</b> — both already in your routine: 10 PM melatonin + screens-off, and light in your eyes within 30 min of waking.</div>'
    +'</div>';

  // ── smartwatch card ──
  out+='<div style="background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.25);border-radius:var(--rad);padding:15px 17px;margin-bottom:12px">'
    +'<div style="font-family:\'Playfair Display\',serif;font-size:15px;font-weight:700;color:#7DD3FC;margin-bottom:6px">⌚ Galaxy Watch → here</div>'
    +'<div style="font-size:12.5px;color:var(--text2);font-family:\'Lora\',serif;line-height:1.6">Samsung keeps Health data on the phone — there\'s no live feed a web app can read. Two ways that work:</div>'
    +'<div style="display:flex;gap:9px;padding:8px 2px;font-size:12.5px;color:var(--text2);font-family:\'Lora\',serif;line-height:1.55"><span style="flex-shrink:0">1.</span><span><b style="color:var(--text)">The morning glance</b> (recommended) — wear the watch to bed, check Samsung Health over coffee, log it above. Ten seconds, and the chart stays alive.</span></div>'
    +'<div style="display:flex;gap:9px;padding:2px 2px 8px;font-size:12.5px;color:var(--text2);font-family:\'Lora\',serif;line-height:1.55"><span style="flex-shrink:0">2.</span><span><b style="color:var(--text)">Bulk import</b> — Samsung Health → ⚙️ Settings → <i>Download personal data</i>. Unzip, find the file starting with <span style="color:#7DD3FC">com.samsung.shealth.sleep</span>, and feed it in here. Watch nights fill in without touching manual logs.</span></div>'
    +'<label style="display:inline-flex;align-items:center;gap:8px;background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.5);border-radius:12px;padding:11px 18px;color:#7DD3FC;font-size:13px;font-weight:700;font-family:\'Lora\',serif;cursor:pointer;min-height:20px">📥 Import sleep CSV<input type="file" accept=".csv,text/csv" style="display:none" onchange="hgSleepImport(this)"></label>'
    +'</div>';

  // ── reminders card ──
  const remOn=!!prefs.on;
  out+='<div style="background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.25);border-radius:var(--rad);padding:15px 17px;margin-bottom:14px">'
    +'<div style="display:flex;align-items:center;gap:12px">'
    +'<div style="flex:1"><div style="font-family:\'Playfair Display\',serif;font-size:15px;font-weight:700;color:#FDBA74">🔔 Wind-down reminder</div>'
    +'<div style="font-size:11.5px;color:var(--text2);font-family:\'Lora\',serif;margin-top:3px;line-height:1.5">A nudge at <input type="time" class="hg-time" style="padding:4px 8px;font-size:13px" value="'+hgEsc(prefs.wind||"22:00")+'" onchange="hgRemindWind(this.value)"> — screens off, melatonin, book. Plus an 8:30 AM "log last night" nudge. Fires while the app is open on any device.</div></div>'
    +'<button onclick="hgRemindToggle()" style="background:'+(remOn?"rgba(74,212,144,.16)":"rgba(255,255,255,.06)")+';border:1px solid '+(remOn?"rgba(74,212,144,.55)":"rgba(255,255,255,.2)")+';border-radius:12px;padding:11px 16px;color:'+(remOn?"#4AD490":"var(--text2)")+';font-size:13px;font-weight:700;font-family:\'Lora\',serif;cursor:pointer;min-height:44px;flex-shrink:0">'+(remOn?"On ✓":"Turn on")+'</button>'
    +'</div></div>';

  return out;
}

// ── smartwatch CSV import (Samsung Health "Download personal data" export) ──
function hgParseSamsungSleep(txt){
  const lines=txt.split(/\r?\n/);
  let hi=-1;
  for(let i=0;i<Math.min(lines.length,6);i++){ if(/start_time/i.test(lines[i])&&/end_time/i.test(lines[i])){ hi=i; break; } }
  if(hi<0) throw new Error("no header row");
  const cols=lines[hi].split(",").map(function(c){return c.trim();});
  let si=-1, ei=-1;
  cols.forEach(function(c,i){ if(/(^|\.)start_time$/i.test(c)) si=i; if(/(^|\.)end_time$/i.test(c)) ei=i; });
  if(si<0||ei<0) throw new Error("no time columns");
  const parseT=function(v){ v=String(v||"").trim(); if(!v) return null;
    if(/^\d{12,}$/.test(v)) return new Date(+v);
    const d=new Date(v.replace(" ","T")); return isNaN(d.getTime())?null:d; };
  const nights={};
  for(let i=hi+1;i<lines.length;i++){
    if(!lines[i]) continue;
    const cells=lines[i].split(",");
    const s=parseT(cells[si]), e2=parseT(cells[ei]);
    if(!s||!e2) continue;
    const mins=(e2-s)/60000;
    if(mins<45||mins>20*60) continue;
    const k=e2.getFullYear()+"-"+String(e2.getMonth()+1).padStart(2,"0")+"-"+String(e2.getDate()).padStart(2,"0");
    if(!nights[k]) nights[k]={ s:s, e:e2, mins:0 };
    nights[k].mins+=mins;
    if(s<nights[k].s) nights[k].s=s;
    if(e2>nights[k].e) nights[k].e=e2;
  }
  return nights;
}
function hgSleepImport(inp){
  const f=inp.files&&inp.files[0]; if(!f) return;
  const rd=new FileReader();
  rd.onload=function(){
    try{
      const nights=hgParseSamsungSleep(String(rd.result));
      let added=0, kept=0;
      Object.keys(nights).forEach(function(k){
        if(sleep[k]&&sleep[k].src==="m"){ kept++; return; }
        const n=nights[k];
        const hm=function(d){ return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); };
        sleep[k]={ bed:hm(n.s), wake:hm(n.e), mins:Math.round(n.mins), src:"w" };
        added++;
      });
      if(added){ saveSleep(); }
      try{ toast("⌚ Imported "+added+" night"+(added===1?"":"s")+(kept?" · kept "+kept+" manual logs":"")); }catch(e){}
      renderWellness();
    }catch(err){ try{ toast("⚠️ Couldn't read that file — is it the com.samsung.shealth.sleep CSV?"); }catch(e){} }
  };
  rd.readAsText(f);
  inp.value="";
}

// ── reminders (fire while the app is open; true push = Firebase upgrade) ──
function hgRemindToggle(){
  const p=hgSleepPrefs();
  if(!p.on && "Notification" in window){
    Notification.requestPermission().then(function(r){
      if(r==="granted"){ p.on=true; saveSleep();
        try{ new Notification("🔔 Reminders on",{ body:"Wind-down nudge at "+(p.wind||"22:00")+" · morning log nudge at 8:30. Works while the app is open." }); }catch(e){}
      } else { try{ toast("⚠️ Notifications are blocked — allow them in your browser settings"); }catch(e){} }
      renderWellness();
    });
  } else { p.on=!p.on; saveSleep(); renderWellness(); }
}
function hgRemindWind(v){ const p=hgSleepPrefs(); p.wind=v; saveSleep(); try{ toast("🌙 Wind-down set to "+v); }catch(e){} }
setInterval(function(){
  try{
    const p=sleep&&sleep._prefs;
    if(!p||!p.on||!("Notification" in window)||Notification.permission!=="granted") return;
    const now=new Date(), t=todayKey();
    const hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
    const fire=function(key,title,body){
      const lk="hg-rem-"+key+"-"+t;
      if(localStorage.getItem(lk)) return;
      localStorage.setItem(lk,"1");
      try{ new Notification(title,{ body:body }); }catch(e){}
    };
    if(hm===(p.wind||"22:00")) fire("wind","🌙 Wind-down time","Screens off, melatonin + L-theanine, book open. Tomorrow-you says thanks.");
    if(hm==="08:30"&&!sleep[t]) fire("log","😴 Log last night","Two taps in Health → Sleep while it's fresh.");
  }catch(e){}
},20000);

// ═══ 📜 WEEKLY RECAP — appended to the end of the Today feed ═══════
function hgRecapHtml(){
  const days=[]; for(let i=6;i>=0;i--) days.push(hgDayKey(-i));
  const water=days.map(function(d){ return (habits.water&&habits.water[d])||0; });
  const goal=(typeof waterGoal==="function")?waterGoal():3;
  const meals=days.map(function(d){ return (typeof mealsEaten==="function")?mealsEaten(d):0; });
  const lit=days.map(function(d){ return laundry["well-litfulo-"+d]?1:0; });
  const outd=days.map(function(d){ return laundry["well-outside-"+d]?1:0; });
  const slp=days.map(function(d){ return (sleep[d]&&sleep[d].mins)||0; });
  const wTot=water.reduce(function(a,b){return a+b;},0), wDays=water.filter(function(v){return v>=goal;}).length;
  const mTot=meals.reduce(function(a,b){return a+b;},0);
  const lTot=lit.reduce(function(a,b){return a+b;},0);
  const oTot=outd.reduce(function(a,b){return a+b;},0);
  const sN=slp.filter(function(v){return v>0;}).length;
  const sAvg=sN? Math.round(slp.reduce(function(a,b){return a+b;},0)/sN) : 0;
  let streak=0; try{ const hs=habitStats(); streak=(hs&&hs.streak)||0; }catch(e){}
  const row=function(emoji,label,val,spark){
    return '<div style="display:flex;align-items:center;gap:11px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">'
      +'<div style="font-size:17px;flex-shrink:0">'+emoji+'</div>'
      +'<div style="flex:1;min-width:0"><span style="font-size:13.5px;color:var(--text);font-family:\'Lora\',serif">'+label+'</span> <span style="font-size:12.5px;color:var(--text2);font-family:\'Lora\',serif">'+val+'</span></div>'
      +spark+'</div>';
  };
  const bestLine = wDays>=5 ? "Hydration carried the week — keep pouring. 💧"
    : oTot>=4 ? "You kept getting outside — that's the engine for everything else. 🌞"
    : lTot>=6 ? "Perfect med consistency — exactly what the Litfulo rebuild needs. 💪"
    : sN>=4 ? "The sleep picture is forming — every logged night sharpens it. 🌙"
    : "Every row here builds from a single tap a day — small is the system. 🌱";
  return '<div id="wk-recap" style="margin-top:18px"><div class="section-label">📜 This week — last 7 days</div>'
    +'<div style="background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(240,168,32,.05));border:1px solid rgba(167,139,250,.35);border-radius:var(--rad);padding:14px 17px;box-shadow:0 2px 18px rgba(167,139,250,.08)">'
    +row("💧","Water","— "+wTot+" bottle"+(wTot===1?"":"s")+" · goal hit "+wDays+"/7 days",hgSpark(water,Math.max(goal,Math.max.apply(null,water)),"#38BDF8"))
    +row("🍽️","Meals","— "+mTot+" of 21",hgSpark(meals,3,"#FACC15"))
    +row("💊","Litfulo","— "+lTot+"/7 days",hgSpark(lit,1,"#818CF8"))
    +row("🌳","Outside","— "+oTot+"/7 days",hgSpark(outd,1,"#4AD490"))
    +row("😴","Sleep",sN? "— avg "+hgMin2h(sAvg)+" · "+sN+" logged":"— not logged yet · tonight's the night",hgSpark(slp,600,"#A78BFA"))
    +'<div style="display:flex;align-items:center;gap:10px;padding-top:10px">'
    +(streak>=2?'<span style="font-size:11px;color:#FB923C;border:1px solid #FB923C55;border-radius:10px;padding:2px 8px;flex-shrink:0">🔥 '+streak+'-day habit streak</span>':'')
    +'<div style="font-size:12px;color:var(--text2);font-family:\'Lora\',serif;font-style:italic;line-height:1.5">'+bestLine+'</div>'
    +'</div></div></div>';
}
(function(){
  if(typeof renderToday!=="function") return;
  const orig=renderToday;
  renderToday=function(){
    orig();
    try{
      const el=document.getElementById("view-today");
      if(el&&!el.querySelector("#wk-recap")) el.insertAdjacentHTML("beforeend",hgRecapHtml());
    }catch(e){}
  };
})();

// ═══ 💰 FINANCE CHARTS ═════════════════════════════════════════════
function hgDebtChartsHtml(){
  if(typeof FINANCE==="undefined"||!FINANCE.debts||!FINANCE.debts.length) return "";
  const debts=FINANCE.debts;
  const startTotal=debts.reduce(function(s,d){ return s+(+d.start||0); },0);
  let dateSet={};
  let anyReal=false;
  debts.forEach(function(d){ finSeries("debt",d.id).forEach(function(p){ dateSet[p.d]=1; anyReal=true; }); });
  const dates=Object.keys(dateSet).sort();
  const t=todayKey();
  if(dates[dates.length-1]!==t) dates.push(t);
  const totalAt=function(date){
    let tot=0;
    debts.forEach(function(d){
      const s=finSeries("debt",d.id).filter(function(p){ return p.d<=date; });
      tot+= s.length? s[s.length-1].v : (+d.start||0);
    });
    return tot;
  };
  const pts=[{d:null,v:startTotal}].concat(dates.map(function(dd){ return {d:dd,v:totalAt(dd)}; }));
  const cur=pts[pts.length-1].v, paid=startTotal-cur;
  const W=320,H=88,Pd=10;
  const vmax=Math.max.apply(null,pts.map(function(p){return p.v;}));
  const vmin=Math.min.apply(null,pts.map(function(p){return p.v;}));
  const span=Math.max(1,vmax-vmin);
  const xy=pts.map(function(p,i){
    const x=Pd+i*(W-2*Pd)/Math.max(1,pts.length-1);
    const y=H-Pd-((p.v-vmin)/span)*(H-2*Pd);
    return [x,y];
  });
  const poly=xy.map(function(p){ return p[0].toFixed(1)+","+p[1].toFixed(1); }).join(" ");
  const area=poly+" "+xy[xy.length-1][0].toFixed(1)+","+(H-2)+" "+xy[0][0].toFixed(1)+","+(H-2);
  const G2="#4AD490";
  return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(251,146,60,.3);border-radius:var(--rad);padding:14px 16px;margin-bottom:14px">'
    +'<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FB923C;font-family:\'Lora\',serif;margin-bottom:8px">📉 Total debt — the line you\'re bending down</div>'
    +'<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block" preserveAspectRatio="none">'
    +'<defs><linearGradient id="hgDebtFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(251,146,60,.35)"/><stop offset="100%" stop-color="rgba(251,146,60,0)"/></linearGradient></defs>'
    +'<polygon points="'+area+'" fill="url(#hgDebtFill)"></polygon>'
    +'<polyline points="'+poly+'" fill="none" stroke="#FB923C" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 5px rgba(251,146,60,.7))"></polyline>'
    +xy.map(function(p,i){ return i===xy.length-1?'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.5" fill="#FB923C" style="filter:drop-shadow(0 0 6px rgba(251,146,60,.9))"></circle>':""; }).join("")
    +'</svg>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px">'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:17px;font-weight:700;color:var(--text)">'+finFmt(cur,true)+'</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">owed today</div></div>'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:17px;font-weight:700;color:'+(paid>0?G2:"var(--text3)")+'">'+(paid>0?"−"+finFmt(paid,true):finFmt(0,true))+'</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">paid down since the start</div></div>'
    +'<div><div style="font-family:\'Playfair Display\',serif;font-size:17px;font-weight:700;color:#FB923C">'+(startTotal>0?Math.round(paid/startTotal*100):0)+'%</div><div style="font-size:10.5px;color:var(--text2);font-family:\'Lora\',serif">of the mountain gone</div></div>'
    +'</div>'
    +(!anyReal?'<div style="font-size:11.5px;color:var(--text2);font-family:\'Lora\',serif;font-style:italic;margin-top:8px">Tap any balance below to record today\'s number — the line starts moving with the second point.</div>':"")
    +'</div>';
}

function hgBillsTimelineHtml(bills,ym){
  try{
    const y=+ym.slice(0,4), m=+ym.slice(5,7);
    const dim=new Date(y,m,0).getDate();
    const todayD=(todayKey().slice(0,7)===ym)? +todayKey().slice(8) : null;
    const pds=[];
    if(typeof FINANCE!=="undefined"&&FINANCE.paydayAnchor){
      let d=new Date(FINANCE.paydayAnchor+"T12:00:00");
      for(let g=0; g<60 && d.getFullYear()<=y+1; g++){
        if(d.getFullYear()===y&&d.getMonth()===m-1) pds.push(d.getDate());
        if(d.getFullYear()>y||(d.getFullYear()===y&&d.getMonth()>m-1)) break;
        d=new Date(d.getTime()+14*86400000);
      }
    }
    const x=function(day){ return ((day-0.5)/dim*100).toFixed(2)+"%"; };
    let dots="";
    let lane=0;
    bills.forEach(function(b){
      const day=parseInt(String(b.due).replace(/[^0-9]/g,""),10);
      if(!day||day>dim) return;
      const pd=!!(fin.bills&&fin.bills[b.id+"-"+ym]);
      const sz=b.amt>=1000?15:b.amt>=200?11:8;
      const top=lane%2===0?12:34; lane++;
      dots+='<div title="'+hgEsc(b.label)+' · '+finFmt(b.amt,true)+' · due '+hgEsc(b.due)+(pd?" · paid ✓":"")+'" style="position:absolute;left:'+x(day)+';top:'+top+'px;width:'+sz+'px;height:'+sz+'px;margin-left:-'+(sz/2)+'px;border-radius:50%;'
        +(pd?'background:#10B981;box-shadow:0 0 9px rgba(16,185,129,.8)':'background:transparent;border:2px solid rgba(250,204,21,.75);box-shadow:0 0 7px rgba(250,204,21,.35)')+'"></div>';
    });
    const pdTicks=pds.map(function(day){
      return '<div title="payday" style="position:absolute;left:'+x(day)+';top:2px;bottom:14px;width:2px;margin-left:-1px;background:rgba(167,139,250,.65);box-shadow:0 0 7px rgba(167,139,250,.6)"></div>';
    }).join("");
    const todayLine=todayD?'<div style="position:absolute;left:'+x(todayD)+';top:0;bottom:12px;width:1.5px;margin-left:-1px;background:rgba(255,255,255,.85)"></div>':"";
    return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:var(--rad);padding:13px 16px 9px;margin-bottom:12px">'
      +'<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FACC15;font-family:\'Lora\',serif;margin-bottom:4px">🗓️ The month at a glance</div>'
      +'<div style="position:relative;height:58px">'
      +'<div style="position:absolute;left:0;right:0;top:28px;border-top:1px solid rgba(255,255,255,.1)"></div>'
      +pdTicks+todayLine+dots
      +'<div style="position:absolute;left:0;bottom:0;font-size:9px;color:var(--text3);font-family:\'Lora\',serif">1</div>'
      +'<div style="position:absolute;left:48%;bottom:0;font-size:9px;color:var(--text3);font-family:\'Lora\',serif">15</div>'
      +'<div style="position:absolute;right:0;bottom:0;font-size:9px;color:var(--text3);font-family:\'Lora\',serif">'+dim+'</div>'
      +'</div>'
      +'<div style="font-size:10px;color:var(--text3);font-family:\'Lora\',serif;margin-top:4px">💜 payday · ⚪ today · 🟡 due · 🟢 paid — dot size = bill size · tap a bill below to mark it paid</div>'
      +'</div>';
  }catch(e){ return ""; }
}

// ═══ 📸 HARVEST JOURNAL — Plants → Harvest ═════════════════════════
function hgJournalHtml(){
  const ids=Object.keys(harvestLog).sort(function(a,b){ return (harvestLog[b].ts||0)-(harvestLog[a].ts||0); });
  let out='<div id="hg-journal"><div class="section-label">📸 Harvest journal — proof it\'s working</div>';
  out+='<div style="background:rgba(255,255,255,.03);border:1px solid rgba(45,184,112,.3);border-radius:var(--rad);padding:13px 15px;margin-bottom:12px">'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +'<input id="hg-j-cap" placeholder="First red strawberry… basil haul… aphid victory…" style="flex:1;min-width:0;background:rgba(0,0,0,.25);border:1px solid rgba(45,184,112,.35);border-radius:10px;padding:11px 12px;color:var(--text);font-size:13.5px;font-family:\'Lora\',serif" onkeydown="if(event.key===\'Enter\')hgJournalNote()">'
    +'<label style="background:rgba(45,184,112,.16);border:1px solid rgba(45,184,112,.55);border-radius:10px;padding:10px 13px;color:#4AD490;font-size:16px;cursor:pointer;flex-shrink:0;min-height:20px" title="Add with a photo">📷<input type="file" accept="image/*" capture="environment" style="display:none" onchange="hgJournalAdd(this)"></label>'
    +'<button onclick="hgJournalNote()" style="background:rgba(45,184,112,.16);border:1px solid rgba(45,184,112,.55);border-radius:10px;padding:11px 14px;color:#4AD490;font-size:13px;font-weight:700;font-family:\'Lora\',serif;cursor:pointer;flex-shrink:0;min-height:44px">Add</button>'
    +'</div>'
    +'<div style="font-size:10.5px;color:var(--text3);font-family:\'Lora\',serif;font-style:italic;margin-top:7px">📷 opens the camera — photos are squeezed down and synced everywhere like everything else.</div>'
    +'</div>';
  if(!ids.length){
    out+='<div style="font-size:12.5px;color:var(--text2);font-family:\'Lora\',serif;font-style:italic;text-align:center;padding:10px 0 16px">Empty so far — the first strawberry deserves a photo. 🍓</div>';
  } else {
    out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
    ids.forEach(function(id){
      const e=harvestLog[id];
      out+='<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden">'
        +(e.img?'<img src="'+e.img+'" alt="" style="width:100%;height:110px;object-fit:cover;display:block">':"")
        +'<div style="padding:9px 11px">'
        +'<div style="font-size:10px;color:#4AD490;font-family:\'Lora\',serif;letter-spacing:.08em">'+hgNiceDay(e.date)+'</div>'
        +(e.text?'<div style="font-size:12.5px;color:var(--text);font-family:\'Lora\',serif;line-height:1.45;margin-top:2px">'+hgEsc(e.text)+'</div>':"")
        +'<div onclick="hgJournalDel(\''+id+'\')" style="font-size:10px;color:var(--text3);font-family:\'Lora\',serif;font-style:italic;margin-top:5px;cursor:pointer">✕ remove</div>'
        +'</div></div>';
    });
    out+='</div>';
  }
  out+='</div>';
  return out;
}
function hgJournalNote(){
  const el=document.getElementById("hg-j-cap");
  const v=(el&&el.value||"").trim();
  if(!v){ try{ toast("Write a line (or use 📷) first"); }catch(e){} return; }
  harvestLog["h"+Date.now().toString(36)]={ ts:Date.now(), date:todayKey(), text:v };
  saveHarvestLog();
  try{ toast("🌾 Noted in the journal"); }catch(e){}
  renderGarden();
}
function hgJournalAdd(inp){
  const f=inp.files&&inp.files[0]; if(!f) return;
  const cap=((document.getElementById("hg-j-cap")||{}).value||"").trim();
  const rd=new FileReader();
  rd.onload=function(){
    const img=new Image();
    img.onload=function(){
      const shrink=function(maxW,q){
        const sc=Math.min(1,maxW/img.width);
        const c=document.createElement("canvas");
        c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc);
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        return c.toDataURL("image/jpeg",q);
      };
      let durl=shrink(900,.72);
      if(durl.length>220000) durl=shrink(640,.6);
      if(durl.length>220000) durl=shrink(480,.5);
      harvestLog["h"+Date.now().toString(36)]={ ts:Date.now(), date:todayKey(), text:cap, img:durl };
      saveHarvestLog();
      try{ toast("📸 Saved to the journal"); }catch(e){}
      renderGarden();
    };
    img.onerror=function(){ try{ toast("⚠️ Couldn't read that image"); }catch(e){} };
    img.src=String(rd.result);
  };
  rd.readAsDataURL(f);
  inp.value="";
}
function hgJournalDel(id){ if(!confirm("Remove this entry?")) return; delete harvestLog[id]; saveHarvestLog(); renderGarden(); }
(function(){
  if(typeof renderGarden!=="function") return;
  const orig=renderGarden;
  renderGarden=function(){
    orig();
    try{
      if(gardenSub==="harvest"){
        const el=document.getElementById("view-garden");
        if(el&&!document.getElementById("hg-journal")) el.insertAdjacentHTML("beforeend",hgJournalHtml());
      }
    }catch(e){}
  };
})();

// ═══ 🏠 ROOM PHOTOS — shows automatically once images/room_<id>.jpg exists ═══
function hgRoomPhotoHtml(roomId){
  return '<div class="room-photo" style="display:none;margin:0 0 10px;border-radius:12px;overflow:hidden">'
    +'<img src="images/room_'+roomId+'.jpg" alt="" loading="lazy" style="width:100%;height:120px;object-fit:cover;display:block" '
    +'onload="this.parentNode.style.display=\'block\'" onerror="this.parentNode.remove()">'
    +'</div>';
}
