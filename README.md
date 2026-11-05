# Maritime Portugal – EISAP website

Website of **EISAP – Shipping Association of Portugal**: https://www.maritime.pt

Built with [Astro](https://astro.build), hosted on GitHub Pages, edited through [Pages CMS](https://pagescms.org). Pushing to `main` rebuilds and publishes the site automatically.

## Run locally

Requires Node 22+.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in /dist
```

## Where things are

| What | Location |
|---|---|
| Home page texts | `src/data/home.json` |
| Contacts, figures, member logos, analytics | `src/data/site.json` |
| News, events, board, text pages | `src/content/` |
| Design | `src/styles/global.css` |
| Redirects | `public/_redirects` |
| CMS forms | `.pages.yml` |
| Build and publish | `.github/workflows/deploy.yml` |
