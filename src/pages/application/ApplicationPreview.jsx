import { BRAND_GRADIENT } from '../../components/FormField'
import ApplicationSummary from './ApplicationSummary'

// Commercial Auto's Application Preview: everything entered so far in one
// scrolling sheet, with a way back to edit and the real submit at the foot.
export default function ApplicationPreview({ form, rows = [], onClose, onSubmit }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,10,40,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh', background: 'var(--surface-soft)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="shrink-0" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--line-soft)' }}>
          <div className="flex items-start gap-4 px-5 pt-4 pb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="prevHdrG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
                    <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
                  </linearGradient>
                </defs>
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke="url(#prevHdrG)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>Application Preview</h1>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9CA3AF' }}>
                Review all details before submitting your application.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-gray-50"
              style={{ border: '1px solid var(--line)', background: 'var(--surface-card)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <path stroke="url(#prevHdrG)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4" style={{ background: 'var(--surface-soft)' }}>
          <ApplicationSummary form={form} rows={rows} />
        </div>

        <div
          className="shrink-0 px-5 py-3.5 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-card)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition hover:bg-gray-50"
            style={{ color: 'var(--ink-2)', border: '1px solid var(--line)', background: 'var(--surface-card)' }}
          >
            ← Back to Edit
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.3)' }}
          >
            Submit Application →
          </button>
        </div>
      </div>
    </div>
  )
}
