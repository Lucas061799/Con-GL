import { SearchableSelect, PercentInput } from './FormField'
import { CLASS_CODE_OPTIONS } from '../data/classCodes'
import { MAX_INTAKE_CLASSIFICATIONS as MAX } from '../data/applicantOptions'

// The class split: rows of trade and percentage that must come to exactly 100.
//
// It lives here rather than in the Classifications step because the carrier's
// eligibility page edits the same rows — reading the statements is when
// someone works out they picked the wrong class, and sending them three
// screens back to fix it loses their place.
export default function ClassificationRows({ classifications, setClassifications }) {
  const total = classifications.reduce((sum, row) => sum + (Number(row.percentage) || 0), 0)
  const canAdd = classifications.length < MAX

  const updateRow = (i, patch) =>
    setClassifications(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addRow = () =>
    setClassifications(rows => (rows.length < MAX ? [...rows, { code: '', percentage: '' }] : rows))
  const removeRow = (i) =>
    setClassifications(rows => rows.filter((_, idx) => idx !== i))

  return (
    <>
      <div className="space-y-3">
        {classifications.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_140px_40px] gap-3 items-start">
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
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 mt-5">
        <span className="text-[13px] font-bold text-navy">Total:</span>
        <div
          className="w-[140px] rounded-lg px-3.5 py-2.5 text-sm font-bold flex items-center justify-between field-fill"
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
    </>
  )
}
