// ═══════════════════════════════════════════════════════════════
// data.js — APP DATA (extracted from index.html, item-6 refactor)
// Classic script: these top-level consts share global lexical scope
// with the inline <script> in index.html, which loads AFTER this file.
// Objects: ROOMS, TASKS, SCHEDULE, PLANTS, PLANT_INFO, WATER_INFO,
//          FUN_FACTS, CARE_INFO, HARVEST_INFO.
// Plant display chips are informational. For checkOnly pots, `days` is the soil-check interval, not a watering frequency.
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
  goal: "Build a lean, healthy, capable body and durable habits; strength supports the goal without chasing bodybuilding size.",
  installation: "Treat the first 90 days as habit installation, not a pass/fail streak.",
  litfuloActive: true,
  proteinRange: "120–150 g/day; aim for roughly 30–45 g at each of 3 meals.",
  hydrationRange: "2–3 liters/day, with extra fluids or electrolytes after heat, sweating, moving, hiking, yard work, or depletion.",
  rescueMeals: [
    "Greek yogurt + granola + berries",
    "Protein shake + banana",
    "Cottage cheese + crackers/fruit",
    "Turkey/chicken sandwich",
    "Peanut butter toast + milk",
    "Leftovers microwaved",
    "Cereal + milk + Greek yogurt",
    "Frozen meal plus extra protein",
    "Quesadilla + avocado, hot sauce, green chile, or enchilada sauce"
  ],
  restart: {
    moveDate: "2026-08-30",
    minimumDate: "2026-08-31",
    onRampStart: "2026-09-01",
    onRampEnd: "2026-09-06",
    formalStart: "2026-09-07",
    anchors: ["Water on waking", "Dog/property walk", "Plant check or harvest", "Hygiene", "Protein breakfast", "Mandatory lunch", "Movement matched to readiness", "Dinner", "Evening shutdown"],
    morningMinimum: ["Water", "Brush teeth, wash face, deodorant", "Feed and briefly walk Zoey", "Protein breakfast + Litfulo", "Start work"],
    hygieneMorning: ["Brush teeth", "Wash face", "Deodorant", "Hair/scalp check", "Clean clothes", "Litfulo with breakfast"],
    hygieneEvening: ["Brush teeth", "Rinse or wash face", "Stage tomorrow's hygiene items", "Put the water bottle in place"],
    tutorialStrength: ["Chair stand-ups — 6–8 reps", "Counter pushups — 6–8 reps", "Hip hinge practice — 8 reps", "Supported one-arm dumbbell row — 6 each side", "Suitcase carry — 20 seconds each side", "Lying knee taps — 5 each side"],
    readiness: ["No strength workout when underfed, dehydrated, exhausted, sick, injured, or past bedtime", "Poor sleep or low energy: reduce volume 20–30% or walk", "Joint pain: substitute or skip the loaded movement", "Work interruptions are expected; pause and resume without penalty"]
  },
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
      startDate: "2026-09-07",
      rules: [
        "Week 1 starts with one easy round at RPE 5; stop with energy left.",
        "No failure, max reps, or soreness hunting.",
        "Food, water, sleep, illness, injury, and rescue mode override the workout schedule.",
        "No THC before workouts while form is being rebuilt.",
        "Jaw exerciser rides with strength days only: easiest level first, slow controlled reps, no pain."
      ],
      jaw: {
        title: "Jaw exerciser finisher",
        schedule: "Strength days only (Mon / Wed / Fri)",
        text: "Easiest level: 2 sets of 12 slow controlled bites. Rest 30-60 seconds between sets. Stay on the easiest level about 4 weeks, then move up only when it feels easy and pain-free.",
        cautions: [
          "Do it after lifting or seated during long rests; do not chew while bracing under load.",
          "Stop for clicking, jaw pain, headache, tooth pain, gum pain, or dizziness.",
          "Skip if TMJ issues, braces or retainers, or recent dental work are active."
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
      strengthA: ["Goblet Squat", "Dumbbell Floor Press or Counter Pushup", "One-Arm Dumbbell Row", "Dumbbell Romanian Deadlift", "Farmer Carry", "Lying Knee Taps or Dead Bug"],
      strengthB: ["Chair Squat or Supported Reverse Lunge", "Standing Dumbbell Overhead Press if Arm Feels Normal", "Supported One-Arm Dumbbell Row", "Glute Bridge", "Dumbbell Curl", "Side Plank"],
      strengthC: ["Supported Split Squat or Goblet Squat", "Incline Pushup", "Dumbbell Romanian Deadlift", "One-Arm Dumbbell Row", "Farmer Carry", "Bird Dog"]
    }
  }
};

// ── ✨ FACE + SKIN CARE — Beauty handoff, 2026-08-29 ──────────
// Product IDs feed a dedicated Today checklist. This state never enters Food/Groceries.
const BEAUTY_CARE = {
  updated: "2026-08-29",
  goal: "Healthier-looking skin, less visible clogged pores, and a simple anti-aging routine that becomes automatic.",
  profile: "Minor clogged pores and likely sebaceous filaments across the face, worst around the nose edges; some blackheads; almost no current face-washing routine; mustache, goatee, and soul patch; no major product sensitivity reported.",
  minimum: {
    morning: ["Brush teeth", "Rinse or gently wash face", "Moisturizer", "SPF 30+ when outside, driving, doing yard work, walking Zoey, or near bright windows"],
    night: ["Brush teeth", "Wash face gently for 45-60 seconds", "Moisturizer"]
  },
  products: [
    { id:"cleanser", label:"Gentle facial cleanser", stage:"Starter · buy first", note:"Fragrance-free, non-comedogenic, and no gritty scrub beads." },
    { id:"moisturizer", label:"Lightweight facial moisturizer", stage:"Starter · buy first", note:"Fragrance-free and non-comedogenic; ceramides, glycerin, niacinamide, or panthenol are good signs." },
    { id:"sunscreen", label:"Broad-spectrum sunscreen SPF 30+", stage:"Starter · buy first", note:"Non-comedogenic or oil-free. Mineral zinc oxide is the natural-leaning option; do not make sunscreen at home." },
    { id:"bha", label:"Leave-on 2% salicylic acid / BHA", stage:"Later · before Week 3", note:"Liquid or gel for clogged areas. Buy now if convenient, but do not start during Weeks 1-2." },
    { id:"retinoid", label:"Choose ONE: adapalene 0.1% gel OR gentle retinol", stage:"Later · before Week 5", note:"Do not buy both. Adapalene is the stronger OTC option; retinol is the gentler start. Choice remains open." }
  ],
  phases: [
    { title:"Weeks 1-2 · install the baseline", steps:["Morning: rinse or gentle cleanse, moisturize, and use SPF for light exposure.", "Night: gentle cleanser, then moisturizer.", "No acids, retinoids, scrubs, or aggressive masks yet."] },
    { title:"Weeks 3-4 · add pore treatment", steps:["Add 2% salicylic acid / BHA once weekly at night.", "After two calm uses, increase to two nights per week.", "Cleanse, BHA, then moisturize; stop if skin becomes irritated."] },
    { title:"Weeks 5-8 · add texture + aging treatment", steps:["Add adapalene 0.1% OR gentle retinol one night per week.", "Keep BHA and the retinoid on different nights at first.", "If calm, slowly build the retinoid toward two to four nights per week; keep moisturizer-only nights."] }
  ],
  longTerm: ["BHA one or two nights per week", "Adapalene or retinol two to four nights per week if calm", "Clay mask zero or one time per week", "Moisturizer-only nights whenever skin feels dry, tight, irritated, or overworked"],
  fullMorning: ["Use cleanser if sweaty or oily; use lukewarm water if dry or tight.", "Moisturize with a lightweight, fragrance-free product.", "Apply SPF to face, ears, neck, back of neck, and exposed scalp or hairline.", "Keep beard oil or balm away from clogged nose-edge skin."],
  fullNight: ["Massage gentle cleanser for 45-60 seconds at nose edges, chin, forehead, and facial-hair borders; do not scrub.", "Use a treatment only on its scheduled night.", "Moisturize after cleansing or treatment.", "While on Litfulo, do not pick painful bumps, spreading redness, pus, an unusual rash, cold sores, shingles-like pain or blisters, or folliculitis; contact the clinician if it looks infected or spreads quickly."],
  stopRule: "If clogged pores worsen, painful acne appears, or folliculitis or a rash appears after restarting Litfulo, pause new actives and ask the dermatologist.",
  weekly: ["Wash the pillowcase and face towel.", "Clean the trimmer guard and any sponges or brushes.", "Trim mustache and goatee edges; check brows, ears, nose hair, nails, scalp, and skin.", "Refill the visible bathroom station: cleanser, moisturizer, sunscreen, floss, and deodorant."],
  optional: ["Kaolin or bentonite clay powder for a rinse-off mask, at most weekly", "Colloidal oatmeal for a 5-10 minute soothing mask", "Plain petroleum jelly for isolated dry or cracked areas only", "Simple beard detailer and floss picks or a water flosser if useful"],
  avoid: ["Picking, squeezing, scraping, regular pore strips, or harsh physical scrubs", "Lemon juice, apple cider vinegar, baking soda, toothpaste, peroxide, or essential oils on the face", "Coconut or olive oil on clogged areas, homemade sunscreen, or at-home dermarolling / microneedling", "Starting BHA and a retinoid together or stacking actives because the mirror is annoying that day"]
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
  measure_printer:{ room:"office",   label:"Measure the 3D printer — width, depth, height + room for spools and cables", level:"easy", note:"Do this before buying a desk so you know exactly what fits." },
  move_bath_water_damage: { room:"priority", label:"Protect the deposit: bathroom-sink water damage", level:"moderate", emoji:"💧", todayTime:"Start now", todayDuration:"document first", note:"Old house. Document everything, stop an active leak only when it is safe, notify management in writing, and dry or repair only with clear approval. Do not conceal damage.", steps:["Photograph or video the sink, cabinet, floor, leak source, and water damage before touching anything.","If water is actively leaking, use a tray or towels and close the under-sink shutoff only if it turns easily and is safely reachable.","Report the leak and damage in writing. Check the lease and get written approval before replacing plumbing, cabinet material, drywall, or flooring.","After the leak is stopped and the area is electrically safe, empty the cabinet and dry it with airflow or a dehumidifier.","Save messages, receipts, and before-and-after photos. Do not paint over, caulk over, or hide damage.","Stop and use maintenance or a plumber if a valve is stuck, water is near electricity, a pressurized line or sewage is involved, material is soft or swollen, or visible or musty mold is present."] },
  move_new_condition: { room:"priority", label:"Document the new house + make a fragile landing zone", level:"easy", emoji:"📸", todayTime:"Before more moving", todayDuration:"15 min", note:"Protect yourself and make the first fragile loads easy: record the condition before cleaning or moving more items, then choose one dry, secure landing area.", steps:["Photograph or video each room, the floors, and any existing marks or damage before cleaning or moving more items in.","Record accessible utility-meter readings and keep a dated copy of the photos.","Choose one dry, lockable or otherwise secure area where TVs, framed art, and empty aquariums can land safely.","Measure rooms, doorways, stairs, and tight turns while you are there so furniture purchases fit."] },
  move_services_transfer: { room:"priority", label:"Schedule old-house utility shutoff + move internet", level:"easy", emoji:"⚡", todayTime:"High priority", todayDuration:"one call block", note:"Start or confirm the new-house services first. Keep the old-house utilities on through final cleaning, inspection, and key return, then shut them off on the confirmed date.", steps:["List the electric, gas, water, and trash services that apply at each address; do not assume a provider or date.","Start or confirm the needed new-house services before ending the old ones.","Transfer or install internet at the new house and confirm the appointment, equipment, and service address.","Schedule old-house utility and internet shutoff only after final cleaning, inspection, and key return.","Save confirmation numbers, dates, and screenshots or emails."] },
  move_call_joel: { room:"priority", label:"Call Joel — washer/dryer + early move agreement", level:"easy", emoji:"📞", todayTime:"High priority", todayDuration:"one call", note:"Make one call cover the washer and dryer, possible rent back, and the exact move-out handoff. Get any agreement in writing.", steps:["Ask whether Joel wants to buy the washer and dryer; agree on price and who will disconnect and move them.","Ask whether surrendering the old house early can earn prorated rent back.","Confirm inspection timing, key return, and security-deposit expectations.","Ask for any agreement or approval in writing and save it."] },
  move_carpet_po: { room:"priority", label:"PO-meeting floor run: cleaner → enzyme cleanser → new house", level:"moderate", emoji:"🧼", todayTime:"PO-meeting route", todayDuration:"one trip", note:"Keep this exact order. The enzymatic pet-urine treatment comes before machine cleaning, and the product label decides the dwell, drying, and machine steps.", steps:["Load the empty, dry carpet cleaner in the vehicle before leaving for the PO meeting.","Attend the PO meeting.","After the meeting and before going to the new house, buy a carpet-safe enzymatic pet-urine cleanser.","At the new house, photograph or map the pre-existing floor condition and odor spots, ventilate, and test a hidden patch.","Apply the enzyme cleanser exactly as labeled and allow its full dwell and drying time. Do not mix it with bleach, ammonia, deodorizer, or another cleaner.","Use the carpet machine only if the flooring, machine, and cleanser directions allow it. Do not put the enzyme product in the machine unless its label explicitly says to; avoid steam or hot water first.","Keep people and pets off the treated area until fully dry. Pause for professional or property-manager help if damage is widespread, padding or subfloor seems affected, mold is visible, or odor remains after correct treatment."] },
  move_old_sink: { room:"priority", label:"Diagnose and repair or arrange repair for the old-house sink", level:"moderate", emoji:"🔧", todayTime:"Deposit priority", todayDuration:"diagnose first", note:"Old house. Identify and document the actual problem before buying parts or taking anything apart; use written approval when the lease or damage makes responsibility unclear.", steps:["Photograph the symptom, fixture, plumbing, and under-sink area before work begins.","If it is leaking, use a tray and close the local shutoff only if it is safe and turns easily.","Identify the exact leak, clog, fixture, model, or failed part and check the lease or written maintenance responsibility.","DIY only when the fix is clear, safe, and allowed; otherwise report it and arrange maintenance or a plumber.","Keep receipts, messages, and before-and-after photos for the deposit record."] },
  move_furniture_watch: { room:"priority", label:"Measure first, then shop cheap furniture for confirmed new-house gaps", level:"easy", emoji:"📏", todayTime:"After measurements", todayDuration:"optional browse", note:"Buy only what the measured new house actually needs and arrange pickup or delivery directly there so it never joins the move.", steps:["Use the new-house room, doorway, stair, and turn measurements before shopping.","Write the maximum size and budget for each confirmed gap.","Shop Marketplace, Craigslist, OfferUp, or sales; include a sturdy 3D-printer desk if it is still needed.","Inspect used upholstered pieces for pests, smoke, urine, and moisture before buying.","Confirm pickup or delivery directly to the new house."] },
  move_address: { room:"priority", label:"Forward mail + update essential addresses and insurance", level:"easy", emoji:"📬", todayTime:"Move admin", todayDuration:"15 min", note:"Set the forwarding handoff, then update the accounts where a wrong address could cost money or cause a missed notice.", steps:["Submit USPS mail forwarding and save the confirmation.","Update employer or payroll, banks and cards, insurance, DMV, prescriptions, and essential subscriptions.","Confirm the new home is covered by the correct insurance from the right date.","Keep a short list of anything that must wait until the final move date."] },
  sv06_sock:      { room:"priority", label:"🧤 Order SV06 silicone sock (2-pack) — Sovol SV06 hotend sock", level:"easy" },
  sv06_fan:       { room:"priority", label:"🌬️ Order replacement SV06 Plus fan (24V) — the screamy one: 4010 = hotend heatsink fan, 4020 = part-cooling blower; replace whichever's loud (or both)", level:"easy" },
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
  move_stage:     { room:"priority", label:"Set up one moving staging zone", level:"easy", note:"Use one clear area for packed boxes. Label three sections: PACKED, DECISION HOLD, and OPEN LAST. Do not make destination-dependent keep-or-discard decisions yet." },
  move_supplies:  { room:"priority", label:"Gather moving supplies and start a move folder", level:"easy", note:"Boxes, tape, marker, bags, labels, and one folder for lease, IDs, receipts, and moving information. Keep IDs and essential documents accessible." },
  move_decor:     { room:"priority", label:"Pack one labeled box of decor and display items", level:"easy", note:"One box is enough. Pack only obvious nonessentials you would take anywhere; stop after the box is labeled and in the staging zone." },
  move_clothes:   { room:"priority", label:"Pack one labeled box of off-season clothes", level:"easy", note:"Keep current-week clothing accessible. Destination-dependent clothing decisions go into DECISION HOLD." },
  move_books:     { room:"priority", label:"Pack one labeled box of books or media", level:"easy", note:"One box, clearly labeled with room and contents. No forced selling or donating." },
  move_hobby:     { room:"priority", label:"Pack one labeled box of hobby or office extras", level:"easy", note:"Choose supplies you will not use before the move. Keep work essentials and current projects accessible." },
  move_reset:     { room:"priority", label:"Tolerable-house reset: trash, dishes, laundry, walkway", level:"easy", note:"No deep cleaning. Remove trash, contain dishes and laundry, and clear one safe walking path. Stop when the house feels usable." },
  move_books_aug03:  { room:"priority", label:"Pack one labeled box of books or media", level:"easy", note:"One destination-safe box only. Label the room and contents, then stop." },
  move_hobby_aug05:  { room:"priority", label:"Pack one labeled box of hobby or office extras", level:"easy", note:"Choose supplies you will not use before the move. Keep work essentials and current projects accessible." },
  move_stage_aug06:  { room:"priority", label:"Restore the moving staging area", level:"easy", note:"Spend ten minutes restoring the labeled PACKED / DECISION HOLD / OPEN LAST sections. Stop when every box has a clear place." },
  move_decor_aug07:  { room:"priority", label:"Pack one labeled box of decor and display items", level:"easy", note:"Pack only obvious nonessentials you would move anywhere. Label the room and contents, then stop." },
  move_reset_aug08:  { room:"priority", label:"Tolerable-house reset: trash, dishes, laundry, walkway", level:"easy", note:"No deep cleaning. Spend ten minutes making the house usable, then stop." },
  move_linens_aug09: { room:"priority", label:"Pack one labeled box of spare linens", level:"easy", note:"Pack spare towels, sheets, or blankets you will not need before moving. Keep one working set accessible." },
  move_docs_aug10:   { room:"priority", label:"Secure essential documents and small valuables", level:"easy", note:"Spend ten minutes putting IDs, lease papers, moving receipts, and small valuables into one carry-with-me folder or container. Keep it accessible." },
  move_supplies_aug11:{ room:"priority", label:"Check and gather moving supplies", level:"easy", note:"Spend ten minutes gathering boxes, tape, markers, labels, and bags into the staging area. Buy or request only what is clearly missing." },
  move_clothes_aug12:{ room:"priority", label:"Pack one labeled box of off-season clothes", level:"easy", note:"Pack only clothes you will not need before moving. Keep current-week clothing accessible and put uncertain items in DECISION HOLD." },
  move_books_aug13:  { room:"priority", label:"Pack one labeled box of books or media", level:"easy", note:"One destination-safe box only. Label the room and contents, place it in PACKED, then stop." },
  move_stage_aug14:  { room:"priority", label:"Reset the moving staging area", level:"easy", note:"Spend ten minutes restoring the PACKED / DECISION HOLD / OPEN LAST sections. Leave anything that still needs new-house measurements in DECISION HOLD." },
  move_decor_aug15:  { room:"priority", label:"Pack one labeled box of obvious nonessential decor", level:"easy", note:"Choose only decor you would move anywhere. Label the room and contents, then stop after one box." },
  move_openlast_aug16:{ room:"priority", label:"Set up one OPEN LAST essentials bin", level:"easy", note:"Label one bin or box OPEN LAST and gather a short list of daily medicines, toiletries, chargers, documents, pet supplies, plant care, and final-cleaning supplies. Keep the actual essentials accessible." },
  move_checkpoint:{ room:"priority", label:"Mostly-packed checkpoint", level:"moderate", note:"Target: everything except daily essentials, the still-usable kitchen, current work gear, plant care, and final-cleaning supplies is packed and labeled by August 17." },
  move_last_week: { room:"priority", label:"Build the final-week essentials kit and pack remaining non-kitchen items", level:"moderate", note:"Keep out seven days of clothes, medicines, toiletries, chargers, documents, pet supplies, plant care, and cleaning supplies. Keep the kitchen fully usable until the final pack." },
  move_final:     { room:"priority", label:"Pack the kitchen last, remove trash, and clean emptied areas", level:"moderate", note:"Pack the kitchen during this final packing block, after everything else. Then finish open boxes, remove obvious trash, and clean only cleared surfaces and floors." },
  move_out:       { room:"priority", label:"Move-out day: essentials, plants, final sweep, keys", level:"moderate", note:"Load the open-last kit, documents, medicines, valuables, plants, and pet supplies last. Do one final walkthrough and return keys as required." },
};


// Historical label lookup only. These old plant instructions are not active tasks.
// Do not migrate, clear, or overwrite checked/custom task/history stores.
const RETIRED_PLANT_TASKS = {
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
};

const SCHEDULE = [
  // ── MOVING · ROLLING NO-REGRET WEEK ────────────────────────────────────────
  // ── MOVING MILESTONES ─────────────────────────────────────────────────────
  { date:"2026-08-17", tasks:["move_checkpoint"], fixed:true, note:"Mostly packed two weeks before move-out, with the kitchen still usable. Use new-house measurements to resolve fit-dependent items; anything still uncertain may remain in DECISION HOLD." },
  { date:"2026-08-24", tasks:["move_last_week"],  fixed:true, note:"Switch to the open-last essentials kit and pack remaining non-kitchen items. Leave the kitchen for the final pack." },
  { date:"2026-08-30", tasks:["move_final"],      fixed:true, note:"Pack the kitchen last, finish packing, and clean only what is already empty." },
  { date:"2026-08-31", tasks:["move_out"],        fixed:true, note:"Move-out deadline." }];

// ── MOVE LAUNCH — persistent Today priorities, separate from the one-small-task rolling schedule.
// Checked state stays in the existing `checked` store. Today writes a completion date for these new
// IDs so a just-finished card can celebrate once, then stay out of future "Completed today" drawers.
const MOVE_LAUNCH_IDS = [
  "move_bath_water_damage",
  "move_new_condition",
  "move_services_transfer",
  "move_call_joel",
  "move_carpet_po",
  "move_old_sink",
  "move_furniture_watch",
  "move_address"
];

// Optional daily boosters: date-keyed so doing one load or sell sprint clears it only for that day.
const MOVE_DAILY = [
  { id:"move-sell", start:"2026-08-11", end:"2026-08-30", emoji:"💸", tag:"Move lighter · daily option", time:"20 minutes", label:"Sell sprint — photograph and list up to 3 approved items", note:"Start with bulky or high-value things you already want gone; price for pickup. Keep daily essentials, moving and final-cleaning gear, and anything you have not decided about. Available through August 30, then this card retires." },
  { id:"move-fragile", start:"2026-08-11", end:"2026-08-30", emoji:"📺", tag:"Opportunity load · only if today fits", time:"slow workday or Monday route", label:"Move one small secured load of fragile items", note:"TVs upright and padded; empty aquariums supported under the entire base, never the rim; framed art vertical between padding. Do not leave visible valuables or glass unattended or in extreme car temperatures." }
];


// ── CURRENT PLANTS · user-authorized physical pots received Oct 6, 2026 ──────
// Fresh IDs never inherit old watering, tending, snooze, or harvest dates.
// Photo intake can continue: this adapter activates the current confirmed pots,
// not an assertion that provisional species/cultivars are now identified.
// days:1 with checkOnly:true means DAILY SOIL CHECK ONLY, never daily watering.
// User confirmed these are ALL current plants and ALL 31 were watered Oct 6, 2026.
// The source intake snapshot below retains its earlier unknown dates for provenance;
// runtime lastWatered is the explicit user-confirmed baseline, never a photo-date inference.
const PLANT_REFRESH = {
  "asOf": "2026-10-06",
  "locality": {
    "city": "Westcliffe",
    "state": "Colorado",
    "source": "user"
  },
  "confirmedPreferences": {
    "preferredWateringMethod": "bottom_watering",
    "allPotsWellDrained": true,
    "saucers": "User reports bottom catchers on all pots except plastic pots.",
    "lightAssessment": "deferred_by_user",
    "overwinterPlanning": "deferred_by_user",
    "outdoorPlants": [
      "fresh_strawberry_gray_outdoor",
      "fresh_pot1000016368"
    ],
    "temporaryOutdoorPlants": [
      "fresh_pot1000016368"
    ]
  },
  "sourceIntakeStatus": "collecting_photos",
  "sourceIntakeComplete": false,
  "activeInventory": "The user confirms these 31 physical pots are all current plants; old plants are archive-only.",
  "lastWateredConfirmation": {
    "date": "2026-10-06",
    "scope": "all31_current_plants",
    "source": "user"
  },
  "checkSchedule": "Daily soil check only, not a watering frequency. Log only real watering; defer a damp pot.",
  "legacyPlantIds": [
    "fittonia",
    "croton",
    "jade",
    "basil1",
    "basil2",
    "parsley",
    "mint",
    "dill",
    "rosemary",
    "strawberry",
    "strawberry_pot",
    "tomato",
    "cherry_tomato",
    "jalapeno",
    "raspberry",
    "green_onion",
    "potato",
    "potato_sprout",
    "ginger",
    "dianthus",
    "daisy",
    "candytuft"
  ]
};
const PLANT_INVENTORY_20261006 = [
  {
    "id": "fresh_pot120734",
    "reviewId": "pot120734",
    "name": "Jade plant — terracotta with figurine",
    "emoji": "🪴",
    "plantType": "jade",
    "careTemplateKey": "jade",
    "identification": {
      "confidence": "user_confirmed_common_name",
      "basis": "Cyrus confirmed this terracotta pot with figurine is a jade plant on October 7, 2026. Exact species/cultivar is not established by this common-name confirmation.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot with pale figurine and many clay balls; tiny fleshy rounded-leaf plant",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120734.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120734.jpg",
    "photoPosition": "50% 51%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120734.jpg",
    "sourcePhotoFilename": "20261006_120734.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120742",
    "reviewId": "pot120742",
    "name": "Dianthus — taupe-gray pot",
    "emoji": "🌸",
    "plantType": "dianthus",
    "careTemplateKey": "dianthus",
    "identification": {
      "confidence": "high",
      "basis": "One distinct flowering pot; cultivar unknown.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Taupe-gray round pot; narrow blue-green foliage and pink/magenta flowers with pale fringes",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120742.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120742.jpg",
    "photoPosition": "50% 54%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120742.jpg",
    "sourcePhotoFilename": "20261006_120742.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120748",
    "reviewId": "pot120748",
    "name": "Candytuft — taupe-gray pot",
    "emoji": "🌼",
    "plantType": "candytuft",
    "careTemplateKey": "candytuft",
    "identification": {
      "confidence": "user_confirmed_common_name",
      "basis": "Cyrus confirmed this taupe-gray pot is candytuft on October 7, 2026. Exact species/cultivar remains unconfirmed; annual or perennial type is not assumed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Taupe-gray pot; dense branching narrow-leaf mound with small white flower cluster",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120748.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120748.jpg",
    "photoPosition": "50% 50%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120748.jpg",
    "sourcePhotoFilename": "20261006_120748.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120755",
    "reviewId": "pot120755",
    "name": "Mint #1 · bushy taupe-gray pot",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "User confirmed Mint #1 (120755) and Mint #3 (120835) are two different pots. Keep both records and their existing mint numbers. Mint variety remains unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Taupe-gray pot on table; bushy pointed green leaves and some purplish stems",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120755.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120755.jpg",
    "photoPosition": "50% 52%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120755.jpg",
    "sourcePhotoFilename": "20261006_120755.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "physicalPotIdentity": {
      "status": "confirmed_distinct",
      "source": "user",
      "confirmedDate": "2026-10-06",
      "otherReviewId": "pot120835"
    },
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120806",
    "reviewId": "pot120806",
    "name": "Daisy — terracotta pot",
    "emoji": "🌼",
    "plantType": "daisy_provisional",
    "careTemplateKey": "daisy_provisional",
    "identification": {
      "confidence": "medium",
      "basis": "Cyrus confirmed this terracotta pot is a daisy on October 7, 2026. Exact species/cultivar remains unconfirmed; no species-specific care or lifecycle is assumed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot; toothed foliage, cut stems, spent pale composite flower",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120806.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120806.jpg",
    "photoPosition": "50% 54%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120806.jpg",
    "sourcePhotoFilename": "20261006_120806.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120810",
    "reviewId": "pot120810",
    "name": "Impatiens #1 · rear flower tag",
    "emoji": "🌸",
    "plantType": "impatiens",
    "careTemplateKey": "impatiens",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "The shared floor photo 1000016370 shows this pot beside the dog and a separate fuller impatiens pot in front. Two distinct physical pots; closeup matched by rear tag and foliage.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot with rear black-bordered flower tag; smaller red/bronze branching cluster and yellow-green older leaves",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120810.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120810.jpg",
    "photoPosition": "50% 53%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120810.jpg",
    "sourcePhotoFilename": "20261006_120810.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "identityResolutionEvidence": "1000016370.jpg",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120815",
    "reviewId": "pot120815",
    "name": "Impatiens #2 · fuller plant, front tag",
    "emoji": "🌸",
    "plantType": "impatiens",
    "careTemplateKey": "impatiens",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "The shared floor photo 1000016370 shows this foreground pot and the rear-tag impatiens simultaneously. This resolves the prior provisional merge as two pots.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Separate terracotta pot and saucer with pale front flower tag; fuller broad green/red-veined foliage and pink buds",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120815.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120815.jpg",
    "photoPosition": "50% 51%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120815.jpg",
    "sourcePhotoFilename": "20261006_120815.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "identityResolutionEvidence": "1000016370.jpg",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120821",
    "reviewId": "pot120821",
    "name": "Curly parsley — tan pot",
    "emoji": "🌿",
    "plantType": "parsley",
    "careTemplateKey": "parsley",
    "identification": {
      "confidence": "high",
      "basis": "One distinct curly parsley pot; exact container material unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Tan/fibrous-looking round pot with bright curly parsley foliage",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120821.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120821.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120821.jpg",
    "sourcePhotoFilename": "20261006_120821.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporary indoor spot by the door while a permanent place is arranged.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120830",
    "reviewId": "pot120830",
    "name": "Mint #2 · terracotta with clay balls",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high",
      "basis": "Distinct growth and pot markers from the other mint pots. Mint species/cultivar unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot; small central multi-shoot cluster and two visible clay balls toward foreground",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120830.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120830.jpg",
    "photoPosition": "50% 47%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120830.jpg",
    "sourcePhotoFilename": "20261006_120830.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120835",
    "reviewId": "pot120835",
    "name": "Mint #3 · bushy blue-gray pot",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "User confirmed Mint #1 (120755) and Mint #3 (120835) are two different pots. Keep both records and their existing mint numbers. Mint variety remains unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Blue-gray pot on sill; dense broader rounded foliage, conspicuous cut stem, wet leaves",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120835.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120835.jpg",
    "photoPosition": "50% 53%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120835.jpg",
    "sourcePhotoFilename": "20261006_120835.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "physicalPotIdentity": {
      "status": "confirmed_distinct",
      "source": "user",
      "confirmedDate": "2026-10-06",
      "otherReviewId": "pot120755"
    },
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120837",
    "reviewId": "pot120837",
    "name": "Mint #4 · three shoots, worn terracotta",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high",
      "basis": "Distinct from 120855 by figurine absence, shoot positions and pot surface. Species/cultivar unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot with pale rim wear; three small separate shoot clusters and no figurine visible",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120837.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120837.jpg",
    "photoPosition": "50% 55%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120837.jpg",
    "sourcePhotoFilename": "20261006_120837.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120841",
    "reviewId": "pot120841",
    "name": "Mint #5 · gray pot with white stone",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high",
      "basis": "Distinct gray sparse-mint pot with stone markers. Species/cultivar unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Gray plastic-looking pot; sparse shoot groups, pale/white stone and large bark pieces",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120841.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120841.jpg",
    "photoPosition": "50% 52%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120841.jpg",
    "sourcePhotoFilename": "20261006_120841.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120843",
    "reviewId": "pot120843",
    "name": "Mint #6 · small terracotta cluster",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high",
      "basis": "Distinct from 120830 by plant branching, pot and scene context. Species/cultivar unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Smaller terracotta near window; low branching leafy cluster, no figurine visible",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120843.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120843.jpg",
    "photoPosition": "50% 49%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120843.jpg",
    "sourcePhotoFilename": "20261006_120843.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120848",
    "reviewId": "pot120848",
    "name": "Spinach — terracotta with figurine",
    "emoji": "🌱",
    "plantType": "spinach",
    "careTemplateKey": "spinach",
    "identification": {
      "confidence": "user_confirmed",
      "basis": "Cyrus confirmed this small terracotta pot with the standing figurine is spinach on October 8, 2026, correcting the photo-based pepper guess. Variety remains unspecified.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Small terracotta pot; pale standing figurine and small smooth-leaved seedling",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120848.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120848.jpg",
    "photoPosition": "50% 49%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120848.jpg",
    "sourcePhotoFilename": "20261006_120848.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120851",
    "reviewId": "pot120851",
    "name": "Greek oregano — terracotta with round figurine",
    "emoji": "🌱",
    "plantType": "oregano",
    "careTemplateKey": "oregano",
    "identification": {
      "confidence": "user_confirmed",
      "basis": "Cyrus confirmed this terracotta pot with the round figurine is Greek oregano on October 8, 2026, correcting the photo-based sage guess. It is a separate physical pot from fresh_pot120913.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Small terracotta pot; fuzzy oval leaves, pale round figurine near rim",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120851.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120851.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120851.jpg",
    "sourcePhotoFilename": "20261006_120851.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120855",
    "reviewId": "pot120855",
    "name": "Mint #7 · terracotta with standing figurine",
    "emoji": "🌿",
    "plantType": "mint",
    "careTemplateKey": "mint",
    "identification": {
      "confidence": "high",
      "basis": "Distinct from 120837 and other mints by figurine and growth pattern. Species/cultivar unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot; upright pale figurine and three sparse shoot clusters",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120855.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120855.jpg",
    "photoPosition": "50% 53%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120855.jpg",
    "sourcePhotoFilename": "20261006_120855.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120904",
    "reviewId": "pot120904",
    "name": "Croton — narrow leaves, terracotta",
    "emoji": "🌴",
    "plantType": "croton",
    "careTemplateKey": "croton",
    "identification": {
      "confidence": "high",
      "basis": "Broad croton identification strong. Exact cultivar is not newly confirmed by this photo.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot; narrow green leaves with yellow stripe/patches; two pale figurines",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120904.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120904.jpg",
    "photoPosition": "50% 43%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120904.jpg",
    "sourcePhotoFilename": "20261006_120904.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120909",
    "reviewId": "pot120909",
    "name": "Strawberries · pocket jar",
    "emoji": "🍓",
    "plantType": "strawberry",
    "careTemplateKey": "strawberry",
    "identification": {
      "confidence": "high",
      "basis": "Multiple crowns in one physical watering pot; repeated earlier attachment adds no extra pot.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Tall terracotta strawberry jar with side pockets, multiple crowns and berries",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120909.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120909.jpg",
    "photoPosition": "50% 50%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120909.jpg",
    "sourcePhotoFilename": "20261006_120909.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016355.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "waterNote": "Pocket jar: check the top and side pockets separately after soaking. If an upper pocket stays dry, water its soil slowly from above and let the jar drain.",
    "waterNoteBasis": "Application of general whole-root-zone hydration guidance to this pocketed container.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120913",
    "reviewId": "pot120913",
    "name": "Greek oregano — gray pot with figurine pieces",
    "emoji": "🌱",
    "plantType": "oregano",
    "careTemplateKey": "oregano",
    "identification": {
      "confidence": "user_confirmed",
      "basis": "Cyrus confirmed this gray pot with figurine pieces is Greek oregano on October 7, 2026. Identity is not inferred from the photo.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Gray pot; three pale figurine pieces and tiny narrow-leaved green growth",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120913.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120913.jpg",
    "photoPosition": "50% 43%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120913.jpg",
    "sourcePhotoFilename": "20261006_120913.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016356.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120917",
    "reviewId": "pot120917",
    "name": "Amaranth — tall red stems",
    "emoji": "🌾",
    "plantType": "amaranth",
    "careTemplateKey": "amaranth",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "Likely love-lies-bleeding-type amaranth; exact species/cultivar unconfirmed. Earlier image same pot.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Terracotta pot; tall red stems, support stake and hanging red flower/seed tassel",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120917.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120917.jpg",
    "photoPosition": "50% 39%",
    "photoFit": "contain",
    "primaryOriginalFilename": "20261006_120917.jpg",
    "sourcePhotoFilename": "20261006_120917.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016357.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot120923",
    "reviewId": "pot120923",
    "name": "Heartleaf philodendron — teal hanging basket",
    "emoji": "🌱",
    "plantType": "philodendron_provisional",
    "careTemplateKey": "philodendron_provisional",
    "identification": {
      "confidence": "moderate_photo_id_accepted_by_user",
      "basis": "Working identification: heartleaf philodendron (Philodendron hederaceum), assessed from the photo with moderate confidence and accepted by Cyrus on October 8, 2026. Not an owner-recalled label confirmation; exact variety unconfirmed. Earlier repeated uploads add no pot.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Large teal hanging basket with a small broad glossy-leaf vine and pale figurine",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_120923.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_120923.jpg",
    "photoPosition": "50% 44%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_120923.jpg",
    "sourcePhotoFilename": "20261006_120923.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016358.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "waterNote": "Small soil-grown vine in a large basket: check moisture near its roots and deeper in the mix before watering. A dry surface alone does not show that the lower mix needs soaking.",
    "waterNoteBasis": "Conservative application of container moisture checks to a small plant in a large volume of soil.",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot121000",
    "reviewId": "pot121000",
    "name": "Jade — teal glazed pot",
    "emoji": "🪴",
    "plantType": "jade",
    "careTemplateKey": "jade",
    "identification": {
      "confidence": "high",
      "basis": "One jade pot; earlier repeated uploads add no pot. Cultivar unknown.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Teal/green glazed pot; thick glossy oval leaves on upright fleshy stem",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121000.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121000.jpg",
    "photoPosition": "50% 43%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_121000.jpg",
    "sourcePhotoFilename": "20261006_121000.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016359.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot121003",
    "reviewId": "pot121003",
    "name": "Likely brittle prickly pear — red-rimmed pot",
    "emoji": "🌵",
    "plantType": "cactus_unconfirmed",
    "careTemplateKey": "cactus_provisional",
    "identification": {
      "confidence": "cactus_clear_species_tentative",
      "basis": "Best working guess: brittle prickly pear (Opuntia fragilis), not a confirmed species. Cyrus found a detached piece during a walk, believes it fell from the mother plant, and reports it rooting nicely on October 8, 2026. The small rounded segment, pale woolly areoles and straight spines support an Opuntia-type hypothesis; do not treat it as a seedling.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Red-rimmed glazed pot; many clay balls and small ribbed green cactus with long golden spines",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121003.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121003.jpg",
    "photoPosition": "50% 51%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_121003.jpg",
    "sourcePhotoFilename": "20261006_121003.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016360.jpg",
    "identityNote": "Found detached cactus piece, not seed-grown; rooting nicely as reported by Cyrus on October 8, 2026. Species remains tentative.",
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_onions_dark_pot_indoor",
    "reviewId": "pot121010",
    "name": "Onions #1 · dark pot, three main bases",
    "emoji": "🧅",
    "plantType": "allium_provisional",
    "careTemplateKey": "allium_provisional",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "Definitely separate from 121022: opposite sides of geode strawberry and different base/shoot arrangements. Exact onion type unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Dark plastic-looking pot with three larger pale onion-like bases; left of geode strawberry, beside jade",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121010.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121010.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "contain",
    "primaryOriginalFilename": "20261006_121010.jpg",
    "sourcePhotoFilename": "20261006_121010.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016361.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_strawberry_wide_terracotta_indoor",
    "reviewId": "pot121016",
    "name": "Strawberry · geode pot",
    "emoji": "🍓",
    "plantType": "strawberry",
    "careTemplateKey": "strawberry",
    "identification": {
      "confidence": "high",
      "basis": "Same geode strawberry pot as earlier upload. Cultivar unknown.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Wide terracotta pot with geode, stained pale card and small leafy strawberry crown",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121016.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121016.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_121016.jpg",
    "sourcePhotoFilename": "20261006_121016.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016362.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot121022",
    "reviewId": "pot121022",
    "name": "Onions #2 · dark pot, wall side",
    "emoji": "🧅",
    "plantType": "allium_provisional",
    "careTemplateKey": "allium_provisional",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "Definitely separate from 121010; pots flank the geode strawberry. Exact onion type unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Dark plastic-looking pot with larger base, smaller base and thin shoot/dead stalk; wall side, right of geode strawberry",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121022.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121022.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "contain",
    "primaryOriginalFilename": "20261006_121022.jpg",
    "sourcePhotoFilename": "20261006_121022.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_rosemary_terracotta_indoor",
    "reviewId": "pot121422",
    "name": "Rosemary · pale-stone pot",
    "emoji": "🌿",
    "plantType": "rosemary",
    "careTemplateKey": "rosemary",
    "identification": {
      "confidence": "high",
      "basis": "Same rosemary as earlier attachment; cultivar unknown.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Tall terracotta with matching saucer, large flat pale stone and woody upright rosemary",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121422.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121422.jpg",
    "photoPosition": "50% 44%",
    "photoFit": "contain",
    "primaryOriginalFilename": "20261006_121422.jpg",
    "sourcePhotoFilename": "20261006_121422.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016364.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_strawberry_deep_terracotta_indoor",
    "reviewId": "pot121426",
    "name": "Strawberry · deeper terracotta pot",
    "emoji": "🍓",
    "plantType": "strawberry",
    "careTemplateKey": "strawberry",
    "identification": {
      "confidence": "high",
      "basis": "Same deeper strawberry pot as earlier attachment; cultivar unknown.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Deeper tapered terracotta with matching saucer; long red leaf stems",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121426.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121426.jpg",
    "photoPosition": "50% 58%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_121426.jpg",
    "sourcePhotoFilename": "20261006_121426.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016365.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_strawberry_gray_outdoor",
    "reviewId": "pot121504",
    "name": "Strawberry · shallow gray pot",
    "emoji": "🍓",
    "plantType": "strawberry",
    "careTemplateKey": "strawberry",
    "identification": {
      "confidence": "high",
      "basis": "User-confirmed outdoor strawberry; same plant as earlier upload. The newly added heirloom tomato is also temporarily outdoors. Cultivar unknown.",
      "cultivar": null
    },
    "location": "outdoor",
    "pot": {
      "description": "Large shallow round gray pot; green strawberry foliage, white flowers and red fruit",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/20261006_121504.jpg",
    "originalPhoto": "plant-photos/2026-10-06/20261006_121504.jpg",
    "photoPosition": "50% 50%",
    "photoFit": "cover",
    "primaryOriginalFilename": "20261006_121504.jpg",
    "sourcePhotoFilename": "20261006_121504.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": "1000016366.jpg",
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  },
  {
    "id": "fresh_pot1000016368",
    "reviewId": "pot1000016368",
    "name": "Heirloom tomato · caged pot",
    "emoji": "🌱",
    "plantType": "tomato",
    "careTemplateKey": "tomato",
    "identification": {
      "confidence": "user_confirmed_broad_id",
      "basis": "User identifies this as the missed heirloom tomato. The closer and wider photos show the same pot, cage, stems and green fruit; one card with two original views.",
      "cultivar": null
    },
    "location": "outdoor",
    "pot": {
      "description": "Large dark round pot with stakes and surrounding wire cages; tall tomato plant with green fruit",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/1000016368.jpg",
    "originalPhoto": "plant-photos/2026-10-06/1000016368.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "contain",
    "primaryOriginalFilename": "1000016368.jpg",
    "sourcePhotoFilename": "1000016368.jpg",
    "alternateOriginalFilenames": [
      "1000016369.jpg"
    ],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "locationIsTemporary": true,
    "placementNote": "Temporarily outdoors, per your update. Permanent placement is still being arranged.",
    "waterNote": "Large caged pot: check moisture in the root zone before watering. If soaking does not moisten the root ball evenly, water the soil slowly from above and allow free drainage.",
    "waterNoteBasis": "Application of container-tomato root-zone moisture guidance and the shared uneven-uptake check.",
    "alternatePhotos": [
      "plant-photos/2026-10-06/1000016369.jpg"
    ]
  },
  {
    "id": "fresh_pot1000016367",
    "reviewId": "pot1000016367",
    "name": "Fittonia · glossy black pot",
    "emoji": "🌱",
    "plantType": "fittonia",
    "careTemplateKey": "fittonia",
    "identification": {
      "confidence": "high_broad_id",
      "basis": "Distinct newly supplied pot. Leaf pattern supports Fittonia/nerve plant; exact cultivar is unconfirmed.",
      "cultivar": null
    },
    "location": "indoor",
    "pot": {
      "description": "Glossy black round pot with pink-and-green netted leaves on several low stems",
      "drainage": "well_drained_user_confirmed"
    },
    "photo": "plant-photos/2026-10-06/1000016367.jpg",
    "originalPhoto": "plant-photos/2026-10-06/1000016367.jpg",
    "photoPosition": "50% 48%",
    "photoFit": "cover",
    "primaryOriginalFilename": "1000016367.jpg",
    "sourcePhotoFilename": "1000016367.jpg",
    "alternateOriginalFilenames": [],
    "duplicateEarlierFilename": null,
    "identityNote": null,
    "lastWatered": null,
    "cardsStatus": "draft",
    "alternatePhotos": []
  }
];
const PLANT_CARE_SHARED = {
  "bottom_watering": {
    "label": "Soak, lift, drain",
    "steps": [
      "Check this pot's moisture cue before soaking.",
      "Put drainage holes in contact with basin water. Use 2–3 inches for ordinary taller pots; use less for shallow pots, below soil and crowns.",
      "Check around 15 minutes; usually 15–30 minutes is enough. Stop when the root zone is moist and the pot heavier.",
      "Lift, drain, and empty the saucer."
    ],
    "endpoint": "Moisture controls the endpoint. Finish uneven uptake with slow top watering. Avoid prolonged soaking.",
    "exceptions": "Tiny seedlings and fresh cuttings need separate checks. Bottom watering can still overwater.",
    "water": "Use room-temperature water. Misting does not replace watering.",
    "inference_note": "Lower basin depth adapts generic Extension guidance to shallow pots.",
    "source_ids": [
      "vce_bottom_water",
      "umd_water"
    ]
  },
  "salt_flush": {
    "label": "Occasional top watering",
    "text": "Bottom watering does not wash accumulated salts out of the mix. About every 4–6 months, or sooner if a salt crust appears, use clear water from the top and let it drain freely. Empty all runoff. Avoid sodium-softened water.",
    "source_ids": [
      "umd_water"
    ]
  },
  "feeding_baseline": {
    "text": "Feed established plants modestly while they are actively growing, following the product label. Pause feeding when growth has slowed. Fertilizer is not a first response to unexplained wilting or yellowing.",
    "source_ids": [
      "umd_feed",
      "umn_active_feed"
    ],
    "application_note": "Checking existing fertilizer and deferring an uncertain dose are conservative draft decisions."
  },
  "trouble_baseline": {
    "text": "Wilting can reflect dry or wet roots. Check moisture first. Investigate soft yellowing growth in wet mix, or dry brittle growth in a light pot.",
    "source_ids": [
      "vce_bottom_water"
    ],
    "no_pesticide_protocol": true
  }
};
const PLANT_CARE_SOURCE_CATALOG = {
  "vce_bottom_water": {
    "title": "Properly Watering Container Houseplants",
    "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
  },
  "umd_water": {
    "title": "Watering Indoor Plants",
    "url": "https://www.extension.umd.edu/resource/watering-indoor-plants"
  },
  "umd_feed": {
    "title": "Fertilizer for Indoor Plants",
    "url": "https://extension.umd.edu/resource/fertilizer-indoor-plants"
  },
  "umn_active_feed": {
    "title": "Spring houseplant care",
    "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/houseplants/spring-houseplant-care"
  }
};
const PLANT_CARE_TEMPLATES = {
  "tomato": {
    "name": "Heirloom tomato — cultivar unknown",
    "status": "draft",
    "identification": "Tomato identified by the user; cultivar and determinate/indeterminate growth habit unconfirmed.",
    "watering": {
      "when": "Check below the surface beside the plant. Water as root-zone moisture starts to fall; maintain even moisture without leaving the mix soggy or letting the root ball dry out completely.",
      "method": "Bottom watering when uptake wets the root zone evenly; use slow top watering if this large pot does not wick adequately. Drain freely.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "A dry surface alone is insufficient in a large pot. Check deeper moisture before repeating a soak, and empty any collected runoff."
    },
    "care": {
      "soil": "Airy, well-drained container potting mix rather than dense garden soil.",
      "feed": "Use label-directed container or tomato fertilizer during active growth, accounting for feed already in the mix. Excess nitrogen can favor leaves over fruit.",
      "pruning": "Keep the cage supporting growth. Defer a sucker-removal routine until growth habit is confirmed; bush tomatoes generally do not need pruning.",
      "trouble": "Leaf curl has several possible causes. Check moisture and leaf undersides before diagnosing it; record persistent wilt, spreading spots, or fruit damage."
    },
    "sources": [
      {
        "title": "Fertilizing and watering container plants",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/fertilizing-and-watering-container-plants"
      },
      {
        "title": "Growing tomatoes in home gardens",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-tomatoes"
      },
      {
        "title": "Growing Vegetables in Containers and Salad Tables",
        "url": "https://www.extension.umd.edu/resource/growing-vegetables-containers-and-salad-tables"
      },
      {
        "title": "Key to Common Problems of Tomatoes",
        "url": "https://www.extension.umd.edu/resource/key-common-problems-tomatoes"
      }
    ],
    "application_note": "Bottom watering is adapted from the shared method; deeper checks address the photographed large pot. Curling leaves in a photo do not establish a cause.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "fittonia": {
    "name": "Fittonia / nerve plant — cultivar unknown",
    "status": "draft",
    "identification": "Fittonia with pink and green foliage; no cultivar assigned from the photo.",
    "watering": {
      "when": "Check often and water before the root ball dries out. Keep the mix consistently lightly moist, without waterlogging; wait if it is still wet.",
      "method": "Bottom watering, then lift, drain fully, and empty any saucer.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Do not use repeated wilting as the watering signal. If it droops, check root moisture first; a dry plant may recover after thorough watering."
    },
    "care": {
      "soil": "Moisture-retentive houseplant potting mix with drainage; avoid a container much larger than the root ball.",
      "feed": "A light feeder: occasional dilute houseplant fertilizer during active growth, roughly every two or three months, following product instructions and accounting for feed already in the mix.",
      "pruning": "No routine pruning needed. Remove dead leaves and stems as needed.",
      "trouble": "Dry air can cause browning. Check moisture before responding to drooping; inspect for mites, mealybugs, and mould on dead material. Humid air does not require soggy roots."
    },
    "sources": [
      {
        "title": "How to grow fittonia",
        "url": "https://www.rhs.org.uk/plants/fittonia/how-to-grow-fittonia"
      },
      {
        "title": "Fittonia / RHS Plant Guide",
        "url": "https://www.rhs.org.uk/plants/fittonia"
      }
    ],
    "application_note": "The preferred bottom-watering method is applied to a soil-grown, freely draining pot. Moisture checks replace a fixed soak schedule.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "croton": {
    "name": "Croton — narrow-leaf form, cultivar unconfirmed",
    "status": "draft",
    "identification": "Codiaeum variegatum group; do not assign a cultivar from leaf shape alone.",
    "watering": {
      "when": "Water when the top half-inch to one inch of mix has dried. Keep the root zone moderately moist, avoiding prolonged dryness or saturation.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Lift, drain fully, and empty the saucer after uptake; do not keep the pot standing in basin water."
    },
    "care": {
      "soil": "Fertile, well-drained container potting mix.",
      "feed": "Modest label-directed feeding once or twice during active growth is a starting approach; account for fertilizer already in the mix.",
      "pruning": "Remove fully dead material. If shaping is needed later, prune when healthy and entering active growth. Wear gloves when cutting because the sap can irritate skin.",
      "trouble": "Leaf drop can follow prolonged wetness, dryness, cold drafts, or abrupt changes. Inspect for spider mites, mealybugs, and scale before choosing treatment."
    },
    "sources": [
      {
        "title": "Croton, Codiaeum variegatum",
        "url": "https://hort.extension.wisc.edu/articles/croton-codiaeum-variegatum/"
      }
    ],
    "application_note": "Species-group moisture guidance is adapted to the preferred bottom-watering method; no cultivar-specific or placement prescription.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "strawberry": {
    "name": "Strawberry — variety unconfirmed",
    "status": "draft",
    "identification": "Strawberry group; no cultivar, June-bearing, everbearing, or day-neutral claim from photos.",
    "watering": {
      "when": "Water as the soil surface becomes dry; maintain steady moisture without waterlogging. Do not wait for the whole root ball to dry.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Keep the crown above basin water. Each strawberry pot needs a separate moisture check."
    },
    "care": {
      "soil": "Container potting mix with good drainage; crown level with the mix surface.",
      "feed": "Use a label-directed container fertilizer during active growth after checking the mix's existing feed.",
      "pruning": "Remove diseased leaves or fruit and unwanted runners. Keep runners only if deliberately growing another plant.",
      "trouble": "Wilting with dry mix; prolonged wetness; spotted foliage; damaged or moldy fruit."
    },
    "sources": [
      {
        "title": "How to Grow Strawberries in Containers",
        "url": "https://yardandgarden.extension.iastate.edu/how-to/how-grow-strawberries-containers"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "rosemary": {
    "name": "Rosemary",
    "status": "draft",
    "identification": "Rosemary; cultivar unknown.",
    "watering": {
      "when": "Allow the mix to dry somewhat between waterings. Water thoroughly when needed, then drain; do not keep it continuously wet or let the whole root ball become persistently desiccated.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Use a longer drying interval than mint, strawberries, or impatiens. No fixed weekly schedule."
    },
    "care": {
      "soil": "Free-draining potting mix.",
      "feed": "Light feeding during active growth; an established container plant may benefit from a modest spring/early-summer feed.",
      "pruning": "Snip leafy shoot tips or lightly trim after flowering. Avoid cutting into bare old wood.",
      "trouble": "Brittle shedding foliage; persistent wetness or collapse; white powdery patches; fine webbing or insects."
    },
    "sources": [
      {
        "title": "How to grow rosemary",
        "url": "https://www.rhs.org.uk/herbs/rosemary/grow-your-own"
      },
      {
        "title": "Growing Herbs Indoors",
        "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-herbs-indoors"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "allium_provisional": {
    "name": "Green onion / scallion — type unconfirmed",
    "status": "draft",
    "identification": "Onion-family appearance; exact Allium species and grocery-regrowth history unresolved.",
    "watering": {
      "when": "Keep shallow roots evenly moist. Water when the surface begins drying; avoid leaving the mix saturated.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Well-drained container potting mix.",
      "feed": "A dose remains provisional until the growing goal and current fertilizer are known.",
      "pruning": "Defer repeated harvest instructions until this is confirmed as onions grown for greens.",
      "trouble": "Yellowing, wilt, damaged tips, or soft bases; inspect roots and moisture before assuming a cause."
    },
    "sources": [
      {
        "title": "Growing onions in home gardens",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-onions"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "Garden-source moisture needs are adapted cautiously to this indoor pot.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "succulent_provisional": {
    "name": "Paddle / flapjack succulent — species unconfirmed",
    "status": "draft",
    "identification": "Fleshy paddle-leaf succulent; Kalanchoe is provisional. Do not assign K. luciae or K. thyrsiflora.",
    "watering": {
      "when": "For an established rooted succulent, let the mix dry through before another thorough watering.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Use uptake and complete drainage; repeated frequent soaking can leave roots too wet."
    },
    "care": {
      "soil": "Quick-draining succulent potting mix.",
      "feed": "Use dilute succulent feed sparingly during active growth, according to its label.",
      "pruning": "No major pruning while identification is pending; remove only fully dead material.",
      "trouble": "Soft translucent leaves, yellowing, or collapse in wet soil; severe wrinkling with dry mix; cottony insects."
    },
    "sources": [
      {
        "title": "Growing Succulents Indoors",
        "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-succulents-indoors"
      }
    ],
    "application_note": "Broad succulent guidance; species-specific care waits for confirmation.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "dianthus": {
    "name": "Dianthus — cultivar unconfirmed",
    "status": "draft",
    "identification": "Dianthus group; annual/perennial type unresolved.",
    "watering": {
      "when": "Let the surface dry slightly between thorough waterings. Recheck the root zone; avoid persistently wet mix.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Well-drained potting mix and airflow around foliage.",
      "feed": "Use modest label-directed container feed only during active growth; exact interval pending current fertilizer history.",
      "pruning": "Remove faded flowers. Lightly trim after flowering rather than making a large cut now.",
      "trouble": "Wet-root collapse; powdery coating, rust-colored spots, or aphid clusters."
    },
    "sources": [
      {
        "title": "Dianthus",
        "url": "https://plants.ces.ncsu.edu/plants/dianthus/"
      },
      {
        "title": "Dianthus caryophyllus",
        "url": "https://www.rhs.org.uk/plants/5707/dianthus-caryophyllus/details"
      },
      {
        "title": "Fertilizer for Indoor Plants",
        "url": "https://extension.umd.edu/resource/fertilizer-indoor-plants"
      }
    ],
    "application_note": "The surface-drying cue is a conservative container interpretation of the genus's drained, occasionally dry conditions.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "candytuft": {
    "name": "Candytuft — species unconfirmed",
    "status": "draft",
    "identification": "Candytuft group. Perennial I. sempervirens remains conditional until label or leaves confirm it.",
    "watering": {
      "when": "Maintain lightly moist to slightly dry mix; allow some drying and avoid a constantly wet crown.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Well-drained potting mix.",
      "feed": "Keep feeding modest; avoid adding a routine heavy feed before existing fertilizer is known.",
      "pruning": "Remove dead material now. If perennial candytuft is confirmed, lightly trim after flowering.",
      "trouble": "A dark soft crown in wet mix; leaf spotting or powdery coating."
    },
    "sources": [
      {
        "title": "Iberis sempervirens",
        "url": "https://plants.ces.ncsu.edu/plants/iberis-sempervirens/"
      },
      {
        "title": "Iberis sempervirens",
        "url": "https://www.rhs.org.uk/plants/9066/iberis-sempervirens/details"
      }
    ],
    "application_note": "The perennial profile informs a provisional group template; no perennial lifecycle claim is assigned yet.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "impatiens": {
    "name": "New Guinea impatiens — cultivar unconfirmed",
    "status": "draft",
    "identification": "New Guinea impatiens group; exact cultivar or hybrid unresolved.",
    "watering": {
      "when": "Check frequently and water when the soil surface becomes dry. Keep the root zone moist, avoiding both drying out and waterlogging.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Moisture-retentive but well-drained potting mix.",
      "feed": "During active growth, a label-directed water-soluble fertilizer about every two weeks is a starting pattern; account for existing slow-release feed.",
      "pruning": "Remove fully dead leaves and damaged flowers; defer a heavy cut.",
      "trouble": "Dry-root wilting, dropped buds, brown leaf margins, or leaf drop; persistent wet soil can cause root rot."
    },
    "sources": [
      {
        "title": "Growing Impatiens in the Home Garden",
        "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-impatiens-home-garden"
      }
    ],
    "application_note": "The feeding pattern comes from container gardening and needs adjustment to actual indoor growth.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "philodendron_provisional": {
    "name": "Heartleaf vine in soil — likely philodendron",
    "status": "draft",
    "identification": "Likely heartleaf philodendron in soil; medium-high confidence, species/cultivar provisional.",
    "watering": {
      "when": "Let the surface dry slightly, then check beside the plant and deeper in the basket. Wait if the root area or lower mix remains moist.",
      "method": "Bottom-water when needed, then lift and drain fully.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "This tiny vine occupies a large teal basket. A dry surface alone does not justify another soak; the lower mix can remain wet."
    },
    "care": {
      "soil": "Loose, well-drained mix. Soil volume much larger than the root ball dries slowly and can encourage root rot.",
      "feed": "Feed modestly per label only when established and growing; account for nutrients already in the mix.",
      "pruning": "Keep healthy foliage; remove dead material. Defer shaping. Gloves protect against irritating sap.",
      "trouble": "Investigate yellowing, soft stems, or collapse in wet mix. Inspect spots and insects before treatment."
    },
    "sources": [
      {
        "title": "How to grow philodendrons",
        "url": "https://www.rhs.org.uk/plants/philodendron/growing-guide"
      },
      {
        "title": "Philodendron hederaceum",
        "url": "https://plants.ces.ncsu.edu/plants/philodendron-hederaceum/"
      }
    ],
    "application_note": "Deeper moisture checks adapt the RHS overpotting warning to the photographed basket.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "jade": {
    "name": "Jade plant",
    "status": "draft",
    "identification": "Jade / Crassula ovata group; cultivar unknown.",
    "watering": {
      "when": "Allow the mix to dry between thorough waterings, then drain completely.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Quick-draining succulent potting mix.",
      "feed": "Feed about every two months during active growth, or use a more dilute label-directed approach.",
      "pruning": "When healthy and growing, stems can be cut back to a lateral branch to control shape; no need to prune immediately.",
      "trouble": "Wet-soil leaf drop or stem rot; severe drought can also cause leaf drop; inspect for cottony mealybugs or fine webbing."
    },
    "sources": [
      {
        "title": "Jade Plant, Crassula ovata",
        "url": "https://hort.extension.wisc.edu/articles/jade-plant-crassula-ovata/"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "spinach": {
    "name": "Spinach",
    "status": "reviewed",
    "identification": "Spinach, confirmed by Cyrus; variety unspecified.",
    "watering": {
      "when": "Keep the root zone evenly moist without waterlogging. Check the mix and pot weight; water as it starts drying, before the whole root ball dries out. Wait if it is still wet.",
      "method": "Bottom-water when needed, then lift and drain. For a small seedling, use gentle shallow contact until the mix absorbs moisture, not a fixed mature-pot soak.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning remain deferred.",
      "notes": "Do not drought-test spinach. Root maturity is not established by identifying the plant."
    },
    "care": {
      "soil": "Well-drained, moisture-retentive container mix; avoid persistently saturated roots.",
      "feed": "Account for nutrients already in the mix. Feed as needed during active growth according to the vegetable fertilizer label; no fixed interval is assigned.",
      "pruning": "Harvest individual usable leaves only once enough healthy growth remains. Leave the central growing point for regrowth; do not pinch it like a branching pepper or herb.",
      "trouble": "Heat, long days and drought can encourage bolting. Inspect leaf tunnels, holes or mildew before choosing treatment."
    },
    "sources": [
      {"title": "Growing Spinach — University of Maryland Extension", "url": "https://extension.umd.edu/resource/growing-spinach-home-garden"},
      {"title": "Growing Spinach and Swiss Chard — University of Minnesota Extension", "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-spinach-and-swiss-chard"}
    ],
    "application_note": "Even moisture and gentle seedling handling adapt the guidance to a container. No watering interval, harvest date or current readiness is inferred from the photo.",
    "deferred": ["light_placement", "overwinter_planning"]
  },
  "oregano": {
    "name": "Greek oregano",
    "status": "reviewed",
    "identification": "Greek oregano (Origanum vulgare subsp. hirtum), confirmed by Cyrus; exact cultivar unknown.",
    "watering": {
      "when": "Allow the soil surface to dry slightly between waterings. Check the root zone and pot weight; wait if still wet. Do not let a small seedling's entire root ball dry out.",
      "method": "Bottom-water when needed, then lift and drain. For a small seedling, use gentle shallow contact and stop once the mix absorbs moisture rather than using a fixed mature-pot soak.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Identification does not establish root maturity. Use gentle seedling handling until the plant is established."
    },
    "care": {
      "soil": "Well-drained potting mix; avoid persistently wet roots.",
      "feed": "Keep feeding modest and account for nutrients already in the mix. Excess feeding can weaken growth and reduce flavor; no fixed feeding interval is assigned.",
      "pruning": "Lightly pinch healthy growing tips to encourage branching. Harvest only once established, leaving plenty of foliage for regrowth.",
      "trouble": "Root or stem rot in persistently wet mix; inspect for aphids or spider mites before treatment."
    },
    "sources": [
      {
        "title": "All About Oregano and Marjoram — Iowa State Extension",
        "url": "https://yardandgarden.extension.iastate.edu/how-to/all-about-oregano-and-marjoram"
      },
      {
        "title": "Greek Oregano — NC State Extension",
        "url": "https://plants.ces.ncsu.edu/plants/origanum-vulgare-subsp-hirtum/"
      }
    ],
    "application_note": "Surface drying and conservative seedling handling adapt oregano guidance to a container; no watering interval or present harvest readiness is inferred from its photo.",
    "deferred": ["light_placement", "overwinter_planning"]
  },
  "seedling_unknown": {
    "name": "Small seedling — identification pending",
    "status": "draft",
    "identification": "General observation placeholder for unidentified seedlings until identity and maturity are established. Each remains separate; use cactus_provisional for the cactus-like pot.",
    "watering": {
      "when": "Check the small root zone and pot weight often. The drying threshold remains provisional until identity and maturity are confirmed. If confirmed as a young herbaceous seedling, keep its mix lightly moist without saturation.",
      "method": "Use gentle shallow bottom contact; stop once the mix absorbs moisture, then drain.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "When watering is needed, use shallow basin contact and drain after uptake. Avoid a fixed mature-pot soak, full-dry cactus rule, or species-specific watering schedule before identification."
    },
    "care": {
      "soil": "Do not disturb the roots solely to identify it. Confirm the label, leaf details, and current medium.",
      "feed": "Hold a species-specific feeding schedule until identity, root stage, and current nutrients are known.",
      "pruning": "No pinching, harvesting, or major pruning until identified.",
      "trouble": "A thinning dark stem at soil level, collapse, persistent sogginess, or drying out; document changes before choosing treatment."
    },
    "sources": [
      {
        "title": "A warm-weather jump on seed starting",
        "url": "https://extension.umn.edu/about/our-stories/news/yard-and-garden-news/a-warm-weather-jump-on-seed-starting"
      },
      {
        "title": "How to prevent seedling damping off",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/yard-and-garden-problems/how-to-prevent-seedling-damping-off"
      }
    ],
    "application_note": "This is interim general seedling handling, not confirmed pepper or cactus care. A confirmed succulent seedling needs a separate age-specific template.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "daisy_provisional": {
    "name": "Unidentified plant — care pending",
    "status": "draft",
    "identification": "Use for an ambiguous daisy-family plant or other unidentified leafy specimen. Do not assign species-specific needs.",
    "watering": {
      "when": "If the mix is damp and the pot is heavy, wait and recheck. If the root zone is becoming dry and the pot light, water gently and drain. Avoid both repeated saturation and prolonged complete dehydration.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "The exact drying threshold remains provisional until identification."
    },
    "care": {
      "soil": "Confirmed drainage; medium suitability remains unassessed.",
      "feed": "Hold a species-specific feeding schedule until identification and fertilizer history are known.",
      "pruning": "Remove fully dead material only; defer large cuts and harvest advice.",
      "trouble": "Record wilting, yellowing, leaf drop, and soft stems; check moisture before adding water."
    },
    "sources": [
      {
        "title": "Watering Indoor Plants",
        "url": "https://www.extension.umd.edu/resource/watering-indoor-plants"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "Conservative observation placeholder rather than a species care prescription.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "mint": {
    "name": "Mint — variety unconfirmed",
    "status": "draft",
    "identification": "Mentha group; seven physical pots share this text but remain seven independent inventory records.",
    "watering": {
      "when": "Keep the mix evenly moist. Check each pot separately and water as the surface begins drying; do not let the whole root ball dry.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Well-drained container potting mix; divide or repot when an established root ball becomes crowded.",
      "feed": "Feed modestly during active growth, accounting for existing nutrients and following the label.",
      "pruning": "Snip soft tips regularly. Pinch flower buds if leaves are the goal; defer a large cut until each pot is healthy and established.",
      "trouble": "Distorted shoots or aphid clusters; dusty orange, yellow, or black spots that need inspection for rust."
    },
    "sources": [
      {
        "title": "How to grow mint",
        "url": "https://www.rhs.org.uk/herbs/mint/grow-your-own"
      },
      {
        "title": "Mint in the garden",
        "url": "https://extension.usu.edu/yardandgarden/research/mint-in-the-garden"
      },
      {
        "title": "Nutrition and feeding plants",
        "url": "https://www.rhs.org.uk/garden-jobs/nutrition-feeding-plants"
      }
    ],
    "application_note": "The surface-and-weight cue adapts the evenly-moist goal to containers.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "parsley": {
    "name": "Parsley",
    "status": "draft",
    "identification": "Parsley; cultivar unknown.",
    "watering": {
      "when": "Keep the mix evenly moist, without waterlogging. Water before the entire pot dries.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Moisture-retentive container mix with drainage.",
      "feed": "An actively growing container plant may benefit from balanced liquid feed every few weeks, per the label and accounting for existing fertilizer.",
      "pruning": "Harvest a few outer leafy stems at their bases; leave the central growing point. Remove yellow lower leaves.",
      "trouble": "Inspect distorted growth for aphids; yellow leaves need a moisture/root check. Second-year flowering is normal biennial development."
    },
    "sources": [
      {
        "title": "How to grow parsley",
        "url": "https://www.rhs.org.uk/herbs/parsley/grow-your-own"
      },
      {
        "title": "Watering Indoor Plants",
        "url": "https://www.extension.umd.edu/resource/watering-indoor-plants"
      }
    ],
    "application_note": "",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "amaranth": {
    "name": "Flowering amaranth — species unconfirmed",
    "status": "draft",
    "identification": "Amaranthus broadly; species, cultivar, and harvest goal unresolved.",
    "watering": {
      "when": "Keep mix moist and well drained. Check the surface and pot weight before watering; do not drought-test a small container.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": ""
    },
    "care": {
      "soil": "Well-drained, reasonably fertile potting mix; keep the container stable as stems grow.",
      "feed": "Feed modestly only during active growth, per label and accounting for existing nutrients; interval provisional.",
      "pruning": "Remove dead material; preserve flowering stems until the goal of display or seed collection is clear.",
      "trouble": "Inspect distorted tips for aphids; investigate persistent wetness or wilting. Many flowering amaranths are annuals, so decline is not automatically a watering failure."
    },
    "sources": [
      {
        "title": "Amaranthus",
        "url": "https://www.rhs.org.uk/plants/amaranthus"
      },
      {
        "title": "Amaranthus caudatus",
        "url": "https://plants.ces.ncsu.edu/plants/amaranthus-caudatus/"
      },
      {
        "title": "Nutrition and feeding plants",
        "url": "https://www.rhs.org.uk/garden-jobs/nutrition-feeding-plants"
      }
    ],
    "application_note": "A. caudatus source used conservatively; its species identity, dimensions, and flower shape are not assigned.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "sage_provisional": {
    "name": "Fuzzy sage-like herb — identification pending",
    "status": "draft",
    "identification": "Sage-like appearance is provisional. Use general observations until label or leaf/stem detail confirms identity.",
    "watering": {
      "when": "If the mix is damp and the pot is heavy, wait and recheck. If the root zone is becoming dry and the pot light, water gently and drain. Avoid both repeated saturation and prolonged complete dehydration.",
      "method": "Bottom watering.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "The exact drying threshold remains provisional until identification."
    },
    "care": {
      "soil": "Confirmed drainage; medium suitability remains unassessed.",
      "feed": "Hold a species-specific feeding schedule until identification and fertilizer history are known.",
      "pruning": "Remove fully dead material only; defer large cuts and harvest advice.",
      "trouble": "Record wilting, yellowing, leaf drop, and soft stems; check moisture before adding water."
    },
    "sources": [
      {
        "title": "Watering Indoor Plants",
        "url": "https://www.extension.umd.edu/resource/watering-indoor-plants"
      },
      {
        "title": "Properly Watering Container Houseplants",
        "url": "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-804.html"
      }
    ],
    "application_note": "Conservative observation placeholder rather than a species care prescription.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "pepper_provisional": {
    "name": "Pepper-like seedling — identification pending",
    "status": "draft",
    "identification": "Do not assign Capsicum or pepper harvest/pruning care from this photograph alone.",
    "watering": {
      "when": "Check the small root zone and pot weight often. The drying threshold remains provisional until identity and maturity are confirmed. If confirmed as a young herbaceous seedling, keep its mix lightly moist without saturation.",
      "method": "Use gentle shallow bottom contact; stop once the mix absorbs moisture, then drain.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "When watering is needed, use shallow basin contact and drain after uptake. Avoid a fixed mature-pot soak, full-dry cactus rule, or species-specific watering schedule before identification."
    },
    "care": {
      "soil": "Do not disturb the roots solely to identify it. Confirm the label, leaf details, and current medium.",
      "feed": "Hold a species-specific feeding schedule until identity, root stage, and current nutrients are known.",
      "pruning": "No pinching, harvesting, or major pruning until identified.",
      "trouble": "A thinning dark stem at soil level, collapse, persistent sogginess, or drying out; document changes before choosing treatment."
    },
    "sources": [
      {
        "title": "A warm-weather jump on seed starting",
        "url": "https://extension.umn.edu/about/our-stories/news/yard-and-garden-news/a-warm-weather-jump-on-seed-starting"
      },
      {
        "title": "How to prevent seedling damping off",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/yard-and-garden-problems/how-to-prevent-seedling-damping-off"
      }
    ],
    "application_note": "This is interim general seedling handling, not confirmed pepper or cactus care. A confirmed succulent seedling needs a separate age-specific template.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  },
  "cactus_provisional": {
    "name": "Found cactus piece — rooting",
    "status": "reviewed_provisional_species",
    "identification": "Likely brittle prickly pear (Opuntia fragilis), a tentative working identification. Cyrus confirms a found detached piece and reports good rooting, not a seedling.",
    "watering": {
      "when": "Allow the mix to dry between waterings. While roots are establishing, water sparingly and avoid keeping the base or mix wet. Check moisture and pot weight; no fixed watering interval is assigned.",
      "method": "If bottom-watering while roots establish, use controlled shallow contact only as needed, then drain promptly; do not use a fixed mature-pot soak timer. Once well rooted, hydrate the dry mix and drain completely.",
      "seasonal": "Adjust to actual pot drying and growth; light placement and overwinter planning are deferred.",
      "notes": "Cyrus reports this found piece is rooting nicely. Rooting-cutting guidance applies while it establishes; this is not a continuously moist seedling protocol. Do not disturb good new roots solely to identify the species."
    },
    "care": {
      "soil": "Fast-draining cactus mix in a pot with drainage. No immediate repotting is prescribed for a piece already rooting well.",
      "feed": "Do not add a routine feed while roots establish. Once established and actively growing, use modest label-directed cactus feed, accounting for nutrients already in the mix.",
      "pruning": "Protect new roots and handle spines carefully. No cutting, edible harvest, or major pruning is assigned while species remains unconfirmed.",
      "trouble": "Investigate a soft or darkening base, collapse, or persistent wetness before watering again; record the change rather than diagnosing from this photo alone."
    },
    "sources": [
      {
        "title": "Cacti and Succulents — University of Minnesota Extension",
        "url": "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/cacti-and-succulents"
      },
      {
        "title": "Brittle Prickly Pear — E-Flora BC, University of British Columbia",
        "url": "https://linnet.geog.ubc.ca/Atlas/Atlas.aspx?sciname=Opuntia+fragilis"
      }
    ],
    "application_note": "General cactus cutting guidance is adapted conservatively to a found piece with user-reported rooting. The species guess does not establish cold hardiness, edible use or a watering interval.",
    "deferred": [
      "light_placement",
      "overwinter_planning"
    ]
  }
};
// Brief reminders summarize the existing moisture guidance; they are not fixed watering intervals.
const PLANT_WATER_CUES = {
  tomato: 'Water as the root zone starts drying; do not let it dry out completely.',
  fittonia: 'Water before the root ball dries; keep it lightly moist, never soggy.',
  croton: 'Water when the top half-inch to one inch is dry.',
  strawberry: 'Water when the surface is dry; do not let the whole pot dry out.',
  rosemary: 'Water after the mix has dried somewhat; wait if it is still damp.',
  allium_provisional: 'Water when the surface starts drying; keep shallow roots moist.',
  succulent_provisional: 'For an established rooted plant, water when the mix has dried through.',
  dianthus: 'Water after slight surface drying; wait if the root zone is still wet.',
  candytuft: 'Allow some drying between waterings; do not keep the crown constantly wet.',
  impatiens: 'Water when the surface is dry; keep the root zone moist, not soggy.',
  philodendron_provisional: 'Water after slight surface drying, only if the deeper root zone is not still moist.',
  jade: 'Water when the mix is dry, then drain completely.',
  oregano: 'Water after slight surface drying; wait if the root zone is still wet.',
  spinach: 'Water as the mix starts drying; keep roots evenly moist, never soggy.',
  seedling_unknown: 'Plant unidentified; watering timing needs confirmation. Wait if wet.',
  daisy_provisional: 'Water when the root zone is becoming dry and the pot feels light.',
  mint: 'Water as the surface starts drying; do not let the whole pot dry out.',
  parsley: 'Water before the whole pot dries; keep the mix evenly moist, not soggy.',
  amaranth: 'Keep the mix moist, not saturated; check moisture and pot weight before watering.',
  sage_provisional: 'Water when the root zone is becoming dry and the pot feels light.',
  pepper_provisional: 'Seedling timing is not confirmed; check its small root zone and wait if wet.',
  cactus_provisional: 'Allow the mix to dry between waterings; water sparingly while roots establish.'
};

const PLANT_HARVEST_TEMPLATES = {
  "spinach": {
    "ongoing": true,
    "badge": "🥬 Pick as needed",
    "hdrNote": "usable leaves and enough growth",
    "signsLabel": "🍴 When to pick",
    "signs": "Pick individual tender leaves at a usable size when enough healthy growth can remain. This does not claim the plant is ready today; no calendar harvest is assigned.",
    "how": "Snip a few outer leaves, leaving the central growing point and younger leaves to continue growing. Do not strip a tiny seedling.",
    "fact": "Spinach was confirmed by Cyrus, correcting the earlier pepper guess."
  },
  "oregano": {
    "ongoing": true,
    "badge": "✂️ Pick as needed",
    "hdrNote": "once well established",
    "signsLabel": "🍴 When to pick",
    "signs": "Pick a few healthy leafy sprigs once the plant is well established. This is not a claim that it is ready today; there is no calendar harvest.",
    "how": "Snip lightly, leaving plenty of healthy foliage for regrowth. Larger harvests are best just before flowering.",
    "fact": "Greek oregano was confirmed by Cyrus, not identified from the photo."
  },
  "mint": {
    "ongoing": true,
    "badge": "✂️ Pick as needed",
    "hdrNote": "healthy established growth",
    "signsLabel": "🍴 When to pick",
    "signs": "Pick a few healthy soft tips when needed, once this particular pot is established. There is no calendar harvest or required picking routine.",
    "how": "Snip a few soft tips. Leave plenty of healthy growth and allow this pot to recover; defer a large cut until it is healthy and established.",
    "fact": "Mint variety is unconfirmed. The seven mint pots have separate harvest and watering records."
  },
  "parsley": {
    "ongoing": true,
    "badge": "✂️ Pick as needed",
    "hdrNote": "outer leafy stems",
    "signsLabel": "🍴 When to pick",
    "signs": "Pick a few healthy outer leafy stems when needed, leaving the central young growth. There is no calendar harvest.",
    "how": "Harvest a few outer leafy stems at their bases; leave the central growing point.",
    "fact": "Kitchen picking is optional and separate from removing dead or yellow foliage."
  },
  "rosemary": {
    "ongoing": true,
    "badge": "✂️ Pick as needed",
    "hdrNote": "leafy shoot tips",
    "signsLabel": "🍴 When to pick",
    "signs": "Choose healthy leafy shoot tips when needed. There is no calendar harvest.",
    "how": "Snip leafy shoot tips lightly. Avoid cutting into bare old wood.",
    "fact": "Keep most of the healthy foliage; a large cut is not needed for a kitchen sprig."
  },
  "strawberry": {
    "ongoing": true,
    "badge": "🍓 Pick only when ripe",
    "hdrNote": "check each berry",
    "signsLabel": "👀 Ripe fruit only",
    "signs": "For red-fruited strawberries, wait until a berry is fully red to the shoulders. Cultivar and bearing type are unconfirmed; do not use a calendar date as a ripeness signal.",
    "how": "Support the ripe berry and snip its stem, leaving the green cap attached. Do not pull the plant or crown. Check each crown or pocket separately.",
    "fact": "Strawberries do not continue ripening after picking. This card makes no claim that fruit is currently ready."
  },
  "tomato": {
    "ongoing": true,
    "badge": "🍅 Pick only when ripe",
    "hdrNote": "variety still unconfirmed",
    "signsLabel": "👀 Ripeness check",
    "signs": "Use mature color for the actual variety and a slight give, not a calendar date. The heirloom cultivar is unknown, so do not assume every ripe tomato must be red.",
    "how": "Support the fruit and snip a tough stem with clean scissors or pruners instead of yanking on the plant or cage. Leave immature fruit to develop.",
    "fact": "No harvest date or claim that the photographed green fruit is ready has been assigned."
  }
};

function plantText(value){
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function plantSourceLinks(sources){
  const unique = [...new Map((sources || []).filter(s => s && /^https:\/\//.test(s.url)).map(s => [s.url, s])).values()];
  return unique.length ? '<span class="plant-care-sources">Sources: ' + unique.map(s => '<a href="'+plantText(s.url)+'" target="_blank" rel="noopener noreferrer">'+plantText(s.title)+'</a>').join(' · ') + '</span>' : '';
}
function plantSharedSources(section){
  return (section.source_ids || []).map(id => PLANT_CARE_SOURCE_CATALOG[id]).filter(Boolean);
}
function plantCareTemplate(p){ return PLANT_CARE_TEMPLATES[p.careTemplateKey]; }
function plantCareSources(p){ return plantCareTemplate(p).sources || []; }
function plantProvisionalIdentity(p){ return /provisional|unconfirmed/.test(p.plantType) || p.plantType === 'amaranth'; }
function plantIdentityWarning(p){
  return plantProvisionalIdentity(p) ? 'Identification remains provisional. ' + plantCareTemplate(p).identification + ' Do not eat or harvest until identity and edible use are confirmed.' : '';
}
function plantNote(p){
  return [...new Set([p.placementNote, p.identityNote, p.waterNote, plantCareTemplate(p).watering.notes, plantIdentityWarning(p)].filter(Boolean))].join(' ');
}

const PLANTS = PLANT_INVENTORY_20261006.map(p => {
  const t = plantCareTemplate(p), h = PLANT_HARVEST_TEMPLATES[p.plantType];
  return {
    ...p,
    sourceCardsStatus: p.cardsStatus,
    cardsStatus: 'active_current_inventory',
    loc: p.location,
    days: 1,
    checkOnly: true,
    lastWatered: '2026-10-06',
    preferredWateringMethod: 'bottom_watering',
    provisionalIdentity: plantProvisionalIdentity(p),
    identityWarning: plantIdentityWarning(p),
    light: '☀️ Light assessment deferred',
    waterChip: '👀 Daily soil check · water only when needed',
    waterCue: PLANT_WATER_CUES[p.careTemplateKey],
    harvestChip: h ? h.badge + ' · no calendar harvest' : (plantProvisionalIdentity(p) ? '🔎 Identity or edible use unconfirmed · do not harvest' : '🪴 Foliage / flowers · no edible harvest advice'),
    freq: t.watering.when,
    note: plantNote(p)
  };
});

const PLANT_INFO = Object.fromEntries(PLANTS.map(p => [p.id, {
  photo: p.photo,
  photoPos: p.photoPosition,
  photoPosition: p.photoPosition,
  photoFit: p.photoFit,
  alternatePhotos: p.alternatePhotos.slice(),
  identification: p.identification,
  careTemplateKey: p.careTemplateKey,
  plantType: p.plantType,
  loc: p.loc,
  fact: plantText(plantCareTemplate(p).identification) + '<br>' + plantText(p.pot.description) + (p.identityWarning ? '<br>' + plantText(p.identityWarning) : '') + '<br>' + plantSourceLinks(plantCareSources(p)),
  note: p.note,
  sources: plantCareSources(p)
}]));

const WATER_INFO = Object.fromEntries(PLANTS.map(p => {
  const t = plantCareTemplate(p), bottom = PLANT_CARE_SHARED.bottom_watering, flush = PLANT_CARE_SHARED.salt_flush;
  const smallRoot = ['seedling_unknown','pepper_provisional'].includes(p.careTemplateKey);
  const sources = [...plantCareSources(p), ...plantSharedSources(bottom), ...plantSharedSources(flush)];
  const smallRootNote = smallRoot ? '<br><b>Seedling exception:</b> Use gentle shallow bottom contact rather than the ordinary pot depth/timer below; stop once the mix absorbs moisture, then drain. The drying threshold remains provisional.' : '';
  const ordinarySoak = p.careTemplateKey === 'cactus_provisional' ? '' : '<br><b>'+plantText(bottom.label)+':</b><ol>' + bottom.steps.map(step => '<li>'+plantText(step)+'</li>').join('') + '</ol>';
  return [p.id, {
    when: '<b>Daily reminder = soil check, not watering.</b> ' + plantText(t.watering.when) + '<br><b>This pot:</b> ' + plantText([t.watering.notes,p.waterNote].filter(Boolean).join(' ') || 'Check and log this physical pot separately.') + '<br><b>Method:</b> ' + plantText(t.watering.method) + smallRootNote + ordinarySoak + '<br>' + plantText(bottom.endpoint) + '<br>' + plantText(bottom.exceptions) + ' ' + plantText(bottom.water) + '<br><b>'+plantText(flush.label)+':</b> ' + plantText(flush.text) + '<br>' + plantText(t.watering.seasonal) + '<br>' + plantSourceLinks(sources),
    thirst: plantText(PLANT_CARE_SHARED.trouble_baseline.text),
    checkOnly: true,
    potNote: p.waterNote || '',
    potNoteBasis: p.waterNoteBasis || '',
    sources
  }];
}));

const FUN_FACTS = Object.fromEntries(PLANTS.map(p => {
  const t = plantCareTemplate(p);
  return [p.id, [t.identification, t.watering.notes || t.care.soil, p.waterNote || 'This physical pot keeps its own history. A soil check is not a watering record.'].map(plantText)];
}));
const CARE_INFO = Object.fromEntries(PLANTS.map(p => {
  const t = plantCareTemplate(p);
  return [p.id, {
    fact: '<b>Soil / drainage:</b> ' + plantText(t.care.soil) + ' All pots are well drained, confirmed by the user.<br><b>Pruning / handling:</b> ' + plantText(t.care.pruning) + (p.note ? '<br><b>Current notes:</b> '+plantText(p.note) : '') + (t.application_note ? '<br><b>How this guidance applies:</b> '+plantText(t.application_note) : '') + '<br>Light placement and overwinter planning remain deferred.<br>' + plantSourceLinks(plantCareSources(p)),
    sources: plantCareSources(p)
  }];
}));
const PEST_INFO = Object.fromEntries(PLANTS.map(p => [p.id, {
  look: plantText(plantCareTemplate(p).care.trouble),
  fix: plantText(PLANT_CARE_SHARED.trouble_baseline.text) + ' Confirm the cause before treatment; no pesticide protocol is assigned.<br>' + plantSourceLinks([...plantCareSources(p), ...plantSharedSources(PLANT_CARE_SHARED.trouble_baseline)]),
  sources: plantCareSources(p)
}]));
const FEED_INFO = Object.fromEntries(PLANTS.map(p => [p.id, {
  what: plantText(plantCareTemplate(p).care.feed),
  how: plantText(PLANT_CARE_SHARED.feeding_baseline.text) + ' ' + plantText('Check potting-mix fertilizer and recent feeding before adding another fertilizer.') + '<br>' + plantSourceLinks([...plantCareSources(p), ...plantSharedSources(PLANT_CARE_SHARED.feeding_baseline)]),
  sources: plantCareSources(p)
}]));

function dayOfYear(){ const n=new Date(); return Math.floor((n-new Date(n.getFullYear(),0,0))/86400000); }
function dailyFact(id){ const a=FUN_FACTS[id]; if(a&&a.length) return a[dayOfYear()%a.length]; return (PLANT_INFO[id]||{}).fact||""; }

// Only confirmed edible plant groups receive harvest cards. Unidentified seedlings,
// likely sage/pepper, provisional Allium, and species-uncertain amaranth are excluded.
const HARVEST_INFO = Object.fromEntries(PLANTS.filter(p => PLANT_HARVEST_TEMPLATES[p.plantType]).map(p => [p.id, {
  ...PLANT_HARVEST_TEMPLATES[p.plantType],
  fact: plantText(PLANT_HARVEST_TEMPLATES[p.plantType].fact) + '<br>' + plantSourceLinks(plantCareSources(p)),
  sources: plantCareSources(p)
}]));

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
  // Source: Recipes/Recipe Box/Shareable/Zoey - Chicken & Brown Rice Split Batch.txt (2026-09-30).
  { id:"r_zoey_chicken_split", name:"Zoey's Chicken & Brown Rice Split Batch", emoji:"🐕", dog:true,
    fixedBatch:true, trial:false, servings:"4 lb chicken · two separate batches",
    tags:["dog","Zoey","chicken","brown rice","freezer","temporary batch"],
    blurb:"Split 4 lb RAW chicken into TWO separate formulas: 3 lb for the regular temporary batch below and 1 lb for the separate plain freezer recipe. For the regular batch, brown rice, carrots, and sweet potato cook TOGETHER in ONE pressure cycle in a 6- or 8-quart Instant Pot. Use standard measuring cups for rice and water; weigh solids in ounces. Fish weights are DRAINED and cup estimates are approximate. Dog food only — no salt, seasoning, onion, or garlic. The regular batch intentionally omits iodine and vitamin E/wheat-germ oil: it is temporary, not a permanent sole diet.",
    batches:[
      { title:"1 · Regular chicken batch — temporary", subtitle:"3 lb chicken · rice, carrots, and sweet potato in ONE pressure cycle",
        ingredients:[
          "Chicken breast: 48 oz / 3 lb RAW",
          "Brown rice: 2 cups DRY, rinsed and drained",
          "Plain water: 2.5 cups / 20 fl oz, for the combined pressure cycle",
          "Raw carrots: 5 oz — about 1 cup chopped",
          "Green beans: 5 oz — about 1 cup chopped",
          "Peas: 6 oz — about 1 cup",
          "Raw sweet potato: 8 oz — about 1.5 cups diced",
          "Canned salmon: 8 oz DRAINED — about 1.25 cups flaked",
          "Beef liver: 2.5 oz",
          "Cooked/canned oysters: 3 oz DRAINED",
          "Flour-fine eggshell powder: 2 LEVEL tsp with soft-bone canned salmon, OR 2.25 LEVEL tsp with BONELESS canned salmon (2 tsp + 0.25 tsp) — choose ONE amount"
        ],
        steps:[
          "LOAD THE INSTANT POT: start with an empty metal inner pot fitted inside the 6- or 8-quart Instant Pot. Add 2 cups rinsed DRY brown rice and 2.5 cups plain water directly to the inner pot. Stir so all rice is wet. Dice 5 oz carrots and 8 oz sweet potato into roughly 1-inch pieces and put them on top. No basket or trivet.",
          "ONE PRESSURE CYCLE: close and lock the pressure lid; set the valve to Sealing if your model requires it. Select Pressure Cook / Manual, HIGH, 30 minutes. The timer starts after pressure builds. When finished, turn off Keep Warm and allow a FULL natural pressure release until the float valve drops before opening. Mash the very soft carrots and sweet potato into the rice; this soft texture is intentional.",
          "GREEN BEANS + PEAS: while the combined pot cooks, steam or microwave 5 oz green beans and 6 oz peas with a splash of water until soft. Chop or mash.",
          "CHICKEN + LIVER: while the combined pot cooks, poach the 3 lb RAW chicken in a separate stovetop pot with plain water to cover. Simmer until the thickest part of EACH breast reaches 165°F, then shred finely. Cook 2.5 oz liver thoroughly in a separate small pan or saucepan without oil or seasoning; chop finely.",
          "MIX THE REGULAR BATCH: combine its chicken with the ENTIRE rice-carrot-sweet-potato mixture, green beans, peas, cooked liver, 8 oz drained canned salmon, and 3 oz drained cooked/canned oysters. Mash any soft canned salmon bones thoroughly into the fish and chop the oysters finely. The 2 cups dry rice yield approximately 5–6 cups cooked; do not remove or separately weigh cooked rice, and do not run another vegetable pressure cycle.",
          "ADD EGGSHELL: after the mixture stops steaming, mix flour-fine eggshell powder extremely thoroughly throughout the regular batch. Use 2 level tsp if the salmon includes soft edible bones OR 2.25 level tsp if boneless. No iodine, vitamin E, or wheat-germ oil.",
          "PORTION, CHILL, FREEZE: use shallow containers and refrigerate promptly to cool. Do not wait for the whole batch to become cold on the counter. Keep 2–3 days of regular portions refrigerated and freeze the rest once chilled."
        ],
        note:"No iodine. No vitamin E or wheat-germ oil. This is a temporary batch, not Zoey's permanent sole diet."
      },
      { title:"2 · Plain freezer batch — separate saved recipe", subtitle:"1 lb chicken · separately cooked PLAIN rice · water ONLY",
        ingredients:[
          "Chicken breast: 16 oz / 1 lb RAW",
          "PLAIN brown rice: 14 oz cooked — about 2 cups, prepared SEPARATELY",
          "Fresh warm water: 4–8 fl oz / 1/2–1 cup, to moisten"
        ],
        steps:[
          "Poach the 1 lb chicken in plain water until it reaches 165°F, then shred.",
          "Mix with 14 oz / about 2 cups separately cooked PLAIN brown rice. Do not use the regular batch's rice-and-vegetable mixture.",
          "Start with 4 fl oz / 1/2 cup fresh warm water, adding more until soft and moist.",
          "Portion into shallow containers, refrigerate promptly to chill, then freeze."
        ],
        note:"Nothing else goes in this batch: no vegetables, liver, oysters, salmon, eggshell, oils, seasoning, iodine, or vitamin E. Keep separate from the regular batch."
      }
    ],
    note:"Safe cooling: after the regular mixture stops steaming, mix in its eggshell; portion into shallow containers and refrigerate promptly, within 2 hours of cooking (1 hour above 90°F). Do not leave the batch on the counter waiting to become cold. Freeze once chilled. <a href=\"https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety\" target=\"_blank\" rel=\"noopener\">USDA cooling guidance</a>."
  },
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

// ── 🔎 PAUSED FLIP SCAN — saved for later, never rendered or scheduled while moving and house hunting
const PAUSED_FLIP_SCAN = {
  paused:true,
  pausedOn:"2026-08-04",
  resume:"No date chosen. Cyrus will decide when moving and house hunting are no longer taking priority.",
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

// ── 📺 TV FOLLOW-UP — separate move-relevant reminder. The legacy completion key stays stable so
// existing daily reminder history is preserved while Cyrus deals with the TV already found.
const TV_FOLLOWUP = {
  label:"Fix or get rid of the TV I found",
  at:"Morning",
  links:[],
  tip:"Choose one concrete path: test and repair it, list it for parts or free pickup, or take it to electronics recycling."
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
    { id:"xfinity",     due:"~28th",  sort:28, label:"📡 Xfinity internet",           amt:134.76,  note:"Transfer service to the new house; confirm installation and the old-address cutoff date." },
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
    { t:"Keep the cards open until they are paid", b:"Closing cards early hurts more than it helps. The two annual-fee Credit One cards DO get closed — but only after their balances hit zero." },
    { t:"Do not budget perfectly — budget simply", b:"First budget ever? Perfect is the enemy. Update balances when you think of it, check bills off as they are paid, glance at the gap. That is the whole job — you are already doing it." }
  ]
};
