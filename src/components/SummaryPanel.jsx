// The read-back panels shared by the submitted receipt and the review step, so
// an application looks the same wherever it is read back.

const SUMMARY_ICONS = {
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1',
  doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  tools: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
}

export function Panel({ title, icon = 'shield', action, children }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface-card)', border: '1px solid var(--line)' }}>
      <div className="flex items-center gap-2 mb-3">
        {/* The teal chip all three products use on these summary panels — the
            one place they step outside the purple. */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(115,201,183,0.12)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="#73C9B7" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={SUMMARY_ICONS[icon] || SUMMARY_ICONS.shield} />
          </svg>
        </div>
        <h3 className="text-xs font-bold flex-1" style={{ color: 'var(--ink)' }}>{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  )
}

export function Row({ label, value }) {
  if (value === '' || value == null) return null
  return (
    // The label gives up width before the value does, so a long label wraps
    // instead of squeezing the answer into a column one word wide.
    <div className="flex items-start justify-between gap-4 py-1.5" style={{ borderBottom: '1px solid var(--line-soft)' }}>
      <span className="text-[10px] leading-snug flex-1 min-w-0" style={{ color: '#9CA3AF' }}>{label}</span>
      <span className="text-[10px] font-semibold text-right leading-snug max-w-[55%]" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}

// The pencil the legacy read-back puts on each section it can send you back to.
export function EditButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${label}`}
      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition hover:bg-gray-50"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="#9CA3AF" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  )
}
