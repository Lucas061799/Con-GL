import Modal, { ModalButton } from './Modal'
import CarrierMark from './CarrierMark'

// Two-step hand-off between the price indication and the full application,
// as the marketplace does it: warn about the turnaround, then confirm the
// quote is ready before moving on.
export function TurnaroundNotice({ onContinue, onCancel }) {
  return (
    <Modal title="HEADS UP!" onDismiss={onCancel} footer={
      <>
        <ModalButton onClick={onContinue}>Continue</ModalButton>
        <ModalButton variant="ghost" onClick={onCancel}>Cancel</ModalButton>
      </>
    }>
      <p className="text-[14px] text-gray-600 leading-relaxed">This quote has a 24-hour turnaround time.</p>
      <p className="text-[14px] text-gray-600 leading-relaxed mt-3">Would you like to proceed?</p>
    </Modal>
  )
}

export function QuoteReady({ quote, onGo }) {
  return (
    <Modal title="YOUR QUOTE IS READY" width={520}>
      <div className="flex items-center gap-6">
        <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="lg" />
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Click on the button below to finish your submission
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <ModalButton onClick={onGo}>Go to Quote</ModalButton>
      </div>
    </Modal>
  )
}
