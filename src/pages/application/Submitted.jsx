import { useMemo, useState } from 'react'
import { BRAND_GRADIENT } from '../../components/FormField'
import sellMoreBg from '../../assets/sell-more-bg.png'
import Confetti from '../../components/Confetti'
import CrossSell from '../../components/CrossSell'
import CarrierMark from '../../components/CarrierMark'
// The same panels the review step reads back with — one copy, so the two
// cannot drift. The receipt shows no pencils, so it passes no action.
import { Panel, Row } from '../../components/SummaryPanel'
import { formatUSD } from '../../lib/rating'
import { CARRIER_TERMS } from '../../data/carrierTerms'
import { computeBreakdown } from '../../components/PremiumBreakdown'
import { CLASS_CODES } from '../../data/classCodes'
import { rulesForCodes, needsUnderwriterReview, ruleAnswers } from '../../data/conditionalQuestions'
import {
  STRUCTURE_OF_BUSINESS,
  APP_LIMITS, APP_DEDUCTIBLES,
} from '../../data/applicationOptions'
import {
  CC_RECOMMENDED, CC_ADDITIONAL_INSUREDS, CC_OPTIONAL, productOptionsFor,
} from '../../data/coverageOptions'

const labelOf = (options, value) => options.find(o => o.value === value)?.label ?? ''
const codeLabel = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? code
const yesNo = (v) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : '')
const money = (v) => (String(v ?? '').trim() ? `$${Number(String(v).replace(/\D/g, '')).toLocaleString()}` : '')

// The submission receipt, laid out the way Builder's Risk does it: no rails,
// one headed card, then the application read back in panels.
export default function Submitted({ submissionNumber, quote, amount, form = {}, rows = [], onStartOver, dark = false }) {
  // Where the submission came from, so the banner sends it back there rather
  // than always to Norbielink. A referrer from another origin is the page the
  // agent was on — Legacy, the marketplace, wherever. With none (a direct
  // visit, or a link that stripped it) there is nowhere to return to, so the
  // banner keeps its old job of starting the quote over.
  const cameFrom = useMemo(() => {
    try {
      const ref = document.referrer
      if (!ref) return null
      const url = new URL(ref)
      if (url.origin === window.location.origin) return null
      return { href: ref, host: url.hostname.replace(/^www\./, '') }
    } catch {
      return null
    }
  }, [])

  const printIdle = dark
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
    : { background: 'white', border: '1px solid #E5E7EB' }
  const trades = form.subTrades || []
  // Everything ticked on Coverage Customization, which is where the covers
  // are actually chosen now.
  // They filled all of this in a screen ago and cannot change it now, so the
  // read-back is folded away — open for whoever wants to check it.
  const [detailOpen, setDetailOpen] = useState(false)
  const carrier = quote?.carrier ?? 'The carrier'
  const inReview =
    form.agreeTerms === 'no' ||
    needsUnderwriterReview(rulesForCodes(rows.map(r => r.code).filter(Boolean)), form)

  // Three outcomes, and the wording follows what actually happened. An upload
  // carries the signed application with it, so it binds on the spot; eSign
  // cannot bind until the insured signs, so the request is pending until they
  // do; and a referral is neither, it is with an underwriter.
  const outcome = inReview ? 'review' : form.signMethod === 'upload' ? 'bound' : 'pending'
  // The top of this page says thank you first and what happened second —
  // there is nothing left for anyone to do here.
  const headline = {
    review: 'Thank you — this risk has been referred.',
    bound: "Thank you — you're bound!",
    pending: 'Thank you — your bind request is in.',
  }[outcome]
  const statusLabel = {
    review: 'In Review',
    bound: 'Bound',
    pending: 'Bind Request Pending',
  }[outcome]
  const subline = {
    review: `An underwriter at ${carrier} is reading it through — you'll hear back shortly.`,
    bound: `${carrier} has the signed application. Check your email for the confirmation.`,
    pending: `${carrier} has the application, and the insured has been emailed to sign. It binds as soon as they do.`,
  }[outcome]
  const carrierLine = {
    review: `Sent to ${carrier}`,
    bound: `Policy bound with ${carrier}`,
    pending: `Bind requested with ${carrier}`,
  }[outcome]

  // Builder's Risk closes its header with a row naming the carrier and the
  // money. Theirs says "Policy bound with X · Charged today"; ours says what
  // was actually sent, and what the total comes to once it is.
  const { totalDue } = computeBreakdown(form, amount)
  const paper = CARRIER_TERMS[quote?.id]?.paper

  const picked = [
    ...CC_RECOMMENDED,
    ...CC_ADDITIONAL_INSUREDS.filter(o => o.price),
    ...CC_OPTIONAL,
    ...productOptionsFor(form.state),
  ].filter(o => form[o.key])

  return (
    <div className="space-y-5 md:space-y-6">
      <Confetti />
          <div id="submission-print-area" className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-card)', border: '1px solid var(--line-soft)' }}>
            <div className="h-1" style={{ background: BRAND_GRADIENT }} />

            <div className="flex items-start gap-4 px-6 pt-5 pb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                // A 12% deep purple all but disappears on navy. Dark takes
                // the lavender pair the rest of the dark UI uses, and enough
                // of it to read as a chip.
                style={{
                  background: dark
                    ? 'linear-gradient(88.09deg, rgba(167,139,250,0.22) 0%, rgba(232,121,249,0.22) 100%)'
                    : 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)',
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="subCheckG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={dark ? '#A78BFA' : '#5C2ED4'} /><stop offset="100%" stopColor={dark ? '#E879F9' : '#A614C3'} />
                    </linearGradient>
                  </defs>
                  <path d="M5 13l4 4L19 7" stroke="url(#subCheckG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{headline}</h1>
                <p className="text-xs text-gray-400 leading-relaxed">{subline}</p>
              </div>

              <button
                type="button"
                title="Print / Save as PDF"
                onClick={() => setTimeout(() => window.print(), 50)}
                className="screen-only w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={printIdle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { background: dark ? 'rgba(167,139,250,0.15)' : 'rgba(92,46,212,0.06)', borderColor: 'rgba(92,46,212,0.3)' })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, printIdle)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="hdrPrintG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={dark ? '#A78BFA' : '#5C2ED4'} /><stop offset="100%" stopColor={dark ? '#E879F9' : '#A614C3'} />
                    </linearGradient>
                  </defs>
                  <path
                    stroke="url(#hdrPrintG)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100" style={{ borderTop: '1px solid var(--line-soft)' }}>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Submission Number
                </p>
                <p className="text-sm font-bold text-gradient">{submissionNumber}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Effective Date
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{form.effectiveDate || '—'}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9CA3AF' }}>
                  Status
                </p>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full dot-brand" />
                  <span className="text-sm font-bold text-gradient">{statusLabel}</span>
                </span>
              </div>
            </div>

            {quote && (
              <div
                className="flex items-center gap-4 flex-wrap px-6 py-4"
                style={{ borderTop: '1px solid var(--line-soft)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                    {carrierLine}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Program: <span className="font-semibold">{quote.product}</span>
                    {paper && <>{' · '}{paper}</>}
                    {' · '}Premium {formatUSD(Math.round(amount))}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {/* Nothing is due on a referral — the underwriter has not
                        priced it yet, so the figure is still an indication. */}
                    {outcome === 'review' ? 'Indicated Total' : 'Total Due'}
                  </div>
                  <div className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{formatUSD(totalDue)}</div>
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--line-soft)' }}>
              <button
                type="button"
                onClick={() => setDetailOpen(o => !o)}
                className="screen-only w-full px-5 py-3.5 flex items-center justify-between gap-3 transition hover:opacity-80"
              >
                <span className="text-[12.5px] font-semibold" style={{ color: 'var(--ink-2)' }}>
                  {detailOpen ? 'Hide the submitted details' : 'See the submitted details'}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: detailOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Printing is the one time the whole thing should be there
                  whether or not it is open on screen. */}
              <div className={detailOpen ? '' : 'hidden print:block'}>
              <div className="px-5 pb-5">
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

                  <Panel title="Optional Coverages" icon="addon">
                    {picked.length === 0
                      ? <Row label="Selected" value="None" />
                      : picked.map(c => (
                          <Row
                            key={c.key}
                            label={c.label}
                            value={c.subOptions
                              ? (labelOf(c.subOptions, form[`${c.key}Limit`]) || 'Yes')
                              : 'Yes'}
                          />
                        ))}
                  </Panel>

                  {/* The eligibility step was missing from the receipt
                      altogether — neither the agreement nor the description
                      was printed. Same rows as the review panel, from the
                      same place. */}
                  <Panel title="Eligibility Statements" icon="checklist">
                    <Row label="Terms Agreement Response" value={yesNo(form.agreeTerms)} />
                    {form.agreeTerms === 'no' && <Row label="Explanation" value={form.agreeExplanation} />}
                    <Row label="Description of Operations" value={form.operationsDescription} />
                    {ruleAnswers(rows.filter(r => r.code).map(r => r.code), form).map(a => (
                      <Row key={a.label} label={a.label} value={a.value} />
                    ))}
                  </Panel>

                </div>
              </div>
              </div>
            </div>
          </div>

      {/* Commercial Auto closes its submission on the cross-sell, above the
          banner out. Same place here. */}
      <CrossSell />

      {/* Builder's Risk closes on this rather than a button: the jungle banner
          out. It names wherever the submission came in from. */}
      <div
        className="screen-only rounded-2xl relative cursor-pointer hover:opacity-95 transition overflow-hidden mb-8"
        onClick={() => (cameFrom ? window.location.assign(cameFrom.href) : onStartOver && onStartOver())}
        style={{ minHeight: 100 }}
      >
        <img src={sellMoreBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="px-8 py-6 relative z-10">
          <p className="text-lg font-bold mb-1" style={{ color: '#111827' }}>Return to the Jungle?</p>
          <p className="text-xs text-gray-400">
            Head back to{' '}
            <span className="font-semibold text-gradient underline underline-offset-2">
              {cameFrom ? cameFrom.host : 'Norbielink'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
