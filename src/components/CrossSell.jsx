import iconWorkersComp from '../assets/icon-workers-comp.png'

// The cross-sell block Commercial Auto closes its submission on, brought over
// to the receipt. Every product in the house runs the same three rows and
// drops whichever one the customer has just bought — Builder's Risk offers
// GL, WC and BOP; this one has just sold the GL.
//
// Workers' compensation and Access are the two the meeting named, and only
// workers' comp has a mark and a line of copy. Everything still missing wears
// the grey picture glyph and says "Placeholder" rather than borrowing another
// product's name or artwork — the third row is held open because the pattern
// runs three, not because a third product has been chosen.
//
// The prices are the house's own demo figures, carried across every product.
// Nothing here rates any of them, so they are stand-ins and have to go before
// this reaches anyone who would act on them.
const PRODUCTS = [
  {
    name: "Workers' Compensation",
    desc: 'Required coverage for the crew',
    price: '$1,200/year',
    badge: 'TOP PICK',
    icon: iconWorkersComp,
  },
  {
    name: 'Access',
    desc: 'Placeholder — product description to come',
    price: '$850/year',
    badge: 'RECOMMENDED',
    badgeColor: '#73C9B7',
    // No icon: nobody has sent the mark, so the row shows the grey picture
    // glyph rather than borrowing another product's artwork.
  },
  {
    name: 'Placeholder',
    desc: 'Placeholder — third product not chosen yet',
    price: '$450/year',
    badge: 'BEST VALUE',
    badgeColor: '#73C9B7',
  },
]

// The icon tile is white in both themes, the way CarrierMark frames the
// carrier logos. These are full-colour illustrations drawn for a light
// ground, and Commercial Auto's brand tint turns them muddy on navy — the
// one place this block parts from it.

// Stands in for a product mark nobody has supplied yet.
function NoMark() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 20" />
    </svg>
  )
}

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
                style={{ background: 'white', border: '1px solid var(--line)' }}
              >
                {item.icon
                  ? <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
                  : <NoMark />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <p className="text-sm font-bold text-navy leading-tight">{item.name}</p>
                  {/* The lead product wears the brand gradient; the rest
                      take the house teal, as they do everywhere else. */}
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md text-white shrink-0 ${item.badgeColor ? '' : 'btn-gradient'}`}
                    style={item.badgeColor ? { background: item.badgeColor } : undefined}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
              </div>

              {/* Desktop keeps the price and the action inline; the phone
                  gives them a row of their own rather than squeezing them
                  against the name. */}
              <div className="hidden md:flex items-center gap-4 shrink-0 ml-2">
                <div className="text-right">
                  <p className="text-base font-bold text-gradient leading-tight">{item.price}</p>
                  <p className="text-[10px] text-gray-400">estimated</p>
                </div>
                <button
                  type="button"
                  onClick={() => onQuote && onQuote(item.name)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl transition btn-gradient whitespace-nowrap"
                >
                  Get Quote Now →
                </button>
              </div>
            </div>

            <div
              className="md:hidden flex items-center justify-between px-4 py-3"
              style={{ borderTop: '1px solid var(--line-soft)', background: 'var(--surface-soft)' }}
            >
              <div>
                <p className="text-sm font-bold text-gradient leading-tight">{item.price}</p>
                <p className="text-[10px] text-gray-400">estimated</p>
              </div>
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
