import { Panel, Row } from '../../components/SummaryPanel'
import { computeBreakdown } from '../../components/PremiumBreakdown'
import { formatUSD } from '../../lib/rating'
import {
  CC_DEDUCTIBLES, CC_GL_LIMITS, CC_DAMAGES_TO_PREMISES, CC_MEDICAL_LIMITS, CC_IM_LIMITS,
  CC_RECOMMENDED, CC_ADDITIONAL_INSUREDS, CC_OPTIONAL, BTIS_POLICY_FEE,
} from '../../data/coverageOptions'

const labelOf = (options, value) => options.find(o => (o.value ?? o) === value)?.label ?? ''

// What "Download Quick Quote" hands over: the cover as it stands and what it
// costs — not the whole application, which is the other download.
export default function QuoteSummary({ form = {}, quote, amount = 0, submissionNumber }) {
  const { glPremium, brokerFee, grossTotal, totalDue, pending } = computeBreakdown(form, amount)
  const picked = [
    ...CC_RECOMMENDED,
    ...CC_ADDITIONAL_INSUREDS.filter(o => o.price),
    ...CC_OPTIONAL,
  ].filter(o => form[o.key])

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4 pb-1">
        <div>
          <p className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>Quick Quote</p>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
            {[form.dba || form.legalName, quote?.carrier].filter(Boolean).join(' · ')}
          </p>
        </div>
        {submissionNumber && (
          <p className="text-[10px] font-semibold" style={{ color: '#9CA3AF' }}>{submissionNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel title="Coverage" icon="shield">
          <Row label="Carrier" value={quote?.carrier} />
          <Row label="Effective Date" value={form.effectiveDate} />
          <Row label="GL Limits" value={labelOf(CC_GL_LIMITS, form.ccGlLimits)} />
          <Row label="Deductible" value={labelOf(CC_DEDUCTIBLES, form.ccDeductible)} />
          <Row label="Damage Limits" value={labelOf(CC_DAMAGES_TO_PREMISES, form.ccDamagesToPremises)} />
          <Row label="Medical Limits" value={labelOf(CC_MEDICAL_LIMITS, form.ccMedicalLimit)} />
        </Panel>

        <Panel title="Selected Coverages" icon="tools">
          <Row label="Blanket Additional Insured form" value="Included" />
          {picked.map(o => (
            <Row key={o.key} label={o.label} value={o.price != null ? `$${o.price}` : 'Included'} />
          ))}
          {form.toolsEquipment && form.imLimit && (
            <Row label="Inland Marine limit" value={labelOf(CC_IM_LIMITS, form.imLimit)} />
          )}
        </Panel>
      </div>

      <Panel title="Premium" icon="doc">
        <Row label="GL Premium" value={formatUSD(glPremium)} />
        <Row label="BTIS Policy Fee" value={formatUSD(BTIS_POLICY_FEE)} />
        <Row label="Gross Total" value={pending ? '---' : formatUSD(grossTotal)} />
        <Row label="Broker Fee" value={formatUSD(brokerFee)} />
        <Row label="Total Due" value={pending ? '---' : formatUSD(totalDue)} />
      </Panel>
    </div>
  )
}
