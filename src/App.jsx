import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import PageZero from './pages/PageZero'
import ApplicantContact from './pages/ApplicantContact'
import ApplicantBusiness from './pages/ApplicantBusiness'
import BusinessOperations from './pages/BusinessOperations'
import PriceIndication from './pages/PriceIndication'
import AppShell from './components/AppShell'
import { todayMDY, BRAND_GRADIENT } from './components/FormField'
import { rateAll } from './lib/rating'
import { defaultTermsFor } from './data/carrierTerms'
import { rulesForCodes, subKey } from './data/conditionalQuestions'

const STEPS = [
  { key: 'applicant',  number: 1, label: 'Applicant' },
  { key: 'business',   number: 2, label: 'Business Information' },
  { key: 'operations', number: 3, label: 'Business Operations' },
  { key: 'indication', number: 4, label: 'Price Indication' },
]

// Answers that move the premium. Change any of them and the rail blanks out
// until the applicant asks for a refreshed quote.
const RATING_KEYS = [
  'grossReceipts', 'employeePayroll', 'subContractingCosts', 'mainClassCode',
  'yearsOfExperience', 'yearsInBusiness', 'priorInsurance', 'newResidential',
]

const ratingSnapshot = (form) => JSON.stringify(RATING_KEYS.map(k => form[k]))

const newSubmissionNumber = () =>
  `QMGL${String(Math.floor(Math.random() * 9_000_000) + 1_000_000)}`

const defaultTerms = () => ({ rli: defaultTermsFor('rli'), bravado: defaultTermsFor('bravado') })

export default function App() {
  const [started, setStarted] = useState(false)
  const [submissionNumber, setSubmissionNumber] = useState('')
  const [form, setForm] = useState({})
  const [classifications, setClassifications] = useState([{ code: '', percentage: '100' }])
  const [terms, setTerms] = useState(defaultTerms)
  const [selectedCarrier, setSelectedCarrier] = useState(null)
  const [touched, setTouched] = useState(false)
  const [activeStep, setActiveStep] = useState('applicant')
  // 'form' holds the three scrolling sections; the indication gets its own page.
  const [view, setView] = useState('form')

  const [quotes, setQuotes] = useState([])
  const [ratedAt, setRatedAt] = useState('')

  const scrollRef = useRef(null)
  const sectionRefs = {
    applicant: useRef(null),
    business: useRef(null),
    operations: useRef(null),
    indication: useRef(null),
  }

  const stale = quotes.length > 0 && ratedAt !== ratingSnapshot(form)
  const set = useCallback((key) => (value) => setForm(f => ({ ...f, [key]: value })), [])

  const startApplication = ({ form: intake, quotes: intakeQuotes }) => {
    const seeded = {
      ...intake,
      effectiveDate: todayMDY(),
      state: '',
      mailingSame: true,
      hiresSubs: Number(intake.subContractingCosts) > 0 ? 'yes' : 'no',
      newWorkPct: intake.newResidential === 'yes' ? '100' : '',
      remodelPct: intake.newResidential === 'yes' ? '0' : '',
    }
    setForm(seeded)
    setClassifications([{ code: intake.mainClassCode, percentage: '100' }])
    setQuotes(intakeQuotes)
    setRatedAt(ratingSnapshot(seeded))
    setSubmissionNumber(newSubmissionNumber())
    setStarted(true)
  }

  const refreshQuote = () => {
    setQuotes(rateAll(form))
    setRatedAt(ratingSnapshot(form))
  }

  /* ── Section completion ─────────────────────────────────────────── */

  const splitTotal = (Number(form.newWorkPct) || 0) + (Number(form.remodelPct) || 0)

  const classCodes = classifications.map(r => r.code).filter(Boolean)

  const missingBySection = useMemo(() => {
    const blank = (k) => !String(form[k] ?? '').trim()

    const applicant = ['yearsOfExperience', 'yearsInBusiness', 'priorInsurance', 'lastName', 'phone', 'email'].filter(blank)
    if (!blank('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) applicant.push('email')

    const business = ['effectiveDate', 'dba', 'legalName', 'entityType', 'street', 'city', 'state', 'postalCode'].filter(blank)
    if (!blank('legalName') && form.legalName.trim().length < 5) business.push('legalName')
    if (!/^\d{5}$/.test(form.postalCode || '')) business.push('postalCode')

    const operations = ['grossReceipts', 'employeePayroll', 'employeeCount', 'activeOwners', 'operationsDescription'].filter(blank)
    if (form.hiresSubs === 'yes') operations.push(...['subContractingCosts', 'subDwellingPct'].filter(blank))
    // Every trade question that applies has to be answered, and a yes needs
    // its follow-up too.
    rulesForCodes(classifications.map(r => r.code).filter(Boolean)).forEach(rule => {
      if (blank(rule.id)) operations.push(rule.id)
      else if (form[rule.id] === 'yes' && blank(subKey(rule))) operations.push(subKey(rule))
    })

    return { applicant, business, operations }
  }, [form, classifications])

  const classificationsValid =
    classifications.every(r => r.code) &&
    classifications.reduce((s, r) => s + (Number(r.percentage) || 0), 0) === 100
  const splitValid = form.newResidential !== 'yes' || splitTotal === 100

  const completed = {
    applicant: missingBySection.applicant.length === 0,
    business: missingBySection.business.length === 0 && classificationsValid,
    operations: missingBySection.operations.length === 0 && splitValid,
    indication: !!selectedCarrier,
  }

  const progress = Math.round(
    (STEPS.filter(s => completed[s.key]).length / STEPS.length) * 100
  )

  const allMissing = [
    ...missingBySection.applicant,
    ...missingBySection.business,
    ...missingBySection.operations,
  ]

  const errorFor = (key) => {
    if (!touched) return false
    const filled = String(form[key] ?? '').trim()
    if (key === 'legalName' && allMissing.includes('legalName') && filled)
      return 'Legal Business Name must be at least 5 characters long'
    if (key === 'postalCode' && allMissing.includes('postalCode') && filled)
      return 'Enter a 5-digit ZIP code'
    if (key === 'email' && allMissing.includes('email') && filled)
      return 'Enter a valid email address'
    return allMissing.includes(key)
  }

  /* ── Sidebar navigation + scroll spy ────────────────────────────── */

  const jumpTo = (key) => {
    if (key === 'indication') {
      setView('indication')
      setActiveStep('indication')
      return
    }
    setView('form')
    setActiveStep(key)
    // Wait for the form to be back on screen before scrolling to the section.
    requestAnimationFrame(() =>
      sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  useEffect(() => {
    if (!started || view !== 'form') return
    const root = scrollRef.current
    if (!root) return
    // Highlight whichever section owns the top third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible?.target?.id) setActiveStep(visible.target.id)
      },
      { root, rootMargin: '0px 0px -66% 0px', threshold: 0 },
    )
    Object.values(sectionRefs).forEach(r => r.current && observer.observe(r.current))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, view])

  const updateTerms = (carrierId, patch) =>
    setTerms(t => ({ ...t, [carrierId]: { ...t[carrierId], ...patch } }))

  const goToIndication = () => {
    setTouched(true)
    if (allMissing.length || !classificationsValid || !splitValid) {
      const firstIncomplete = STEPS.find(s => !completed[s.key] && s.key !== 'indication')
      if (firstIncomplete) jumpTo(firstIncomplete.key)
      return
    }
    jumpTo('indication')
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  if (!started) return <PageZero onContinue={startApplication} />

  return (
    <AppShell
      productName="Contractor General Liability"
      submissionNumber={submissionNumber}
      steps={STEPS}
      activeStep={activeStep}
      completed={completed}
      onStepClick={jumpTo}
      progress={progress}
      quotes={quotes}
      stale={stale}
      onRefresh={refreshQuote}
      selectedCarrier={selectedCarrier}
      onSelectCarrier={(id) => setSelectedCarrier(cur => (cur === id ? null : id))}
      onFormReview={() => window.alert('Application summary download is not wired up yet.')}
      formComplete={completed.applicant && completed.business && completed.operations}
      bare={view === 'indication'}
      scrollRef={scrollRef}
    >
      {view === 'form' ? (
        <>
          <ApplicantContact
            ref={sectionRefs.applicant}
            form={form} set={set} errorFor={errorFor}
          />
          <ApplicantBusiness
            ref={sectionRefs.business}
            form={form} set={set} errorFor={errorFor}
            classifications={classifications} setClassifications={setClassifications}
          />
          <BusinessOperations
            ref={sectionRefs.operations}
            form={form} set={set} errorFor={errorFor} splitTotal={splitTotal}
            classCodes={classCodes}
          />
          <div className="px-4 md:px-10 pb-4 flex justify-end">
            <button
              type="button"
              onClick={goToIndication}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
              style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
            >
              See Price Indication
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <PriceIndication
          quotes={stale ? [] : quotes}
          terms={terms}
          onTermsChange={updateTerms}
          selected={selectedCarrier}
          onSelect={setSelectedCarrier}
          onCompare={() => window.alert('Carrier comparison is not built yet.')}
        />
      )}
    </AppShell>
  )
}
