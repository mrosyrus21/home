// FLIP PACK — data.js edits (Jun 12 2026). TWO string-replaces on a clean clone.
//
// ─── EDIT 1: extend REMINDERS. OLD (unique anchor — end of the REMINDERS array): ───
/*
  { id:"rem_thyme_plant",     standing:true,     emoji:"🌿", text:"Get a thyme plant" }
];
*/
// NEW:
/*
  { id:"rem_thyme_plant",     standing:true,     emoji:"🌿", text:"Get a thyme plant" },
  { id:"rem_tv_triage",       standing:true,     emoji:"📺", text:"After work: 10-min triage on the free 50-inch TV — grab the model number off the back sticker, check for a standby light, then flashlight test for a ghost image (ghost = ~$20 backlight fix). No buying parts until triage is done." },
  { id:"rem_flip_leads",      date:"2026-06-13", emoji:"🎯", text:"Yesterday's flip leads (if still up): free 83-inch OLED in Thornton (boards alone sell $100+), $0 Samsung Neo QLED 55 in Conifer, $0 broken TV in Tech Center, $0 WORKING 42-inch flatscreen downtown — hit the Craigslist free section first thing." }
];
*/
//
// ─── EDIT 2: new FLIP_SCAN config const. Insert immediately AFTER the BURN_CARE const's closing `};` ───
// (anchor: the line `  siliconeDate:"2026-06-24"` ... followed by `};`), BEFORE `const FINANCE = {`:
/*
// ── 🔍 FLIP SCAN — daily morning deal-hunt links for the side-hustle flipping project. Rendered as a
// date-keyed daily card in renderToday() (index.html). Searches are Denver Craigslist. (added Jun 12 2026)
const FLIP_SCAN = {
  label:"Morning flip scan — free TVs, mowers, curb alerts",
  at:"~7:15 AM",
  links:[
    ["🆓 All free","https://denver.craigslist.org/search/zip"],
    ["📺 TVs","https://denver.craigslist.org/search/zip?query=tv"],
    ["🛻 Curb alerts","https://denver.craigslist.org/search/zip?query=curb+alert"],
    ["🚜 Mowers","https://denver.craigslist.org/search/zip?query=mower"],
    ["💦 Pressure washers","https://denver.craigslist.org/search/zip?query=pressure+washer"]
  ],
  tip:"Free stuff gets 100s of messages — reply in minutes with an exact same-day pickup time."
};
*/
