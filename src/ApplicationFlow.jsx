import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import ApplicationShell from './components/ApplicationShell'
import Section from './components/Section'
import { BRAND_GRADIENT } from './components/FormField'
import ContactInfo from './pages/application/ContactInfo'
import Classifications from './pages/application/Classifications'
import BusinessInfo from './pages/application/BusinessInfo'
import InsuranceHistory from './pages/application/InsuranceHistory'
import Pricing from './pages/application/Pricing'
import Supplemental from './pages/application/Supplemental'
import InlandMarine from './pages/application/InlandMarine'
import GeneralQuestions from './pages/application/GeneralQuestions'
import ClassCodeQuestions from './pages/application/ClassCodeQuestions'
import Submitted from './pages/application/Submitted'
import { rulesForCodes, subKey } from './data/conditionalQuestions'
import { STRUCTURE_TYPES, CONSTRUCTION_TYPES, GENERAL_DISCLOSURES } from './data/applicationOptions'

// Phase two: the full application. Inland Marine only joins the rail once a
// tool floater cover is picked, which is why the steps are built per render.
const buildSteps = (form) => {
  const steps = [
    { key: 'contact',       label: 'Contact Info' },
    { key: 'classes',       label: 'Classifications' },
    { key: 'business',      label: 'Business Info' },
    { key: 'history',       label: 'Insurance History' },
    { key: 'pricing',       label: 'Pricing' },
    { key: 'supplemental',  label: 'Supplemental' },
    ...(form.toolFloater === 'yes' ? [{ key: 'inland-marine', label: 'Inland Marine' }] : []),
    { key: 'general',       label: 'General Questions' },
    { key: 'classcode',     label: 'ClassCode Questions' },
  ]
  return steps.map((s, i) => ({ ...s, number: i + 1 }))
}

export default function ApplicationFlow({ seed, quote, amount, onExit, onStartOver, railExtras }) {
  const [form, setForm] = useState(seed)
  const [rows, setRows] = useState(seed.classifications ?? [])
  const [claims, setClaims] = useState([
    { year: '', nature: '', amount: '' },
    { year: '', nature: '', amount: '' },
  ])
  const [bpp, setBpp] = useState([{ location: '', bldg: '', deductible: '', office: '', shop: '', yard: '' }])
  const [activeStep, setActiveStep] = useState('contact')
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState(false)
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})

  const set = useCallback((key) => (value) => setForm(f => ({ ...f, [key]: value })), [])
  const setWorkPct = useCallback((key, value) =>
    setForm(f => ({ ...f, workPct: { ...(f.workPct || {}), [key]: value } })), [])

  const steps = buildSteps(form)
  const classCodes = rows.map(r => r.code).filter(Boolean)
  const anyDisclosure = GENERAL_DISCLOSURES.some(d => !d.isNone && (form.disclosures || {})[d.key])

  /* ── Validation ─────────────────────────────────────────────────── */

  const missingBySection = useMemo(() => {
    const blank = (k) => !String(form[k] ?? '').trim()
    const out = {
      contact: [], classes: [], business: [], history: [], pricing: [],
      supplemental: [], 'inland-marine': [], general: [], classcode: [],
    }

    out.contact.push(...['firstName', 'lastName', 'street', 'city', 'state', 'postalCode', 'email', 'phone'].filter(blank))
    if (!form.mailingSame) {
      out.contact.push(...['mailStreet', 'mailCity', 'mailState', 'mailPostalCode'].filter(blank))
    }

    out.business.push(...['legalName', 'entityType', 'activeOwners', 'grossReceipts', 'operationsDescription'].filter(blank))
    if (!blank('operationsDescription') && form.operationsDescription.trim().split(/\s+/).length < 10) {
      out.business.push('operationsDescription')
    }
    if (form.hasEmployees === 'yes') out.business.push(...['employeeCount', 'employeePayroll'].filter(blank))
    if (form.hiresSubs === 'yes') out.business.push(...['subContractingCosts', 'subDwellingPct'].filter(blank))
    if (form.newResidential === 'yes') out.business.push(...['newWorkPct', 'remodelPct'].filter(blank))

    out.history.push(...['effectiveDate', 'yearsInBusiness', 'yearsOfExperience'].filter(blank))

    if (form.toolFloater === 'yes' && form.contractorsInstall) {
      out['inland-marine'].push(...['imPerJobSite', 'imInstallDeductible'].filter(blank))
      if (form.imTempStructures === 'yes' && blank('imTempStructuresDetail')) {
        out['inland-marine'].push('imTempStructuresDetail')
      }
    }

    out.general.push(...['worksOutOfState', 'otherEntity'].filter(blank))
    if (form.worksOutOfState === 'yes' && blank('outOfStateList')) out.general.push('outOfStateList')
    if (form.otherEntity === 'yes' && blank('otherEntityDetail')) out.general.push('otherEntityDetail')
    // The page asks to select one or more, and offers Check if None for the
    // case where none apply, so leaving every box clear is not an answer.
    if (!Object.values(form.disclosures || {}).some(Boolean)) out.general.push('disclosures')
    if (anyDisclosure && blank('disclosureExplanation')) out.general.push('disclosureExplanation')

    rulesForCodes(classCodes).forEach(rule => {
      if (blank(rule.id)) out.classcode.push(rule.id)
      else if (form[rule.id] === 'yes' && blank(subKey(rule))) out.classcode.push(subKey(rule))
    })

    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, classCodes.join(','), anyDisclosure])

  const classesValid = rows.length > 0 && rows.every(r => r.code) &&
    rows.reduce((s, r) => s + (Number(r.percentage) || 0), 0) === 100

  const occupancyValid = form.newResidential !== 'yes' ||
    (Number(form.newWorkPct) || 0) + (Number(form.remodelPct) || 0) === 100

  const pctTotal = (rowsDef) => rowsDef.reduce((s, r) => s + (Number((form.workPct || {})[r.key]) || 0), 0)
  const workPctValid =
    pctTotal(STRUCTURE_TYPES) === 100 &&
    pctTotal(CONSTRUCTION_TYPES) === 100 &&
    !STRUCTURE_TYPES.some(r => r.disallowed && Number((form.workPct || {})[r.key]) > 0)

  const completed = {
    contact: missingBySection.contact.length === 0,
    classes: classesValid,
    business: missingBySection.business.length === 0 && occupancyValid,
    history: missingBySection.history.length === 0,
    pricing: true,
    supplemental: workPctValid,
    'inland-marine': missingBySection['inland-marine'].length === 0,
    general: missingBySection.general.length === 0,
    classcode: missingBySection.classcode.length === 0,
  }

  const allMissing = Object.values(missingBySection).flat()

  const errorFor = (key) => touched && allMissing.includes(key)

  const progress = Math.round(
    (steps.filter(s => completed[s.key]).length / steps.length) * 100,
  )

  /* ── Scroll navigation ──────────────────────────────────────────── */

  const jumpTo = (key) => {
    setActiveStep(key)
    requestAnimationFrame(() =>
      sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    // Whichever section owns the top third of the viewport is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible?.target?.id) setActiveStep(visible.target.id)
      },
      { root, rootMargin: '0px 0px -66% 0px', threshold: 0 },
    )
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [steps.length, submitted])

  const submit = () => {
    setTouched(true)
    if (allMissing.length || !classesValid || !occupancyValid || !workPctValid) {
      const first = steps.find(s => !completed[s.key])
      if (first) jumpTo(first.key)
      return
    }
    setSubmitted(true)
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  const pages = {
    contact: <ContactInfo form={form} set={set} errorFor={errorFor} />,
    classes: <Classifications rows={rows} setRows={setRows} />,
    business: <BusinessInfo form={form} set={set} errorFor={errorFor} />,
    history: <InsuranceHistory form={form} set={set} errorFor={errorFor} />,
    pricing: <Pricing form={form} quote={quote} amount={amount} />,
    supplemental: (
      <Supplemental
        form={form} set={set} errorFor={errorFor}
        setWorkPct={setWorkPct} claims={claims} setClaims={setClaims}
      />
    ),
    'inland-marine': <InlandMarine form={form} set={set} errorFor={errorFor} bpp={bpp} setBpp={setBpp} />,
    general: <GeneralQuestions form={form} set={set} errorFor={errorFor} />,
    classcode: <ClassCodeQuestions form={form} set={set} errorFor={errorFor} classCodes={classCodes} />,
  }

  if (submitted) {
    return (
      <ApplicationShell
        railExtras={railExtras}
        submissionNumber={form.applicationNumber}
        steps={steps}
        activeStep={null}
        completed={Object.fromEntries(steps.map(s => [s.key, true]))}
        progress={100}
        quote={quote}
        quoteAmount={amount}
        summaryReady
        submitted
        onFormReview={() => setTimeout(() => window.print(), 50)}
      >
        <Submitted
          submissionNumber={form.applicationNumber}
          quote={quote}
          amount={amount}
          form={form}
          rows={rows}
          onStartOver={onStartOver ?? onExit}
          dark={railExtras?.dark}
        />
      </ApplicationShell>
    )
  }

  return (
    <ApplicationShell
      railExtras={railExtras}
      submissionNumber={form.applicationNumber}
      steps={steps}
      activeStep={activeStep}
      completed={completed}
      onStepClick={jumpTo}
      progress={progress}
      quote={quote}
      quoteAmount={amount}
      scrollRef={scrollRef}
      bare
    >
      {steps.map(s => (
        <Section
          key={s.key}
          id={s.key}
          title={s.label}
          ref={el => { sectionRefs.current[s.key] = el }}
        >
          {pages[s.key]}
        </Section>
      ))}

      <div className="px-4 md:px-10 pb-10 flex justify-end">
        <button
          type="button"
          onClick={submit}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
        >
          Submit Application
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </ApplicationShell>
  )
}
