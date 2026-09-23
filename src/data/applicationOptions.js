// Option sets for the full application (phase two), transcribed from the
// BTIS classic flow.

export const STRUCTURE_OF_BUSINESS = [
  { value: 'corporation',     label: 'Corporation' },
  { value: 'joint-venture',   label: 'Joint Venture' },
  { value: 'llc',             label: 'Limited Liability Company' },
  { value: 'limited-partner', label: 'Limited Partnership' },
  { value: 'partnership',     label: 'Partnership' },
  { value: 'sole-proprietor', label: 'Sole Proprietor or Individual' },
]

// Phase two allows three trades, not the four the indication took.
export { MAX_CLASSIFICATIONS as MAX_APPLICATION_CLASSIFICATIONS } from './applicantOptions'

export const APP_DEDUCTIBLES = [
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
]

export const APP_LIMITS = [
  { value: '300/600',   label: '$300,000/$600,000' },
  { value: '500/1000',  label: '$500,000/$1,000,000' },
  { value: '1000/2000', label: '$1,000,000/$2,000,000' },
]

// % of Work — both columns have to total 100.
export const STRUCTURE_TYPES = [
  { key: 'residential',   label: 'Residential' },
  { key: 'commercial',    label: 'Commercial' },
  // The program writes neither of these; entering a share blocks the quote.
  { key: 'industrial',    label: 'Industrial',    disallowed: 'This program does not allow industrial work.' },
  { key: 'manufacturing', label: 'Manufacturing', disallowed: 'This program does not allow manufactoring work.' },
]

export const CONSTRUCTION_TYPES = [
  { key: 'newConstruction', label: 'New Construction' },
  { key: 'remodel',         label: 'Remodel' },
  { key: 'serviceRepair',   label: 'Service/Repair' },
]

// From the newer carrier spec. Not rendered yet — the legacy screens show the
// tool floater as a fixed $5,000 limit in its description rather than a
// choice, so this list is parked here until we know where it belongs.
export const TOOL_FLOATER_LIMITS = [
  { value: '2500-1000',  label: '$2,500 Blanket Tools Limit w/$1,000 deductible' },
  { value: '5000-1000',  label: '$5,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '7500-1000',  label: '$7,500 Blanket Tools Limit w/$1,000 deductible' },
  { value: '10000-1000', label: '$10,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '15000-1000', label: '$15,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '20000-2500', label: '$20,000 Blanket Tools Limit w/$2,500 deductible' },
]

/* ── Inland Marine ────────────────────────────────────────────────── */

/* ── General Questions ────────────────────────────────────────────── */

