// Sample answers for the Quick Jump shortcut. Nothing here changes how the app
// validates — every field is simply already answered, so each step passes on
// its own rules.
import { todayMDY } from '../components/FormField'

// Paint Exterior in Saratoga. The trade is chosen so the demo exercises the
// class-specific questions: 98304 pulls in both the special coatings one and
// the high value homes one, which no other single class does.
export const DEMO_INTAKE = {
  dba: 'Sierra Ridge Builders',
  subContractingCosts: '5000',
  postalCode: '95070',
  yearsOfExperience: '5',
  mainClassCode: '98304',
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
  hasEmployees: 'yes',
  employeeCount: '4',
  activeOwners: '2',
  operationsDescription:
    'Exterior repainting of single family homes in the South Bay, prep, priming and two finish coats.',
  hiresSubs: 'yes',
  subDwellingPct: '100',
})

// The phase-two steps that phase one does not already seed.
export const demoPhaseTwo = () => ({
  hasEmployees: 'yes',
  agreeTerms: 'yes',
  // The two questions 98304 pulls in, answered so the read-back panels have
  // something to print. High value homes stays No: a yes to its follow-up
  // would put every demo run in front of an underwriter.
  specialCoatings: 'yes',
  specialCoatingsSub: 'Epoxy floor coatings on garage and warehouse slabs.',
  highValueHomes: 'no',
  ccDeductible: '0',
  ccGlLimits: '1000000/2000000/2000000',
  ccDamagesToPremises: '100000',
  ccMedicalLimit: '5000',
  brokerFee: '100',
  // No payment method and no signature choice: those two steps should open on
  // their own first screen, not half way through someone else's answer. The
  // email is only a prefill for whenever eSign does get picked.
  insuredEmail: 'ops@sierraridge.com',
  attested: true,
  workPct: { residential: '100', newConstruction: '100' },
  subTrades: ['Framing', 'Drywall'],
  subTradesOther: '',
  certificates: true,
  holdHarmless: true,
  namedAI: true,
  priorClaims: 'no',
  // Checkboxes now, so these are booleans — a string reads as ticked.
  cyberLiability: true,
  glEnhancement: true,
  toolFloater: true,
  toolFloaterLimit: '10000-1000',
  worksOutOfState: 'no',
  otherEntity: 'no',
  disclosures: { none: true },
})
