import { useState } from 'react'
import { Select, Checkbox, InfoTip, YesNo } from '../../components/FormField'
import {
  CC_DEDUCTIBLES, CC_GL_LIMITS, CC_DAMAGES_TO_PREMISES, CC_MEDICAL_LIMITS, CC_LIMIT_HELP,
  CC_RECOMMENDED, CC_IM_CLAIMS_QUESTION, CC_IM_LIMITS, CC_IM_DECLINED,
  CC_ADDITIONAL_INSUREDS, CC_OPTIONAL,
} from '../../data/coverageOptions'

function Heading({ children }) {
  return (
    <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase mb-3 pb-2" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--line-strong)' }}>
      {children}
    </h3>
  )
}

// One coverage line: label on the left, help bubble, then either a price-bearing
// checkbox or a read-only status, the way the legacy rows read.
function CoverageRow({ label, help, status, price, included, checked, pricing, onChange, children }) {
  return (
    <div className="py-2.5" style={{ borderBottom: '1px solid var(--line-soft)' }}>
      <div className="flex items-start gap-3">
        {/* The bubble sits at the end of the label, as it does everywhere else.
            A div, not a p — the tooltip panel carries block content. */}
        <div className="flex-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          {label}
          <span className="inline-flex align-middle ml-1.5 -mt-px">
            <InfoTip title={label}>{help}</InfoTip>
          </span>
        </div>
        <div className="shrink-0 w-[150px] flex items-center gap-2 justify-start">
          {status ? (
            <span className="text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>{status}</span>
          ) : (
            <>
              <Checkbox checked={!!checked} onChange={onChange} />
              {/* A ticked row reads "Included" until its price is back, then
                  prints the figure. Covers with no price stay on "Included",
                  and the rest just show the tick. */}
              {checked && (price != null || included) && (
                <span className="text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>
                  {price != null && !pricing ? `$${price}` : 'Included'}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

// The premium breakdown that sits beside this step on the legacy screen lives
// in the right rail here, so this page is just the coverage choices.
export default function CoverageCustomization({ form, set, errorFor }) {
  // Ticking a cover shows it as Included straight away; the figure lands once
  // the premium comes back, which is how the legacy screen behaves.
  const [pricing, setPricing] = useState(() => new Set())
  const toggle = (o) => (v) => {
    set(o.key)(v)
    if (!v || o.price == null) return
    setPricing(keys => new Set(keys).add(o.key))
    setTimeout(() => setPricing(keys => {
      const next = new Set(keys)
      next.delete(o.key)
      return next
    }), 700)
  }

  const toolsPicked = !!form.toolsEquipment
  const toolsDeclined = toolsPicked && form.imClaims === 'yes'

  return (
    <div className="space-y-6">
      <div>
        <Heading>Limits and Recommended Options</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <Select
            label="Deductible" required hint={CC_LIMIT_HELP.deductible}
            options={CC_DEDUCTIBLES}
            value={form.ccDeductible} onChange={set('ccDeductible')}
            placeholder="Select One"
            error={errorFor('ccDeductible')}
          />
          <Select
            label="GL Limits" required hint={CC_LIMIT_HELP.glLimits}
            options={CC_GL_LIMITS}
            value={form.ccGlLimits} onChange={set('ccGlLimits')}
            placeholder="Select One"
            error={errorFor('ccGlLimits')}
          />
          <Select
            label="Damages to Premises Rented to You" required hint={CC_LIMIT_HELP.damagesToPremises}
            options={CC_DAMAGES_TO_PREMISES}
            value={form.ccDamagesToPremises} onChange={set('ccDamagesToPremises')}
            placeholder="Select One"
            error={errorFor('ccDamagesToPremises')}
          />
          <Select
            label="Medical Limit" required hint={CC_LIMIT_HELP.medicalLimit}
            options={CC_MEDICAL_LIMITS}
            value={form.ccMedicalLimit} onChange={set('ccMedicalLimit')}
            placeholder="Select One"
            error={errorFor('ccMedicalLimit')}
          />
        </div>
      </div>

      <div>
        <Heading>Recommended Options</Heading>
        {CC_RECOMMENDED.map(o => (
          <CoverageRow
            key={o.key}
            label={o.label} help={o.help} price={o.price}
            checked={form[o.key]} pricing={pricing.has(o.key)} onChange={toggle(o)}
          >
            {o.key === 'toolsEquipment' && toolsPicked && (
              <div className="mt-3 pl-1 space-y-3">
                <div className="flex items-start gap-4 flex-wrap">
                  <p className="flex-1 min-w-[240px] text-[12px] italic leading-relaxed" style={{ color: '#5C2ED4' }}>
                    {CC_IM_CLAIMS_QUESTION}
                  </p>
                  <YesNo value={form.imClaims} onChange={set('imClaims')} />
                </div>

                {toolsDeclined ? (
                  <div
                    className="rounded-xl px-4 py-3 text-[12.5px] leading-relaxed"
                    style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', color: '#B91C1C' }}
                  >
                    {CC_IM_DECLINED}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[12.5px]" style={{ color: 'var(--ink-2)' }}>Select IM limits:</span>
                    <Select
                      options={CC_IM_LIMITS}
                      value={form.imLimit} onChange={set('imLimit')}
                      placeholder="Select One"
                      className="w-[180px]"
                      error={errorFor('imLimit')}
                    />
                  </div>
                )}
              </div>
            )}
          </CoverageRow>
        ))}
      </div>

      <div>
        <Heading>Additional Insureds</Heading>
        {CC_ADDITIONAL_INSUREDS.map(o => (
          <CoverageRow
            key={o.key}
            label={o.label} help={o.help} status={o.status} price={o.price}
            checked={form[o.key]} pricing={pricing.has(o.key)} onChange={toggle(o)}
          />
        ))}
      </div>

      <div>
        <Heading>Optional Coverages</Heading>
        {CC_OPTIONAL.map(o => (
          <CoverageRow
            key={o.key}
            label={o.label} help={o.help} price={o.price} included={o.included}
            checked={form[o.key]} pricing={pricing.has(o.key)} onChange={toggle(o)}
          >
            {o.subOptions && form[o.key] && (
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <span className="text-[12px] italic" style={{ color: '#5C2ED4' }}>{o.subLabel}</span>
                <Select
                  options={o.subOptions}
                  value={form[`${o.key}Limit`]} onChange={set(`${o.key}Limit`)}
                  placeholder="Select One"
                  className="w-[200px]"
                  error={errorFor(`${o.key}Limit`)}
                />
              </div>
            )}
          </CoverageRow>
        ))}
      </div>
    </div>
  )
}
