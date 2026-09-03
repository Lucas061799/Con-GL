import { SearchableSelect, PercentInput, BRAND_GRADIENT } from '../../components/FormField'
import { CLASS_CODE_OPTIONS, CLASS_CODES } from '../../data/classCodes'
import { MAX_APPLICATION_CLASSIFICATIONS } from '../../data/applicationOptions'

const labelFor = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? ''

export default function Classifications({ rows, setRows }) {
  const total = rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0)
  const canAdd = rows.length < MAX_APPLICATION_CLASSIFICATIONS

  const update = (i, patch) => setRows(rs => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const remove = (i) => setRows(rs => rs.filter((_, idx) => idx !== i))
  const add = () => setRows(rs => (rs.length < MAX_APPLICATION_CLASSIFICATIONS ? [...rs, { code: '', percentage: '' }] : rs))

  return (
    <div>
      <div
        className="grid grid-cols-[1fr_160px_80px] gap-4 items-end pb-3"
        style={{ borderBottom: '1px solid #D1D5DB' }}
      >
        <p className="text-[15px] font-extrabold text-navy">
          Classifications{' '}
          <span className="font-semibold text-gray-400">(add up to {MAX_APPLICATION_CLASSIFICATIONS})</span>
        </p>
        <p className="text-[13px] font-bold text-navy">% of work</p>
        <p className="text-[13px] font-bold text-navy text-right">Action</p>
      </div>

      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_160px_80px] gap-4 items-center py-4"
          style={{ borderBottom: '1px solid #F3F4F6' }}
        >
          {row.code ? (
            <p className="text-[14px] font-semibold text-navy">{labelFor(row.code)}</p>
          ) : (
            <SearchableSelect
              options={CLASS_CODE_OPTIONS}
              value={row.code}
              onChange={(v) => update(i, { code: v })}
              placeholder="Select class code"
              searchPlaceholder="Search trade or code…"
            />
          )}
          <PercentInput value={row.percentage} onChange={(v) => update(i, { percentage: v })} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove classification"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-red-50"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end gap-6 py-4">
        <span className="text-[14px] font-bold text-navy">Total</span>
        <span className={`text-[14px] font-bold w-[160px] ${total === 100 ? 'text-navy' : 'text-red-500'}`}>
          {total}
        </span>
        <span className="w-[80px]" />
      </div>
      {total !== 100 && (
        <p className="text-[12px] text-red-500 text-right">The total percentage must be 100.</p>
      )}

      {canAdd && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 mt-4 transition hover:opacity-70"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#addClsG)" />
            <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="addClsG" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[13.5px] font-bold" style={{
            background: BRAND_GRADIENT, WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Add a classification
          </span>
        </button>
      )}
    </div>
  )
}
