// Limits / deductible menus and carrier paper status, as returned by the
// staging quote. The live flow filters these per carrier off the payload —
// add rows here only when the API actually returns them.
export const LIMIT_OPTIONS = [
  { value: '1M/2M/2M', label: '1M/2M/2M', factor: 1.00 },
]

export const DEDUCTIBLE_OPTIONS = [
  { value: '0', label: '$0', factor: 1.00 },
]

export const CARRIER_PAPER = {
  rli: 'Admitted',
  bravado: 'Non-Admitted',
}
