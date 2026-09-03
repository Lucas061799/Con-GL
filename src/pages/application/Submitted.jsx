import { BRAND_GRADIENT } from '../../components/FormField'
import CarrierMark from '../../components/CarrierMark'
import { formatUSD } from '../../lib/rating'

// The end of the flow. Bind and pay live in the carrier's own system, so this
// page closes the loop and hands the submission number back to the agent.
export default function Submitted({ submissionNumber, quote, amount, onStartOver }) {
  return (
    <div className="pt-6 pb-4 flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: BRAND_GRADIENT, boxShadow: '0 8px 22px rgba(92,46,212,0.28)' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p
        className="text-[13px] font-extrabold tracking-[0.18em] mb-2"
        style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        APPLICATION SUBMITTED
      </p>
      <h2 className="text-[22px] font-bold text-navy mb-2">Thanks — we have everything we need.</h2>
      <p className="text-[13.5px] text-gray-500 max-w-md leading-relaxed">
        An underwriter will review the submission and come back to you within one business day.
        Nothing further is needed from the applicant right now.
      </p>

      <div
        className="mt-8 w-full max-w-md rounded-2xl bg-white px-6 py-5 text-left"
        style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 18px rgba(17,24,39,0.05)' }}
      >
        <Row label="Submission Number" value={submissionNumber} mono />
        {quote && (
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid #F3F4F6' }}>
            <span className="text-[12.5px] text-gray-500 font-medium">Carrier</span>
            <span className="flex items-center gap-2.5">
              <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="sm" />
              <span className="text-[13px] font-bold text-navy">{quote.carrier}</span>
            </span>
          </div>
        )}
        {amount != null && <Row label="Annual Premium" value={formatUSD(amount)} top />}
      </div>

      <button
        type="button"
        onClick={onStartOver}
        className="mt-8 px-8 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
        style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
      >
        Start a New Quote
      </button>
    </div>
  )
}

function Row({ label, value, mono, top }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={top ? { borderTop: '1px solid #F3F4F6' } : undefined}
    >
      <span className="text-[12.5px] text-gray-500 font-medium">{label}</span>
      <span className={`text-[13px] font-bold text-navy ${mono ? 'tracking-wide' : ''}`}>{value}</span>
    </div>
  )
}
