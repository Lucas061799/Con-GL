import rliLogo from '../assets/carrier-rli.svg'
import brivadoLogo from '../assets/carrier-brivado.svg'

// PLACEHOLDER RATER — not a real rating engine.
//
// Produces a stable, plausible-looking price indication from the intake
// answers so the UI can be built and demoed before the carrier APIs are
// wired up. Swap the whole module for real quote calls; keep the shape of
// `rateAll()` (an array of { id, carrier, product, premium }) and nothing
// upstream has to change.

const CARRIERS = [
  // Bases are calibrated so the reference test case from the staging site
  // (Carpentry - Homebuilder, 17 yrs experience, 13 yrs in business, $5,000
  // receipts / $1,200 payroll / $2,333 subs, 1 year prior coverage, no new
  // residential) lands on the same $1,434 / $1,216 it returns there.
  { id: 'rli',     carrier: 'RLI',     product: 'Contrac Pac',    logo: rliLogo, base: 977, factor: 1.00 },
  // The supplied logo file is spelled 'brivado' — confirm which is right.
  { id: 'bravado', carrier: 'Brivado', product: 'Contractors GL', logo: brivadoLogo, base: 777, factor: 1.00 },
]

// Trades that carry more exposure get a heavier load. Everything not listed
// rates at 1.0 — the real class factors come from the carrier's manual.
const CLASS_LOAD = {
  '91345': 1.35, // Carpentry - Homebuilder
  '91346': 1.30, // Carpentry - Framer
  '92339': 1.28, // Drywall – New Residential
  '98304': 1.22, // Paint Exterior
  '94007': 1.40, // Excavation
  '97447': 1.25, // Masonry
  '92478': 1.15, // Electrical - Within Buildings
  '98482': 1.18, // Plumbing Commercial
  '99507': 1.45, // Swimming Pools – Below Ground
  '91523': 0.90, // Pressure Washing
  '97050': 0.85, // Lawn Care
  '96816': 0.80, // Janitorial - Commercial
}

// Prior-history leaves that signal lapses or claims load the premium.
const HISTORY_LOAD = {
  'nl-4plus': 0.92, 'nl-3': 0.95, 'nl-2': 0.98, 'nl-1': 1.00,
  'lapse60-4plus-lossfree': 1.10,
  'lapse159-4plus-lossfree': 1.05,
  'no-prior': 1.20,
  'cnl-last-year': 1.35, 'cnl-3': 1.22, 'cnl-2': 1.26, 'cnl-1': 1.30,
  'cl159-last-year': 1.42, 'cl159-3': 1.28, 'cl159-2': 1.32, 'cl159-1': 1.36,
  'cl60-last-year': 1.50, 'cl60-3': 1.34, 'cl60-2': 1.38, 'cl60-1': 1.44,
}

const num = (v) => {
  const n = Number(String(v ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const yearsToNumber = (v) => {
  if (v === '19+') return 19
  if (v === 'new') return 0
  return num(v)
}

export function rateAll(form) {
  const receipts = num(form.grossReceipts)
  const payroll  = num(form.employeePayroll)
  const subs     = num(form.subContractingCosts)

  // Exposure base — receipts do the heavy lifting, with payroll and sub
  // costs layered on. Sub work is loaded harder than own-employee payroll.
  const exposure = receipts + payroll * 0.6 + subs * 1.4

  const classLoad = CLASS_LOAD[form.mainClassCode] ?? 1.0
  const historyLoad = HISTORY_LOAD[form.priorInsurance] ?? 1.0

  // Experience credit — a 19-year contractor lands about 18% under a
  // two-year one; new-in-business gets a surcharge instead.
  const exp = yearsToNumber(form.yearsOfExperience)
  const expLoad = Math.max(0.82, 1.12 - exp * 0.016)

  const inBiz = yearsToNumber(form.yearsInBusiness)
  const bizLoad = inBiz === 0 ? 1.18 : Math.max(0.90, 1.08 - inBiz * 0.010)

  // New residential construction is the single biggest swing on contractor GL.
  const newResLoad = form.newResidential === 'yes' ? 1.55 : 1.0

  return CARRIERS.map(c => {
    const premium =
      (c.base + exposure * 0.038) *
      c.factor * classLoad * historyLoad * expLoad * bizLoad * newResLoad

    return {
      id: c.id,
      carrier: c.carrier,
      product: c.product,
      logo: c.logo,
      premium: Math.round(premium),
    }
  }).sort((a, b) => a.premium - b.premium)
}

export const formatUSD = (n) =>
  `$${Math.round(n).toLocaleString('en-US')}`
