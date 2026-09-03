import norbielinkLogo from '../assets/norbielink-logo.png'
import btisLogo from '../assets/btislogo.png'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

// Page chrome for the application: 56px header, white step rail, one long
// scrolling column of sections, and the quote rail — the GL-BOP layout.
export default function AppShell({
  productName, submissionNumber,
  steps, activeStep, completed, onStepClick,
  progress, quotes, stale, onRefresh, selectedCarrier, onSelectCarrier, onFormReview, formComplete,
  scrollRef,
  children,
}) {
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
          productName={productName}
          submissionNumber={submissionNumber}
          steps={steps}
          activeStep={activeStep}
          completed={completed}
          onStepClick={onStepClick}
        />

        <main ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto custom-scroll relative">
          <div className="mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6 md:space-y-8 max-w-5xl 2xl:max-w-6xl">
            {children}
            <div className="pb-8" />
          </div>
        </main>

        <RightPanel
          progress={progress}
          quotes={quotes}
          stale={stale}
          onRefresh={onRefresh}
          selectedCarrier={selectedCarrier}
          onSelectCarrier={onSelectCarrier}
          onFormReview={onFormReview}
          formComplete={formComplete}
        />
      </div>
    </div>
  )
}
