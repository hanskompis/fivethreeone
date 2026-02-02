# TODO: 5/3/1 Gym Training App

## Overview

Build an Expo React Native app for calculating 5/3/1 training program weights based on Jim Wendler's methodology. Features a comic-style animated splash screen, input fields for the four main lifts, and generates a complete 4-week training cycle with proper weight rounding for gym plates. Use kilograms.

## 5/3/1 Program Reference

**Training Max:** 90% of 1RM (one-rep max)

| Week | Set 1 | Set 2 | Set 3 (AMRAP) |
|------|-------|-------|---------------|
| Week 1 (5s) | 65% × 5 | 75% × 5 | 85% × 5+ |
| Week 2 (3s) | 70% × 3 | 80% × 3 | 90% × 3+ |
| Week 3 (5/3/1) | 75% × 5 | 85% × 3 | 95% × 1+ |
| Week 4 (Deload) | 40% × 5 | 50% × 5 | 60% × 5 |

---

## Tasks

### 1. Set Up Testing and CI Infrastructure

**Status:** [x] Complete

**Description:** Install testing dependencies and create Makefile with quality check targets.

**Sub-tasks:**
- [x] Install `jest-expo` as dev dependency
- [x] Install `@testing-library/react-native` as dev dependency
- [x] Install `@types/jest` as dev dependency
- [x] Add Jest configuration to `package.json`
- [x] Create `Makefile` with the following targets:
  - `lint-frontend`: Run ESLint on all source files
  - `sast-frontend`: Run TypeScript type-check + ESLint with security rules
  - `test-frontend`: Run Jest test suite
- [x] Verify all targets run successfully

**Success Criteria:**
- `make lint-frontend` executes ESLint and exits 0 on clean code ✅
- `make sast-frontend` runs `tsc --noEmit` and ESLint security checks ✅
- `make test-frontend` runs Jest and reports results ✅
- CI commands documented in README.md ✅

**Files to create/modify:**
- `package.json` (add devDependencies, jest config) ✅
- `Makefile` (new file) ✅
- `README.md` (document commands) ✅

---

### 2. Create Animated Splash Screen

**Status:** [x] Complete

**Description:** Build a comic-style animated splash screen where numbers "5", "3", "1" drop sequentially to the center of the screen with impact effects.

**Sub-tasks:**
- [x] Create `components/AnimatedSplash.tsx` component
- [x] Implement dropping animation for "5" (falls from top, bounces)
- [x] Implement dropping animation for "3" (falls after "5" settles)
- [x] Implement dropping animation for "1" (falls after "3" settles)
- [x] Add comic-style visual effects:
  - Bold black outlines on numbers ✅
  - Drop shadows ✅
  - Slight rotation on impact ✅
  - Scale bounce effect ✅
  - Optional: "POW!" style impact burst (skipped for v1)
- [x] Add `onAnimationComplete` callback prop
- [x] Create `components/AnimatedSplash.test.tsx` with tests
- [x] Style with comic book colors (bold yellow, red, blue)

**Success Criteria:**
- Animation completes in ~2-2.5 seconds ✅
- Numbers appear sequentially with satisfying "drop" feel ✅
- Comic aesthetic is clear (bold, colorful, impactful) ✅
- Component accepts `onAnimationComplete` callback ✅
- Tests pass for component rendering and callback firing ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Technical Details:**
- Use `react-native-reanimated` for animations ✅
- Use `withSpring` for bounce effect ✅
- Use `withSequence` and `withDelay` for timing ✅
- Font: Bold/Black weight, consider comic font or system bold ✅

**Files to create:**
- `components/AnimatedSplash.tsx` ✅
- `components/AnimatedSplash.test.tsx` ✅

---

### 3. Build Main Input Screen

**Status:** [x] Complete

**Description:** Create the main screen with four numeric input fields for entering 1RM values for each lift.

**Sub-tasks:**
- [x] Install `@react-native-async-storage/async-storage`
- [x] Create `components/LiftInput.tsx` - reusable numeric input component
- [x] Create `components/LiftInput.test.tsx`
- [x] Update `app/index.tsx` with:
  - Four `LiftInput` components (Bench Press, Squat, Overhead Press, Deadlift) ✅
  - "Calculate Program" button ✅
  - Load saved values from AsyncStorage on mount ✅
  - Save values to AsyncStorage on change ✅
  - Navigation to program screen on button press ✅
- [x] Create `app/index.test.tsx`
- [x] Add input validation (positive numbers only)
- [x] Add helpful labels and placeholders

**Success Criteria:**
- All four lift inputs render and accept numeric input ✅
- Values persist across app restarts (AsyncStorage) ✅
- Invalid input (negative, non-numeric) is rejected/sanitized ✅
- "Calculate Program" button navigates to program screen ✅
- Keyboard dismisses appropriately ✅
- Tests cover input, validation, and persistence ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Files to create/modify:**
- `package.json` (add async-storage) ✅
- `components/LiftInput.tsx` ✅
- `components/LiftInput.test.tsx` ✅
- `app/index.tsx` ✅
- `app/index.test.tsx` ✅

---

### 4. Implement 5/3/1 Calculation Logic with Rounding

**Status:** [ ] Not Started

**Description:** Create utility functions for calculating training weights based on 5/3/1 percentages with practical plate rounding.

**Sub-tasks:**
- [x] Create `utils/calculations.ts` with:
  - `calculateTrainingMax(oneRepMax: number): number` - returns 90% of 1RM ✅
  - `roundToPlate(weight: number, increment: number): number` - rounds to nearest plate increment ✅
  - `calculateWeekWeights(trainingMax: number, week: 1|2|3|4, roundingIncrement: number): WorkoutSet[]` ✅
  - `generateFullProgram(lifts: LiftValues, settings: Settings): Program` ✅
- [x] Create `utils/calculations.test.ts` with comprehensive tests
- [x] Create `types/program.ts` with TypeScript interfaces:
  - `LiftValues` - the four lift 1RMs ✅
  - `WorkoutSet` - weight, reps, isAMRAP ✅
  - `WorkoutDay` - lift name, sets ✅
  - `Week` - array of workout days ✅
  - `Program` - four weeks ✅

**Success Criteria:**
- Training max correctly calculates as 90% of input ✅
- Rounding works for common increments: 2.5 kg, 5 kg ✅
- All percentage calculations match 5/3/1 spec exactly ✅
- Week 4 deload uses correct lower percentages ✅
- AMRAP sets correctly flagged ✅
- 100% test coverage on calculation functions ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Example calculations (for 100 kg bench 1RM):**
- Training Max: 100 kg
- 0.90 * 100kg = 90 kg
- Week 1 Set 3: 90 × 0.85 = 76.5 → rounded to 75 kg (1.25 kg plates)

**Files to create:**
- `utils/calculations.ts` ✅
- `utils/calculations.test.ts` ✅
- `types/program.ts` ✅

---

### 5. Create Settings Screen

**Status:** [x] Complete

**Description:** Add a settings screen for configuring weight units and rounding increments.

**Sub-tasks:**
- [x] Create `app/settings.tsx` screen
- [x] Add rounding increment selector per all four lifts:
  - For kg: 5 / 2.5 / 1.25 ✅
- [x] Save settings to AsyncStorage
- [x] Create `hooks/useSettings.ts` custom hook for settings state
- [x] Create `app/settings.test.tsx`
- [ ] Add settings icon/button to main screen header (will add in Task 7)

**Success Criteria:**
- Settings persist across app restarts ✅
- Unit change reflects throughout the app ✅
- Rounding increment options appropriate for selected unit ✅
- Settings hook provides typed access to settings ✅
- Tests cover setting changes and persistence ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Files to create:**
- `app/settings.tsx` ✅
- `app/settings.test.tsx` ✅
- `hooks/useSettings.ts` ✅
- `hooks/useSettings.test.ts` ✅

---

### 6. Create Program Display Screen

**Status:** [x] Complete

**Description:** Build the screen that displays the complete 4-week program with calculated weights.

**Sub-tasks:**
- [x] Create `app/program.tsx` screen
- [x] Create `components/WeekCard.tsx` - displays one week's workouts
- [x] Create `components/WorkoutDay.tsx` - displays one lift's sets
- [x] Create `components/SetRow.tsx` - displays weight × reps
- [x] Display all four weeks with:
  - Week number and name (e.g., "Week 1 - 5s Week") ✅
  - Each lift with its three working sets ✅
  - AMRAP sets marked with "+" indicator ✅
  - Weights rounded per user settings ✅
- [x] Add swipe or tab navigation between weeks (tab navigation)
- [x] Create test files for all new components
- [x] Style consistently with app theme

**Success Criteria:**
- All four weeks display correctly ✅
- Weights match calculated values from utils ✅
- AMRAP sets clearly indicated ✅
- Easy navigation between weeks ✅
- All component tests pass ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Files to create:**
- `app/program.tsx` ✅
- `app/program.test.tsx` ✅
- `components/WeekCard.tsx` ✅
- `components/WeekCard.test.tsx` ✅
- `components/WorkoutDay.tsx` ✅
- `components/WorkoutDay.test.tsx` ✅
- `components/SetRow.tsx` ✅
- `components/SetRow.test.tsx` ✅

---

### 7. Wire Up Navigation and State

**Status:** [x] Complete

**Description:** Connect all screens with proper navigation flow and shared state management.

**Sub-tasks:**
- [x] Update `app/_layout.tsx`:
  - Integrate `AnimatedSplash` as initial view ✅
  - Hide native splash screen after animated splash completes ✅
  - Configure stack navigator with all screens ✅
  - Add settings button to header ✅
- [x] Ensure smooth navigation flow:
  1. App opens → Animated splash plays ✅
  2. Splash completes → Main input screen ✅
  3. User enters values → Navigate to program ✅
  4. Settings accessible from main screen header ✅
- [ ] Create integration tests for navigation flow (skipped - unit tests cover individual flows)
- [ ] Handle deep linking (optional - not implemented)

**Note:** Shared state management via context was not needed - AsyncStorage with hooks provides sufficient state persistence and each screen manages its own loading state.

**Success Criteria:**
- Splash screen shows on cold start, transitions smoothly ✅
- Navigation between all screens works correctly ✅
- State persists and syncs across screens ✅
- Back navigation works as expected ✅
- No flickering or janky transitions ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Files to create/modify:**
- `app/_layout.tsx` ✅

---

### 8. Per-Lift Settings Configuration

**Status:** [x] Complete

**Description:** Enhance settings to allow individual configuration of weight increment and rounding mode for each lift. Different lifts may benefit from different rounding (e.g., smaller increments for OHP vs larger for deadlift).

**Sub-tasks:**
- [x] Update `types/program.ts`:
  - Add `RoundingMode` type: `'down' | 'nearest' | 'up'` ✅
  - Add `LiftSettings` interface with `increment` and `roundingMode` per lift ✅
  - Update `Settings` interface to include per-lift settings ✅
- [x] Update `hooks/useSettings.ts`:
  - Support per-lift increment values ✅
  - Support per-lift rounding mode ✅
  - Migrate existing global setting to per-lift structure ✅
- [x] Update `app/settings.tsx`:
  - Add collapsible/expandable section for each lift ✅
  - Show increment selector per lift (2.5 / 5 / 10 kg) ✅
  - Show rounding mode selector per lift (round down / nearest / up) ✅
  - Default values: 2.5 kg increment, round down ✅
- [x] Update `utils/calculations.ts`:
  - Modify `roundToPlate` to accept rounding mode ✅
  - Update `generateFullProgram` to use per-lift settings ✅
- [x] Update tests:
  - `hooks/useSettings.test.ts` - test per-lift settings persistence ✅
  - `utils/calculations.test.ts` - test all rounding modes ✅
  - `__tests__/app/settings.test.tsx` - test per-lift UI ✅

**Success Criteria:**
- Each lift can have its own increment setting ✅
- Each lift can have its own rounding mode ✅
- Settings UI clearly shows per-lift configuration ✅
- Calculated program uses correct settings per lift ✅
- Backwards compatible - existing users get sensible defaults ✅
- All tests pass (81 tests) ✅
- Passes `make lint-frontend` and `make test-frontend` ✅

**Files modified:**
- `types/program.ts` ✅
- `hooks/useSettings.ts` ✅
- `hooks/useSettings.test.ts` ✅
- `app/settings.tsx` ✅
- `__tests__/app/settings.test.tsx` ✅
- `utils/calculations.ts` ✅
- `utils/calculations.test.ts` ✅

---

## Quality Checklist

Before marking any task complete, verify:

- [x] `make lint-frontend` passes (no ESLint errors)
- [x] `make sast-frontend` passes (TypeScript compiles, no security issues)
- [x] `make test-frontend` passes (all Jest tests green)
- [x] New components have corresponding `.test.tsx` files
- [x] TypeScript has no `any` types (use proper interfaces)
- [x] Code follows project conventions (see `.github/copilot-instructions.md`)

---

## File Structure (Target)

```
fivethreeone/
├── Makefile
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── index.test.tsx
│   ├── program.tsx
│   ├── program.test.tsx
│   ├── settings.tsx
│   └── settings.test.tsx
├── components/
│   ├── AnimatedSplash.tsx
│   ├── AnimatedSplash.test.tsx
│   ├── LiftInput.tsx
│   ├── LiftInput.test.tsx
│   ├── WeekCard.tsx
│   ├── WeekCard.test.tsx
│   ├── WorkoutDay.tsx
│   ├── WorkoutDay.test.tsx
│   ├── SetRow.tsx
│   └── SetRow.test.tsx
├── contexts/
│   ├── AppContext.tsx
│   └── AppContext.test.tsx
├── hooks/
│   ├── useLiftValues.ts
│   ├── useLiftValues.test.ts
│   ├── useSettings.ts
│   └── useSettings.test.ts
├── types/
│   └── program.ts
└── utils/
    ├── calculations.ts
    └── calculations.test.ts
```

---

## Notes

- All percentages in calculations are based on **Training Max** (90% of 1RM), not the actual 1RM
- The "+" notation indicates AMRAP (As Many Reps As Possible) - user should do more than the minimum
- Weight rounding should always round DOWN to ensure user can complete the lift
- Consider adding warmup set calculations in future iteration
