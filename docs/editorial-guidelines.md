# Editorial Guidelines

## Tone

- Bedside-first. Open with a vignette or a screenshot.
- Concrete > abstract. Numbers > qualitative descriptors when possible.
- Honest about uncertainty. Pediatric MNM evidence is mostly grade C or expert. Use `<EvidenceLevel grade="C" />` and `<EvidenceLevel grade="sparse" />` chips.
- Pediatric-specific by default. Every page has an "In children" section with at least one pediatric-specific note.

## Detail levels

- **Essentials** is default. Bedside-clinical, plain English. Aim for 1500–2500 words across the page.
- **Deep Dive** adds math, controversies, and full reference lists. 3000–5000 words across the page.
- Don't duplicate prose verbatim. Deep Dive *adds*, not *restates*.
- Common opening / closing prose stays outside both blocks.

## Citations

- Every quantitative claim has a `<Cite id="..."/>` chip.
- Citation keys are kebab-case `firstauthor + year`, e.g., `czosnyka1997`.
- Add new references to `src/data/references.ts` with full bibliographic data, DOI, and an `evidence_grade` if known.

## Widgets

- Each widget has its own folder under `src/components/widgets/`.
- Math lives in `engine.ts` as pure functions; React component does presentation only.
- Add a unit test in `__tests__/engine.test.ts` for any non-trivial math.
- Update `src/components/content/WidgetEmbed.tsx`'s registry when adding a new widget.

## Authoring checklist for a new modality

1. Add to `src/data/modalities.ts`.
2. Create `src/content/modalities/<slug>.mdx`.
3. Frontmatter: title, description, eyebrow, short, domain, evidenceGrade, lastReviewed.
4. 12 sections: bedside view, what it measures, physiology, widget, reading the trace, setup, pitfalls, in children, combine with, evidence summary, recent literature, references (auto).
5. At least 8 `<Cite>` references; "In children" section is mandatory.
6. Cross-link related modalities and integration scenarios.
