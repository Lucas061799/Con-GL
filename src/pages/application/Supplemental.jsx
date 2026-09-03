import { Input, CurrencyInput, Select, Checkbox, PercentInput, ToggleQuestion, InfoTip } from '../../components/FormField'
import { FieldGroup, QuestionCard } from '../../components/Section'
import {
  STRUCTURE_TYPES, CONSTRUCTION_TYPES, SUBCONTRACTOR_TRADES,
  SUBCONTRACTOR_COMPLIANCE, OPTIONAL_COVERAGES, APP_LIMITS, APP_DEDUCTIBLES,
} from '../../data/applicationOptions'

function PercentColumn({ title, rows, values, onChange }) {
  const total = rows.reduce((sum, r) => sum + (Number(values[r.key]) || 0), 0)
  return (
    <div>
      <div className="flex items-baseline gap-2 pb-3" style={{ borderBottom: '1px solid #D1D5DB' }}>
        <p className="text-[14px] font-bold text-navy">{title}</p>
        <span className={`text-[13px] font-bold ${total === 100 ? 'text-navy' : 'text-red-500'}`}>{total}%</span>
        <span className="text-[12px] text-gray-400">(Must equal 100%)</span>
      </div>
      {rows.map(r => {
        const used = Number(values[r.key]) > 0
        return (
          <div key={r.key} className="py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[14px] text-navy">{r.label}</span>
              <PercentInput
                value={values[r.key]}
                onChange={(v) => onChange(r.key, v)}
                className="w-[110px]"
              />
            </div>
            {r.disallowed && used && (
              <p className="text-[12px] text-red-500 mt-1.5 text-right">{r.disallowed}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Supplemental({ form, set, errorFor, setWorkPct, claims, setClaims }) {
  const toggleTrade = (trade) => set('subTrades')(
    (form.subTrades || []).includes(trade)
      ? form.subTrades.filter(t => t !== trade)
      : [...(form.subTrades || []), trade]
  )
  const updateClaim = (i, patch) => setClaims(cs => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))

  return (
    <>
      <FieldGroup label="% of Work">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <PercentColumn
            title="Structure Type" rows={STRUCTURE_TYPES}
            values={form.workPct || {}} onChange={setWorkPct}
          />
          <PercentColumn
            title="Construction Type" rows={CONSTRUCTION_TYPES}
            values={form.workPct || {}} onChange={setWorkPct}
          />
        </div>
      </FieldGroup>

      <FieldGroup label="Subcontractors">
        <p className="text-[13px] italic text-gray-500 mb-4">Select the list of trades of the subcontractors.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
          {SUBCONTRACTOR_TRADES.map(trade => (
            <Checkbox
              key={trade}
              label={trade}
              checked={(form.subTrades || []).includes(trade)}
              onChange={() => toggleTrade(trade)}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-5">
          <span className="text-[14px] text-navy">Other</span>
          <Input value={form.subTradesOther} onChange={set('subTradesOther')} className="max-w-[380px] flex-1" />
        </div>
      </FieldGroup>

      <FieldGroup label="Compliance">
        <p className="text-[14px] font-bold text-navy mb-3">
          Mark the checkbox confirming that the applicant will comply with:
        </p>
        <div className="space-y-3">
          {SUBCONTRACTOR_COMPLIANCE.map(c => (
            <Checkbox
              key={c.key}
              label={c.label}
              checked={!!form[c.key]}
              onChange={set(c.key)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-10 mt-6">
          <Select
            label="Select Deductible"
            options={APP_DEDUCTIBLES}
            value={form.appDeductible} onChange={set('appDeductible')}
            placeholder="Select One"
            className="w-[220px]"
          />
          <Select
            label="Please select Limits"
            options={APP_LIMITS}
            value={form.appLimit} onChange={set('appLimit')}
            placeholder="Select One"
            className="w-[260px]"
          />
        </div>
      </FieldGroup>

      <QuestionCard>
        <ToggleQuestion
          label="Has the applicant had any prior claims?"
          value={form.priorClaims} onChange={set('priorClaims')}
        >
          <div className="grid grid-cols-[140px_1fr_200px] gap-4 pb-2" style={{ borderBottom: '1px solid #D1D5DB' }}>
            {['Year', 'Nature of Loss or Claim', 'Amount'].map(h => (
              <p key={h} className="text-[13px] font-bold text-navy">{h}</p>
            ))}
          </div>
          {claims.map((c, i) => (
            <div key={i} className="grid grid-cols-[140px_1fr_200px] gap-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <Input value={c.year} onChange={(v) => updateClaim(i, { year: v.replace(/\D/g, '').slice(0, 4) })} />
              <Input value={c.nature} onChange={(v) => updateClaim(i, { nature: v })} />
              <CurrencyInput value={c.amount} onChange={(v) => updateClaim(i, { amount: v })} />
            </div>
          ))}
        </ToggleQuestion>
      </QuestionCard>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
          Please select following coverages
        </p>
        <div className="space-y-2">
          {OPTIONAL_COVERAGES.map(cov => (
            <QuestionCard key={cov.key}>
              <div className="flex items-start justify-between gap-6">
                <p className="text-[14px] text-navy leading-snug">
                  {cov.label}
                  <span className="inline-flex align-middle ml-1.5 -mt-px">
                    <InfoTip title={cov.label}><p>{cov.help}</p></InfoTip>
                  </span>
                </p>
                <div className="shrink-0">
                  <ToggleQuestion value={form[cov.key]} onChange={set(cov.key)} />
                </div>
              </div>

              {cov.options && form[cov.key] === 'yes' && (
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  {cov.options.map(o => (
                    <Checkbox
                      key={o.key}
                      label={o.label}
                      checked={!!form[o.key]}
                      onChange={set(o.key)}
                    />
                  ))}
                </div>
              )}
            </QuestionCard>
          ))}
        </div>
      </div>
    </>
  )
}
