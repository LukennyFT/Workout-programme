// React + hooks come from the UMD globals loaded in index.html
const { useState, useEffect, useRef } = React;

// --- Persistence shim ---------------------------------------------------
// The component below expects a `window.storage` async key/value API.
// In a normal browser that doesn't exist, so we back it with localStorage.
// This is the ONLY addition to the original code; everything else is as-is.
if (typeof window !== "undefined" && !window.storage) {
  const LS = window.localStorage;
  window.storage = {
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < LS.length; i++) {
        const k = LS.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return { keys };
    },
    async get(key) {
      const value = LS.getItem(key);
      return value == null ? null : { value };
    },
    async set(key, value) { LS.setItem(key, value); },
    async delete(key) { LS.removeItem(key); },
  };
}
// ------------------------------------------------------------------------

const days = [
  {
    id: "mon",
    label: "MON",
    title: "Push B + Core",
    subtitle: "Volume & Core Strength",
    emoji: "🔁",
    color: "#d4a843",
    duration: "~55 min",
    rest: "60–90 sec between sets",
    muscles: "Chest · Triceps · Shoulders · Core",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Arm circles — 10 forward, 10 backward",
      "Banded shoulder external rotations — 2×12 per side",
      "Scapular push-ups — 2×10",
      "Band / arm pull-aparts — 2×15",
      "Pike push-up to downward dog — 2×8",
    ],
    cooldown: [
      "Doorframe chest stretch — 60 sec per side",
      "Cross-body shoulder stretch — 30 sec per side",
      "Tricep overhead stretch — 30 sec per side",
      "Supine hamstring stretch — 2 min per leg (toe-touch maintenance)",
      "Child's pose — 60 sec",
    ],
    sections: [
      {
        title: "Push B",
        duration: "~25 min",
        exercises: [
          {
            name: "Push-Up Variation (Rotating Weekly)",
            tag: "Chest · Triceps · Volume Base",
            sets: "4 sets",
            reps: "15–20 reps",
            rest: "60 sec",
            how: "Rotate the variation each week to hit the chest from different angles and prevent adaptation. Week A: Wide-grip push-up (hands wider than shoulder-width, emphasises outer chest). Week B: Close-grip push-up (hands shoulder-width or narrower, tricep focus). Week C: Archer push-up (one arm extends wide while the other bends — a unilateral progression). All variations: keep body in a straight plank, lower chest to floor, full lockout at top.",
            progress: "Add a weighted vest or backpack once 4×20 is comfortable.",
            regression: "Elevate hands on a surface (incline push-up) to reduce load.",
          },
          {
            name: "Bodyweight Skull Crusher",
            tag: "Triceps · Long Head · Overhead Stretch",
            sets: "3 sets",
            reps: "6–10 reps",
            rest: "60 sec",
            how: "Set rings or a sturdy bar at roughly chest height. Stand a step back from the anchor and lean forward with arms extended overhead, gripping the rings/bar — your body should be at an angle, weight on the balls of your feet. From this leaning straight-arm position, bend ONLY at the elbows, letting your elbows travel forward and overhead as you lower your forehead toward the rings/bar. Your upper arms should finish pointing roughly at the anchor, parallel to the ground, with your forearms folded down. Press back to a fully straight-arm position by extending the elbows. The further you lean (more horizontal body), the harder. This is the missing piece in your push days — it trains the long head of the triceps in a stretched, overhead position which the other movements don't.",
            progress: "Increase lean angle (more horizontal = more bodyweight loaded onto the movement).",
            regression: "Reduce lean angle so your body is more upright. If even that's hard, do this on the floor as a kneeling overhead band extension instead.",
          },
          {
            name: "Wall Handstand Hold",
            tag: "Shoulder Stability · Handstand Prep",
            sets: "3 sets",
            reps: "20–30 sec hold",
            rest: "90 sec",
            how: "Face the wall and walk your hands close to it, kicking up into a handstand so your chest faces the wall (not your back). This chest-to-wall position forces a straighter body line than the more common back-to-wall version. Press actively through your shoulders (don't just hang into them), squeeze your glutes and point your toes. Focus on consistent balance and shoulder strength. Over weeks, work on removing one hand briefly to build toward freestanding.",
            progress: "Reduce how much you rely on the wall. Introduce freestanding kick-up attempts.",
            regression: "Hold for shorter durations; back-to-wall version if chest-to-wall isn't accessible yet.",
          },
          {
            name: "Dip Bar / Chair Dip",
            tag: "Triceps · Pressing Endurance",
            sets: "3 sets",
            reps: "12–15 reps",
            rest: "60 sec",
            how: "Use parallel dip bars or the edge of two sturdy chairs. Hands grip the bars, arms straight, legs either bent or extended. Lower until upper arms are roughly parallel to the floor, then press back to lockout. Keep elbows tracking back, not flaring wide. Keep chest slightly forward to target triceps and lower chest evenly. This is your volume finisher for the push session.",
            progress: "Straighten legs and extend them forward. Add a weight vest.",
            regression: "Bend knees and keep feet on floor to reduce load.",
          },
        ],
      },
      {
        title: "Core",
        duration: "~20 min",
        note: "Grip is fresh after Monday's push session and recovered from Tuesday's pull — ideal for the L-sit and hanging leg raises which both demand significant grip strength.",
        exercises: [
          {
            name: "L-Sit Progression",
            tag: "Hip Flexors · Triceps · Ab Compression",
            sets: "3 sets",
            reps: "10–20 sec hold",
            rest: "60 sec",
            how: "Use parallettes, dip bars, or the floor. Press down through your hands, lock out your arms, and lift your hips. Three levels — work at your current level until the top of the hold range is comfortable before advancing: Level 1 (Tuck L-sit) — both knees tucked toward chest. Hold for 10–20 seconds. Level 2 (Single-leg) — one leg extended straight, one tucked. 10–15 sec per side. Level 3 (Full L-sit) — both legs straight and parallel to the floor. 10–20 sec. The key is keeping hips from drooping — actively push them up by pressing hard through the hands.",
            progress: "Extend hold duration at each level before moving to the next.",
            regression: "Use higher parallettes or keep both feet lightly touching the floor.",
          },
          {
            name: "Hanging Leg Raises",
            tag: "Hip Flexors · Lower Abs",
            sets: "3 sets",
            reps: "8–15 reps",
            rest: "60 sec",
            how: "Hang from the bar in a dead hang with shoulders packed down. Three levels: Level 1 (Hanging knee raise) — pull both knees up toward your chest, lower slowly. 10–15 reps. Level 2 (Straight-leg raise to 90°) — keep legs straight and raise them until they're horizontal (parallel to the floor), lower slowly. 8–12 reps. Level 3 (Toes-to-bar) — raise straight legs all the way up to touch the bar. 6–10 reps. No kipping or swinging — if you swing, pause at the bottom to reset before each rep. This is harder and more effective than any machine ab exercise.",
            progress: "Move up a level. Add ankle weights.",
            regression: "Use bent knees or reduce range of motion.",
          },
          {
            name: "Dead Bug",
            tag: "Anti-Rotation · Core Stability · Lower Back Reset",
            sets: "3 sets",
            reps: "8 reps per side",
            rest: "45 sec",
            how: "Lie on your back with your lower back pressed firmly to the floor. Raise both arms straight up and both legs to 90° (tabletop position). This is your starting position. Slowly lower one arm overhead toward the floor while simultaneously lowering the opposite leg toward the floor — keeping both straight. Return to start before switching sides. The critical rule: your lower back must stay in contact with the floor throughout. If it lifts, reduce your range. This exercise resets the lumbar spine after a week of heavy training and builds deep core stability.",
            progress: "Slow the movement to 5 seconds per extension.",
            regression: "Lower just the arm (no leg) until core strength develops.",
          },
          {
            name: "Side Plank",
            tag: "Lateral Core · Obliques · Glute Med",
            sets: "2 sets per side",
            reps: "30–45 sec hold",
            rest: "30 sec",
            how: "Lie on your side, forearm on the floor, elbow directly below your shoulder. Stack your feet or stagger them for balance. Lift your hips so your body forms a straight diagonal line from head to feet. Keep your top hip from rotating forward or dropping. Focus on the obliques pulling your hip up. For the RKC variation: add maximum tension throughout your whole body — squeeze your fist, glutes, quads — turning this into an active full-body contraction rather than a passive hold.",
            progress: "Add hip dips (lower hip to floor and raise). Progress to raised-leg side plank.",
            regression: "Drop the bottom knee to the floor to reduce load.",
          },
        ],
      },
    ],
  },
  {
    id: "tue",
    label: "TUE",
    title: "Pull B + Core",
    subtitle: "Power, Volume Pull & Core",
    emoji: "🔁",
    color: "#9b6fe8",
    duration: "~55 min",
    rest: "60 sec between sets",
    muscles: "Back · Biceps · Core",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Dead hang — 2×20 sec",
      "Scapular pull-ups — 2×8",
      "Band pull-aparts — 2×15",
      "Standing hamstring swings — 10 per leg",
    ],
    cooldown: [
      "Lat stretch (overhead reach on bar) — 2×45 sec",
      "Doorway bicep stretch — 30 sec per side",
      "Thread the needle — 45 sec per side",
      "Supine hamstring stretch — 2 min per leg (toe-touch maintenance)",
      "Child's pose — 60 sec",
    ],
    sections: [
      {
        title: "Pull B",
        duration: "~30 min",
        exercises: [
          {
            name: "Explosive Pull-Up",
            tag: "Power · Muscle-Up Foundation",
            sets: "4 sets",
            reps: "3–5 reps",
            rest: "2–3 min",
            how: "Placed first on Tuesday so your nervous system is completely fresh — power work degrades fast with weekly fatigue, and this is the freshest pull day of the week. Start from a full dead hang. Pull as fast and explosively as you possibly can, with the goal of bringing the bar as low on your body as possible — aim for upper chest or sternum height rather than just clearing your chin. The bar staying high (chin level) means not enough power; getting it to your lower chest is the standard you're chasing for a muscle-up. Lower under control to a full dead hang and reset completely between reps — no rushing, no swinging, no kipping. Every rep should be a maximal-intent effort. Keep reps low (3–5) and rest long (2–3 min) so power output stays high on every single rep. If you ever feel reps getting slower or lower, end the set — quality over quantity always with power training.",
            progress: "Aim to bring the bar progressively lower on your body. Once you can consistently pull to lower-chest height, you're ready for transition-specific work.",
            regression: "Band-assisted explosive pull-ups — loop a resistance band under your feet to reduce bodyweight while still training maximal pulling speed.",
          },
          {
            name: "Pull-Up Negative",
            tag: "Vertical Strength · Eccentric Overload",
            sets: "3 sets",
            reps: "3 reps",
            rest: "90 sec",
            how: "Jump or step up to the top position of a pull-up (chin over the bar). From there, lower yourself as slowly as possible — aim for 4–5 seconds per rep. Resist the descent the entire way; don't just fall and catch yourself near the bottom. Reach a full dead hang at the bottom, then jump back up for the next rep — do NOT pull yourself up (this would be a regular pull-up and steal energy from the negative work). Negatives load the eccentric phase, which builds vertical pulling strength faster than concentric-only work, and at lower CNS cost than max-effort pull-ups. Pairs perfectly with explosive pull-ups: explosive trains the concentric (pulling up fast), negatives train the eccentric (controlling the descent). Together they cover both halves of the pull-up strength curve.",
            progress: "Increase descent time to 6–8 seconds per rep. Once 3×3 at 6 seconds is comfortable, add weight (vest or backpack).",
            regression: "Reduce descent time to 3 seconds. If even that's hard, use band assistance under your feet.",
          },
          {
            name: "Australian Pull-Up / Inverted Row",
            tag: "Horizontal Pull · Upper Back · Volume",
            sets: "4 sets",
            reps: "12–15 reps",
            rest: "60 sec",
            how: "Use a low bar (smith machine, playground bar) or the underside of a sturdy table. Lie below it with arms extended and grip the bar. Pull your chest up to the bar, leading with your elbows and squeezing your shoulder blades at the top. Lower with full control. Lower body angle = harder; more upright angle = easier.",
            progress: "Elevate feet. Add weight vest.",
            regression: "Use a higher bar (more upright angle = easier).",
          },
          {
            name: "Ring Bicep Curl",
            tag: "Biceps · Isolation",
            sets: "3 sets",
            reps: "10–12 reps",
            rest: "60 sec",
            how: "Stand facing the ring anchor. Hold both rings with an underhand (supinated) grip, palms facing up. Keep your elbows completely fixed at your sides — they shouldn't travel forward or backward at all. Curl your hands toward your shoulders, then lower over 3 seconds. The slow eccentric (lowering phase) is where most bicep growth stimulus comes from — don't rush it. Lean your body back slightly to adjust difficulty.",
            progress: "Increase body lean angle.",
            regression: "Reduce lean angle (more upright = easier).",
          },
          {
            name: "Scapular Pull-Up",
            tag: "Scapular Depression · Lat Activation · Shoulder Health",
            sets: "3 sets",
            reps: "10 reps",
            rest: "45 sec",
            how: "Hang in a dead hang from the bar or rings. Without bending your arms at all, depress and retract your shoulder blades — this means pulling them down and slightly together. Your body will rise a few centimetres. Then let your shoulders rise back up to the full dead hang. This is a small movement but it trains the precise scapular control that initiates a technically correct pull-up and protects the shoulder joint. Focus on feeling the lats switch on.",
            progress: "Add a 2-second pause at the depressed position.",
            regression: "Focus on the downward pull only (depression without retraction).",
          },
          {
            name: "Ring / Towel Horizontal Pull-Apart",
            tag: "Rear Delts · Upper Back · Postural Health",
            sets: "3 sets",
            reps: "15 reps",
            rest: "45 sec",
            how: "Hold both rings (or a towel/resistance band) at chest height with both hands close together. Pull them apart horizontally, moving your hands outward to each side in a wide arc. Keep arms roughly straight throughout (slight elbow bend is fine). Squeeze your shoulder blades at the full extension. This targets the rear delts and upper back in a way that directly counters forward head posture and the internal rotation built up from pushing exercises.",
            progress: "Use a thicker band or hold the position at full extension for 2 seconds.",
            regression: "Reduce resistance or range of pull.",
          },
        ],
      },
      {
        title: "Core",
        duration: "~25 min",
        note: "Dragon flags placed here so they're done with fresh grip after the lighter pull session. Do dragon flags first before fatigue accumulates.",
        exercises: [
          {
            name: "Hollow Body Hold",
            tag: "Full-Body Tension · Gymnastics Foundation",
            sets: "3 sets",
            reps: "20–30 sec hold",
            rest: "45 sec",
            how: "Lie on your back. The goal is to create a 'dish' shape — lower back pressed firmly into the floor, arms extended overhead, legs straight and raised. Progress through three levels: Level 1 (Tuck) — knees pulled to chest, arms by sides. Level 2 (Half-hollow) — arms overhead, knees still bent. Level 3 (Full) — arms overhead, legs straight and low. The lower your legs, the harder. If your lower back lifts off the floor, raise your legs higher until you can maintain contact. Hold each level for the full duration before progressing.",
            progress: "Lower your legs toward the floor by 5° each week.",
            regression: "Raise legs higher or bend knees until lower back stays down.",
          },
          {
            name: "Dragon Flag Progression",
            tag: "Anti-Extension · Full-Body Strength",
            sets: "3 sets",
            reps: "See levels below",
            rest: "90 sec",
            how: "Lie on a bench and grip firmly behind your head (the bench edge, a pole, or a partner's ankles). This grip is your anchor — everything else moves. Drive your hips up so your body is supported only on your upper traps/shoulders. From here: Phase 1 (Lying Leg Lifts) — flat on the floor, lower back pressed down, raise both straight legs together slowly and lower with control. 10–15 reps. Phase 2 (Bent-Knee Dragon Flag) — on the bench, hips raised, knees bent. Lower the bent-knee plank slowly, keeping hips up. Return to top. 4–6 reps. Phase 3 (Full Dragon Flag) — same but legs fully straight, rigid body line. Lower over 4–5 seconds. 2–4 reps. Only move to the next phase when you can complete 3 clean sets at the top of the rep range.",
            progress: "Slow the lowering phase further. Aim for 6-second negatives on full dragon flags. Only push reps higher once 3×4 is rock solid.",
            regression: "Return to the previous phase. Never sacrifice form for reps.",
          },
          {
            name: "Ab Roller",
            tag: "Anti-Extension · Shoulder Integration",
            sets: "3–4 sets",
            reps: "6–12 reps",
            rest: "60 sec",
            how: "Kneel on the floor (or stand as you progress) with the ab roller in both hands. Roll forward slowly, extending your arms and hips forward while keeping your lower back completely flat — imagine your spine is a rigid board. Go as far as you can without your lower back arching, then pull the roller back. Pause 1 second at full extension. The temptation is to go further than your core can control — resist this. A half-extension with a flat back is far more effective than a full extension with a sagging lower back.",
            progress: "Increase range of extension. Transition from knees to feet (standing ab rollout) when you can do 4×12 from knees with perfect form.",
            regression: "Reduce range of motion — only roll out as far as you can return from with a flat back.",
          },
          {
            name: "Plank Variations",
            tag: "Isometric Endurance · Stabilisation",
            sets: "2 sets per variation",
            reps: "See below",
            rest: "30 sec between variations",
            how: "Three variations done back to back as a finisher: Standard forearm plank (45–60 sec) — forearms flat, elbows under shoulders, body in a straight line from head to heels. Squeeze glutes and quads. RKC Plank (20–30 sec) — same position but create maximum full-body tension: make fists, squeeze every muscle in your body, try to 'drag' your elbows toward your toes and your toes toward your elbows without moving. This turns a passive hold into an active, intense contraction. Side plank (30–45 sec per side) — on your forearm, body in a straight lateral line. Stack feet or stagger them. Keep hips lifted.",
            progress: "Increase hold durations by 5 sec per week. Add hip dips to side plank.",
            regression: "Drop to knees for any variation that causes form breakdown.",
          },
        ],
      },
    ],
  },
  {
    id: "wed",
    label: "WED",
    title: "Legs + Flexibility",
    subtitle: "Beginner Calisthenics Legs",
    emoji: "🦵",
    color: "#5bbf7a",
    duration: "~65 min",
    rest: "60–90 sec between sets",
    muscles: "Quads · Glutes · Hamstrings · Calves · Hip Flexors · Spinal Mobility",

    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Leg swings forward/back — 10 per leg",
      "Leg swings side to side — 10 per leg",
      "Slow bodyweight squat — 2×10",
      "Hip circles — 10 per side",
    ],
    cooldown: [
      "See Flexibility Finisher below",
    ],
    sections: [
      {
        title: "Legs",
        duration: "~45 min",
        exercises: [
          {
            name: "Bodyweight Squat",
            tag: "Quads · Glutes · Full Leg",
            sets: "4 sets",
            reps: "12–15 reps",
            rest: "90 sec",
            how: "Feet shoulder-width apart, toes angled out 15–30°. Begin the movement by pushing your hips back and down simultaneously — don't just bend your knees. Descend until your thighs are at least parallel to the floor (deeper if your mobility allows and knees feel comfortable). Keep your chest tall and your knees tracking over your toes throughout. Pause for 1 full second at the bottom of each rep — this eliminates the bounce and makes every rep honest. Drive through your whole foot (not just heels) to stand.",
            progress: "Slow eccentric to 4 seconds down. Add a loaded backpack. Progress to goblet squat.",
            regression: "Hold a pole or ring for balance. Reduce depth until mobility improves.",
          },
          {
            name: "Bulgarian Split Squat",
            tag: "Quads · Glutes · Single-Leg Stability",
            sets: "3 sets per leg",
            reps: "8–10 reps per leg",
            rest: "90 sec",
            how: "Stand about a metre in front of a chair or bench. Place the top of your rear foot on the bench behind you. Your front foot should be far enough forward that your shin stays roughly vertical when you lower down. Descend by bending the front knee and lowering the rear knee toward the floor — stop just before it touches. Drive back up through the front heel. The front leg does the vast majority of the work. This is one of the hardest single-leg exercises in calisthenics and will build the foundation for pistol squats.",
            progress: "Hold a dumbbell or wear a weighted vest.",
            regression: "Hold a wall or pole for balance in early weeks. Reduce range of motion.",
          },
          {
            name: "Bodyweight Romanian Deadlift",
            tag: "Hamstrings · Glutes · Posterior Chain",
            sets: "3 sets",
            reps: "12 reps",
            rest: "60 sec",
            how: "Stand with feet hip-width. Maintain a slight bend in your knees throughout — this is a hip hinge, not a squat. Push your hips directly backward while running your hands down your legs toward the floor. Keep your back completely flat — imagine you have a straight rod along your spine. You'll feel a deep stretch in your hamstrings. When you can't hinge further without rounding, drive your hips forward to return to standing. This movement directly overlaps with your toe-touch flexibility goal — you're building hamstring strength and length simultaneously.",
            progress: "Hold a light dumbbell in each hand. Slow the lowering phase to 4 seconds.",
            regression: "Reduce range of motion — only hinge as far as you can maintain a flat back.",
          },
          {
            name: "Jefferson Curl",
            tag: "Loaded Spinal Flexion · Toe-Touch Pattern Builder",
            sets: "3 sets",
            reps: "6 reps",
            rest: "60 sec",
            how: "Stand on a slightly elevated surface (a step, low box, or thick book) with completely straight knees — keep them straight throughout the entire movement. Hold a light dumbbell or kettlebell (start with 5–10 lbs / 2–5 kg, NO heavier) with both hands. Begin by tucking your chin and slowly rolling down vertebra by vertebra, like uncurling a rolled-up carpet — your head tucks first, then upper back rounds, then mid-back, then lower back, finally hinging at the hips. Allow the weight to pull you down as far as your range allows. Pause briefly at the bottom, then reverse: roll back up vertebra by vertebra, hips first, lower back, mid-back, upper back, head last. The whole rep should take 6–10 seconds. Counter-intuitively, this loaded spinal flexion is safe and remarkably effective — it teaches your hip-and-back system to safely accept and own the toe-touch position. Do NOT try to keep a flat back; the whole point is the gradual roll. The keys are: light weight, slow tempo, knees fully locked, controlled segmental movement.",
            progress: "Add 2–5 lbs every 2–3 weeks. Cap progression around 25 lbs / 12 kg — it's not about getting strong, it's about owning the range under load.",
            regression: "No weight. Stand on the floor instead of an elevated surface. Reduce range of motion.",
          },
          {
            name: "Glute Bridge / Hip Thrust",
            tag: "Glutes · Hamstrings · Posterior Chain",
            sets: "3 sets",
            reps: "15 reps",
            rest: "60 sec",
            how: "Lie on your back with knees bent and feet flat on the floor hip-width apart. Drive your hips up by squeezing your glutes hard, until your body forms a straight line from knees to shoulders. At the top, hold for 2 full seconds and squeeze the glutes maximally. Lower slowly. Don't hyperextend your lower back at the top — the movement ends when your hips are in line with your torso. Adding a resistance band just above the knees forces the glutes to work harder to keep knees tracking out.",
            progress: "Elevate shoulders on a bench (hip thrust). Progress to single-leg variation.",
            regression: "Standard floor bridge if bench hip thrust is unavailable.",
          },
          {
            name: "Calf Raise (on step)",
            tag: "Gastrocnemius · Soleus",
            sets: "3 sets",
            reps: "20 reps",
            rest: "45 sec",
            how: "Stand on the edge of a step with the balls of your feet on the edge and your heels hanging off. Lower your heels as far below the step as comfortable to get the full stretch at the bottom. Then rise up onto your toes as high as possible and pause for 1 second. Calves respond very poorly to fast, bouncy reps — slow and deliberate is essential. Alternate: do 10 with toes straight, 5 with toes pointed slightly in, 5 with toes pointed slightly out to hit all angles.",
            progress: "Single-leg calf raise. Add a dumbbell in one hand.",
            regression: "Flat ground (no step) to reduce range of motion.",
          },
          {
            name: "Assisted Pistol Squat",
            tag: "Single-Leg Strength · Pistol Squat Progression",
            sets: "2 sets per leg",
            reps: "5 reps per leg",
            rest: "60 sec",
            how: "Hold a ring, pole, or TRX for balance. Stand on one leg and extend the other leg forward. Slowly lower yourself on the standing leg as deep as you can go while keeping the extended leg off the floor. Use minimal assistance from your hand — it's just for balance, not to pull yourself up. Return to standing. Don't worry about depth yet: train the pattern, build single-leg confidence, and depth will come. This is a long-term skill that develops over months.",
            progress: "Reduce hand assistance. Increase depth.",
            regression: "Allow more weight through the hand. Reduce depth significantly.",
          },
        ],
      },
      {
        title: "Flexibility Finisher",
        duration: "~15 min",
        note: "Your hamstrings and posterior chain are warm and pliable post-training — this is the most effective time of the week to stretch them for toe-touch progress.",
        exercises: [
          {
            name: "Supine Single-Leg Hamstring Stretch",
            tag: "Hamstrings · Low Threat Stretch",
            sets: "3 sets per leg",
            reps: "45 sec hold",
            rest: "15 sec between legs",
            how: "Lie on your back. Loop a towel or strap behind one thigh. Keep the other leg flat on the floor. Gently straighten the raised leg upward as far as comfortable — the knee doesn't need to be fully locked. Use the strap to hold the position; don't actively pull the leg further. On each exhale, consciously relax deeper into the stretch without forcing it. This is the safest hamstring stretch position because lying down reduces the nervous system's threat response.",
            progress: "Bring the leg slightly more vertical each week as flexibility improves.",
            regression: "Keep a generous bend in the knee.",
          },
          {
            name: "Seated Forward Fold",
            tag: "Hamstrings · Lower Back · Progress Marker",
            sets: "3 sets",
            reps: "60 sec hold",
            rest: "15 sec",
            how: "Sit with both legs straight in front of you. If your lower back rounds severely and you can't sit upright at all, place a folded blanket under your hips — this tilts the pelvis forward and makes the position accessible. Hinge forward from your hips (not your waist) as far as you can with a flat back, then allow your back to round and sink further. Reach toward your feet. Each exhale, try to travel 1mm further. Week 1–2 target: reach shins. Week 3–4: ankles. Week 5+: heels then toes.",
            progress: "Remove the blanket elevation as hip mobility improves.",
            regression: "Use more blanket height under the hips.",
          },
          {
            name: "Standing Forward Fold Hang",
            tag: "Full Posterior Chain · Toe-Touch Test",
            sets: "2 sets",
            reps: "60–90 sec hold",
            rest: "20 sec",
            how: "Stand with feet hip-width, soft bend in the knees. Fold all the way forward and hang — let gravity do the work entirely. Shake your head yes and no to release neck tension. After 30 seconds, very slowly try to straighten your knees slightly further without bouncing. This is both a stretch and your weekly progress marker — on Sundays, note exactly where your hands reach and measure the distance from your fingertips to the floor.",
            progress: "Straighten the knees a little more each week.",
            regression: "Keep knees more bent. Hang with completely relaxed arms.",
          },
          {
            name: "Downward Dog with Heel Presses",
            tag: "Calves · Hamstrings · Posterior Chain",
            sets: "2 sets",
            reps: "30 sec + 10 heel presses per side",
            rest: "15 sec",
            how: "From a push-up position, drive your hips up and back into a downward dog. Hold for 30 seconds, then slowly alternate pressing each heel toward the floor — one at a time, with control. The heel press targets the calf and the junction between calf and hamstring, which is often a hidden limiting factor in toe-touch progress. Keep your spine long and straight.",
            progress: "Work toward heels touching the floor in the static hold.",
            regression: "Bend knees generously in the hold.",
          },
        ],
      },
    ],
  },
  {
    id: "thu",
    label: "THU",
    title: "Push A",
    subtitle: "Skill & Strength",
    emoji: "💪",
    color: "#e8643a",
    duration: "~60 min",
    rest: "60–90 sec between sets",
    muscles: "Chest · Shoulders · Triceps · Serratus",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Arm circles — 10 forward, 10 backward",
      "Banded shoulder external rotations — 2×12 per side",
      "Scapular push-ups — 2×10",
      "Band / arm pull-aparts — 2×15",
      "Pike push-up to downward dog — 2×8",
      "Ramp-up set before first working exercise (½ effort × ½ reps)",
    ],
    cooldown: [
      "Doorframe chest stretch — 60 sec per side",
      "Cross-body shoulder stretch — 30 sec per side",
      "Tricep overhead stretch — 30 sec per side",
      "Child's pose shoulder reach — 60 sec",
      "Wrist circles and extensions — 90 sec",
      "Supine hamstring stretch — 2 min per leg (toe-touch maintenance)",
    ],
    exercises: [
      {
        name: "Ring Push-Up",
        tag: "Chest + Ring Stability",
        sets: "4 sets",
        reps: "8–12 reps",
        rest: "90 sec",
        how: "Set rings low (~20cm off floor). Lower your chest between the rings, keeping elbows at roughly 45° to your torso — not flared out wide. At the top of each rep, actively rotate the rings outward (RTO — rings turned out) so your palms face each other or slightly forward. This RTO position is critical: it recruits more chest and builds the shoulder stability needed for future ring skills. Keep your body in a rigid plank throughout.",
        progress: "Elevate your feet on a box once you can complete 4×12 with full control and clean RTO at the top.",
        regression: "Standard push-up on the floor if rings feel too unstable initially.",
      },
      {
        name: "Pike Push-Up / Elevated Pike Push-Up",
        tag: "Shoulders · Handstand Prep",
        sets: "4 sets",
        reps: "6–10 reps",
        rest: "90 sec",
        how: "Start in a downward dog position with hips high. Bend your elbows and lower the top of your head toward the floor between your hands, then press back up. The higher your hips and the more vertical your torso, the more shoulder-dominant this becomes. To increase difficulty, elevate your feet on a box — this shifts the angle closer to a handstand push-up. Keep elbows tracking slightly inward, not splaying wide.",
        progress: "Increase foot elevation weekly. Ultimate goal: wall-supported handstand push-up.",
        regression: "Feet on floor, hips as high as comfortable.",
      },
      {
        name: "Ring Dips",
        tag: "Triceps · Lower Chest · Stability",
        sets: "3 sets",
        reps: "6–10 reps",
        rest: "90 sec",
        how: "Set rings at hip height. Jump to the top support position (arms locked, rings held close to your sides). Lower yourself slowly over 3 seconds, keeping elbows pointing back rather than flaring out. At the bottom your upper arms should be roughly parallel to the floor. The rings will want to rotate outward — actively resist this. Press back up to lockout. Avoid shrugging your shoulders up toward your ears.",
        progress: "Add a pause at the bottom. Eventually add a weight belt.",
        regression: "Keep one or both feet lightly on the floor (feet-assisted ring dips) to reduce load.",
      },
      {
        name: "Pseudo Planche Lean",
        tag: "Anterior Deltoid · Planche Foundation",
        sets: "3 sets",
        reps: "20–30 sec hold",
        rest: "60 sec",
        how: "Get into a push-up position with hands pointing slightly outward. Keeping arms completely straight, lean your entire body forward so your shoulders pass over — or even past — your hands. Your feet stay on the floor. The further you lean, the harder it is. Hold this position with maximum body tension: squeeze glutes, quads, core. This is the foundational strength exercise for the planche skill.",
        progress: "Increase lean distance weekly. Eventually progress to tuck planche holds.",
        regression: "Reduce the lean angle until shoulder strength develops.",
      },
      {
        name: "Plus Push-Up (Scapular Protraction)",
        tag: "Serratus Anterior · Scapular Control",
        sets: "3 sets",
        reps: "12–15 reps",
        rest: "45 sec",
        how: "Get into a standard top-of-push-up position — arms completely straight, body in a rigid plank. This is NOT a normal push-up — your elbows stay locked the entire time. From the top, actively push the floor away further: your shoulder blades should wrap around your ribcage and your upper back should round slightly upward. Hold this 'plus' position for 1 second. Then reverse — let your shoulder blades pinch together so your chest sinks toward the floor (without bending your elbows). The whole movement is just your scapulae sliding around your ribcage. Slow and deliberate — 2 sec up, 2 sec down. This isolates and trains the serratus anterior, the muscle that wraps around your ribcage under your armpits and is critical for handstand, planche, and overhead pressing strength.",
        progress: "Elevate feet on a box to increase load. Eventually progress to a pike plus push-up (hips piked up so the load goes more overhead).",
        regression: "Drop to knees if you can't maintain a flat plank throughout.",
      },
      {
        name: "Ring Fly (Partial ROM)",
        tag: "Chest Stretch Under Load",
        sets: "3 sets",
        reps: "8–10 reps",
        rest: "60 sec",
        how: "Set rings at chest height. Lean forward into the rings with straight arms (slight elbow bend is fine). Slowly allow the rings to open out to your sides, feeling a stretch across your chest. Only open as wide as you can confidently return from — this is not a stretch, it's a controlled strength movement. Drive the rings back together in front of you to complete the rep. This is considerably harder than it looks.",
        progress: "Increase lean angle (more bodyweight through the rings) as strength improves.",
        regression: "Reduce range of motion — even a small opening builds the strength pattern.",
      },
    ],
  },
  {
    id: "fri",
    label: "FRI",
    title: "Pull A",
    subtitle: "Skill & Strength",
    emoji: "🏋️",
    color: "#4a9edd",
    duration: "~55 min",
    rest: "90 sec between sets",
    muscles: "Back · Biceps · Rear Delts · Scapular Control",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Dead hang — 2×30 sec",
      "Scapular pull-ups — 2×8",
      "Rear delt circles / band face pulls — 2×15",
      "Cat-cow — 10 reps",
      "Ramp-up set of 2–3 pull-ups at submaximal effort before working sets",
    ],
    cooldown: [
      "Lat stretch (overhead reach on bar) — 2×45 sec",
      "Doorway bicep stretch — 30 sec per side",
      "Thread the needle — 45 sec per side",
      "Thoracic extension over foam roller or bench edge — 60 sec",
      "Supine hamstring stretch — 2 min per leg (toe-touch maintenance)",
    ],
    exercises: [
      {
        name: "Pull-Up / Chin-Up",
        tag: "Vertical Pull · Lat · Biceps",
        sets: "4 sets",
        reps: "5–10 reps",
        rest: "90 sec",
        how: "Start from a full dead hang — arms completely straight, shoulders slightly elevated. Initiate the pull by depressing your shoulder blades (pull them down and back) before bending your arms. Pull until your chin clears the bar. Lower slowly and return to a full dead hang each rep — no half reps. Alternate grip each set: overhand (pronated) one set, underhand (supinated) the next. Underhand chin-ups involve more bicep; overhand pull-ups are more lat-dominant. No kipping or swinging. Do a 1-rep ramp-up set at submaximal effort before the first working set.",
        progress: "Add a weight belt. Work toward L-sit pull-ups.",
        regression: "If you can't do 4 strict reps, do negatives only: jump to the top, lower yourself over 4–5 seconds, repeat.",
      },
      {
        name: "Chest-to-Bar Pull-Up",
        tag: "High Vertical Pull · Muscle-Up Range",
        sets: "3 sets",
        reps: "5–8 reps",
        rest: "90 sec",
        how: "Same setup as a standard pull-up — full dead hang start, no kipping. The critical difference: you must pull until your CHEST touches the bar, not just your chin clearing it. To do this you'll need to lean back slightly as you pull and drive your elbows down and back rather than just up. This recruits significantly more lat and forces the higher pull range that a muscle-up demands. Reps will be lower than your standard pull-up max — that's expected, the range is much harder. If you can't get chest to bar yet, aim progressively higher each session: clavicle level, then upper chest, then sternum. Treat this as your muscle-up range builder.",
        progress: "Once 3×8 chest-to-bar is comfortable, transition to sternum-to-bar (pull even higher), which is essentially the bottom of a muscle-up transition.",
        regression: "Aim for upper chest contact rather than mid-chest. If even that's not yet possible, do explosive pull-ups instead and focus on getting the bar progressively lower on your body.",
      },
      {
        name: "Ring Row",
        tag: "Horizontal Pull · Scapular Retraction · Upper Back",
        sets: "4 sets",
        reps: "8–12 reps",
        rest: "90 sec",
        how: "Set rings at waist height. Walk feet forward and hang below the rings with arms extended — your body should be at an angle, heels on the floor. The more horizontal your body, the harder. Pull the rings to your chest, leading with your elbows. At the top, squeeze your shoulder blades hard together and hold for 1 second. Lower with control. Keep your body completely rigid throughout — no hip sagging.",
        progress: "Elevate feet on a box, or lower the rings to increase the body angle.",
        regression: "Walk feet back to make the angle steeper (more upright = easier).",
      },
      {
        name: "Ring Face Pull",
        tag: "Rear Delts · External Rotation · Shoulder Health",
        sets: "3 sets",
        reps: "12–15 reps",
        rest: "60 sec",
        how: "Set rings at head height. Stand facing the anchor point and lean back slightly, arms extended. Pull the rings toward your face with elbows high and wide — your hands should come to either side of your face. As you pull, rotate your hands so your palms face you at the top (external rotation). This is one of the most important exercises for long-term shoulder health — it directly counters the internal rotation caused by all the pushing and ring work. Never rush these.",
        progress: "Increase lean angle (more bodyweight through the rings).",
        regression: "Reduce lean angle.",
      },
      {
        name: "Ring Support Hold (RTO)",
        tag: "Scapular Depression · Ring Stability Foundation",
        sets: "3 sets",
        reps: "20–30 sec hold",
        rest: "60 sec",
        how: "Jump to the top of a dip position on the rings — arms locked out, body upright. Actively rotate the rings outward (Rings Turned Out — your palms rotate to face forward or slightly outward). Depress your shoulder blades (push them down, away from your ears). Hold this position. This sounds simple but the constant rotational instability of the rings makes it genuinely difficult. This is the foundation of every ring skill — muscle-up, iron cross, planche all require this shoulder stability.",
        progress: "Increase hold duration. Add small hip shifts to challenge balance.",
        regression: "Hold at the top of ring rows instead if full support hold isn't accessible.",
      },
    ],
  },
  {
    id: "sat",
    label: "SAT",
    title: "Flexibility",
    subtitle: "Full Mobility & Hip Routine",
    emoji: "🧘",
    color: "#9b6fe8",
    duration: "~35 min",
    rest: "15–30 sec between movements",
    muscles: "Hamstrings · Hip Flexors · Posterior Chain · Spinal Mobility",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Cat-cow — 10 reps",
      "Light walking on the spot — 60 sec",
    ],
    cooldown: [
      "Lying spinal twist — 30 sec per side",
      "Child's pose — 60 sec",
    ],
    exercises: [
      {
        name: "Standing Hamstring Swing",
        tag: "Neural Warm-Up · Dynamic",
        sets: "2 sets per leg",
        reps: "10 swings per leg",
        rest: "None",
        how: "Stand on one leg (hold a wall for balance if needed). Swing the other leg forward and back in a relaxed, pendulum-like arc. Let the leg be heavy — don't muscle it. Gradually increase the arc each swing until you reach comfortable maximum range. This wakes up the hamstrings and primes the nervous system to allow length before you demand it statically. Always do this before the static holds.",
        progress: "Increase swing height.",
        regression: "Reduce swing amplitude.",
      },
      {
        name: "90/90 Hip Switch",
        tag: "Hip Internal & External Rotation · Hip Flexion Mobility",
        sets: "2 sets per side",
        reps: "8 switches per side",
        rest: "30 sec",
        how: "Sit on the floor with one leg bent 90° in front of you (shin parallel to your body, knee out to one side, ankle in front of your hips) and the other leg bent 90° to the opposite side (thigh out to the side, shin pointing back, knee bent at 90°). Both knees should be at right angles. Keep your chest tall and back straight. To 'switch', simultaneously rotate both legs to the opposite side — sweeping them across the floor — landing in the mirror position. Pause for 1 second in each position before switching. The pause is where the work happens. This addresses two issues: hip internal/external rotation range (often locked from sitting) and the hip flexion range needed for sitting upright with legs straight. Keep your sit bones glued to the floor — if your hips lift, reduce range or place hands behind you for support.",
        progress: "Lean forward over the front leg in each position to deepen the stretch. Eventually progress to lifting the rear knee off the floor.",
        regression: "Place hands behind you for support. Reduce the rotation range.",
      },
      {
        name: "Supine Single-Leg Hamstring Stretch",
        tag: "Isolated Hamstring · Safe & Effective",
        sets: "3 sets per leg",
        reps: "45 sec hold",
        rest: "15 sec between legs",
        how: "Lie on your back. Loop a towel behind one thigh and keep the other leg flat on the floor. Gently straighten the raised leg toward vertical using the strap. Breathe deeply and on each exhale, consciously try to relax the hamstring rather than forcing it further. This is the safest starting position for hamstring stretching — lying down reduces the nervous system's threat response, allowing genuine relaxation into the stretch. Don't pull aggressively.",
        progress: "Bring the leg more vertical as flexibility improves.",
        regression: "Generous knee bend.",
      },
      {
        name: "Seated Forward Fold",
        tag: "Central to Your Toe-Touch Goal",
        sets: "3 sets",
        reps: "60 sec hold",
        rest: "15 sec",
        how: "Sit with legs straight. Use a blanket under hips if your back rounds severely and you can't sit upright. Hinge forward from the hips — push your sternum toward your feet — with a flat back as far as possible, then allow the back to round and hang further. Reach as far as you can. Every exhale, try to travel 1cm further. This is your primary toe-touch development exercise. Weekly targets: shins (now) → ankles (weeks 3–4) → heels (weeks 5–6) → toes (weeks 8–12).",
        progress: "Remove blanket. Use a strap around feet to pull gently.",
        regression: "Generous blanket height under hips. Bent knees initially.",
      },
      {
        name: "Couch Stretch",
        tag: "Hip Flexor · Reverses Sitting Posture",
        sets: "2 sets per side",
        reps: "60 sec hold",
        rest: "15 sec between sides",
        how: "Kneel in front of a couch, bench, or chair. Place one foot up behind you against the vertical surface — your shin should run vertically up the front of the couch with your toes pointed up and the top of your foot resting against it. Your other foot is planted in front in a lunge position. Now the critical part: actively tuck your pelvis under (posterior tilt — like trying to bring your belt buckle toward your sternum) and squeeze the glute on the kneeling-leg side hard. You should feel a deep stretch through the front of the hip and the top of the thigh on the kneeling leg. Keep your torso upright. If this is too intense, start with the back foot on the floor instead of elevated. This directly lengthens the hip flexors that are pulling your pelvis into the tucked position when you sit on the floor — which is the root cause of why you can't sit upright with legs straight.",
        progress: "Raise your torso more upright. Add a slight backbend at the top once comfortable.",
        regression: "Keep back foot on the floor instead of elevated. Use a cushion under the kneeling knee.",
      },
      {
        name: "Downward Dog with Pedalling",
        tag: "Calves + Hamstring Chain",
        sets: "2 sets",
        reps: "30 sec hold + 10 heel presses per side",
        rest: "15 sec",
        how: "From a push-up position, drive hips up and back into downward dog. Hold for 30 seconds, then alternate pressing each heel toward the floor slowly and with control. Tight calves are a frequently overlooked limiting factor in toe-touch — they're part of the same posterior chain. Keeping the spine long (not rounded), work on getting your heels closer to the floor each week.",
        progress: "Work toward heels fully contacting the floor.",
        regression: "Generous knee bend throughout.",
      },
      {
        name: "Standing Forward Fold Hang",
        tag: "Full Posterior Chain · Weekly Progress Marker",
        sets: "2 sets",
        reps: "60–90 sec hold",
        rest: "20 sec",
        how: "Feet hip-width, soft knees. Fold forward and hang completely — dead weight, no tension. Nod your head yes and no to release neck tension. After 30 seconds, gently try to straighten your knees a little further without bouncing. Let gravity do the work. On Sundays, measure exactly where your fingertips reach — floor to fingertip distance in centimetres. Track this weekly. Seeing 1–2cm of progress keeps motivation high.",
        progress: "Straighten knees more each week. Weight your heels to deepen the stretch.",
        regression: "Generous knee bend. Hang completely passively.",
      },
      {
        name: "Active Straight-Leg Raise",
        tag: "Hip Flexor Strength · Active Hip Flexion Range",
        sets: "2 sets per leg",
        reps: "8 reps per leg",
        rest: "30 sec",
        how: "Lie flat on your back with both legs extended. Without using your hands, momentum, or a strap, raise one straight leg as high as you can under your own muscle power. Keep the other leg pressed flat into the floor and the knee of the raising leg completely locked. Hold the top position for 1 second, then lower with control over 3 seconds. This is the missing piece of your toe-touch puzzle — passive flexibility (like the supine hamstring stretch) gives you the range, but if your hip flexors aren't strong enough to actively pull you into that range, you'll always default to rounding the back instead. Every rep trains your hip flexors to produce the exact pattern you need for a clean seated forward fold.",
        progress: "Aim for higher range each week. Add a 2-second pause at the top.",
        regression: "Allow a slight knee bend if needed to maintain a straight back.",
      },
      {
        name: "Wall Hamstring Stretch",
        tag: "Deep Passive Hold · Gravity-Assisted",
        sets: "1 set per leg",
        reps: "2 min hold",
        rest: "20 sec between legs",
        how: "Lie on your back near a doorframe or wall. Swing one leg up the wall, keeping the other leg flat on the floor. Scoot your hips closer to the wall to increase the stretch intensity. Completely relax and let gravity pull your leg toward the wall. This is a fully passive stretch — you do nothing except breathe. The long hold time (2 minutes) allows the nervous system to gradually accept the new range rather than guarding against it. Do this as the final movement before rest days for maximum benefit.",
        progress: "Scoot hips progressively closer to the wall.",
        regression: "Move further from the wall to reduce intensity.",
      },
    ],
  },
  {
    id: "sun",
    label: "SUN",
    title: "Rest + Test",
    subtitle: "Weekly Toe-Touch Check",
    emoji: "📏",
    color: "#888",
    duration: "5 min",
    rest: "",
    muscles: "",
    isRest: true,
    restNote: "Full rest day. The only task is your weekly toe-touch test: stand with feet hip-width, fold forward with soft knees, and measure the distance from your fingertips to the floor. Record the result. You started at approximately 15–20cm. Track your progress week by week — aim to see 1–2cm improvement every 1–2 weeks.",
    testDay: true,
  },
];

const deloadDays = [
  {
    id: "mon",
    label: "MON",
    title: "Push (Deload)",
    subtitle: "Reduced Volume · Skill Maintenance",
    emoji: "💪",
    color: "#e8643a",
    duration: "~30 min",
    rest: "60–90 sec between sets",
    muscles: "Chest · Shoulders · Triceps",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Arm circles — 10 forward, 10 backward",
      "Banded shoulder external rotations — 2×12 per side",
      "Scapular push-ups — 2×10",
      "Band / arm pull-aparts — 2×15",
    ],
    cooldown: [
      "Doorframe chest stretch — 60 sec",
      "Child's pose shoulder reach — 60 sec",
    ],
    exercises: [
      {
        name: "Ring Push-Up",
        tag: "Chest + Ring Stability",
        sets: "2 sets",
        reps: "6–8 reps",
        rest: "90 sec",
        how: "Same technique as normal week — rings low, RTO at the top, elbows at 45°. Stop 2–3 reps short of failure on every set. The aim is to maintain the movement pattern and stay loose, not stimulate growth. If anything feels heavy, reduce reps further.",
        progress: "Stay light this week. Resume normal progression next week.",
        regression: "Drop to floor push-ups if rings feel demanding.",
      },
      {
        name: "Pike Push-Up",
        tag: "Shoulders · Skill Maintenance",
        sets: "2 sets",
        reps: "5–6 reps",
        rest: "60 sec",
        how: "Feet on floor, hips high. Keep this submaximal — focus on smooth movement, not pushing for reps. Avoid elevated pike push-ups this week.",
        progress: "—",
        regression: "Reduce hip elevation.",
      },
      {
        name: "Ring Dips (Light)",
        tag: "Triceps · Lower Chest",
        sets: "2 sets",
        reps: "4–6 reps",
        rest: "60 sec",
        how: "Half range of motion or feet-assisted only. The aim is to grease the groove, not tax the joints. Skip this entirely if your shoulders feel stiff.",
        progress: "—",
        regression: "Use feet-assisted variation throughout.",
      },
      {
        name: "Wall Slides",
        tag: "Serratus Anterior · Upward Rotation",
        sets: "3 sets",
        reps: "10–12 reps",
        rest: "45 sec",
        how: "Stand facing a wall (or with your back to it — facing is harder and better). Place your forearms vertically against the wall in a 'stick 'em up' position — elbows bent at 90°, hands above elbows. Actively press your forearms into the wall and KEEP pressing throughout the entire movement. Slowly slide your arms up the wall while maintaining forearm contact, until your arms are fully overhead. Then slowly slide back down to the start. The trick is the constant outward pressure — passive arm movement doesn't train the serratus. This is a low-fatigue, high-value movement that's actually better suited to deload weeks because the controlled, non-fatigued state lets you focus on the muscle activation. It complements the Plus Push-Ups from your standard week by training the serratus through upward rotation rather than protraction — and during deload, this is your serratus maintenance work.",
        progress: "Hold a small resistance band stretched between your hands while sliding to add load.",
        regression: "Slide your forearms only partway up the wall if full overhead is too restrictive.",
      },
    ],
  },
  {
    id: "tue",
    label: "TUE",
    title: "Pull (Deload)",
    subtitle: "Reduced Volume · Skill Maintenance",
    emoji: "🏋️",
    color: "#4a9edd",
    duration: "~30 min",
    rest: "90 sec between sets",
    muscles: "Back · Biceps · Rear Delts",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Dead hang — 2×20 sec",
      "Scapular pull-ups — 2×8",
      "Band pull-aparts — 2×15",
      "Cat-cow — 10 reps",
    ],
    cooldown: [
      "Lat stretch (overhead reach on bar) — 2×45 sec",
      "Thread the needle — 45 sec per side",
    ],
    exercises: [
      {
        name: "Pull-Up / Chin-Up (Light)",
        tag: "Vertical Pull · Skill Maintenance",
        sets: "2 sets",
        reps: "3–5 reps",
        rest: "90 sec",
        how: "Stop well short of failure. Crisp, clean reps with a slow eccentric. If you'd normally do 8 reps, do 4. The aim is to maintain neural pattern without accumulating fatigue.",
        progress: "—",
        regression: "Negatives only — jump to top, lower over 4 sec.",
      },
      {
        name: "Ring Row (Light)",
        tag: "Horizontal Pull · Upper Back",
        sets: "2 sets",
        reps: "8 reps",
        rest: "60 sec",
        how: "Steeper body angle than usual to make this easier. Focus on perfect scapular retraction with a 2-second hold at the top of each rep. Quality over difficulty.",
        progress: "—",
        regression: "Keep body more upright.",
      },
      {
        name: "Ring Face Pull",
        tag: "Rear Delts · Shoulder Health",
        sets: "2 sets",
        reps: "12 reps",
        rest: "45 sec",
        how: "Same as normal week — this is a low-fatigue movement so you can do it at full intensity. Rear delts and shoulder health benefit from being maintained even during deload.",
        progress: "—",
        regression: "Reduce lean angle.",
      },
    ],
  },
  {
    id: "wed",
    label: "WED",
    title: "Legs + Flexibility (Deload)",
    subtitle: "Reduced Volume · Mobility Focus",
    emoji: "🦵",
    color: "#5bbf7a",
    duration: "~40 min",
    rest: "60–90 sec between sets",
    muscles: "Quads · Glutes · Hamstrings · Mobility",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Leg swings forward/back — 10 per leg",
      "Slow bodyweight squat — 2×10",
      "Hip circles — 10 per side",
    ],
    cooldown: [
      "See Flexibility section below",
    ],
    sections: [
      {
        title: "Legs (Light)",
        duration: "~20 min",
        note: "Half volume of a normal week. Skip Bulgarian split squat, wall sit, and pistol progression entirely — those are the most fatigue-generating leg movements.",
        exercises: [
          {
            name: "Bodyweight Squat",
            tag: "Quads · Glutes",
            sets: "2 sets",
            reps: "10 reps",
            rest: "60 sec",
            how: "Slow tempo (3 sec down, 1 sec pause, 1 sec up). Stop several reps short of failure. The aim is to keep the movement pattern fresh.",
            progress: "—",
            regression: "Reduce depth.",
          },
          {
            name: "Glute Bridge",
            tag: "Glutes · Posterior Chain",
            sets: "2 sets",
            reps: "12 reps",
            rest: "45 sec",
            how: "Standard floor bridge. Squeeze glutes hard at the top for 2 seconds. Skip the hip thrust progression this week.",
            progress: "—",
            regression: "Reduce range of motion.",
          },
          {
            name: "Calf Raise (on step)",
            tag: "Calves",
            sets: "2 sets",
            reps: "15 reps",
            rest: "45 sec",
            how: "Slow and controlled. Skip single-leg variation this week.",
            progress: "—",
            regression: "Flat ground (no step).",
          },
        ],
      },
      {
        title: "Flexibility (Full)",
        duration: "~20 min",
        note: "Flexibility work continues at full intensity during deload — it's low fatigue and the relative recovery from heavier training often produces flexibility breakthroughs in deload weeks.",
        exercises: [
          {
            name: "Supine Single-Leg Hamstring Stretch",
            tag: "Hamstrings · Low Threat Stretch",
            sets: "3 sets per leg",
            reps: "45 sec hold",
            rest: "15 sec between legs",
            how: "Lie on your back, loop a strap behind one thigh, gently straighten the leg toward vertical. Breathe and relax into the stretch. Same as normal week.",
            progress: "Bring the leg slightly more vertical each week.",
            regression: "Generous knee bend.",
          },
          {
            name: "Seated Forward Fold",
            tag: "Toe-Touch Development",
            sets: "3 sets",
            reps: "60 sec hold",
            rest: "15 sec",
            how: "Sit with legs straight (use a blanket under hips if needed). Hinge from the hips, then allow the back to round. Reach as far as comfortable. This is the highest-priority movement during deload — relative recovery often unlocks new range.",
            progress: "Remove blanket as hip mobility improves.",
            regression: "Use more blanket height.",
          },
          {
            name: "Standing Forward Fold Hang",
            tag: "Full Posterior Chain",
            sets: "2 sets",
            reps: "60–90 sec hold",
            rest: "20 sec",
            how: "Feet hip-width, soft knees, fold and hang completely. Let gravity do the work.",
            progress: "Straighten knees gradually.",
            regression: "Generous knee bend.",
          },
          {
            name: "Wall Hamstring Stretch",
            tag: "Deep Passive Hold",
            sets: "1 set per leg",
            reps: "2 min hold",
            rest: "20 sec",
            how: "Lie near a wall, one leg up the wall, scoot hips closer to increase intensity. Fully passive, just breathe. The 2-minute hold trains nervous system acceptance of the new range.",
            progress: "Scoot hips closer to the wall.",
            regression: "Move further from the wall.",
          },
        ],
      },
    ],
  },
  {
    id: "thu",
    label: "THU",
    title: "Push + Core (Deload)",
    subtitle: "Reduced Volume · Skill Maintenance",
    emoji: "🔁",
    color: "#d4a843",
    duration: "~30 min",
    rest: "60 sec between sets",
    muscles: "Chest · Triceps · Core",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Arm circles — 10 forward, 10 backward",
      "Banded shoulder external rotations — 2×12 per side",
      "Scapular push-ups — 2×10",
      "Band pull-aparts — 2×15",
    ],
    cooldown: [
      "Child's pose — 60 sec",
      "Lying spinal twist — 30 sec per side",
    ],
    sections: [
      {
        title: "Push (Light)",
        duration: "~12 min",
        exercises: [
          {
            name: "Push-Up (Standard)",
            tag: "Chest · Triceps",
            sets: "2 sets",
            reps: "8–10 reps",
            rest: "60 sec",
            how: "Standard push-up only this week — skip the rotating variations and decline. Focus on perfect technique and a 2-second eccentric. Stop 3 reps short of failure.",
            progress: "—",
            regression: "Incline push-up (hands elevated).",
          },
          {
            name: "Diamond Push-Up",
            tag: "Triceps",
            sets: "2 sets",
            reps: "6–8 reps",
            rest: "60 sec",
            how: "Slow tempo, well short of failure. Skip if wrists feel stiff.",
            progress: "—",
            regression: "Wider hand position.",
          },
        ],
      },
      {
        title: "Core (Light)",
        duration: "~15 min",
        note: "Skip dragon flags entirely this week — they require near-maximal effort. Focus on the movements that maintain the pattern without taxing the system.",
        exercises: [
          {
            name: "L-Sit (Tuck Only)",
            tag: "Hip Flexors · Ab Compression",
            sets: "2 sets",
            reps: "10–15 sec hold",
            rest: "60 sec",
            how: "Stay at the tuck variation regardless of your normal level. Just maintain the position briefly to keep the pattern alive.",
            progress: "—",
            regression: "Use higher parallettes.",
          },
          {
            name: "Hanging Knee Raises",
            tag: "Hip Flexors · Lower Abs",
            sets: "2 sets",
            reps: "8 reps",
            rest: "60 sec",
            how: "Bent knees only, slow and controlled. Skip the straight-leg and toes-to-bar variations even if you normally do them.",
            progress: "—",
            regression: "Reduce range.",
          },
          {
            name: "Dead Bug",
            tag: "Core Stability · Lower Back Reset",
            sets: "2 sets",
            reps: "6 per side",
            rest: "30 sec",
            how: "Slow and deliberate. Lower back stays glued to floor. This movement is excellent during deload because it's low fatigue but actively helps the lumbar spine recover from accumulated training stress.",
            progress: "Slow tempo to 5 sec per extension.",
            regression: "Just lower the arm (no leg).",
          },
        ],
      },
    ],
  },
  {
    id: "fri",
    label: "FRI",
    title: "Pull + Core + Flex (Deload)",
    subtitle: "Reduced Volume · Mobility Focus",
    emoji: "🧘",
    color: "#9b6fe8",
    duration: "~40 min",
    rest: "60 sec between sets",
    muscles: "Back · Biceps · Core · Hamstrings",
    warmup: [
      "Seated pelvic tilts — 1×15 (mobility primer)",
      "90/90 hip switch — 2 per side (hip mobility)",
      "Dead hang — 2×20 sec",
      "Scapular pull-ups — 2×8",
      "Band pull-aparts — 2×15",
      "Standing hamstring swings — 10 per leg",
    ],
    cooldown: [
      "See Flexibility section below",
    ],
    sections: [
      {
        title: "Pull (Light)",
        duration: "~10 min",
        exercises: [
          {
            name: "Australian Pull-Up",
            tag: "Horizontal Pull",
            sets: "2 sets",
            reps: "8 reps",
            rest: "60 sec",
            how: "Use a higher bar (more upright body angle) than normal to reduce intensity. Slow eccentric, full lockout. Skip ring curls and pull-aparts this week.",
            progress: "—",
            regression: "More upright angle.",
          },
          {
            name: "Scapular Pull-Up",
            tag: "Shoulder Health · Scapular Control",
            sets: "2 sets",
            reps: "8 reps",
            rest: "45 sec",
            how: "Same as normal week. Low fatigue, high value. Worth maintaining throughout deload.",
            progress: "—",
            regression: "Smaller range.",
          },
        ],
      },
      {
        title: "Core (Light)",
        duration: "~10 min",
        note: "Skip the dragon flag and ab roller entirely this week. Focus on hollow body and planks at reduced volume.",
        exercises: [
          {
            name: "Hollow Body Hold",
            tag: "Full-Body Tension",
            sets: "2 sets",
            reps: "15–20 sec hold",
            rest: "45 sec",
            how: "Stay one level easier than your usual progression. Tuck if you'd normally do half-hollow. Half-hollow if you'd normally do full.",
            progress: "—",
            regression: "Higher legs or knees bent.",
          },
          {
            name: "Standard Plank",
            tag: "Isometric · Recovery-Friendly",
            sets: "2 sets",
            reps: "30–40 sec hold",
            rest: "30 sec",
            how: "Just the standard forearm plank — skip RKC tension and side planks this week.",
            progress: "—",
            regression: "Knees down.",
          },
        ],
      },
      {
        title: "Flexibility (Full)",
        duration: "~20 min",
        note: "Flexibility work continues at full intensity. Many trainees see their biggest toe-touch breakthroughs during deload weeks because muscle tissue has time to genuinely recover and remodel.",
        exercises: [
          {
            name: "Standing Hamstring Swing",
            tag: "Neural Warm-Up",
            sets: "2 sets per leg",
            reps: "10 swings per leg",
            rest: "None",
            how: "Stand on one leg, swing the other in a relaxed pendulum. Increase arc gradually.",
            progress: "Increase swing height.",
            regression: "Smaller arc.",
          },
          {
            name: "Supine Single-Leg Hamstring Stretch",
            tag: "Isolated Hamstring",
            sets: "3 sets per leg",
            reps: "45 sec hold",
            rest: "15 sec",
            how: "Lying down, strap behind thigh, gently straighten leg toward vertical. Breathe deeply.",
            progress: "More vertical each week.",
            regression: "Generous knee bend.",
          },
          {
            name: "Seated Forward Fold",
            tag: "Central Toe-Touch Movement",
            sets: "3 sets",
            reps: "60 sec hold",
            rest: "15 sec",
            how: "Hinge from hips with flat back, then round and reach. Highest priority movement of the week.",
            progress: "Remove blanket support.",
            regression: "Higher blanket.",
          },
          {
            name: "Downward Dog with Pedalling",
            tag: "Calves + Hamstrings",
            sets: "2 sets",
            reps: "30 sec + 10 heel presses per side",
            rest: "15 sec",
            how: "Hold the down dog, then alternate slow heel presses to floor.",
            progress: "Heels closer to floor.",
            regression: "Bend knees.",
          },
          {
            name: "Standing Forward Fold Hang",
            tag: "Progress Marker",
            sets: "2 sets",
            reps: "60–90 sec hold",
            rest: "20 sec",
            how: "Feet hip-width, soft knees, hang completely. Let gravity work.",
            progress: "Straighten knees gradually.",
            regression: "Bend knees more.",
          },
          {
            name: "Wall Hamstring Stretch",
            tag: "Deep Passive Hold",
            sets: "1 set per leg",
            reps: "2 min hold",
            rest: "20 sec",
            how: "One leg up the wall, scoot closer for intensity. Fully passive, just breathe.",
            progress: "Scoot closer to the wall.",
            regression: "Move further away.",
          },
        ],
      },
    ],
  },
  {
    id: "sat",
    label: "SAT",
    title: "Rest",
    subtitle: "Full Recovery",
    emoji: "😴",
    color: "#888",
    duration: "Off",
    rest: "",
    muscles: "",
    isRest: true,
    restNote: "Complete rest. During deload weeks especially, prioritise sleep and good nutrition. The whole point of this week is to allow your CNS, joints, and connective tissue to recover from accumulated training fatigue.",
  },
  {
    id: "sun",
    label: "SUN",
    title: "Rest + Test",
    subtitle: "Weekly Toe-Touch Check",
    emoji: "📏",
    color: "#888",
    duration: "5 min",
    rest: "",
    muscles: "",
    isRest: true,
    restNote: "Full rest day. Toe-touch test as normal — and pay attention this week. Many people see noticeable jumps in flexibility during deload weeks because the body finally has the resources to remodel tissue. Don't be surprised if you progress more than usual this Sunday.",
    testDay: true,
  },
];

function ProgressionPill({ text, color }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.05em",
      background: color + "22",
      color: color,
      border: `1px solid ${color}44`,
      marginRight: "6px",
      marginTop: "4px",
    }}>{text}</span>
  );
}

// Parse "3 sets", "4 sets per side", "2 sets per leg", "2 sets per variation", "1 set per leg" etc.
// Returns { count, isPerSide, sideLabel }
function parseSets(setsStr) {
  if (!setsStr) return { count: 1, isPerSide: false, sideLabel: "" };
  const m = setsStr.match(/(\d+)/);
  const count = m ? parseInt(m[1], 10) : 1;
  const lower = setsStr.toLowerCase();
  if (lower.includes("per side")) return { count, isPerSide: true, sideLabel: "side" };
  if (lower.includes("per leg")) return { count, isPerSide: true, sideLabel: "leg" };
  if (lower.includes("per variation")) return { count, isPerSide: true, sideLabel: "variation" };
  return { count, isPerSide: false, sideLabel: "" };
}

function SetTracker({ exerciseKey, setsStr, color, setProgress, toggleSet }) {
  const { count, isPerSide } = parseSets(setsStr);
  const totalSlots = isPerSide ? count * 2 : count;
  const completed = setProgress[exerciseKey] || [];

  const renderSlot = (idx, label) => {
    const isDone = completed.includes(idx);
    return (
      <button
        key={idx}
        onClick={() => toggleSet(exerciseKey, idx)}
        style={{
          width: "44px", height: "44px",
          borderRadius: "10px",
          border: `2px solid ${isDone ? color : "#2a2a2a"}`,
          background: isDone ? color + "33" : "#0a0a0a",
          color: isDone ? color : "#555",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "800",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {isDone ? "✓" : label}
      </button>
    );
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{
        color: "#555", fontSize: "11px", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: "8px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>Track sets</span>
        <span style={{ color: completed.length === totalSlots ? color : "#555", fontWeight: "800" }}>
          {completed.length} / {totalSlots}
        </span>
      </div>
      {isPerSide ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ color: "#777", fontSize: "11px", fontWeight: "700", width: "32px", flexShrink: 0 }}>L</div>
            {Array.from({ length: count }, (_, i) => renderSlot(i, i + 1))}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ color: "#777", fontSize: "11px", fontWeight: "700", width: "32px", flexShrink: 0 }}>R</div>
            {Array.from({ length: count }, (_, i) => renderSlot(count + i, i + 1))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Array.from({ length: count }, (_, i) => renderSlot(i, i + 1))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ ex, color, dayId, weekType, exerciseIndex, setProgress, toggleSet, exerciseNotes, updateNote }) {
  const [open, setOpen] = useState(false);
  const exerciseKey = `sets:${weekType}:${dayId}:${exerciseIndex}`;
  const notesKey = `notes:${weekType}:${dayId}:${exerciseIndex}`;
  const noteValue = exerciseNotes?.[notesKey] || "";
  const hasNote = noteValue.trim().length > 0;
  const { count, isPerSide } = parseSets(ex.sets);
  const totalSlots = isPerSide ? count * 2 : count;
  const completed = setProgress[exerciseKey] || [];
  const completedCount = completed.length;
  const isComplete = completedCount === totalSlots && totalSlots > 0;
  const hasProgress = completedCount > 0;

  return (
    <div style={{
      background: "#111",
      border: `1px solid #222`,
      borderRadius: "12px",
      marginBottom: "10px",
      overflow: "hidden",
      transition: "border-color 0.2s",
      borderColor: open ? color + "55" : isComplete ? color + "44" : "#222",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textAlign: "left",
        }}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "8px",
          background: isComplete ? color + "44" : color + "22",
          display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0,
          transition: "background 0.2s",
        }}>
          {isComplete ? (
            <div style={{ color: color, fontSize: "18px", fontWeight: "900" }}>✓</div>
          ) : hasProgress ? (
            <div style={{ color: color, fontSize: "10px", fontWeight: "800" }}>{completedCount}/{totalSlots}</div>
          ) : (
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: isComplete ? "#888" : "#f0f0f0",
            fontWeight: "700", fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: isComplete ? "line-through" : "none",
            transition: "color 0.2s",
          }}>{ex.name}</div>
          <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>{ex.tag}</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: color, fontSize: "12px", fontWeight: "700" }}>{ex.sets}</div>
            <div style={{ color: "#888", fontSize: "11px" }}>{ex.reps}</div>
          </div>
          <div style={{
            color: "#555", fontSize: "18px",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s",
          }}>▾</div>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ paddingTop: "14px" }}>
            <SetTracker
              exerciseKey={exerciseKey}
              setsStr={ex.sets}
              color={color}
              setProgress={setProgress}
              toggleSet={toggleSet}
            />
            <div style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.7", marginBottom: "12px" }}>
              {ex.how}
            </div>
            {ex.rest && (
              <div style={{ marginBottom: "8px" }}>
                <ProgressionPill text={`Rest: ${ex.rest}`} color="#888" />
              </div>
            )}
            {ex.progress && (
              <div style={{ marginBottom: "6px" }}>
                <div style={{ color: "#555", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Progression</div>
                <div style={{ color: "#888", fontSize: "12px" }}>{ex.progress}</div>
              </div>
            )}
            {ex.regression && (
              <div>
                <div style={{ color: "#555", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Regression</div>
                <div style={{ color: "#888", fontSize: "12px" }}>{ex.regression}</div>
              </div>
            )}
            {/* Progression notes */}
            <div style={{
              marginTop: "14px",
              paddingTop: "14px",
              borderTop: "1px solid #1a1a1a",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "6px",
              }}>
                <div style={{
                  color: "#555", fontSize: "11px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>Notes (loads, reps, observations)</div>
                {hasNote && (
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: color,
                  }} />
                )}
              </div>
              <textarea
                value={noteValue}
                onChange={e => updateNote && updateNote(notesKey, e.target.value)}
                placeholder="e.g. 4×10 with 5kg vest, felt strong on set 3"
                rows={2}
                style={{
                  width: "100%",
                  background: "#0a0a0a",
                  border: "1px solid #1e1e1e",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: "#ccc",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  minHeight: "44px",
                  outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = color + "55"}
                onBlur={e => e.target.style.borderColor = "#1e1e1e"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ sec, color, dayId, weekType, sectionIndex, setProgress, toggleSet, exerciseNotes, updateNote }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "14px",
      }}>
        <div style={{ height: "1px", flex: 1, background: "#222" }} />
        <div style={{
          color: color, fontSize: "11px", fontWeight: "800",
          textTransform: "uppercase", letterSpacing: "0.12em",
          whiteSpace: "nowrap",
        }}>
          {sec.title} {sec.duration && <span style={{ color: "#555", fontWeight: "500" }}>· {sec.duration}</span>}
        </div>
        <div style={{ height: "1px", flex: 1, background: "#222" }} />
      </div>
      {sec.note && (
        <div style={{
          background: color + "11", border: `1px solid ${color}22`,
          borderRadius: "8px", padding: "10px 14px",
          color: "#888", fontSize: "12px", lineHeight: "1.6",
          marginBottom: "14px",
        }}>💡 {sec.note}</div>
      )}
      {sec.exercises.map((ex, i) => (
        <ExerciseCard
          key={i}
          ex={ex}
          color={color}
          dayId={dayId}
          weekType={weekType}
          exerciseIndex={`s${sectionIndex}-${i}`}
          setProgress={setProgress}
          toggleSet={toggleSet}
          exerciseNotes={exerciseNotes}
          updateNote={updateNote}
        />
      ))}
    </div>
  );
}

function SessionProgress({ day, weekType, color, setProgress, resetDay }) {
  const [confirming, setConfirming] = useState(false);

  // Build all storage keys for this day's exercises
  const keys = [];
  if (day.sections) {
    day.sections.forEach((sec, sIdx) => {
      sec.exercises.forEach((ex, eIdx) => {
        const { count, isPerSide } = parseSets(ex.sets);
        const total = isPerSide ? count * 2 : count;
        keys.push({ key: `sets:${weekType}:${day.id}:s${sIdx}-${eIdx}`, total });
      });
    });
  } else if (day.exercises) {
    day.exercises.forEach((ex, eIdx) => {
      const { count, isPerSide } = parseSets(ex.sets);
      const total = isPerSide ? count * 2 : count;
      keys.push({ key: `sets:${weekType}:${day.id}:${eIdx}`, total });
    });
  }

  // Compute totals directly from lifted state — instant, reactive
  let done = 0;
  let total = 0;
  for (const { key, total: t } of keys) {
    total += t;
    const completed = setProgress[key] || [];
    done += completed.length;
  }

  if (total === 0) return null;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const isComplete = done === total && total > 0;

  const handleResetConfirm = () => {
    resetDay(keys.map(k => k.key));
    setConfirming(false);
  };

  return (
    <div style={{
      margin: "20px 28px 20px",
      padding: "14px 16px",
      background: "#0a0a0a",
      border: `1px solid ${isComplete ? color + "55" : "#1e1e1e"}`,
      borderRadius: "10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "8px",
          }}>
            <div style={{
              color: isComplete ? color : "#aaa",
              fontSize: "12px", fontWeight: "800",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {isComplete ? "✓ Session Complete" : "Session Progress"}
            </div>
            <div style={{ color: color, fontSize: "13px", fontWeight: "800" }}>
              {done} / {total}
            </div>
          </div>
          <div style={{
            height: "6px", background: "#161616",
            borderRadius: "3px", overflow: "hidden",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: color,
              transition: "width 0.3s",
            }} />
          </div>
        </div>
        {!confirming && (
          <button
            onClick={() => setConfirming(true)}
            disabled={done === 0}
            style={{
              background: "none",
              border: `1px solid ${done === 0 ? "#1a1a1a" : "#2a2a2a"}`,
              color: done === 0 ? "#333" : "#666",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: done === 0 ? "not-allowed" : "pointer",
              fontSize: "11px", fontWeight: "700",
              letterSpacing: "0.04em",
              flexShrink: 0,
              opacity: done === 0 ? 0.5 : 1,
            }}
          >RESET</button>
        )}
      </div>

      {confirming && (
        <div style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}>
          <div style={{
            color: "#aaa",
            fontSize: "12px",
            flex: 1,
            minWidth: "180px",
          }}>
            Reset all {done} completed set{done === 1 ? "" : "s"} for this session?
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button
              onClick={() => setConfirming(false)}
              style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#888",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "11px", fontWeight: "700",
                letterSpacing: "0.04em",
              }}
            >CANCEL</button>
            <button
              onClick={handleResetConfirm}
              style={{
                background: "#dc2626",
                border: "1px solid #dc2626",
                color: "#fff",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "11px", fontWeight: "800",
                letterSpacing: "0.04em",
              }}
            >RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DayPanel({ day, weekType, setProgress, toggleSet, resetDay, exerciseNotes, updateNote }) {
  if (day.isRest) {
    return (
      <div style={{
        background: "#0e0e0e", borderRadius: "16px",
        border: "1px solid #1e1e1e", padding: "32px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{day.emoji}</div>
        <div style={{ color: "#f0f0f0", fontSize: "22px", fontWeight: "800", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>{day.title}</div>
        <div style={{ color: "#555", fontSize: "13px", marginBottom: "24px" }}>{day.subtitle}</div>
        <div style={{
          background: "#161616", borderRadius: "12px",
          border: "1px solid #222", padding: "20px",
          color: "#888", fontSize: "13px", lineHeight: "1.8",
        }}>{day.restNote}</div>
        {day.testDay && (
          <div style={{ marginTop: "20px" }}>
            <div style={{
              background: "#1a1520", border: "1px solid #9b6fe844",
              borderRadius: "12px", padding: "20px",
              color: "#9b6fe8", fontSize: "13px", lineHeight: "1.8",
            }}>
              📏 <strong>Toe-Touch Test</strong><br />
              Stand, fold forward, measure fingertip-to-floor distance. Record it. You started at ~15–20cm. Aim for 1–2cm improvement every 1–2 weeks.
            </div>
          </div>
        )}
      </div>
    );
  }

  const hasSections = day.sections && day.sections.length > 0;

  return (
    <div style={{ background: "#0e0e0e", borderRadius: "16px", border: "1px solid #1e1e1e", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "24px 28px",
        background: `linear-gradient(135deg, ${day.color}18 0%, transparent 100%)`,
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "22px" }}>{day.emoji}</span>
              <span style={{ color: day.color, fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em" }}>{day.muscles}</span>
            </div>
            <div style={{ color: "#f0f0f0", fontSize: "24px", fontWeight: "900", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>{day.title}</div>
            <div style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>{day.subtitle}</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ background: day.color + "22", border: `1px solid ${day.color}44`, borderRadius: "8px", padding: "8px 14px", textAlign: "center" }}>
              <div style={{ color: day.color, fontSize: "13px", fontWeight: "700" }}>{day.duration}</div>
              <div style={{ color: "#555", fontSize: "10px", marginTop: "2px" }}>Duration</div>
            </div>
            {day.rest && (
              <div style={{ background: "#161616", border: "1px solid #222", borderRadius: "8px", padding: "8px 14px", textAlign: "center" }}>
                <div style={{ color: "#aaa", fontSize: "13px", fontWeight: "700" }}>{day.rest}</div>
                <div style={{ color: "#555", fontSize: "10px", marginTop: "2px" }}>Rest</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "0" }}>
        <SessionProgress
          day={day}
          weekType={weekType}
          color={day.color}
          setProgress={setProgress}
          resetDay={resetDay}
        />
      </div>

      <div style={{ padding: "4px 28px 24px" }}>
        {/* Warm-up */}
        {day.warmup && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ height: "1px", flex: 1, background: "#222" }} />
              <div style={{ color: "#e8a43a", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em" }}>Warm-Up · 5 min</div>
              <div style={{ height: "1px", flex: 1, background: "#222" }} />
            </div>
            <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "14px 18px" }}>
              {day.warmup.map((w, i) => (
                <div key={i} style={{ color: "#888", fontSize: "13px", padding: "5px 0", borderBottom: i < day.warmup.length - 1 ? "1px solid #1a1a1a" : "none", display: "flex", gap: "10px" }}>
                  <span style={{ color: "#444", flexShrink: 0 }}>◇</span>
                  {w}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises or Sections */}
        {hasSections
          ? day.sections.map((sec, i) => (
              <Section
                key={i}
                sec={sec}
                color={day.color}
                dayId={day.id}
                weekType={weekType}
                sectionIndex={i}
                setProgress={setProgress}
                toggleSet={toggleSet}
                exerciseNotes={exerciseNotes}
                updateNote={updateNote}
              />
            ))
          : day.exercises && day.exercises.map((ex, i) => (
              <ExerciseCard
                key={i}
                ex={ex}
                color={day.color}
                dayId={day.id}
                weekType={weekType}
                exerciseIndex={i}
                setProgress={setProgress}
                toggleSet={toggleSet}
                exerciseNotes={exerciseNotes}
                updateNote={updateNote}
              />
            ))
        }

        {/* Cooldown */}
        {day.cooldown && day.cooldown.length > 0 && day.cooldown[0] !== "See Flexibility Finisher below" && day.cooldown[0] !== "See Full Flexibility Routine below" && day.cooldown[0] !== "See Flexibility section below" && (
          <div style={{ marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ height: "1px", flex: 1, background: "#222" }} />
              <div style={{ color: "#5bbf7a", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em" }}>Cool-Down · 5 min</div>
              <div style={{ height: "1px", flex: 1, background: "#222" }} />
            </div>
            <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "14px 18px" }}>
              {day.cooldown.map((w, i) => (
                <div key={i} style={{ color: "#888", fontSize: "13px", padding: "5px 0", borderBottom: i < day.cooldown.length - 1 ? "1px solid #1a1a1a" : "none", display: "flex", gap: "10px" }}>
                  <span style={{ color: "#444", flexShrink: 0 }}>◇</span>
                  {w}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [activeDay, setActiveDay] = useState("mon");
  const [weekType, setWeekType] = useState("standard"); // "standard" or "deload"
  const activeDays = weekType === "deload" ? deloadDays : days;
  const day = activeDays.find(d => d.id === activeDay);

  // Single source of truth for all set tracking.
  // Shape: { "sets:standard:mon:0": [0, 1, 2], ... }
  const [setProgress, setSetProgress] = useState({});
  // Notes per exercise. Shape: { "notes:standard:mon:0": "Felt strong today, hit 4×12" }
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [storageReady, setStorageReady] = useState(false);

  // Load all saved progress on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage && window.storage.list) {
          // Load set tracking
          const result = await window.storage.list("sets:");
          if (!cancelled && result?.keys) {
            const loaded = {};
            for (const key of result.keys) {
              try {
                const r = await window.storage.get(key);
                if (r?.value) {
                  const parsed = JSON.parse(r.value);
                  if (Array.isArray(parsed)) loaded[key] = parsed;
                }
              } catch (e) { /* skip bad keys */ }
            }
            setSetProgress(loaded);
          }
          // Load notes
          const notesResult = await window.storage.list("notes:");
          if (!cancelled && notesResult?.keys) {
            const loadedNotes = {};
            for (const key of notesResult.keys) {
              try {
                const r = await window.storage.get(key);
                if (r?.value) loadedNotes[key] = r.value;
              } catch (e) { /* skip */ }
            }
            setExerciseNotes(loadedNotes);
          }
        }
      } catch (e) {
        // Storage unavailable — fall back to in-memory only
        console.warn("Storage unavailable, set tracking will not persist", e);
      }
      if (!cancelled) setStorageReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Toggle a single set on/off
  const toggleSet = (key, slotIndex) => {
    setSetProgress(prev => {
      const current = prev[key] || [];
      const next = current.includes(slotIndex)
        ? current.filter(i => i !== slotIndex)
        : [...current, slotIndex];
      const updated = { ...prev, [key]: next };
      // Persist asynchronously, don't block UI
      if (typeof window !== "undefined" && window.storage && window.storage.set) {
        window.storage.set(key, JSON.stringify(next)).catch(() => {});
      }
      return updated;
    });
  };

  // Save / update a note for an exercise
  const updateNote = (key, value) => {
    setExerciseNotes(prev => {
      const updated = { ...prev, [key]: value };
      if (typeof window !== "undefined" && window.storage) {
        if (value && value.trim()) {
          window.storage.set?.(key, value).catch(() => {});
        } else {
          window.storage.delete?.(key).catch(() => {});
        }
      }
      return updated;
    });
  };

  // Reset all keys for a given day
  const resetDay = (keys) => {
    setSetProgress(prev => {
      const updated = { ...prev };
      keys.forEach(key => {
        delete updated[key];
        if (typeof window !== "undefined" && window.storage && window.storage.delete) {
          window.storage.delete(key).catch(() => {});
        }
      });
      return updated;
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f0f0f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        button { font-family: inherit; }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#08080888",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1a1a1a",
        padding: "0 20px",
        paddingTop: "env(safe-area-inset-top)",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ padding: "16px 0 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#f0f0f0", fontSize: "18px", fontWeight: "900", letterSpacing: "-0.02em" }}>
                Weekly Programme
              </div>
              <div style={{ color: "#555", fontSize: "12px" }}>
                {weekType === "deload"
                  ? "Deload week · Reduced volume · Recovery focus"
                  : "5-day · Push · Pull · Legs · Push+Core · Pull+Core+Flex"}
              </div>
            </div>

            {/* Week toggle */}
            <div style={{
              display: "flex",
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: "8px",
              padding: "3px",
              flexShrink: 0,
            }}>
              <button
                onClick={() => setWeekType("standard")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                  background: weekType === "standard" ? "#e8643a22" : "transparent",
                  color: weekType === "standard" ? "#e8643a" : "#555",
                  transition: "all 0.2s",
                }}
              >STANDARD</button>
              <button
                onClick={() => setWeekType("deload")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.04em",
                  background: weekType === "deload" ? "#9b6fe822" : "transparent",
                  color: weekType === "deload" ? "#9b6fe8" : "#555",
                  transition: "all 0.2s",
                }}
              >DELOAD</button>
            </div>
          </div>

          {/* Deload banner */}
          {weekType === "deload" && (
            <div style={{
              background: "#9b6fe815",
              border: "1px solid #9b6fe833",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#9b6fe8",
              fontSize: "11px",
              lineHeight: "1.5",
              marginBottom: "12px",
            }}>
              ⚡ Run this week every 4–6 weeks. Volume drops ~50%, intensity stays moderate. Flexibility work continues at full intensity. Don't skip it — accumulated fatigue is the main reason intermediates plateau.
            </div>
          )}

          {/* Day tabs */}
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "12px" }}>
            {activeDays.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderColor: activeDay === d.id ? d.color : "#222",
                  background: activeDay === d.id ? d.color + "22" : "#0f0f0f",
                  color: activeDay === d.id ? d.color : "#555",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                <div>{d.label}</div>
                <div style={{ fontSize: "9px", marginTop: "2px", fontWeight: "500", opacity: 0.8 }}>
                  {d.isRest ? "REST" : d.title.split(" ")[0].toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Day header strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "20px",
        }}>
          <div style={{
            width: "4px", height: "36px", borderRadius: "2px",
            background: day.color,
          }} />
          <div>
            <div style={{ color: day.color, fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {day.label}DAY
            </div>
            <div style={{ color: "#f0f0f0", fontSize: "20px", fontWeight: "900", letterSpacing: "-0.02em" }}>
              {day.title}
            </div>
          </div>
        </div>

        <DayPanel
          day={day}
          weekType={weekType}
          setProgress={setProgress}
          toggleSet={toggleSet}
          resetDay={resetDay}
          exerciseNotes={exerciseNotes}
          updateNote={updateNote}
        />

        {/* Programme notes */}
        <div style={{
          marginTop: "32px",
          background: "#0f0f0f",
          border: "1px solid #1e1e1e",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <div style={{ color: "#555", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
            Programme Notes
          </div>
          {[
            ["Progression cadence", "Revisit exercise levels every 3 weeks. Move up when you hit the top of the rep range for all sets across 2 consecutive sessions."],
            ["Deload weeks", "Run a deload week every 4–6 weeks (toggle the DELOAD switch above). Volume drops ~50% but flexibility continues at full intensity. Skip these and you'll plateau."],
            ["Ring adaptation", "Ring exercises will fatigue stabilisers faster than expected in early weeks. Scale to floor/bar equivalents for the first 1–2 weeks if needed."],
            ["Toe-touch timeline", "Realistic: fingertips brushing toes at 10–16 weeks. Palm-flat is a 6–12 month goal. Don't be discouraged by a slow week — track the trend, not single Sundays."],
            ["Recovery priority", "Gains happen during recovery. Protect your sleep and eat enough protein (~1.6–2g per kg bodyweight daily)."],
          ].map(([title, body], i) => (
            <div key={i} style={{
              display: "flex", gap: "12px",
              padding: "10px 0",
              borderBottom: i < 4 ? "1px solid #1a1a1a" : "none",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#333", flexShrink: 0, marginTop: "6px" }} />
              <div>
                <div style={{ color: "#aaa", fontSize: "12px", fontWeight: "700", marginBottom: "2px" }}>{title}</div>
                <div style={{ color: "#666", fontSize: "12px", lineHeight: "1.6" }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
