import iconWorkersComp from '../assets/icon-workers-comp.png'

// The cross-sell block Commercial Auto closes its submission on, brought over
// to the receipt. The pitch is the prefill: the client's details are already
// on file, so the next product is minutes rather than another intake.
//
// No prices. Commercial Auto prints an estimate beside each product, but it
// has demo figures to print; nothing here rates workers' compensation, and a
// made-up premium on a page that is otherwise a record of real answers would
// be read as one.
const PRODUCTS = [
  {
    name: "Workers' Compensation",
    desc: 'Required coverage for employees',
    badge: 'TOP PICK',
    icon: iconWorkersComp,
  },
]

function Bolt() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="url(#csBolt)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
      <defs>
        <linearGradient id="csBolt" gradientUnits="userSpaceOnUse" x1="3" y1="12" x2="21" y2="12">
          <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
          <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
        </linearGradient>
      </defs>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

export default function CrossSell({ onQuote }) {
  return (
    <div
      className="screen-only rounded-2xl px-4 md:px-10 py-6 md:py-8 mb-6"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--line-soft)' }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Bolt />
          <span className="text-[10px] font-bold tracking-widest uppercase text-gradient">
            Cross-Sell Opportunities
          </span>
        </div>
        <h3 className="text-lg md:text-2xl font-bold text-navy mb-2 leading-snug">
          We prefill your information<br className="hidden md:block" /> to save you time.{' '}
          <span className="text-gradient">Why wait?</span>
        </h3>
        <p className="text-xs md:text-sm text-gray-400">
          Client info is already saved — adding coverages takes minutes.
        </p>
      </div>

      <div className="space-y-3">
        {PRODUCTS.map(item => (
          <div
            key={item.name}
            className="rounded-2xl overflow-hidden transition hover:shadow-sm"
            style={{ border: '1px solid var(--line-soft)' }}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--fill-subtle)' }}
              >
                <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <p className="text-sm font-bold text-navy leading-tight">{item.name}</p>
                  <span className="btn-gradient text-[8px] font-bold px-1.5 py-0.5 rounded-md text-white shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
              </div>

              {/* Desktop keeps the action inline; the phone gives it a row of
                  its own rather than squeezing it against the name. */}
              <button
                type="button"
                onClick={() => onQuote && onQuote(item.name)}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition btn-gradient whitespace-nowrap shrink-0 ml-2"
              >
                Get Quote Now →
              </button>
            </div>

            <div
              className="md:hidden flex items-center justify-end px-4 py-3"
              style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--surface-soft)' }}
            >
              <button
                type="button"
                onClick={() => onQuote && onQuote(item.name)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-white rounded-xl transition btn-gradient whitespace-nowrap"
              >
                Get Quote Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
