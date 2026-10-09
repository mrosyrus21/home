/* Selected Sleep and Finance helpers from v2-features.js.
   Deliberately excludes its Today, Harvest, and Room render hooks.
   Classic script: app state is read lazily after the main script initializes. */

function hgEsc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function hgDayKey(offset){ const d=new Date(); d.setDate(d.getDate()+offset); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function hgNiceDay(k){ const p=String(k).split("-"); return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1]-1]+" "+(+p[2]); }
function hgMin2h(m){ if(!Number.isFinite(m)) return "—"; const n=Math.round(m); return Math.floor(n/60)+"h"+(n%60?" "+String(n%60).padStart(2,"0")+"m":""); }
function hgSleepActionReady(){
  if(window.__stateHydrated===true) return true;
  try{ toast("Saved data is still loading — please wait before changing sleep entries."); }catch(_){}
  return false;
}
function hgRhythmTime(key){
  const value=typeof RHYTHM!=="undefined"?String(RHYTHM[key]||""):"";
  const m=value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if(!m) return "";
  let h=+m[1];
  if(m[3]){ if(h<1||h>12) return ""; h=h%12+(m[3].toUpperCase()==="PM"?12:0); }
  if(h>23||+m[2]>59) return "";
  return String(h).padStart(2,"0")+":"+m[2];
}
function hgSleepCalcMins(bed,wake){
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(bed)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(wake)) return NaN;
  const b=bed.split(":"),w=wake.split(":"); let bm=+b[0]*60+(+b[1]),wm=+w[0]*60+(+w[1]);
  if(wm<=bm) wm+=1440;
  return wm-bm;
}
function hgSleepColor(m){ return m<360?"#F87171":m<420?"#FACC15":m<=560?"#4AD490":"#38BDF8"; }
function hgSleepKeys(){ return Object.keys(sleep).filter(function(k){ return /^\d{4}-\d{2}-\d{2}$/.test(k); }).sort(); }
let _hgQ=3;
function hgQSet(n){ _hgQ=Math.max(1,Math.min(5,+n||3)); for(let i=1;i<=5;i++){ const e=document.getElementById("hg-moon-"+i); if(e){ e.classList.toggle("on",i<=_hgQ); e.setAttribute("aria-pressed",String(i===_hgQ)); } } }
function hgSleepSave(){
  if(!hgSleepActionReady()) return;
  const b=document.getElementById("hg-bed"),w=document.getElementById("hg-wake");
  const mins=b&&w?hgSleepCalcMins(b.value,w.value):NaN;
  if(!Number.isFinite(mins)||mins<45||mins>1200){ toast("Set valid bed and wake times (45 minutes to 20 hours apart)."); return; }
  sleep[todayKey()]={bed:b.value,wake:w.value,mins:mins,q:_hgQ,src:"m"};
  saveSleep(); toast("😴 "+hgMin2h(mins)+" logged"); renderWellness();
}
function hgSleepDelete(k){
  if(!hgSleepActionReady()||!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
  if(!confirm("Remove the "+hgNiceDay(k)+" night?")) return;
  delete sleep[k]; saveSleep(); renderWellness();
}
function hgSleepStats(){
  const last7=[]; for(let i=6;i>=0;i--){ const e=sleep[hgDayKey(-i)]; if(e&&Number.isFinite(e.mins)&&e.mins>0) last7.push(e); }
  const avg=last7.length?Math.round(last7.reduce(function(s,e){return s+e.mins;},0)/last7.length):0;
  let streak=0; for(let i=sleep[todayKey()]?0:1;i<60;i++){ const e=sleep[hgDayKey(-i)]; if(e&&e.mins>=420) streak++; else break; }
  const beds=last7.filter(function(e){return /^([01]\d|2[0-3]):[0-5]\d$/.test(e.bed||"");}).map(function(e){const p=e.bed.split(":");let m=+p[0]*60+(+p[1]);if(m<720)m+=1440;return m;});
  return {avg:avg,n7:last7.length,streak:streak,drift:beds.length>1?Math.max.apply(null,beds)-Math.min.apply(null,beds):null};
}
function hgSleepChartHtml(){
  let bars="";
  for(let i=13;i>=0;i--){
    const k=hgDayKey(-i),e=sleep[k],m=e&&Number.isFinite(e.mins)?e.mins:0;
    const h=m?Math.max(6,Math.min(90,Math.round(m/600*90))):5;
    bars+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0"><div style="width:70%;height:'+h+'px;flex-shrink:0;min-height:4px;border-radius:4px 4px 2px 2px;background:'+(m?hgSleepColor(m):'rgba(255,255,255,.08)')+';margin-top:auto" title="'+hgNiceDay(k)+(m?' · '+hgMin2h(m):' · not logged')+'"></div><div style="font-size:10px;line-height:12px;height:12px;color:var(--text3)">'+(i%2===0?(+k.slice(8)):'')+'</div></div>';
  }
  const planned=hgSleepCalcMins(hgRhythmTime("lightsOut"),hgRhythmTime("wake"));
  const guide=Number.isFinite(planned)?'<div style="position:absolute;left:0;right:0;bottom:'+(16+Math.min(90,Math.round(planned/600*90)))+'px;border-top:1px dashed rgba(167,139,250,.5)"><span style="position:absolute;right:0;top:-14px;font-size:10px;color:#A78BFA">'+hgMin2h(planned)+' planned window</span></div>':'';
  return '<div style="position:relative;height:120px;display:flex;align-items:stretch;gap:2px;padding-top:6px">'+guide+bars+'</div>';
}
function hgSleepSectionHtml(today){
  const e=sleep[today],keys=hgSleepKeys(),last=keys.length?sleep[keys[keys.length-1]]:null;
  const def=e||last||{},st=hgSleepStats(),prefs=sleep._prefs||{},P="#A78BFA";
  _hgQ=Math.max(1,Math.min(5,(e&&e.q)||3));
  let out='<div class="section-label" id="sleep-section">😴 Sleep</div>';
  out+='<div class="health-card" style="background:linear-gradient(135deg,rgba(167,139,250,.13),rgba(167,139,250,.03));border:1px solid rgba(167,139,250,.4);border-radius:var(--rad);padding:16px 18px;margin-bottom:12px">'
    +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-family:\'Playfair Display\',serif;font-size:16px;font-weight:700;color:var(--text)">'+(e?"Last night — logged ✓":"Log last night")+'</div>'
    +(e?'<div style="font-size:13px;color:'+hgSleepColor(e.mins)+'">'+hgMin2h(e.mins)+'</div>':'')+'</div>'
    +'<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;align-items:flex-end">'
    +'<label style="font-size:11px;color:'+P+'">In bed<br><input id="hg-bed" type="time" class="hg-time" value="'+hgEsc(def.bed||hgRhythmTime("lightsOut"))+'"></label>'
    +'<label style="font-size:11px;color:'+P+'">Woke up<br><input id="hg-wake" type="time" class="hg-time" value="'+hgEsc(def.wake||hgRhythmTime("wake"))+'"></label>'
    +'<div style="flex:1;min-width:236px"><div style="font-size:11px;color:'+P+';margin-bottom:4px">How did it feel?</div><div style="display:flex;gap:4px">'
    +[1,2,3,4,5].map(function(i){return '<button type="button" id="hg-moon-'+i+'" class="hg-moon'+(i<=_hgQ?' on':'')+'" aria-label="Sleep quality '+i+' of 5" aria-pressed="'+(i===_hgQ)+'" style="background:none;border:0;padding:0;min-width:44px;min-height:44px" onclick="hgQSet('+i+')">🌙</button>';}).join("")+'</div></div>'
    +'<button type="button" onclick="hgSleepSave()" style="background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.55);border-radius:12px;padding:12px 20px;color:#C4B5FD;font-size:14px;font-weight:700;cursor:pointer;min-height:44px">'+(e?'Update':'Save')+'</button></div>'
    +(e?'<button type="button" style="background:none;border:0;padding:8px 0;min-height:44px;color:var(--text3);font-size:11px;cursor:pointer" onclick="hgSleepDelete(\''+today+'\')">✕ remove last night’s entry</button>':'')+'</div>';
  out+='<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:var(--rad);padding:15px 17px;margin-bottom:12px"><div style="font-size:11px;color:'+P+'">Last 14 nights</div>'+hgSleepChartHtml()
    +'<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.06)">'
    +'<div><div style="font-size:19px;color:'+(st.avg?hgSleepColor(st.avg):'var(--text3)')+'">'+(st.avg?hgMin2h(st.avg):'—')+'</div><div style="font-size:11px;color:var(--text2)">7-day average'+(st.n7?' · '+st.n7+' logged':'')+'</div></div>'
    +'<div><div style="font-size:19px;color:#FB923C">'+st.streak+'</div><div style="font-size:11px;color:var(--text2)">nights ≥7h in a row</div></div>'
    +'<div><div style="font-size:19px;color:#C4B5FD">'+(st.drift==null?'—':'±'+Math.round(st.drift/2)+'m')+'</div><div style="font-size:11px;color:var(--text2)">bedtime drift (7d)</div></div></div>'
    +'<div style="font-size:11.5px;color:var(--text2);line-height:1.55;margin-top:10px">Current rhythm: wind-down '+hgEsc(typeof RHYTHM!=="undefined"?RHYTHM.windDown:"")+' · lights out '+hgEsc(typeof RHYTHM!=="undefined"?RHYTHM.lightsOut:"")+' · wake '+hgEsc(typeof RHYTHM!=="undefined"?RHYTHM.wake:"")+'.</div></div>';
  out+='<div style="background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.25);border-radius:var(--rad);padding:15px 17px;margin-bottom:12px"><div style="font-size:15px;font-weight:700;color:#7DD3FC;margin-bottom:6px">⌚ Watch sleep import</div>'
    +'<div style="font-size:12.5px;color:var(--text2);line-height:1.6">Log the times from your watch above, or choose the sleep CSV from a Samsung Health personal-data export (com.samsung.shealth.sleep). Manual entries are kept.</div>'
    +'<label style="display:inline-flex;align-items:center;margin-top:9px;background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.5);border-radius:12px;padding:11px 18px;color:#7DD3FC;font-size:13px;font-weight:700;cursor:pointer;min-height:22px">📥 Import sleep CSV<input type="file" accept=".csv,text/csv" style="display:none" onchange="hgSleepImport(this)"></label></div>';
  const wind=prefs.wind||hgRhythmTime("windDown"),morning=hgRhythmTime("breakfast");
  out+='<div style="background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.25);border-radius:var(--rad);padding:15px 17px;margin-bottom:14px"><div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div style="font-size:15px;font-weight:700;color:#FDBA74">🔔 Wind-down reminder</div>'
    +'<div style="font-size:11.5px;color:var(--text2);margin-top:3px;line-height:1.5">A nudge at <input aria-label="Wind-down reminder time" type="time" class="hg-time" style="padding:4px 8px;font-size:13px" value="'+hgEsc(wind)+'" onchange="hgRemindWind(this.value)">. Log-last-night nudge at '+hgEsc(morning)+'. Reminders work only while the app is open and browser notifications are allowed.</div></div>'
    +'<button type="button" onclick="hgRemindToggle()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:11px 16px;color:'+(prefs.on?'#4AD490':'var(--text2)')+';font-size:13px;font-weight:700;cursor:pointer;min-height:44px;flex-shrink:0">'+(prefs.on?'On ✓':'Turn on')+'</button></div></div>';
  return out;
}
function hgSleepCsvCells(line){
  const out=[];let value="",quoted=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(quoted&&line[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(ch===","&&!quoted){out.push(value.trim());value="";}else value+=ch;}
  out.push(value.trim());return out;
}
function hgParseSamsungSleep(txt){
  const lines=txt.split(/\r?\n/);let hi=-1;
  for(let i=0;i<Math.min(lines.length,6);i++){if(/start_time/i.test(lines[i])&&/end_time/i.test(lines[i])){hi=i;break;}}
  if(hi<0) throw new Error("no header row");
  const cols=hgSleepCsvCells(lines[hi]);let si=-1,ei=-1;
  cols.forEach(function(c,i){if(/(^|\.)start_time$/i.test(c))si=i;if(/(^|\.)end_time$/i.test(c))ei=i;});
  if(si<0||ei<0) throw new Error("no time columns");
  const parseT=function(v){v=String(v||"").trim();if(!v)return null;const d=/^\d{12,}$/.test(v)?new Date(+v):new Date(v.replace(" ","T"));return isNaN(d.getTime())?null:d;};
  const nights={};
  for(let i=hi+1;i<lines.length;i++){
    const cells=hgSleepCsvCells(lines[i]),s=parseT(cells[si]),e=parseT(cells[ei]);if(!s||!e)continue;
    const mins=(e-s)/60000;if(mins<45||mins>1200)continue;
    const k=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0");
    if(!nights[k])nights[k]={s:s,e:e,mins:0};nights[k].mins+=mins;if(s<nights[k].s)nights[k].s=s;if(e>nights[k].e)nights[k].e=e;
  }
  return nights;
}
function hgSleepImport(inp){
  if(!hgSleepActionReady()){inp.value="";return;}
  const f=inp.files&&inp.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=function(){
    if(!hgSleepActionReady())return;
    try{
      const nights=hgParseSamsungSleep(String(rd.result));let added=0,kept=0;
      const hm=function(d){return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");};
      Object.keys(nights).forEach(function(k){if(sleep[k]&&sleep[k].src!=="w"){kept++;return;}const n=nights[k];if(n.mins>1200)return;sleep[k]={bed:hm(n.s),wake:hm(n.e),mins:Math.round(n.mins),src:"w"};added++;});
      if(added)saveSleep();toast("⌚ Imported "+added+" night"+(added===1?"":"s")+(kept?" · kept "+kept+" manual logs":""));renderWellness();
    }catch(_){toast("⚠️ Couldn't read that file — choose the com.samsung.shealth.sleep CSV.");}
  };
  rd.onerror=function(){toast("⚠️ Couldn't read that file.");};rd.readAsText(f);inp.value="";
}
function hgRemindToggle(){
  if(!hgSleepActionReady())return;
  const prefs=sleep._prefs||{};
  if(prefs.on){sleep._prefs=Object.assign({},prefs,{on:false});saveSleep();renderWellness();return;}
  if(!("Notification" in window)){toast("This browser does not support notifications.");return;}
  Notification.requestPermission().then(function(r){
    if(!hgSleepActionReady())return;
    if(r==="granted"){sleep._prefs=Object.assign({},sleep._prefs||{},{on:true});saveSleep();toast("🔔 Sleep reminders on while the app is open.");}
    else toast("Notifications are blocked — allow them in your browser settings.");
    renderWellness();
  }).catch(function(){toast("Notifications are unavailable in this browser.");});
}
function hgRemindWind(v){
  if(!hgSleepActionReady())return;
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v))return;
  sleep._prefs=Object.assign({},sleep._prefs||{},{wind:v});saveSleep();toast("🌙 Wind-down set to "+v);
}
function hgSleepReminderTick(){
  if(window.__stateHydrated!==true||typeof sleep==="undefined")return;
  const p=sleep._prefs;if(!p||!p.on||!("Notification" in window)||Notification.permission!=="granted")return;
  const now=new Date(),t=todayKey(),hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
  const fire=function(key,title,body){
    try{const lk="hg-rem-"+key+"-"+t;if(localStorage.getItem(lk))return;new Notification(title,{body:body});localStorage.setItem(lk,"1");}catch(_){}
  };
  if(hm===(p.wind||hgRhythmTime("windDown")))fire("wind","🌙 Wind-down time","Your evening shutdown reminder.");
  if(hm===hgRhythmTime("breakfast")&&!sleep[t])fire("log","😴 Log last night","Open Health → Sleep while it is fresh.");
}
setInterval(hgSleepReminderTick,20000);

function hgDebtChartsHtml(){
  if(typeof FINANCE==="undefined"||!FINANCE.debts||!FINANCE.debts.length)return "";
  // Compare the same known starting balances throughout; an unknown loan is not $0.
  const debts=FINANCE.debts.filter(function(d){return d.start!=null&&Number.isFinite(+d.start);});
  if(!debts.length)return '<div style="font-size:12px;color:var(--text2)">No starting debt balances available for a trend yet.</div>';
  const startTotal=debts.reduce(function(s,d){return s+(+d.start);},0),dateSet={};let anyReal=false;
  debts.forEach(function(d){finSeries("debt",d.id).forEach(function(p){if(p.d<=todayKey()&&Number.isFinite(p.v)){dateSet[p.d]=1;anyReal=true;}});});
  const dates=Object.keys(dateSet).sort(),t=todayKey();if(dates[dates.length-1]!==t)dates.push(t);
  const totalAt=function(date){return debts.reduce(function(tot,d){const s=finSeries("debt",d.id).filter(function(p){return p.d<=date&&Number.isFinite(p.v);});return tot+(s.length?s[s.length-1].v:+d.start);},0);};
  const pts=[{d:null,v:startTotal}].concat(dates.map(function(dd){return {d:dd,v:totalAt(dd)};}));
  const cur=pts[pts.length-1].v,paid=startTotal-cur,W=320,H=88,Pd=10;
  const values=pts.map(function(p){return p.v;}),vmax=Math.max.apply(null,values),vmin=Math.min.apply(null,values),span=Math.max(1,vmax-vmin);
  const xy=pts.map(function(p,i){return [Pd+i*(W-2*Pd)/Math.max(1,pts.length-1),H-Pd-((p.v-vmin)/span)*(H-2*Pd)];});
  const poly=xy.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" "),area=poly+" "+xy[xy.length-1][0].toFixed(1)+","+(H-2)+" "+xy[0][0].toFixed(1)+","+(H-2);
  const omitted=FINANCE.debts.length-debts.length;
  return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(251,146,60,.3);border-radius:var(--rad);padding:14px 16px;margin-bottom:14px"><div style="font-size:11px;color:#FB923C;margin-bottom:8px">📉 Tracked debt balances</div>'
    +'<svg aria-label="Debt balance trend" role="img" viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block"><defs><linearGradient id="hgDebtFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(251,146,60,.35)"/><stop offset="100%" stop-color="rgba(251,146,60,0)"/></linearGradient></defs><polygon points="'+area+'" fill="url(#hgDebtFill)"></polygon><polyline points="'+poly+'" fill="none" stroke="#FB923C" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline></svg>'
    +'<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px"><div><div style="font-size:17px;color:var(--text)">'+finFmt(cur,true)+'</div><div style="font-size:11px;color:var(--text2)">tracked balance today</div></div><div><div style="font-size:17px;color:'+(paid>=0?'#4AD490':'#FB923C')+'">'+finFmt(Math.abs(paid),true)+'</div><div style="font-size:11px;color:var(--text2)">'+(paid>=0?'paid down':'increase')+' since starting balances</div></div><div><div style="font-size:17px;color:#FB923C">'+(startTotal>0?Math.round(paid/startTotal*100):0)+'%</div><div style="font-size:11px;color:var(--text2)">change from starting balances</div></div></div>'
    +(omitted?'<div style="font-size:11.5px;color:var(--text2);margin-top:8px">'+omitted+' loan'+(omitted===1?'':'s')+' without a starting balance not included in this trend.</div>':'')
    +(!anyReal?'<div style="font-size:11.5px;color:var(--text2);margin-top:8px">Tap a balance below to record today’s number.</div>':'')+'</div>';
}
function hgBillsTimelineHtml(bills,ym){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(ym))return "";
  const y=+ym.slice(0,4),m=+ym.slice(5,7),dim=new Date(y,m,0).getDate(),t=todayKey(),todayD=t.slice(0,7)===ym?+t.slice(8):null,pds=[];
  if(typeof FINANCE!=="undefined"&&FINANCE.paydayAnchor){
    const anchor=new Date(FINANCE.paydayAnchor+"T12:00:00"),first=new Date(y,m-1,1,12);
    if(!isNaN(anchor.getTime())){
      const d=new Date(anchor);d.setDate(d.getDate()+Math.floor((first-anchor)/86400000/14)*14);
      while(d<first)d.setDate(d.getDate()+14);
      for(let g=0;g<4&&d.getFullYear()===y&&d.getMonth()===m-1;g++){pds.push(d.getDate());d.setDate(d.getDate()+14);}
    }
  }
  const x=function(day){return ((day-0.5)/dim*100).toFixed(2)+"%";};let dots="",lane=0;
  bills.forEach(function(b){
    const day=parseInt(String(b.due).replace(/[^0-9]/g,""),10);if(!day||day>dim)return;
    const paid=!!(fin.bills&&fin.bills[b.id+"-"+ym]),sz=b.amt>=1000?15:b.amt>=200?11:8,top=lane++%2===0?12:34;
    dots+='<div title="'+hgEsc(b.label)+' · '+finFmt(b.amt,true)+' · due '+hgEsc(b.due)+(paid?' · paid ✓':'')+'" style="position:absolute;left:'+x(day)+';top:'+top+'px;width:'+sz+'px;height:'+sz+'px;margin-left:-'+(sz/2)+'px;border-radius:50%;'+(paid?'background:#10B981;box-shadow:0 0 9px rgba(16,185,129,.8)':'background:transparent;border:2px solid rgba(250,204,21,.75)')+'"></div>';
  });
  const ticks=pds.map(function(day){return '<div title="payday" style="position:absolute;left:'+x(day)+';top:2px;bottom:14px;width:2px;margin-left:-1px;background:rgba(167,139,250,.65)"></div>';}).join("");
  const todayLine=todayD?'<div title="today" style="position:absolute;left:'+x(todayD)+';top:0;bottom:12px;width:1.5px;background:rgba(255,255,255,.85)"></div>':'';
  return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:var(--rad);padding:13px 16px 9px;margin-bottom:12px"><div style="font-size:11px;color:#FACC15;margin-bottom:4px">🗓️ The month at a glance</div><div style="position:relative;height:58px"><div style="position:absolute;left:0;right:0;top:28px;border-top:1px solid rgba(255,255,255,.1)"></div>'+ticks+todayLine+dots+'<div style="position:absolute;left:0;bottom:0;font-size:10px;color:var(--text3)">1</div><div style="position:absolute;left:48%;bottom:0;font-size:10px;color:var(--text3)">15</div><div style="position:absolute;right:0;bottom:0;font-size:10px;color:var(--text3)">'+dim+'</div></div><div style="font-size:10px;color:var(--text3);margin-top:4px">💜 payday · ⚪ today · 🟡 due · 🟢 paid — dot size = bill size · mark bills paid below. Bills without a calendar date are not plotted.</div></div>';
}
