import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import PageZero from './pages/PageZero'
import ClassificationsStep from './pages/ClassificationsStep'
import ApplicantContact from './pages/ApplicantContact'
import BusinessOperations from './pages/BusinessOperations'
import PriceIndication from './pages/PriceIndication'
import AppShell from './components/AppShell'
import ApplicationFlow from './ApplicationFlow'
import { TurnaroundNotice, QuoteReady } from './components/QuoteHandoff'
import { premiumWithTerms } from './data/carrierTerms'
import { APP_LIMITS, APP_DEDUCTIBLES } from './data/applicationOptions'
import { todayMDY, BRAND_GRADIENT } from './components/FormField'
import { rateAll } from './lib/rating'
import { defaultTermsFor } from './data/carrierTerms'
import { rulesForCodes, subKey } from './data/conditionalQuestions'
import DemoBar from './demo/DemoBar'
import { useDarkMode } from './theme'
import { DEMO_INTAKE, demoPhaseOne, demoPhaseTwo } from './demo/demoData'

// The legacy flow's own order and wording.
const STEPS = [
  { key: 'classes',    number: 1, label: 'Classifications' },
  { key: 'applicant',  number: 2, label: 'Applicant Information' },
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

// The application gets its own number when the quote is handed over.
const newApplicationNumber = () =>
  `QCGL${String(Math.floor(Math.random() * 9_000_000) + 1_000_000).padStart(7, '0')}`

const defaultTerms = () => ({ rli: defaultTermsFor('rli'), bravado: defaultTermsFor('bravado') })


export default function App() {
  const [started, setStarted] = useState(false)
  const [dark, setDark] = useDarkMode(started)
  const toggleDark = () => setDark(d => !d)
  const [submissionNumber, setSubmissionNumber] = useState('')
  const [form, setForm] = useState({})
  const [classifications, setClassifications] = useState([{ code: '', percentage: '100' }])
  const [terms, setTerms] = useState(defaultTerms)
  const [selectedCarrier, setSelectedCarrier] = useState(null)
  const [touched, setTouched] = useState(false)
  const [activeStep, setActiveStep] = useState('applicant')
  // 'form' holds the three scrolling sections; the indication gets its own page.
  const [view, setView] = useState('form')
  // 'none' → turnaround warning → quote-ready → the application itself.
  const [handoff, setHandoff] = useState('none')
  // Phase two edits the same form object phase one fills in, so stepping back
  // to fix a classification or an address loses nothing on either side.
  const [applicationNumber, setApplicationNumber] = useState('')
  const [inApplication, setInApplication] = useState(false)
  const [appFiles, setAppFiles] = useState([])
  // Where phase two was when it handed control back.
  const [appReturn, setAppReturn] = useState({ stage: 'form', step: 'eligibility' })

  const [quotes, setQuotes] = useState([])
  const [ratedAt, setRatedAt] = useState('')

  const scrollRef = useRef(null)
  const sectionRefs = {
    classes: useRef(null),
    applicant: useRef(null),
    operations: useRef(null),
    indication: useRef(null),
  }

  const stale = quotes.length > 0 && ratedAt !== ratingSnapshot(form)
  const set = useCallback((key) => (value) => setForm(f => ({ ...f, [key]: value })), [])

  const startApplication = ({ form: intake, quotes: intakeQuotes }, prefill = false) => {
    const seeded = {
      ...intake,
      effectiveDate: todayMDY(),
      state: '',
      mailingSame: true,
      hiresSubs: Number(intake.subContractingCosts) > 0 ? 'yes' : 'no',
      newWorkPct: intake.newResidential === 'yes' ? '100' : '',
      remodelPct: intake.newResidential === 'yes' ? '0' : '',
      // Last, so the demo answers win over the blanks seeded above.
      ...(prefill ? demoPhaseOne() : {}),
    }
    setForm(seeded)
    setClassifications([{ code: intake.mainClassCode, percentage: '100' }])
    setQuotes(intakeQuotes)
    setRatedAt(ratingSnapshot(seeded))
    setSubmissionNumber(newSubmissionNumber())
    setStarted(true)
  }

  // Back to the landing page with nothing carried over — what the button on
  // the submitted screen says it does.
  // The summary is of the application, which does not exist until it is
  // submitted in phase two, so the rail's download stays disabled here.
  const summaryReady = false

  const startOver = () => {
    setInApplication(false)
    setApplicationNumber('')
    setAppFiles([])
    setAppReturn({ stage: 'form', step: 'eligibility' })
    setStarted(false)
    setSubmissionNumber('')
    setForm({})
    setClassifications([{ code: '', percentage: '100' }])
    setTerms(defaultTerms())
    setSelectedCarrier(null)
    setTouched(false)
    setActiveStep('classes')
    setView('form')
    setHandoff('none')
    setQuotes([])
    setRatedAt('')
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

    const applicant = ['lastName', 'phone', 'email', 'street', 'city', 'state', 'postalCode'].filter(blank)
    if (!blank('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) applicant.push('email')
    if (!/^\d{5}$/.test(form.postalCode || '')) applicant.push('postalCode')
    if (!form.mailingSame) {
      applicant.push(...['mailStreet', 'mailCity', 'mailState', 'mailPostalCode'].filter(blank))
    }

    const operations = [
      'effectiveDate', 'dba', 'legalName', 'entityType',
      'yearsOfExperience', 'yearsInBusiness', 'priorInsurance',
      // Description of Operations is asked once, in Eligibility Statements.
      'grossReceipts', 'activeOwners',
    ].filter(blank)
    if (!blank('legalName') && form.legalName.trim().length < 5) operations.push('legalName')
    if (form.hasEmployees === 'yes') operations.push(...['employeeCount', 'employeePayroll'].filter(blank))
    if (form.hiresSubs === 'yes') operations.push(...['subContractingCosts', 'subDwellingPct'].filter(blank))
    // Every trade question that applies has to be answered, and a yes needs
    // its follow-up too.
    rulesForCodes(classifications.map(r => r.code).filter(Boolean)).forEach(rule => {
      if (blank(rule.id)) operations.push(rule.id)
      else if (form[rule.id] === 'yes' && blank(subKey(rule))) operations.push(subKey(rule))
    })

    return { applicant, operations }
  }, [form, classifications])

  const classificationsValid =
    classifications.every(r => r.code) &&
    classifications.reduce((s, r) => s + (Number(r.percentage) || 0), 0) === 100
  const splitValid = form.newResidential !== 'yes' || splitTotal === 100

  const completed = {
    classes: classificationsValid,
    applicant: missingBySection.applicant.length === 0,
    operations: missingBySection.operations.length === 0 && splitValid,
    indication: !!selectedCarrier,
  }

  const progress = Math.round(
    (STEPS.filter(s => completed[s.key]).length / STEPS.length) * 100
  )

  const allMissing = [
    ...missingBySection.applicant,
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

  const chosenQuote = quotes.find(q => q.id === selectedCarrier)
  const chosenPremium = chosenQuote ? premiumWithTerms(chosenQuote, terms[chosenQuote.id]) : 0

  // Carry everything already answered into the application so nothing gets
  // asked twice.
  const startApplicationPhase = () => {
    setHandoff('none')
    // An application already under way is resumed, not started again.
    if (applicationNumber) { setInApplication(true); return }
    setForm(f => ({
      ...f,
      hasEmployees: Number(f.employeeCount) > 0 ? 'yes' : f.hasEmployees,
      appLimit: APP_LIMITS[APP_LIMITS.length - 1].value,
      appDeductible: APP_DEDUCTIBLES[0].value,
      workPct: {},
      subTrades: [],
      disclosures: {},
    }))
    setApplicationNumber(newApplicationNumber())
    setAppFiles([])
    setAppReturn({ stage: 'form', step: 'eligibility' })
    setInApplication(true)
  }

  // A pencil on one of the three panels whose fields belong to phase one drops
  // back onto that step; the application waits where it was left.
  const editIntake = (step, resume) => {
    if (resume) setAppReturn(resume)
    setInApplication(false)
    setTouched(true)
    jumpTo(step)
  }

  /* ── Demo shortcuts ─────────────────────────────────────────────── */

  // Every jump lays the demo answers over whatever is already there, so it
  // does not matter how the form got into its current state.
  const demoStart = () => {
    startApplication({ form: DEMO_INTAKE, quotes: rateAll(DEMO_INTAKE) }, true)
  }

  // Leaves the application too, or a jump from phase two lands nowhere.
  const leaveApplication = () => {
    setInApplication(false)
    setApplicationNumber('')
    setAppFiles([])
    setAppReturn({ stage: 'form', step: 'eligibility' })
    setHandoff('none')
  }

  const demoForm = () => {
    demoStart()
    leaveApplication()
    setActiveStep('classes')
    setView('form')
  }

  const demoIndication = () => {
    demoStart()
    leaveApplication()
    setActiveStep('indication')
    setView('indication')
  }

  const demoApplication = () => {
    demoStart()
    setSelectedCarrier('bravado')
    setHandoff('none')
    setForm(f => ({
      ...f,
      ...demoPhaseTwo(),
      appLimit: APP_LIMITS[APP_LIMITS.length - 1].value,
      appDeductible: APP_DEDUCTIBLES[0].value,
    }))
    setApplicationNumber(newApplicationNumber())
    setAppFiles([])
    setAppReturn({ stage: 'form', step: 'eligibility' })
    setInApplication(true)
  }

  const demoJumps = [
    { key: 'landing', label: 'Landing', go: startOver },
    { key: 'form', label: 'Form', go: demoForm },
    { key: 'indication', label: 'Indication', go: demoIndication },
    { key: 'application', label: 'Application', go: demoApplication },
  ]

  const demoActive = inApplication ? 'application'
    : !started ? 'landing'
    : view === 'indication' ? 'indication'
    : 'form'

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

  // The landing page has no rail, so the jump sits in its corner; everywhere
  // else it lives in the rail beside the dark toggle.
  const demoBar = <DemoBar jumps={demoJumps} active={demoActive} />
  const railExtras = {
    dark,
    onToggleDark: toggleDark,
    demoJumps,
    demoActive,
  }

  if (!started) return <>
    <PageZero onContinue={startApplication} />
    {demoBar}
  </>

  if (inApplication) {
    return (
      <ApplicationFlow
        key={applicationNumber}
        form={form}
        set={set}
        rows={classifications}
        files={appFiles}
        setFiles={setAppFiles}
        applicationNumber={applicationNumber}
        resumeAt={appReturn}
        onEditIntake={editIntake}
        quote={chosenQuote}
        amount={chosenPremium}
        onExit={leaveApplication}
        onStartOver={startOver}
        railExtras={railExtras}
      />
    )
  }

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
      formComplete={summaryReady}
      bare={view === 'indication'}
      inCompare={view === 'indication'}
      scrollRef={scrollRef}
      railExtras={railExtras}
    >
      {view === 'form' ? (
        <>
          <ClassificationsStep
            ref={sectionRefs.classes}
            classifications={classifications} setClassifications={setClassifications}
          />
          <ApplicantContact
            ref={sectionRefs.applicant}
            form={form} set={set} errorFor={errorFor}
          />
          <BusinessOperations
            ref={sectionRefs.operations}
            form={form} set={set} errorFor={errorFor} splitTotal={splitTotal}
            classCodes={classCodes}
          />
          <div className="px-4 md:px-10 pb-4 flex justify-end">
            <button
              type="button"
              onClick={applicationNumber ? () => setInApplication(true) : goToIndication}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
              style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
            >
              {/* Stepping back from the application to fix a field returns to
                  it, rather than starting the quote over. */}
              {applicationNumber ? 'Return to Application' : 'See Price Indication'}
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
          onSelect={(id) => { setSelectedCarrier(id); setHandoff('turnaround') }}
          submissionNumber={submissionNumber}
        />
      )}

      {handoff === 'turnaround' && (
        <TurnaroundNotice
          onContinue={() => setHandoff('ready')}
          onCancel={() => setHandoff('none')}
        />
      )}
      {handoff === 'ready' && chosenQuote && (
        <QuoteReady
          quote={chosenQuote}
          onGo={startApplicationPhase}
          onCancel={() => setHandoff('none')}
        />
      )}
    </AppShell>
  )
}
