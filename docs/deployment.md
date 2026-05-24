# Deployment

The site is a fully static Next.js export, `npm run build` produces a self-contained `out/` directory that can be served from any static host.

## Quick paths

### Cloudflare Pages

1. Push the repo to GitHub.
2. In Cloudflare Pages, create a new project pointing at the repo.
3. Build command: `npm run build`. Output directory: `out`.
4. Custom domain via DNS settings.

### GitHub Pages

1. `npm run build`.
2. Push `out/` to `gh-pages` branch.
3. Enable Pages on `gh-pages` in repo settings.

### Vercel

1. Import the repo.
2. Vercel auto-detects Next.js. Override build command if needed: `npm run build`.
3. Output directory: `out`.

### Static directory on existing webserver

```
npm run build
rsync -av out/ user@host:/var/www/mnm-edu/
```

Configure your reverse proxy (nginx / Caddy) to serve `index.html` for unknown paths under each route.

## Search index

Built at static export time by `app/search/page.tsx` calling `writeSearchIndexJSON()`. The output is `public/search-index.json` and is included in the export bundle.

## Post-deployment checks

- Open `/` and the home page renders.
- Open `/foundations/autoregulation/` and the chapter renders with both detail levels (toggle in the header).
- Open `/modalities/cppopt/` and the CPPopt widget runs.
- Open `/search/` and the search box returns results.
- Verify print stylesheet by opening browser print preview on a modality page.

## Versioning the evidence base

`src/data/references.ts` is a versioned artifact. When you update a recent-literature section in any modality, bump a version constant and stamp it in the `lastReviewed:` frontmatter of that modality.
