import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import PageZero from './pages/PageZero'
import ApplicantContact from './pages/ApplicantContact'
import ApplicantBusiness from './pages/ApplicantBusiness'
import BusinessOperations from './pages/BusinessOperations'
import PriceIndication from './pages/PriceIndication'
import AppShell from './components/AppShell'
import { todayMDY } from './components/FormField'
import { rateAll } from './lib/rating'
import { LIMIT_OPTIONS, DEDUCTIBLE_OPTIONS } from './data/carrierTerms'

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

const defaultTerms = () => ({
  rli:     { limit: LIMIT_OPTIONS[0].value, deductible: DEDUCTIBLE_OPTIONS[0].value },
  bravado: { limit: LIMIT_OPTIONS[0].value, deductible: DEDUCTIBLE_OPTIONS[0].value },
})

export default function App() {
  const [started, setStarted] = useState(false)
  const [submissionNumber, setSubmissionNumber] = useState('')
  const [form, setForm] = useState({})
  const [classifications, setClassifications] = useState([{ code: '', percentage: '100' }])
  const [terms, setTerms] = useState(defaultTerms)
  const [selectedCarrier, setSelectedCarrier] = useState(null)
  const [touched, setTouched] = useState(false)
  const [activeStep, setActiveStep] = useState('applicant')

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

  const missingBySection = useMemo(() => {
    const blank = (k) => !String(form[k] ?? '').trim()

    const applicant = ['yearsOfExperience', 'yearsInBusiness', 'priorInsurance', 'lastName', 'phone', 'email'].filter(blank)
    if (!blank('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) applicant.push('email')

    const business = ['effectiveDate', 'dba', 'legalName', 'entityType', 'street', 'city', 'state', 'postalCode'].filter(blank)
    if (!blank('legalName') && form.legalName.trim().length < 5) business.push('legalName')
    if (!/^\d{5}$/.test(form.postalCode || '')) business.push('postalCode')

    const operations = ['grossReceipts', 'employeePayroll', 'employeeCount', 'activeOwners', 'operationsDescription'].filter(blank)
    if (form.hiresSubs === 'yes') operations.push(...['subContractingCosts', 'subDwellingPct'].filter(blank))

    return { applicant, business, operations }
  }, [form])

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
    sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (!started) return
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
  }, [started])

  const updateTerms = (carrierId, patch) =>
    setTerms(t => ({ ...t, [carrierId]: { ...t[carrierId], ...patch } }))

  const continueToApplication = () => {
    setTouched(true)
    if (allMissing.length || !classificationsValid || !splitValid) {
      const firstIncomplete = STEPS.find(s => !completed[s.key])
      if (firstIncomplete) jumpTo(firstIncomplete.key)
      return
    }
    window.alert('Bind & pay is not built yet.')
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
      scrollRef={scrollRef}
    >
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
      />
      <PriceIndication
        ref={sectionRefs.indication}
        quotes={stale ? [] : quotes}
        terms={terms}
        onTermsChange={updateTerms}
        selected={selectedCarrier}
        onSelect={setSelectedCarrier}
        onContinue={continueToApplication}
      />
    </AppShell>
  )
}
