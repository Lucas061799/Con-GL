import { BRAND_GRADIENT } from './FormField'

// Inland Marine's bind card, shared by the payment and signature choices:
// pick one of two, and the one you pick opens what it needs inside the same
// card, under a thin rule.
export default function ChoiceCard({ selected, label, detail, onSelect, children }) {
  return (
    <div
      className={`rounded-xl transition-all ${selected ? 'cb-choice-on' : ''}`}
      style={selected ? undefined : { background: 'var(--surface-card)', border: '1.5px solid var(--line)' }}
    >
      <button type="button" onClick={onSelect} className="w-full text-left px-4 py-3.5 flex items-start gap-3">
        <span
          className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
          style={{
            border: selected ? 'none' : '2px solid var(--line-strong)',
            background: selected ? BRAND_GRADIENT : 'transparent',
          }}
        >
          {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-bold" style={{ color: 'var(--ink)' }}>{label}</span>
          {detail && (
            <span className="block text-[12px] text-gray-500 leading-relaxed mt-0.5">{detail}</span>
          )}
        </span>
      </button>
      {/* The revealed field lines up with the label, not the card edge. */}
      {selected && children && (
        <div className="pl-11 pr-4 pb-4">
          <div className="pt-4 cb-rule-brand">{children}</div>
        </div>
      )}
    </div>
  )
}
