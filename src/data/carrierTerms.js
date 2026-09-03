// Per-carrier quote terms, transcribed from the BTIS Price Indication page.
// Limits, deductible and the feature list all differ by carrier, so they are
// keyed by carrier id rather than shared. Add options here only when the
// quote payload actually returns them.
export const CARRIER_TERMS = {
  rli: {
    paper: 'Admitted',
    limits: [
      { value: '300K/600K', label: '300K/600K', factor: 0.78 },
      { value: '500K/1M',   label: '500K/1M',   factor: 0.88 },
      { value: '1M/2M',     label: '1M/2M',     factor: 1.00 },
    ],
    deductibles: [
      { value: '1000', label: '$1,000', factor: 1.00 },
      { value: '2500', label: '$2,500', factor: 0.93 },
    ],
    features: [
      { ok: true,  label: 'Admitted, Rated A+ (Superior) by AM Best' },
      { ok: true,  label: 'Limits up to $1M/$2M/$2M' },
      { ok: true,  label: 'Blanket AI (Waiver Incl.)' },
      { ok: false, label: 'Remove Class Limitation' },
      { ok: false, label: 'Faulty Workmanship' },
      { ok: true,  label: 'CG 2037 Allow New Res.' },
    ],
  },
  bravado: {
    paper: 'Non-Admitted',
    limits: [{ value: '1M/2M/2M', label: '1M/2M/2M', factor: 1.00 }],
    deductibles: [{ value: '0', label: '$0', factor: 1.00 }],
    features: [
      { ok: true,  label: 'Non-Admitted, Rated A- (Excellent) by AM Best' },
      { ok: true,  label: 'Limits up to $1M/$2M/$2M' },
      { ok: true,  label: 'Blanket AI (Waiver Included)' },
      { ok: false, label: 'Remove Class Limitation' },
      { ok: true,  label: 'Faulty Workmanship' },
      { ok: true,  label: 'CG 2037 Allow New Res' },
    ],
  },
}

// The marketplace opens on the highest limit it can write, not the first row.
const DEFAULTS = {
  rli:     { limit: '1M/2M',    deductible: '1000' },
  bravado: { limit: '1M/2M/2M', deductible: '0' },
}

export const defaultTermsFor = (carrierId) => {
  const t = CARRIER_TERMS[carrierId]
  return DEFAULTS[carrierId] ?? { limit: t?.limits[0]?.value, deductible: t?.deductibles[0]?.value }
}

const factor = (options, value) => options?.find(o => o.value === value)?.factor ?? 1

export const premiumWithTerms = (quote, terms) => {
  const t = CARRIER_TERMS[quote.id]
  return Math.round(
    quote.premium * factor(t?.limits, terms?.limit) * factor(t?.deductibles, terms?.deductible)
  )
}
