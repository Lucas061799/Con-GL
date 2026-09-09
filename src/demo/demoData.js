// Sample answers for the demo shortcut. Nothing here changes how the app
// validates — every field is simply already answered, so each step passes on
// its own rules.
import { todayMDY } from '../components/FormField'

// Matches the reference case: Carpentry - Framer in Saratoga.
export const DEMO_INTAKE = {
  dba: 'Sierra Ridge Builders',
  subContractingCosts: '5000',
  postalCode: '95070',
  yearsOfExperience: '5',
  mainClassCode: '91346',
  yearsInBusiness: '5',
  grossReceipts: '500000',
  priorInsurance: 'nl-4plus',
  employeePayroll: '120000',
  newResidential: 'no',
}

// The three phase-one sections.
export const demoPhaseOne = () => ({
  firstName: 'Lucas',
  middleName: '',
  lastName: 'Ye',
  phone: '4085551234',
  mobile: '',
  email: 'ops@sierraridge.com',
  website: '',
  licenseNumber: '1085512',
  effectiveDate: todayMDY(),
  legalName: 'Sierra Ridge Builders LLC',
  entityType: 'llc',
  street: '1420 Prospect Rd',
  suite: '',
  city: 'Saratoga',
  state: 'CA',
  mailingSame: true,
  employeeCount: '4',
  activeOwners: '2',
  operationsDescription:
    'Residential framing, siding and finish carpentry for custom single family homes in the South Bay.',
  hiresSubs: 'yes',
  subDwellingPct: '100',
})

// The phase-two steps that phase one does not already seed.
export const demoPhaseTwo = () => ({
  hasEmployees: 'yes',
  workPct: { residential: '100', newConstruction: '100' },
  subTrades: ['Framing', 'Drywall'],
  subTradesOther: '',
  certificates: true,
  holdHarmless: true,
  namedAI: true,
  priorClaims: 'no',
  blanketAI: 'no',
  stopGap: 'no',
  cyberLiability: 'no',
  toolFloater: 'no',
  limitedLiabilityEnhancement: 'no',
  worksOutOfState: 'no',
  otherEntity: 'no',
  disclosures: { none: true },
})
