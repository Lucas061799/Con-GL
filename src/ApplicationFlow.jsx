import { useState, useCallback, useMemo } from 'react'
import ApplicationShell from './components/ApplicationShell'
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
import { STRUCTURE_TYPES, CONSTRUCTION_TYPES } from './data/applicationOptions'

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

export default function ApplicationFlow({ seed, quote, amount, onExit }) {
  const [form, setForm] = useState(seed)
  const [rows, setRows] = useState(seed.classifications ?? [])
  const [claims, setClaims] = useState([
    { year: '', nature: '', amount: '' },
    { year: '', nature: '', amount: '' },
  ])
  const [bpp, setBpp] = useState([{ location: '', bldg: '', deductible: '', office: '', shop: '', yard: '' }])
  const [step, setStep] = useState('contact')
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState(false)
  const [visited, setVisited] = useState({})

  const set = useCallback((key) => (value) => setForm(f => ({ ...f, [key]: value })), [])
  const setWorkPct = useCallback((key, value) =>
    setForm(f => ({ ...f, workPct: { ...(f.workPct || {}), [key]: value } })), [])

  const steps = buildSteps(form)
  const index = Math.max(0, steps.findIndex(s => s.key === step))
  const classCodes = rows.map(r => r.code).filter(Boolean)

  /* ── Validation ─────────────────────────────────────────────────── */

  const missing = useMemo(() => {
    const blank = (k) => !String(form[k] ?? '').trim()
    const out = []

    if (step === 'contact') {
      out.push(...['firstName', 'lastName', 'street', 'city', 'state', 'postalCode', 'email', 'phone'].filter(blank))
      if (!form.mailingSame) {
        out.push(...['mailStreet', 'mailCity', 'mailState', 'mailPostalCode'].filter(blank))
      }
    }

    if (step === 'business') {
      out.push(...['legalName', 'entityType', 'activeOwners', 'grossReceipts', 'operationsDescription'].filter(blank))
      if (!blank('operationsDescription') && form.operationsDescription.trim().split(/\s+/).length < 10) {
        out.push('operationsDescription')
      }
      if (form.hasEmployees === 'yes') out.push(...['employeeCount', 'employeePayroll'].filter(blank))
      if (form.hiresSubs === 'yes') out.push(...['subContractingCosts', 'subDwellingPct'].filter(blank))
      if (form.newResidential === 'yes') {
        out.push(...['newWorkPct', 'remodelPct'].filter(blank))
      }
    }

    if (step === 'history') {
      out.push(...['effectiveDate', 'yearsInBusiness', 'yearsOfExperience'].filter(blank))
    }

    if (step === 'inland-marine' && form.contractorsInstall) {
      out.push(...['imPerJobSite', 'imInstallDeductible'].filter(blank))
      if (form.imTempStructures === 'yes' && blank('imTempStructuresDetail')) out.push('imTempStructuresDetail')
    }

    if (step === 'general') {
      if (form.worksOutOfState === 'yes' && blank('outOfStateList')) out.push('outOfStateList')
      if (form.otherEntity === 'yes' && blank('otherEntityDetail')) out.push('otherEntityDetail')
    }

    if (step === 'classcode') {
      rulesForCodes(classCodes).forEach(rule => {
        if (blank(rule.id)) out.push(rule.id)
        else if (form[rule.id] === 'yes' && blank(subKey(rule))) out.push(subKey(rule))
      })
    }

    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, form, classCodes.join(',')])

  const classesValid = rows.length > 0 && rows.every(r => r.code) &&
    rows.reduce((s, r) => s + (Number(r.percentage) || 0), 0) === 100

  const occupancyValid = form.newResidential !== 'yes' ||
    (Number(form.newWorkPct) || 0) + (Number(form.remodelPct) || 0) === 100

  const pctTotal = (rowsDef) => rowsDef.reduce((s, r) => s + (Number((form.workPct || {})[r.key]) || 0), 0)
  const workPctValid =
    pctTotal(STRUCTURE_TYPES) === 100 &&
    pctTotal(CONSTRUCTION_TYPES) === 100 &&
    !STRUCTURE_TYPES.some(r => r.disallowed && Number((form.workPct || {})[r.key]) > 0)

  const stepValid =
    missing.length === 0 &&
    (step !== 'classes' || classesValid) &&
    (step !== 'business' || occupancyValid) &&
    (step !== 'supplemental' || workPctValid)

  const errorFor = (key) => touched && missing.includes(key)

  const progress = Math.round((index / steps.length) * 100)

  const go = (key) => { setTouched(false); setStep(key) }

  const advance = () => {
    setTouched(true)
    if (!stepValid) return
    setVisited(v => ({ ...v, [step]: true }))
    const next = steps[index + 1]
    if (next) go(next.key)
    else setSubmitted(true)
  }

  const back = () => {
    const prev = steps[index - 1]
    if (prev) go(prev.key)
    else onExit()
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  const page = {
    contact: <ContactInfo form={form} set={set} errorFor={errorFor} />,
    classes: <Classifications rows={rows} setRows={setRows} />,
    business: <BusinessInfo form={form} set={set} errorFor={errorFor} />,
    history: <InsuranceHistory form={form} set={set} errorFor={errorFor} />,
    pricing: <Pricing form={form} amount={amount} onProceed={advance} />,
    supplemental: (
      <Supplemental
        form={form} set={set} errorFor={errorFor}
        setWorkPct={setWorkPct} claims={claims} setClaims={setClaims}
      />
    ),
    'inland-marine': <InlandMarine form={form} set={set} errorFor={errorFor} bpp={bpp} setBpp={setBpp} />,
    general: <GeneralQuestions form={form} set={set} errorFor={errorFor} />,
    classcode: <ClassCodeQuestions form={form} set={set} errorFor={errorFor} classCodes={classCodes} />,
  }[step]

  const isLast = index === steps.length - 1

  if (submitted) {
    return (
      <ApplicationShell
        submissionNumber={form.applicationNumber}
        steps={steps}
        activeStep={null}
        completed={Object.fromEntries(steps.map(s => [s.key, true]))}
        progress={100}
        quote={quote}
        quoteAmount={amount}
        hideFooter
      >
        <Submitted
          submissionNumber={form.applicationNumber}
          quote={quote}
          amount={amount}
          onStartOver={onExit}
        />
      </ApplicationShell>
    )
  }

  return (
    <ApplicationShell
      submissionNumber={form.applicationNumber}
      steps={steps}
      activeStep={step}
      completed={visited}
      onStepClick={(key) => {
        // Only step back to somewhere already reached.
        if (steps.findIndex(s => s.key === key) <= index) go(key)
      }}
      progress={progress}
      amount={['supplemental', 'inland-marine'].includes(step) ? amount : undefined}
      quote={quote}
      quoteAmount={amount}
      title={steps[index]?.label}
      onFormReview={() => window.alert('Application summary download is not wired up yet.')}
      onBack={back}
      onContinue={advance}
      continueLabel={
        step === 'supplemental' || step === 'inland-marine' ? 'Recalculate'
          : isLast ? 'Submit'
          : 'Save & Continue'
      }
    >
      {page}
    </ApplicationShell>
  )
}
