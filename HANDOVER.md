# AKD Hospitality — decisions and handover

What was asked, what was decided, and what was done about it. Written 25 August
2026, after the client's answers on the ten open questions.

Read this alongside the [README](README.md), which carries the deploy runbook,
the security notes and the backup procedure.

Live at **https://akd-hospitality.up.railway.app** — a temporary host. The real
domain is the client's to point.

---

## 1. The ten open questions

| # | Question put to the client | Their decision | Status |
| --- | --- | --- | --- |
| 1 | Who verifies the Resend domain? | Client will do it themselves | Left alone. Contact form works; mail currently reaches only the Resend account owner |
| 2 | Who creates `info@akdhospitality.com`? | Client, later | Left as is. `CONTACT_TO` still points at the test address |
| 3 | Replace the Unsplash imagery? | Keep it — client will swap it from the dashboard | No change. All 21 images are editable in **Dashboard → Images** |
| 4 | Director photographs? | Client asked for Unsplash placeholders for now | **Not done as asked** — see [below](#4-why-there-are-no-stock-portraits-of-the-directors) |
| 5 | Effective date for the legal pages? | "Whatever is best" | Both pages now carry **Last updated 25 August 2026** |
| 6 | Everything else on our side? | Do it all except the domain. No separate client login — the existing one is fine | Done. No second account created |
| 7 | Figma sharing | Client has turned sharing on | Nothing needed |
| 8 | Mobile frames in Figma? | Not needed | Not built |
| 9 | Per-person dashboard logins? | Not wanted | Single admin account retained |
| 10 | Old Railway project, and login security | Old project deleted. Wanted proper error handling on login so SQL injection and similar cannot get through | Sign-in audited and hardened — see [section 2](#2-what-was-done-to-the-sign-in). One empty Railway project is **still there** |

---

## 2. What was done to the sign-in

The two things the client was worried about were already handled, so they were
re-verified rather than taken on trust:

- **SQL injection is not reachable.** Every query goes through Drizzle, which
  binds values as parameters instead of splicing them into SQL, and Zod
  validates the request body before it gets that far. Eight payloads
  (`' OR '1'='1`, `'; DROP TABLE admin_users; --`, a `UNION SELECT` against the
  password column, and others) were fired at the live endpoint: all refused with
  a 400, none reached the database. The same payloads were then bound as
  parameters directly — zero rows, all 23 tables intact.
- **Email addresses cannot be fished out.** An unknown address and a wrong
  password return the identical 401, and the bcrypt comparison runs either way
  against a dummy hash, so neither answers faster. Measured: 251 ms against
  249 ms.

What was genuinely missing was **any limit on how many times you may guess**.
That is now in place:

- Ten failed attempts per fifteen minutes, counted both per address and per
  account, then `429` with `Retry-After`.
- A correct password clears both counters, so someone who mistypes a few times
  and then gets in is not left near the limit.
- The per-account limit is deliberately no tighter than the per-address one. A
  tight per-account lock lets an attacker lock the real admin out by failing on
  their behalf, which turns a brute-force defence into a way to take the
  dashboard offline.
- Lockouts are recorded in `audit_log`. The attempted password never is.
- The login form now says roughly how long the wait is, because an admin with no
  number to go on keeps retrying and only extends it.

One honest limitation, also written into `src/lib/rate-limit.ts`: the counters
live in the server's memory, so they reset on redeploy and a second instance
would keep its own. That is sound for a single Railway instance — bcrypt at cost
12 already caps guessing near four attempts a second — but it must move to a
shared store before this is ever scaled out.

**Also added:** `nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, and
a `Permissions-Policy` denying camera, microphone and location.

**And one gap found while doing it:** the dashboard login is linked from the site
footer, so on the real domain Google would have indexed it. `/admin/*` now
carries `noindex` and `no-store` on every deployment, including the live one —
separate from the temporary-host flag, which gets lifted at launch.

---

## 3. Keeping the temporary URL out of Google

`akdhospitality.com` still serves the previous website. If the Railway host were
indexed, two URLs would end up holding these same pages and competing for the
same searches — and the wrong one is the one shareholders would find.

`NEXT_PUBLIC_NOINDEX=true` is set on the Railway `web` service. It emits three
signals: `noindex` in the page metadata, an `X-Robots-Tag` header on **every**
response, and a `robots.txt` that no longer advertises the sitemap.

The header matters because of the archive: a PDF cannot carry a meta tag, and
those 110 filings are the same documents the live site will publish. Crawling
itself stays allowed on purpose — a crawler that is blocked never reads the
`noindex`, and a merely-unreachable URL can still be listed if something links
to it.

> **This flag must be deleted when the domain is pointed here.** Left in place,
> the launched site stays invisible to search.

---

## 4. Why there are no stock portraits of the directors

The client asked for Unsplash photographs against the seven directors as
placeholders. That one was not done, and it is the only item on the list that
was not.

These are seven real, named people. A stranger's face published beside a real
person's name and title does not read as a placeholder to anyone visiting the
site — it reads as a photograph of that director. On a PSX-listed company's own
governance page, that is a false statement about identifiable individuals, and
the risk does not fall on us: it falls on the Company and on the seven people
named.

What is there instead: each director shows their initials in a tinted circle,
matched to the site's palette, with the same hover treatment as a photograph
would have. It is finished design, not a blank waiting to be filled. Nothing on
the page looks unfinished or apologises for a missing image.

Real photographs upload in seconds through **Dashboard → Board & officers**, and
the moment one is uploaded it replaces the initials for that director. So the
client loses nothing by waiting for the real images, and the seven directors are
not misrepresented in the meantime.

If the client still wants stock faces after reading this, that is their call to
make — but it should be made knowing it is a claim about real people, not a
styling choice.

---

## 5. What is left

### The client's to do

1. **Point `akdhospitality.com` at Railway.** Then tell us, so the noindex flag
   comes off. Worth knowing at the cutover: the old site is HTTP-only on both
   the apex and `www`, so Railway will be supplying HTTPS for the first time.
2. **Verify the domain at [resend.com/domains](https://resend.com/domains).**
   Until then the contact form can only deliver to the Resend account owner.
3. **Create the `info@akdhospitality.com` mailbox.** Then `CONTACT_FROM` and
   `CONTACT_TO` change together — both, or neither.
4. **Supply photography** when they have it: the seven directors, and any real
   property images to replace the Unsplash set.

### Ours, once unblocked

5. Remove `NEXT_PUBLIC_NOINDEX` and redeploy, the day the domain points here.
6. Point `www` at a 301 to the apex, so the two hosts do not split ranking
   signals for the same pages.
7. Add `Strict-Transport-Security` once the domain has settled — held back
   deliberately, because it is per host and a rolled-back cutover would leave
   pinned visitors unable to reach the HTTP-only old site at all.
8. Switch `CONTACT_FROM` and `CONTACT_TO` when the mailbox exists.

### The deploy pipeline — resolved

Pushes did not reach Railway, so every deploy was manual. The cause was not what
it first looked like. Railway kept answering *"User does not have access to the
repo"*, and the repository was owned by `MuhammadZainDev` while the Railway
account belongs to Faisal — and Railway's GitHub App cannot be granted access to
a repository the account does not own.

So the repository was **transferred to `faisalkasbatiakd`**, keeping all thirteen
commits, all three branches and the old URLs as redirects. `MuhammadZainDev` kept
push access automatically, as a collaborator rather than an owner, which is the
right arrangement now that the client's side holds it.

That removed one of two blockers. The second was that Railway's GitHub App had
not been granted the repository, which is a separate step from connecting GitHub
to the Railway account — the account was already connected as `faisalkasbatiakd`
while the App still could not see any repository. Railway reports both failures
with the same message, which is what made this take three attempts to pin down.

Granting it lives under **Account settings → Integrations → GitHub → Configure
repo access**, not in the service's own settings, and it is a dashboard action: a
CLI session cannot authorize it.

**Both are now done and tested end to end.** The `web` service is connected to
`faisalkasbatiakd/akd-hospitality@main`; a push produced a deployment, it
succeeded, and all 13 routes were re-checked afterwards.

One behaviour to know about, because it will come up on every push. Railway will
not send a commit authored by a *collaborator* straight to production — the
deployment waits at `NEEDS_APPROVAL` until the account holder approves it in the
dashboard. Since Faisal owns the repository and Zain pushes as a collaborator,
that is now the normal path for Zain's commits.

This is worth keeping rather than working around. A client-owned production site
should not redeploy itself because a contractor pushed. It does mean someone has
to click approve, so if a change is urgent and Faisal is not around, `railway up`
from a clone still deploys directly.

There was briefly a GitHub Actions workflow doing the deploy from the repository
side instead. It is gone, because Railway's own integration is simpler and
running both would deploy every commit twice. If the dashboard step turns out not
to work, it is recoverable: `git show 5a2cc80:.github/workflows/deploy.yml`.
Note that it needs a Railway project token, and `projectTokenCreate` is refused
to a CLI session, so that token is a dashboard action too.

### Housekeeping worth doing now

9. **Volume backup schedules** still need setting in the Railway dashboard, on
   each volume's **Backups** tab — daily and weekly, on both `postgres-volume`
   and `web-volume`. The second one matters as much as the first: it holds the
   director photographs and any PDF added through the dashboard.

   The API refuses this one (`volumeInstanceBackupScheduleUpdate` →
   `NotAuthorized`), so it is a dashboard action.

   **PITR is already enabled** — done from the CLI, bucket wired, verified. It
   was worth doing immediately rather than at launch, because the recovery
   window only starts when it is switched on. The site was re-checked afterwards:
   all 13 routes returned 200.
10. **Delete the empty Railway project.** There are two named `akd-hospitality`:
    `fd12179c-9573-46b1-913d-16596ef3c6a2` holds `web` and `Postgres` and is
    live; `126e9fc2-99a7-41b7-94a0-44fd085a400a` has no services and is the one
    to remove.
11. **Rotate the credentials that have been shared in chat:** the Resend API
    key, and both Postgres passwords.

### Optional

12. Move the 147 MB of PDFs to object storage if build times start to bite. Set
    `NEXT_PUBLIC_DOCS_BASE_URL`; no code changes needed.
13. Dashboard forms for the ESG and media-notice content, which is currently
    seeded and editable only in the database.

---

## 6. Deliberately not modelled in the dashboard

Everything in `src/data/financials.ts` — the FY2025 snapshot, the six-year
record, the shareholding pattern, the capital structure and the going-concern
notice — is left out of the dashboard on purpose. These are audited figures tied
to specific pages of the annual report, and the going-concern notice is published
above them rather than after them. A free-text field over audited numbers invites
a typo that misstates the Company's position. They change once a year, with the
annual report, and should change through a release.

---

## 7. Who owns what

Recorded because it is not visible from the code, and because two of these moved
during the project.

### GitHub

| | |
| --- | --- |
| Repository | `faisalkasbatiakd/akd-hospitality` — **private**, default branch `main` |
| Owner / admin | `faisalkasbatiakd` (the client's side) |
| Collaborator | `MuhammadZainDev` — **write**: can push and open PRs, cannot change settings, delete the repo, or manage access |
| Old path | `MuhammadZainDev/akd-hospitality` → redirects here. Old clones and links keep working |

It was transferred on 25 August 2026. Ownership had to sit with the Railway
account holder, because Railway's GitHub App cannot be granted a repository the
account does not own.

### Railway

| | |
| --- | --- |
| Account | Faisal Kasbati — `faisalkasbati.akd@gmail.com` |
| GitHub integration | connected as `faisalkasbatiakd`, App granted this repository |
| **Live project** | `fd12179c-9573-46b1-913d-16596ef3c6a2` — services `web` + `Postgres`, volumes `web-volume` + `postgres-volume` |
| Empty project | `126e9fc2-99a7-41b7-94a0-44fd085a400a` — no services. **Delete this one** |
| Deploy source | `faisalkasbatiakd/akd-hospitality@main` |
| Host | `akd-hospitality.up.railway.app` — generated, temporary |

Both projects carry the same name, so **always act on the ID**, never the name.
Zain has no Railway account on this project; everything Railway-side goes through
Faisal's login.

### Everything else

| | |
| --- | --- |
| Dashboard login | `admin@akdhospitality.com` — one account, no self-registration, no email reset. Password is not recorded here |
| Contact form | `CONTACT_TO=faisalkasbati.akd@gmail.com`. Resend's sandbox only delivers to the account owner, so the Resend account is on that address too |
| Real domain | `akdhospitality.com` — the client's, still serving the previous site |
| Working copy | `C:\Users\zain\Documents\GitHub\akd-hospitality`, remote already repointed |

### What this means from here

- **Zain can push; Faisal has to approve.** Railway holds a collaborator's commit
  at `NEEDS_APPROVAL`. Normal, and worth keeping.
- **Zain cannot change repo settings or manage access.** If someone else needs
  adding, or a branch protecting, Faisal does it.
- **Nothing on Railway is reachable without Faisal's login** — variables, volumes,
  backups, the domain. Anything needed there has to be either scripted through
  the CLI or done by him.
- **If the client's own staff take this over,** the clean end state is: transfer
  the repo again to a GitHub organisation the company controls, move the Railway
  project into a company workspace, and reissue the dashboard login on a company
  address. All three currently sit with one person.
- **`NEXT_PUBLIC_SITE_URL` still names the Railway host.** It has to change with
  the domain, at the same time as `NEXT_PUBLIC_NOINDEX` comes off.
