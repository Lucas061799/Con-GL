import { forwardRef, useState } from 'react'
import { SearchableSelect, PercentInput } from '../components/FormField'
import Section, { FieldGroup } from '../components/Section'
import { CLASS_CODE_OPTIONS } from '../data/classCodes'
import { MAX_INTAKE_CLASSIFICATIONS as MAX } from '../data/applicantOptions'

// The legacy step hangs a collapsible Class Description off every row. The
// copy belongs to the carrier's class guide, which we do not have yet, so the
// panel is laid out here with placeholder lines instead of invented text.
function ClassDescription() {
  const [open, setOpen] = useState(false)
  const line = (w) => (
    <div className="h-2.5 rounded-full" style={{ width: w, background: 'var(--fill-subtle)' }} />
  )

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition"
        style={{ background: 'var(--fill-subtle)', color: 'var(--ink-2)' }}
      >
        <span className="w-3 text-center text-[15px] leading-none">{open ? '−' : '+'}</span>
        Class Description
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg px-4 py-4 space-y-4"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--line)' }}
        >
          <div className="space-y-2">
            <p className="text-[12.5px] font-semibold" style={{ color: 'var(--ink)' }}>
              The following operations are included in this classification:
            </p>
            <div className="space-y-1.5 pl-3">{line('82%')}{line('64%')}</div>
          </div>
          <div className="space-y-2">
            <p className="text-[12.5px] font-semibold" style={{ color: 'var(--ink)' }}>
              The following operations are not included in this classification:
            </p>
            <div className="space-y-1.5 pl-3">{line('74%')}{line('88%')}{line('56%')}</div>
          </div>
          <p className="text-[11px] text-gray-400">
            Placeholder — the class guide copy is not wired up yet.
          </p>
        </div>
      )}
    </div>
  )
}

// Step one of the legacy flow: the class split, before anything is asked about
// the applicant. Rows must add up to exactly 100%.
const ClassificationsStep = forwardRef(function ClassificationsStep(
  { classifications, setClassifications }, ref
) {
  const total = classifications.reduce((sum, row) => sum + (Number(row.percentage) || 0), 0)
  const canAdd = classifications.length < MAX

  const updateRow = (i, patch) =>
    setClassifications(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addRow = () =>
    setClassifications(rows => (rows.length < MAX ? [...rows, { code: '', percentage: '' }] : rows))
  const removeRow = (i) =>
    setClassifications(rows => rows.filter((_, idx) => idx !== i))

  return (
    <Section ref={ref} id="classes" title="Classifications">
      <FieldGroup label="Classification (add up to four)">
        <div className="space-y-3">
          {classifications.map((row, i) => (
            <div key={i}>
              <div className="grid grid-cols-[1fr_140px_40px] gap-3 items-start">
                <SearchableSelect
                  label={i === 0 ? 'Class Code' : undefined}
                  required={i === 0}
                  options={CLASS_CODE_OPTIONS}
                  value={row.code}
                  onChange={(v) => updateRow(i, { code: v })}
                  placeholder="Select class code"
                  searchPlaceholder="Search trade or code…"
                />
                <PercentInput
                  label={i === 0 ? '% of Work' : undefined}
                  required={i === 0}
                  value={row.percentage}
                  onChange={(v) => updateRow(i, { percentage: v })}
                />
                <div className="self-end">
                  {i === 0 ? (
                    <button
                      type="button"
                      onClick={addRow}
                      disabled={!canAdd}
                      aria-label="Add classification"
                      title={canAdd ? 'Add classification' : `Up to ${MAX} classifications`}
                      className={`w-10 h-[42px] rounded-lg border flex items-center justify-center text-xl leading-none font-bold transition ${canAdd ? 'hover:border-gray-300 hover:bg-gray-50' : 'cursor-not-allowed opacity-40'}`}
                      style={{ color: 'var(--ink-2)', borderColor: 'var(--line)', background: 'var(--surface-card)' }}
                    >
                      +
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      aria-label="Remove classification"
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="pr-[192px]">
                <ClassDescription />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          <span className="text-[13px] font-bold text-navy">Total:</span>
          <div
            className="w-[140px] rounded-lg px-3.5 py-2.5 text-sm font-bold flex items-center justify-between bg-white"
            style={{
              boxShadow: total === 100 ? '0 0 0 1px var(--line)' : '0 0 0 1.5px #FCA5A5',
              color: total === 100 ? 'var(--ink)' : '#EF4444',
            }}
          >
            <span>{total}</span>
            <span className="text-gray-400">%</span>
          </div>
          <span className="w-10" />
        </div>
        {total !== 100 && (
          <p className="text-[11px] text-red-500 text-right mt-1.5">
            Classification percentages must add up to 100%.
          </p>
        )}
      </FieldGroup>
    </Section>
  )
})

export default ClassificationsStep
