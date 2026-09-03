# CBIC — Contractor General Liability

Quote-and-apply flow for **Contractor GL**, the contractor-side sibling of the
non-contractor GL/BOP product in `GL-Bop`. Same NorbieLink design system, same
BTIS marketplace mechanics; the field set comes from the BTIS Contractor GL
flow (`afgl-client-staging.btisinc.com`).

React 19 + Vite + Tailwind 3.

```bash
npm install
npm run dev
```

## Flow

| Screen | Progress | What it does |
| --- | --- | --- |
| Page Zero (`pages/PageZero.jsx`) | — | Ten-question quick quote; carrier indications appear live on the right once every answer is in. |
| Applicant (`pages/ApplicantContact.jsx`) | 25% | Rating answers carried from intake, plus who to contact. |
| Business Information (`pages/ApplicantBusiness.jsx`) | 50% | License, legal identity, address, and the class-code split (up to 4 trades, must total 100%). |
| Business Operations (`pages/BusinessOperations.jsx`) | 75% | Exposure figures and the two branching questions (subcontractors, pre-C-of-O residential work). |
| Price Indication (`pages/PriceIndication.jsx`) | 100% | Carrier cards with limits/deductible selectors and admitted status. |

The right rail follows the applicant through every step and mirrors the
GL-BOP layout: progress at the top, the cheapest carrier promoted to a hero
card marked **BEST**, the rest as a compact list. Editing any answer that
moves the premium blanks the prices to `---` and enables **Refresh My Quote**
— same contract the marketplace flow uses.

## Layout

`components/AppShell.jsx` is the chrome: 56px header, 256px white step
sidebar, scrolling content column capped at 760px, and the `RightPanel`
aside (`w-80 2xl:w-96`). Field components live in `components/FormField.jsx`
and come in two scales — `size="lg"` for the Page Zero landing (54px tall,
12px radius) and the default compact scale for in-app forms (42px tall, 8px
radius).

Field help uses `InfoTip`: a gradient "i" dot that opens a 340px card on
hover (and on focus, or tap for touch). Content lives in `data/fieldHelp.jsx`
as `{ title, body }` pairs.

## Open decision — where the ACORD upload lives

Both placements ship behind a query param so they can be compared on one
deployment:

- `/` — a quiet row under the primary CTA (default)
- `/?upload=hero` — a card tucked into the corner of the Norbie portrait

Pick one and delete the other along with the `uploadPlacement` switch in
`pages/PageZero.jsx`.

## Placeholders — replace before this goes live

- **`lib/rating.js`** is not a rating engine. It produces stable, plausible
  numbers so the UI can be demoed, calibrated so the reference test case
  returns the same $1,434 / $1,216 that staging does. Swap the module and keep
  the `rateAll()` return shape.
- **`data/classCodes.js`** was transcribed from the live dropdown, which
  scrolls — four stretches were not captured and are marked with `GAP`
  comments. Fill them from the carrier's master list.
- **`data/carrierTerms.js`** carries only what staging returned — `1M/2M/2M`
  and `$0`. The live flow filters these per carrier; add rows when the API
  returns them.
- **Carrier naming**: the supplied logo file is spelled `brivado`, so the
  carrier reads "Brivado"; the id stays `bravado`. Confirm which is correct.
- **Norbie hero** on Page Zero is the mechanic illustration borrowed from
  Commercial Auto. A contractor Norbie should replace it.
- **Not wired up**: license lookup, Download Application Summary, bind & pay.
  Each currently raises an alert.
- **Dark mode** exists in `GL-Bop` but has not been ported here; the dark logo
  variants are already in `src/assets` for when it is.
