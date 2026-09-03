import { BRAND_GRADIENT } from './FormField'

// Centred dialog used for the hand-off between the indication and the
// application. Click the scrim to dismiss where a cancel path exists.
export default function Modal({ title, onDismiss, children, footer, width = 420 }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
      style={{ background: 'rgba(15,10,40,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      <div
        className="rounded-2xl bg-white overflow-hidden"
        style={{ width, boxShadow: '0 24px 64px rgba(15,10,40,0.28)' }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="px-7 pt-6 pb-4">
            <h3 className="text-[17px] font-bold text-navy tracking-wide">{title}</h3>
            <div className="mt-4" style={{ borderBottom: '1px solid #F3F4F6' }} />
          </div>
        )}
        <div className="px-7 pb-7">{children}</div>
        {/* Secondary left, primary right — the same footer order the
            application wizard uses. */}
        {/* Secondary left, primary right — the footer Builder's Risk uses on
            Compare Your Quotes. */}
        {footer && <div className="px-7 pb-7 flex items-center justify-between gap-3">{footer}</div>}
      </div>
    </div>
  )
}

export function ModalButton({ children, onClick, variant = 'primary' }) {
  const primary = variant === 'primary'
  return (
    <button
      type="button"
      onClick={onClick}
      className={primary
        ? 'px-6 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90'
        : 'px-5 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-white transition hover:bg-gray-50'}
      style={primary
        ? { background: BRAND_GRADIENT, boxShadow: '0 4px 18px rgba(92,46,212,0.30)' }
        : { border: '1.5px solid #E5E7EB' }}
    >
      {children}
    </button>
  )
}
