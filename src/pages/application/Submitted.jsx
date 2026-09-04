import { BRAND_GRADIENT } from '../../components/FormField'
import CarrierMark from '../../components/CarrierMark'
import { formatUSD } from '../../lib/rating'
import { CLASS_CODES } from '../../data/classCodes'
import {
  STRUCTURE_OF_BUSINESS, STRUCTURE_TYPES, CONSTRUCTION_TYPES,
  APP_LIMITS, APP_DEDUCTIBLES, OPTIONAL_COVERAGES,
} from '../../data/applicationOptions'

const GRAD_TEXT = {
  background: BRAND_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const ICONS = {
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1',
  doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  tools: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
}

function Panel({ title, icon = 'shield', children }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(92,46,212,0.12)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="#5C2ED4" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[icon] || ICONS.shield} />
          </svg>
        </div>
        <h3 className="text-xs font-bold" style={{ color: '#111827' }}>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  if (value === '' || value == null) return null
  return (
    <div className="flex items-center justify-between gap-4 py-1.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <span className="text-[10px] shrink-0" style={{ color: '#9CA3AF' }}>{label}</span>
      <span className="text-[10px] font-semibold text-right" style={{ color: '#111827' }}>{value}</span>
    </div>
  )
}

const labelOf = (options, value) => options.find(o => o.value === value)?.label ?? ''
const codeLabel = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? code
const yesNo = (v) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : '')
const money = (v) => (String(v ?? '').trim() ? `$${Number(String(v).replace(/\D/g, '')).toLocaleString()}` : '')

// The submission receipt, laid out the way Builder's Risk does it: no rails,
// one headed card, then the application read back in panels.
export default function Submitted({ submissionNumber, quote, amount, form = {}, rows = [], onStartOver }) {
  const pct = form.workPct || {}
  const trades = form.subTrades || []
  const picked = OPTIONAL_COVERAGES.filter(c => form[c.key] === 'yes')

  return (
    <div className="space-y-5 md:space-y-6">
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #F3F4F6' }}>
            <div className="h-1" style={{ background: BRAND_GRADIENT }} />

            <div className="flex items-start gap-4 px-6 pt-5 pb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="subCheckG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                  <path d="M5 13l4 4L19 7" stroke="url(#subCheckG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold mb-1" style={{ color: '#1F1B47' }}>Application submitted!</h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {quote?.carrier ?? 'The carrier'} has the submission.
                </p>
              </div>

              <button
                type="button"
                title="Print / Save as PDF"
                onClick={() => setTimeout(() => window.print(), 50)}
                className="no-print w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-gray-50"
                style={{ border: '1px solid #E5E7EB', background: 'white' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="hdrPrintG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                  <path
                    stroke="url(#hdrPrintG)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100" style={{ borderTop: '1px solid #F3F4F6' }}>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Submission Number
                </p>
                <p className="text-sm font-bold" style={GRAD_TEXT}>{submissionNumber}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Effective Date
                </p>
                <p className="text-sm font-bold" style={{ color: '#1F1B47' }}>{form.effectiveDate || '—'}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Status
                </p>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_GRADIENT }} />
                  <span className="text-sm font-bold" style={GRAD_TEXT}>Submitted</span>
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #F3F4F6' }}>
              <div className="px-5 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  <Panel title="Applicant" icon="user">
                    <Row label="Name" value={[form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ')} />
                    <Row label="Email" value={form.email} />
                    <Row label="Phone" value={form.phone} />
                    <Row label="Cell" value={form.mobile} />
                    <Row label="Address" value={[form.street, form.suite].filter(Boolean).join(', ')} />
                    <Row label="City / State / Zip" value={[form.city, form.state, form.postalCode].filter(Boolean).join(', ')} />
                  </Panel>

                  <Panel title="Business" icon="building">
                    <Row label="Legal Name" value={form.legalName} />
                    <Row label="Contractor Licence" value={form.licenseNumber} />
                    <Row label="Structure" value={labelOf(STRUCTURE_OF_BUSINESS, form.entityType)} />
                    <Row label="Active Owners" value={form.activeOwners} />
                    <Row label="Annual Gross Receipts" value={money(form.grossReceipts)} />
                    <Row label="Years in Business" value={form.yearsInBusiness} />
                    <Row label="Years of Experience" value={form.yearsOfExperience} />
                  </Panel>

                  <Panel title="Classifications" icon="doc">
                    {rows.filter(r => r.code).map(r => (
                      <Row key={r.code} label={codeLabel(r.code)} value={`${r.percentage || 0}%`} />
                    ))}
                  </Panel>

                  <Panel title="Coverage" icon="shield">
                    <Row label="Carrier" value={quote?.carrier} />
                    <Row label="Limits" value={labelOf(APP_LIMITS, form.appLimit)} />
                    <Row label="Deductible" value={labelOf(APP_DEDUCTIBLES, form.appDeductible)} />
                    <Row label="Annual Premium" value={amount != null ? formatUSD(amount) : ''} />
                  </Panel>

                  <Panel title="Operations" icon="tools">
                    {/* Only read back the follow-ups whose question was answered
                        yes — otherwise a toggle switched to No still prints the
                        figures it was asked for. */}
                    <Row label="Employees" value={yesNo(form.hasEmployees)} />
                    {form.hasEmployees === 'yes' && (
                      <>
                        <Row label="Number of Employees" value={form.employeeCount} />
                        <Row label="Annual Employee Payroll" value={money(form.employeePayroll)} />
                      </>
                    )}
                    <Row label="Hires Subcontractors" value={yesNo(form.hiresSubs)} />
                    {form.hiresSubs === 'yes' && (
                      <>
                        <Row label="Annual Subcontracting Costs" value={money(form.subContractingCosts)} />
                        <Row label="Subcontracted Family Dwellings" value={form.subDwellingPct ? `${form.subDwellingPct}%` : ''} />
                      </>
                    )}
                    <Row label="Trades" value={[...trades, form.subTradesOther].filter(Boolean).join(', ')} />
                  </Panel>

                  <Panel title="% of Work" icon="doc">
                    {[...STRUCTURE_TYPES, ...CONSTRUCTION_TYPES]
                      .filter(r => pct[r.key])
                      .map(r => <Row key={r.key} label={r.label} value={`${pct[r.key]}%`} />)}
                  </Panel>

                  <Panel title="Optional Coverages" icon="shield">
                    {picked.length === 0
                      ? <Row label="Selected" value="None" />
                      : picked.map(c => <Row key={c.key} label={c.label} value="Yes" />)}
                  </Panel>

                  <Panel title="General Questions" icon="clock">
                    <Row label="Works Out of State" value={yesNo(form.worksOutOfState)} />
                    {form.worksOutOfState === 'yes' && <Row label="States" value={form.outOfStateList} />}
                    <Row label="Other Entity" value={yesNo(form.otherEntity)} />
                    {form.otherEntity === 'yes' && <Row label="Other Entity Detail" value={form.otherEntityDetail} />}
                    <Row label="Prior Claims" value={yesNo(form.priorClaims)} />
                    <Row
                      label="Disclosures"
                      value={(form.disclosures || {}).none ? 'None' : Object.values(form.disclosures || {}).filter(Boolean).length || ''}
                    />
                  </Panel>

                </div>
              </div>
            </div>
          </div>

      <div className="flex justify-center no-print pb-4">
        <button
          type="button"
          onClick={onStartOver}
          className="px-8 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
        >
          Start a New Quote
        </button>
      </div>
    </div>
  )
}
