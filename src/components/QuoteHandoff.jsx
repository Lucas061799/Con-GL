import Modal, { ModalButton } from './Modal'
import CarrierMark from './CarrierMark'

// Two-step hand-off between the price indication and the full application,
// as the marketplace does it: warn about the turnaround, then confirm the
// quote is ready before moving on.
export function TurnaroundNotice({ onContinue, onCancel }) {
  return (
    <Modal title="HEADS UP!" onDismiss={onCancel} footer={
      <>
        <ModalButton variant="ghost" onClick={onCancel}>Cancel</ModalButton>
        <ModalButton onClick={onContinue}>Continue</ModalButton>
      </>
    }>
      <p className="text-[14px] text-gray-600 leading-relaxed">
        This quote has a 24-hour turnaround time — would you like to proceed?
      </p>
    </Modal>
  )
}

export function QuoteReady({ quote, onGo, onCancel }) {
  return (
    <Modal title="YOUR QUOTE IS READY" onDismiss={onCancel} footer={
      <>
        <ModalButton variant="ghost" onClick={onCancel}>Back</ModalButton>
        <ModalButton onClick={onGo}>Go to Quote</ModalButton>
      </>
    }>
      {/* Carrier row first, then the instruction — the button belongs in the
          footer with the rest of the dialogs, not floating in the body. */}
      <div
        className="flex items-center gap-3 rounded-xl p-3 mb-4"
        style={{ background: '#F9FAFB', border: '1px solid #EAEAEA' }}
      >
        <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{quote.carrier}</p>
          <p className="text-[11px] text-gray-400 truncate">{quote.product}</p>
        </div>
      </div>
      <p className="text-[14px] text-gray-600 leading-relaxed">
        Click the button below to finish your submission.
      </p>
    </Modal>
  )
}
