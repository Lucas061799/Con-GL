import { useState, useMemo, useRef, useEffect } from 'react'
import ApplicationShell from './components/ApplicationShell'
import Section from './components/Section'
import { BRAND_GRADIENT } from './components/FormField'
import { QuoteApproved, QuoteReferred } from './components/QuoteHandoff'
import { rulesForCodes, needsUnderwriterReview } from './data/conditionalQuestions'
import { ALL_STEPS, APPLICATION_STEPS, STAGE_OF, isIntakeStep } from './data/flowSteps'
import { applicationMissing } from './lib/applicationValidation'
import { PRICED_KEYS } from './data/coverageOptions'
import NorbieLoader from './components/NorbieLoader'
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
  const [submitted, setSubmitted] = useState(!!resumeAt?.submitted)
  const [approved, setApproved] = useState(false)
  const [referred, setReferred] = useState(false)
  // A priced answer sends a rate call. Until it comes back the figures are
  // stale, so the card says so and the page stops taking clicks — the same
  // reason the current system blocks the screen behind its spinner.
  const [pricing, setPricing] = useState(false)
  const pricingTimer = useRef(null)
  const [preview, setPreview] = useState(false)
  // Errors belong to the page you have actually tried to submit — arriving on
  // the payment page should not flag choices you have not reached yet.
  const [touched, setTouched] = useState({ form: false, bind: false })
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})

  // The rail shows the whole submission; this page renders its own four.
  const steps = APPLICATION_STEPS

  // Stands in for the carrier's rate call until there is one to wait on. Long
  // enough to see, because theirs will be: nobody yet knows whether RLI comes
  // back in two seconds or fifteen.
  const RATE_CALL_MS = 3600
  const setPriced = (key) => (value) => {
    set(key)(value)
    if (!PRICED_KEYS.has(key)) return
    setPricing(true)
    clearTimeout(pricingTimer.current)
    pricingTimer.current = setTimeout(() => setPricing(false), RATE_CALL_MS)
  }
  useEffect(() => () => clearTimeout(pricingTimer.current), [])

  /* ── Validation ─────────────────────────────────────────────────── */

  const missingBySection = useMemo(
    () => applicationMissing(form, files, rows.map(r => r.code).filter(Boolean)),
    [form, files, rows],
  )

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
    // Whichever section has crossed the top third is the active one. Reading
    // the positions rather than the entries matters on the way back up, where
    // the only entry in the batch is the section that just left.
    const pick = () => {
      const line = root.getBoundingClientRect().top + root.clientHeight * 0.34
      const seen = Object.entries(sectionRefs.current)
        .filter(([, el]) => el)
        .map(([key, el]) => [key, el.getBoundingClientRect().top])
        .sort((a, b) => a[1] - b[1])
      const above = seen.filter(([, top]) => top <= line)
      const next = (above.length ? above[above.length - 1] : seen[0])?.[0]
      if (next) setActiveStep(next)
    }
    const observer = new IntersectionObserver(
      pick,
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
    coverage: <CoverageCustomization form={form} set={setPriced} errorFor={errorFor} busy={pricing} />,
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
        pricing,
        // Legacy submits from under the breakdown, and only on the first page.
        onSubmit: stage === 'form' ? submitCoverage : null,
        // Legacy submits at the foot of Coverage Customization, so while the
        // reader is still up in the statements the button waits.
        // Nothing is submitted mid-rate-call either.
        submitDisabled: pricing || (stage === 'form' && activeStep === 'eligibility'),
        // The overlay lost its caption, so the card carries the line: under a
        // greyed-out Submit is where someone looks for the reason anyway.
        submitHint: pricing ? 'Pricing your cover…' : 'Read through the eligibility statements first.',
      }}
      summaryReady
      // Legacy offers the quote alongside the coverage, and the application
      // itself once you are on the payment page.
      downloadLabel={stage === 'form' ? 'Download Quick Quote' : 'Download Application Summary'}
      onFormReview={() => setTimeout(() => window.print(), 50)}
      scrollRef={scrollRef}
    >
      {steps.filter(s => STAGE_OF[s.key] === stage).map(s => (
        <Section
          key={s.key}
          id={s.key}
          title={s.label}
          ref={el => { sectionRefs.current[s.key] = el }}
        >
          {pages[s.key]}

          {/* The step's own action, inside the step and sized like the one
              that ends the intake — it was floating below every section, out
              of line with the content column. */}
          {s.key === 'bind' && (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.25)' }}
            >
              {/* Not "submit" — the application went in at the end of the
                  coverage. This asks the carrier to bind, and nothing is bound
                  until the insured signs or the signed copy comes back. */}
              {underwriterReview ? 'Submit for Underwriter Review' : 'Request to Bind'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </Section>
      ))}

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

      {/* The rate call blocks the screen, the way the current system's spinner
          does — one answer in flight at a time. */}
      {pricing && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center"
          style={{
            background: railExtras?.dark ? 'rgba(19,22,41,0.82)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(3px)',
          }}
          role="status"
          aria-live="polite"
        >
          <div className="w-[130px] h-[130px]">
            <NorbieLoader dark={railExtras?.dark} />
          </div>
        </div>
      )}

      {preview && (
        <ApplicationPreview
          form={form}
          rows={rows}
          onClose={() => setPreview(false)}
          // Submitting the application is where it gets approved or referred.
          // A referral never reaches the payment and bind steps — an
          // underwriter has it, and the receipt says so.
          onSubmit={() => {
            setPreview(false)
            if (underwriterReview) setReferred(true)
            else setApproved(true)
          }}
        />
      )}

      {approved && (
        <QuoteApproved
          quote={quote}
          onContinue={() => { setApproved(false); jumpTo('review') }}
          onDismiss={() => setApproved(false)}
        />
      )}

      {referred && (
        <QuoteReferred
          quote={quote}
          onContinue={() => { setReferred(false); setSubmitted(true) }}
          onDismiss={() => setReferred(false)}
        />
      )}
    </ApplicationShell>
  )
}
