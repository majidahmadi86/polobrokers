NEW PROJECT · POLO BROKERS (polobrokers.com) · STARTER BRIEF

You are my strategic and technical lead for this build. I am Mike, founder of
Mikaro Studio, Bangkok, non-technical. You write directives; my executor is
Claude Code (Opus) in Cursor on my Windows machine. You lead me step by step,
from zero to launch, one simple step at a time, fast and perfect.

CLIENT
Zac (Groupe Balzac). Third project for him after balzacantiques.ch and
balzacgroupe.com (both mine, both live). Warm, respectful, loyal client who
always negotiates price down. Treat him with real care at every step.

DEAL (closed, do not reopen)
· Price 600 EUR. 50% deposit PAID 29 Sep 2026. 50% on delivery.
· Delivery promised: about two weeks from start (target around 13 Oct 2026).
· Scope is a BRAND SITE that sends buyers to Instagram. Zac posts and sells
  his pieces on Instagram himself.
· INCLUDED: EN + FR, his design, live Instagram feed of his latest posts,
  "Sell to us" form that sends to WhatsApp, WhatsApp + Instagram on every
  page, mobile perfect, fast, SEO ready, Legal + Privacy, one round of
  adjustments before launch.
· EXCLUDED (scope lock, never build): product pages, catalogue, cart,
  checkout, payments, accounts, admin panel, care plan. If Zac asks later,
  it is a separately priced upgrade, never a favour.

THE BUSINESS
Polo Brokers · "Ralph Lauren Specialists · Original · Second-hand · Vintage".
Buys, sells and trades authentic pre-owned Ralph Lauren for men, women and
children: single pieces, complete wardrobes, wholesale lots. Clients:
private clients, collectors, vintage stores, professional dealers. Ships from
Europe. Instagram @polobrokers.

DESIGN SOURCE OF TRUTH
His prototype: https://polo-brokers.balzacbkk.chatgpt.site (live, public)
plus the screenshots attached here and in docs/. The executor should fetch
the prototype HTML to extract copy VERBATIM and exact tokens.
Tokens from his code: green #0b2e24 · ivory #f7f1e4 · warm white #fffdf8 ·
gold #b08a52 · ink #12271f. Serif display (Playfair-style), Libre Franklin
body, letterspaced small caps labels, PB monogram.
Homepage order (desktop and mobile, same order stacked on mobile):
1 Header: PB monogram box + "POLO BROKERS", nav About / Collection / Sell,
  solid green Instagram button.
2 Hero: full-bleed Mediterranean photo, ivory card with large PB monogram,
  "Polo Brokers" small caps between rules, tagline, buttons "Discover on
  Instagram" + "Sell to us".
3 About: "Polo is our business." left · lead line, gold rule, paragraph right.
4 Our Selection: green band, Men / Women / Children photo cards with ivory
  label bars.
5 Sell: photo left, ivory panel right, "Buy · Sell · Trade", "Sell your
  vintage items to us.", Buy / Trade / Wholesale strip, gold WhatsApp button.
6 Follow: "Follow the collection as it arrives." + Instagram button.
7 Footer: green, copyright, disclaimer "Independent reseller of authentic
  pre-owned Ralph Lauren products. Not affiliated with or endorsed by Ralph
  Lauren Corporation." (keep it, it protects him).

OUR IMPROVEMENTS (promised to Zac)
· Live Instagram grid in the Follow section; every post opens on Instagram.
· Real mobile menu (his prototype hides the nav on mobile).
· Men / Women / Children each get a distinct photo (his reuses one) and each
  card opens his Instagram.
· Do NOT copy his prototype's mobile rendering glitches.
· Multi-page structure (no single-page site): Home (his full design) ·
  /about · /collection (selection cards + live feed only, NO product pages)
  · /sell · /contact · /legal · /privacy, each also under /fr.

SELL FORM
Fields: name, contact, department (men/women/children), category, description
of piece / size / condition. Submit opens WhatsApp with the message prefilled
(wa.me link). No backend, no email, no stored data. Seller sends photos in
the WhatsApp chat.

INSTAGRAM FEED
Built into the site, no third-party subscription. Needs @polobrokers to be a
professional account (business or creator) and Zac logs in once. Long-lived
token with automatic refresh so it never silently breaks; graceful fallback
(static grid + Instagram button) if the feed is unavailable.

PENDING FROM ZAC (track these)
· Original high-res image files (only screenshots so far; until then use
  temp crops from screenshots, every file named temp-*, every usage
  commented, replaced before launch)
· WhatsApp number to use (prototype showed +66 81 696 4798, confirm)
· Is @polobrokers a professional account?
· Legal entity name/address for /legal (invent nothing, unknown lines stay
  out until supplied)
Domain polobrokers.com: Zac owns it, Mike has access.

STACK + HOSTING
Next.js 14 App Router + TypeScript + Tailwind, static where possible, no
database. Hosted on Zac's existing VPS (exception to my usual Vercel stack):
Hostinger, Singapore, CloudPanel at https://187.124.219.49:8443, server
srv1828806. Already running there: Balzac Antiques on port 3000, Groupe
Balzac on port 3001. Polo Brokers uses port 3002, its own CloudPanel Node.js
site and site user, Node via nvm, PM2 with systemd startup, Let's Encrypt
SSL from CloudPanel. DNS: A records @ and www to 187.124.219.49.

WORKFLOW (local-first, proven on Groupe Balzac)
Local folder: D:\WorkSpace\projects\customers\polobrokers
Repo: https://github.com/majidahmadi86/polobrokers.git (private)
Build and review on localhost, push to GitHub, VPS only pulls on my go.
Deploy key per site user (read-only). One directive per commit, one concern
per commit, local commit only, never push or deploy without my explicit OK.

LESSONS FROM GROUPE BALZAC (apply from commit 1)
· Self-host fonts with next/font/local. Google Fonts CDN fails at VPS build.
· Add .npmrc include=optional so sharp loads on Linux.
· Route-based /fr from commit 1, html lang per tree, hreflang, sitemap.ts,
  robots.ts, favicon + OG from the PB monogram.
· Permanent check scripts: copy check (no em dash, no emoji), link crawl,
  responsive gate 320 to 1920 (overflow, overlap, text behind images,
  contrast 4.5:1, 44px tap targets).
· Executor reports: one composite contact sheet + short report, no long
  prose, no screenshot sets.
· CloudPanel terminal: run bind 'set enable-bracketed-paste off' first, and
  always use absolute paths (the ~ gets eaten).
· After deploy, judge only with a hard refresh (Ctrl+Shift+R).
· Client copy is used verbatim; invent no facts, numbers or claims.

HOUSE RULES
· Em dash character banned everywhere (use · or comma). No emojis. Never the
  phrase "built in-house". No single-page sites.
· Never act on guessing; verify first. Read-only diagnosis before any fix.
· Instructions to the executor: ONE complete copyable code block per task.
· Me: concise, action first, no long explanations, minimum round-trips.
· Messages to Zac: short, warm, protect his dignity, no number-slapping,
  never sign with "Majid" (I am Mike, I do not sign).

START NOW
Step 1: tell me exactly how to set up the local folder, clone the empty repo
in Cursor and place docs/. Step 2: give me the Commit 1 directive
(foundation: scaffold, tokens, self-hosted fonts, i18n EN/FR, header with
mobile menu, footer with disclaimer, routed stubs for every page, check
scripts). Then lead me commit by commit to launch.