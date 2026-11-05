# Maritime Portugal – EISAP website

Static website for **EISAP – Shipping Association of Portugal** – **www.maritime.pt**
(replaces the old Jimdo site at portugal-shipowners.com, which will forward to the new domain).

| Phase | Hosting | Editing | Members area |
|---|---|---|---|
| **1 – Launch** | GitHub Pages (free) | Code / Markdown | "Portal on its way" page |
| **2 – CMS** | GitHub Pages | Pages CMS (free) | "Portal on its way" page |
| **3 – Members** | Cloudflare Pages (free) | Pages CMS | Cloudflare Access login (free, ≤50 users) |

Requires Node 22+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output in /dist
```

## Where things are

| What | File / folder |
|---|---|
| News & press | `src/content/news/*.md` |
| Events | `src/content/events/*.md` |
| Board, General Assembly, Fiscal Council | `src/content/board/*.md` |
| Text pages (about, objectives, membership, privacy…) | `src/content/pages/*.md` |
| Contacts, addresses, home figures, member logos, analytics | `src/data/site.json` |
| Design (colours, fonts, layout) | `src/styles/global.css` |
| Old URL → new URL redirects (single source) | `public/_redirects` |
| Custom domain for GitHub Pages | `public/CNAME` |
| Automatic build and publish | `.github/workflows/deploy.yml` |
| Old-domain forwarding site (generator) | `scripts/build-legacy-site.mjs` → `legacy-site/` |
| CMS forms | `.pages.yml` |

Search for `TODO` to find content still to be completed.

---

# PHASE 1 – Launch on GitHub Pages

### A. Preparation
1. **maritime.pt** – confirm you can edit its DNS records (at the .pt registrar / DNS provider). If it already has email (MX) records, keep them.
2. **portugal-shipowners.com** (old domain) – find where it is registered (Jimdo or another registrar) and get the login.
   - If Jimdo is the registrar, request the transfer/auth code **before** cancelling Jimdo. The domain must stay registered so old links and the `@portugal-shipowners.com` mailboxes keep working.
   - Screenshot or export **all its DNS records**, especially **MX, SPF (TXT), DKIM**. They must not change.
3. Create a shared EISAP mailbox for the accounts below (not a personal address).
4. Get board approval of the design.

### B. Content (on your computer)
5. Install Node.js 22 (nodejs.org) and Git, unzip the project, then run `npm install` and `npm run dev`. Open http://localhost:4321.
6. Run `npm run assets:download`. This copies all PDFs and photos off Jimdo into the project and rewrites the links.
7. Complete the `TODO` items:
   - board biographies
   - full press release texts
   - MMW 2023 dates
   - event photos (30–60 per event, ~300 KB each, in `public/uploads/images/`)
   - Vimeo/YouTube links
   - member logos
8. Get **Privacy policy** and **Legal notice** reviewed by your lawyer.

### C. GitHub
9. Create a free GitHub account with the shared mailbox, then an organisation, e.g. `eisap-portugal`.
10. Create a **public** repository `website`. A private repository needs a paid GitHub plan for Pages. The content is public anyway; just never commit confidential files.
11. Push the project:
    ```bash
    git init && git add . && git commit -m "Initial site"
    git branch -M main
    git remote add origin https://github.com/eisap-portugal/website.git
    git push -u origin main
    ```
12. In the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
13. Open the **Actions** tab and wait for the green tick (about 1–2 min). The site is live at `https://eisap-portugal.github.io/website/`.
    - On this preview address CSS and links may look broken, because the site expects to run at the root of a domain. They work once the custom domain is set (steps 14–17).
    - To review before switching DNS, use `npm run build && npm run preview` locally.

### D. Go live on the domain
14. Open **Settings → Pages → Custom domain**, enter `www.maritime.pt` and save. The domain is already in `public/CNAME`.
15. At the DNS provider of **maritime.pt**, **add or change only these records**. Leave any MX/SPF/DKIM records untouched:

    | Type | Name | Value |
    |---|---|---|
    | CNAME | `www` | `eisap-portugal.github.io` |
    | A | `@` | `185.199.108.153` |
    | A | `@` | `185.199.109.153` |
    | A | `@` | `185.199.110.153` |
    | A | `@` | `185.199.111.153` |

    Remove any existing A/CNAME records for `@` and `www` that point elsewhere.
16. Wait for DNS (minutes to 24 h). Then tick **Enforce HTTPS** in Settings → Pages.
17. Recommended: **Settings → Pages → Verify domain**. This adds a TXT record that stops others from claiming the domain on GitHub.
18. Test:
    - site on `https://www.maritime.pt`, and `https://maritime.pt` redirects to www
    - all pages, PDFs and the membership form work
19. Optional statistics (free, cookieless, no banner):
    1. In Cloudflare, go to **Web Analytics → Add a site** and copy the token.
    2. Paste it into `analyticsToken` in `src/data/site.json`.
20. In Google Search Console, add `maritime.pt` and submit `https://www.maritime.pt/sitemap-index.xml`.

### E. Forward the old domain (portugal-shipowners.com → maritime.pt)
GitHub Pages allows one domain per repository, so the old domain gets its own tiny "forwarding" repository. It sends every old link to the matching new page, e.g. `/board/` → `maritime.pt/governance/`, `/press/` → `maritime.pt/news/`, and anything unknown → home.

21. Generate it: `npm run legacy:build`. This creates the `legacy-site/` folder.
22. Create a second **public** repository, e.g. `eisap-portugal/portugal-shipowners-redirect`, and push the **contents** of `legacy-site/` to it:
    ```bash
    cd legacy-site && git init && git add . && git commit -m "Forward to maritime.pt"
    git branch -M main
    git remote add origin https://github.com/eisap-portugal/portugal-shipowners-redirect.git
    git push -u origin main
    ```
23. In that repository, open **Settings → Pages**:
    1. Set the Source to **Deploy from a branch**, `main`, `/ (root)`.
    2. Set the custom domain to `www.portugal-shipowners.com`.
24. In the **portugal-shipowners.com** DNS, change only the `www` CNAME and the four `@` A records (same values as step 15). **Do not touch MX/SPF/DKIM.**
25. Once DNS has updated, tick **Enforce HTTPS**. Test `https://www.portugal-shipowners.com/board/`, which should land on `https://www.maritime.pt/governance/`.
26. Test that **email on @portugal-shipowners.com still sends and receives**.
27. In Google Search Console, verify the old domain too and use **Change of address** → `maritime.pt`. This moves Google's ranking to the new domain.
28. Keep Jimdo for 2–4 weeks as a fallback. Download a final backup, then cancel the website plan, but **keep the domain registered**.

> Email addresses stay `@portugal-shipowners.com` for now. To move to `@maritime.pt` later, set up mail for maritime.pt first, then update the addresses in `src/data/site.json`.

### Updating the site in Phase 1
Edit the Markdown files, then run `git commit` and `git push`. GitHub rebuilds and publishes in about 1–2 min.

---

# PHASE 2 – Add the CMS (still on GitHub Pages)

29. Go to https://app.pagescms.org, sign in with GitHub and install the **Pages CMS** app on the `website` repository.
30. Open the repository. The forms for News, Events, Board, Pages, Members documents and Site settings are already defined in `.pages.yml`.
31. Under **Settings → Collaborators**, invite editors by email. They don't need GitHub knowledge.
32. Test: edit a news item and save. Check the Actions tab, and the change should be live in about 1–2 min.
33. Write a 1-page editor guide (add news, add event, upload presentation, edit board).
34. Make sure **at least 2 admins** exist on GitHub and Pages CMS.

---

# PHASE 3 – Members area (move to Cloudflare)

Only needed when the members area goes live. It takes about half a day, with no code changes to the public site.

35. Create a free Cloudflare account and **add maritime.pt** (free plan).
    1. Check that **all DNS records were imported**, especially MX/SPF/DKIM.
    2. Switch the nameservers at the registrar to Cloudflare's.
36. Go to **Workers & Pages → Create → Pages → Connect to Git** and select the same repository.
    - Preset: **Astro**
    - Build: `npm run build`
    - Output: `dist`
    - Env `NODE_VERSION=22`
37. Under **Custom domains**, add `www.maritime.pt` and `maritime.pt`. Cloudflare updates the DNS records itself. The old-domain forwarding repository can stay on GitHub Pages.
38. In GitHub, go to **Settings → Pages**, remove the custom domain, and disable or delete `.github/workflows/deploy.yml` and `public/CNAME`.
    - Redirects then become real 301s automatically via `public/_redirects`.
39. Make the GitHub repository **private** (no longer needed public). Pages CMS keeps working.
40. Go to **Zero Trust → Access → Applications → Add → Self-hosted**.
    1. Domain `www.maritime.pt`, path `members`. Add a second destination for `<project>.pages.dev`, path `members`.
    2. Policy **Allow**: emails of members, or "emails ending in" member company domains.
    3. Login method: **One-time PIN**.
41. Test in a private browser window: `/members/` must ask for an email code.
42. Replace `src/pages/members/index.astro` with the document library. It lists the `documents` collection; files go in `public/members/files/`.
43. Update the Privacy and Cookie policy (Access login cookie `CF_Authorization`).
44. Upload the first documents via Pages CMS, under **Members area – documents**.

Adding or removing a member means editing the email list in the Access policy.

---

## Notes
- **Membership form:** opens the visitor's email program, pre-filled. To receive submissions directly, set `membership.formUrl` in `site.json` to a form service endpoint (e.g. Formspree or Tally).
- **Portuguese version later:** Astro i18n (`/pt/…`).
- **More than 50 members, self sign-up or fee payments:** add Payload CMS for the members part only.
