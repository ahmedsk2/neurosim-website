# MNM-Edu, Pediatric Multimodal Neuromonitoring

Interactive, evidence-anchored educational website for pediatric multimodal neuromonitoring (MNM). Built for PICU fellows, intensivists, neurosurgery/neurology trainees, and allied bedside clinicians. Standalone, no dependence on any external simulator.

> **📐 Technical review board / AI agents start here:** [`docs/ENGINEERING_OVERVIEW.md`](docs/ENGINEERING_OVERVIEW.md)
> is the canonical, current reference for the whole system (architecture, UI/UX, content model, data,
> widgets, build, accessibility, and the validation path to production). The counts in this README and
> in `DEPLOYMENT_NOTES.md` are from an earlier build and are superseded by that overview.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS + CSS custom properties for design tokens
- MDX 3 content under `src/content/` with `gray-matter` frontmatter
- KaTeX (math), Mermaid (diagrams), Recharts + Canvas (interactive widgets)
- Static export (`output: 'export'`), deployable to any static host
- Fuse.js search built at compile time

## Dev quickstart

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Adding content

### A modality
1. Add an entry to `src/data/modalities.ts`.
2. Create `src/content/modalities/<slug>.mdx` following the 12-section template (`docs/adding-a-modality.md`).
3. Add references to `src/data/references.ts` if not already present.
4. Embed the modality's interactive widget via `<WidgetEmbed name="..." />`.

### A foundation chapter
1. Create `src/content/foundations/<slug>.mdx`.
2. Frontmatter: `title`, `description`, `eyebrow`, `prereqs`, `relatedModalities`, `evidenceGrade`, `lastReviewed`.
3. Open with the bedside framing; close with a 3-question `<Quiz>`.

### A widget
1. `src/components/widgets/<Name>/` with `index.tsx`, `engine.ts`, `canvas.ts`, `types.ts`, `README.md`, `__tests__/engine.test.ts`.
2. Math lives in `engine.ts` as pure, testable functions.
3. The React shell follows the CPPopt template, header, controls, two-column main, tutorial pane.
4. Add unit tests in `__tests__/engine.test.ts`.
5. See `docs/adding-a-widget.md`.

### A reference
Append to `src/data/references.ts` with a stable citation key. Keys are kebab-case author+year, e.g. `czosnyka1997`.

## Detail-level authoring

Every page has Essentials (default) and Deep Dive content. Wrap content with:

```mdx
<Essentials>Bedside-clinical, plain English. ~1500–2500 words across the page.</Essentials>
<DeepDive>Mechanistic, math, controversies. ~3000–5000 words across the page.</DeepDive>
```

See `docs/detail-level-authoring.md`.

## Citations

Inline:
```mdx
PRx is the most established autoregulation index. <Cite id="czosnyka1997" />
```

The chip auto-numbers per page and opens a side-sheet with the full reference.

## Deployment

Static export → drop the `out/` directory on any static host (Cloudflare Pages, GitHub Pages, Vercel, S3+CloudFront, or a directory on an existing webserver).

## License

Educational content under CC BY-SA 4.0 unless otherwise noted. Code under MIT.
