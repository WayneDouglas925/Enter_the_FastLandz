# 🎨 Image Integration Plan - FastLandz Days

## Images Received So Far

### Day 3: Water Warrior
- **Challenge Page:** Water tracking, hydration logging, "The Mirage of Hunger" lesson
- **Timer Page:** "The Wasteland Trek" - 14-hour fast with cyan/green accents
- **Theme Colors:** Cyan primary, green progress ring
- **Key Features:** Water ration counter (3.8 cups), hydration tips

### Day 4: Snack Assassin
- **Challenge Page:** "Why We Kill Snacks" mission, daily objectives checklist
- **Timer Page:** 16-hour fast, "Ketosis Loading" status indicator
- **Theme Colors:** Green primary (toxic green #65a30d)
- **Key Features:** Mission report, survival tips, scavenge notes logging

## Still Needed

- ✅ Day 1: (will design based on existing data)
- ✅ Day 2: (pending image)
- ✅ Day 3: ✓ Received
- ✅ Day 4: ✓ Received
- ⏳ Day 5: Pending
- ⏳ Day 6: Pending
- ✅ Day 7: (will design based on existing data)

---

## Design Patterns Observed

### Challenge Pages Include:
1. **Mission Status Badge** (top)
2. **Day Title** (large display font)
3. **Subtitle/Description** (body text)
4. **Stats Cards** (fasting protocol, water/movement goals)
5. **Wasteland Wisdom Section** (lesson content)
6. **Interactive Elements** (water logging, checkboxes)
7. **Completion CTA** (bottom button)

### Timer Pages Include:
1. **Sector Header** (top navigation)
2. **Protocol Title** (e.g., "The Wasteland Trek")
3. **Large Circular Timer** (green progress ring)
4. **Time Remaining** (HH:MM:SS format)
5. **Status Indicator** (e.g., "Fat Burning Zone", "Ketosis Loading")
6. **Quote/Transmission** (motivational text)
7. **Start/Target Times**
8. **Protocol Type** (e.g., "14:10 TRF")
9. **Current Status** (e.g., "Ketosis")
10. **Action Buttons** (Pause Fast, Log Feelings, End Early)

---

## Implementation Strategy

### Phase 1: Create Individual Day Components ✅
Instead of one generic `ChallengeSetup.tsx`, create:
- `Day1Challenge.tsx` / `Day1Timer.tsx`
- `Day2Challenge.tsx` / `Day2Timer.tsx`
- etc.

Each day gets unique:
- Layout variations
- Interactive features specific to that day
- Custom styling and color accents

### Phase 2: Enhanced Features Per Day

#### Day 3: Water Warrior
```typescript
- Water intake tracker (cup icons)
- Hydration progress bar (X/8 cups)
- Interactive water logging
- "Log Your Rations" clickable cups
- Survivor's log input field
```

#### Day 4: Snack Assassin
```typescript
- Daily objectives checklist
- Mission report text area
- "Kills confirmed" counter
- Scavenge notes logging
- Progress percentage display
```

### Phase 3: Timer Enhancements
- Add background gradients matching day theme
- Implement status badges (Ketosis, Fat Burning, etc.)
- Add transmission/quote rotation
- Timer-specific tips (Hydration Check, Mindset Tip, etc.)

---

## File Structure

```
public/
  images/
    days/
      day1-hero.png          # Challenge page hero image
      day2-hero.png
      day3-hero.png          # Water Warrior
      day4-hero.png          # Snack Assassin
      day5-hero.png
      day6-hero.png
      day7-hero.png
    timers/
      day1-timer-bg.png      # Timer background/theme
      day2-timer-bg.png
      day3-timer-bg.png      # The Wasteland Trek
      day4-timer-bg.png      # Ketosis Loading
      day5-timer-bg.png
      day6-timer-bg.png
      day7-timer-bg.png
    icons/
      water-icon.svg         # For Day 3
      snack-icon.svg         # For Day 4
      etc.

components/
  days/
    Day1Challenge.tsx
    Day1Timer.tsx
    Day2Challenge.tsx
    Day2Timer.tsx
    Day3Challenge.tsx        # Water Warrior
    Day3Timer.tsx            # The Wasteland Trek
    Day4Challenge.tsx        # Snack Assassin
    Day4Timer.tsx            # Ketosis Timer
    Day5Challenge.tsx
    Day5Timer.tsx
    Day6Challenge.tsx
    Day6Timer.tsx
    Day7Challenge.tsx
    Day7Timer.tsx
```

---

## Next Steps

### Immediate Actions:
1. ✅ Save Day 3 & Day 4 design screenshots
2. ⏳ Wait for Day 5 & Day 6 images
3. ✅ Create individual day component templates
4. ✅ Extract design elements (colors, layouts, interactions)
5. ✅ Build Day 3 & Day 4 components matching designs exactly

### Design Extraction Needed:
From Day 3 & Day 4 screenshots, extract:
- Exact color codes (gradients, backgrounds)
- Font sizes and weights
- Spacing and layout measurements
- Icon SVGs or replacements
- Button styles and states
- Progress ring specifications

---

## Technical Implementation

### Day-Specific Routing
Update `App.tsx` to route to day-specific components:

```typescript
{view === 'CHALLENGE' && progress.currentDay === 3 && (
  <Day3Challenge onStartFast={handleStartFast} />
)}

{view === 'TIMER' && progress.currentDay === 3 && (
  <Day3Timer
    fastState={fastState}
    onPause={handlePauseToggle}
    onComplete={handleComplete}
  />
)}
```

### Data Structure Updates
Update `data.ts` to include day-specific data:

```typescript
{
  day: 3,
  title: "Water Warrior",
  subtitle: "The wasteland is unforgiving",
  heroImage: "/images/days/day3-hero.png",
  timerImage: "/images/timers/day3-timer-bg.png",
  timerTitle: "The Wasteland Trek",
  features: {
    waterTracking: true,
    hydrationGoal: 8,
    specialWidget: "water-rations"
  },
  // ... rest of challenge data
}
```

---

## Status: Ready to Build

Once you provide Day 5 & Day 6 images, I can:
1. Create all 7 day-specific components
2. Match your exact designs
3. Implement interactive features (water logging, checklists, etc.)
4. Add smooth transitions between days
5. Ensure each day feels unique and immersive

**Next:** Share Day 5 & Day 6 images and I'll start building! 🚀
