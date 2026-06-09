// ═══════════════════════════════════════════════════════════════
// data.js — APP DATA (extracted from index.html, item-6 refactor)
// Classic script: these top-level consts share global lexical scope
// with the inline <script> in index.html, which loads AFTER this file.
// Objects: ROOMS, TASKS, SCHEDULE, PLANTS, PLANT_INFO, WATER_INFO,
//          FUN_FACTS, CARE_INFO, HARVEST_INFO.
// Jun 7 2026: per-plant display chips — light / waterChip / harvestChip (display ONLY; `days` stays the watering-engine truth, waterChip must always agree with it).
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
  windDown:  "10:00 PM",       // phone goes to the other room, screens off
  reading:   "10:00–11:00 PM", // the reading hour fills the no-screen block
  lightsOut: "11:00 PM",
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
  auth_lock:      { room:"priority", label:"🔒 Big project: real app lock — Firebase Auth + locked database rules", level:"hard", note:"The password curtain on the app is cosmetic — the page AND the Firebase data are still publicly readable by anyone with the URL. The real fix: Firebase Authentication sign-in + database security rules locked to that account. Curtain password lives in CURTAIN_PASSWORD at the top of index.html." },
  rx_setup:       { room:"priority", label:"Set up esomeprazole at King Soopers (use GoodRx)", level:"easy", note:"Open GoodRx, search esomeprazole for the King Soopers pharmacy, grab the coupon price, and send or transfer the prescription there. Show the GoodRx coupon at the counter on pickup." },
  measure_printer:{ room:"office",   label:"Measure the 3D printer — width, depth, height + room for spools and cables", level:"easy", note:"Do this before buying a desk so you know exactly what fits." },
  find_desk:      { room:"priority", label:"Find a cheap sturdy desk — Marketplace, Craigslist, OfferUp", level:"easy", note:"Must be sturdy — needs to hold the 3D printer. Check FB Marketplace first — people offload office furniture constantly." },
  sv06_sock:      { room:"priority", label:"🧤 Order SV06 silicone sock (2-pack) — Sovol SV06 hotend sock", level:"easy" },
  sv06_fan:       { room:"priority", label:"🌬️ Order replacement SV06 Plus fan (24V) — the screamy one: 4010 = hotend heatsink fan, 4020 = part-cooling blower; replace whichever's loud (or both)", level:"easy" },
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
  { id:"philodendron", light:"☀️ Bright indirect", waterChip:"💧 every 7 days — top 1–2 in dry", harvestChip:"🌿 foliage — not harvested", name:"Heartleaf Philodendron", emoji:"🪴", loc:"indoor", freq:"Water when the top 1–2 inches of soil are dry; bright indirect light.", days:7, overwater:true },
  { id:"ivy", light:"🌥️ Bright indirect", waterChip:"💧 every 7 days", harvestChip:"🌿 foliage — not harvested",          name:"Royal Tea Ivy",           emoji:"🍃", loc:"indoor", freq:"Keep lightly moist — water when the top inch dries. Likes humidity.", days:7, overwater:true },
  { id:"fittonia", light:"🌥️ Bright indirect — no direct sun", waterChip:"💧 every 2–3 days", harvestChip:"🌿 foliage — not harvested",     name:"Fittonia / Nerve Plant",  emoji:"🌱", loc:"indoor", freq:"Every 2-3 days — bark mix dries fast, check top inch. Water before it droops; don't wait for the faint.", days:3, note:"May 31: Leaf edges browning = low humidity stress. Bark mulch media dries much faster than potting mix — check every 2 days. Add a pebble tray with water under the pot for ambient humidity. Keep away from AC vents. New center growth looks healthy — no repot needed yet. Moved from dark office to bright indirect light room May 31 — correct placement. Watch for direct sun rays which will scorch leaves." },
  { id:"croton", light:"☀️ Bright indirect → morning direct", waterChip:"💧 every 5–7 days", harvestChip:"🌿 foliage — not harvested",       name:"Banana Croton",           emoji:"🌴", loc:"indoor", freq:"Every 5-7 days — check top inch, bark mix dries fast. Don't overwater; crotons are drought-tolerant.", days:6, note:"May 31: Banana Croton — narrow yellow-striped leaves, looks like a recent purchase still adjusting. Normal to drop some leaves when moved (don't panic). Needs bright indirect to direct morning light — more light-hungry than Fittonia. Hates cold drafts and temps below 60°F. Same bark mix as Fittonia — check moisture every 3-4 days. No leaf drop yet = good sign." },
  { id:"jade", light:"☀️ 4–6h direct or bright", waterChip:"💧 every ~18 days — dry out fully", harvestChip:"🌿 foliage — not harvested",         name:"Jade Plant",              emoji:"🪨", loc:"indoor", freq:"Succulent — let it dry out completely, then water deeply. Water sparingly.", days:18 },

  // ── GREENHOUSE HERBS ──────────────────────────────────────────────────────
  { id:"basil1", light:"☀️ Full sun 6–8h", waterChip:"💧 every 3 days", harvestChip:"✂️ weekly pinching — more = bushier",   name:"Sweet Basil #1",  emoji:"🌿", loc:"greenhouse", freq:"Morning only — top 2 inches dry before watering. Greenhouse stays humid at night", days:3, overwater:true, trimDays:7,
    trim:"Pinch flower buds the moment you see them. Cut just above a leaf pair, leaving 2-3 sets below. Remove all yellowing lower leaves. Never cut more than ⅓ at once. Every 1-2 weeks." },
  { id:"basil2", light:"☀️ Full sun 6–8h", waterChip:"💧 every 3 days", harvestChip:"✂️ weekly pinching — more = bushier",   name:"Sweet Basil #2",  emoji:"🌿", loc:"greenhouse", freq:"Morning only — top 2 inches dry before watering", days:3, overwater:true, trimDays:7,
    trim:"Pinch out every flower bud the moment it appears. Cut stems just above a leaf pair so each cut branches into two, and strip off any yellowing lower leaves. Bushier growth means more harvest — never take more than a third at once." },
  { id:"parsley", light:"⛅ Full sun–part shade", waterChip:"💧 every 3–4 days", harvestChip:"✂️ outer stems weekly",  name:"Curled Parsley",  emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry, every 3-4 days", days:3, trimDays:14,
    trim:"Dead flower stalks → cut at base completely. Harvest outer stems at the base, leaving young inner growth. Never take more than half. Every 2-3 weeks." },
  { id:"mint", light:"⛅ Part shade ok", waterChip:"💧 every 3 days — evenly moist", harvestChip:"✂️ not yet — new flush ~2–3 wks, then weekly pinching",     name:"Peppermint",      emoji:"🌿", loc:"greenhouse", freq:"🌱 Recovering — new growth Jun 6; keep evenly moist, it's coming back. Gentle morning water", days:3, overwater:true, trimDays:7,
    trim:"The hard cut-back worked — fresh shoots are pushing up from the crown (Jun 6). Let the new growth establish; once stems have a few leaf pairs, pinch tips to bush it out. Leave the remaining old stems until the new flush fills in." },
  { id:"dill", light:"☀️ Full sun", waterChip:"💧 every 3 days", harvestChip:"✂️ fronds weekly — cut flower heads",     name:"Dill",            emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry", days:3, trimDays:7,
    trim:"Snip outer fronds near the base. Cut flower heads to extend leaf production. Once fully flowered it declines — let go to seed if you want seeds for cooking." },
  { id:"rosemary", light:"☀️ Full sun 6–8h", waterChip:"💧 every 7+ days — drought-tolerant", harvestChip:"✂️ sprigs every 2 wks — max ⅓", name:"Rosemary",        emoji:"🌿", loc:"greenhouse", freq:"Morning — weekly or less, drought tolerant", days:7, trimDays:14,
    trim:"Only ever trim soft green growth — cutting into the woody brown stems leaves bare gaps that will not releaf. Snip sprigs as you cook, and do light shaping to keep it bushy and upright." },

  // ── OUTDOOR EDIBLES ───────────────────────────────────────────────────────
  { id:"strawberry", light:"☀️ Full sun 6–10h", waterChip:"💧 daily", harvestChip:"🍓 check every 2–3 days in season",    name:"Strawberry",         emoji:"🍓", loc:"outdoor", freq:"Daily — single round pot in full sun, so it dries out fast. Water deeply at the base each morning; in a heat wave it may want a second drink in the evening. Keep soil consistently moist while flowering and fruiting.", days:1, trimDays:14,
    trim:"Pinch off runners unless you want new plants (root them into pots). Remove browning/dead outer leaves. White flowers are open now — pinch a few of the earliest for bigger berries on the rest." },
  { id:"strawberry_pot", light:"☀️ Full sun 6–10h", waterChip:"💧 daily", harvestChip:"🍓 check every 2–3 days in season", name:"Strawberry Pot (multi-plant)", emoji:"🍓", loc:"outdoor", freq:"Daily — a tall terracotta strawberry pot with a plant in each pocket, so it dries out fast and unevenly. Water in at the top and let it seep down through the pockets; in heat give the lower pockets a direct drink too. Keep every pocket evenly moist while the plants establish.", days:1, trimDays:14,
    trim:"✅ Runners cleared — all runners were taken off and the one that was rooting in a temp pot got snapped in the June 1 storm — so the pot is now putting all its energy into the crowns and berries. 🔥 Sunburn watch: leaves scorched in a day, so move the pots to morning sun with afternoon shade for 1–2 weeks and keep the mix evenly moist — a fried mother cannot root runners. Runner triage (you have ~4): snip any runner whose tip or baby plant has gone brown and crispy — it is dead and only drains the plant. Keep the 1–2 best green, bendy runners per plant and trim off their burnt tips. When a green runner grows a little leaf tuft at a node, lay that node on moist soil in an empty pocket or a small 3–4 inch pot and pin it down (bent wire, a paperclip, or a small stone) with the crown level — do NOT cut it from the mother yet. After 2–3 weeks, tug gently: if it has rooted, snip the runner free. Pinch all flowers this first year, and stop allowing new runners by mid-August so each plant hardens off for winter." },
  { id:"tomato", light:"☀️ Full sun 8h", waterChip:"💧 daily — deep & consistent", harvestChip:"🍅 ~weekly checks as fruits ripen",        name:"Heirloom Tomato",     emoji:"🍅", loc:"outdoor", freq:"Morning at the base — deep & CONSISTENT every day in heat (uneven watering is what causes the catfacing/cracking). Ease off slightly as fruit ripens.", days:1, trimDays:7,
    trim:"Pinch out suckers (the shoots in the V between stem and a branch) weekly. Strip leaves touching the soil. Re-stake or cage it — it is leaning and outgrowing the bamboo. Harvest beefsteaks as they turn deep red and slightly soft. 🌨️ Hail (Jun 1): the storm shredded some leaves — leave the torn ones on for now (they still feed the plant), snip only crushed or hanging bits with a clean cut so disease cannot enter the wound, and keep watering even; it should push fresh growth within a few days." },
  { id:"cherry_tomato", light:"☀️ Full sun", waterChip:"💧 daily", harvestChip:"🍒 every 2–3 days once coloring", name:"Husky Cherry Tomato", emoji:"🍒", loc:"outdoor", freq:"Morning at the base — daily in heat, ease off when ripening to prevent splitting.", days:1, trimDays:10,
    trim:"Compact (determinate) type — do NOT sucker-prune it or you cut your harvest. Just remove leaves touching the soil and yellowing growth. Pick cherries promptly once they blush and it pushes out more clusters. 🌨️ Hail (Jun 1): same storm damage — do not strip the tattered leaves, just remove anything crushed or snapped, then let it recover; determinate plants bounce back fast with steady water." },
  { id:"jalapeno", light:"☀️ Full sun 6–8h", waterChip:"💧 every 2–3 days", harvestChip:"🌶️ ~weekly at full size",      name:"Jalapeño",            emoji:"🌶️", loc:"outdoor", freq:"Morning at the base — every 2-3 days, let the top 2 inches dry. Less water = hotter pepper.", days:2, trimDays:21,
    trim:"🐞 Aphids spotted on it — blast them off with water or wipe them down, and use them: this is the perfect start for the aphid + ladybug culture (snip an aphid-covered leaf into a deli cup and add ladybug larvae — see the bug plan). Then: pinch the first flowers for a bushier plant and a bigger later harvest, remove yellowing lower leaves, and pick at 3-4 inches, firm and dark green, for best heat." },
  { id:"raspberry", light:"☀️ Full sun", waterChip:"💧 every 2–3 days — deep soak", harvestChip:"🍇 every 2–3 days in season",     name:"Raspberry",           emoji:"🍇", loc:"outdoor", freq:"Morning at the base — every 2-3 days, deep soak.", days:2, trimDays:21,
    trim:"First-year canes (primocanes) — do NOT cut them back; they fruit next year. Tie them to the support as they grow and snip any dead or damaged tips." },
  { id:"ristra", light:"☀️ Brightest warm light", waterChip:"💧 every 2 days — evenly moist, gentle", harvestChip:"🌶️ not yet — first harvest ~10–12 weeks after transplant",        name:"New Mexico Chile",       emoji:"🌶️", loc:"greenhouse", freq:"Just germinated — keep the seed mix lightly and evenly moist (never soggy) and give it the brightest, warm light you have. Water gently at the soil or from below so you do not flatten the sprout.", days:2, trimDays:30,
    trim:"Seedling stage — no pruning. Once it has 2–3 sets of true leaves, pot it up into a bigger container and harden it off gradually before it ever goes outside. Pinch the very first flower buds later for a bushier, more productive plant." },

  // ── OUTDOOR ORNAMENTALS ───────────────────────────────────────────────────
  { id:"dianthus", light:"☀️ Full sun ≥6h", waterChip:"💧 every 2–3 days", harvestChip:"✂️ deadhead weekly",  name:"Dianthus / Pinks", emoji:"🌸", loc:"outdoor", freq:"Morning — every 2-3 days at the base, try not to wet the flowers.", days:2, trimDays:5,
    trim:"Deadhead constantly — snip every faded bloom down to the next bud or leaf. Lots of spent blooms right now; do a full pass. This is the #1 thing that keeps it flowering all summer." },
  { id:"daisy", light:"☀️ Full sun–part shade", waterChip:"💧 every 2 days — consistent", harvestChip:"✂️ deadhead weekly",     name:"Daisy",            emoji:"🌼", loc:"outdoor", freq:"Morning — every 2 days, needs consistency. Make sure it is not sitting in water — the nursery basket inside the pot traps moisture.", days:2, trimDays:7,
    trim:"Deadhead spent flowers at the base of the stem and remove yellow/brown leaves. To fix the ongoing leaf stress, repot into the terra cotta directly with proper drainage." },
  { id:"candytuft", light:"☀️ Full sun", waterChip:"💧 every 3–4 days — drought-tolerant", harvestChip:"✂️ shear once after bloom", name:"Candytuft",        emoji:"🌾", loc:"outdoor", freq:"Morning — every 3-4 days, fairly drought tolerant.", days:3, trimDays:30,
    trim:"Spring bloom is finishing and it is getting leggy — shear the whole plant back by about a third now to keep it compact and trigger a second flush." }];

const PLANT_INFO = {
  // philodendron photo: "Philodendron scandens subsp oxycardium2.jpg" by KENPEI, Wikimedia Commons, CC BY-SA 3.0 (cropped/optimized) — replaced the wrong 6/2 photo (archived 6/6)
  philodendron: { fact:"Those heart-shaped leaves can trail several feet indoors — in the wild it climbs tree trunks toward the light.", photo:"images/philodendron_20260606.jpg" },
  ivy:          { fact:"Ivy clings to almost any surface using tiny root-like 'holdfasts' that secrete a natural glue.", photo:"images/ivy_20260531.jpg" },
  fittonia:     { photo:"images/fittonia_20260531.jpg", fact:"Called the 'nerve plant' for its vein-like patterns — it dramatically faints when thirsty, then perks back up after a drink. In bark mulch, check it every 2 days — it dries faster than soil." },
  croton:       { photo:"images/croton_20260531.jpg", fact:"Croton leaves change color with light: more sun means brighter reds, oranges, and yellows." },
  jade:         { fact:"A succulent that can live for decades — jade is widely seen as a symbol of good luck and prosperity.", photo:"images/jade_20260531.jpg" },
  basil1:       { fact:"Basil is in the mint family, and pinching it makes it bushier — the more you harvest, the more it grows.", photo:"images/basil1_20260531.jpg" },
  basil2:       { fact:"Ancient cultures saw basil as a symbol of love and protection; today it's the heart of pesto.", photo:"images/basil2_20260531.jpg" },
  parsley:      { fact:"Parsley is biennial — leaves the first year, flowers the second — and it's loaded with vitamin K.", photo:"images/parsley_20260531.jpg" },
  mint:         { fact:"Peppermint is a natural hybrid of watermint and spearmint, and it spreads so fast it's best kept potted.", photo:"images/mint_20260606.jpg" },
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
  mint:{when:"🌱 Recovering — new growth Jun 6; keep evenly moist, it's coming back. Gentle morning water, never soggy.",thirst:"A water-lover that wilts then bounces back in hours. Now that fresh shoots are up, even moisture beats the old drought-hold — the HOLD is over."},
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
  { id:"r_zoey_onepot", name:"Zoey's One-Pot — Slow-Cooker Turkey & Sweet Potato", emoji:"🐕", dog:true,
    time:"15 min prep · 4 hrs slow cooker", difficulty:"Easy", servings:"~10-day batch", tags:["dog"],
    blurb:"The pattern home-cooking dog owners actually stick with: ONE slow-cooker batch — dump, cook, portion, freeze. Built for Zoey: lean turkey (herding mixes gain weight easily), sardines for 8-year-old joints, whole-foods only.",
    ingredients:[
      "3 lb lean ground turkey (93/7) — lean protein, easy on a senior waistline",
      "1 1/2 cups brown rice, uncooked",
      "1 lb sweet potato, peeled and diced small",
      "3 cups frozen peas and carrots",
      "1 cup green beans or zucchini, chopped — instead of spinach (oxalates are harder on senior kidneys)",
      "4 cups water",
      "2 cans no-salt sardines in water — stirred in AFTER cooking (omega-3s for her joints)",
      "Eggshell calcium — about 1/2 teaspoon per pound of finished food (kitchen-made, see steps)",
      "2 eggs, cracked in for the last 30 minutes (optional, a couple times a week)"
    ],
    steps:[
      "Everything except the sardines and eggshell goes straight in the slow cooker: turkey (break it up), rice, sweet potato, vegetables, water. Stir once.",
      "Cook on HIGH 3 to 4 hours or LOW about 6, until the rice is soft and the turkey is cooked through. Stir halfway if you happen to be around — fine if not.",
      "Off the heat: stir in the mashed sardines and let the pot cool completely.",
      "Eggshell calcium: bake clean, dry shells about 10 minutes at 300°F, grind to a fine powder, stir in about 1/2 teaspoon per pound of food.",
      "Portion about 1 lb (16 oz) per day (she eats ~660 kcal/day): fridge 3 to 4 days, freeze the rest flat in daily portions — thaws overnight, keeps up to 6 months.",
      "Serve slightly warmed. That is the whole job — one pot, about 10 days of food."
    ],
    note:"NEVER: onion, garlic, grapes or raisins, xylitol, chocolate, macadamia, avocado, cooked bones, or added salt. Vet note: Zoey is 8 — baseline weight + senior bloodwork. 🔄 THE TRANSITION (slow, ~1 month — no tracker, no pressure): she's sick of Farmer's Dog, especially the CHICKEN packs, so this works topper-style — cook one small batch, stir a spoonful into each FD meal so she finishes it, and let the ratio drift homemade as the FD shipment runs out. Getting the chicken packs down: 1) warm the food slightly — aroma does the selling; 2) mix chicken packs 50/50 with the beef or pork packs she likes; 3) smash in a sardine or add a small sprinkle of parmesan on top; 4) a drizzle of warm low-sodium broth.", photo:"images/recipe_zoey_onepot.jpg", photoCredit:"Photo: Judgefloro · CC0 · Wikimedia Commons" },
  { id:"r_zoey_beefpot", name:"Zoey's Beef & Pumpkin Pot (rotation variant)", emoji:"🐕", dog:true,
    time:"15 min prep · 4 hrs slow cooker", difficulty:"Easy", servings:"~10-day batch", tags:["dog"],
    blurb:"Same one-pot pattern, different protein for rotation — 90/10 beef with pumpkin or sweet potato. Make this the occasional batch, not the default (beef is the pricey one — see the Finance cost panel).",
    ingredients:[
      "3 lb ground beef, 90/10 lean",
      "1 1/2 cups white rice, uncooked",
      "1 can (15 oz) plain pumpkin (NOT pie filling) — or 1 lb diced sweet potato",
      "3 cups frozen green beans and carrots",
      "4 cups water",
      "2 cans no-salt sardines in water — stirred in AFTER cooking",
      "Eggshell calcium — about 1/2 teaspoon per pound of finished food",
      "2 eggs, cracked in for the last 30 minutes (optional)"
    ],
    steps:[
      "Beef (broken up), rice, pumpkin or sweet potato, vegetables, water into the slow cooker. Stir once.",
      "HIGH 3 to 4 hours or LOW about 6. Skim pooled fat if the batch looks greasy — 90/10 usually doesn't need it.",
      "Off the heat: stir in the mashed sardines; cool completely.",
      "Stir in eggshell calcium, about 1/2 teaspoon per pound of food.",
      "Portion about 1 lb (16 oz) per day: fridge 3 to 4 days, freeze the rest in daily portions.",
      "Serve slightly warmed."
    ],
    note:"Same rules and transition plan as the One-Pot (see Zoey's One-Pot for the full topper-style transition + picky-chicken-pack tips). Beef batches run ~$66 vs ~$39 — keep this the occasional rotation.", photo:"images/recipe_zoey_beefpot.jpg", photoCredit:"Photo: Judgefloro · CC0 · Wikimedia Commons" }
];

// ═══════════════════════════════════════════════════════════════
// 💰 FINANCE — source: home-and-garden-project/FINANCE_STATE.md (Jun 5 2026)
// EDIT amounts / bills / debts HERE. Balance history lives in Firebase (fin.*).
// Privacy rule: last-4 labels only — never account or routing numbers.
// ═══════════════════════════════════════════════════════════════
// ── 🔔 IN-APP REMINDERS — surface on the TODAY tab (date===today) AND on the TIMELINE (on their dates).
// Done-state lives in `laundry` (NOT here): one-date => "rem-"+id ; standing => "rem-"+id (no date).
// HARD RULE: every money reminder carries an `account` and the app DISPLAYS it. (added Jun 8 2026)
const REMINDERS = [
  { id:"rem_carwash_crunchy", date:"2026-06-11", emoji:"🔁", text:"Verify Super Star Car Wash ($24) + Crunchyroll ($15.18) didn't recharge", account:"Capital One 360 checking" },
  { id:"rem_carwash_verify", date:"2026-06-13", emoji:"🫧", text:"Check that Super Star Car Wash actually got cancelled (no $24 charge)", account:"Capital One 360 checking" },
  { id:"rem_gp_play",         date:"2026-06-14", emoji:"🎮", text:"Play Game Pass games before it's gone (cancels Jun 15, renews 16) — Game Pass $31.11", account:"Capital One checking" },
  { id:"rem_gp_cancel",       date:"2026-06-15", emoji:"🎮", text:"Cancel Xbox Game Pass ($31.11)", account:"Capital One checking" },
  { id:"rem_uberone",         date:"2026-06-15", emoji:"🚗", text:"Verify Uber One ($9.99) didn't recharge after cancelling", account:"Capital One checking" },
  { id:"rem_gp_verify",       date:"2026-06-17", emoji:"✅", text:"Verify Game Pass actually cancelled — no $31.11 renewal after Jun 16", account:"Capital One checking" },
  { id:"rem_disney_cancel",   date:"2026-06-18", emoji:"🏰", text:"Cancel Disney+ ($21.69)", account:"Merrick card •4735" },
  { id:"rem_disney_verify",   date:"2026-06-19", emoji:"✅", text:"Verify Disney+ cancelled", account:"Merrick •4735" },
  { id:"rem_bill_cluster_park", date:"2026-06-18", emoji:"💧", text:"Park ~$364 for the bill cluster (Xcel ~$133 · Denver Water $40 · Student loan $191) — don't touch until Xcel, water & student loan autopay clear." },
  { id:"rem_petco_ammonia",   standing:true,     emoji:"🦐", text:"Petco: pick up aquarium ammonia tester (Seachem badge or API drops) for the shrimp tank" },
  { id:"rem_thyme_plant",     standing:true,     emoji:"🌿", text:"Get a thyme plant" }
];

// ── 🚙 DMV — daily reminder to call for an earlier cancellation slot, through the appointment date.
// Appt defaults to Jun 25, editable in-app via laundry["dmv-appt"]; the daily reminder retires once
// todayKey() passes the appointment, and the appointment shows on the TIMELINE. (added Jun 8 2026)
const DMV = { defaultDate:"2026-06-25", text:"Call the DMV to check for an earlier cancellation slot." };

const FINANCE = {
  incomeMonthly: 4503,
  outflowMonthly: 4827,
  paydayAnchor: "2026-06-04",   // biweekly Thursdays from here
  accounts: [
    { id:"checking", name:"Capital One 360 Checking", emoji:"🏦", start:1901.08, asOf:"2026-04-30", note:"routinely dips near $0 before payday", pending:"$215.05 Farmer's Dog charge pending → effectively ~$108" },
    { id:"savings",  name:"Capital One 360 Savings",  emoji:"🌱", start:0.16,    asOf:"2026-04-30", note:"this is where the $500 buffer grows" }
  ],
  bills: [
    { id:"rent",        due:"1st",    sort:1,  label:"🏠 Rent — INCO (Zelle)",       amt:2175.00, note:"grace to the 4th · June: paid Jun 5, 1 day late — late fee TBD ⚠️" },
    { id:"progressive", due:"~2nd",   sort:2,  label:"🚗 Progressive auto insurance", amt:466.82,  note:"recently lowered — new amount TBD" },
    { id:"xcel",        due:"~6th",   sort:6,  label:"⚡ Xcel Energy",                amt:253,     note:"varies $219–288 · June: $133.16 ✓" },
    { id:"water",       due:"~6th",   sort:6,  label:"💧 Denver Water",               amt:40 },
    { id:"studentloan", due:"~6th",   sort:6,  label:"🎓 Student loan — Dept of Ed",  amt:190.54,  note:"ask about income-driven repayment" },
    { id:"smartstart1", due:"7th",    sort:7,  label:"🚙 Smart Start — maintenance",   amt:58.69,   note:"temporary — ends within ~a year" },
    { id:"nissan",      due:"~15th",  sort:15, label:"🚗 Nissan auto loan",           amt:200.00 },
    { id:"irs",         due:"~15th",  sort:15, label:"🏛️ IRS payment plan",          amt:50.00 },
    { id:"lendmark",    due:"~16th",  sort:16, label:"🏦 Lendmark loan",              amt:177.71,  note:"APR unknown — find out" },
    { id:"smartstart2", due:"21st",   sort:21, label:"🚙 Smart Start — lease",         amt:58.69 },
    { id:"xfinity",     due:"~28th",  sort:28, label:"📡 Xfinity internet",           amt:134.76,  note:"retention call — target $70–90" },
    { id:"healing",     due:"weekly", sort:29, label:"🧠 My Healing Space",           amt:100,     note:"~$25/wk · temporary — ends within ~a year" },
    { id:"cardmins",    due:"spread", sort:30, label:"💳 Card minimums (5 cards)",    amt:351,     note:"autopay every one of them" },
    { id:"family",      due:"spread", sort:31, label:"👨‍👩‍👧 Family repayment",          amt:400,     note:"asking to drop to ~$200/mo" },
    { id:"mint",        due:"yearly", sort:32, label:"📱 Mint Mobile (annual)",       amt:30,      note:"annual phone plan — confirm amount (not in statements)" }
  ],
  debts: [   // snowball order — smallest card first; tap a balance in the app to update it
    { id:"c6605",    label:"Cap One Quicksilver •6605", start:489.59,  min:25,     apr:"28.24%", card:true,  note:"snowball target — pay this one first" },
    { id:"c26529",   label:"Credit One •26529",         start:1003.97, min:51,     apr:"~30%",   card:true,  note:"annual-fee card — close AFTER payoff" },
    { id:"c4615",    label:"Credit One •4615",          start:1157.83, min:58,     apr:"~30%",   card:true,  note:"over limit — close AFTER payoff" },
    { id:"c1320",    label:"Cap One Quicksilver •1320", start:1522.50, min:130,    apr:"28.99%", card:true,  note:"autopay now on (had a $29 past-due fee)" },
    { id:"merrick",  label:"Merrick Bank •4735",        start:2236.74, min:87,     apr:"~30%",   card:true,  note:"$4/mo fee" },
    { id:"savor",    label:"Cap One SAVOR (new)",       start:0,       min:0,      apr:"",       card:true,  keepZero:true, note:"keep current — autopay on" },
    { id:"famloan",  label:"Family loan",               start:10000,   min:400,    apr:"0%",     card:false, note:"0% — includes +$700 Zelle borrowed Jun 6 for rent; cards first, but never go quiet on family" },
    { id:"nissanL",  label:"Nissan auto loan",          start:null,    min:200,    apr:"?",      card:false, note:"payoff unknown" },
    { id:"lendmarkL",label:"Lendmark Financial",        start:null,    min:177.71, apr:"?",      card:false, note:"balance + APR unknown" },
    { id:"studentL", label:"Student loans",             start:null,    min:190.54, apr:"?",      card:false, note:"total + servicer unknown" },
    { id:"irsL",     label:"IRS payment plan",          start:null,    min:50,     apr:"?",      card:false, note:"total owed unknown" }
  ],
  cancels: [  // pending cancellations — check one off ONLY once it is verified gone on a statement
    { id:"farmersdog", label:"The Farmer's Dog", amt:215.05, note:"cancel after the incoming shipment is used up + the 12-day transition — realistically ~6 weeks out 🐕" },
    { id:"chatgpt",   label:"ChatGPT",                 amt:20.00 },
    { id:"gamepass",  label:"Xbox Game Pass",          amt:31.11 },
    { id:"disney",    label:"Disney+",                 amt:21.69 },
    { id:"crunchy",   label:"Crunchyroll",             amt:15.18 },
    { id:"epoch",     label:"Epoch.com",               amt:14.95, note:"bills ~23rd — last seen Apr 23" },
    { id:"everai",    label:"EverAI",                  amt:12.99, note:"last seen Mar 23 — likely already gone" },
    { id:"uberone",   label:"Uber One",                amt:9.99 },
    { id:"dashpass",  label:"DoorDash DashPass",       amt:9.99 },
    { id:"carwash",   label:"Super Star Car Wash",      amt:24.00 }
  ],
  cancelPending: "Also: verify Amazon Fresh (no charge seen Mar–May) · Amazon Prime free trial bills ~Jul 5 — cancel by ~Jul 2.",
  keeping: "Keeping on purpose: Claude Max $100/mo · Spotify $14.18 · Mint Mobile (annual — confirm amount) · My Healing Space.",
  // ── ✅ MASTER MONEY TO-DOS — prioritized tiers (audit finalized Jun 8 2026). Single source of "done": fin.todoDone[id]; 📞 Mondays REFERENCES this via finTaskDone. showFrom = date-gate · steps[] = sub-list · info:true = display-only tier · footer = muted note under a tier. ──
  todosSeed: [
    { tier:"🔴 Do first", col:"#E0506A", items:[
      { id:"ft_latefee", label:"📞 Property-management late-fee call — Monday (no answer Fri; ask the fee + a first-time waive)" },
      { id:"ft_fresh",   label:"🛒 Cancel Amazon Fresh", note:"No Fresh charge found in your statements — cancel it anyway, per your call." },
      { id:"ft_prime",   label:"📦 Cancel the Amazon Prime trial before it bills ~Jul 5", showFrom:"2026-06-30", deadline:"2026-07-05", note:"Hidden until Jun 30 so it surfaces right when it matters. (Your Jul 2 reminder still fires separately.)" }
    ]},
    { tier:"🟠 Cancel list (~$144/mo)", col:"#FB923C", footer:"✅ Confirmed gone — no recent charge: ChatGPT · DoorDash DashPass · EverAI · Epoch.com AIPX · Earth Breeze.", items:[
      { id:"ft_gamepass",  label:"🎮 Cancel Xbox Game Pass — $31.11" },
      { id:"ft_carwash",   label:"🫧 Cancel Super Star Car Wash — $24.00" },
      { id:"ft_disney",    label:"🏰 Cancel Disney+ — $21.69" },
      { id:"ft_crunchy",   label:"🍥 Cancel Crunchyroll — $15.18" },
      { id:"ft_uberone",   label:"🚗 Cancel Uber One — $9.99", note:"DashPass already dropped off — Uber One is the last delivery sub; cut it too unless you actually use delivery (keep at most one)." },
      { id:"ft_claudepro", label:"💳 Cancel leftover Claude Pro — billed twice ($21.03 ×2), it's the OLD plan still charging on top of Claude Max" },
      { id:"ft_psn",       label:"🎮 Cancel PlayStation Plus (annual, ~$177.18)" }
    ]},
    { tier:"🟡 Big structural savers", col:"#FBBF24", items:[
      { id:"ft_xfinity",   label:"📡 Xfinity retention call — target $135 → $70–90 (AT&T Internet Air is $47)" },
      { id:"ft_family",    label:"👨‍👩‍👧 Renegotiate the family loan — $400/mo → ~$200 while stabilizing" },
      { id:"ft_zoeyfood",  label:"🐕 Buy Zoey's homemade-food ingredients when the Farmer's Dog shipment runs low (~4 wks) — prerequisite for the cancel below" },
      { id:"ft_farmersdog",label:"🐕 Cancel The Farmer's Dog after Zoey's transition (~$215/mo, ~6 wks out)" },
      { id:"ft_cardreset", label:"💳 Credit-card overhaul plan — ditch the bad cards + get one good one WITHOUT tanking your score", steps:[
        "Keep the old paid-off cards OPEN — closing them hurts your credit age + utilization, which lowers your score",
        "Pay balances down first to drop utilization (snowball •6605 $490, then up the list)",
        "Once utilization falls and your score recovers, apply for ONE good card — a 0% APR balance-transfer card to escape the ~29% interest, or a low-APR / solid-rewards card",
        "Only ONE application at a time — each hard inquiry dings your score",
        "Don't do the card-number reset — it would break the autopays you WANT"
      ]},
      { id:"ft_po",        label:"🧾 Figure out payments for PO" },
      { id:"ft_affirm",    label:"💳 Figure out Affirm (Amazon) payments", note:"Buy-now-pay-later loan, not a card subscription — that's why it slipped past the audit." },
      { id:"ft_total_nissan",   label:"🔢 Find the total balance owed on the Nissan auto loan" },
      { id:"ft_total_lendmark", label:"🔢 Find the total balance owed on Lendmark" },
      { id:"ft_total_student",  label:"🔢 Find the total balance owed on student loans" },
      { id:"ft_total_irs",      label:"🔢 Find the total balance owed on the IRS payment plan" },
      { id:"ft_total_family",   label:"🔢 Find the total balance owed on the family loan" }
    ]},
    { tier:"🛟 Overdraft guard — move these due dates past payday", col:"#FBBF24", footer:"Each of these lands before the covering paycheck — a planned-late date beats a $35 bounce. Next payday: Thu Jun 18.", items:[
      { id:"ft_move_progressive", label:"📞 Call Progressive to move the due date to just after payday (Thu the 18th / Fri)" },
      { id:"ft_move_nissan",      label:"📞 Call Nissan auto loan to move the due date to just after payday (Thu the 18th / Fri)" },
      { id:"ft_move_irs",         label:"📞 Call the IRS payment plan to move the due date to just after payday (Thu the 18th / Fri)" },
      { id:"ft_move_lendmark",    label:"📞 Call Lendmark to move the due date to just after payday (Thu the 18th / Fri)" },
      { id:"ft_move_xfinity",     label:"📞 Ask Xfinity to move the due date to just after payday (Thu the 18th / Fri)" }
    ]},
    { tier:"🟢 Foundation", col:"#4AD490", items:[
      { id:"ft_buffer",   label:"🛟 Build the $500 starter buffer (Goal #1 on 📊 Overview)" },
      { id:"ft_snowball", label:"❄️ After the buffer: attack card •6605 ($490) — the snowball target" }
    ]},
    { tier:"Also open", col:"#7EB8F0", items:[
      { id:"ft_progress", label:"🚗 Get the new (lower) Progressive amount" },
      { id:"ft_autopay",  label:"📅 Realign autopay dates so nothing drafts an empty account" }
    ]},
    { tier:"📅 Track — annual renewals", col:"#A78BFA", info:true, items:[
      { id:"trk_mint", label:"📱 Mint Mobile — annual phone plan (keep)", note:"Confirm the amount — it's not in the statements yet." }
    ]}
  ],
  // ── 📞 FINANCIAL MONDAYS — paced queue, ONE item per Monday (added Jun 6 2026). Order: time-sensitive calls first, then cancels/verifications one a week. Dates assign dynamically: first open item = next Monday; checking one off advances the rest. Done state: fin.monday[id]. ──
  mondays: [
    { id:"mon_latefee",   label:"📞 Property management — rent late fee follow-up", note:"No answer Friday — Monday morning is the retry. Ask what the fee is, and whether they'll waive it (first time, rent was paid Jun 5)." },
    { id:"mon_xfinity",   label:"📞 Xfinity retention call — get $135 down to ~$70–90", note:"Say 'cancel service' at the prompts to reach Retention. Leverage: AT&T Internet Air is $47/mo at your address. Full script on the ✅ To-dos sub-tab." },
    { id:"mon_family",    label:"👨‍👩‍👧 Family payment renegotiation — $400/mo → ~$200", note:"One honest conversation: stabilizing now, back up when the gap closes." },
    { id:"mon_amazon",    label:"📦 Cancel the Amazon Prime trial before it bills", note:"Prime bills ~Jul 5 if you miss it. Tracked on your ✅ To-dos list (it surfaces there Jun 30).", deadline:"2026-07-05" },
    { id:"mon_gamepass",  label:"🎮 Cancel Xbox Game Pass — $31.11/mo" },
    { id:"mon_farmersdog",label:"🐕 Cancel The Farmer's Dog — $215.05/mo", note:"By now the shipment is nearly used up and Zoey's on the one-pot. The big domino falls. 🎉" },
    { id:"mon_disney",    label:"🏰 Cancel Disney+ — $21.69/mo" },
    { id:"mon_crunchy",   label:"🍥 Cancel Crunchyroll — $15.18/mo" },
    { id:"mon_uberone",   label:"🚗 Cancel Uber One — $9.99/mo" },
    { id:"mon_carwash",   label:"🫧 Cancel Super Star Car Wash — $24.00/mo" },
    { id:"mon_sweep",     label:"🧾 Final sweep — every cancel-list item checked off against a real statement", note:"When this one's done, the gap card on 📊 Overview should be showing the full swing." }
  ],
  advice: [
    { t:"$190 of filament is inventory, not income", b:"The hydro and aquarium prints are exactly the functional niche that sells on Etsy and locally. List 2–3 finished prints (it's on the Print → Ideas list); the day one ships, those supplies start paying for themselves. The Savor card carried them — keep its autopay on so it never falls behind." },
    { t:"Savor is the working card — don't let it fall behind", b:"It's your newest card and the one you actually use. The single rule that matters: keep autopay on (at least the minimum) so a payment never slips and dents your history. Used and paid on time, it quietly builds credit." },
    { t:"The Farmer's Dog is the big domino", b:"$215.05 a month. The plan: feed through the incoming 1+ month shipment, buy the homemade ingredients, run the 12-day switch — so the cancel lands ~6 weeks out. That's honest, not slow: the shipment is already paid for, so using it up IS the money move." },
    { t:"Rent first, every first paycheck", b:"Rent is $2,175 — almost a whole paycheck. The day a check lands, set the rent money aside before anything else touches it. The rest of the month gets simpler instantly." },
    { t:"The $500 buffer comes before extra debt payments", b:"With the cards maxed, any surprise becomes new debt. Even $50 per paycheck builds it in about 5 months — and every dollar in the buffer is a surprise that never reaches a card." },
    { t:"Smallest card first — •6605 is almost gone", b:"It is only about $490. Clear it, then roll its $25 minimum onto the next card. The snowball works because finishing things feels good — use that." },
    { t:"Canceled ≠ stopped", b:"Subscriptions love to keep charging after you cancel. Only check one off the Cancel List when you SEE it missing from a statement. That is when the savings become real." },
    { t:"Stress is the trigger, delivery is the outlet", b:"Eating out ran ~$320/mo — your single biggest flexible lever. Feeling the urge? Ten-minute pause, glass of water, then decide. Half the time the urge passes on its own." },
    { t:"Autopay the minimums — all five cards", b:"One month of fees ($29 late + $28 returned) was $57 of pure waste. Autopay makes that impossible. Set it once and forget it." },
    { t:"Never let an autopay hit an empty account", b:"Move the due date instead — a planned-late bill beats a $35 bounce every time. The ~Jun 6 cluster (Xcel + water + student loan) lands right after payday; keep that money parked until they clear." },
    { t:"Family at 0% waits — but talk to them", b:"The math says cards first (they are at ~29–30%). But never go quiet on family. The $400 → $200 ask is a conversation, not a confession — they would rather hear from you." },
    { t:"Vape cap: $40", b:"Down from ~$60. A cap you actually keep beats a quit that does not stick — and it is $20/mo toward the buffer." },
    { t:"Groceries beat delivery, every time", b:"You already spend ~$300 on groceries — the food is in the house. A days-without-delivery streak works exactly like the Call DT streak does. Start one." },
    { t:"One number is the whole game", b:"Income minus committed bills — it is the big number at the top of this tab. When it turns green you are winning. Everything else on this page exists to move that one number." },
    { t:"The squeeze is temporary", b:"Smart Start (~$117) and Healing Space (~$100) both end within about a year — that is $217/mo coming back on its own. You are not stuck; you are in a tunnel with a visible exit." },
    { t:"Say the magic words on the Xfinity call", b:"\"AT&T Internet Air is $47 at my address.\" That is the leverage line. Target $70–90 and keep cable for gaming ping. Five minutes could be worth $50+ every month." },
    { t:"Keep the cards open until they are paid", b:"Closing cards early hurts more than it helps. The two annual-fee Credit One cards DO get closed — but only after their balances hit zero." },
    { t:"Do not budget perfectly — budget simply", b:"First budget ever? Perfect is the enemy. Update balances when you think of it, check bills off as they are paid, glance at the gap. That is the whole job — you are already doing it." }
  ]
};
