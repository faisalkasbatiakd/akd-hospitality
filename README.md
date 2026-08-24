# AKD Hospitality Limited — corporate website

Corporate website for **AKD Hospitality Limited** (Pakistan Stock Exchange: `AKDHL`),
incorporated 1936, with a mandate across hospitality, motels and tourism.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui

---

## Running it

```bash
npm install
npm run dev
```

Then copy `.env.example` to `.env.local` and fill it in. Every variable is
documented in that file; none of them are secret.

```bash
npm run build      # production build
npx tsc --noEmit   # type check
npx eslint src     # lint
```

## Pages

| Route | What it carries |
| --- | --- |
| `/` | Hero, overview, milestones, investor panel |
| `/about` | History, vision and mission, ESG framework, Chairperson's review |
| `/governance` | Board, officers, four committees, risk diagrams, shareholding documents |
| `/investors` | FY2025 snapshot, six-year record, shareholding pattern, 73 filings |
| `/media` | Latest AGM and corporate briefing, 2021 corporate actions, meeting record, shareholder services, 23 filings |
| `/contact` | Enquiry routing, company details, map, contact form |
| `/terms-of-use`, `/disclaimer` | Legal, with in-page contents and per-clause anchors |
| `/sitemap` | Human-readable site index |

Plus `not-found.tsx`, `error.tsx`, `robots.ts`, `sitemap.ts` and a generated
Open Graph image.

## How content is handled

Everything published on this site is taken from the Company's own filings and
cited to a page. Two rules held throughout:

**Nothing is invented.** There is no corporate values list, because the Company
publishes none — the real four-pillar ESG framework is used instead. There is no
careers section, because the FY2025 annual report records four employees and no
vacancies. Named directors have initials avatars, not stock portraits: putting a
stranger's face beside a real person's name misrepresents them.

**Financial figures appear in one place only.** They live on `/investors`, under
the auditor's Material Uncertainty Relating to Going Concern notice. Showing a
profit and a rising asset base without that context would misrepresent the
Company's position, so the notice is published above the numbers, not after them.

Data files carry their sources in comments — see `src/data/financials.ts`,
`src/data/governance.ts` and `src/data/media-notices.ts`.

## The document archive

`public/documents/` holds the Company's full published archive: **110 filings,
145.9 MB**, compressed from 293.8 MB with no document lost and every page count
verified. Text-bearing PDFs keep their text layer; only scans were re-rendered.

These are served with immutable cache headers (see `next.config.ts`) because a
filed notice never changes — a revision arrives as a new file with a new name.

If the static payload ever needs to move off the deployment, set
`NEXT_PUBLIC_DOCS_BASE_URL` to blob or object storage. No code changes needed.

## Deploying

Runs on Railway: a `web` service built from this repo, a managed Postgres, and a
volume.

Pushing to `main` deploys, through `.github/workflows/deploy.yml` rather than
Railway's own GitHub integration. That integration cannot be used here: the
Railway account owning the project has no GitHub App access to this repository,
so pushes never reach Railway and deploys would have to be started by hand. The
workflow type-checks, lints, then runs `railway up`.

It needs one secret. Create a token in the Railway dashboard under **Settings ->
Tokens**, scoped to the production environment, then:

```bash
gh secret set RAILWAY_TOKEN
```

Paste it at the prompt — never into a file or a commit. Until that is set, every
push fails immediately with a message saying so, which is deliberate: a deploy
that silently does nothing is worse than one that goes red.

If Railway's GitHub App access is ever granted, delete the workflow. Railway's
own integration is simpler, and running both deploys every commit twice.

**First deploy of a new environment**, in this order:

1. Create the Postgres service and reference it: `DATABASE_URL=${{ Postgres.DATABASE_URL }}`.
   The internal hostname is correct — the build does not touch the database.
2. Mount a volume at **`/app/storage`**. Without it, every deploy discards the
   director photographs and any PDF added through the dashboard: a container
   filesystem does not survive a restart.
3. Set `AUTH_SECRET` (fresh per environment), `RESEND_API_KEY`, `CONTACT_TO` and
   `NEXT_PUBLIC_SITE_URL`.
4. Set the pre-deploy command to `npx drizzle-kit migrate` and the health check
   path to `/api/health`. The check queries the database, so traffic is not
   routed to a server that cannot reach its content.
5. Seed and create the login, pointing at the database through a TCP proxy:

   ```
   ENV_FILE=prod.env npm run db:seed
   ENV_FILE=prod.env npm run db:admin -- --email you@example.com --name "..." --password "..."
   ```

6. **Redeploy.** Seeding a database the app has already served from leaves the
   cached reads holding the empty results from before the seed, and pages render
   blank until the process restarts. A redeploy clears them.

Steps 5 and 6 are once per environment. After that, `git push` is the whole
deploy: migrations run before the new version starts, and content changes come
from the dashboard rather than a release.

## Other deployment notes

**Search indexing** is switched off on anything that is not the live site, via
`NEXT_PUBLIC_NOINDEX=true`. It is set on the Railway host, because
`akdhospitality.com` still serves the previous website: two hosts carrying these
same pages would compete for the same queries. The flag emits three signals -
`noindex` on the pages, an `X-Robots-Tag` header on every response (the only way
to cover the 110 PDFs, which cannot carry a meta tag), and a `robots.txt` that
stops advertising the sitemap. Crawling stays allowed on purpose: a blocked
crawler never reads the `noindex`.

It is read at **build time**, so changing it needs a redeploy.

> **Remove this flag the moment the client points `akdhospitality.com` here.**
> Left in place, the launched site stays invisible to search.

**Canonical host** is `https://akdhospitality.com` — apex, no `www`. It is
derived from one value in `src/lib/site.ts` and feeds every canonical link,
Open Graph URL, sitemap entry and robots directive.

Point `www.akdhospitality.com` at a **301 redirect to the apex**. Letting both
hosts resolve splits ranking signals between two URLs for the same pages.

**Legacy URLs.** `next.config.ts` redirects the old ASP.NET paths. This matters:
`http://akdhospitality.com/Investors.aspx` is printed inside four filings,
including the FY2025 Notice of Annual General Meeting that went to every
shareholder on the register. Those visitors must not land on a 404.

**Contact form.** Enquiries post to `/api/contact`, which sends the mail through
Resend. Set `RESEND_API_KEY` to deliver them to `info@akdhospitality.com`.
Without it the form still renders and validates, but submitting shows the
Company's address instead — it never silently drops a message.

The key is a secret and stays server side, which is why this is a route rather
than a direct browser call.

**Before the domain is verified**, Resend's sandbox sender delivers only to the
address that owns the Resend account — anything else returns 403. So
`info@akdhospitality.com` is not reachable yet, and `CONTACT_TO` has to name the
account owner in the meantime. Once `akdhospitality.com` is verified at
resend.com/domains, set `CONTACT_FROM` to an address on that domain and
`CONTACT_TO` to the real inbox; both have to change together.

## Security

**Sign-in.** One admin account, no self-registration, no password reset by
email. The endpoint is `POST /api/admin/session`.

- **SQL injection is not reachable.** Every query goes through Drizzle, which
  binds values as parameters rather than splicing them into SQL, and the request
  body is validated by Zod before it gets that far — a payload like
  `' OR '1'='1` is refused with a 400 and never touches the database. Verified
  both ways: eight injection payloads against the live endpoint, and the same
  payloads passed as bound parameters directly, returning zero rows with all 23
  tables intact.
- **Addresses cannot be enumerated.** An unknown email and a wrong password give
  the same 401, and the bcrypt comparison runs either way against a dummy hash,
  so neither returns measurably faster (measured: 251 ms vs 249 ms).
- **Guessing is rate limited.** Ten failed attempts per fifteen minutes, counted
  per address and per account, then 429 with `Retry-After`. A correct password
  clears both counters. Lockouts are written to `audit_log`; the attempted
  password never is. The counters are per-process — see `src/lib/rate-limit.ts`
  for what that means if this is ever scaled past one instance.
- **Sessions** are a signed JWT (HS256, `jose`) in an httpOnly cookie, `sameSite:
  lax`, `secure` in production, eight-hour lifetime. Forged and unsigned
  (`alg: none`) tokens are rejected. `AUTH_SECRET` never reaches the client
  bundle and no token is logged.
- **Every server action re-checks the session itself.** All 32 of them call
  `requireSession()`; `src/proxy.ts` guards navigation, which is not the same
  thing and is not relied on.

**Headers** are set in `next.config.ts`: `nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, and a
`Permissions-Policy` denying camera, microphone and location.

`/admin/*` additionally carries `X-Robots-Tag: noindex` and `Cache-Control:
no-store` on **every** deployment, including the live one. This is separate from
the `NEXT_PUBLIC_NOINDEX` flag, which gets lifted at launch: the sign-in page is
linked from the footer, so without it the dashboard login would be crawlable on
the real domain.

`Strict-Transport-Security` is deliberately **not** set yet. It is per host, and
the cutover to `akdhospitality.com` is the client's to make against an old site
that is HTTP-only on both the apex and `www`. If that cutover were rolled back,
visitors already pinned to HTTPS could not reach the old site at all. Add it once
the domain has settled here.

## Backups

Three layers, and they cover different failures:

| Layer | Set up where | Survives |
| --- | --- | --- |
| Volume backups | Railway → Postgres → **Backups** tab | a bad deploy or a data mistake |
| Point-in-time recovery | same tab, **Enable PITR** | a bad migration, to the minute |
| `npm run db:backup` | this repo | losing the project itself |

**PITR is enabled** (`railway postgres pitr enable`), bucket wired and verified —
its recovery window only starts when switched on, so it was turned on
immediately rather than at launch.

**Volume backup schedules are not set yet.** They need the dashboard: each
volume's **Backups** tab, daily and weekly, on both `postgres-volume` and
`web-volume`. The API refuses it (`NotAuthorized`). Do not skip `web-volume` —
it holds the director photographs and any PDF uploaded through the dashboard.

The third is the one that matters most here, because this project has already
been deleted and rebuilt once, and a volume's backups die with the volume:

```bash
ENV_FILE=prod.env npm run db:backup
```

Writes a `pg_dump` custom-format file to `backups/` (gitignored). Keep a copy off
Railway. Drill the restore into a scratch database rather than trusting it — the
commands are in the header of `scripts/backup.mjs`. Last drilled against
production successfully: 23 tables, 110 documents, 7 directors, restored in under
a second.

## Known gaps

- Imagery is from Unsplash. The client has seen it and is keeping it, intending
  to swap it through the dashboard. All of it is landscape or architectural on
  purpose: none of it claims to be an AKD property.
- No director headshots. No photograph of any director appears in any published
  Company document, and the named directors show tinted initials instead. This is
  not a placeholder waiting to be filled with something better — a stock
  portrait beside a real person's name states that this is them, and it isn't.
  Real photographs upload through **Dashboard → Board & officers**.
- The Pakistan Stock Exchange listing date is not stated in any of the 110
  filings, so it is not published here.
- `NEXT_PUBLIC_NOINDEX=true` is set on Railway and **must be removed** when the
  domain is pointed here.
- Volume backups and PITR are not yet enabled in the Railway dashboard.
- Resend still sends from the sandbox sender, so contact-form mail reaches only
  the Resend account owner. The client is verifying the domain themselves.
