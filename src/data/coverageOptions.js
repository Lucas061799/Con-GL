// Eligibility Statements and Coverage Customization, transcribed from the
// legacy agent-facing GL screens. Every string here is the legacy wording —
// including the tooltip bodies — so nothing on these steps is invented.

export const POLICY_ELIGIBILITY = [
  "The applicant's gross receipts have not exceeded $1,500,000 in the past 2 years and the applicant has no past or current planned jobs exceeding $750,000 in value.",
  'The applicant has not completed any work involving apartment conversions, construction work involving condominiums, town homes or time shares in the past 10 years, nor does the applicant plan to begin or complete such work in the future.',
  'In the past 2 years the applicant has not built any structures as a general contractor or developer, or performed work as a construction or project manager, and has no plans to do so.',
  'The applicant does not perform: (1) fire damage, water damage as a result of fire or flood, mold damage or termite damage repair or remediation as a general contractor; or (2) work related to railroads, gas stations, refineries, chemical plants, airports, public utilities, medical facilities, nursing homes, senior or military housing.',
  'The applicant does not perform work in AK, the District of Columbia, FL, HI, KY, MD, or NY.',
  'The applicant is not a subsidiary or affiliate of another entity and the applicant does not have any other subsidiaries or affiliates.',
  'The applicant has not had any claims or legal actions against them exceeding $20,000 (including expenses), has not had more than 2 claims or has not had any construction defect claims in the past 4 years and the applicant is not aware of any pending against them.',
  'The applicant has at least 2 years or more of experience in their discipline.',
  'The applicant has not performed work prior to approval for occupancy in tract developments or mobile home parks of more than 10 units in the past 4 years and has no plans to do such work in the future.',
  "If the applicant hires sub-contractors, it verifies that it will obtain certificates of insurance from all sub-contractors providing evidence of general liability insurance with limits at least equal to this policy. The applicant must be named as an additional insured under each sub-contractor's policy and require a hold harmless agreement indemnifying the applicant against all losses from work performed for the applicant by all sub-contractors to the fullest extent permitted by applicable law.",
  'The applicant does not perform any roofing, framing or window jobs except for incidental work performed as part of eligible operations (e.g. Residential Remodeling).',
  "The applicant has and maintains a license in good standing in the jurisdiction(s) where work is performed, that permits the person or organization to perform the type of work they are performing, regardless of whether the license is mandatory or optional. If a license is not available in the jurisdiction(s) where the work is performed, please answer 'yes'.",
]

export const TERMS_AND_CONDITIONS =
  "Please carefully review the operations included in the classification(s) you have chosen to describe the applicant's business. Coverage under the policy only applies to injury or damage caused by operations included in the chosen classification(s). This is not a policy, but merely a general description of coverages. Refer to the actual policy for full coverage details including exclusions and limitations. The policy will contain all of the terms and conditions applicable in the event of a loss or claim."

export const AGREE_QUESTION =
  'DOES THE APPLICANT AGREE TO ALL OF THE TERMS STATED IN THE ABOVE POLICY ELIGIBILITY STATEMENTS, CLASSIFICATION STATEMENTS, AS WELL AS THE TERMS & CONDITIONS?'

export const OPERATIONS_NOTE =
  "ONLY describe the Insured's operations, do not describe what the operation is not doing."

/* ── Coverage Customization ──────────────────────────────────────── */

export const CC_DEDUCTIBLES = [{ value: '0', label: '0' }]

export const CC_GL_LIMITS = [
  '300000/300000/300000',
  '500000/500000/500000',
  '500000/1000000/1000000',
  '1000000/1000000/1000000',
  '1000000/2000000/1000000',
  '1000000/2000000/2000000',
].map(v => ({ value: v, label: v }))

export const CC_DAMAGES_TO_PREMISES = [{ value: '100000', label: '100,000' }]
export const CC_MEDICAL_LIMITS = [{ value: '5000', label: '5,000' }]

export const CC_LIMIT_HELP = {
  deductible: {
    title: 'Deductible',
    body: 'The portion of any loss that the applicant would have to pay in the event of a covered loss.',
  },
  glLimits: {
    title: 'GL Limits',
    body: 'The largest total amount the insurance company will pay in the event of a covered losses.',
  },
  damagesToPremises: {
    title: 'Damages to Premises Rented to You',
    body: 'The limit of insurance payable for a covered loss to a premise rented to you',
  },
  medicalLimit: {
    title: 'Medical Limit',
    body: 'The limit of insurance payable for a covered loss to bodily injury to a third party because of your operations or on a premises you own or rent',
  },
}

// Recommended options — the tools cover carries its own claims question and
// limit picker, exactly as the legacy screen does.
export const CC_RECOMMENDED = [
  {
    key: 'faultyWorkmanship',
    label: 'Faulty Workmanship Coverage - Contractors Errors and Omissions',
    price: 30,
    help: 'Faulty Workmanship Coverage - Contractors Errors and Omissions: Provides a $10,000 limit to protect you against claims arising out of faulty workmanship, materials or products. These types of claims will be excluded under your policy unless you elect to add this coverage.',
  },
  {
    key: 'toolsEquipment',
    label: 'Contractors Miscellaneous Tools and Small Equipment Coverage Miscellaneous Tools and Small Equipment (values under $1,500)',
    help: 'This coverage is intended to cover hand tools, compressors, generators, nail guns, paint sprayers, cell phones and similar items. See coverage form for full description of, and limitations on, coverage.',
  },
]

export const CC_IM_CLAIMS_QUESTION =
  'Has the Applicant incurred more than $5,000 in paid Inland Marine losses (including expenses) or had more than one (1) claim in the last four (4) years?'

export const CC_IM_LIMITS = [
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '15000', label: '$15,000' },
]

export const CC_IM_DECLINED =
  'Tools coverage is not available due to claims history, however we may have another market for you. Please email IMsubs@btisinc.com or call 877-649-6682.'

// Additional insureds — two are read-only statuses, one is selectable.
export const CC_ADDITIONAL_INSUREDS = [
  {
    key: 'blanketAI',
    label: 'Blanket Additional Insured Form CG 2010 07/04 equivalent',
    status: 'Included',
    help: 'Includes Primary Wording & Waiver of Subrogation when required by written contract.',
  },
  {
    key: 'completedOps',
    label: 'Owners, Lessees or Contractors: Completed Operations CG 2037',
    status: 'Available upon request',
    help: 'Free of charge unless working for a residential general contractor and the insureds portion of the contract is over $15,000 then a $250.00 Flat and Fully earned charge applies. Service/Repair/Remodel work only (CNA & Clear Spring Only)',
  },
  {
    key: 'scheduledAI',
    label: 'Scheduled Additional Insured Endorsement CG 20 10 11/85 equivalent',
    price: 500,
    help: 'Add Scheduled Additional Insured Endorsement for Commercial Projects Only: This endorsement (CG 2010 11/85 equivalent) can only be used for commercial projects. It would be used when you are required to value another party and they require a completed operations additional insured form.',
  },
]

export const CC_OPTIONAL = [
  {
    key: 'terrorism',
    label: 'Terrorism Coverage',
    price: 100,
    help: 'Terrorism Coverage: In accordance with the federal Terrorism Risk Insurance Act, we are required to provide you with a notice disclosing the portion of your premium, if any, attributable to coverage for terrorist acts certified under the Terrorism Risk Insurance Act. The portion of your premium attributable to such coverage is shown in the Schedule of this endorsement or in the policy Declarations.',
  },
  {
    key: 'earthMovement',
    label: 'Remove Earth Movement Exclusion 49-0100',
    price: 14,
    help: 'Remove Earth Movement Exclusion 49-0100 (Subsidence)- Normally your policy does not cover damages caused by earthquake, landslide, subsidence, mud flow, sinkhole, erosion, or sinking, shifting, expanding, vibrating or contracting of earth or soil. This allows that exclusion to be removed from your policy.',
  },
  {
    key: 'perProjectAggregate',
    label: 'Per Project Aggregate',
    price: 250,
    help: 'Per Project Aggregate: This allows you to apply a separate general aggregate limit (the maximum amount the insurer will pay for damages during the policy period) to each separate project you work on during the policy period.',
  },
  {
    key: 'employeeBenefits',
    label: 'Employee Benefits Liability',
    price: 250,
    help: "Employee Benefits Liability: This provides up to $1,000,000 in coverage for negligent acts, errors or omissions in the handling of your employee's benefits program(s).",
    subLabel: 'Select Employee Benefits Limit',
    subOptions: [{ value: '1000000', label: '$1,000,000' }],
  },
  {
    key: 'removeELExclusion',
    label: "Remove Form 49-0103 Amendment – Employer's Liability Exclusion",
    included: true,
    help: "Remove Form 49-0103 Amendment – Employers Liability Exclusion (Action Over): Action Over is a type of action in which an injured employee, after having collected workers compensation benefits from the employer, sues a third party for contributing to the employee's injury. Then, due to a contractual relationship between the third party and the employer, the liability is passed back to the employer. These types of claims will be excluded under your policy unless this exclusion is removed.",
  },
]

// The fee the legacy premium breakdown adds to every quote.
export const BTIS_POLICY_FEE = 150

/* ── Review & Select Payment ─────────────────────────────────────── */

export const PAYMENT_METHODS = [
  {
    key: 'direct-bill',
    label: 'Direct Bill',
    by: 'by BTIS DirectPay',
    desc: 'Automatic renewals with 1 pay or 10 pay options.',
    recommended: true,
  },
  {
    key: 'premium-financing',
    label: 'Paperless Premium Financing',
    desc: 'Down payment with 10 monthly installments.',
  },
  {
    key: 'agency-bill',
    label: 'Agency Bill',
    desc: 'The agency bills the insured and collects premium.',
  },
]
