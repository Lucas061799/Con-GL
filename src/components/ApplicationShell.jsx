import norbielinkLogo from '../assets/norbielink-logo.png'
import btisLogo from '../assets/btislogo.png'
import norbielinkLogoDark from '../assets/norbielink-logo-dark.png'
import btisLogoDark from '../assets/btislogo-dark.png'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

// Phase two is one long scroll like phase one: every step is on the page and
// the rail is scroll navigation, not paging.
export default function ApplicationShell({
  submissionNumber, steps, activeStep, completed, onStepClick,
  progress,
  quote, quoteAmount, onFormReview, summaryReady = false, submitted = false,
  bare = false, scrollRef, railExtras,
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
        <img src={norbielinkLogo} alt="NorbieLink" className="h-8 logo-light" />
        <img src={norbielinkLogoDark} alt="NorbieLink" className="h-8 logo-dark" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 tracking-wide font-semibold">POWERED BY</span>
          <img src={btisLogo} alt="btis" className="h-6 logo-light" />
          <img src={btisLogoDark} alt="btis" className="h-6 logo-dark" />
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
          {...railExtras}
        />

        <main ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto custom-scroll">
          <div className={`mx-auto max-w-5xl 2xl:max-w-6xl ${
            bare ? '' : 'px-4 md:px-10 py-6 md:py-8 space-y-6 md:space-y-8'
          }`}>
            {children}
          </div>
        </main>

        <RightPanel
          progress={progress}
          quotes={railQuotes}
          selectedCarrier={quote?.id}
          onFormReview={onFormReview}
          formComplete={summaryReady}
          submitted={submitted}
          inCompare
          compareStep={1}
        />
      </div>
    </div>
  )
}
