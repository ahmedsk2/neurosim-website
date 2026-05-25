# React-hooks v7 warnings: triage (READ ONLY)

Triage of the react-hooks v7 findings demoted to warnings in Wave 3a
(OPEN_QUESTIONS.md item 17). This is read-only: nothing changed, no branch, no
commits. The goal is small, safe, reviewable fix batches, NOT one blind sweep,
because most findings are in interactive widgets that encode clinical physiology.

- Date: 2026-05-25
- Git precondition: on `main`, clean, `HEAD == origin/main == 0eaa659`, in sync
  (`git status -sb`, `git fetch origin main --dry-run`).
- Source: `npx eslint src --format json`, parsed by rule and file. Code read at each
  site. Test coverage checked by `find` for `engine.ts` and `*.test.*`.

## Inventory (reconciled)

**23 total = 18 react-hooks rule warnings + 5 stale unused-disable directives**, all
currently demoted to warnings (lint passes at 0 errors).

| Rule | Count | Files |
| --- | --- | --- |
| react-hooks/immutability | 7 | CPPTriangle (x2), SDPropagation, SpreadingDepolarizationAnimator (x2), aEEGGenerator (x2) |
| react-hooks/purity | 4 | MxAutoregContrast, MultimodalDiscordance, NonInvasiveICPDemo (x2) |
| react-hooks/set-state-in-effect | 6 | LocalePicker, ThemeToggle, LectureTimer, useCountUp, lib/i18n, lib/theme |
| react-hooks/static-components | 1 | content/WidgetEmbed |
| unused-disable-directive (stale exhaustive-deps) | 5 | CPPoptUCurve, MxCalculator, OrxCalculator, PRxCalculator, shared/useCanvas |

## Classification (A real bug / B intentional / C clinical-sensitive)

| File:line | Rule | Class | Why / proposed resolution |
| --- | --- | --- | --- |
| content/WidgetEmbed.tsx:71 | static-components | **A** | `dynamic(loader)` is called in render, so a new lazy component is created every render (remount + state loss if WidgetEmbed ever re-renders). Latent (content pages rarely re-render it) but a real anti-pattern. Fix: build the dynamic component once (module-level `name -> component` cache, or `useMemo` keyed by `name`). Infra file, not physiology. Verify all widgets still lazy-load and keep state across a re-render. |
| layout/ThemeToggle.tsx:13 | set-state-in-effect | **B** | SSR hydration: `setT(getTheme()); setHydrated(true)` in a mount effect to read the client theme after mount. Intentional and correct. Pure UI. Resolution: refactor to `useSyncExternalStore` (the idiomatic fix that removes the warning) OR a scoped commented disable. |
| layout/LocalePicker.tsx:14 | set-state-in-effect | **B** | Same hydration pattern for locale. Pure UI. Same resolution. |
| lib/theme.ts:36 (`useTheme`) | set-state-in-effect | **B** | `setT(getTheme())` on mount + subscribe to a theme-change event. Intentional hydration + external-store subscription. Pure UI. Best fixed with `useSyncExternalStore`. |
| lib/i18n.ts:71 (`useLocale`) | set-state-in-effect | **B** | Identical to theme.ts for locale. Pure UI. `useSyncExternalStore`. |
| hooks/useCountUp.ts:35 | set-state-in-effect | **B** | Reduced-motion branch sets the final value immediately (`setValue(target); return`) instead of animating. Intentional and correct (accessibility). Pure UI animation hook. Resolution: commented disable, or restructure so the reduced-motion path sets initial state. |
| teach/LectureTimer.tsx:46 | set-state-in-effect | **B** | `if (elapsed >= TOTAL_SECONDS) setRunning(false)` stops the timer at the end. Teaching aid, not physiology. Resolution: commented disable, or move the stop into the tick that increments `elapsed`. Behavior to preserve: stops at total. |
| widgets/CPPTriangle/index.tsx:18,19 | immutability | **C** | The mount effect calls `drawCPPDiagram()` / `drawLassen()`, which are function declarations BELOW it (the rule flags the forward reference). CPP / Lassen autoregulation diagram. Likely-safe resolution (hoist the draw declarations above the effect), but must confirm the canvas redraws identically. No tests. |
| widgets/SDPropagation/index.tsx:36 | immutability | **C** | Inside the `requestAnimationFrame` tick: state spread + `drawStrip()` forward reference. Spreading-depolarization strip animation. Resolution likely a reorder/wrap, but the animation timing encodes the physiology. No tests. |
| widgets/SpreadingDepolarizationAnimator/index.tsx:46,47 | immutability | **C** | Same tick pattern (`drawCortical()` / `drawEcog()` forward refs, phase state machine). Cortical SD animation. No tests. |
| widgets/aEEGGenerator/index.tsx:21,22 | immutability | **C** | Effect (`[pattern]` dep) calls `drawAEEG()` / `drawPipeline()` forward refs. aEEG pattern generator. No tests. |
| illustrations/MxAutoregContrast.tsx:56 | purity | **C** | `Math.random()` during render to generate the impaired-autoregulation scatter. The randomness IS the teaching (re-rolls the noisy series). If intended, resolution is a commented disable (behavior-preserving); if it should be deterministic, that is a behavior change. Author call. No tests. |
| widgets/MultimodalDiscordance/index.tsx:78 | purity | **C** | Impure call in render (`performance.now()` in a `useRef` initializer / tick baseline). Discordance simulation. Likely a behavior-preserving lazy-init fix, but it is a clinical sim with no tests. |
| widgets/NonInvasiveICPDemo/index.tsx:19,20 | purity | **C** | `Math.random()` in render to produce the NOISY tympanic / B4C non-invasive ICP estimates (the point is they are unreliable). Re-rolls per render. If intended, commented disable; if it should be stable, behavior change. Author call. No tests. |
| widgets/CPPoptUCurve/index.tsx:101 | unused-disable | **trivial** | Stale `// eslint-disable-next-line react-hooks/exhaustive-deps` on a run-once `[]` mount effect; v7 no longer reports exhaustive-deps there. Remove the comment (behavior-neutral). |
| widgets/MxCalculator/index.tsx:59 | unused-disable | **trivial** | Same stale disable on the seed/draw mount effect. Remove. |
| widgets/OrxCalculator/index.tsx:59 | unused-disable | **trivial** | Same. Remove. |
| widgets/PRxCalculator/index.tsx:38 | unused-disable | **trivial** | Same. Remove. |
| widgets/shared/useCanvas.ts:68 | unused-disable | **trivial** | Stale disable on the rAF loop effect (`[running]`). Remove. |

Summary: **1 A**, **6 B**, **11 C** (the 7 immutability + 4 purity, all in clinical
widgets), **5 trivial** comment removals.

## 3. Pure-UI / presentation vs clinical-physiology files

- **Pure UI / presentation / infra (low risk to change):** `lib/theme.ts`,
  `lib/i18n.ts`, `layout/ThemeToggle.tsx`, `layout/LocalePicker.tsx`,
  `hooks/useCountUp.ts`, `teach/LectureTimer.tsx`, `content/WidgetEmbed.tsx`. Plus
  the 5 stale-disable removals (comment-only, behavior-neutral, even though 4 live in
  widget files).
- **Clinical-physiology widget engines/shells (high risk, behavior encodes
  teaching):** `widgets/CPPTriangle`, `widgets/SDPropagation`,
  `widgets/SpreadingDepolarizationAnimator`, `widgets/aEEGGenerator`,
  `widgets/MultimodalDiscordance`, `widgets/NonInvasiveICPDemo`,
  `illustrations/MxAutoregContrast`.

## 4. Batching plan (by risk, smallest/safest first)

- **PR-A (trivial, gated, can be hands-off):** remove the 5 stale unused-disable
  directives. Comment-only; lint confirms the warnings vanish and no exhaustive-deps
  warning resurfaces (the message already says none was reported). Zero behavior risk.
- **PR-B (low-risk UI, gated + a light manual check):** the 6 set-state-in-effect.
  Two routes, owner's preference: (i) the conservative route is a scoped commented
  disable at each (behavior-preserving, documents intent); (ii) the proper route is to
  convert the 4 hydration hooks/components (theme.ts, i18n.ts, ThemeToggle,
  LocalePicker) to `useSyncExternalStore` and tidy useCountUp / LectureTimer. All are
  pure UI; verify by toggling theme and locale, watching a count-up number, and
  letting the lecture timer reach its end. Not clinical.
- **PR-C (infra, its own small PR due to blast radius):** the WidgetEmbed
  static-components fix (memoize the dynamic component). It touches how EVERY widget
  mounts, so keep it isolated and verify that a sample of widgets still lazy-load and
  retain state across a parent re-render.
- **PR-D onward (clinical, author review + manual behavior check, NO test net):** the
  11 immutability + purity findings in the 7 untested clinical widgets. Split small,
  for example by rule or by 2-3 widgets each:
  - D1 immutability animations: CPPTriangle, SDPropagation,
    SpreadingDepolarizationAnimator, aEEGGenerator (hoist/wrap the draw functions;
    confirm redraw + animation unchanged).
  - D2 purity: MxAutoregContrast, MultimodalDiscordance, NonInvasiveICPDemo (confirm
    whether the in-render randomness is intended; if yes, commented disables that
    change no behavior; if no, a deliberate behavior change you sign off on).
  Each D PR is small, reviewed by you, with a before/after behavior check.

Recommended total: about 4 to 5 small PRs (A, B, C, then D split into 1-2). PR-A is
safe enough to run hands-off; everything from PR-B on wants at least a light check,
and PR-D wants your review because the gates cannot see widget physiology.

## 5. Test-coverage gap and how to verify category C

No gate covers widget physiology: typecheck/lint/validate-content/build do not
exercise widget logic, and the 48 unit tests only cover widgets that expose an
`engine.ts`. The widgets with engine tests are AstrupCascade, BrainTempDemo,
CPPoptUCurve, CushingReflexDemo, GCSChart, MarmarouPVCurve, PlateauWaveSimulator,
PupilTrainer, ThermalCBFDemo. NONE of those carry a category-C finding (CPPoptUCurve
only has a comment removal).

CRITICAL GAP: every one of the 7 category-C files has **no engine.ts and no test**:
CPPTriangle, SDPropagation, SpreadingDepolarizationAnimator, aEEGGenerator,
MultimodalDiscordance, NonInvasiveICPDemo, MxAutoregContrast. A behavior change in any
of them is INVISIBLE to the gate suite.

So for category C:
- Prefer behavior-PRESERVING resolutions (a commented disable for intentional purity,
  or hoisting a hoisted declaration for immutability) over behavior-changing
  refactors. A commented disable changes no code path, so the risk is only "is the
  pattern truly intended," which is the author's call.
- For any C fix that is NOT purely behavior-preserving, verify manually before/after:
  build, open the page, exercise the widget (switch aEEG patterns; drag the
  NonInvasiveICPDemo ICP slider and watch the noisy estimates; run the SD / spreading
  depolarization animations; read the CPP/Lassen diagram; view the MxAutoregContrast
  scatter; run the MultimodalDiscordance sim), and confirm the visible behavior and
  the displayed numbers are unchanged.
- BEST, for any C widget that gets a non-trivial change: first extract its compute
  logic into an `engine.ts` and add a vitest test that locks the numbers (matching the
  pattern the tested widgets already use), THEN refactor the component against that
  net. This is the only way to make a behavior change in these widgets safe and
  reviewable rather than invisible.

## Appendix: commands run (read-only)

- `git status -sb`, `git fetch origin main --dry-run`, `git rev-parse HEAD`.
- `npx eslint src --format json`, parsed for `react-hooks/*` and unused-disable.
- `sed -n` windows at each finding to read the offending code.
- `find src -name '*.test.*'` and `find src/components/widgets -name engine.ts`, then
  per-widget coverage checks for the category-C files.
