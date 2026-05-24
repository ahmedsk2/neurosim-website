# Style Guide for MNM-Edu Content Expansion

Read this once. The hard rules at the top are non-negotiable.

## Hard rules

### 1. No em-dashes

The character `—` (U+2014, em-dash) is forbidden in all new content. Replace with:

| Original em-dash use | Replacement |
|---|---|
| Setting off a parenthetical phrase | comma `,` or parentheses `()` |
| Introducing a definition or explanation | colon `:` |
| Joining two related independent clauses | semicolon `;` |
| Strong break at end of sentence | period `.` |
| Visual bullet in legends/figures | middle dot `·` or hyphen `-` |
| "No value" placeholder in widget readouts | hyphen `-` |

En-dashes (`–`, U+2013) are fine for numeric ranges (`5–10 mm`, `12–18 years`) and remain everywhere they currently appear.

**Examples:**

- ❌ `CPP = MAP − ICP. Same number, two paths, the path matters.`
- ✅ `CPP = MAP − ICP. Same number, two paths; the path matters.`

- ❌ `## 2. What TCD is — and what it is not`
- ✅ `## 2. What TCD is, and what it is not`

### 2. No `<SpeakerNote>` blocks

Do not insert `<SpeakerNote>` anywhere in new content. The component still exists in the codebase but is being phased out. If you have a "for the lecturer" aside, fold it into the surrounding prose, or use `<Pearl>` (high-yield take-home) or `<RealWorld>` (clinical anecdote / context).

### 3. Pediatric-first audience tilt

The site's primary readership is PICU fellows, pediatric intensivists, neurosurgery/neurology trainees, and allied bedside clinicians. Lead every page with the PICU framing. Use adult data only when:

- Pediatric data is sparse or absent (flag with `<EvidenceLevel grade="sparse" />`)
- Adult studies are the canonical reference (e.g., STOP trial is pediatric; AHA/ASA SAH guidelines are adult)
- An adult-versus-pediatric contrast is itself the point

Wrap any pediatric-specific guidance in a `<Pediatric>` callout.

### 4. Use only existing MDX components

Available in `src/components/content/components.tsx`. New components require a separate engineering task. The currently usable set:

**Content callouts:**
- `<Pearl>` : high-yield clinical pearl. Maps to `Callout type="clinical-pearl"`.
- `<Pitfall>` : common mistake. Maps to `Callout type="caveat"`.
- `<Pediatric>` : pediatric-specific. Maps to `Callout type="pediatric-note"`.
- `<Tutorial>` : step-by-step teaching block.
- `<Controversy>` : actively debated topic.
- `<RealWorld>` : clinical anecdote / why-care framing.
- `<Callout type="reference">` : page-top acronym list.
- `<TldrCard>` : 60-second summary. Children only, no `title` prop.
- `<AlgorithmDisclaimer />` : standalone disclaimer for any teaching algorithm. Self-closing, no children.

**Citation and definition:**
- `<Cite id="key" />` : inline citation chip.
- `<Definition term="ICP">ICP</Definition>` : glossary hover-card.
- `<EvidenceLevel grade="A|B|C|expert|sparse" />` : evidence grade badge.

**Structure:**
- `<Essentials>...</Essentials>` and `<DeepDive>...</DeepDive>` : detail-level wrappers.
- `<Detail level="...">` : per-paragraph detail gating.
- `<Figure src="..." alt="..." caption="..." attribution="..." label="Fig. N" />` : self-closing figure with external image.
- `<Figure caption="..." label="Fig. N"><MyComponent /></Figure>` : figure wrapping an existing component.
- `<WidgetEmbed name="MyWidget" />` : embed an interactive widget by component name.
- `<Quiz questions={[...]} />` : end-of-page quiz (see schema below).
- ` ```mermaid ` : Mermaid diagram fence.

**Do not use** any component name not in the list above. Specifically: no `<TLDR>`, no `<Insight>`, no `<Note>`, no `<Aside>`, no `<KeyTakeaway>`.

### 5. Frontmatter schema

Every page must include:

```yaml
---
title: <Human-readable title>
description: <One-line description, no em-dashes>
eyebrow: <e.g. "Modality 9 · Non-invasive" or "Foundation 3">
short: <Acronym or short form for nav>
domain: <category, e.g. "non-invasive">
labels:
  usage: <bedside | research | both>
  population: <pediatric | adult | both>
  invasiveness: <non-invasive | minimally-invasive | invasive>
  validation: <validated | validated-adult-only | emerging | investigational>
evidenceGrade: <A | B | C | expert | sparse>
lastReviewed: <YYYY-MM-DD, today's date when you commit>
---
```

For foundations, replace `labels` with:

```yaml
prereqs: [<list of foundation slugs>]
relatedModalities: [<list of modality slugs>]
```

For integration scenarios:

```yaml
modalities: [<list of modality slugs>]
```

## Page architecture

### Tier 1 spine (heavy expansion)

Mirror the TCD page exactly. The numbered sections, in order:

1. Acronyms callout (page-top reference).
2. TldrCard (60-second version).
3. Bedside vignettes (3 short cases anchoring the rest of the page).
4. What X is, and what it is not (primer + Doppler-equation-style fundamentals).
5. Anatomy / placement (with `<Figure>`).
6. The signal / waveform / measurement (with `<Figure>`).
7. The numbers to record (six-pack table).
8. What is normal? (Age-banded reference table for pediatric pages).
9. What is abnormal? (Pattern library with `<Figure>` showing side-by-side examples).
10. Try it (existing widgets).
11. Management section (BP / CPP / ICP titration where relevant; otherwise condition-specific management).
12. Clinical contexts (8-10 subsections: SAH, severe TBI, AIS, HIE, ECMO, meningitis, brain death, DKA, sickle cell).
13. Multimodal integration matrix.
14. Setup and technique (Deep Dive).
15. Pitfalls.
16. Combine with… cross-links.
17. Evidence summary + recent literature (Deep Dive).
18. Self-check Quiz.

### Tier 2 spine (medium expansion)

Condense to:

1. Acronyms callout.
2. TldrCard.
3. One bedside vignette.
4. What X is (primer).
5. The signal / measurement.
6. Normal vs abnormal (one table, not split).
7. Try it (widgets).
8. Clinical contexts (3-4 most relevant subsections).
9. Pitfalls.
10. Combine with… cross-links.
11. Evidence summary.
12. Self-check Quiz.

## Quiz schema

The `<Quiz>` component expects this exact shape. Use it.

```mdx
<Quiz
  questions={[
    {
      id: 'q1',
      prompt: 'Case stem ending with a question?',
      options: [
        { id: 'a', label: 'First option' },
        { id: 'b', label: 'Second option' },
        { id: 'c', label: 'Third option' },
        { id: 'd', label: 'Fourth option' },
      ],
      answer: 'c',
      explanation: 'Why the right answer is right and the others are wrong.',
    },
    { id: 'q2', prompt: '...', options: [...], answer: '...', explanation: '...' },
    { id: 'q3', prompt: '...', options: [...], answer: '...', explanation: '...' },
  ]}
/>
```

Always three questions for Tier 1. Always case-style stems with clinical numbers, not "which of the following is true".

## Citation policy

- Use `<Cite id="key" />` with a key that exists in `src/data/references.ts`.
- Add new references to `references.ts` in alphabetical-by-key order or at the end with a comment block. See `05-references-to-add.md` for the curated list.
- Multiple citations stack with spaces: `<Cite id="a" /> <Cite id="b" />`.
- Cite once where a claim is first made on a page; do not over-cite.
- Every Tier 1 page should include 15-30 citations. Tier 2 pages: 8-15.

## Figure policy

- Use `<Figure src="/images/<page>/<slug>.svg" ... />` for placeholders. See `06-figures-to-create.md`.
- Provide a thorough `caption` describing exactly what the finished figure should show. The placeholder SVG is functional but minimal; the caption is the brief for the eventual polished version.
- `attribution` should read `"MNM-Edu, original schematic. SVG placeholder."` for new figures.
- `label` follows `"Fig. N"` numbering within the page.

## Mermaid policy

Decision trees should be Mermaid `flowchart TD`. Keep node labels short (under 6 words). Avoid em-dashes inside Mermaid nodes (the parser handles them but the style rule applies everywhere). For escaped characters inside Mermaid: `&lt;`, `&gt;`, `&ge;`, `&le;`.

## Voice and tone

- **Bedside-first**: every concept lands at the bedside before it generalises.
- **Specific over abstract**: prefer "a 5-year-old SAH day 6, MFV 180, LR 4.3" over "in a child with vasospasm".
- **Numbered ladders**: when explaining management, use numbered steps.
- **No marketing language**: avoid "powerful", "robust", "comprehensive". Be plain.
- **No hedging without cause**: if the evidence is strong, say so; if weak, say so explicitly with `<EvidenceLevel grade="sparse" />`.
- **British/American mix is fine** (the existing content uses both haemorrhage/hemorrhage interchangeably; match what's around you in the file).

## Common errors to avoid

| Error | Fix |
|---|---|
| Using `<TLDR>` instead of `<TldrCard>` | Use exact component name. |
| `<TldrCard title="...">` | TldrCard takes no `title` prop; put the title in the children. |
| `<AlgorithmDisclaimer>content</AlgorithmDisclaimer>` | It is self-closing, takes no children. Put the warning in a `<Callout type="caveat">` next to it. |
| `<Callout type="warning">` | Not a valid type. Use `caveat`. |
| `<Callout type="pearl">` | Use `clinical-pearl`. |
| Quiz with `q/a/correct/explain` keys | The schema is `id/prompt/options/answer/explanation`. |
| Em-dash in frontmatter description | Replace with comma. |
| Em-dash inside Mermaid diagram nodes | Replace with comma or semicolon. |
| New figure component (e.g., `<MyNewFig />`) | Use `<Figure src="...">` with placeholder image instead. |
