import { forwardRef } from 'react'
import { Input, Select, SearchableSelect, DateInput, Checkbox, PercentInput } from '../components/FormField'
import Section, { FieldGroup } from '../components/Section'
import { FIELD_HELP } from '../data/fieldHelp'
import { CLASS_CODE_OPTIONS } from '../data/classCodes'
import { ENTITY_TYPES, AVAILABLE_STATES, MAX_CLASSIFICATIONS } from '../data/applicantOptions'

// Section 2 — license, legal identity, address, and the class-code split.
// Classification rows must add up to exactly 100%.
const ApplicantBusiness = forwardRef(function ApplicantBusiness(
  { form, set, errorFor, classifications, setClassifications }, ref
) {
  const total = classifications.reduce((sum, row) => sum + (Number(row.percentage) || 0), 0)
  const canAdd = classifications.length < MAX_CLASSIFICATIONS

  const updateRow = (i, patch) =>
    setClassifications(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addRow = () =>
    setClassifications(rows => (rows.length < MAX_CLASSIFICATIONS ? [...rows, { code: '', percentage: '' }] : rows))
  const removeRow = (i) =>
    setClassifications(rows => rows.filter((_, idx) => idx !== i))

  return (
    <Section ref={ref} id="business" title="Business Information">
      <FieldGroup label="License & Effective Date">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-x-6 gap-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
              Contractors License or App. Fee Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.licenseNumber || ''}
                onChange={(e) => set('licenseNumber')(e.target.value)}
                placeholder="License or app. fee number"
                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 hover:border-gray-300 transition-all"
              />
              <button
                type="button"
                aria-label="Look up license"
                onClick={() => window.alert('License lookup is not wired up yet.')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md transition hover:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
          </div>

          <DateInput
            label="Effective Date" required
            value={form.effectiveDate} onChange={set('effectiveDate')}
            error={errorFor('effectiveDate')}
          />
        </div>
      </FieldGroup>

      <FieldGroup label="Legal Identity">
        <div className="space-y-5">
          <Input
            label="DBA" required
            value={form.dba} onChange={set('dba')}
            error={errorFor('dba')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] gap-x-6 gap-y-5">
            <Input
              label="Legal Business Name" required
              value={form.legalName} onChange={set('legalName')}
              error={errorFor('legalName')}
            />
            <Select
              label="Entity Type" required
              hint={FIELD_HELP.entityType}
              options={ENTITY_TYPES}
              value={form.entityType} onChange={set('entityType')}
              placeholder="Select entity type"
              error={errorFor('entityType')}
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Business Address">
        <div className="space-y-5">
          <Input
            label="Business Street Address" required
            value={form.street} onChange={set('street')}
            error={errorFor('street')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Input
              label="City" required
              value={form.city} onChange={set('city')}
              error={errorFor('city')}
            />
            <Select
              label="State/Province" required
              hint={FIELD_HELP.state}
              options={AVAILABLE_STATES}
              value={form.state} onChange={set('state')}
              placeholder="Select"
              error={errorFor('state')}
            />
            <Input
              label="Postal Code" required
              maxLength={5}
              value={form.postalCode}
              onChange={(v) => set('postalCode')(v.replace(/\D/g, ''))}
              error={errorFor('postalCode')}
            />
          </div>
          <Checkbox
            label="Mailing is the same as business"
            checked={!!form.mailingSame}
            onChange={set('mailingSame')}
          />
        </div>
      </FieldGroup>

      <FieldGroup label={`Classification — add up to ${MAX_CLASSIFICATIONS}`}>
        <div className="flex items-end justify-end mb-3">
          <p className="text-[13px] font-bold text-navy">% of Work</p>
        </div>

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
                label={i === 0 ? 'Percentage' : undefined}
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
                    title={canAdd ? 'Add classification' : `Up to ${MAX_CLASSIFICATIONS} classifications`}
                    className={`w-10 h-[42px] rounded-lg border flex items-center justify-center text-xl leading-none font-bold transition ${canAdd ? 'hover:border-gray-300 hover:bg-gray-50' : 'cursor-not-allowed opacity-40'}`}
                    style={{ color: '#374151', borderColor: '#E5E7EB', background: 'white' }}
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
            className="w-[140px] rounded-lg px-3.5 py-2.5 text-sm font-bold flex items-center justify-between bg-white"
            style={{
              boxShadow: total === 100 ? '0 0 0 1px #E5E7EB' : '0 0 0 1.5px #FCA5A5',
              color: total === 100 ? '#1F2937' : '#EF4444',
            }}
          >
            <span>{total}</span>
            <span className="text-gray-400">%</span>
          </div>
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

export default ApplicantBusiness
