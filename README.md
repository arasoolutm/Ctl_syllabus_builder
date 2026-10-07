# Test: Added line for test pull request.
# UTM Syllabus Builder

A single-page app that walks a faculty member through a UT Martin course syllabus
and exports it to Word or PDF. Maintained by the Center for Teaching and Learning.

## What it does and does not do

- No accounts, no database, no server-side code. Everything runs in the browser.
- Nothing is transmitted or stored. Closing the tab clears the work.
- "Save my work" downloads a small JSON file to the user's own machine.
  "Load a saved file" reads it back. That is the entire persistence model.
- Because of the above, there is no FERPA surface and no data retention question
  to answer for IT or Institutional Compliance.

## Run it locally

    npm install
    npm run dev

Opens at http://localhost:5173

## Build

    npm run build

Output lands in `dist/`, which is plain static HTML, CSS, and JS.
It can be served by any web server. No Node runtime is needed in production.

## Deploy to Vercel

Option A, from the browser:
1. Push this folder to a GitHub repo.
2. At vercel.com, choose Add New Project and import the repo.
3. Vercel detects Vite automatically. Framework Preset: Vite.
   Build Command: npm run build. Output Directory: dist.
4. Deploy. You get a working URL in about a minute.

Option B, from the terminal:

    npm i -g vercel
    vercel

Answer the prompts, then `vercel --prod` to promote it.

## Deploy to a UTM web server instead

Run `npm run build` and copy the contents of `dist/` to any directory the
web server can serve. There is no backend, so nothing else is required.
If it is served from a subdirectory rather than a domain root, add
`base: "/your-subdirectory/"` to `vite.config.js` before building.

## Where to edit institutional content

Everything CTL maintains lives at the top of `src/SyllabusBuilder.jsx`
as plain constants. No React knowledge is needed to update the text.

- `SLO_PRIMER`      the explainer on learning outcomes and Gen Ed outcomes
- `OUTCOME_LIBRARY` the pickable Gen Ed and program outcome sets
- `AI_POLICIES`     the three AI policy tiers required by UTM policy
- `LOCKED`          academic integrity, ADA Title II accessibility, student
                    support, crisis resources, and the change clause
- `FALL_2026`       the registrar's dates appended to the schedule
- `C`               brand colors (UT Orange #FF8300, UT Smokey #0B2240)

Change a string, commit, and Vercel redeploys. Every syllabus generated after
that carries the corrected language, which is the whole point of the tool.

## Each term

1. Update `FALL_2026` (rename the constant and the section heading) from the
   registrar's calendar PDF.
2. Re-verify the ARC room, phone, and email in `LOCKED.accessibility`.
3. Re-verify the crisis numbers in `LOCKED.crisis`.
