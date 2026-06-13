// FLIP PACK — index.html edits (Jun 12 2026). TWO insertions in the big inline <script>.
//
// ─── EDIT 3: flip-scan render block in renderToday(). Insert AFTER the 🔥 BURN CARE block's closing
// brace (the `if(typeof BURN_CARE!=='undefined'){...}` block) and BEFORE the line
// `  // 🔔 dated + standing reminders` (≈ line 1714). Verbatim: ───
/*
  // ── 🔍 FLIP SCAN — daily morning deal-hunt card (date-keyed → reappears each day). Links live in FLIP_SCAN (data.js). (added Jun 12 2026) ──
  if(typeof FLIP_SCAN!=='undefined'){
    const fsDone=!!laundry["rem-flipscan-"+today];
    const fsLinks=FLIP_SCAN.links.map(function(l){return '<a href="'+l[1]+'" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:#7DD3FC;text-decoration:underline;white-space:nowrap">'+l[0]+'</a>';}).join(' · ');
    const fsExtra='<div style="margin-top:7px;font-size:12px;line-height:1.9;font-family:\'Lora\',serif">'+fsLinks+'</div>'
      +'<div style="font-size:11px;color:rgba(125,211,252,.8);font-style:italic;margin-top:5px;font-family:\'Lora\',serif">'+FLIP_SCAN.tip+'</div>';
    add("flipscan",284,fsDone, fsDone
      ? strip("🔍","Flip scan — done for today",true,"#38BDF8","toggleReminder('flipscan',true)",FLIP_SCAN.at,"","Reappears tomorrow morning")
      : reminderCardHtml("🔍",FLIP_SCAN.label,"","toggleReminder('flipscan',true)",fsExtra));
  }
*/
//
// ─── EDIT 4: timeline push. Insert on its own line immediately AFTER this existing line (≈ line 2008): ───
/*
  if(typeof reminderDone==='function' && !reminderDone('moneycheck',true)){ (tlRem[today]=tlRem[today]||[]).push({icon:"💰",text:"Check money situation · ~7:45 AM",account:""}); }
*/
// NEW line to add after it:
/*
  if(typeof FLIP_SCAN!=='undefined' && typeof reminderDone==='function' && !reminderDone('flipscan',true)){ (tlRem[today]=tlRem[today]||[]).push({icon:"🔍",text:"Morning flip scan · ~7:15 AM",account:""}); }
*/
