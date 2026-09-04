import { SearchableSelect, PercentInput } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import { CLASS_CODE_OPTIONS } from '../../data/classCodes'
import { MAX_APPLICATION_CLASSIFICATIONS as MAX } from '../../data/applicationOptions'

// Same block the phase-one Applicant section uses, so a classification looks
// and behaves the same on both sides of the hand-off.
export default function Classifications({ rows, setRows }) {
  const total = rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0)
  const canAdd = rows.length < MAX

  const update = (i, patch) => setRows(rs => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const remove = (i) => setRows(rs => rs.filter((_, idx) => idx !== i))
  const add = () => setRows(rs => (rs.length < MAX ? [...rs, { code: '', percentage: '' }] : rs))

  return (
    <FieldGroup label={`Classification — add up to ${MAX}`}>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_140px_40px] gap-3 items-start">
            <SearchableSelect
              label={i === 0 ? 'Class Code' : undefined}
              required={i === 0}
              options={CLASS_CODE_OPTIONS}
              value={row.code}
              onChange={(v) => update(i, { code: v })}
              placeholder="Select class code"
              searchPlaceholder="Search trade or code…"
            />
            <PercentInput
              label={i === 0 ? 'Percentage' : undefined}
              required={i === 0}
              value={row.percentage}
              onChange={(v) => update(i, { percentage: v })}
            />
            <div className="self-end">
              {i === 0 ? (
                <button
                  type="button"
                  onClick={add}
                  disabled={!canAdd}
                  aria-label="Add classification"
                  title={canAdd ? 'Add classification' : `Up to ${MAX} classifications`}
                  className={`w-10 h-[42px] rounded-lg border flex items-center justify-center text-xl leading-none font-bold transition ${canAdd ? 'hover:border-gray-300 hover:bg-gray-50' : 'cursor-not-allowed opacity-40'}`}
                  style={{ color: '#374151', borderColor: '#E5E7EB', background: 'white' }}
                >
                  +
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(i)}
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
          className="w-[140px] rounded-lg px-3.5 py-2.5 text-sm font-bold flex items-center justify-between bg-white"
          style={{
            boxShadow: total === 100 ? '0 0 0 1px #E5E7EB' : '0 0 0 1.5px #FCA5A5',
            color: total === 100 ? '#1F2937' : '#EF4444',
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
  )
}
