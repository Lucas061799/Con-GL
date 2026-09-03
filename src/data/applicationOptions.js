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
export const MAX_APPLICATION_CLASSIFICATIONS = 3

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

export const SUBCONTRACTOR_TRADES = [
  'Concrete', 'Drywall', 'Excavation', 'Electrical',
  'Framing', 'Finish Work', 'Flooring', 'Grading',
  'General Clean Up', 'Glazier/Window', 'Interior Decorating', 'Landscape',
  'Painting', 'Plastering', 'Plumbing', 'Roofing',
]

export const SUBCONTRACTOR_COMPLIANCE = [
  { key: 'certificates', label: 'Certificates of Insurance with limits of liability for each occurrence equal to or greater than those provided by this policy will be obtained from all subcontractors prior to commencement of any work performed for the insured.' },
  { key: 'holdHarmless', label: 'Insured will obtain hold harmless agreements from subcontractors indemnifying against all losses from the work performed for the insured by any and all subcontractors.' },
  { key: 'namedAI',      label: 'Insured will be named as additional insured on all subcontractors general liability policies.' },
]

export const TOOL_FLOATER_LIMITS = [
  { value: '2500-1000',  label: '$2,500 Blanket Tools Limit w/$1,000 deductible' },
  { value: '5000-1000',  label: '$5,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '7500-1000',  label: '$7,500 Blanket Tools Limit w/$1,000 deductible' },
  { value: '10000-1000', label: '$10,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '15000-1000', label: '$15,000 Blanket Tools Limit w/$1,000 deductible' },
  { value: '20000-2500', label: '$20,000 Blanket Tools Limit w/$2,500 deductible' },
]

// Optional coverages, with the carrier's own descriptions. `states` limits a
// cover to the states that offer it; `options` renders a dropdown under the
// Yes pill.
export const OPTIONAL_COVERAGES = [
  {
    key: 'blanketAI',
    label: 'Blanket Additional Insured Endorsement',
    help: 'Provides additional insured status on a blanket basis as required by written contract for the insured\u2019s ongoing operations. Coverage is provided on a primary/non-contributory basis and includes waiver of subrogation when required by written contract.',
  },
  {
    key: 'stopGap',
    label: 'Stop Gap \u2013 Employers Liability Coverage Endorsement Insurance',
    help: 'Coverage protection for the policyholder in the event an employee sues for amounts beyond what is covered by workers compensation.',
    // Monopolistic states only.
    states: ['WA', 'ND', 'WY', 'OH'],
  },
  {
    key: 'cyberLiability',
    label: 'Cyber Liability',
    help: '$50K limit providing comprehensive data security and privacy coverage that addresses both first party losses and third-party liability claims. Includes breach response and cyber expert claim assistance.',
  },
  {
    key: 'glEnhancement',
    label: 'GL Enhancement Endorsement',
    help: 'Provides 16 key coverage enhancements to the base GL policy form. Highlights include: Damage to property in your care custody and control or for costs to repair or restore \u2018your work\u2019 $15K per occurrence / $50K aggregate. Unintentional errors and omissions coverage. $10K Lost key coverage.',
  },
  {
    key: 'toolFloater',
    label: 'Inland Marine - Tool Floater',
    opens: 'inland-marine',
    select: {
      key: 'toolFloaterLimit',
      label: 'Blanket Tools Limit',
      placeholder: 'Select a limit',
      options: TOOL_FLOATER_LIMITS,
    },
  },
]

/* ── Inland Marine ────────────────────────────────────────────────── */

export const PER_JOB_SITE_LIMITS = ['5000', '10000', '15000', '20000', '25000']
  .map(v => ({ value: v, label: `$${Number(v).toLocaleString()}` }))

// The classic flow spells these without a separator, unlike the GL deductibles.
export const IM_DEDUCTIBLES = [
  { value: '1000', label: '$1000' },
  { value: '2500', label: '$2500' },
]

export const LOCATION_OPTIONS = ['1', '2', '3'].map(v => ({ value: v, label: v }))

/* ── General Questions ────────────────────────────────────────────── */

export const GENERAL_DISCLOSURES = [
  { key: 'none',            label: 'Check if None', isNone: true },
  { key: 'claims5yr',       label: 'The insured has claims against their insurance within the past 5 years.' },
  { key: 'withoutIns',      label: 'The insured has operated for any period without insurance.' },
  { key: 'lawsuits',        label: 'The insured has lawsuits or arbitrations or disputes pending in which they are being assessed by a lawyer.' },
  { key: 'knownDefects',    label: 'The insured has knowledge of any existing problems or construction defects on one or more of their jobs that may potentially give rise to any future claims of legal action against such person or entity.' },
  { key: 'priorCancelled',  label: "The insured's prior insurance cancelled, declined or non-renewed due to claims or ineligible operations." },
  { key: 'bankruptcies',    label: 'The insured has any bankruptcies, taxes or credit liens within the past 5 years' },
]
