import { forwardRef } from 'react'

// One section of the long-scroll application, matching GL-BOP: a titled
// header rule, then field groups on light cards.
const Section = forwardRef(function Section({ id, title, subtitle, action, children }, ref) {
  return (
    <section ref={ref} id={id} className="rounded-2xl overflow-hidden scroll-mt-6">
      <div className="px-4 md:px-10 pt-6 md:pt-8 pb-0">
        <div
          className="flex items-center justify-between gap-4 pb-3 md:pb-4"
          style={{ borderBottom: '1px solid #D1D5DB' }}
        >
          <h2 className="text-base md:text-lg font-bold text-navy">{title}</h2>
          {action}
        </div>
      </div>

      <div className="px-4 md:px-10 pt-4 md:pt-5 pb-8 md:pb-10">
        <div className="w-full space-y-6">
          {subtitle && <p className="text-sm text-gray-500 -mt-2">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  )
})

export default Section

// A labelled cluster of fields inside a section.
export function FieldGroup({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
          {label}
        </div>
      )}
      <div
        className="rounded-xl p-5 sm:p-6"
        style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
      >
        {children}
      </div>
    </div>
  )
}

// The card GL-BOP uses for a single question row.
export function QuestionCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
    >
      {children}
    </div>
  )
}
