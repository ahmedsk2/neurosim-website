# Detail-level authoring

Two reading modes, switchable at any time, persisted across sessions.

- **Essentials** is the default. Bedside-clinical, plain English, short paragraphs.
- **Deep dive** adds the math, the controversies, and the full reference list.

## How to author

```mdx
PRx is the most established autoregulation index at the bedside.

<Essentials>
A negative PRx means the brain is pushing back against blood-pressure swings, autoregulation is working. <Cite id="czosnyka1997" />
</Essentials>

<DeepDive>
PRx is the moving Pearson correlation between 30 consecutive 10-second epoch averages of arterial blood pressure and intracranial pressure...

```math
\mathrm{PRx} = r(\overline{\mathrm{ABP}}_{1..30}, \overline{\mathrm{ICP}}_{1..30})
```

The 0.25 outcome threshold derives from the original Cambridge series. <Cite id="sorrentino2012" />
</DeepDive>
```

## Rules

1. **Write Essentials first**, then expand into Deep Dive.
2. **Don't restate**. Deep Dive *adds* depth, the common opening sentence stays outside both blocks.
3. **Math always lives in Deep Dive** unless it's a single threshold value.
4. **Quizzes** stay outside both blocks (visible in both modes).
5. **References** are auto-collected from all `<Cite>` uses, regardless of which block they appear in.
6. **Both modes are searchable**, search indexes the union of both.

## Widget integration

Widgets read `useDetailLevel()` to adjust visible controls and tutorial pane content. Default: Essentials view shows the canonical workflow; Deep Dive unlocks expert / debug controls.
