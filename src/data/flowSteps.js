// The submission is one list of eight steps. It is still two pages — the
// intake, then the application — and the rail shows the whole journey either
// way so nobody has to guess what comes after the price.
export const INTAKE_STEPS = [
  { key: 'classes',     label: 'Classifications' },
  { key: 'applicant',   label: 'Applicant Information' },
  { key: 'operations',  label: 'Business Operations' },
  { key: 'indication',  label: 'Price Indication' },
]

export const APPLICATION_STEPS = [
  { key: 'eligibility', label: 'Eligibility Statements' },
  { key: 'coverage',    label: 'Coverage Customization' },
  { key: 'review',      label: 'Review & Select Payment' },
  { key: 'bind',        label: 'Sign and Request to Bind' },
]

export const ALL_STEPS = [...INTAKE_STEPS, ...APPLICATION_STEPS]
  .map((s, i) => ({ ...s, number: i + 1 }))

export const isIntakeStep = (key) => INTAKE_STEPS.some(s => s.key === key)

// Which of the application's two pages a step is on.
export const STAGE_OF = {
  eligibility: 'form',
  coverage: 'form',
  review: 'bind',
  bind: 'bind',
}
