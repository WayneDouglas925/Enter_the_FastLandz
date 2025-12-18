# Day-Specific Components Implementation Plan

## Design Observations Summary

### Day 3: Water Warrior
**Challenge Title:** "WATER WARRIOR"
**Timer Title:** "The Wasteland Trek"
**Fast Duration:** 14 hours
**Key Features:**
- Water rations tracker (3.8/8 cups)
- Interactive cup logging (8 clickable icons)
- "The Mirage of Hunger" lesson
- Survivor's Log input
- Danger Bonus card
- Daily Log text area

### Day 4: Snack Assassin
**Challenge Title:** "SNACK ASSASSIN"
**Timer Title:** "FASTING TIMER - DAY 4"
**Fast Duration:** 16 hours
**Key Features:**
- Daily Objectives checklist (3 items with checkboxes)
- "Why We Kill Snacks" lesson
- Mission Report text area
- Survival Tip card
- "Ketosis Loading" status indicator
- Scavenge Notes logging

### Day 5: The Carb Reckoning
**Challenge Title:** "THE CARB RECKONING"
**Timer Title:** "The Salt Flats"
**Fast Duration:** 16 hours
**Key Features:**
- Protocol selection (Scout Class 16-hour vs Warrior Class 18-hour)
- Mission Directives with numbered badges
- Intel Briefing about carbs/insulin
- Movement Protocol with progress bar (2,458/4,000 steps)
- Wasteland Log text area
- Multiple survival tips

### Day 6: The 20-Hour Trial
**Challenge Title:** "THE 20-HOUR TRIAL"
**Timer Title:** "The Long Haul"
**Fast Duration:** 20 hours
**Key Features:**
- Challenge Progress: Day 6 of 7 (85% complete)
- Difficulty badge ("Difficulty: Hard")
- Mission Directives (3 cards with icons)
- Autophagy science briefing with cellular visual
- Daily Log with encryption simulation
- Body Status panel (Hunger, Energy, Mental Clarity)
- "Deep Ketosis" status

## Component Architecture

### Folder Structure
```
components/
  days/
    Day3Challenge.tsx
    Day3Timer.tsx
    Day4Challenge.tsx
    Day4Timer.tsx
    Day5Challenge.tsx
    Day5Timer.tsx
    Day6Challenge.tsx
    Day6Timer.tsx

    shared/
      WaterTracker.tsx         # For Day 3
      ChecklistWidget.tsx      # For Day 4
      ProtocolSelector.tsx     # For Day 5
      BodyStatusPanel.tsx      # For Day 6
      ProgressBar.tsx          # Reusable
      MissionCard.tsx          # Reusable
```

---

## Implementation Priority

### Phase 1: Update Data Structure ✅
Update `data.ts` with correct titles and add timer titles:

```typescript
export interface ChallengeData {
  // ... existing fields
  timerTitle?: string;      // e.g., "The Wasteland Trek"
  difficulty?: string;       // e.g., "Hard", "Moderate"
  statusIndicator?: string;  // e.g., "Ketosis", "Deep Ketosis"
}
```

### Phase 2: Create Shared Components
Build reusable widgets used across multiple days:

1. **ProgressRing.tsx** - Circular timer (all days)
2. **MissionCard.tsx** - Directive cards (Days 3-6)
3. **InputArea.tsx** - Text input for logs
4. **StatsCard.tsx** - Small stat displays
5. **TipCard.tsx** - Survival tips

### Phase 3: Build Day-Specific Components
Create unique components for each day, implementing their special features:

#### Day 3 Components
- Water cup tracker with state
- Hydration tips
- Mirage lesson card

#### Day 4 Components
- Checkbox objectives (with localStorage persistence)
- Mission report input
- Kill confirmation button

#### Day 5 Components
- Protocol selector radio buttons
- Movement step tracker
- Carb intel briefing

#### Day 6 Components
- Progress tracker (Day X of 7)
- Autophagy visualization
- Body status indicators
- Encryption-style log display

### Phase 4: Routing Updates
Update `App.tsx` to route to day-specific components:

```typescript
// In App.tsx
const renderChallenge = () => {
  switch(progress.currentDay) {
    case 3: return <Day3Challenge onStartFast={handleStartFast} />;
    case 4: return <Day4Challenge onStartFast={handleStartFast} />;
    case 5: return <Day5Challenge onStartFast={handleStartFast} />;
    case 6: return <Day6Challenge onStartFast={handleStartFast} />;
    default: return <ChallengeSetup challenge={currentChallenge} onStartFast={handleStartFast} />;
  }
};

const renderTimer = () => {
  switch(progress.currentDay) {
    case 3: return <Day3Timer fastState={fastState} onPause={handlePauseToggle} onComplete={handleComplete} />;
    case 4: return <Day4Timer fastState={fastState} onPause={handlePauseToggle} onComplete={handleComplete} />;
    // ... etc
  }
};
```

---

## Timeline Estimate

Given the complexity of each day's unique features:

- **Day 3 (Water Warrior):** ~2-3 hours
  - Water tracker state management
  - Interactive cup icons
  - Timer with trek theme

- **Day 4 (Snack Assassin):** ~2 hours
  - Checkbox system
  - Mission report
  - Timer with ketosis indicator

- **Day 5 (Carb Reckoning):** ~3 hours
  - Protocol selector
  - Step progress bar
  - Multiple intel cards
  - Timer with salt flats theme

- **Day 6 (20-Hour Trial):** ~3-4 hours
  - Most complex
  - Autophagy visual
  - Body status panel
  - Progress tracker
  - Timer with deep ketosis theme

**Total:** ~10-12 hours of focused development

---

## Quick Start Option

For faster deployment, I can:

1. **Use generic ChallengeSetup** for all days initially
2. **Add day-specific styling** (colors, titles) via data.ts
3. **Phase in interactive features** one day at a time

This gets the visual updates live immediately while we build out the advanced features progressively.

---

## Decision Point

**Option A: Full Custom Build** (10-12 hours)
- All days get unique components
- All interactive features implemented
- Pixel-perfect to your designs

**Option B: Hybrid Approach** (3-4 hours initial, then iterate)
- Update data.ts with new titles/colors
- Enhance existing ChallengeSetup to support day variants
- Add interactive widgets progressively

**Option C: MVP + Polish** (6-8 hours)
- Build Days 3-6 as custom components
- Keep Days 1-2-7 using generic setup
- Focus on the unique middle days

---

## Recommendation

I suggest **Option B: Hybrid Approach** to get you up and running quickly:

1. **Today:** Update colors, titles, basic layouts (2-3 hours)
2. **Next:** Add interactive features per day (1 hour per day as needed)
3. **Polish:** Animations, transitions, edge cases

This way you can test and iterate rather than waiting for everything to be perfect.

**What's your preference?**

