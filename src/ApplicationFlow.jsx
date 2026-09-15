import { useState, useMemo, useRef, useEffect } from 'react'
import ApplicationShell from './components/ApplicationShell'
import Section from './components/Section'
import { BRAND_GRADIENT } from './components/FormField'
import { QuoteApproved } from './components/QuoteHandoff'
import { rulesForCodes, needsUnderwriterReview } from './data/conditionalQuestions'
import { ALL_STEPS, APPLICATION_STEPS, STAGE_OF, isIntakeStep } from './data/flowSteps'
import { applicationMissing } from './lib/applicationValidation'
import EligibilityStatements from './pages/application/EligibilityStatements'
import CoverageCustomization from './pages/application/CoverageCustomization'
import ReviewSelectPayment from './pages/application/ReviewSelectPayment'
import ApplicationSummary from './pages/application/ApplicationSummary'
import SignAndBind from './pages/application/SignAndBind'
import ApplicationPreview from './pages/application/ApplicationPreview'
import QuoteSummary from './pages/application/QuoteSummary'
import Submitted from './pages/application/Submitted'

// The form, the classifications and the uploads all live in App, so stepping
// back into phase one to fix something keeps every answer on both sides.
export default function ApplicationFlow({
  form, set, rows = [], files = [], setFiles,
  applicationNumber, resumeAt, onEditIntake, intakeCompleted = {},
  quote, amount, onExit, onStartOver, railExtras,
}) {
  const [activeStep, setActiveStep] = useState(resumeAt?.step ?? 'eligibility')
  const [stage, setStage] = useState(resumeAt?.stage ?? 'form')
  const [submitted, setSubmitted] = useState(false)
  const [approved, setApproved] = useState(false)
  const [preview, setPreview] = useState(false)
  // Errors belong to the page you have actually tried to submit — arriving on
  // the payment page should not flag choices you have not reached yet.
  const [touched, setTouched] = useState({ form: false, bind: false })
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})

  // The rail shows the whole submission; this page renders its own four.
  const steps = APPLICATION_STEPS

  /* ── Validation ─────────────────────────────────────────────────── */

  const missingBySection = useMemo(() => applicationMissing(form, files), [form, files])

  // The rail's eight: the intake's four came in done, and these four answer
  // for themselves.
  const completed = {
    ...intakeCompleted,
    eligibility: missingBySection.eligibility.length === 0,
    coverage: missingBySection.coverage.length === 0,
    review: missingBySection.review.length === 0,
    bind: missingBySection.bind.length === 0,
  }

  const allMissing = Object.values(missingBySection).flat()

  const errorFor = (key) => {
    const section = Object.keys(missingBySection).find(k => missingBySection[k].includes(key))
    return !!section && !!touched[STAGE_OF[section]]
  }

  const progress = Math.round(
    (ALL_STEPS.filter(s => completed[s.key]).length / ALL_STEPS.length) * 100,
  )

  /* ── Scroll navigation ──────────────────────────────────────────── */

  const jumpTo = (key) => {
    setActiveStep(key)
    setStage(STAGE_OF[key] ?? 'form')
    // Two frames: the other page has to mount before it can be scrolled to.
    requestAnimationFrame(() => requestAnimationFrame(() =>
      sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })))
  }

  // A pencil on one of the phase-one panels hands control back to App, telling
  // it where to return; the rest scroll within phase two.
  const edit = (key) => {
    if (isIntakeStep(key)) {
      onEditIntake && onEditIntake(key, { stage, step: activeStep })
      return
    }
    jumpTo(key)
  }

  // Coming back from a phase-one edit, land on the step that sent us there.
  useEffect(() => {
    if (!resumeAt?.step) return
    requestAnimationFrame(() => requestAnimationFrame(() =>
      sectionRefs.current[resumeAt.step]?.scrollIntoView({ block: 'start' })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [steps.length, submitted, stage])

  // Disagreeing with the terms sends it to an underwriter, and so does high
  // value home work over the threshold, as the class questions spell out.
  const underwriterReview =
    form.agreeTerms === 'no' ||
    needsUnderwriterReview(rulesForCodes(rows.map(r => r.code).filter(Boolean)), form)

  const submit = () => {
    setTouched({ form: true, bind: true })
    if (allMissing.length) {
      const first = steps.find(s => !completed[s.key])
      if (first) jumpTo(first.key)
      return
    }
    // The approval dialog belongs to the coverage submit; this one is the end
    // of the flow, so it goes straight to the receipt.
    setSubmitted(true)
  }

  // Legacy submits at the end of Coverage Customization: the quote clears, and
  // the applicant carries on to payment.
  const submitCoverage = () => {
    setTouched(t => ({ ...t, form: true }))
    const blocked = ['eligibility', 'coverage'].find(k => missingBySection[k].length)
    if (blocked) { jumpTo(blocked); return }
    // Commercial Auto reads the application back before it goes anywhere.
    setPreview(true)
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  const pages = {
    eligibility: <EligibilityStatements form={form} set={set} errorFor={errorFor} rows={rows} />,
    coverage: <CoverageCustomization form={form} set={set} errorFor={errorFor} />,
    review: (
      <ReviewSelectPayment
        form={form} set={set} errorFor={errorFor}
        amount={amount} rows={rows}
        onContinue={() => jumpTo('bind')} onEdit={edit}
      />
    ),
    bind: (
      <SignAndBind
        form={form} set={set} errorFor={errorFor}
        files={files} setFiles={setFiles}
        onDownload={() => setTimeout(() => window.print(), 50)}
      />
    ),
  }

  if (submitted) {
    return (
      <ApplicationShell
        railExtras={railExtras}
        submissionNumber={applicationNumber}
        steps={ALL_STEPS}
        activeStep={null}
        completed={Object.fromEntries(ALL_STEPS.map(s => [s.key, true]))}
        progress={100}
        quote={quote}
        quoteAmount={amount}
        summaryReady
        submitted
        onFormReview={() => setTimeout(() => window.print(), 50)}
      >
        <Submitted
          submissionNumber={applicationNumber}
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
      submissionNumber={applicationNumber}
      steps={ALL_STEPS}
      activeStep={activeStep}
      completed={completed}
      onStepClick={edit}
      progress={progress}
      quote={quote}
      quoteAmount={amount}
      premium={{
        form, amount, quote,
        onBrokerFee: set('brokerFee'),
        // Legacy submits from under the breakdown, and only on the first page.
        onSubmit: stage === 'form' ? submitCoverage : null,
      }}
      summaryReady
      // Legacy offers the quote alongside the coverage, and the application
      // itself once you are on the payment page.
      downloadLabel={stage === 'form' ? 'Download Quick Quote' : 'Download Application Summary'}
      onFormReview={() => setTimeout(() => window.print(), 50)}
      scrollRef={scrollRef}
      bare
    >
      {steps.filter(s => STAGE_OF[s.key] === stage).map(s => (
        <Section
          key={s.key}
          id={s.key}
          title={s.label}
          ref={el => { sectionRefs.current[s.key] = el }}
        >
          {pages[s.key]}
        </Section>
      ))}

      {stage === 'bind' && (
      <div className="px-4 md:px-10 pb-10 flex justify-start">
        <button
          type="button"
          onClick={submit}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
        >
          {underwriterReview ? 'Submit for Underwriter Review' : 'Submit Application'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      )}

      {/* Print target for the rail's download. The first page hands over the
          quote; the payment page hands over the application itself. */}
      <div id="submission-print-area" className="print-summary">
        {stage === 'form' ? (
          <QuoteSummary
            form={form} quote={quote} amount={amount}
            submissionNumber={applicationNumber}
          />
        ) : (
          <ApplicationSummary form={form} rows={rows} />
        )}
      </div>

      {preview && (
        <ApplicationPreview
          form={form}
          rows={rows}
          onClose={() => setPreview(false)}
          onSubmit={() => { setPreview(false); setApproved(true) }}
        />
      )}

      {approved && (
        <QuoteApproved
          quote={quote}
          onContinue={() => { setApproved(false); jumpTo('review') }}
          onDismiss={() => setApproved(false)}
        />
      )}
    </ApplicationShell>
  )
}
