import { useState } from 'react'
import { Select, Checkbox, InfoTip, YesNo } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import {
  CC_DEDUCTIBLES, CC_GL_LIMITS, CC_DAMAGES_TO_PREMISES, CC_MEDICAL_LIMITS, CC_LIMIT_HELP,
  CC_RECOMMENDED, CC_IM_CLAIMS_QUESTION, CC_IM_LIMITS, CC_IM_DECLINED,
  CC_ADDITIONAL_INSUREDS, CC_OPTIONAL, productOptionsFor,
} from '../../data/coverageOptions'

// Small uppercase label, no rule — the section title already has one.
function Heading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
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
        {/* These labels are long enough to wrap, which leaves a bubble trailing
            the text stranded mid-row. It rides with the checkbox instead, so
            every row's bubble lines up in one column. */}
        <div className="flex-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          {label}
        </div>
        <div className="shrink-0 w-[150px] flex items-center gap-2 justify-start">
          <InfoTip title={label}>{help}</InfoTip>
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
      {/* An input cluster, so it takes the house box. */}
      <FieldGroup label="Limits and Recommended Options">
        <div className="cc-limits grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
      </FieldGroup>

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
                  <p className="flex-1 min-w-[240px] text-[12px] italic leading-relaxed text-accent">
                    {CC_IM_CLAIMS_QUESTION}
                  </p>
                  <YesNo value={form.imClaims} onChange={set('imClaims')} />
                </div>

                {toolsDeclined ? (
                  <div
                    className="notice-danger rounded-xl px-4 py-3 text-[12.5px] leading-relaxed"
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
        {/* Stop Gap is only written where workers compensation is run by the
            state, so it appears once the risk state says so. */}
        {[...CC_OPTIONAL, ...productOptionsFor(form.state)].map(o => (
          <CoverageRow
            key={o.key}
            label={o.label} help={o.help} price={o.price} included={o.included}
            checked={form[o.key]} pricing={pricing.has(o.key)} onChange={toggle(o)}
          >
            {o.subOptions && form[o.key] && (
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <span className="text-[12px] italic text-accent">{o.subLabel}</span>
                <Select
                  options={o.subOptions}
                  value={form[`${o.key}Limit`]} onChange={set(`${o.key}Limit`)}
                  placeholder="Select One"
                  // The tool floater spells its deductible out in the option, so give the
                  // trigger the room to keep each line whole.
                  className={o.subOptions.some(x => x.label.length > 20) ? 'w-[380px] max-w-full' : 'w-[200px]'}
                  error={errorFor(`${o.key}Limit`)}
                />
              </div>
            )}
          </CoverageRow>
        ))}
      </div>

      {/* The figures move as covers are ticked, and they live in the rail —
          grey type at the foot of a long page was too easy to scroll past. */}
      <div className="notice-brand rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="ccNoteG" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
              <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9" stroke="url(#ccNoteG)" />
          <path d="M12 8v5" stroke="url(#ccNoteG)" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="0.6" fill="url(#ccNoteG)" />
        </svg>
        <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          Every cover you add updates the{' '}
          <span className="font-bold" style={{ color: 'var(--ink)' }}>Premium Breakdown</span>{' '}
          on the right — check it, then submit from there.
        </p>
      </div>
    </div>
  )
}
