// Dropdown option sets for the Contractor GL intake, transcribed from the
// live BTIS Marketplace form.

// Years of Experience — 19+ down to 2. The list stops at 2 years: a
// contractor with less than two years of trade experience is not quotable
// here, so there is deliberately no "1 year" / "New" option.
export const YEARS_OF_EXPERIENCE = [
  { value: '19+', label: '19+ years' },
  ...Array.from({ length: 17 }, (_, i) => {
    const y = 18 - i // 18 → 2
    return { value: String(y), label: `${y} years` }
  }),
]

// Years in Business — 19+ down to 1, then brand-new businesses.
export const YEARS_IN_BUSINESS = [
  { value: '19+', label: '19+ years in business' },
  ...Array.from({ length: 17 }, (_, i) => {
    const y = 18 - i // 18 → 2
    return { value: String(y), label: `${y} years in business` }
  }),
  { value: '1', label: '1 year in business' },
  { value: 'new', label: 'New In Business' },
]

export const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

// Prior Insurance History — a three-level tree. Groups are expandable
// headers, only leaves are selectable. Labels repeat across branches
// (e.g. "Claim in last year, lapse"), so every leaf carries its own id.
export const PRIOR_INSURANCE_TREE = [
  {
    id: 'no-lapse-no-claims',
    label: 'No lapse, no claims',
    children: [
      { id: 'nl-4plus', label: '4+ years of coverage, no lapse and no losses' },
      { id: 'nl-3',     label: '3 years of coverage, no lapse and no losses' },
      { id: 'nl-2',     label: '2 years of coverage, no lapse and no losses' },
      { id: 'nl-1',     label: '1 year of coverage, no lapse and no losses' },
    ],
  },
  { id: 'lapse60-4plus-lossfree',  label: '60+ days lapse, 4+ year loss free' },
  { id: 'lapse159-4plus-lossfree', label: '1-59 days lapse, 4+ years loss free' },
  { id: 'no-prior',                label: 'No prior insurance' },
  {
    id: 'claim-past-4',
    label: 'Claim in the past 4 year(s)',
    children: [
      {
        id: 'claim-no-lapse',
        label: 'No lapse in Coverage',
        children: [
          { id: 'cnl-last-year', label: 'Claim in last year, no lapse' },
          { id: 'cnl-3',         label: '3 years of coverage, no lapse and no losses' },
          { id: 'cnl-2',         label: '2 years of coverage, no lapse and no losses' },
          { id: 'cnl-1',         label: '1 year of coverage, no lapse and no losses' },
        ],
      },
      {
        id: 'claim-lapse-159',
        label: '1-59 days lapse in coverage',
        children: [
          { id: 'cl159-last-year', label: 'Claim in last year, lapse' },
          { id: 'cl159-3',         label: '1-59 days lapse, 3 years loss free' },
          { id: 'cl159-2',         label: '1-59 days lapse, 2 years loss free' },
          { id: 'cl159-1',         label: '1-59 days lapse, 1 year loss free' },
        ],
      },
      {
        id: 'claim-lapse-60',
        label: '60+ days lapse in coverage',
        children: [
          { id: 'cl60-last-year', label: 'Claim in last year, lapse' },
          { id: 'cl60-3',         label: '60+ days lapse, 3 years loss free' },
          { id: 'cl60-2',         label: '60+ days lapse, 2 years loss free' },
          { id: 'cl60-1',         label: '60+ days lapse, 1 year loss free' },
        ],
      },
    ],
  },
]

// Flat lookup so the trigger can render the selected leaf's label.
export const PRIOR_INSURANCE_LEAVES = (() => {
  const out = {}
  const walk = (nodes) => nodes.forEach(n => {
    if (n.children) walk(n.children)
    else out[n.id] = n.label
  })
  walk(PRIOR_INSURANCE_TREE)
  return out
})()
