import { useState, useEffect, useMemo } from 'react'
import norbielinkLogo from '../assets/norbielink-logo.png'
import btisLogo from '../assets/btislogo.png'
import jungleImg from '../assets/jungle.png'
import norbieContractor from '../assets/norbie-contractor.png'
import { Input, CurrencyInput, Select, SearchableSelect, TreeSelect, InfoTip, BRAND_GRADIENT } from '../components/FormField'
import CarrierMark from '../components/CarrierMark'
import { formatUSD } from '../lib/rating'
import { CLASS_CODE_OPTIONS } from '../data/classCodes'
import { FIELD_HELP } from '../data/fieldHelp'
import {
  YEARS_OF_EXPERIENCE, YEARS_IN_BUSINESS, YES_NO,
  PRIOR_INSURANCE_TREE, PRIOR_INSURANCE_LEAVES,
} from '../data/intakeOptions'
import { rateAll } from '../lib/rating'

const EMPTY = {
  dba: '', subContractingCosts: '',
  postalCode: '', yearsOfExperience: '',
  mainClassCode: '', yearsInBusiness: '',
  grossReceipts: '', priorInsurance: '',
  employeePayroll: '', newResidential: '',
}

const REQUIRED = Object.keys(EMPTY)

export default function PageZero({ onContinue }) {
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  // 'Edit answers' puts the indication overlay away so the form underneath is
  // reachable again. It re-arms once the form goes incomplete and is filled
  // back in, so a changed answer still surfaces its new price.
  const [dismissed, setDismissed] = useState(false)

  const set = (key) => (value) => setForm(f => ({ ...f, [key]: value }))

  const postalValid = /^\d{5}$/.test(form.postalCode)
  const ready = REQUIRED.every(k => String(form[k]).trim() !== '') && postalValid

  // Short delay before the indication lands so the panel doesn't flicker
  // while someone is still typing a dollar amount.
  useEffect(() => {
    if (!ready) { setLoading(false); return }
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [ready, form])

  useEffect(() => { if (!ready) setDismissed(false) }, [ready])

  const quotes = useMemo(() => (ready ? rateAll(form) : []), [ready, form])
  const showQuotes = ready && !loading

  const errorFor = (key) => {
    if (!touched) return false
    if (key === 'postalCode') {
      if (!form.postalCode.trim()) return true
      return postalValid ? false : 'Enter a 5-digit ZIP code'
    }
    return String(form[key]).trim() === ''
  }

  const submit = () => {
    setTouched(true)
    if (!ready || loading) return
    onContinue?.({ form, quotes })
  }

  return (
    <div className="h-screen bg-white font-montserrat flex flex-col overflow-hidden">
      <header
        className="flex items-center justify-between bg-white border-b border-gray-100 px-6 md:px-8 shrink-0"
        style={{ height: 56 }}
      >
        <img src={norbielinkLogo} alt="NorbieLink" className="h-8" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 tracking-wide font-semibold">POWERED BY</span>
          <img src={btisLogo} alt="btis" className="h-6" />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* Left — intake */}
        <div className="flex-1 lg:w-1/2 lg:flex-none overflow-y-auto custom-scroll relative"
          style={{ borderRight: '1px solid #F3F4F6' }}>
          <img
            src={jungleImg} alt=""
            className="lg:hidden absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ opacity: 0.06 }}
          />
          <div className="relative z-10 min-h-full flex flex-col justify-center items-center py-10 px-6 md:px-[8%] lg:px-[10%]">
          <div className="w-full max-w-xl">
            {/* Landing type scale, identical to Builder's Risk and Commercial Auto. */}
            <div className="mb-6">
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-gradient mb-2 md:mb-3">
                Contractor General Liability
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-2 md:mb-3">
                Get Multiple Quotes.<br />
                <span className="text-gradient">One Easy Application.</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                First, let's start with the basics…
              </p>
            </div>

            {/* Once every answer is in, the indication takes the place of the
                questions rather than floating over them — the column stays
                centred instead of leaving a tall empty gap below the card. */}
            {!dismissed && (loading || showQuotes) ? (
            <div
              className="rounded-2xl bg-white p-6 w-full quote-in"
              style={{ boxShadow: '0 18px 48px rgba(27,7,80,0.14), 0 0 0 1px rgba(27,7,80,0.05)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-3">
                Price indication
              </p>

              {loading ? (
                <div className="space-y-3">
                  {[0, 1].map(i => (
                    <div key={i} className="flex items-center justify-between gap-4 py-2">
                      <div className="space-y-2">
                        <div className="skel h-3 w-20 rounded" />
                        <div className="skel h-2 w-24 rounded" />
                      </div>
                      <div className="skel h-6 w-20 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {quotes.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-4 py-3"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}
                    >
                      <CarrierMark carrier={q.carrier} product={q.product} logo={q.logo} size="md" />
                      <div className="text-right">
                        <p className="text-[26px] font-extrabold leading-none text-navy tracking-tight">
                          {formatUSD(q.premium)}
                        </p>
                        <p className="text-[9.5px] text-gray-400 font-semibold mt-1">starting at</p>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={submit}
                    className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ height: 44, background: BRAND_GRADIENT, boxShadow: '0 6px 18px rgba(92,46,212,0.22)' }}
                  >
                    Shop the Marketplace
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition hover:opacity-70"
                    style={{ color: '#5C2ED4' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Edit answers
                  </button>

                  <p className="text-[10px] text-gray-400 leading-relaxed text-center mt-3">
                    Indication only — final premium is set after underwriting review.
                  </p>
                </>
              )}
            </div>
            ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                <Input
                  label="DBA" required
                  placeholder="Business name"
                  value={form.dba} onChange={set('dba')}
                  error={errorFor('dba')}
                />
                <CurrencyInput
                  label="Sub-Contracting Costs" required
                      value={form.subContractingCosts} onChange={set('subContractingCosts')}
                  error={errorFor('subContractingCosts')}
                />
                <Input
                  label="Postal Code" required
                  placeholder="95070" maxLength={5}
                  value={form.postalCode}
                  onChange={(v) => set('postalCode')(v.replace(/\D/g, ''))}
                  error={errorFor('postalCode')}
                />
                <Select
                  label="Years of Experience" required
                  options={YEARS_OF_EXPERIENCE}
                  value={form.yearsOfExperience} onChange={set('yearsOfExperience')}
                  placeholder="Select years of experience"
                  error={errorFor('yearsOfExperience')}
                />
                <SearchableSelect
                  label="Main Class Code" required
                  hint={FIELD_HELP.mainClassCode}
                  options={CLASS_CODE_OPTIONS}
                  value={form.mainClassCode} onChange={set('mainClassCode')}
                  placeholder="Select Main Class Code"
                  searchPlaceholder="Search trade or code…"
                  error={errorFor('mainClassCode')}
                />
                <Select
                  label="Years in Business" required
                  options={YEARS_IN_BUSINESS}
                  value={form.yearsInBusiness} onChange={set('yearsInBusiness')}
                  placeholder="Select years in business"
                  error={errorFor('yearsInBusiness')}
                />
                <CurrencyInput
                  label="Gross Receipts" required
                      value={form.grossReceipts} onChange={set('grossReceipts')}
                  error={errorFor('grossReceipts')}
                />
                <TreeSelect
                  label="Prior Insurance History" required
                  tree={PRIOR_INSURANCE_TREE}
                  leafLabels={PRIOR_INSURANCE_LEAVES}
                  value={form.priorInsurance} onChange={set('priorInsurance')}
                  placeholder="Select prior insurance history"
                  error={errorFor('priorInsurance')}
                />
                <CurrencyInput
                  label="Employee Payroll" required
                      value={form.employeePayroll} onChange={set('employeePayroll')}
                  error={errorFor('employeePayroll')}
                />
                <Select
                  label="New Residential Construction?" required
                    options={YES_NO}
                  value={form.newResidential} onChange={set('newResidential')}
                  placeholder="Select an answer"
                  error={errorFor('newResidential')}
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!ready}
                title={ready ? undefined : 'Answer every question to shop the marketplace'}
                className={`w-full mt-8 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${
                  ready ? 'text-white hover:opacity-90' : 'cursor-not-allowed'
                }`}
                style={{
                  height: 44,
                  background: ready ? BRAND_GRADIENT : '#E5E7EB',
                  color: ready ? 'white' : '#9CA3AF',
                  boxShadow: ready ? '0 6px 18px rgba(92,46,212,0.22)' : 'none',
                }}
              >
                Shop the Marketplace
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
              </>
            )}

          </div>
          </div>
        </div>

        {/* Right — Norbie over the palm watermark, same treatment as the
            Commercial Auto landing. */}
        <div className="hidden lg:flex relative overflow-hidden shrink-0 flex-col items-center justify-center gap-6 px-10"
          style={{ width: '50%' }}>
          <img
            src={jungleImg} alt=""
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ opacity: 0.25 }}
          />

          <img
            src={norbieContractor}
            alt="Norbie"
            className="relative z-10 select-none pointer-events-none"
            style={{ width: 500, height: 500, objectFit: 'contain' }}
          />

          {/* The upload shortcut earns its place here, before any typing —
              its whole value is skipping the ten questions on the left. It
              stays put once the indication replaces the form, where it reads
              as "not happy with this? send us the competitor's quote". */}
          <div
            className="relative z-10 rounded-2xl bg-white px-6 py-5 w-[340px] text-center"
            style={{ boxShadow: '0 8px 24px rgba(27,7,80,0.08), 0 0 0 1px rgba(27,7,80,0.05)' }}
          >
            <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-navy">
              Have a competitor quote or ACORD form?
              <InfoTip title="Competitor quote or ACORD form">
                <p>
                  Send us an existing quote or a completed ACORD 125/126 and we'll
                  pre-fill the application from it instead of asking you to retype
                  the answers.
                </p>
              </InfoTip>
            </p>
            <button
              type="button"
              onClick={() => window.alert('Document upload is not wired up yet.')}
              className="w-full mt-3.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ height: 44, background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Upload Here
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
