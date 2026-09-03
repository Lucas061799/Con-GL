import norbielinkLogo from '../assets/norbielink-logo.png'
import btisLogo from '../assets/btislogo.png'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import { BRAND_GRADIENT } from './FormField'
import { formatUSD } from '../lib/rating'

// Phase two runs as a paged wizard rather than one scroll: the steps are long
// and each has to be saved before the next, so Back / Save & Continue anchor
// every page.
export default function ApplicationShell({
  submissionNumber, steps, activeStep, completed, onStepClick,
  progress, amount, onBack, onContinue, continueLabel = 'Save & Continue',
  continueDisabled = false, hideFooter = false,
  quote, quoteAmount, onFormReview,
  children,
}) {
  // The rail follows the applicant across the hand-off — same quote, same
  // progress, now sitting on step two.
  const railQuotes = quote ? [{ ...quote, premium: quoteAmount ?? quote.premium }] : []
  return (
    <div className="h-screen flex flex-col bg-white font-montserrat overflow-hidden">
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

      <div className="flex-1 flex min-h-0">
        <Sidebar
          productName="Contractor General Liability"
          submissionNumber={submissionNumber}
          steps={steps}
          activeStep={activeStep}
          completed={completed}
          onStepClick={onStepClick}
          progress={progress}
        />

        <main className="flex-1 min-w-0 overflow-y-auto custom-scroll">
          <div className="mx-auto px-4 md:px-10 py-6 md:py-8 max-w-4xl">
            {amount != null && (
              <p className="text-[18px] font-bold text-navy text-right pb-2 mb-6"
                style={{ borderBottom: '1px solid #D1D5DB' }}>
                Amount: <span className="font-extrabold">{formatUSD(amount)}</span>
              </p>
            )}

            {children}

            {!hideFooter && (
            <div className="flex items-center justify-between gap-4 mt-10 pb-10">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-7 py-2.5 rounded-xl text-[13.5px] font-bold text-gray-600 bg-white transition hover:bg-gray-50"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  Back
                </button>
              ) : <span />}
              <button
                type="button"
                onClick={onContinue}
                disabled={continueDisabled}
                className="px-8 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition disabled:cursor-not-allowed enabled:hover:opacity-90"
                style={continueDisabled
                  ? { background: '#E5E7EB', color: '#9CA3AF' }
                  : { background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
              >
                {continueLabel}
              </button>
            </div>
            )}
          </div>
        </main>

        <RightPanel
          progress={progress}
          quotes={railQuotes}
          selectedCarrier={quote?.id}
          onFormReview={onFormReview}
          formComplete
          inCompare
          compareStep={1}
        />
      </div>
    </div>
  )
}
