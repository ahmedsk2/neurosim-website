# MNM-Edu Website Expansion Task Package

This folder is a self-contained task package for **Claude Code** (or any agent) to expand the rest of the MNM-Edu website to match the depth and quality of `src/content/modalities/tcd.mdx` (the reference exemplar).

## What is this for?

The TCD modality page was rewritten earlier as a worked example: from ~196 lines to ~581 lines, restructured as a teaching narrative with bedside vignettes, age-banded normative tables, BP/CPP management section, nine clinical contexts, multimodal integration matrix, recent-literature roundup, and a self-check quiz. The aim of this package is to replicate that quality across the rest of the site.

## Read these first, in order

1. **`00-style-guide.md`** : non-negotiable formatting rules (no em-dashes, no SpeakerNote component, MDX component reference, frontmatter conventions, citation policy).
2. **`05-references-to-add.md`** : new peer-reviewed citations to append to `src/data/references.ts`. Add these before writing the prose that uses them.
3. **`06-figures-to-create.md`** : list of placeholder SVGs to create in `public/images/<modality>/`. Same approach as the TCD figures.

Then pick a section:

4. **`01-foundations.md`** : 9 foundation chapter briefs.
5. **`02-modalities-tier1.md`** : 7 highest-impact modality pages (heavy expansion).
6. **`03-modalities-tier2.md`** : remaining 19 modality pages (medium expansion).
7. **`04-integration-scenarios.md`** : 18 worked clinical integration scenarios.

## Tier definitions (updated 2026-05-17)

| Tier | Expansion | Target length | Applies to |
|---|---|---|---|
| **1 (heavy)** | Full TCD-style rewrite. Three vignettes, age-banded tables, BP / CPP / management section, 8+ clinical contexts, MMM integration matrix, recent literature, 3-question Quiz. | ~3x existing length, ~500-600 lines. | **All 26 modality pages** AND **all 18 integration scenarios.** |
| **2 (medium)** | One vignette, expanded primer, pattern library refresh, MMM pairings, recent literature, 3-question Quiz. | ~2x existing length, ~300-400 lines. | **All 9 foundation chapters.** |
| **3 (light)** | Style polish only. | Existing length. | Glossary, evidence index, search / about / roadmap. |

The integration scenarios use an adapted Tier 1 spine (case-narrative format). See `04-integration-scenarios.md` for the case-narrative variant.

## Reference exemplar

The TCD page (`src/content/modalities/tcd.mdx`) is the gold-standard structure. When you are uncertain how to organise a Tier 1 page, mirror its 17-section spine:

1. Frontmatter (title, description, eyebrow, short, domain, labels, evidenceGrade, lastReviewed)
2. Acronyms callout
3. TldrCard (60-second version)
4. Bedside vignettes (3 cases)
5. What it is and is not
6. Anatomy / placement / windows (with Figure)
7. The waveform or signal (with Figure)
8. The numbers to record
9. What is normal (with age-banded table for pediatric pages)
10. What is abnormal (pattern library, with Figure)
11. Try-it widgets
12. BP/CPP/management section
13. Clinical contexts (8-10 sub-sections)
14. Multimodal integration matrix
15. Deep Dive: setup and technique
16. Pitfalls
17. Combine-with cross-links
18. Deep Dive: evidence summary + recent literature
19. Self-check Quiz (3 questions)

For Tier 2 foundation pages, condense to a subset: vignette + what-it-is + numbers + pattern library + 3-4 clinical contexts + pitfalls + quiz. See `01-foundations.md` for the foundation-specific spine.

## Execution order recommendation

```
# Once at the start
1. Add all new references from 05-references-to-add.md to src/data/references.ts.
2. Create all placeholder SVGs listed in 06-figures-to-create.md under public/images/<modality>/.

# Per page
3. Read the existing MDX.
4. Read the brief in 01..04-*.md.
5. Rewrite the MDX following the brief and the style guide.
6. Run `npm run typecheck` after each batch of 3-5 pages.
7. Run `npm run build` after each section is complete.
```

## Hard rules (from style guide, repeated here for emphasis)

1. **No em-dashes (`—`, U+2014)**. Use colons, commas, semicolons, parentheses, or periods. Even in frontmatter, captions, and Mermaid diagrams.
2. **No `<SpeakerNote>` component anywhere**. The component still exists for legacy reasons but is being phased out of the content. If a "for the lecturer" aside is unavoidable, fold it into a `Pearl` or `RealWorld` callout instead.
3. **Pediatric-first audience tilt**. Lead with PICU framing. Adult data only when it provides essential contrast or when pediatric data is sparse (flag with `<EvidenceLevel grade="sparse" />`).
4. **Use only MDX components that exist** in `src/components/content/components.tsx`. New components require an engineering task, not an authoring one.
5. **Every Tier 1 page ends with a 3-question Quiz** following the schema in `00-style-guide.md`.

## Verification checklist after each page

- [ ] No em-dashes anywhere (run `grep -c "—" <file>` and expect 0).
- [ ] No `<SpeakerNote>` blocks.
- [ ] All `<Cite id="...">` keys resolve in `src/data/references.ts`.
- [ ] All `<Figure src="...">` paths point to files that exist.
- [ ] All `<WidgetEmbed name="...">` names exist as components.
- [ ] `lastReviewed` frontmatter date is updated.
- [ ] `npm run typecheck` passes.

## Scope summary

| Category | Files | Tier | Spine | Status |
|---|---|---|---|---|
| Foundations | 9 | 2 | Foundation 12-section | Pending |
| Modalities, group A (canonical 7) | 7 | 1 | TCD 18-section | Pending (briefs in `02-modalities-tier1.md`) |
| Modalities, group B (remaining 19) | 19 | 1 | TCD 18-section | Pending (briefs in `03-modalities-tier2.md`, now upgraded to Tier 1) |
| Integration scenarios | 18 | 1 | Integration-narrative spine | Pending (briefs in `04-integration-scenarios.md`, now upgraded to Tier 1) |
| **Total** | **53** | | | |

`src/content/modalities/tcd.mdx` is already complete (Tier 1, reference exemplar). Do not rewrite it.

**Naming note**: file names `02-modalities-tier1.md` and `03-modalities-tier2.md` are historical. As of the 2026-05-17 update, all modalities in both files are Tier 1. Group A and Group B differ only in the **order Claude Code should execute** (Group A first because they are most central; Group B can follow in any order).
