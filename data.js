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
const ALMANAC_MORNING = [
  { id:"bed",           emoji:"🛏️", label:"Make the bed",                              cue:"Start here" },
  { id:"outdoor-water", emoji:"🌱", label:"Check outdoor plants due today; water only if needed", cue:"Outside" },
  { id:"health",        emoji:"🧘", label:"Do the health coach activity",                 cue:"After watering" },
  { id:"breakfast",     emoji:"🍳", label:"Make and eat breakfast",                      cue:"After movement" },
  { id:"walk",          emoji:"🐕", label:"Walk Zoey",                                   cue:"After breakfast" },
  { id:"work",          emoji:"💼", label:"Prepare for work and begin paid work",         cue:"8:00 AM", availableAt:480 }
];

const RHYTHM = {
  wake:      "8:00 AM",
  waterWake: "8:00 AM",        // water before anything else
  breakfast: "8:30 AM",        // protein within 60 minutes of waking
  lunch:     "12:00 PM",
  hydration: "3:30 PM",        // afternoon water / electrolyte checkpoint
  dinner:    "7:00 PM",        // aim to sit down here...
  dinnerBy:  "8:00 PM",        // ...hard rule: eaten BY this time
  workout:   "5:30 PM",        // only if fed + hydrated
  windDown:  "10:00 PM",       // phone goes to the other room, screens off
  reading:   "10:00–11:00 PM", // the reading hour fills the no-screen block
  lightsOut: "11:00 PM",
};

// ── 🍽️ MEAL ANCHORS — "eat on a clock": three daily anchors that NAG on the Today tab.
// `min` = minutes-since-midnight the anchor goes "due" (pins to the top); +45 min = "overdue" (gentle escalate).
// pills:true bundles the Litfulo+vitamins check onto breakfast ("eat → pills" = one trigger). Tone stays supportive. (added Jun 9 2026)
const MEAL_ANCHORS = [
  { id:"breakfast", emoji:"🍳", label:"Protein breakfast", at:"8:30 AM",  min:510,  upOrder:320,  pills:true, win:"8–9 AM",  winStart:480,  winEnd:540,  cue:"protein first: yogurt, eggs, shake, cottage cheese, or leftovers all count.", passed:"Breakfast slipped — rescue it with protein now. No guilt, just fuel. 🌱" },
  { id:"lunch",     emoji:"🥗", label:"Protein lunch",     at:"12:00 PM", min:720,  upOrder:700,              win:"12–1 PM", winStart:720,  winEnd:780,  cue:"step away from the desk before the crash; quick protein is the win.", passed:"Lunch window passed — eat protein now so dinner does not become a rescue mission." },
  { id:"dinner",    emoji:"🍽️", label:"Protein dinner",    at:"7:00 PM",  min:1140, upOrder:1080, by:"8:00 PM", win:"6–8 PM",  winStart:1080, winEnd:1200, cue:"eat before exhaustion; warm is nice, easy is allowed.", passed:"Dinner slipped — choose easy protein + carbs, then wind down. No cooking project. 🌙" }
];

const HEALTH_COACH = {
  proteinRange: "130–170 g/day eventually; right now the win is 3 protein eating events.",
  hydrationRange: "2–3 liters/day to start, plus extra after caffeine, exercise, heat, outside time, or depletion.",
  rescueMeals: [
    "Greek yogurt + granola/fruit",
    "Protein shake + banana",
    "Eggs + toast",
    "Cottage cheese + crackers/fruit",
    "Turkey/chicken sandwich",
    "Peanut butter toast + milk",
    "Leftovers microwaved",
    "Cereal + milk + Greek yogurt",
    "Rice/pasta/ramen + eggs or meat",
    "Frozen meal plus extra protein"
  ],
  workouts: {
    strengthDays: [1,3,5],
    strengthTitle: "Month 1 dumbbell strength",
    strength: [
      "Goblet squat or supported split squat",
      "Dumbbell floor press or incline pushup",
      "One-arm dumbbell row",
      "Dumbbell Romanian deadlift",
      "Farmer carry",
      "Dead bug, side plank, or bird dog"
    ],
    recoveryTitle: "Light movement / mobility",
    recovery: [
      "Walk 10–30 minutes",
      "Shoulder circles + thoracic rotations",
      "Hip flexor stretch + hamstring stretch",
      "Easy breathing, no max-effort work"
    ],
    month1: {
      startDate: "2026-07-31",
      rules: [
        "First workout back: one easy round only, RPE 4-5, then stop while it still feels easy.",
        "No failure, max reps, or soreness hunting.",
        "Food, water, sleep, and rescue mode override the workout schedule.",
        "No THC before workouts while form is being rebuilt.",
        "Jaw exerciser rides with strength days only: easiest level first, slow controlled reps, no pain."
      ],
      jaw: {
        title: "Jaw exerciser finisher",
        schedule: "Strength days only (Mon / Wed / Fri)",
        text: "Easiest level: 2 sets of 12 slow controlled bites. Rest 30-60 seconds between sets. Stay on the easiest level about 4 weeks, then move up only when it feels easy and pain-free.",
        cautions: [
          "Do it after lifting or seated during long rests; do not chew while bracing under load.",
          "Stop for clicking, jaw pain, headache, tooth pain, or gum pain.",
          "Skip if TMJ issues, gum disease, braces, or recent dental work are active."
        ]
      },
      rpe: ["Week 1: RPE 5", "Week 2: RPE 6", "Week 3: RPE 6-7", "Week 4: RPE 6-7, Friday easier"],
      schedule: [
        ["Monday", "Strength A"],
        ["Tuesday", "Walk + mobility"],
        ["Wednesday", "Strength B"],
        ["Thursday", "Walk + mobility"],
        ["Friday", "Strength A or C"],
        ["Saturday", "Optional longer walk"],
        ["Sunday", "Recovery + tiny reset"]
      ],
      strengthA: ["Goblet Squat", "Dumbbell Floor Press", "One-Arm Dumbbell Row", "Dumbbell Romanian Deadlift", "Farmer Carry", "Dead Bug"],
      strengthB: ["Chair Squat or Reverse Lunge Supported", "Standing Dumbbell Overhead Press", "Supported One-Arm Dumbbell Row", "Glute Bridge", "Dumbbell Curl", "Side Plank"],
      strengthC: ["Split Squat Supported or Goblet Squat", "Incline Pushup", "Dumbbell Romanian Deadlift", "One-Arm Dumbbell Row", "Farmer Carry", "Bird Dog"]
    }
  }
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
  mixing_supplies:{ room:"priority", label:"Buy: bottles ×2 (same as already have), mixing bottle, funnel", level:"easy" },
  claude_rules:   { room:"priority", label:"Have Claude rebuild Claude's rules in settings menu", level:"easy", note:"Refresh/rewrite Claude's custom rules in the settings menu." },
  auth_lock:      { room:"priority", label:"🔒 Big project: real app lock — Firebase Auth + locked database rules", level:"hard", note:"The password curtain on the app is cosmetic — the page AND the Firebase data are still publicly readable by anyone with the URL. The real fix: Firebase Authentication sign-in + database security rules locked to that account. Curtain password lives in CURTAIN_PASSWORD at the top of index.html." },
  rx_setup:       { room:"priority", label:"Set up esomeprazole at King Soopers (use GoodRx)", level:"easy", note:"Open GoodRx, search esomeprazole for the King Soopers pharmacy, grab the coupon price, and send or transfer the prescription there. Show the GoodRx coupon at the counter on pickup." },
  measure_printer:{ room:"office",   label:"Measure the 3D printer — width, depth, height + room for spools and cables", level:"easy", note:"Do this before buying a desk so you know exactly what fits." },
  find_desk:      { room:"priority", label:"Find a cheap sturdy desk — Marketplace, Craigslist, OfferUp", level:"easy", note:"Must be sturdy — needs to hold the 3D printer. Check FB Marketplace first — people offload office furniture constantly." },
  sv06_sock:      { room:"priority", label:"🧤 Order SV06 silicone sock (2-pack) — Sovol SV06 hotend sock", level:"easy" },
  sv06_fan:       { room:"priority", label:"🌬️ Order replacement SV06 Plus fan (24V) — the screamy one: 4010 = hotend heatsink fan, 4020 = part-cooling blower; replace whichever's loud (or both)", level:"easy" },
  xfinity_call:   { room:"priority", label:"Call Xfinity Retention — lower the $135 bill", level:"easy", note:"Goal: get $135/mo down to ~$70–90 while KEEPING Xfinity (best gaming latency). Leverage: CenturyLink Simply Unlimited is ~$55/mo at your address (real published price — you're NOT switching, it's pure negotiation). You're a flight risk they'll want to keep. Call (don't chat), reach Retention, and never take the first offer.", steps:["Call 1-800-XFINITY (1-800-934-6489). At the prompts, say 'cancel service' to get routed to Retention, not regular support.","Open friendly but firm: 'My bill jumped to $135 and that's too high — I'm thinking about switching.'","Drop the leverage: 'CenturyLink Simply Unlimited is $55 a month at my address. I'd rather stay for the lower latency, but not at this price.'","Ask directly: 'What promotions or loyalty credits can you apply to get me near $70?'","Don't accept the first number — pause, then ask 'Is that the best you can do?'","Keep the SAME internet plan — don't let them add TV/phone/lines to 'save' money.","If they won't budge, ask for the Retention/Loyalty department, or say you'd like to start the cancellation.","Get it in writing: the new monthly rate, contract length, any one-time credits, plus the rep's name/ID — ask for an email confirmation.","No luck? Hang up and call back later for a different rep, or retry near your billing date."] },
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
  sort_plants:    { room:"garden", label:"Move Fittonia fully indoors", level:"easy" },
  parse_harv:     { room:"garden", label:"Harvest parsley — outer stems at the base, leave inner growth", level:"easy" },
  herb_pinch2:    { room:"garden", label:"Pinch basil & mint again — remove any flower buds", level:"easy" },
  dill_check:     { room:"garden", label:"Check dill for flower heads — cut to extend leaf production", level:"easy" },
  gnat_check:     { room:"garden", label:"Check sticky traps — are gnat numbers dropping?", level:"easy" },
  gnat_nuke:      { room:"garden", label:"🪴 REPOT DAY — all 3 indoor plants, SAME day (the gnat reset). Supply run first: indoor potting mix · cactus mix · perlite · orchid bark · coco coir. Then bare-root each plant, scrub pots, fresh custom mix, gravel cap. Method + per-plant mixes: Plants → Care", level:"easy" },
  gnat_sand:      { room:"garden", label:"🦟 Post-repot insurance: water any indoor pot that is due with BTI tea + swap sticky traps if they are getting crowded", level:"easy" },
  gnat_check2:    { room:"garden", label:"🦟 Victory check — traps stayed clean ~2 weeks? War over. Any pot still hatching gnats: redo just that one repot", level:"easy" },
  basil_beetles:  { room:"garden", label:"Protect both basil plants from Japanese beetles", level:"easy", note:"Tap adults into a cup of soapy water now, at dusk, and again in the cool morning. A breathable row cover is optional, not required; never wrap basil in plastic or solid cloth in the heat. Skip Japanese beetle traps. Do not use the recorded Captain Jack's Deadbug Brew for this pest on basil, and never feed treated beetles to the spiders." },
  gard_fertilize: { room:"garden", label:"Fertilize tomatoes, jalapeño, and strawberry", level:"easy" },
  gard_mulch:     { room:"garden", label:"Add mulch or top dressing to outdoor pots", level:"easy" },
  gard_repot:     { room:"garden", label:"Check for root-bound plants and repot if needed", level:"moderate" },
  heat_shade:     { room:"garden", label:"Create afternoon shade in place for the daily-watered pots", level:"easy", note:"Before the peak heat, shade the single strawberry, multi-plant strawberry with both attached runners, both tomatoes, and both potatoes. Use an umbrella, chair, shade cloth, or cardboard on the west side with an air gap. Do not move or detach the runners." },
  move_stage:     { room:"priority", label:"Set up one moving staging zone", level:"easy", note:"Use one clear area for packed boxes. Label three sections: PACKED, DECISION HOLD, and OPEN LAST. Do not make destination-dependent keep-or-discard decisions yet." },
  move_supplies:  { room:"priority", label:"Gather moving supplies and start a move folder", level:"easy", note:"Boxes, tape, marker, bags, labels, and one folder for lease, IDs, receipts, and moving information. Keep IDs and essential documents accessible." },
  move_decor:     { room:"priority", label:"Pack one labeled box of decor and display items", level:"easy", note:"One box is enough. Pack only obvious nonessentials you would take anywhere; stop after the box is labeled and in the staging zone." },
  move_clothes:   { room:"priority", label:"Pack one labeled box of off-season clothes", level:"easy", note:"Keep current-week clothing accessible. Destination-dependent clothing decisions go into DECISION HOLD." },
  move_books:     { room:"priority", label:"Pack one labeled box of books or media", level:"easy", note:"One box, clearly labeled with room and contents. No forced selling or donating." },
  move_kitchen:   { room:"priority", label:"Pack one labeled box of rarely used kitchen items", level:"easy", note:"Pack extras you will not need before August 31. Leave a small daily cooking kit accessible." },
  move_hobby:     { room:"priority", label:"Pack one labeled box of hobby or office extras", level:"easy", note:"Choose supplies you will not use before the move. Keep work essentials and current projects accessible." },
  move_reset:     { room:"priority", label:"Tolerable-house reset: trash, dishes, laundry, walkway", level:"easy", note:"No deep cleaning. Remove trash, contain dishes and laundry, and clear one safe walking path. Stop when the house feels usable." },
  move_books_aug03:  { room:"priority", label:"Pack one labeled box of books or media", level:"easy", note:"One destination-safe box only. Label the room and contents, then stop." },
  move_kitchen_aug04:{ room:"priority", label:"Pack one labeled box of rarely used kitchen items", level:"easy", note:"Pack only obvious nonessentials you would move anywhere. Keep the daily cooking kit accessible." },
  move_hobby_aug05:  { room:"priority", label:"Pack one labeled box of hobby or office extras", level:"easy", note:"Choose supplies you will not use before the move. Keep work essentials and current projects accessible." },
  move_stage_aug06:  { room:"priority", label:"Restore the moving staging area", level:"easy", note:"Spend ten minutes restoring the labeled PACKED / DECISION HOLD / OPEN LAST sections. Stop when every box has a clear place." },
  move_decor_aug07:  { room:"priority", label:"Pack one labeled box of decor and display items", level:"easy", note:"Pack only obvious nonessentials you would move anywhere. Label the room and contents, then stop." },
  move_reset_aug08:  { room:"priority", label:"Tolerable-house reset: trash, dishes, laundry, walkway", level:"easy", note:"No deep cleaning. Spend ten minutes making the house usable, then stop." },
  move_linens_aug09: { room:"priority", label:"Pack one labeled box of spare linens", level:"easy", note:"Pack spare towels, sheets, or blankets you will not need before moving. Keep one working set accessible." },
  move_checkpoint:{ room:"priority", label:"Mostly-packed checkpoint", level:"moderate", note:"Target: everything except daily essentials, current work gear, plant care, and final-cleaning supplies is packed and labeled by August 17." },
  move_last_week: { room:"priority", label:"Build the final-week essentials kit and pack everything else", level:"moderate", note:"Keep out only seven days of clothes, medicines, toiletries, chargers, basic dishes, documents, pet supplies, plant care, and cleaning supplies." },
  move_final:     { room:"priority", label:"Final pack, trash removal, and clean emptied areas", level:"moderate", note:"Finish open boxes, remove obvious trash, clean only the cleared surfaces and floors, and keep the move-out essentials together." },
  move_out:       { room:"priority", label:"Move-out day: essentials, plants, final sweep, keys", level:"moderate", note:"Load the open-last kit, documents, medicines, valuables, plants, and pet supplies last. Do one final walkthrough and return keys as required." },
};


const SCHEDULE = [
  // ── MOVING · ROLLING NO-REGRET WEEK ────────────────────────────────────────
  { date:"2026-08-03", tasks:["move_books_aug03"],        note:"Pack one destination-safe box of books or media, then stop." },
  { date:"2026-08-04", tasks:["move_kitchen_aug04"],      note:"Pack one labeled box of rarely used kitchen items you would move anywhere. Keep the daily cooking kit accessible." },
  { date:"2026-08-05", tasks:["move_hobby_aug05"],        note:"Pack one labeled box of hobby or office extras you would move anywhere. Keep work essentials and current projects accessible." },
  { date:"2026-08-06", tasks:["move_stage_aug06"],        note:"Spend ten minutes restoring the labeled PACKED / DECISION HOLD / OPEN LAST staging area. Stop when boxes have a clear place." },
  { date:"2026-08-07", tasks:["move_decor_aug07"],        note:"Pack one labeled box of obvious nonessential decor you would move anywhere. Label the room and contents, then stop." },
  { date:"2026-08-08", tasks:["move_reset_aug08"],        note:"Do one ten-minute trash, dishes, laundry, or walkway reset. No deep cleaning; stop when the house feels usable." },
  { date:"2026-08-09", tasks:["move_linens_aug09"],       note:"Pack one labeled box of spare linens you will not need before moving. Keep one working set accessible." },

  // ── MOVING MILESTONES ─────────────────────────────────────────────────────
  { date:"2026-08-17", tasks:["move_checkpoint"],          note:"Mostly packed two weeks before move-out. Decision-hold items can stay unresolved until the destination is known." },
  { date:"2026-08-24", tasks:["move_last_week"],           note:"Switch to the open-last essentials kit and pack everything else that can safely go." },
  { date:"2026-08-30", tasks:["move_final"],               note:"Finish packing and clean only what is already empty." },
  { date:"2026-08-31", tasks:["move_out"],                 note:"Move-out deadline." }];


const PLANTS = [
  // ── INDOOR ────────────────────────────────────────────────────────────────
  { id:"fittonia", light:"🌥️ Bright indirect — no direct sun", waterChip:"💧 every 2–3 days", harvestChip:"🌿 foliage — not harvested",     name:"Fittonia / Nerve Plant",  emoji:"🌱", loc:"indoor", freq:"Every 2-3 days — bark mix dries fast, check top inch. Water before it droops; don't wait for the faint. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water.", days:3, note:"May 31: Leaf edges browning = low humidity stress. Bark mulch media dries much faster than potting mix — check every 2 days. Add a pebble tray with water under the pot for ambient humidity. Keep away from AC vents. New center growth looks healthy — no repot needed yet. Moved from dark office to bright indirect light room May 31 — correct placement. Watch for direct sun rays which will scorch leaves." },
  { id:"croton", light:"☀️ Bright indirect → morning direct", waterChip:"💧 every 5–7 days", harvestChip:"🌿 foliage — not harvested",       name:"Banana Croton",           emoji:"🌴", loc:"indoor", freq:"Every 5-7 days — check top inch, bark mix dries fast. Don't overwater; crotons are drought-tolerant. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water.", days:6, note:"May 31: Banana Croton — narrow yellow-striped leaves, looks like a recent purchase still adjusting. Normal to drop some leaves when moved (don't panic). Needs bright indirect to direct morning light — more light-hungry than Fittonia. Hates cold drafts and temps below 60°F. Same bark mix as Fittonia — check moisture every 3-4 days. No leaf drop yet = good sign." },
  { id:"jade", light:"☀️ 4–6h direct or bright", waterChip:"💧 every ~18 days — dry out fully", harvestChip:"🌿 foliage — not harvested",         name:"Jade Plant",              emoji:"🪨", loc:"indoor", freq:"Succulent — let it dry out completely, then water deeply. Water sparingly. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water.", days:18 },

  // ── GREENHOUSE HERBS ──────────────────────────────────────────────────────
  { id:"basil1", light:"☀️ Full sun 6–8h", waterChip:"💧 check every morning", harvestChip:"✂️ REQUIRED: pinch every 1–2 weeks — keeps it producing · use or preserve what you pinch",   name:"Sweet Basil #1",  emoji:"🌿", loc:"greenhouse", freq:"Check every morning and water at the soil when the top inch starts drying or the leaves just begin to soften. In extreme heat, recheck late afternoon and give a base drink only if the mix is drying — do not wait for a full wilt, and avoid wet foliage overnight.", days:1, overwater:true, trimDays:12,
    trim:"Pinch flower buds the moment you see them. Cut just above a leaf pair, leaving 2-3 sets below. Remove all yellowing lower leaves. Never cut more than ⅓ at once. Every 1-2 weeks." },
  { id:"basil2", light:"☀️ Full sun 6–8h", waterChip:"💧 check every morning", harvestChip:"✂️ REQUIRED: pinch every 1–2 weeks — keeps it producing · use or preserve what you pinch",   name:"Sweet Basil #2",  emoji:"🌿", loc:"greenhouse", freq:"Check every morning and water at the soil when the top inch starts drying or the leaves just begin to soften. In extreme heat, recheck late afternoon and give a base drink only if the mix is drying — do not wait for a full wilt, and avoid wet foliage overnight.", days:1, overwater:true, trimDays:12,
    trim:"Pinch out every flower bud the moment it appears. Cut stems just above a leaf pair so each cut branches into two, and strip off any yellowing lower leaves. Bushier growth means more harvest — never take more than a third at once." },
  { id:"parsley", light:"⛅ Full sun–part shade", waterChip:"💧 every 3–4 days", harvestChip:"✂️ pick as you cook — outer stems first · no schedule",  name:"Curled Parsley",  emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry, every 3-4 days", days:3, trimDays:21,
    trim:"Tending is plant-health only: cut dead or bolted flower stalks at the base and remove yellowing stems. Picking for dinner is separate — outer stems at the base, leave the young inner growth, never more than half. Every ~3 weeks is plenty." },
  { id:"mint", light:"⛅ Part shade ok", waterChip:"💧 every 3 days — evenly moist", harvestChip:"✂️ pick as you cook · pinch tips to bush it out",     name:"Peppermint",      emoji:"🌿", loc:"greenhouse", freq:"Back and bushy — keep evenly moist with a gentle morning drink. The recovery worked.", days:3, overwater:true, trimDays:7,
    trim:"Fully recovered — it's filled in bushy and green. Pinch the tips regularly to keep it dense and snip any leggy or flowering stems. It's harvestable now: pick sprigs as you cook." },
  { id:"dill", light:"☀️ Full sun", waterChip:"💧 every 3 days", harvestChip:"✂️ pick fronds as you cook · REQUIRED: snip flower heads on sight",     name:"Dill",            emoji:"🌿", loc:"greenhouse", freq:"Morning — when top 2 inches dry", days:3, trimDays:7,
    trim:"Snip outer fronds near the base. Cut flower heads to extend leaf production. Once fully flowered it declines — let go to seed if you want seeds for cooking." },
  { id:"rosemary", light:"☀️ Full sun 6–8h", waterChip:"💧 every 7+ days — drought-tolerant", harvestChip:"✂️ snip sprigs as you cook — no schedule", name:"Rosemary",        emoji:"🌿", loc:"greenhouse", freq:"Morning — weekly or less, drought tolerant", days:7, trimDays:30,
    trim:"Only ever trim soft green growth — cutting into the woody brown stems leaves bare gaps that will not releaf. Snip sprigs as you cook, and do light shaping to keep it bushy and upright." },

  // ── OUTDOOR EDIBLES ───────────────────────────────────────────────────────
  { id:"strawberry", light:"☀️ Full sun 6–10h", waterChip:"💧 daily", harvestChip:"🍓 berries forming — pick only when fully red",    name:"Strawberry",         emoji:"🍓", loc:"outdoor", freq:"Daily — single round pot in full sun, so it dries out fast. Water deeply at the base each morning; in a heat wave it may want a second drink in the evening. Keep soil consistently moist while flowering and fruiting.", days:1, trimDays:14,
    trim:"Pinch off runners unless you want new plants (root them into pots). Remove browning/dead outer leaves. White flowers are open now — pinch a few of the earliest for bigger berries on the rest." },
  { id:"strawberry_pot", light:"🌤️ Morning sun · afternoon shade while runners root", waterChip:"💧 daily · check runner pots twice in heat", harvestChip:"🍓 pick only when fully red", name:"Strawberry Pot (multi-plant)", emoji:"🍓", loc:"outdoor", freq:"Daily during the hot, dry stretch — water the mother pot from the top and check every pocket, then check the two small runner pots separately. Give the runner pots a drink when the surface starts to dry; in mid-90s heat check them again in the evening. Keep the mother and runners in morning sun with afternoon shade while they establish.", days:1, trimDays:14,
    note:"Jul 12 — two runners from the multi-plant strawberry are being rooted in temporary pots. They stay on this card rather than becoming separate plants.", trim:"Keep each runner attached to the mother plant and pin its baby crown level against moist soil in the temporary pot. Do not cut the connecting stem until the runner resists a gentle tug and has fresh growth, usually after 2–3 weeks. Extra afternoon shade and steady moisture are appropriate while the two runners root; avoid soggy soil or burying the crown." },
  { id:"tomato", light:"☀️ Full sun 8h", waterChip:"💧 daily — deep & consistent", harvestChip:"🍅 first fruit ripening — pick when fully colored & slightly soft",        name:"Heirloom Tomato",     emoji:"🍅", loc:"outdoor", freq:"Morning at the base — deep & CONSISTENT every day in heat (uneven watering is what causes the catfacing/cracking). Ease off slightly as fruit ripens.", days:1, trimDays:7,
    trim:"Pinch out suckers (the shoots in the V between stem and a branch) weekly. Strip leaves touching the soil. Re-stake or cage it — it is leaning and outgrowing the bamboo. Harvest beefsteaks as they turn deep red and slightly soft. 🌨️ Hail (Jun 1): the storm shredded some leaves — leave the torn ones on for now (they still feed the plant), snip only crushed or hanging bits with a clean cut so disease cannot enter the wound, and keep watering even; it should push fresh growth within a few days." },
  { id:"cherry_tomato", light:"☀️ Full sun", waterChip:"💧 daily", harvestChip:"🍒 every 2–3 days once coloring", name:"Husky Cherry Tomato", emoji:"🍒", loc:"outdoor", freq:"Morning at the base — daily in heat, ease off when ripening to prevent splitting.", days:1, trimDays:10,
    trim:"Compact (determinate) type — do NOT sucker-prune it or you cut your harvest. Just remove leaves touching the soil and yellowing growth. Pick cherries promptly once they blush and it pushes out more clusters. 🌨️ Hail (Jun 1): same storm damage — do not strip the tattered leaves, just remove anything crushed or snapped, then let it recover; determinate plants bounce back fast with steady water." },
  { id:"jalapeno", light:"☀️ Full sun 6–8h", waterChip:"💧 every 2–3 days", harvestChip:"🌶️ pick firm full-size green peppers · or leave them to ripen red", name:"Jalapeño", emoji:"🌶️", loc:"outdoor", freq:"Morning at the base — every 2-3 days, let the top 2 inches dry. Less water = hotter pepper.", days:2, trimDays:21,
    trim:"Once the plant is mature, prune lightly: remove only yellow, badly damaged, or soil-touching lower leaves; inspect leaf undersides for pests; and support branches whenever a heavy pepper load begins to bend them. Keep the healthy canopy because it shades fruit from sunscald." },
  { id:"raspberry", light:"☀️ Full sun", waterChip:"💧 every 2–3 days — deep soak", harvestChip:"🍇 next year — not fruiting this season",     name:"Raspberry",           emoji:"🍇", loc:"outdoor", freq:"Morning at the base — every 2-3 days, deep soak.", days:2, trimDays:21,
    trim:"First-year canes (primocanes) — do NOT cut them back; they fruit next year. Tie them to the support as they grow and snip any dead or damaged tips." },
  { id:"green_onion", light:"☀️ Full sun", waterChip:"💧 check each pot · usually every 2 days", harvestChip:"✂️ snip green tops as you cook — they regrow", name:"Green Onion Pots", emoji:"🧅", loc:"outdoor", freq:"The green onions are in their own pots now. Check each pot separately every day during the heat and water only when its top inch starts drying, usually about every 2 days.", days:2, trimDays:14,
    trim:"Cut-and-come-again: snip the green tops about an inch above the soil whenever you cook and they regrow several times. Leave the white base and roots in the pot to keep producing." },
  { id:"potato", light:"☀️ Full sun · afternoon shade in extreme heat", waterChip:"💧 check daily — grow bags dry fast", harvestChip:"🥔 dig after the tops die back", name:"Golden Potato · Felt Grow Bag", emoji:"🥔", loc:"outdoor", freq:"Check the felt grow bag every morning because fabric loses moisture quickly in hot, dry weather. Water deeply when the top inch starts drying, keeping the root zone evenly moist but never waterlogged.", days:1, trimDays:21, note:"Jul 12 — the larger potato was moved into the felt bag with handles. Its leaves are about 6 inches above the soil; the lowest leaves were removed and the stem was buried up to the split.",
    trim:"Keep adding a few inches of soil or mulch as the stems rise, leaving the upper leafy growth exposed. Buried stem can make extra tuber sites on indeterminate varieties and always helps keep potatoes dark and supported. Stop hilling near the top of the bag and stop watering once the foliage yellows and dies back." },
  { id:"potato_sprout", light:"☀️ Full sun · afternoon shade in extreme heat", waterChip:"💧 check daily — grow bags dry fast", harvestChip:"🥔 dig after the tops die back", name:"Golden Potato · Second Felt Grow Bag", emoji:"🥔", loc:"outdoor", freq:"Check the second felt grow bag every morning because fabric loses moisture quickly in hot, dry weather. Water deeply when the top inch starts drying, keeping the root zone evenly moist but never waterlogged.", days:1, trimDays:21,
    trim:"Keep adding a few inches of soil or mulch as the stems rise, leaving the upper leafy growth exposed. Stop hilling near the top of the bag and stop watering once the foliage yellows and dies back." },
  { id:"ginger", light:"🌥️ Part shade — bright, no harsh afternoon sun", waterChip:"💧 check daily in the small pot", harvestChip:"🫚 ~8–10 months — lift when leaves yellow & die back", name:"Ginger Root · Temp Pot", emoji:"🫚", loc:"outdoor", freq:"Now in its own temporary pot and sprouted above the soil. Check moisture daily in the heat and water when the top inch begins to dry; keep it evenly moist but never soggy, with afternoon shade.", days:1, trimDays:30, note:"Jul 12 — moved into its own temporary pot; the ginger has sprouted.",
    trim:"No real pruning — just remove yellow or dead leaves. Near harvest (~8–10 months) let the foliage die back and stop watering, then tip out the pot, break off a piece of rhizome, and replant the rest." },
  { id:"turmeric", light:"🌥️ Part shade — bright, no harsh afternoon sun", waterChip:"💧 check both daily · water only as soil dries", harvestChip:"🫚 ~8–10 months — lift when leaves yellow & die back", name:"Turmeric · 2 Plants", emoji:"🫚", loc:"outdoor", freq:"Check both turmeric plantings separately during the heat and water only where the top inch starts to dry. Warm and lightly moist is the goal; soggy soil can rot the rhizomes. This is one shared schedule record for now, so log it only after both plantings have actually been watered.", days:2, trimDays:30, overwater:true,
    trim:"No real pruning — remove yellow or dead leaves only. Near harvest (~8–10 months) let foliage die back, stop watering, tip out the pot, break off rhizome to use, and replant the rest." },

  // ── OUTDOOR ORNAMENTALS ───────────────────────────────────────────────────
  { id:"dianthus", light:"☀️ Full sun ≥6h", waterChip:"💧 every 2–3 days", harvestChip:"✂️ deadhead weekly",  name:"Dianthus / Pinks", emoji:"🌸", loc:"outdoor", freq:"Morning — every 2-3 days at the base, try not to wet the flowers.", days:2, trimDays:5,
    trim:"Deadhead constantly — snip every faded bloom down to the next bud or leaf. Lots of spent blooms right now; do a full pass. This is the #1 thing that keeps it flowering all summer." },
  { id:"daisy", light:"☀️ Full sun–part shade", waterChip:"💧 every 2 days — consistent", harvestChip:"✂️ deadhead weekly",     name:"Daisy",            emoji:"🌼", loc:"outdoor", freq:"Morning — every 2 days, needs consistency. Make sure it is not sitting in water — the nursery basket inside the pot traps moisture.", days:2, trimDays:7,
    trim:"Deadhead spent flowers at the base of the stem and remove yellow/brown leaves. To fix the ongoing leaf stress, repot into the terra cotta directly with proper drainage." },
  { id:"candytuft", light:"☀️ Full sun", waterChip:"💧 every 3–4 days — drought-tolerant", harvestChip:"✂️ shear once after bloom", name:"Candytuft",        emoji:"🌾", loc:"outdoor", freq:"Morning — every 3-4 days, fairly drought tolerant.", days:3, trimDays:30,
    trim:"Spring bloom is finishing and it is getting leggy — shear the whole plant back by about a third now to keep it compact and trigger a second flush." }];

const PLANT_INFO = {
  turmeric:     { fact:"Turmeric is ginger's cousin — same rhizome family; its bright orange flesh is what colors curry, and it can take several weeks to break the surface after planting.", photo:"images/turmeric_sprout_example_20260727.jpg", photoPos:"center 60%", photoCredit:"Example sprout · Derk29 · Wikimedia Commons · CC BY-SA 4.0 · resized", photoCreditUrl:"https://commons.wikimedia.org/wiki/File:Turmeric_sprout.jpg" },
  ginger:       { fact:"Ginger is not a root — it is a rhizome, an underground stem. Each knobby hand you plant sends up leafy shoots and grows more rhizome to harvest.", photo:"images/ginger_20260714.jpg", photoPos:"70% 48%" },
  fittonia:     { photo:"images/fittonia_20260714.jpg", photoPos:"48% 65%", fact:"Called the 'nerve plant' for its vein-like patterns — it dramatically faints when thirsty, then perks back up after a drink. In bark mulch, check it every 2 days — it dries faster than soil." },
  croton:       { photo:"images/croton_20260714.jpg", photoPos:"55% 48%", fact:"Croton leaves change color with light: more sun means brighter reds, oranges, and yellows." },
  jade:         { fact:"A succulent that can live for decades — jade is widely seen as a symbol of good luck and prosperity.", photo:"images/jade_20260714.jpg", photoPos:"42% 68%" },
  basil1:       { fact:"Basil is in the mint family, and pinching it makes it bushier — the more you harvest, the more it grows.", photo:"images/basil1_20260714.jpg", photoPos:"55% 48%" },
  basil2:       { fact:"Ancient cultures saw basil as a symbol of love and protection; today it's the heart of pesto.", photo:"images/basil2_20260714.jpg", photoPos:"60% 50%" },
  parsley:      { fact:"Parsley is biennial — leaves the first year, flowers the second — and it's loaded with vitamin K.", photo:"images/parsley_20260714.jpg", photoPos:"50% 45%" },
  mint:         { fact:"Peppermint is a natural hybrid of watermint and spearmint, and it spreads so fast it's best kept potted.", photo:"images/mint_20260714.jpg", photoPos:"47% 48%" },
  dill:         { fact:"Dill's name comes from old Norse 'dilla', to soothe — it was once used to calm fussy babies.", photo:"images/dill_20260714.jpg", photoPos:"52% 42%" },
  rosemary:     { fact:"Rosemary means 'dew of the sea' and can live 20+ years — it loves dry feet and full sun.", photo:"images/rosemary_20260714.jpg", photoPos:"48% 43%" },
  strawberry:   { fact:"A strawberry isn't a true berry, and it's the only fruit with seeds on the outside — about 200 each.", photo:"images/strawberry_20260714.jpg", photoPos:"52% 48%" },
  strawberry_pot:{ fact:"A strawberry pot lets a whole patch of plants share one tall container — and runners from the top plants can root right into the lower pockets.", photo:"images/strawberry_pot_20260714.jpg", photoPos:"62% 45%" },
  tomato:       { fact:"Tomatoes are technically fruit; 'heirloom' means the variety has been saved and passed down 50+ years.", photo:"images/tomato_20260714.jpg", photoPos:"56% 45%" },
  cherry_tomato:{ fact:"Cherry tomatoes taste sweeter than big ones — more skin per bite concentrates the sugars.", photo:"images/cherry_tomato_20260714.jpg", photoPos:"53% 48%" },
  jalapeno:     { fact:"A jalapeño's heat lives in the white pith, not the seeds — and less water makes it hotter.", photo:"images/jalapeno_20260714.jpg", photoPos:"center 32%" },
  raspberry:    { fact:"Each raspberry is a cluster of tiny 'drupelets', and the canes fruit in their second year.", photo:"images/raspberry_20260714.jpg", photoPos:"56% 46%" },
  green_onion:  { fact:"Green onions are a cut-and-come-again crop — leave the white base and roots and the green tops regrow again and again.", photo:"images/green_onion_20260714.jpg", photoPos:"58% 50%" },
  potato:       { fact:"The potato you eat is a swollen underground stem (a tuber), not a root — and it grows from 'eyes' that sprout into new plants.", photo:"images/potato_20260714.jpg", photoPos:"57% 42%" },
  potato_sprout:{ fact:"A new potato sprout feeds first from the seed potato, then builds the leaves and roots that will support its tubers.", photo:"images/potato_20260714.jpg", photoPos:"57% 42%" },
  white_onion:  { fact:"An onion bulb is really a cluster of swollen leaf bases — and the tops flopping over is the plant's signal it's done bulbing.", photo:"images/white_onion_20260714.jpg", photoPos:"58% 47%" },
  dianthus:     { fact:"Dianthus means 'flower of the gods' in Greek, and many kinds smell just like cloves.", photo:"images/dianthus_20260714.jpg", photoPos:"58% 47%" },
  daisy:        { fact:"'Daisy' comes from 'day's eye' — the flower opens at dawn and closes again at dusk.", photo:"images/daisy_20260714.jpg", photoPos:"57% 52%" },
  candytuft:    { fact:"Candytuft is named for Candia (old Crete), not candy — though the clusters look sweet enough to eat.", photo:"images/candytuft_20260714.jpg", photoPos:"62% 43%" }
};

const WATER_INFO = {
  fittonia:{when:"Check every 2 days — bark mulch mix dries fast. Water when the top inch is barely dry; don't let it reach the droop. Place on a pebble tray with water underneath for humidity. Keep away from AC vents. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water. New coco-coir mix holds moisture longer — expect ~4–5 days between drinks after the repot (say the word and we retune the schedule).",thirst:"The drama queen: it collapses flat the instant it's thirsty, then springs back upright within an hour of a drink. But bark mix dries faster than potting soil — don't wait for the faint."},
  croton:{when:"Water when the top inch is dry, usually every 5–7 days, keeping it evenly moist in bright warm light. Do not let it fully dry out. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water.",thirst:"Sensitive to swings — both bone-dry soil and cold drafts make it drop leaves in protest."},
  jade:{when:"Let the soil dry out completely, then water deeply and leave it alone for 2–3 weeks. Water much less in winter. 🦟 Gnat reset = REPOT DAY Sun Jun 14 (full plan: Plants → Care). After the repot: first 2–3 waterings = BTI tea for insurance, then back to normal water.",thirst:"A true succulent that stores water in its leaves, so underwatering is nearly impossible — but overwatering is fatal."},
  basil1:{when:"Check every morning and water at the soil when the top inch starts drying or the leaves just begin to soften. In extreme heat, recheck late afternoon and water only if the mix is drying; avoid wet foliage overnight.",thirst:"A heavy summer drinker that can collapse quickly in heat — catch the early softening stage instead of waiting for a full wilt."},
  basil2:{when:"Check every morning and water at the soil when the top inch starts drying or the leaves just begin to soften. In extreme heat, recheck late afternoon and water only if the mix is drying; avoid wet foliage overnight.",thirst:"Wants steady moisture — do not let it reach a severe wilt, but use the soil check so the roots never stay soggy."},
  parsley:{when:"Morning water every 3–4 days, whenever the top 2 inches dry out. Water at the base and keep it lightly moist.",thirst:"Dislikes drying out completely — drought stress makes it bolt to seed sooner."},
  mint:{when:"Keep the soil evenly moist with a gentle morning drink — peppermint is a water-lover. Never let it sit soggy.",thirst:"A water-lover that wilts fast then bounces back within hours of a drink — it's fully recovered now, so just keep it on its normal even-moisture schedule."},
  dill:{when:"Morning water when the top 2 inches dry, every couple of days. Water at the base and keep it from drying out fully.",thirst:"Likes slightly moist soil — let it dry hard and it bolts and flowers early."},
  rosemary:{when:"Water sparingly — only about weekly, and let it dry well between drinks. Morning water at the base; when in doubt, skip it.",thirst:"Mediterranean and drought-tolerant — overwatering is the number-one way to kill rosemary."},
  strawberry:{when:"Daily — the round pot in full sun dries fast. Water deeply at the base each morning; in a heat wave it may want a second drink in the evening. Keep evenly moist while flowering and fruiting.",thirst:"Shallow-rooted and quick to dry — steady moisture is what makes the berries plump and sweet."},
  strawberry_pot:{when:"Daily in summer — water the multi-plant mother pot and check every pocket, then check its two attached runners in their temporary pots. During mid-90s heat, check those little pots again in the evening.",thirst:"The upper pockets and temporary runner pots dry first. Keep them evenly moist while rooting, with morning sun and afternoon shade, but never bury the runner crowns."},
  tomato:{when:"Morning, at the base, deep and CONSISTENT — daily in heat. Never wet the leaves. Ease off slightly as the fruit ripens.",thirst:"Consistency is everything: swinging from dry to drenched is exactly what causes cracking and catfacing."},
  cherry_tomato:{when:"Morning, at the base, daily in heat; ease off once the fruit is ripening to prevent splitting.",thirst:"Steady water keeps the skins intact — a sudden big drink after a dry spell makes them burst."},
  jalapeno:{when:"Water at the base every 2–3 days, letting the top 2 inches dry first. A little controlled dryness is good for it.",thirst:"Mild water stress concentrates the heat — keep it on the lean side for hotter peppers."},
  raspberry:{when:"Deep soak at the base every 2–3 days — aim for about an inch of water a week. Deep and infrequent beats daily sprinkles.",thirst:"Its roots run wide and shallow, so it wants deep soaks that reach them, not surface splashes."},
  green_onion:{when:"Check each green-onion pot separately every day during the heat and water only the pots whose top inch is starting to dry, usually about every 2 days.",thirst:"Their shallow roots can wilt quickly, and individual pots may dry at different rates, so use each pot's soil rather than watering them automatically as a group."},
  potato:{when:"Check the felt grow bag every morning and water deeply when the top inch starts drying. Fabric loses moisture quickly in Denver heat, but the bag should still drain freely.",thirst:"Even moisture while the large plant grows supports smooth tubers; large wet-dry swings can cause misshapen potatoes."},
  potato_sprout:{when:"Check the second felt grow bag every morning and water deeply when the top inch starts drying. Fabric loses moisture quickly in Denver heat, but the bag should still drain freely.",thirst:"Even moisture while the plant grows supports smooth tubers; large wet-dry swings can cause misshapen potatoes."},
  white_onion:{when:"While it recovers from root rot, water the shared gray pot only after the top inch dries and keep water away from the exposed bulb neck.",thirst:"Watch for fresh upright growth. Renewed softness, odor, or yellowing suggests the base is staying too wet."},
  ginger:{when:"Check its new temporary pot daily in hot weather and water when the top inch begins to dry. Keep the sprouted ginger evenly moist with afternoon shade, never soggy.",thirst:"The small pot dries faster now, but standing moisture can rot the rhizome."},
  turmeric:{when:"Check both turmeric plantings separately each day during the heat and water only where the top inch starts to dry. This is one shared schedule record for now, so log it only after both plantings have actually been watered.",thirst:"Keep each planting lightly moist, never soggy. Use its own soil check rather than the example sprout photo or a rigid interval."},
  dianthus:{when:"Water at the base every 2–3 days, letting the surface dry slightly between. Keep water off the flowers and crown.",thirst:"Hates soggy soil — a constantly wet crown is what rots these plants."},
  daisy:{when:"Morning water about every 2 days for consistency. Crucial: make sure it is not sitting in water — the nursery basket inside the pot traps moisture.",thirst:"A tricky reader — droopy stems can mean too little OR too much water, so always check drainage first."},
  candytuft:{when:"Water every 3–4 days, letting it dry between — it is fairly drought-tolerant. Do not overwater.",thirst:"Happiest on the dry side; it sulks and rots in soil that stays wet."}
};

const FUN_FACTS = {
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
  raspberry:["Each raspberry is a cluster of tiny drupelets, and the canes fruit in their second year.","The hollow center is why raspberries are so delicate — they bruise in the bowl.","Green primocanes this year become the fruiting floricanes of next year."],
  green_onion:["Green onions are a cut-and-come-again crop — snip the tops and they regrow again and again.","The white base left in the soil (or even a glass of water) will resprout fresh green shoots.","'Scallion', 'green onion', and 'spring onion' all refer to much the same young onion."],
  potato:["The potato you eat is a swollen underground stem called a tuber, not a root.","Potatoes grow from the 'eyes' — each eye is a bud that can sprout a whole new plant.","Mounding soil over the stems ('hilling') gives more potatoes and keeps them from going green."],
  white_onion:["An onion bulb is a cluster of swollen leaf bases wrapped in papery skins.","When the green tops flop over on their own, that's the plant signaling the bulb is done.","Curing onions in a dry, airy spot for a couple weeks is what lets them store for months."],
  dianthus:["Dianthus means flower of the gods in Greek, and many kinds smell just like cloves.","The color word pink came from these flowers' frilly, pinked edges.","Deadheading spent blooms is the single best trick to keep it flowering all summer."],
  daisy:["Daisy comes from day's eye — the flower opens at dawn and closes again at dusk.","What looks like one flower is actually hundreds of tiny florets packed together.","Daisies are in the same plant family as sunflowers and lettuce."],
  candytuft:["Candytuft is named for Candia (old Crete), not candy — though the clusters look sweet enough to eat.","It is evergreen, so the foliage stays green through winter in mild climates.","Shear it back after blooming and it often rewards you with a second flush."]
};

const CARE_INFO = {
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
  jalapeno:{fact:"Mature pepper plants need only light pruning: keep the healthy canopy, remove damaged or soil-touching leaves, and support branches when fruit makes them bend."},
  raspberry:{fact:"Tying canes to a support and snipping off dead tips is most of raspberry care."},
  green_onion:{fact:"Always leave the white base and roots when you cut — that's what lets the tops regrow."},
  potato:{fact:"Mounding soil over the stems as they grow ('hilling') is the whole job — more tubers, and they stay buried."},
  white_onion:{fact:"Once the tops flop on their own, stop watering and let the bulb cure — that's what makes it keep."},
  dianthus:{fact:"Deadheading — snipping spent blooms back to a bud — is the heart of keeping it flowering."},
  daisy:{fact:"Deadheading spent flowers and clearing yellow leaves keeps it blooming and healthy."},
  candytuft:{fact:"A hard shear right after bloom keeps candytuft compact instead of woody and sprawling."}
};

const PEST_INFO = {
  fittonia:{ look:"Fungus gnats are the top risk because the chunky bark mix stays moist — watch for tiny black flies at the soil surface and translucent larvae in the top layer. Spider mites bring underside stippling and fine webbing in dry air; mealybugs leave white cottony masses in the axils and aphids gather on new growth.", fix:"For gnats, let the mix surface dry between waterings, top-dress with coarse sand or a pinch of cinnamon, set yellow sticky traps, and drench with BTI (mosquito bits) for the larvae. Use insecticidal soap or neem for mites and aphids; alcohol swab for mealybugs." },
  croton:{ look:"Spider mites are croton's signature pest — thick waxy leaves plus dry warm air make it the most mite-vulnerable plant you have. Check leaf undersides for fine stippling, dull bronzing, and webbing along the veins and axils. Also watch for white cottony mealybugs in the axils, brown scale bumps with honeydew on stems, and thrips (silvery streaks plus tiny black frass specks).", fix:"Wipe the glossy leaves with a damp cloth weekly, raise humidity, and rinse the undersides. Spray insecticidal soap or neem top and bottom every 5 to 7 days for 2 to 3 cycles to break the mite life cycle; alcohol swab for mealybugs and scale; isolate at the first sign of webbing." },
  jade:{ look:"Mealybugs are the classic jade pest — check the leaf axils, the joints where leaves meet the stems, and the undersides for white cottony masses and sticky honeydew. Spider mites occasionally show fine stippling and webbing on dry plants; root mealybugs or root rot can lurk if it has been overwatered (inspect the roots at repotting).", fix:"Dab mealybugs directly with a cotton swab soaked in 70% isopropyl alcohol — it kills them on contact. For wider spread use neem or insecticidal soap (test one leaf first, succulents can be sensitive). The real defense is not overwatering, which keeps growth firm and pest-resistant." },
  basil1:{ look:"Japanese beetles have metallic green heads, copper wing covers, and small white tufts along their sides; they rapidly skeletonize basil leaves into lace. Also check tender tips and leaf undersides for aphids, whiteflies, spider-mite stippling or webbing, and lower leaves for slug damage.", fix:"For Japanese beetles, tap adults into a cup of soapy water now, at dusk, and again in the cool morning. If the pots are portable, a bright indoor pause after clearing can block their return for a day or two. A breathable row cover is an optional later tool; never wrap basil in plastic or solid cloth in the heat. Skip Japanese beetle traps, which attract more beetles. The recorded Captain Jack's Deadbug Brew is not labeled for Japanese beetles on basil, so do not use it for this. Use any spray only when its label lists basil or herbs, the exact pest, and the harvest interval; protect blooms and pollinators, and never feed treated beetles to spiders. For aphids, whiteflies, or mites, use a strong water rinse and a food-crop-labeled insecticidal soap as directed." },
  basil2:{ look:"Japanese beetles have metallic green heads, copper wing covers, and small white tufts along their sides; they rapidly skeletonize basil leaves into lace. Also check tender tips and leaf undersides for aphids, whiteflies, spider-mite stippling or webbing, and lower leaves for slug damage.", fix:"For Japanese beetles, tap adults into a cup of soapy water now, at dusk, and again in the cool morning. If the pots are portable, a bright indoor pause after clearing can block their return for a day or two. A breathable row cover is an optional later tool; never wrap basil in plastic or solid cloth in the heat. Skip Japanese beetle traps, which attract more beetles. The recorded Captain Jack's Deadbug Brew is not labeled for Japanese beetles on basil, so do not use it for this. Use any spray only when its label lists basil or herbs, the exact pest, and the harvest interval; protect blooms and pollinators, and never feed treated beetles to spiders. For aphids, whiteflies, or mites, use a strong water rinse and a food-crop-labeled insecticidal soap as directed." },
  parsley:{ look:"Aphids gather on the new center growth and leaf undersides (honeydew). Black swallowtail caterpillars chew the leaves and leave dark frass droppings — look on the stems and foliage for green-and-black striped larvae. Whiteflies appear on the undersides in the warm greenhouse, and spider mites show up in dry spots.", fix:"Hand-pick the caterpillars (or relocate them — they become swallowtail butterflies). Use insecticidal soap or neem for aphids, whiteflies, and mites; water-blast the aphids; yellow sticky traps for whiteflies; ladybugs as aphid predators." },
  mint:{ look:"Aphids are mint's main pest — they cluster on tender new tips and leaf undersides with honeydew. Spider mites bring underside stippling and fine webbing in warm dry corners, and whiteflies sit on the undersides. Orange pustules on leaf undersides are mint rust, a fungal disease rather than a pest — pull those leaves, do not spray for bugs.", fix:"Water-blast and use insecticidal soap or neem for aphids (hit the undersides); ladybugs and lacewings help, and yellow sticky traps catch whiteflies. For mites raise humidity and use insecticidal soap. For rust, improve airflow and remove infected leaves." },
  dill:{ look:"Aphids settle on new growth and the flower umbels (honeydew). Swallowtail caterpillars chew the fronds and leave dark frass — check the stems for green-and-black striped larvae. Spider mites show in dry heat and whiteflies in the warm greenhouse. Dill itself draws beneficial wasps and ladybugs, so it often polices its own pests.", fix:"Water-blast plus insecticidal soap or neem for aphids, mites, and whiteflies; hand-pick the caterpillars (or let them grow into swallowtails). Lean on the beneficial predators dill attracts rather than heavy spraying." },
  rosemary:{ look:"Spider mites are a real problem in dry greenhouse air — check the leaf undersides and stem tips for fine stippling, a gray cast, and webbing. Aphids hit the tender new tips (honeydew), whiteflies sit on the undersides, and mealybugs (white cotton) or scale (brown bumps) appear on the woody stems. A white powdery coating is powdery mildew, a fungal issue from poor airflow.", fix:"Rinse the foliage and use insecticidal soap or neem for aphids, mites, and whiteflies (spray the undersides); alcohol swab for mealybugs and scale. Improve airflow and avoid wetting the leaves overhead to head off powdery mildew — good ventilation is the best mite and mildew preventive." },
  strawberry:{ look:"Slugs and snails are the headliners — look on and under berries touching the soil and on the pot rim at night for ragged chewed holes in ripe fruit plus silvery slime trails. Pillbugs widen existing wounds on low berries at the soil line. Spider mites stipple and bronze the leaf undersides with webbing in the dry heat; aphids cluster on tips with honeydew. Fuzzy gray rot on a berry is botrytis (a moisture fungus), not a pest.", fix:"For slugs use iron-phosphate bait, beer traps, or night hand-picking, and lift the berries off the soil with straw or a support. For mites, blast the undersides with water then insecticidal soap or neem every 5 to 7 days (not above about 90F). Strong water spray and soap for aphids; improve airflow against botrytis." },
  strawberry_pot:{ look:"Same cast as the single strawberry — slugs and pillbugs on the dangling fruit (ragged holes, slime trails), spider mites on the undersides (the porous jar dries fast and raises mite risk), and aphids on the tips. Watch too for drought stress, not a pest: wilting, scorched leaf edges, and small hard berries mean the column went dry — the top pockets dry out first.", fix:"Iron-phosphate bait and night hand-picking for slugs; water-blast plus insecticidal soap or neem for mites and aphids. Keeping the jar evenly watered is itself mite prevention, since drought-stressed plants are mite magnets — check the top pockets separately." },
  tomato:{ look:"Tomato hornworm is the big one — look on the stems, growing tips, and leaf undersides for large stripped leaves, dark pellet-like frass on the leaves and soil below, and the green caterpillar itself (easiest to spot at dusk). Aphids cluster on tender tips and new-leaf undersides (honeydew, then sooty mold); spider mites stipple, bronze, and web the undersides in the dry heat. A sunken leathery black patch on the bottom of a fruit is blossom-end rot — a calcium and uneven-watering disorder, not a pest, so fix watering rather than spraying.", fix:"Hand-pick hornworms into soapy water at dusk; use Bt or spinosad on young larvae; leave any hornworm covered in white rice-like cocoons (those are parasitic braconid wasps working for you). Water-blast and insecticidal soap or neem for aphids and mites every 5 to 7 days. For blossom-end rot, water evenly, mulch the pot, and avoid excess nitrogen." },
  cherry_tomato:{ look:"Same cast as the beefsteak: hornworms (chewed leaves plus frass — easy to scan on the compact bush), aphids on the tips (honeydew, sooty mold), and spider mites stippling and webbing the undersides in Denver's dry heat. Watch out for splitting or cracking of the cherries — that is from uneven watering (dry then soaked), not a pest, so steady the moisture rather than spraying.", fix:"Hand-pick hornworms; water-blast plus insecticidal soap or neem for aphids and mites; encourage ladybugs. Because the plant is compact a thorough underside spray is quick. Even watering and a surface mulch prevent most cracking." },
  jalapeno:{ look:"Aphids (especially green peach aphid) cluster on the growing tips and undersides of new leaves — curling tips, honeydew, sooty mold. Flea beetles chew tiny round shot-hole pinholes in the leaves, worst on young foliage. Spider mites stipple, bronze, and web the undersides in the dry heat. Check the growing tips first for aphids and the undersides for mites.", fix:"For aphids: water-blast, insecticidal soap, or neem, and plant sweet alyssum nearby to draw ladybugs and hoverflies. For flea beetles: floating row cover early, kaolin clay, or neem. For mites: water-blast the undersides plus insecticidal soap or neem every 5 to 7 days. Avoid spraying open blossoms at midday to protect pollinators." },
  raspberry:{ look:"Spider mites are the top threat in Denver's hot dry air — on the leaf undersides causing stippling, yellowing or bronzing, and fine webbing, worst in mid-to-late summer. Aphids sit on the tips and new-leaf undersides (honeydew, and they vector raspberry viruses). Japanese beetles skeletonize the upper leaf surfaces into lace; sawfly or looper larvae chew leaf holes.", fix:"Hose the undersides hard, then neem or insecticidal soap for mites (skip neem above about 90F), and protect predatory mites, lacewings, and ladybugs by avoiding broad-spectrum sprays. Water-blast plus soap for aphids. Hand-pick Japanese beetles into soapy water in the cool morning; skip pheromone traps, which draw in more beetles than they catch." },
  green_onion:{ look:"Thrips hide down in the leaf folds and at the base of the tops — evidence is silvery streaks and flecks plus distorted growth (Denver's heat and dust favor them). Onion maggot larvae work at the base and roots below the soil line, causing wilting, yellowing, and mushy bases. Aphids show up occasionally on the tender green tops. Look into the leaf folds for thrips and at the soil-line base for maggot wilt.", fix:"For thrips: water-blast, then insecticidal soap or neem worked into the leaf folds, reflective mulch, and lacewings or minute pirate bugs. For onion maggot: floating row cover early to block the egg-laying fly, avoid fresh manure, and remove infested plants. Water-blast plus soap for aphids. The onions' own scent keeps pressure light." },
  potato:{ look:"Colorado potato beetle is a Front Range regular — adults are rounded with yellow-and-black stripes, larvae are fat, reddish, and humpbacked, and both chew leaves to a skeleton, with clusters of orange-yellow eggs on the leaf undersides. Aphids hit the tips and undersides (honeydew, virus vectors). A tuber that turns green is a light-exposure disorder, not a pest — it needs hilling, not spraying.", fix:"Hand-pick the beetle adults and larvae and crush the orange egg clusters on the undersides (very effective in a single pot); spinosad or Bt tenebrionis for larvae; row cover early. Water-blast plus insecticidal soap for aphids. Prevent green tubers by hilling soil over any that near the surface." },
  white_onion:{ look:"Thrips hide down in the leaf axils and folds where the leaves meet the bulb neck — silvery-white streaking and stippling on the leaves, thriving in the hot dry summer. Onion maggot larvae attack the bulb base and roots below the soil line, causing wilting, yellowing, and a rotting mushy bulb. Aphids appear occasionally on the tops. Check the leaf folds for thrips and the soil-line base for maggot.", fix:"For thrips: strong water spray, then insecticidal soap or neem aimed into the leaf folds, reflective mulch, and minute pirate bugs or lacewings. For onion maggot: floating row cover early to exclude the fly, avoid fresh manure, and pull infested plants. The onion's pungency keeps overall pressure low." },
  dianthus:{ look:"Aphids cluster on the new growth and buds (clusters plus honeydew). Slugs and snails chew ragged holes and leave silvery slime trails — check at soil level and under the foliage. Spider mites stipple and web the undersides during hot dry spells. A white powdery coating or stem and root rot in soggy soil is fungal, not a pest.", fix:"Blast aphids off with water, then insecticidal soap or neem for aphids and mites. Hand-pick slugs and snails or use iron-phosphate bait and clear their hiding spots. Keep container drainage sharp to prevent rot; ladybugs help with aphids." },
  daisy:{ look:"Aphids on the buds and new growth (honeydew). Earwigs chew the petals and leaves and hide by day — check under the pot and in the foliage for ragged holes. Slugs and snails leave ragged holes and slime trails at soil level; spider mites stipple the undersides in hot dry weather; leaf miners sometimes leave squiggly pale trails inside the leaves.", fix:"Water-blast plus insecticidal soap or neem for aphids and mites. Trap earwigs with rolled damp newspaper or a shallow oil trap and empty it in the morning. Hand-pick slugs and snails or use iron-phosphate bait, and remove any miner-trailed leaves. Good airflow and uncrowded pots cut problems." },
  candytuft:{ look:"Candytuft is fairly pest-resistant. Watch for aphids on new growth (honeydew), flea beetles chewing tiny shot-hole pits in the leaves, and slugs or snails (ragged holes, slime trails) — all minor. The bigger threat is root rot or damping off in soggy pots, which is fungal rather than a pest.", fix:"Water-blast plus insecticidal soap or neem for aphids and flea beetles; hand-pick slugs and snails or use iron-phosphate bait. The main control is cultural: a gritty fast-draining mix and no overwatering prevent the root rot that actually kills candytuft." }
};
const FEED_INFO = {
  fittonia:{ what:"A balanced organic liquid such as worm-casting tea or diluted fish emulsion at half strength.", how:"Feed lightly every 4 weeks in spring and summer; the bark mix holds few nutrients, so steady light feeding matters more here than for soil plants. No winter feeding." },
  croton:{ what:"A balanced organic liquid (fish emulsion or balanced organic fertilizer) at half strength; slightly higher nitrogen supports the big leaves.", how:"Feed monthly in spring and summer, but do not overdo it; reduce or stop in fall and winter." },
  jade:{ what:"A diluted balanced or low-nitrogen organic feed (half-strength fish or seaweed, or a succulent feed). Jade is not a heavy feeder.", how:"Feed sparingly — only every 2 to 3 months during spring and summer, and only when actively growing. No feeding in fall or winter; overfeeding causes weak leggy growth." },
  basil1:{ what:"A nitrogen-leaning feed for lush leaves — diluted fish emulsion or a fish/seaweed blend, or a top-dress of worm castings.", how:"Feed every 2 to 3 weeks; do not over-fertilize, which can dilute the essential-oil flavor — steady moderate nitrogen is the sweet spot." },
  basil2:{ what:"Same as the other basil: a nitrogen-leaning diluted fish emulsion or fish/seaweed, or worm castings.", how:"Feed every 2 to 3 weeks, avoiding overfeeding so the flavor stays strong." },
  parsley:{ what:"A nitrogen-leaning feed for lush leaves — diluted fish emulsion or fish/seaweed, or a side-dress of compost or worm castings.", how:"Feed every 2 to 3 weeks; steady moderate nitrogen keeps the leaves tender and green." },
  mint:{ what:"A light nitrogen-leaning feed — diluted fish emulsion or balanced organic liquid. Mint is vigorous and needs little.", how:"Feed every 3 to 4 weeks; over-fertilizing produces lush but bland leaves, so keep it light." },
  dill:{ what:"A balanced or mildly nitrogen diluted fish/seaweed feed. Dill is a light feeder.", how:"Feed every 3 to 4 weeks and go easy — too much nitrogen makes floppy stems and weaker flavor." },
  rosemary:{ what:"Very little — rosemary prefers lean, well-drained conditions. A light diluted fish/seaweed or balanced organic feed is all it wants.", how:"Feed only once or twice across spring and summer. Overfeeding (and overwatering) makes soft, weak, less-aromatic growth and invites root rot — lean and slightly dry gives the most fragrant rosemary." },
  strawberry:{ what:"Light, balanced feeding — a dilute balanced organic liquid (fish emulsion plus kelp, or balanced 5-5-5) or compost-tea and worm castings. Not a heavy feeder; too much nitrogen gives leaves at the expense of fruit.", how:"Feed every 2 to 3 weeks during fruiting; top-dress with worm castings or compost for steady release." },
  strawberry_pot:{ what:"A dilute balanced organic liquid (fish plus kelp), with worm castings tucked into each pocket.", how:"Feed every 1 to 2 weeks — lighter and more often than the big pot, because the small pockets leach nutrients quickly with frequent watering." },
  tomato:{ what:"Now that it is flowering and fruiting, back off nitrogen and favor phosphorus and potassium — a tomato-specific organic (such as 3-4-6) or fish-and-kelp plus a phosphorus source. Calcium matters in containers: a calcium-containing tomato fertilizer or a bit of crushed eggshell or gypsum.", how:"Feed every 2 to 3 weeks; too much nitrogen gives a jungle of leaves and few tomatoes. Consistent watering plus the calcium source prevents blossom-end rot far better than any spray." },
  cherry_tomato:{ what:"Same as the beefsteak — a lower-nitrogen, higher phosphorus/potassium organic now that it is fruiting (a tomato organic or fish/kelp).", how:"Feed every 2 to 3 weeks. As a determinate it sets most fruit in one window, so steady feeding through that flush maximizes the harvest; do not overdo nitrogen." },
  jalapeno:{ what:"Modest nitrogen with steady phosphorus, potassium, and calcium now that it is flowering — a low-N organic (a tomato/veg fertilizer, or fish plus kelp with bone meal, or a 4-6-3 type).", how:"Side-dress lightly at first fruit set and again about 3 weeks later, or liquid-feed every 2 to 3 weeks. Too much nitrogen right now means a big bushy plant with few peppers." },
  raspberry:{ what:"First-year canes want to grow, so balanced organic feeding is fine — a top-dress of compost or well-rotted manure plus a balanced organic liquid (fish plus kelp). Do not overdo nitrogen, which delays next year's flowering and makes soft mite-prone growth.", how:"Feed every 3 to 4 weeks through midsummer, then taper off by late summer so the canes harden for winter." },
  green_onion:{ what:"Scallions are nitrogen-loving leaf crops — a higher-nitrogen organic (fish emulsion, blood meal, or a balanced-to-high-N liquid) for green top growth.", how:"Feed every 2 to 3 weeks. Unlike bulb onions you do not need to taper the nitrogen, since you are harvesting the tops rather than curing a bulb." },
  potato:{ what:"Balanced organic early during leafy growth and tuber bulking (compost, balanced 5-5-5, fish plus kelp), then shift to low-nitrogen, higher-potassium once tubers are sizing up.", how:"Feed during early growth and bulking, then switch away from nitrogen as tubers size up, and stop feeding entirely as the tops begin to die back — excess late nitrogen pushes leaves and delays the tubers." },
  white_onion:{ what:"Classic onion-bulb pattern: nitrogen early, then taper. A higher-N organic (blood meal, fish emulsion) during early leaf growth, because each leaf becomes a bulb ring.", how:"Feed every 2 to 3 weeks during early leaf growth, then stop nitrogen once bulbing begins and the tops start to fall, so the plant cures down instead of pushing soft growth that causes thick necks and poor storage." },
  dianthus:{ what:"A lower-nitrogen, bloom-leaning feed so it flowers instead of running to foliage — a diluted balanced or bloom-type organic fertilizer, compost tea, or a light scratch of compost.", how:"Feed about once a month during the growing season; container plants need this regular light feeding since pots leach nutrients." },
  daisy:{ what:"Moderate balanced feeding for plenty of blooms without going all-foliage — a balanced organic fertilizer or compost, plus a monthly diluted organic liquid in containers. Avoid heavy nitrogen, which gives leaves at the expense of flowers.", how:"Feed with balanced organic or compost in early spring and again after the first flush of flowers; in containers supplement monthly with a diluted organic liquid since pots run out of nutrients faster." },
  candytuft:{ what:"A light feeder — keep it lean. Candytuft prefers poor-to-average, well-drained soil; a single light feeding of balanced organic fertilizer or compost is plenty.", how:"Feed once in early spring (a thin top-dress of compost is ideal in a container); over-feeding produces floppy, sparse, less-floriferous growth." }
};

function dayOfYear(){ const n=new Date(); return Math.floor((n-new Date(n.getFullYear(),0,0))/86400000); }
function dailyFact(id){ const a=FUN_FACTS[id]; if(a&&a.length) return a[dayOfYear()%a.length]; return (PLANT_INFO[id]||{}).fact||""; }

const HARVEST_INFO = {
  basil1:{ongoing:true, badge:"✂️ Pinch 1–2 wks — required", hdrNote:"pinch 1–2 wks", signsLabel:"📅 Why this one stays scheduled", signs:"For the plant, not the kitchen: regular pinching is what keeps basil bushy, sweet and producing — skip it and it flowers, turns bitter and stalls. Pinch every 1–2 weeks and the moment you see a flower bud, even on days you are not cooking basil — pinch anyway and keep the leaves (🌟 below). When you do cut for the kitchen, do it in the early morning (about 7–10 AM) after the dew dries but before the heat — basil's aromatic oils replenish overnight and burn off once the sun warms the leaves, so morning leaves are the most fragrant and flavorful.", how:"Cut in the early morning for peak oils. Start once it's ~6–8 inches with several leaf sets. Always cut or pinch JUST ABOVE a leaf pair (a node), about a quarter inch above where two side shoots emerge, removing the top 2–4 inches — that node splits into two new branches, so the plant gets bushier and more productive. Use clean scissors or pinch with your fingers; do not strip individual leaves off the stem. Harvest from the top down, never more than about ⅓ at once, then let it recover. Pinch off any flower buds the moment they appear — flowering turns the leaves bitter and slows new growth. A light harvest about every 1–2 weeks while it is growing (more often once it is big and bushy, as long as you stay under ⅓).", fact:"Keeping it (when you are not cooking with it that day): short-term, treat it like cut flowers — trim the stems and stand them in a glass with about an inch of water on the COUNTER (never the fridge; cold turns basil black), loosely tent with a bag, good about a week. Longer: freeze — chop into ice-cube trays with olive oil or water, or blend into pesto and freeze (blanch whole leaves 2 seconds + an ice bath first). Drying works but loses the most flavor; frozen in oil or as pesto keeps it best."},
  basil2:{ongoing:true, badge:"✂️ Pinch 1–2 wks — required", hdrNote:"pinch 1–2 wks", signsLabel:"📅 Why this one stays scheduled", signs:"For the plant, not the kitchen: regular pinching is what keeps basil bushy, sweet and producing — skip it and it flowers, turns bitter and stalls. Pinch every 1–2 weeks and the moment you see a flower bud, even on days you are not cooking basil — pinch anyway and keep the leaves (🌟 below). When you do cut for the kitchen, do it in the early morning (about 7–10 AM) after the dew dries but before the heat — basil's aromatic oils replenish overnight and burn off once the sun warms the leaves, so morning leaves are the most fragrant and flavorful.", how:"Cut in the early morning for peak oils. Start once it's ~6–8 inches with several leaf sets. Always cut or pinch JUST ABOVE a leaf pair (a node), about a quarter inch above where two side shoots emerge, removing the top 2–4 inches — that node splits into two new branches, so the plant gets bushier and more productive. Use clean scissors or pinch with your fingers; do not strip individual leaves off the stem. Harvest from the top down, never more than about ⅓ at once, then let it recover. Pinch off any flower buds the moment they appear — flowering turns the leaves bitter and slows new growth. A light harvest about every 1–2 weeks while it is growing (more often once it is big and bushy, as long as you stay under ⅓).", fact:"Keeping it (when you are not cooking with it that day): short-term, treat it like cut flowers — trim the stems and stand them in a glass with about an inch of water on the COUNTER (never the fridge; cold turns basil black), loosely tent with a bag, good about a week. Longer: freeze — chop into ice-cube trays with olive oil or water, or blend into pesto and freeze (blanch whole leaves 2 seconds + an ice bath first). Drying works but loses the most flavor; frozen in oil or as pesto keeps it best."},
  rosemary:{ongoing:true, badge:"✂️ Pick as needed", hdrNote:"as needed", signsLabel:"🍴 When to pick", signs:"No schedule — rosemary is an evergreen shrub, so the harvest window is simply whenever a recipe calls for it. Nothing bad happens if you never pick it. Best to cut in mid-morning, after the dew dries and the sun has warmed the plant slightly — its resinous oils run highest in the morning, so that is when the sprigs are most fragrant.", how:"Pick when cooking, in the mid-morning for peak oils: snip the top 2–4 inches of soft green new growth, cutting JUST ABOVE a leaf node — never cut into the woody brown stems, which are slow or unable to regrow and may leave a dead stub. Cutting the soft tips encourages bushier, more compact regrowth. Strip the needles backward off the stem to use, and take no more than a third of the plant in one go.", fact:"Got more than the recipe needs? Fresh sprigs keep ~2 weeks in the fridge wrapped in a barely-damp paper towel inside a bag. Longer: rosemary is the herb that DRIES best — hang a small bundle upside-down somewhere warm and airy about a week (the greenhouse drying rack is perfect), then strip the needles into a jar; good ~6 months. Or freeze whole sprigs in a zip bag and snap off what you need."},
  parsley:{ongoing:true, badge:"✂️ Pick as needed", hdrNote:"as needed", signsLabel:"🍴 When to pick", signs:"No schedule — pick when you are cooking. Any stem with full-size leaves is fair game; it regrows from the center all season long. Early-to-mid morning, once the dew has dried, gives the crispest, most flavorful stems and avoids spreading disease on wet foliage. The outer stems mature first.", how:"Harvest in the morning, from the outside in: cut the outermost, oldest full-size stems right at the base near the soil line (scissors, not tearing), and leave the young inner growth at the center to keep producing — cutting full outer stems at the base is what drives continuous regrowth from the crown, not snipping leaf tips. Never take more than about a third (up to half) of the stems at once.", fact:"Keeping it: stand the stems like a bouquet in a glass with an inch of water in the FRIDGE, loosely bagged — good ~2 weeks (parsley loves the cold; basil hates it). Longer: chop and pack into ice-cube trays with water or olive oil and freeze — curly parsley loses nearly all its flavor dried, so freezing is the move."},
  dill:{ongoing:true, badge:"✂️ As needed + bud patrol", hdrNote:"as needed", signsLabel:"🍴 When to pick (+ the one required job)", signs:"Fronds: no schedule — snip as you cook, ideally in the early morning after the dew dries but before the heat, when the feathery foliage holds the most essential oil and aroma. The ONE required job: cut flower heads the moment they appear or leaf production stops — or deliberately let one head go to seed for dill seed.", how:"In the morning, snip the outer and upper feathery fronds with clean scissors where a frond meets the main stem, as you need them for cooking. Pinch the central growing tip early to encourage branching and delay bolting. When you cut a flower head, the plant is telling you it wants to bolt — keep patrolling, it will keep trying in summer heat. For seed, cut a whole browned umbel and dry it in a paper bag.", fact:"Keeping it: dill wilts fast — stand it in a glass of water in the fridge, loosely bagged, ~1 week. Longer: chop the fronds into ice-cube trays with water and freeze (far better than drying, which loses most of the flavor). For dill seed: let one head brown on the plant, then hang it upside-down inside a paper bag to catch the seeds."},
  strawberry:{ongoing:true, signs:"Ready when the berry is deep, glossy red all the way to the shoulders and stem — no white or pale patches near the top — with a slight give to a gentle squeeze and a sweet fragrance. Ripe ones come off with the lightest tug. Pick in the cool of the morning, after the dew dries: the berries are firmest then, sugars concentrate overnight, and cool fruit bruises less and stores longer than berries picked in afternoon heat.", how:"Pick in the morning, only when fully, evenly red. Pinch or snip the stem about half an inch above the berry and leave the green cap and a short stem attached so it does not rot at the scar or bruise — never pull the fruit off by its body. Support each berry in your palm and lay them in a wide shallow tray (do not pile them deep, they crush under their own weight). Only a few are ripening at a time right now, so it is an occasional pick — check the plants every few days and take only the fully red ones.", fact:"Strawberries do not ripen any further once picked, so wait for full red."},
  strawberry_pot:{ongoing:true, signs:"Check every pocket — a berry is ready when it is fully, evenly red to the shoulders with a slight give and a fragrant smell. Pockets ripen on their own schedule, so there is almost always one ready, and ripe ones hide behind the leaves. Berries in the lower and front pockets get more reflected heat and ripen faster than the shaded back pockets, so judge each by color, not by jar position. Pick in the morning after the dew dries, when the berries are firmest and sweetest.", how:"Do a quick morning walk-around of every pocket. Pick each berry only when fully red, pinching or snipping the stem about half an inch above the berry and keeping the green cap on so you do not bruise it — never tug. Rotate the jar every few days so all pockets get even sun, and watch the berries dangling out of pockets, which slugs find first. Only a few are ripening at a time right now — check the pockets every few days and take only the fully red ones.", fact:"A strawberry pot gives a longer, staggered picking season than a single plant."},
  cherry_tomato:{ongoing:true, signs:"Coloring up now — the first cherries are turning red. They are ready when fully, deeply colored to the shoulders, slightly soft, and releasing with a light tug. Pick in the morning after the dew dries, when the fruit is firmest and sweetest and the foliage is dry (so you avoid spreading fungal spores). Check every 1–2 days.", how:"Harvest in the morning. Pinch the stem at the knuckle (the swollen joint in the stem) and twist gently, or just roll the ripe cherry off between thumb and finger — they release readily when ripe. If a whole spray is ripe, harvest the whole truss at once. Leave the green ones to finish and avoid squeezing. Check daily once they start coloring.", fact:"Left too long they split, so pick promptly once they color up."},
  jalapeno:{ongoing:true, badge:"🌶️ Pick as they mature", hdrNote:"green or red", signsLabel:"🌶️ When to pick", signs:"Harvest a jalapeño green once it has reached full size for its variety and feels firm, smooth, and glossy. Green fruit has the familiar crisp, bright heat. For a sweeter, fruitier, and usually hotter pepper, leave it attached until it turns fully red. Check by size, firmness, and color each time rather than relying on a fixed date.", how:"Harvest in the cool morning with clean scissors or pruners. Support the branch with one hand and snip each pepper with a short piece of stem attached; do not pull or twist hard, because pepper branches split easily. Picking mature green fruit encourages continued production, while leaving selected fruit to turn red gives a different flavor. Refrigerate fresh peppers unwashed in a loose bag and wash just before use.", fact:"The same plant can supply crisp green jalapeños and sweeter red ones; harvest stage is a flavor choice."},
  green_onion:{ongoing:true, badge:"✂️ Snip as needed", hdrNote:"as needed", signsLabel:"🍴 When to pick", signs:"No schedule — snip the green tops whenever you cook. They are ready as soon as the tops are firm, upright, and at least pencil-thick; no need to wait for any bulbing, since scallions are best young and tender. Cut in the cool of the morning, which keeps the tops crisp and turgid — they wilt fast if cut in afternoon heat. Take the tallest outer tops and leave the rest to keep regrowing.", how:"In the morning, cut the green tops about an inch above the white base with scissors, leaving the roots and base in each pot so they can regrow for a second and third cutting. Or pull a whole onion straight up by the soil line, roots and all, if you want the white part too. No curing needed — use fresh.", fact:"Keeping them: stand cut green onions in a glass with an inch of water on the counter or fridge, loosely bagged — they keep a week-plus and even keep growing. Longer: chop and freeze in a bag for cooking."},
  potato:{signs:"Not yet — the potatoes are sizing up underground (~70–90 days from planting). The signal to dig is when the foliage yellows, flops, and dies back (~90–120 days), which means the plant has finished bulking and the skins have thickened. For a few tender new potatoes you can sneak a hand in a couple weeks after any flowering. Harvest on a dry day — time of day matters less than the soil being dry, since wet-soil harvest damages and rots tubers.", how:"Stop watering 1–2 weeks before the main harvest so the skins set for storage. When the tops have died back, pick a dry day, tip the felt grow bag out onto a tarp, and sift the tubers from the soil by hand — far easier than digging, and you will not spear them with a fork. For new potatoes, instead reach in along the side and pull a few by hand without uprooting the plant, then re-cover. Brush off the dirt — don't wash storage potatoes until you're ready to use them.", fact:"Keeping them: cure harvested potatoes a few days in a cool, dark, airy spot to toughen the skins, then store cool and dark — never the fridge, and away from onions. Cut off any green patches (light exposure)."},
  white_onion:{signs:"Not yet — the bulb is sizing up (~90–110 days). It's ready when the neck softens and the green tops naturally flop over and start to yellow and brown on their own, and the papery outer skins firm up. Don't bend the tops down yourself — forcing it lowers yield and storage quality. Harvest on a dry, sunny day, ideally mid-morning once the dew is off, so the bulb and tops dry and cure cleanly.", how:"Once most of the tops have flopped and dried at the neck, stop watering, then on a dry mid-morning loosen the soil and lift the bulb gently by hand (easy in a shallow pot — work around the neighboring potato and scallion roots). Don't pull hard by the tops, which bruises the neck and invites rot. Cure for 2–4 weeks in a warm, dry, shaded, well-ventilated spot with the tops left on until the neck is fully dry and the outer scales are papery, then trim the roots and tops for storage.", fact:"Keeping it: cure the onion in a single layer somewhere dry, airy, and shaded for 1–2 weeks until the neck is papery, then trim the roots and store cool and dry. Well-cured onions keep for months."},
  tomato:{ongoing:true, signs:"It's started! The first big fruit is turning yellow/pink (the breaker stage, where the blossom end first breaks from green to pink/orange). It's vine-ripe when colored all the way to the shoulders with a slight give to a gentle squeeze and it releases easily — or pick at the breaker stage and finish it on the counter. Pick in the morning, after the dew dries: the fruit is firmest and coolest, sugars are highest, and you avoid spreading fungal spores on wet foliage. The rest are still green and coming.", how:"Harvest in the morning. Cradle the fruit and gently twist or bend at the knuckle (the swollen joint in the stem) until it snaps off, leaving the green calyx on the fruit. For big heirlooms with tough stems, snip the stem with pruners instead of yanking, so you do not damage the cluster or pull the plant against its stake. Or pick at first blush and ripen on the counter (stem-up, out of direct sun, 70–75F) to beat cracking, sunscald, hail, and critters. Never refrigerate until dead ripe — cold kills the flavor.", fact:"Counter-ripening from the breaker stage protects the fruit from splitting."},
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
  { id:"rem_get_herbs",       standing:true,     emoji:"🌿", text:"Get thyme plant/seeds" },
  { id:"rem_flip_leads",      date:"2026-06-13", emoji:"🎯", text:"Yesterday's flip leads (if still up): free 83-inch OLED in Thornton (boards alone sell $100+), $0 Samsung Neo QLED 55 in Conifer, $0 broken TV in Tech Center, $0 WORKING 42-inch flatscreen downtown — hit the Craigslist free section first thing." },
  // ── 🦐 AQUARIUM #5 nitrite recovery — daily distilled water changes until NO2 = 0 (added Jun 18 2026) ──
  { id:"aq_0618", date:"2026-06-18", emoji:"🦐", text:"Aquarium #5 — 30% distilled water change (temp-matched + small tap splash for KH ~50–60), re-dose Prime, retest nitrite (NO2). Hold feeding." },
  { id:"aq_0619", date:"2026-06-19", emoji:"🦐", text:"Aquarium #5 — repeat 30% change + Prime + retest NO2. Hold feeding if NO2 > 0." },
  { id:"aq_0620", date:"2026-06-20", emoji:"🦐", text:"Aquarium #5 — repeat 30% change + Prime + retest NO2." },
  { id:"aq_0621", date:"2026-06-21", emoji:"🦐", text:"Aquarium #5 — repeat 30% change + Prime + retest NO2." },
  { id:"aq_0622", date:"2026-06-22", emoji:"🦐", text:"Aquarium #5 — retest NO2; stop daily changes once NO2 = 0, then resume feeding." },
  { id:"wt_0628", date:"2026-06-28", emoji:"🌊", text:"Wide Tank #4 — test the cycle (NH3/NO2/NO3). NO water changes while cycling. Air 24/7, ~78–80°F. Watch NO2 rise then fall to 0 as NO3 climbs = cycle finishing. Test every 3 days." },
  { id:"wt_0701", date:"2026-07-01", emoji:"🌊", text:"Wide Tank #4 — cycle test (NH3/NO2/NO3). No water changes. Watch for the nitrite spike, then the drop back to 0." },
  { id:"wt_0704", date:"2026-07-04", emoji:"🌊", text:"Wide Tank #4 — cycle test (NH3/NO2/NO3). No water changes. STOP when NH3=0, NO2=0, NO3 present." },
  { id:"wt_0707", date:"2026-07-07", emoji:"🌊", text:"Wide Tank #4 — cycle test (NH3/NO2/NO3). No water changes. When NH3=0, NO2=0, NO3 reads on its own, age ~2 weeks before adding shrimp." },
  { id:"inc_0619", date:"2026-06-19", emoji:"💵", text:"Income — Day 1: sign up + complete profiles on UserTesting, UserCrowd, Respondent.io, User Interviews; do UserTesting's required sample test (~30 min)." },
  { id:"wr_0620", date:"2026-06-20", emoji:"🧹", text:"Weekend reset — Sat: entryway/mail + key drop (easy) · a closet or bathroom (medium) · the worst room — garage/storage (hard)." },
  // ── 🍳 Kitchen reset — Friday's kitchen work rolled onto today (Sat 6/20), split easy/medium/hard (added Jun 20 2026) ──
  { id:"kr_easy_0620", date:"2026-06-20", emoji:"🟢", text:"EASY (~15 min) — Clear & wipe all kitchen counters; sweep every homeless item into one 'to-sort' box." },
  { id:"kr_med_0620", date:"2026-06-20", emoji:"🟡", text:"MEDIUM (~45 min) — Reset ONE zone: empty the everyday dishes & glasses cabinet by the dishwasher, sort keep/donate/trash, wipe, put back." },
  { id:"kr_hard_0620", date:"2026-06-20", emoji:"🔴", text:"HARD (~2–3 hr) — Reset the food + cooking zones: pantry/food cabinet by the fridge + pots & pans around the stove; everything to its permanent home." },
  { id:"inc_0620", date:"2026-06-20", emoji:"💵", text:"Income — Day 2: take any usability tests you qualify for; start uTest Academy; open a Bug Journal (~20 min)." },
  { id:"wr_0621", date:"2026-06-21", emoji:"🧹", text:"Weekend reset — Sun (optional/light): finish any spillover, run the donate pile to dropoff, log income progress." },
  // ── 🐛 GARDEN PEST follow-ups — spinosad re-spray + Mosquito Bits (Bti) + sticky-trap checks (added Jun 20 2026) ──
  { id:"pest_spray_0626", date:"2026-06-26", emoji:"🐛", text:"Re-spray Captain Jack's Deadbug (spinosad), indoor + outdoor — evening. Dose 2 of 3 (thrips/aphids; repeat every 7–10 days)." },
  { id:"pest_bits_0626", date:"2026-06-26", emoji:"🦟", text:"Reapply Mosquito Bits (Bti) to indoor plant soil — fungus-gnat control (repeat weekly ~3 weeks)." },
  { id:"rem_claude_downgrade", date:"2026-06-26", emoji:"📉", text:"Downgrade Claude subscription" },
  { id:"pest_spray_0703", date:"2026-07-03", emoji:"🐛", text:"Re-spray Captain Jack's Deadbug (spinosad), indoor + outdoor — evening. Dose 3 of 3." },
  { id:"pest_bits_0703", date:"2026-07-03", emoji:"🦟", text:"Reapply Mosquito Bits (Bti) to indoor plant soil — week 2." },
  { id:"pest_traps_0703", date:"2026-07-03", emoji:"🟨", text:"Check / replace indoor yellow sticky traps — swap any that are covered." },
  { id:"pest_bits_0710", date:"2026-07-10", emoji:"🦟", text:"Reapply Mosquito Bits (Bti) to indoor plant soil — week 3 (final; breaks the fungus-gnat cycle)." },
  // ── 🎣 COMO / MONTGOMERY RESERVOIR TRIP (Jul 2–5) — added Jul 2 2026; range reminder auto-expires after 7/5 ──
  { id:"rem_trip_plan", date:"2026-07-02", dateEnd:"2026-07-05", emoji:"🎣", text:"Como / Montgomery Reservoir trip (Jul 2–5) — full plan: packing, meals, salad & fishing", link:"trip.html" },
  { id:"rem_trip_pack", date:"2026-07-02", emoji:"🎒", text:"Pack for Como: rod/hooks/worms/hemostats/license, food + cooler, herbs (basil/parsley/dill/rosemary), charge devices, book + camera by the door" },
  { id:"rem_trip_go", date:"2026-07-02", emoji:"🚗", text:"Leaving for Como: check work messages, load car + cooler, grab herbs/food/gear, Golden appointment, then drive to Conifer" }
];

// ── 🚙 DMV — daily reminder to call for an earlier cancellation slot, through the appointment date.
// Appt defaults to Jun 25, editable in-app via laundry["dmv-appt"]; the daily reminder retires once
// todayKey() passes the appointment, and the appointment shows on the TIMELINE. (added Jun 8 2026)
const DMV = { defaultDate:"2026-06-25", text:"Call the DMV to check for an earlier cancellation slot." };

// ── 📞 TG MEETING — recurring weekly anchor: every Wednesday (dow 3) at 6:30 PM. Loud CALL-DT styling on
// Today (every Wed) + Timeline. Done-state date-keyed in `laundry` ("rem-tg-"+todayKey()) so it returns weekly. (added Jun 9 2026)
const TG_MEETING = { id:"tg", label:"TG Meeting", dow:3, at:"6:30 PM", min:1110 };

const BURN_CARE = {
  start:"2026-06-10",                           // first day of the daily care nag
  end:"2026-06-23",                             // last day of the daily nag (~2 weeks of healing)
  endLabel:"Jun 23",
  infectionDates:["2026-06-12","2026-06-13"],   // early infection-check days (day 2–3)
  siliconeDate:"2026-06-24"                     // from here on, nudge the silicone-gel switch until checked once
};

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
      { id:"ft_xfinity",   label:"📡 Xfinity retention call — target $135 → $70–90 (CenturyLink is ~$55)" },
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
    { id:"mon_xfinity",   label:"📞 Xfinity retention call — get $135 down to ~$70–90", note:"Say 'cancel service' at the prompts to reach Retention. Leverage: CenturyLink Simply Unlimited is ~$55/mo at your address — you're not switching, it's the price-match lever. Full script on the ✅ To-dos sub-tab." },
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
    { t:"Say the magic words on the Xfinity call", b:"\"CenturyLink Simply Unlimited is $55 a month at my address.\" That is the leverage line. Target $70–90 and keep cable for gaming ping. Five minutes could be worth $50+ every month." },
    { t:"Keep the cards open until they are paid", b:"Closing cards early hurts more than it helps. The two annual-fee Credit One cards DO get closed — but only after their balances hit zero." },
    { t:"Do not budget perfectly — budget simply", b:"First budget ever? Perfect is the enemy. Update balances when you think of it, check bills off as they are paid, glance at the gap. That is the whole job — you are already doing it." }
  ]
};
