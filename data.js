// ═══════════════════════════════════════════════════════════════
// data.js — APP DATA (extracted from index.html, item-6 refactor)
// Classic script: these top-level consts share global lexical scope
// with the inline <script> in index.html, which loads AFTER this file.
// Objects: ROOMS, TASKS, SCHEDULE, PLANTS, PLANT_INFO, WATER_INFO,
//          FUN_FACTS, CARE_INFO, HARVEST_INFO.
// Edit plant/task/room data HERE. index.html keeps CONFIG/EYEBROWS/LAST_DEPLOY.
// ═══════════════════════════════════════════════════════════════

// ── DAILY RHYTHM — EDIT YOUR TIMES HERE ─────────────────────────
// Drives the Today tab: meal times + the evening wind-down block.
// Change any value and redeploy (or hand off) — nothing else needed.
const RHYTHM = {
  breakfast: "8:00 AM",
  lunch:     "12:30 PM",
  dinner:    "6:30 PM",        // aim to sit down here...
  dinnerBy:  "8:00 PM",        // ...hard rule: eaten BY this time
  windDown:  "9:30 PM",        // phone goes to the other room, screens off
  reading:   "9:30–10:30 PM",  // the reading hour fills the no-screen block
  lightsOut: "10:30 PM",
};

const ROOMS = {
  priority: { name:"Priority",   emoji:"⭐", color:"#C8860A" },
  kitchen:  { name:"Kitchen",    emoji:"🍳", color:"#EF4444", reward:"Meal prep feels effortless — cooking is actually fun" },
  living:   { name:"Living Rm",  emoji:"🐟", color:"#10B981", reward:"A calm, beautiful space you're proud to relax in" },
  office:   { name:"Office",     emoji:"🥁", color:"#3B82F6", reward:"A creative studio that pulls double duty — WFH & music" },
  bedroom:  { name:"Bedroom",    emoji:"😴", color:"#8B5CF6", reward:"Deep, quiet sleep — no printer hum, no mess" },
  bathroom: { name:"Bathroom",   emoji:"🚿", color:"#06B6D4", reward:"Clean & welcoming every single morning" },
  backyard: { name:"Backyard",   emoji:"🔥", color:"#84CC16", reward:"The best summer hangouts of your life, in your own yard" },
  garage:   { name:"Garage",     emoji:"🔧", color:"#F97316", reward:"A proper workshop — every project starts with a clear head" },
  garden:   { name:"Garden",     emoji:"🌿", color:"#2DB870" },
};

const TASKS = {
  // ── PRIORITY ──────────────────────────────────────────────────────────────
  errand1:        { room:"priority", label:"Go get distilled water", level:"easy" },
  errand2:        { room:"priority", label:"Go get food", level:"easy" },
  vacuum_bags:    { room:"priority", label:"Buy 8-inch vacuum bags", level:"easy", note:"Moved off the grocery list (grocery is food-only now). Grab them with the next errand run." },
  rx_setup:       { room:"priority", label:"Set up esomeprazole + magnesium at King Soopers (use GoodRx)", level:"easy", note:"Open GoodRx, search esomeprazole (and magnesium if it is a script) for the King Soopers pharmacy, grab the coupon price, and send or transfer the prescription there. Show the GoodRx coupon at the counter on pickup." },
  measure_printer:{ room:"office",   label:"Measure the 3D printer — width, depth, height + room for spools and cables", level:"easy", note:"Do this before buying a desk so you know exactly what fits." },
  find_desk:      { room:"priority", label:"Find a cheap sturdy desk — Marketplace, Craigslist, OfferUp", level:"easy", note:"Must be sturdy — needs to hold the 3D printer. Check FB Marketplace first — people offload office furniture constantly." },
  xfinity_call:   { room:"priority", label:"Call Xfinity Retention — lower the $135 bill", level:"easy", note:"Goal: get $135/mo down to ~$70–90 while KEEPING Xfinity (best gaming latency). Leverage: AT&T Internet Air is only $47/mo and there's no fiber at your address — you're a flight risk they'll want to keep. Call (don't chat), reach Retention, and never take the first offer.", steps:["Call 1-800-XFINITY (1-800-934-6489). At the prompts, say 'cancel service' to get routed to Retention, not regular support.","Open friendly but firm: 'My bill jumped to $135 and that's too high — I'm thinking about switching.'","Drop the leverage: 'AT&T Internet Air is $47/mo. I'd rather stay for the lower latency, but not at this price.'","Ask directly: 'What promotions or loyalty credits can you apply to get me near $70?'","Don't accept the first number — pause, then ask 'Is that the best you can do?'","Keep the SAME internet plan — don't let them add TV/phone/lines to 'save' money.","If they won't budge, ask for the Retention/Loyalty department, or say you'd like to start the cancellation.","Get it in writing: the new monthly rate, contract length, any one-time credits, plus the rep's name/ID — ask for an email confirmation.","No luck? Hang up and call back later for a different rep, or retry near your billing date."] },
  meshlab_workflow: { room:"office", label:"Fix aquarium lid — Meshlab Screenshot Workflow", level:"easy",
    steps:["Download Meshlab free at meshlab.net","Drag and drop your STL or 3MF file in","View → Orthographic Projection — removes perspective distortion","Rotate and capture 6 views: Front · Back · Left · Right · Top · Bottom","Each view: File → Save Screenshot at high resolution","Filters → Cross Section for complex areas — screenshot those too","Send all screenshots + your SCAD file to Claude with what you want changed","⚠️ Watch your usage! Budget 6–8 screenshots per model"]},
  vacuum:         { room:"priority", label:"Vacuum the whole house — every 2 weeks", level:"moderate", note:"🏆 The championship belt. Hack: vacuum your way OUT of each room toward the door so you never walk back over fresh tracks. Then stand in the doorway and just look at what you built. You did this." },

  // ── KITCHEN ───────────────────────────────────────────────────────────────
  e_k1:       { room:"kitchen", label:"Move stuff off kitchen floor that doesn't belong", level:"easy", note:"🎯 Hack: grab a laundry basket, sweep everything that doesn't LIVE on the floor into it, then redistribute. Ten minutes for instant 'whoa, clean' dopamine. Your floor is not a shelf, no matter how convincingly it argues otherwise." },
  k_filter:   { room:"kitchen", label:"Clean the dishwasher filter", level:"easy", note:"Twist out the cylinder at the bottom, rinse under hot water, old toothbrush for the gunk. Most people never do this and then blame the dishwasher. ~5 min and your glasses come out actually clean." },
  k_utensils: { room:"kitchen", label:"Organize the utensil drawer and junk drawer", level:"easy", note:"Dump it ALL out. Be honest about the 7 takeout chopsticks and the pens that don't write. A $3 drawer divider is genuinely life-changing. Junk-drawer rule: if you forgot you owned it, you don't need it." },
  k5:         { room:"kitchen", label:"Find permanent homes for everything — use the space wisely", level:"moderate", note:"Give every item one permanent home and use the space wisely. As you go, get rid of what you do not need — ONLY keep what you will actually use." },
  k1:         { room:"kitchen", label:"Deep clean fridge — toss expired food", level:"moderate", note:"Pull everything, toss the expired (yes, that sauce from a previous era too), wipe shelves with baking-soda water. Leave an open box of baking soda to keep it fresh. Bonus game: count your half-used condiments. 🏆" },
  k2:         { room:"kitchen", label:"Organize pantry & cabinets by use", level:"moderate", note:"Group by job: baking, breakfast, snacks, dinner. Labels facing out. Keep an 'eat me first' bin for stuff near its date. Clear bins beat random bags. Future-you making dinner will high-five present-you." },
  k3:         { room:"kitchen", label:"Clear EVERYTHING off the counters, then deep-clean them", level:"moderate", note:"The foundation — do this FIRST. Take it ALL off (do not shuffle counter to counter), then deep-clean every surface and keep them clear from here on.", steps:["Take everything off the countertops — every single item, fully off. Do NOT move things counter to counter; clear them completely.","Deep-clean every countertop (warm water + dish soap, baking-soda paste on the greasy spots), then keep them clear going forward."] },
  k6:         { room:"kitchen", label:"Label containers & organize spices", level:"moderate", note:"Toss spices older than ~2 years (they're just sad dust now). Group by cuisine or alphabetize. A tiered shelf or lazy susan means no more knocking over the cumin to reach the paprika." },
  k_stovetop: { room:"kitchen", label:"Deep clean stovetop grates and burners", level:"moderate", note:"Soak the grates in hot soapy water (or a baking-soda + vinegar bath) while you scrub the surface. Old toothbrush for the crevices. Don't forget the knobs — secretly the grimiest part of the whole kitchen. 🫣" },
  k4:         { room:"kitchen", label:"Deep clean oven inside and out", level:"hard", note:"Baking-soda paste overnight, wipe with vinegar in the morning — it fizzes the grime off with no toxic fumes. Pull the racks and do them in the tub. This is the kitchen's boss battle; beat it and the room is YOURS. 🎉" },
  k_sink:     { room:"kitchen", label:"Scrub & shine the sink until it sparkles", level:"easy", note:"FlyLady's #1 rule: a shiny sink anchors the whole kitchen. Scrub, rinse, then DRY it with a towel so it actually shines. Weirdly powerful — a gleaming sink makes you not want to pile dishes in it." },
  k_reward:   { room:"kitchen", label:"Cook one great meal in your fresh kitchen 🍳", level:"easy", note:"You earned this. Make something you love in the clean kitchen — snip herbs from the garden straight into the pot. THIS is why you did all the scrubbing." },
  k_dishes:   { room:"kitchen", label:"Wash all the dishes & put them in permanent homes", level:"moderate", note:"Wash every dish, dry them, and put each one in its permanent home — not back on the counter." },
  k_btmcab:   { room:"kitchen", label:"Organize the bottom cabinets", level:"moderate", note:"Empty, wipe, and organize the lower cabinets. Toss what you do not use; keep only what earns its spot." },
  k_garage:   { room:"kitchen", label:"Bring the kitchen stuff in from the garage & assign cabinets", level:"hard", note:"Do this AFTER the counters are cleared and clean. As you put things away, declutter — ONLY keep what you will actually use.", steps:["Move the car outside to make room.","Get ALL the kitchen items out of the garage and into the kitchen.","Pick a pantry cabinet.","Pick the dishes cabinets.","As you put things away, get rid of what you do not need — only keep what you will use."] },

  // ── LIVING ROOM ───────────────────────────────────────────────────────────
  e_l1:      { room:"living", label:"Fold & break down cardboard boxes — store or recycle", level:"easy" },
  e_l2:      { room:"living", label:"Move things that don't belong out of living room", level:"easy" },
  l1:        { room:"living", label:"Decide aquarium placement & clear the spot", level:"easy" },
  l_dust:    { room:"living", label:"Dust all surfaces, shelves, and electronics", level:"easy" },
  l_couch:   { room:"living", label:"Vacuum couches and rotate cushions", level:"easy" },
  h_ct:      { room:"living", label:"Clean & organize the coffee table", level:"moderate" },
  l3:        { room:"living", label:"Deep clean floors & all surfaces", level:"moderate" },
  l4:        { room:"living", label:"Organize media and entertainment area", level:"moderate" },
  l5:        { room:"living", label:"Declutter decor — intentional items only", level:"moderate" },
  leca_measure: { room:"living", label:"Rinse LECA balls thoroughly — smell for vinegar — then submerge in distilled water", level:"easy" },
  leca_prep: { room:"living", label:"Prepare LECA clay balls for the aquarium — rinse, soak & boil", level:"moderate",
    note:"<strong>Start this 3+ days before aquarium setup.</strong><br><br><strong>Day 1 — Rinse & first soak:</strong> Pour LECA into a colander, rinse under cold water until it runs mostly clear. Transfer to a large bowl, cover with cold water, soak 24hrs. Water will turn orange — normal mineral leaching.<br><br><strong>Day 2 — Change water:</strong> Drain, rinse well, refill with fresh cold water. Soak another 24hrs. Repeat until water stays mostly clear.<br><br><strong>Day 3 — Boil:</strong> Boil in batches in a large pot for 20–30 mins per batch. Sterilizes and drives out remaining minerals. Drain and rinse with cold water after each batch.<br><br><strong>Day 4 — Final soak:</strong> Soak in distilled water 24hrs. Test the pH — should read close to 7.0 before adding to the tank. If still off, soak and test again.<br><br>⚠️ Never add LECA to a tank with fish until pH is stable and water runs clear." },
  l_windows: { room:"living", label:"Clean windows and sliding door inside and out", level:"moderate" },
  l_lights:  { room:"living", label:"Install lights — set the atmosphere 🎉", level:"hard", note:"String lights, a warm floor lamp, LED strips behind the TV — warm white (2700K), never harsh blue. This is the 'aaahh' moment: dim it, put something on, and enjoy the room you earned. 🎉" },
  l6:        { room:"living", label:"Set up aquarium or hydroponics station", level:"hard" },

  // ── OFFICE ────────────────────────────────────────────────────────────────
  o1:          { room:"office", label:"Clear desk area & plan the new layout", level:"easy" },
  o_lighting:  { room:"office", label:"Set up proper WFH lighting — no glare on camera", level:"easy" },
  o3:          { room:"office", label:"Organize desk — cables, monitor, peripherals", level:"moderate" },
  o4:          { room:"office", label:"Music zone: interface, headphones, cables tidy", level:"moderate" },
  o_filing:    { room:"office", label:"Create a filing system for important documents", level:"moderate" },
  o5:          { room:"office", label:"Add shelving for gear and 3D supplies", level:"hard" },
  o6:          { room:"office", label:"Acoustic panel or soundproofing one wall", level:"hard" },
  o2:          { room:"office", label:"Move 3D printer in & set up (needs desk first)", level:"hard" },
  find_drum_spot:{ room:"office", label:"Set up drum kit — full weekend project", level:"hard" },

  // ── BEDROOM ───────────────────────────────────────────────────────────────
  e_b1a:     { room:"bedroom", label:"Move clothes off closet floor into hamper", level:"easy" },
  e_b1b:     { room:"bedroom", label:"Move clothes off main bedroom floor into hamper", level:"easy" },
  b4:        { room:"bedroom", label:"Nightstand to essentials only", level:"easy" },
  b3:        { room:"bedroom", label:"Wash & change bedding", level:"easy" },
  b_dust_fan:{ room:"bedroom", label:"Dust ceiling fan and light fixtures", level:"easy" },
  b2:        { room:"bedroom", label:"Clear floor of everything that's not laundry", level:"moderate" },
  b5:        { room:"bedroom", label:"Remove anything that doesn't belong", level:"moderate" },
  b6:        { room:"bedroom", label:"Set up a dark, calm sleep environment", level:"moderate", note:"Block the light, park the phone on the FAR side of the room (so you have to get up), aim for 65–68°F — the sleep-science sweet spot. Future well-rested you is the real reward here. 😴" },
  b1:        { room:"bedroom", label:"Move 3D printer to office (needs desk first)", level:"moderate" },
  b_closet:  { room:"bedroom", label:"Organize closet — hanging clothes, shelves, and floor", level:"hard" },

  // ── BATHROOM ──────────────────────────────────────────────────────────────
  ba5:        { room:"bathroom", label:"Fresh towels, clean bath mat, welcoming feel", level:"easy" },
  ba2:        { room:"bathroom", label:"Clean mirror & wipe down all surfaces", level:"easy" },
  ba_medicine:{ room:"bathroom", label:"Organize medicine cabinet", level:"easy" },
  ba1:        { room:"bathroom", label:"Scrub toilet, sink, and tub", level:"moderate" },
  ba3:        { room:"bathroom", label:"Organize under-sink cabinet", level:"moderate" },
  ba_grout:   { room:"bathroom", label:"Deep clean tile grout", level:"hard" },

  // ── GARAGE ────────────────────────────────────────────────────────────────
  g5:      { room:"garage", label:"Label everything, group by project type", level:"moderate" },
  g2:      { room:"garage", label:"Sort tools: keep, donate, toss", level:"moderate" },
  g6:      { room:"garage", label:"Create a dedicated workstation zone", level:"moderate" },
  g_floor: { room:"garage", label:"Clean garage floor with degreaser", level:"moderate" },
  g1:      { room:"garage", label:"Clear everything out & sweep the floor", level:"hard" },
  g3:      { room:"garage", label:"Mount pegboard or shelving for tools", level:"hard" },
  g4:      { room:"garage", label:"Set up workbench with good lighting", level:"hard", note:"Put it where the light is best (or clamp on a work light). Pegboard above, power strip on the side, a stool that tucks under. This is where projects actually get finished instead of abandoned. 🔧" },

  // ── BACKYARD ──────────────────────────────────────────────────────────────
  weed_full:    { room:"backyard", label:"Check the test patch — if it worked, hit all the weeds today", level:"moderate", weed:true },
  bk1:          { room:"backyard", label:"Clear debris & do a full sweep", level:"moderate" },
  bk4:          { room:"backyard", label:"Add string lights or ambiance lighting", level:"hard" },
  bk_powerwash: { room:"backyard", label:"Power wash the patio or deck", level:"hard" },

  // ── GARDEN ────────────────────────────────────────────────────────────────
  gnat_buy:       { room:"garden", label:"Buy Mosquito Bits — already have sticky traps", level:"easy" },
  parse_trim:     { room:"garden", label:"Remove dead bolted stalks from parsley at the base", level:"easy" },
  gnat_tea:       { room:"garden", label:"Soak Mosquito Bits in distilled water — let sit 24hrs (BTI tea)", level:"easy" },
  basil_trim:     { room:"garden", label:"Trim yellowing lower leaves off both basil plants", level:"easy" },
  gnat_apply:     { room:"garden", label:"Water all indoor plants with the Mosquito Bits BTI tea", level:"easy" },
  gnat_traps:     { room:"garden", label:"Place yellow sticky traps in all indoor plant pots", level:"easy" },
  herb_pinch:     { room:"garden", label:"Pinch flower buds off both basil plants and peppermint", level:"easy" },
  sort_plants:    { room:"garden", label:"Move Fittonia, Philodendron & Royal Tea Ivy fully indoors", level:"easy" },
  parse_harv:     { room:"garden", label:"Harvest parsley — outer stems at the base, leave inner growth", level:"easy" },
  herb_pinch2:    { room:"garden", label:"Pinch basil & mint again — remove any flower buds", level:"easy" },
  dill_check:     { room:"garden", label:"Check dill for flower heads — cut to extend leaf production", level:"easy" },
  gnat_check:     { room:"garden", label:"Check sticky traps — are gnat numbers dropping?", level:"easy" },
  gard_fertilize: { room:"garden", label:"Fertilize tomatoes, jalapeño, and strawberry", level:"easy" },
  gard_mulch:     { room:"garden", label:"Add mulch or top dressing to outdoor pots", level:"easy" },
  gard_repot:     { room:"garden", label:"Check for root-bound plants and repot if needed", level:"moderate" },
};


const SCHEDULE = [
  // ── GETTING READY ─────────────────────────────────────────────────────────
  { date:"2026-05-29", tasks:[], off:true, offNote:"Setup day. Your schedule is locked and loaded. Rest up, hydrate, maybe stretch — Sunday we go. 🌱" },
  { date:"2026-05-30", tasks:[], off:true, offNote:"Your morning, your rules: a great breakfast and fetch with Zoey. 🍳🐶 Recharge — the most productive summer of your life starts tomorrow." },

  // ── WEEK 1 · KITCHEN (top priority) ───────────────────────────────────────
  { date:"2026-05-31", tasks:["e_k1","k5"],               note:"🚀 DAY ONE. Two easy wins only — clear the floor, give counter strays a home. Momentum is the whole game; we start tiny on purpose." },
  { date:"2026-06-01", tasks:[], off:true, offNote:"Pool league night 🎱 — rack 'em. Zero chores. Recovery is part of the plan." },
  { date:"2026-06-02", tasks:["k_utensils"], note:"The chaos drawer. Put on a hype playlist — you'll be done before track 4." },
  { date:"2026-06-03", tasks:["k_filter"],                note:"Light day — just the dishwasher filter. One small gross-but-satisfying win, then go enjoy your evening." },
  { date:"2026-06-04", tasks:["k3"],                      note:"Counter-clearing day. Goal: wipe it in one sweep without playing Tetris with the appliances." },
  { date:"2026-06-05", tasks:["k1","xfinity_call"],       note:"Fridge day — toss the mystery jars. Plus ⭐ call Xfinity Retention and knock that $135 bill down." },
  { date:"2026-06-06", tasks:["k2","k6","k_sink"],        note:"Pantry + labels + a sparkling sink. Clear bins, labels facing out — make it a tiny grocery store you're proud of." },
  { date:"2026-06-07", tasks:["k_stovetop","k4","k_reward"], note:"🏆 KITCHEN FINALE — stovetop + oven, then COOK something amazing in your spotless kitchen. Room one: DONE. Feel that?" },

  // ── WEEK 2 · LIVING ROOM ──────────────────────────────────────────────────
  { date:"2026-06-08", tasks:[], off:true, offNote:"Pool league night 🎱 — you finished the kitchen, legend. Go celebrate." },
  { date:"2026-06-09", tasks:["e_l1","e_l2"],             note:"Living room kickoff: break down the boxes, evict whatever doesn't belong in here." },
  { date:"2026-06-10", tasks:["l_dust"],                  note:"Light day — dust surfaces & screens. Microfiber + 10 minutes. Done." },
  { date:"2026-06-11", tasks:["l_couch","h_ct"],          note:"Couch + coffee table. Find the remote. Find the snacks you lost in 2024." },
  { date:"2026-06-12", tasks:["l3"],                      note:"Deep-clean the floors. Pro move: declutter FIRST, then clean — never clean around clutter." },
  { date:"2026-06-13", tasks:["l4","l5","find_desk"],     note:"Media area + decor declutter, and spend 10 min hunting a cheap sturdy desk online (the office will need it)." },
  { date:"2026-06-14", tasks:["l_windows","l_lights"],    note:"🎉 LIVING ROOM DONE — clean the windows, install the lights, and just SIT in it. A space you actually want to be in." },

  // ── WEEK 3 · BATHROOM + BEDROOM START ─────────────────────────────────────
  { date:"2026-06-15", tasks:[], off:true, offNote:"Pool league night 🎱. Two rooms down — the house is noticing." },
  { date:"2026-06-16", tasks:["ba5","ba2"],               note:"Bathroom blitz: fresh towels & mat, mirror, surfaces. Quick and high-impact." },
  { date:"2026-06-17", tasks:["ba_medicine"],             note:"Light day — medicine cabinet. Toss expired meds (pharmacy take-back, not the toilet 🚫🐟)." },
  { date:"2026-06-18", tasks:["ba1","ba3"],               note:"Scrub the throne, sink & tub + tame under the sink. Gloves on, podcast in, go." },
  { date:"2026-06-19", tasks:["ba_grout"],                note:"🎉 BATHROOM DONE — deep-clean the grout (old toothbrush + baking-soda paste = oddly addictive)." },
  { date:"2026-06-20", tasks:["e_b1a","e_b1b","b3"],      note:"Bedroom start: all clothes off the floors, wash the bedding. Clean sheets tonight = the reward." },
  { date:"2026-06-21", tasks:["b2","b4"],                 note:"Clear the floor (laundry only) + pare the nightstand to essentials. The room should feel like an exhale." },

  // ── WEEK 4 · BEDROOM FINISH + OFFICE ──────────────────────────────────────
  { date:"2026-06-22", tasks:[], off:true, offNote:"Pool league night 🎱. Halfway-ish — look how far you've come." },
  { date:"2026-06-23", tasks:["b5","b_dust_fan"],         note:"Evict the random stuff + dust the ceiling fan (it's worse than you think up there 😬)." },
  { date:"2026-06-24", tasks:["b6"],                      note:"Light day — build your calm sleep cave: cool, dark, phone across the room." },
  { date:"2026-06-25", tasks:["b_closet"],                note:"🎉 BEDROOM DONE — conquer the closet. One bag donate, one bag toss. Haven't worn it in a year? Wave goodbye." },
  { date:"2026-06-26", tasks:["o1","o_lighting"],         note:"Office begins: clear the desk, plan the layout, set up glare-free WFH lighting." },
  { date:"2026-06-27", tasks:["o3","o4","o_filing"],      note:"Cables, music zone, filing system. Velcro ties = instant adult. No more cable spaghetti." },
  { date:"2026-06-28", tasks:["o5","o6"],                 note:"Shelving for gear + soundproof a wall. The studio is taking shape. 🥁" },

  // ── WEEK 5 · OFFICE / PRINTER + GARAGE ────────────────────────────────────
  { date:"2026-06-29", tasks:[], off:true, offNote:"Pool league night 🎱. The end is in sight." },
  { date:"2026-06-30", tasks:["measure_printer","b1"],    note:"Measure the printer + move it out of the bedroom (desk should be in place). Bedroom is officially printer-noise-free." },
  { date:"2026-07-01", tasks:["o2"],                      note:"Light day — set the 3D printer up in the office. Hello, dedicated maker corner." },
  { date:"2026-07-02", tasks:["find_drum_spot"],          note:"🎉 OFFICE STUDIO DONE — set up the drum kit. Pro by day, rockstar by night. 🥁" },
  { date:"2026-07-03", tasks:["g2","g_floor"],            note:"Garage: sort tools (keep / donate / toss) + degrease the floor. Be ruthless with the broken things you're 'gonna fix someday'." },
  { date:"2026-07-04", tasks:["g1","g3"],                 note:"Clear it out & sweep, then mount the pegboard. A tool with a home is a tool you'll actually find. 🎆" },
  { date:"2026-07-05", tasks:["g4","g5","g6"],            note:"🎉 GARAGE DONE — workbench with good light, label everything, set the workstation zone. A real workshop. Finally." },

  // ── WEEK 6 · BACKYARD + THE BIG ONE ───────────────────────────────────────
  { date:"2026-07-06", tasks:[], off:true, offNote:"Pool league night 🎱. One room left. ONE." },
  { date:"2026-07-07", tasks:["bk1","weed_full"],         note:"Backyard: full sweep + hit the weeds. Vinegar weed killer in full sun (formula's in the Garden tab)." },
  { date:"2026-07-08", tasks:["bk_powerwash"],            note:"Light day — power wash the patio. Quietly the most satisfying task on the entire list. 💦" },
  { date:"2026-07-09", tasks:["bk4"],                     note:"🎉 BACKYARD DONE — string up the lights. Summer headquarters: open for business. 🌞" },
  { date:"2026-07-10", tasks:["vacuum"],                  note:"🎉🎉 THE BIG ONE. First full-house vacuum. Every. Room. Done. Stand in the middle and soak it in — you built this. 🏆" },

  // ── RECURRING ─────────────────────────────────────────────────────────────
  { date:"2026-07-24", tasks:["vacuum"], note:"Bi-weekly vacuum — keep the kingdom tidy. 15 minutes protects 6 weeks of work." },
  { date:"2026-08-07", tasks:["vacuum"], note:"Bi-weekly vacuum. You're a maintenance machine now." },
  { date:"2026-08-21", tasks:["vacuum"], note:"Bi-weekly vacuum. Future-you is so grateful." }];


const PLANTS = [
  // ── INDOOR ────────────────────────────────────────────────────────────────
  { id:"philodendron", name:"Heartleaf Philodendron", emoji:"🪴", loc:"indoor", freq:"Water when the top 1–2 inches of soil are dry; bright indirect light.", days:7, overwater:true },
  { id:"ivy",          name:"Royal Tea Ivy",           emoji:"🍃", loc:"indoor", freq:"Keep lightly moist — water when the top inch dries. Likes humidity.", days:7, overwater:true },
  { id:"fittonia",     name:"Fittonia / Nerve Plant",  emoji:"🌱", loc:"indoor", freq:"Every 2-3 days — bark mix dries fast, check top inch. Water before it droops; don't wait for the faint.", days:3, note:"May 31: Leaf edges browning = low humidity stress. Bark mulch media dries much faster than potting mix — check every 2 days. Add a pebble tray with water under the pot for ambient humidity. Keep away from AC vents. New center growth looks healthy — no repot needed yet. Moved from dark office to bright indirect light room May 31 — correct placement. Watch for direct sun rays which will scorch leaves." },
  { id:"croton",       name:"Banana Croton",           emoji:"🌴", loc:"indoor", freq:"Every 5-7 days — check top inch, bark mix dries fast. Don't overwater; crotons are drought-tolerant.", days:6, note:"May 31: Banana Croton — narrow yellow-striped leaves, looks like a recent purchase still adjusting. Normal to drop some leaves when moved (don't panic). Needs bright indirect to direct morning light — more light-hungry than Fittonia. Hates cold drafts and temps below 60°F. Same bark mix as Fittonia — check moisture every 3-4 days. No leaf drop yet = good sign." },
  { id:"jade",         name:"Jade Plant",              emoji:"🪨", loc:"indoor", freq:"Succulent — let it dry out completely, then water deeply. Water sparingly.", days:18 },

  // ── GREENHOUSE HERBS ──────────────────────────────────────────────────────
  { id:"basil1",   name:"Sweet Basil #1",  emoji:"🌿", loc:"greenhouse", freq:"Morning only — top 2 inches dry before watering. Greenhouse stays humid at night", days:3, overwater:true, trimDays:7,
    trim:"Pinch flower buds the moment you see them. Cut just above a leaf pair, leaving 2-3 sets below. Remove all yellowing lower leaves. Never cut more than ⅓ at once. Every 1-2 weeks." },
  { id:"basil2",   name:"Sweet Basil #2",  emoji:"🌿", loc:"greenhouse", freq:"Morning only — top 2 inches dry before watering", days:3, overwater:true, trimDays:7,
    trim:"Pinch out every flower bud the moment it appears. Cut stems just above a leaf pair so each cut branches into two, and strip off any yellowing lower leaves. Bushier growth means more harvest — never take more than a third at once." },
  { id:"parsley",  name:"Curled Parsley",  emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry, every 3-4 days", days:3, trimDays:14,
    trim:"Dead flower stalks → cut at base completely. Harvest outer stems at the base, leaving young inner growth. Never take more than half. Every 2-3 weeks." },
  { id:"mint",     name:"Peppermint",      emoji:"🌿", loc:"greenhouse", freq:"⚠️ Died back badly (May 29) — HOLD water until soil is dry AND you confirm the crown is alive. Mint almost always regrows from the roots", days:3, overwater:true, trimDays:7,
    trim:"Cut all the dead/bare stems back hard. Check the base: firm and green means it will regenerate fast; mushy means root rot from overwatering. Do not water on a schedule until you see new growth pushing up." },
  { id:"dill",     name:"Dill",            emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry", days:3, trimDays:7,
    trim:"Snip outer fronds near the base. Cut flower heads to extend leaf production. Once fully flowered it declines — let go to seed if you want seeds for cooking." },
  { id:"rosemary", name:"Rosemary",        emoji:"🌿", loc:"greenhouse", freq:"Morning — weekly or less, drought tolerant", days:7, trimDays:14,
    trim:"Only ever trim soft green growth — cutting into the woody brown stems leaves bare gaps that will not releaf. Snip sprigs as you cook, and do light shaping to keep it bushy and upright." },

  // ── OUTDOOR EDIBLES ───────────────────────────────────────────────────────
  { id:"strawberry",    name:"Strawberry",         emoji:"🍓", loc:"outdoor", freq:"Daily — single round pot in full sun, so it dries out fast. Water deeply at the base each morning; in a heat wave it may want a second drink in the evening. Keep soil consistently moist while flowering and fruiting.", days:1, trimDays:14,
    trim:"Pinch off runners unless you want new plants (root them into pots). Remove browning/dead outer leaves. White flowers are open now — pinch a few of the earliest for bigger berries on the rest." },
  { id:"strawberry_pot", name:"Strawberry Pot (multi-plant)", emoji:"🍓", loc:"outdoor", freq:"Daily — a tall terracotta strawberry pot with a plant in each pocket, so it dries out fast and unevenly. Water in at the top and let it seep down through the pockets; in heat give the lower pockets a direct drink too. Keep every pocket evenly moist while the plants establish.", days:1, trimDays:14,
    trim:"✅ Runners cleared — all runners were taken off and the one that was rooting in a temp pot got snapped in the June 1 storm — so the pot is now putting all its energy into the crowns and berries. 🔥 Sunburn watch: leaves scorched in a day, so move the pots to morning sun with afternoon shade for 1–2 weeks and keep the mix evenly moist — a fried mother cannot root runners. Runner triage (you have ~4): snip any runner whose tip or baby plant has gone brown and crispy — it is dead and only drains the plant. Keep the 1–2 best green, bendy runners per plant and trim off their burnt tips. When a green runner grows a little leaf tuft at a node, lay that node on moist soil in an empty pocket or a small 3–4 inch pot and pin it down (bent wire, a paperclip, or a small stone) with the crown level — do NOT cut it from the mother yet. After 2–3 weeks, tug gently: if it has rooted, snip the runner free. Pinch all flowers this first year, and stop allowing new runners by mid-August so each plant hardens off for winter." },
  { id:"tomato",        name:"Heirloom Tomato",     emoji:"🍅", loc:"outdoor", freq:"Morning at the base — deep & CONSISTENT every day in heat (uneven watering is what causes the catfacing/cracking). Ease off slightly as fruit ripens.", days:1, trimDays:7,
    trim:"Pinch out suckers (the shoots in the V between stem and a branch) weekly. Strip leaves touching the soil. Re-stake or cage it — it is leaning and outgrowing the bamboo. Harvest beefsteaks as they turn deep red and slightly soft. 🌨️ Hail (Jun 1): the storm shredded some leaves — leave the torn ones on for now (they still feed the plant), snip only crushed or hanging bits with a clean cut so disease cannot enter the wound, and keep watering even; it should push fresh growth within a few days." },
  { id:"cherry_tomato", name:"Husky Cherry Tomato", emoji:"🍒", loc:"outdoor", freq:"Morning at the base — daily in heat, ease off when ripening to prevent splitting.", days:1, trimDays:10,
    trim:"Compact (determinate) type — do NOT sucker-prune it or you cut your harvest. Just remove leaves touching the soil and yellowing growth. Pick cherries promptly once they blush and it pushes out more clusters. 🌨️ Hail (Jun 1): same storm damage — do not strip the tattered leaves, just remove anything crushed or snapped, then let it recover; determinate plants bounce back fast with steady water." },
  { id:"jalapeno",      name:"Jalapeño",            emoji:"🌶️", loc:"outdoor", freq:"Morning at the base — every 2-3 days, let the top 2 inches dry. Less water = hotter pepper.", days:2, trimDays:21,
    trim:"🐞 Aphids spotted on it — blast them off with water or wipe them down, and use them: this is the perfect start for the aphid + ladybug culture (snip an aphid-covered leaf into a deli cup and add ladybug larvae — see the bug plan). Then: pinch the first flowers for a bushier plant and a bigger later harvest, remove yellowing lower leaves, and pick at 3-4 inches, firm and dark green, for best heat." },
  { id:"raspberry",     name:"Raspberry",           emoji:"🍇", loc:"outdoor", freq:"Morning at the base — every 2-3 days, deep soak.", days:2, trimDays:21,
    trim:"First-year canes (primocanes) — do NOT cut them back; they fruit next year. Tie them to the support as they grow and snip any dead or damaged tips." },
  { id:"ristra",        name:"New Mexico Chile",       emoji:"🌶️", loc:"greenhouse", freq:"Just germinated — keep the seed mix lightly and evenly moist (never soggy) and give it the brightest, warm light you have. Water gently at the soil or from below so you do not flatten the sprout.", days:2, trimDays:30,
    trim:"Seedling stage — no pruning. Once it has 2–3 sets of true leaves, pot it up into a bigger container and harden it off gradually before it ever goes outside. Pinch the very first flower buds later for a bushier, more productive plant." },

  // ── OUTDOOR ORNAMENTALS ───────────────────────────────────────────────────
  { id:"dianthus",  name:"Dianthus / Pinks", emoji:"🌸", loc:"outdoor", freq:"Morning — every 2-3 days at the base, try not to wet the flowers.", days:2, trimDays:5,
    trim:"Deadhead constantly — snip every faded bloom down to the next bud or leaf. Lots of spent blooms right now; do a full pass. This is the #1 thing that keeps it flowering all summer." },
  { id:"daisy",     name:"Daisy",            emoji:"🌼", loc:"outdoor", freq:"Morning — every 2 days, needs consistency. Make sure it is not sitting in water — the nursery basket inside the pot traps moisture.", days:2, trimDays:7,
    trim:"Deadhead spent flowers at the base of the stem and remove yellow/brown leaves. To fix the ongoing leaf stress, repot into the terra cotta directly with proper drainage." },
  { id:"candytuft", name:"Candytuft",        emoji:"🌾", loc:"outdoor", freq:"Morning — every 3-4 days, fairly drought tolerant.", days:3, trimDays:30,
    trim:"Spring bloom is finishing and it is getting leggy — shear the whole plant back by about a third now to keep it compact and trigger a second flush." }];

const PLANT_INFO = {
  philodendron: { fact:"Those heart-shaped leaves can trail several feet indoors — in the wild it climbs tree trunks toward the light.", photo:"images/philodendron_20260602.jpg" },
  ivy:          { fact:"Ivy clings to almost any surface using tiny root-like 'holdfasts' that secrete a natural glue.", photo:"images/ivy_20260531.jpg" },
  fittonia:     { photo:"images/fittonia_20260531.jpg", fact:"Called the 'nerve plant' for its vein-like patterns — it dramatically faints when thirsty, then perks back up after a drink. In bark mulch, check it every 2 days — it dries faster than soil." },
  croton:       { photo:"images/croton_20260531.jpg", fact:"Croton leaves change color with light: more sun means brighter reds, oranges, and yellows." },
  jade:         { fact:"A succulent that can live for decades — jade is widely seen as a symbol of good luck and prosperity.", photo:"images/jade_20260531.jpg" },
  basil1:       { fact:"Basil is in the mint family, and pinching it makes it bushier — the more you harvest, the more it grows.", photo:"images/basil1_20260531.jpg" },
  basil2:       { fact:"Ancient cultures saw basil as a symbol of love and protection; today it's the heart of pesto.", photo:"images/basil2_20260531.jpg" },
  parsley:      { fact:"Parsley is biennial — leaves the first year, flowers the second — and it's loaded with vitamin K.", photo:"images/parsley_20260531.jpg" },
  mint:         { fact:"Peppermint is a natural hybrid of watermint and spearmint, and it spreads so fast it's best kept potted.", photo:"images/mint_20260531.jpg" },
  dill:         { fact:"Dill's name comes from old Norse 'dilla', to soothe — it was once used to calm fussy babies.", photo:"images/dill_20260531.jpg" },
  rosemary:     { fact:"Rosemary means 'dew of the sea' and can live 20+ years — it loves dry feet and full sun.", photo:"images/rosemary_20260531.jpg" },
  strawberry:   { fact:"A strawberry isn't a true berry, and it's the only fruit with seeds on the outside — about 200 each.", photo:"images/strawberry_single_1.jpg" },
  strawberry_pot:{ fact:"A strawberry pot lets a whole patch of plants share one tall container — and runners from the top plants can root right into the lower pockets.", photo:"images/strawberry_pot_1.jpg" },
  tomato:       { fact:"Tomatoes are technically fruit; 'heirloom' means the variety has been saved and passed down 50+ years.", photo:"images/tomato_20260531.jpg" },
  cherry_tomato:{ fact:"Cherry tomatoes taste sweeter than big ones — more skin per bite concentrates the sugars.", photo:"images/cherry_tomato_20260602.jpg" },
  jalapeno:     { fact:"A jalapeño's heat lives in the white pith, not the seeds — and less water makes it hotter.", photo:"images/jalapeno_20260531.jpg" },
  ristra:       { fact:"Ristra peppers are the classic chiles strung into the hanging red ristras of the Southwest — a New Mexico / Hatch / cayenne-type chile dried on the string.", photo:"images/ristra_20260531.jpg" },
  raspberry:    { fact:"Each raspberry is a cluster of tiny 'drupelets', and the canes fruit in their second year.", photo:"images/raspberry_20260531.jpg" },
  dianthus:     { fact:"Dianthus means 'flower of the gods' in Greek, and many kinds smell just like cloves.", photo:"images/dianthus_20260531.jpg" },
  daisy:        { fact:"'Daisy' comes from 'day's eye' — the flower opens at dawn and closes again at dusk.", photo:"images/daisy_20260531.jpg" },
  candytuft:    { fact:"Candytuft is named for Candia (old Crete), not candy — though the clusters look sweet enough to eat.", photo:"images/candytuft_20260531.jpg" }
};

const WATER_INFO = {
  philodendron:{when:"Check weekly. Water only when the top 1–2 inches of soil feel dry, then water deeply until it drains from the bottom and empty the saucer. Keep it in bright indirect light.",thirst:"Forgiving and drought-tolerant — it would much rather sit a little dry than soggy, which rots its roots."},
  ivy:{when:"Water about weekly, when the top inch is dry — soak until it drains, then tip out the saucer. Mist the leaves or group it with other plants for humidity.",thirst:"A thirsty plant that still hates wet feet: it wants the soil moist but never standing in water."},
  fittonia:{when:"Check every 2 days — bark mulch mix dries fast. Water when the top inch is barely dry; don't let it reach the droop. Place on a pebble tray with water underneath for humidity. Keep away from AC vents.",thirst:"The drama queen: it collapses flat the instant it's thirsty, then springs back upright within an hour of a drink. But bark mix dries faster than potting soil — don't wait for the faint."},
  croton:{when:"Water when the top inch is dry, usually every 5–7 days, keeping it evenly moist in bright warm light. Do not let it fully dry out.",thirst:"Sensitive to swings — both bone-dry soil and cold drafts make it drop leaves in protest."},
  jade:{when:"Let the soil dry out completely, then water deeply and leave it alone for 2–3 weeks. Water much less in winter.",thirst:"A true succulent that stores water in its leaves, so underwatering is nearly impossible — but overwatering is fatal."},
  basil1:{when:"Water in the MORNING only, when the top 2 inches feel dry — usually daily in heat. Soak the soil, not the leaves; the greenhouse holds humidity overnight, so evening water invites mold.",thirst:"A heavy summer drinker that wilts fast in heat — water it before it flops, not after."},
  basil2:{when:"Morning only, when the top 2 inches are dry. Water at the base until the soil feels like a wrung-out sponge; avoid wetting the foliage.",thirst:"Wants steady moisture — let it go bone-dry and the leaves droop and toughen."},
  parsley:{when:"Morning water every 3–4 days, whenever the top 2 inches dry out. Water at the base and keep it lightly moist.",thirst:"Dislikes drying out completely — drought stress makes it bolt to seed sooner."},
  mint:{when:"⚠️ On HOLD — it died back badly (May 29). Do not water on a schedule: only water once the soil is dry AND you have confirmed the crown is still firm and green, then resume morning water.",thirst:"Normally a water-lover that wilts then bounces back in hours — but right now soggy soil is the enemy while it recovers."},
  dill:{when:"Morning water when the top 2 inches dry, every couple of days. Water at the base and keep it from drying out fully.",thirst:"Likes slightly moist soil — let it dry hard and it bolts and flowers early."},
  rosemary:{when:"Water sparingly — only about weekly, and let it dry well between drinks. Morning water at the base; when in doubt, skip it.",thirst:"Mediterranean and drought-tolerant — overwatering is the number-one way to kill rosemary."},
  strawberry:{when:"Daily — the round pot in full sun dries fast. Water deeply at the base each morning; in a heat wave it may want a second drink in the evening. Keep evenly moist while flowering and fruiting.",thirst:"Shallow-rooted and quick to dry — steady moisture is what makes the berries plump and sweet."},
  strawberry_pot:{when:"Daily in summer — pour water in at the top opening and let it percolate down, then give the lowest, fastest-drying pockets a direct drink. The pot dries unevenly, so check each pocket rather than assuming the whole thing got watered.",thirst:"The upper pockets dry out first and hardest — a crispy-looking plant is almost always a top pocket that missed its turn."},
  tomato:{when:"Morning, at the base, deep and CONSISTENT — daily in heat. Never wet the leaves. Ease off slightly as the fruit ripens.",thirst:"Consistency is everything: swinging from dry to drenched is exactly what causes cracking and catfacing."},
  cherry_tomato:{when:"Morning, at the base, daily in heat; ease off once the fruit is ripening to prevent splitting.",thirst:"Steady water keeps the skins intact — a sudden big drink after a dry spell makes them burst."},
  jalapeno:{when:"Water at the base every 2–3 days, letting the top 2 inches dry first. A little controlled dryness is good for it.",thirst:"Mild water stress concentrates the heat — keep it on the lean side for hotter peppers."},
  ristra:{when:"Tiny seedling — keep the mix evenly moist, never wet. Water gently at the soil (a mister or bottom-watering is safest) so the sprout is not knocked over, in bright warm light.",thirst:"A fragile sprout: it wants steady moisture, but a soggy mix will damp it off — let the very surface dry slightly between drinks."},
  raspberry:{when:"Deep soak at the base every 2–3 days — aim for about an inch of water a week. Deep and infrequent beats daily sprinkles.",thirst:"Its roots run wide and shallow, so it wants deep soaks that reach them, not surface splashes."},
  dianthus:{when:"Water at the base every 2–3 days, letting the surface dry slightly between. Keep water off the flowers and crown.",thirst:"Hates soggy soil — a constantly wet crown is what rots these plants."},
  daisy:{when:"Morning water about every 2 days for consistency. Crucial: make sure it is not sitting in water — the nursery basket inside the pot traps moisture.",thirst:"A tricky reader — droopy stems can mean too little OR too much water, so always check drainage first."},
  candytuft:{when:"Water every 3–4 days, letting it dry between — it is fairly drought-tolerant. Do not overwater.",thirst:"Happiest on the dry side; it sulks and rots in soil that stays wet."}
};

const FUN_FACTS = {
  philodendron:["Those heart-shaped leaves can trail several feet indoors — in the wild it climbs tree trunks toward the light.","A cutting in a glass of water roots in a couple of weeks, so one plant becomes many for free.","It is a NASA-listed air-purifier that quietly pulls toxins out of indoor air."],
  ivy:["Ivy clings to almost any surface using tiny root-like holdfasts that secrete a natural glue.","English ivy is one of the best air-filtering houseplants there is.","Outdoors it can climb 80+ feet, but indoors it makes a tidy trailing vine."],
  fittonia:["Called the nerve plant for its glowing vein patterns, which come in pink, red, and white.","It dramatically faints flat when thirsty, then springs upright within an hour of a drink.","A rainforest groundcover at heart, so it thrives in the humidity of a terrarium."],
  croton:["Croton leaves change color with light — more sun means brighter reds, oranges, and yellows.","Every croton has its own leaf pattern; no two plants are exactly alike.","It sulks and drops leaves when moved, then settles once it is used to its new spot."],
  jade:["A succulent that can live for decades — jade is widely seen as a symbol of good luck and prosperity.","Each plump leaf is a little water tank, which is why jade shrugs off a missed watering.","A single fallen leaf laid on soil will root and grow into a whole new plant."],
  basil1:["Basil is in the mint family, and pinching it makes it bushier — the more you harvest, the more it grows.","Basil and tomatoes are companions both in the garden and on the plate.","Keep cut basil on the counter, never the fridge — cold turns the leaves black."],
  basil2:["Ancient cultures saw basil as a symbol of love and protection; today it is the heart of pesto.","There are 60+ varieties — Thai, lemon, cinnamon, purple — each with its own aroma.","Letting basil flower tells the plant to stop making leaves, so keep pinching the buds."],
  parsley:["Parsley is biennial — leaves the first year, flowers the second — and it is loaded with vitamin K.","Chewing fresh parsley really does help neutralize garlic and onion breath.","It is a magnet for swallowtail butterflies, whose caterpillars feed on the leaves."],
  mint:["Peppermint is a natural hybrid of watermint and spearmint, and it spreads so fast it is best kept potted.","Mint's menthol is what makes it feel cold on your tongue — it tricks your nerves.","A few sprigs in open ground can take over an entire bed in a season."],
  dill:["Dill's name comes from old Norse dilla, to soothe — it was once used to calm fussy babies.","Both the feathery fronds and the seeds are edible, with different flavors.","Like parsley, dill feeds swallowtail caterpillars — leave a little for them."],
  rosemary:["Rosemary means dew of the sea and can live 20+ years — it loves dry feet and full sun.","Students in ancient Greece wore rosemary sprigs, believing it boosted memory.","Its woody stems make great grilling skewers that perfume the food."],
  strawberry:["A strawberry is not a true berry, and it is the only fruit with seeds on the outside — about 200 each.","Those tiny seeds are actually the real fruits; the sweet red part is swollen stem tissue.","One plant sends out runners that root into whole new plants for free."],
  strawberry_pot:["A strawberry pot's stacked pockets let one container hold a whole little patch of plants.","Runners from the upper plants will root themselves into the lower pockets if you tuck them in.","Terracotta breathes and wicks moisture, so these pots dry faster than plastic — and the top pockets fastest of all."],
  tomato:["Tomatoes are technically a fruit; heirloom means the variety has been saved and passed down 50+ years.","They were once feared as poisonous in Europe because they belong to the nightshade family.","A tomato on a sunny sill keeps ripening — chilling it in the fridge kills the flavor."],
  cherry_tomato:["Cherry tomatoes taste sweeter than big ones — more skin per bite concentrates the sugars.","Husky types stay compact and bushy, which makes them perfect for pots.","They ripen in waves, so a single plant can feed you cherries all summer long."],
  jalapeno:["A jalapeño's heat lives in the white pith, not the seeds — and less water makes it hotter.","Leave one on the plant and it turns red, sweeter, and hotter.","Smoke-dry a ripe red jalapeño and you have made a chipotle."],
  ristra:["Ristra chiles are the ones strung into the hanging red ristras of New Mexico.","Every pepper starts as two seed leaves (cotyledons) — the real pepper leaves come next.","Easing back on water late in the season concentrates a chile heat."],
  raspberry:["Each raspberry is a cluster of tiny drupelets, and the canes fruit in their second year.","The hollow center is why raspberries are so delicate — they bruise in the bowl.","Green primocanes this year become the fruiting floricanes of next year."],
  dianthus:["Dianthus means flower of the gods in Greek, and many kinds smell just like cloves.","The color word pink came from these flowers' frilly, pinked edges.","Deadheading spent blooms is the single best trick to keep it flowering all summer."],
  daisy:["Daisy comes from day's eye — the flower opens at dawn and closes again at dusk.","What looks like one flower is actually hundreds of tiny florets packed together.","Daisies are in the same plant family as sunflowers and lettuce."],
  candytuft:["Candytuft is named for Candia (old Crete), not candy — though the clusters look sweet enough to eat.","It is evergreen, so the foliage stays green through winter in mild climates.","Shear it back after blooming and it often rewards you with a second flush."]
};

const CARE_INFO = {
  philodendron:{fact:"Pinching the vine tips just past a leaf makes it branch and stay full instead of going long and bare."},
  ivy:{fact:"Wiping the leaves and checking their undersides keeps spider mites — ivy's main pest — from taking hold."},
  fittonia:{fact:"Pinching off the tiny flower spikes keeps the plant pouring energy into those colorful leaves."},
  croton:{fact:"Rotating the pot a quarter-turn each week keeps its colorful leaves growing evenly toward the light."},
  jade:{fact:"Turning jade regularly keeps it from leaning, and its trunk thickens with age into a little tree."},
  basil1:{fact:"Pinching out the growing tip tricks basil into branching — one cut becomes two stems."},
  basil2:{fact:"Removing flower buds keeps the plant making tender leaves instead of going to seed."},
  parsley:{fact:"Snipping the oldest outer stems first keeps the productive young center growing."},
  mint:{fact:"Cutting mint back hard whenever it gets leggy forces fresh, tender new growth."},
  dill:{fact:"Pinching the central flower stalk early keeps dill leafy for much longer."},
  rosemary:{fact:"Light, regular shaping of green growth keeps rosemary bushy — never cut into old wood."},
  strawberry:{fact:"Snipping off runners sends the plant's energy into berries instead of new plants."},
  strawberry_pot:{fact:"Every runner can become a free new plant — but a stressed or sunburnt mother should keep only its strongest one or two and have the rest snipped off."},
  tomato:{fact:"Removing the suckers in the leaf joints channels energy into fewer, bigger fruit."},
  cherry_tomato:{fact:"This compact type needs almost no pruning — just clear the leaves that touch the soil."},
  jalapeno:{fact:"Pinching the very first flowers gives you a bushier plant and a bigger later harvest."},
  ristra:{fact:"At the seedling stage the whole job is bright light, gentle moisture, and patience — pot it up once it has a few true leaves."},
  raspberry:{fact:"Tying canes to a support and snipping off dead tips is most of raspberry care."},
  dianthus:{fact:"Deadheading — snipping spent blooms back to a bud — is the heart of keeping it flowering."},
  daisy:{fact:"Deadheading spent flowers and clearing yellow leaves keeps it blooming and healthy."},
  candytuft:{fact:"A hard shear right after bloom keeps candytuft compact instead of woody and sprawling."}
};

function dayOfYear(){ const n=new Date(); return Math.floor((n-new Date(n.getFullYear(),0,0))/86400000); }
function dailyFact(id){ const a=FUN_FACTS[id]; if(a&&a.length) return a[dayOfYear()%a.length]; return (PLANT_INFO[id]||{}).fact||""; }

const HARVEST_INFO = {
  basil1:{how:"Once stems are 6+ inches, snip a stem tip just above a pair of leaves — that node splits into two new branches, so always cut from the top. Strip the leaves off the stem to use, take no more than a third of the plant at once, and pinch out any flower buds you find.",fact:"The more you cut basil, the bushier it grows.",date:"2026-05-30"},
  basil2:{how:"Cut 4–6 inch stem tips just above a leaf pair to force branching, then strip the leaves from the stem. Harvest from the top down and keep every flower bud pinched off.",fact:"Pinch flower buds the moment you see them, or the leaves turn bitter.",date:"2026-05-30"},
  rosemary:{how:"In the morning, cut 2–4 inch sprigs of soft green new growth — never cut into the woody brown stems, which will not regrow. Strip the needles backward off the stem to use, and take no more than a third.",fact:"Rosemary's aromatic oils and flavor peak in the morning.",date:"2026-05-30"},
  parsley:{how:"Harvest the outermost full-size stems right at the base, working your way inward, and leave the small inner growth to keep producing. Use scissors rather than tearing, and never take more than half.",fact:"Parsley regrows from the center all season long.",date:"2026-06-05"},
  dill:{how:"Snip the outer feathery fronds near the base as you need them. Cut off flower heads early to keep the leaves coming — or let one head dry on the plant to harvest dill seed.",fact:"Both the feathery fronds and the seeds are usable, with different flavors.",date:"2026-06-10"},
  strawberry:{ongoing:true, signs:"Ready when the berry is red all the way to the shoulders and stem — no white or pale patches near the top. Ripe ones come off with the lightest tug.", how:"Pick only when fully, evenly red. Pinch or snip the stem just above the berry and leave the green cap on so it does not bruise — never tug the fruit itself. Check every 1–2 days.", fact:"Strawberries do not ripen any further once picked, so wait for full red."},
  strawberry_pot:{ongoing:true, signs:"Check every pocket — a berry is ready when it is fully, evenly red with no pale shoulders. Pockets ripen on their own schedule, so there is almost always one ready, and ripe ones hide behind the leaves.", how:"Pick each berry only when fully red, snipping the stem just above the green cap so you do not bruise it — never tug. Check every pocket every 1–2 days.", fact:"A strawberry pot gives a longer, staggered picking season than a single plant."},
  cherry_tomato:{ongoing:true, signs:"Still green for now. They are ready when fully colored and slightly soft — a ripe one releases with a gentle twist. Once most of a cluster has colored up, take the whole truss.", how:"Pick when fully colored and slightly soft. If most of a cluster is ripe, harvest the whole truss at once. Check daily once they start coloring.", fact:"Left too long they split, so pick promptly once they color up."},
  tomato:{ongoing:true, signs:"Right now they are still green — not ready yet. Start picking when a fruit shows its first real blush of color and gives slightly to a squeeze. You can pick at the first-color (breaker) stage and finish ripening on the counter.", how:"Twist gently or snip the stem once deep-colored with a slight give — or pick at first blush and ripen on the counter to beat cracking and critters. Never refrigerate.", fact:"Counter-ripening from the breaker stage protects the fruit from splitting."},
};

/* ── RECIPES ──────────────────────────────────────────────────────────────
   Placeholder list so the Food → Recipes tab has a featured card + grid + a
   full detail page. Replace these with the real recipe list when ready.
   Shape: { id, name, emoji, photo?, time?, difficulty?, servings?, tags?[],
            featured?, blurb?, ingredients?[], steps?[] }                     */
const RECIPES = [
  { id:"r_beef_tenderloin", name:"Beef Tenderloin with Mushroom Pan Sauce & Garlicky Spinach", emoji:"🥩", featured:true, photo:"images/recipe_beef_tenderloin.jpg", photoCredit:"Photo: Gerda Arendt · CC BY-SA 4.0 · Wikimedia Commons",
    time:"~45 min", difficulty:"Medium", servings:"2–3", tags:["dinner","garden"],
    blurb:"A restaurant-style seared beef tenderloin with a rich mushroom pan sauce and quick garlicky spinach, plus a crisp romaine side salad. Properly paired — no forcing every vegetable onto the plate.",
    ingredients:[
      "Beef tenderloin (about 1 to 1.5 lb, steaks or a roast)",
      "Salt + black pepper",
      "Olive oil + 2 to 3 Tbsp butter",
      "3 to 4 cloves garlic",
      "8 oz cremini or button mushrooms, sliced",
      "About 1/3 cup beef broth or red wine",
      "A few handfuls of fresh spinach",
      "2 to 3 green onions, sliced",
      "1 to 2 romaine hearts + a simple Dijon-lemon vinaigrette (for a raw side salad)"
    ],
    steps:[
      "Season the tenderloin generously with salt and pepper, and let it come to room temperature, about 30 minutes.",
      "Sear in a hot oiled cast-iron pan 2 to 3 minutes per side; add butter and a smashed garlic clove and baste. Cook to 130°F for medium-rare, then rest 10 minutes.",
      "Mushroom pan sauce: in the same pan, melt butter and sauté the mushrooms until deep golden. Add minced garlic and the white parts of the green onions for 1 minute, then deglaze with the broth or wine, scraping up the fond. Reduce by half, swirl in a knob of butter, and season.",
      "Garlicky spinach: quickly wilt the spinach in a little butter and garlic, and salt it lightly.",
      "Romaine side salad: chop the romaine and toss it with the Dijon-lemon vinaigrette.",
      "Slice the rested tenderloin, spoon the mushroom sauce over, and scatter the green onion tops. Serve with the spinach and the romaine salad."
    ],
    note:"Zucchini and yellow squash were intentionally left out — they don't pair as strongly with tenderloin. Save them for another dish." },

  // ── 🐕 ZOEY'S HOMEMADE DOG FOOD (not people food) ──────────────────────────
  { id:"r_zoey_chicken", name:"Zoey's Chicken", emoji:"🐕", dog:true,
    time:"~1 hr batch", difficulty:"Easy", servings:"10-day batch", tags:["dog"],
    blurb:"Zoey's everyday chicken bowl — gently cooked thigh with a little liver for organs, soft white rice, and mashed-in vegetables.",
    ingredients:[
      "Chicken thigh, boneless skinless — the bulk of the batch (about 60%)",
      "Chicken liver — about 5% of the batch",
      "White rice, cooked soft — about 20%",
      "Carrots, green beans, and spinach, finely chopped — about 15%",
      "Eggshell calcium — about 1/2 teaspoon per pound of food (kitchen-made, see steps)",
      "Canned no-salt sardines in water — swap in for part of the meat 1 to 2 times a week",
      "Egg — a couple times a week, cooked plain"
    ],
    steps:[
      "Simmer or bake the chicken thighs through with no seasoning at all — no salt, no oil needed.",
      "Cook the liver gently through (it cooks fast — a few minutes in the same pan).",
      "Cook the white rice soft, a little wetter than you would for people.",
      "Steam or simmer the carrots, green beans, and spinach until soft, then chop fine or mash.",
      "Chop or shred the meats, then mix everything evenly so she cannot pick around the vegetables.",
      "Cool fully, portion into daily containers (460 to 480 g per day), fridge 3 to 4 days of it, freeze the rest.",
      "Eggshell calcium: bake clean, dry shells about 10 minutes at 300°F, grind to a fine powder, and stir in about 1/2 teaspoon per pound of food.",
      "Through the week: swap part of the meat for canned no-salt sardines in water 1 to 2 times, and toss in a plain cooked egg a couple of times.",
      "At each meal: warm slightly and serve."
    ],
    note:"Daily total is about 660 kcal: 460 to 480 g split into 2 meals. Makes a 10-day batch — fridge 3 to 4 days, freeze the rest in daily portions. Eggshell calcium, liver, the occasional egg, sardines, and varied vegetables keep this balanced — no store-bought supplements. NEVER: onion, garlic, grapes or raisins, xylitol, chocolate, macadamia, avocado, cooked bones, or added salt. Vet note: Zoey is 8 — get a baseline weight and senior bloodwork." },
  { id:"r_zoey_beef", name:"Zoey's Beef", emoji:"🐕", dog:true,
    time:"~1 hr batch", difficulty:"Easy", servings:"10-day batch", tags:["dog"],
    blurb:"The beef rotation — lean ground beef with beef liver, sweet potato for the carb, and three soft vegetables.",
    ingredients:[
      "Ground beef, 90/10 lean — the bulk of the batch (about 60%)",
      "Beef liver — about 5% of the batch",
      "Sweet potato, peeled and cooked soft — about 20%",
      "Green beans, carrots, and zucchini, finely chopped — about 15%",
      "Eggshell calcium — about 1/2 teaspoon per pound of food (kitchen-made, see steps)",
      "Canned no-salt sardines in water — swap in for part of the meat 1 to 2 times a week",
      "Egg — a couple times a week, cooked plain"
    ],
    steps:[
      "Brown the ground beef in a dry pan with no seasoning; drain only if there is pooling fat (90/10 keeps it lean).",
      "Cook the beef liver gently through and chop it fine.",
      "Boil or bake the sweet potato until completely soft, then peel and mash.",
      "Steam the green beans, carrots, and zucchini soft; chop small.",
      "Mix everything evenly, cool fully, and portion into daily containers (460 to 480 g per day).",
      "Fridge 3 to 4 days of portions, freeze the rest.",
      "Eggshell calcium: bake clean, dry shells about 10 minutes at 300°F, grind to a fine powder, and stir in about 1/2 teaspoon per pound of food.",
      "Through the week: swap part of the meat for canned no-salt sardines in water 1 to 2 times, and toss in a plain cooked egg a couple of times.",
      "At each meal: warm slightly and serve."
    ],
    note:"Daily total is about 660 kcal: 460 to 480 g split into 2 meals. Makes a 10-day batch — fridge 3 to 4 days, freeze the rest in daily portions. Eggshell calcium, liver, the occasional egg, sardines, and varied vegetables keep this balanced — no store-bought supplements. NEVER: onion, garlic, grapes or raisins, xylitol, chocolate, macadamia, avocado, cooked bones, or added salt. Vet note: Zoey is 8 — get a baseline weight and senior bloodwork." },
  { id:"r_zoey_pork", name:"Zoey's Pork", emoji:"🐕", dog:true,
    time:"~1 hr batch", difficulty:"Easy", servings:"10-day batch", tags:["dog"],
    blurb:"The pork rotation — lean pork loin with liver, rice or sweet potato, and green vegetables with a little kale.",
    ingredients:[
      "Pork loin, lean, all visible fat trimmed — the bulk of the batch (about 60%)",
      "Liver (pork or chicken) — about 5% of the batch",
      "White rice or sweet potato, cooked soft — about 20%",
      "Green beans, carrots, and kale, finely chopped — about 15%",
      "Eggshell calcium — about 1/2 teaspoon per pound of food (kitchen-made, see steps)",
      "Canned no-salt sardines in water — swap in for part of the meat 1 to 2 times a week",
      "Egg — a couple times a week, cooked plain"
    ],
    steps:[
      "Trim the pork loin well and simmer or bake it fully through — pork must be cooked through, no pink, and never seasoned.",
      "Cook the liver gently and chop it fine.",
      "Cook the rice soft (or boil and mash the sweet potato).",
      "Steam the green beans, carrots, and kale until soft — kale especially needs to be soft and chopped small.",
      "Chop the pork small, mix everything evenly, and cool fully.",
      "Portion into daily containers (460 to 480 g per day): fridge 3 to 4 days, freeze the rest.",
      "Eggshell calcium: bake clean, dry shells about 10 minutes at 300°F, grind to a fine powder, and stir in about 1/2 teaspoon per pound of food.",
      "Through the week: swap part of the meat for canned no-salt sardines in water 1 to 2 times, and toss in a plain cooked egg a couple of times.",
      "At each meal: warm slightly and serve."
    ],
    note:"Daily total is about 660 kcal: 460 to 480 g split into 2 meals. Makes a 10-day batch — fridge 3 to 4 days, freeze the rest in daily portions. Eggshell calcium, liver, the occasional egg, sardines, and varied vegetables keep this balanced — no store-bought supplements. NEVER: onion, garlic, grapes or raisins, xylitol, chocolate, macadamia, avocado, cooked bones, or added salt. Vet note: Zoey is 8 — get a baseline weight and senior bloodwork." }
];
