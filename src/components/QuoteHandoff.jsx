import Modal, { ModalButton } from './Modal'
import CarrierMark from './CarrierMark'

// Submitting the coverage step clears the quote, and the legacy screen says so
// before moving on to payment.
export function QuoteApproved({ quote, onContinue, onDismiss }) {
  return (
    // The footer spreads its children, so an empty first slot keeps the lone
    // button on the right with the other dialogs' primaries.
    // Wide enough for the title to hold one line next to the close button.
    <Modal title="YOUR QUOTE HAS BEEN APPROVED!" width={540} onDismiss={onDismiss} footer={
      <>
        <span />
        <ModalButton onClick={onContinue}>Continue</ModalButton>
      </>
    }>
      {/* The mark stands as tall as the three lines beside it. */}
      <div className="flex items-center gap-4">
        <CarrierMark carrier={quote?.carrier} product={quote?.product} logo={quote?.logo} size="lg" />
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Click Continue to review the submission information and select the method of payment.
        </p>
      </div>
    </Modal>
  )
}

// The other outcome of that same submit: an underwriter has to look at it, so
// there is no payment and no bind to go on to.
export function QuoteReferred({ quote, onContinue, onDismiss }) {
  return (
    <Modal title="YOUR SUBMISSION HAS BEEN REFERRED" width={540} onDismiss={onDismiss} footer={
      <>
        <span />
        <ModalButton onClick={onContinue}>Continue</ModalButton>
      </>
    }>
      <p className="text-[14px] text-gray-600 leading-relaxed">
        {quote?.carrier ?? 'The carrier'} needs an underwriter to look at this one before it can
        be quoted. A confirmation email is on its way, and you&rsquo;ll hear back from us
        shortly — there is nothing else to do here.
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
        style={{ background: 'var(--surface-soft)', border: '1px solid var(--line-panel)' }}
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
