import { ChallengeData } from './types';

export const CHALLENGES: ChallengeData[] = [
  {
    day: 1,
    title: "Enter the Wasteland",
    fastHours: 12,
    behavior: "Stop eating after dark",
    movement: "Walk 1,000 steps",
    shortBlurb: "Your body is the battlefield. Hunger is the enemy. The 12-hour mark is your first checkpoint.",
    lessonTitle: "The 12-Hour Checkpoint",
    lessonContent: "Welcome to the FASTLANDS. This isn't a diet. This is survival training for your metabolism.\n\nTonight, you stop eating after dark. Why? Because your ancestors didn't have 24/7 access to food. They didn't snack at midnight. Their bodies learned to burn fat instead of begging for more carbs.\n\nYour body has two fuel sources: sugar (easy, burns fast) and fat (harder to access, burns clean). Right now, you're running on sugar. After 12 hours without food, your body starts switching to fat. This is called metabolic flexibility, and most people have lost it.\n\nThe 12-hour fast is your entry point. It's not hard. It's a test: Can you stop eating when your body doesn't actually need food? Can you tell the difference between hunger and boredom?\n\nExpect: Mild hunger around hour 10-11. Ignore it. Drink water. Go to bed. Wake up stronger.",
    bonusTip: "Hunger is temporary. Discipline is permanent.",
    notesPrompt: "Mood, last meal, cravings"
  },
  {
    day: 2,
    title: "First Blood",
    fastHours: 14,
    behavior: "No sugary drinks. Black coffee/water only.",
    movement: "Walk 2,000 steps",
    shortBlurb: "Insulin is the warden. Fasting is the jailbreak. At 14 hours, you're starting to escape.",
    lessonTitle: "Insulin Jailbreak",
    lessonContent: "Every time you eat, insulin shows up. Its job? Lock away energy as fat and keep you dependent on the next meal.\n\nInsulin isn't evil—it's doing its job. But when it's constantly elevated (because you're constantly eating), your body never gets a chance to burn stored fat. You're locked in a cycle: eat, store, crave, repeat.\n\nFasting drops insulin. At 14 hours, it's low enough that your body can finally access fat stores. This is why you might feel a surge of energy around this mark—you're no longer waiting for food. You're running on your reserves.\n\nToday's challenge: No sugary drinks. Not even \"healthy\" ones. Orange juice, smoothies, sports drinks—they all spike insulin and reset your progress. Black coffee and water only.\n\nExpect: Cravings will hit. This is your brain, used to constant fuel, throwing a tantrum. It will pass.",
    bonusTip: "The goal isn't to suffer. It's to teach your body it doesn't need to eat every 3 hours.",
    notesPrompt: "Hunger scale on wakeup (1–10)"
  },
  {
    day: 3,
    title: "Water Warrior",
    fastHours: 14,
    behavior: "Drink 8 cups of water. Add salt if dizzy.",
    movement: "Walk 2,000 steps",
    shortBlurb: "Thirst masquerades as hunger. Water is your weapon. Hydration separates the survivors from the casualties.",
    lessonTitle: "Water is Your Weapon",
    lessonContent: "Most people mistake thirst for hunger. Your brain sends a signal: \"I need something.\" You assume it's food. It's not. It's water.\n\nDehydration makes fasting harder. It causes headaches, brain fog, and false hunger signals. It slows your metabolism. It makes you weak when you should be getting stronger.\n\nToday's mission: 8 cups of water minimum. Not all at once—spread it out. First thing in the morning, between meals, before bed. Add a pinch of salt if you're feeling lightheaded (you're flushing electrolytes).\n\nWhy this matters: Fat burning produces waste products. Water flushes them out. Without it, you feel like garbage even though you're doing everything right.\n\nExpect: More bathroom trips. That's the point. You're flushing out years of metabolic sludge.",
    bonusTip: "When you think you're hungry at hour 12, drink a full glass of water and wait 10 minutes.",
    notesPrompt: "How hydrated do you feel?",
    timerTitle: "The Wasteland Trek",
    difficulty: "Moderate",
    statusIndicator: "Hydration"
  },
  {
    day: 4,
    title: "Snack Assassin",
    fastHours: 16,
    behavior: "No snacking. Zero. Not even 'healthy' snacks.",
    movement: "Walk 3,000 steps",
    shortBlurb: "16 hours is where the magic happens. Your body stops asking for food and starts burning fat. This is the metabolic shift.",
    lessonTitle: "The Metabolic Shift",
    lessonContent: "Welcome to the turning point. 16 hours is when your body realizes: \"Oh, we're serious about this.\"\n\nUp until now, you've been in the shallow end—burning through stored glycogen (sugar reserves). At 16 hours, glycogen is depleted. Your liver starts converting fat into ketones—a cleaner, more efficient fuel source.\n\nThis is metabolic flexibility: the ability to switch between sugar and fat as fuel. Most people are metabolically rigid—they can only run on carbs, which is why they're constantly hungry.\n\nExpect: A strange clarity around hour 14-16. Your brain runs well on ketones. Some people call it \"fasting euphoria.\" It's not magic—it's biochemistry.\n\nToday's rule: No snacking. None. Not even \"healthy\" snacks. Every time you eat, you reset the clock. Your body needs uninterrupted time to make the shift.",
    bonusTip: "The hardest part of fasting isn't hunger. It's breaking the habit of eating out of boredom.",
    notesPrompt: "Did you snack? Be honest.",
    timerTitle: "Fasting Timer - Day 4",
    difficulty: "Moderate",
    statusIndicator: "Ketosis"
  },
  {
    day: 5,
    title: "The Carb Reckoning",
    fastHours: 16,
    behavior: "Eat protein/fat before fast. No carbs.",
    movement: "Walk 4,000 steps",
    shortBlurb: "Carbs are the enemy of fat burning. Today, you cut them before the fast. Watch what happens at 16 hours.",
    lessonTitle: "Carbs vs Fat Burning",
    lessonContent: "Carbs aren't inherently bad. But if your goal is to burn fat, carbs are working against you.\n\nHere's why: Every gram of carbohydrate you eat gets converted to glucose (sugar). Glucose spikes insulin. Insulin stops fat burning. Even if you fast for 16 hours, a carb-heavy meal before the fast means you spend most of those hours just clearing glucose—not burning fat.\n\nToday's challenge: Eat protein and fat before your fast. Eggs, meat, avocado, nuts. Skip the bread, pasta, rice, and sugar. Notice how different the fast feels.\n\nExpect: Less hunger. Fat and protein digest slower, keeping you full longer. Carbs digest fast and leave you craving more.\n\nThis isn't about going zero-carb forever. It's about understanding how fuel choice impacts your fast.",
    bonusTip: "Your metabolism is an engine. Carbs are starter fluid. Fat is diesel.",
    notesPrompt: "Describe your energy levels.",
    timerTitle: "The Salt Flats",
    difficulty: "Hard",
    statusIndicator: "Autophagy"
  },
  {
    day: 6,
    title: "The 20-Hour Trial",
    fastHours: 20,
    behavior: "One meal only (OMAD). Protein + Fat focused.",
    movement: "Gentle walk (min 2,000 steps)",
    shortBlurb: "20 hours. One meal. Maximum fat burn. Your body is in deep repair mode. This is where transformation happens.",
    lessonTitle: "Deep Repair Mode",
    lessonContent: "Today is the longest fast yet: 20 hours. This is where casual fasters quit and serious ones level up.\n\nAt 20 hours, you're in deep ketosis. Fat burning is maxed out. But more importantly, autophagy kicks in—your body's cellular cleanup process. Old, damaged cells get recycled. Inflammation drops. Your immune system gets stronger.\n\nYou can't buy this in a supplement. You can't shortcut it with a \"detox tea.\" The only way to trigger deep autophagy is to stop eating long enough for your body to prioritize repair over digestion.\n\nToday's protocol: One meal only. Protein + fat-focused. Keep it simple—steak and eggs, salmon and avocado, whatever works. Eat until satisfied, not stuffed.\n\nExpect: The hardest part is between hours 14-18. After that, hunger often fades.",
    bonusTip: "If you make it through today, Day 7 is just a formality.",
    notesPrompt: "Headaches? Cravings? Regret?",
    timerTitle: "The Long Haul",
    difficulty: "Very Hard",
    statusIndicator: "Deep Ketosis"
  },
  {
    day: 7,
    title: "BOSS FIGHT",
    fastHours: 24,
    behavior: "Fast through the day and night.",
    movement: "Optional walk/stretch",
    shortBlurb: "The final test. 24 hours. No food. Just you, your discipline, and the wasteland. Survive this, and you've earned your freedom.",
    lessonTitle: "The Final Test",
    lessonContent: "This is it. The 24-hour fast. Most people never attempt this. Not because it's impossible—because they're mentally weak.\n\nYou've spent 6 days training for this moment. You know what hunger feels like at hour 12. You know the clarity at hour 16. You know the power of 20 hours. Now you push past all of it.\n\nPhysiologically, 24 hours is where maximum fat oxidation occurs. Growth hormone spikes. Autophagy runs at full capacity. Your body is literally rebuilding itself while you do nothing but wait.\n\nBut this isn't about the science. It's about proving to yourself that you control your body—it doesn't control you.\n\nProtocol: Fast through the day and night. Break your fast tomorrow morning. Hydrate aggressively. Add electrolytes (salt, magnesium, potassium) if you feel dizzy.",
    bonusTip: "You're not like most people anymore.",
    notesPrompt: "What was the hardest hour?",
    timerTitle: "TIME REMAINING",
    subtitle: "Day 7: The Ultimate Haul",
    difficulty: "Extreme",
    statusIndicator: "AUTOPHAGY PEAK"
  }
];

export const QUOTES = [
  "Still hungry? That’s not hunger. That’s boredom in a lab coat.",
  "Your body is the battlefield. Hunger is the enemy.",
  "Pain is temporary. Glory is forever. Pizza can wait.",
  "The tank is empty. The spirit is full.",
  "Don't let the stomach demons win.",
  "You are the Lunchless Legend.",
  "Survive the night. Feast on victory."
];