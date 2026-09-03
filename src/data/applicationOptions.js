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

// Optional coverages. The tool floater opens the Inland Marine step.
export const OPTIONAL_COVERAGES = [
  {
    key: 'blanketAI',
    label: 'Blanket Additional Insured Endorsement',
    help: 'Adds any party you are contractually required to cover as an additional insured, without endorsing them one at a time.',
  },
  {
    key: 'stopGap',
    label: 'Stop Gap – Employers Liability Coverage Endorsement Insurance',
    help: 'Employers liability cover in monopolistic states, where the state fund writes workers compensation but not the liability piece.',
  },
  {
    key: 'cyberLiability',
    label: 'Cyber Liability',
    help: 'Covers breach response, data restoration and liability arising from a cyber incident.',
  },
  {
    key: 'toolFloater',
    label: 'Inland Marine - Tool Floater',
    help: 'Covers tools, equipment and materials away from the premises. Selecting this opens the Inland Marine step.',
    opens: 'inland-marine',
    options: [
      { key: 'contractorTools',      label: 'Contractor Tools & Equip' },
      { key: 'contractorsInstall',   label: 'Contractors Installation' },
      { key: 'computerEquipment',    label: 'Computer Equipment' },
      { key: 'businessPersonalProp', label: 'Business Personal Property' },
    ],
  },
  {
    key: 'limitedLiabilityEnhancement',
    label: 'Contractors Limited Liability Enhancement',
    help: 'Bundles the endorsements contractors most often need into one enhancement.',
  },
]
