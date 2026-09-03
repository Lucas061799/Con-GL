import { Input, Select, Textarea, CurrencyInput, YesNo, BRAND_GRADIENT } from '../../components/FormField'
import { PER_JOB_SITE_LIMITS, IM_DEDUCTIBLES, LOCATION_OPTIONS } from '../../data/applicationOptions'
import { FieldGroup } from '../../components/Section'
import { formatUSD } from '../../lib/rating'

// Only the covers ticked on the Supplemental step appear here.
export default function InlandMarine({ form, set, errorFor, bpp, setBpp }) {
  const perSite = Number(form.imPerJobSite) || 0
  const edp = Number(String(form.imEdpLimit ?? '').replace(/\D/g, '')) || 0

  const updateBpp = (i, patch) => setBpp(rs => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const addBpp = () => setBpp(rs => [...rs, { location: '', bldg: '', deductible: '', office: '', shop: '', yard: '' }])

  return (
    <>
      {form.contractorsInstall && (
        <FieldGroup label="Contractors Installation">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Select
              label="Per Job Site" required
              options={PER_JOB_SITE_LIMITS}
              value={form.imPerJobSite} onChange={set('imPerJobSite')}
              placeholder="Select One"
              error={errorFor('imPerJobSite')}
            />
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
                All Job Sites <span className="italic font-normal text-gray-400">(3x of per job site limit)</span>
              </label>
              {/* Always three times the per-site limit, so it is shown rather
                  than asked for. */}
              <div className="w-full rounded-lg px-3.5 py-2.5 text-sm text-gray-500"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                {perSite ? `$${(perSite * 3).toLocaleString()}` : '—'}
              </div>
            </div>
            <Select
              label="Deductible" required
              options={IM_DEDUCTIBLES}
              value={form.imInstallDeductible} onChange={set('imInstallDeductible')}
              placeholder="Select One"
              error={errorFor('imInstallDeductible')}
            />
          </div>

          <div className="mt-5">
            <Textarea
              label="Describe job site security for installation material:"
              rows={4}
              value={form.imJobSiteSecurity} onChange={set('imJobSiteSecurity')}
            />
          </div>

          <div className="flex items-start justify-between gap-6 mt-5">
            <p className="text-[14px] text-navy leading-snug">
              Are any temporary structures (i.e., cribbing, scaffolding, construction forms)
              assembled or built on site?
            </p>
            <div className="shrink-0">
              <YesNo value={form.imTempStructures} onChange={set('imTempStructures')} />
            </div>
          </div>
          {form.imTempStructures === 'yes' && (
            <div className="mt-4">
              <Textarea
                label="If yes, provide details:"
                rows={4}
                value={form.imTempStructuresDetail} onChange={set('imTempStructuresDetail')}
                error={errorFor('imTempStructuresDetail')}
              />
            </div>
          )}
        </FieldGroup>
      )}

      {form.computerEquipment && (
        <FieldGroup label="Computer Equipment">
          <div className="grid grid-cols-[1fr_180px_180px] gap-4 pb-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
            {['Equipement Description', 'Limits', 'Deductible'].map(h => (
              <p key={h} className="text-[13px] font-bold text-navy">{h}</p>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_180px_180px] gap-4 items-center py-4">
            <p className="text-[14px] text-navy">Electronic Data Processing Equipment</p>
            <CurrencyInput value={form.imEdpLimit} onChange={set('imEdpLimit')} />
            <Select
              options={IM_DEDUCTIBLES}
              value={form.imEdpDeductible} onChange={set('imEdpDeductible')}
              placeholder="Select One"
            />
          </div>

          <div className="grid grid-cols-[1fr_180px_180px] gap-4 items-center py-2">
            <p className="text-[14px] text-navy leading-snug">
              Electronic Data Processing Media and Records Included Limit
            </p>
            {/* Fixed at a quarter of the equipment limit. */}
            <div className="w-full rounded-lg px-3.5 py-2.5 text-sm text-gray-500"
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              {edp ? Math.round(edp * 0.25).toLocaleString() : '—'}
            </div>
            <p className="text-[13px] text-gray-500">@25% of EDP</p>
          </div>
        </FieldGroup>
      )}

      {form.businessPersonalProp && (
        <FieldGroup label="Business Personal Property">
          <div className="grid grid-cols-[110px_110px_150px_1fr_1fr_1fr_auto] gap-3 pb-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
            {['Location', 'Bldg', 'Deductible', 'Office Contents', 'Shop Contents', 'Yard Contents', ''].map((h, i) => (
              <p key={i} className="text-[13px] font-bold text-navy leading-snug">{h}</p>
            ))}
          </div>

          {bpp.map((row, i) => (
            <div key={i} className="grid grid-cols-[110px_110px_150px_1fr_1fr_1fr_auto] gap-3 items-start py-4">
              <Select options={LOCATION_OPTIONS} value={row.location} onChange={(v) => updateBpp(i, { location: v })} placeholder="Select" />
              <Select options={LOCATION_OPTIONS} value={row.bldg} onChange={(v) => updateBpp(i, { bldg: v })} placeholder="Select" />
              <Select options={IM_DEDUCTIBLES} value={row.deductible} onChange={(v) => updateBpp(i, { deductible: v })} placeholder="Select" />
              <CurrencyInput value={row.office} onChange={(v) => updateBpp(i, { office: v })} />
              <CurrencyInput value={row.shop} onChange={(v) => updateBpp(i, { shop: v })} />
              <CurrencyInput value={row.yard} onChange={(v) => updateBpp(i, { yard: v })} />
              <button
                type="button"
                onClick={addBpp}
                className="h-[42px] px-5 rounded-lg text-[13px] font-bold text-white transition hover:opacity-90"
                style={{ background: BRAND_GRADIENT }}
              >
                add
              </button>
            </div>
          ))}
        </FieldGroup>
      )}

      {!form.contractorsInstall && !form.computerEquipment && !form.businessPersonalProp && (
        <p className="text-[13px] text-gray-500 py-8 text-center">
          Pick the inland marine covers you want on the Supplemental step and they'll appear here.
        </p>
      )}
    </>
  )
}
