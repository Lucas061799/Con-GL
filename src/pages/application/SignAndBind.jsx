import { useState } from 'react'
import { Input, Checkbox, BRAND_GRADIENT } from '../../components/FormField'
import { SIGN_OPTIONS } from '../../data/coverageOptions'

function Heading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
      {children}
    </h3>
  )
}

// Inland Marine's bind card: pick one of two, and the one you pick opens what
// it needs inside the same card, under a thin rule.
function ChoiceCard({ selected, label, detail, onSelect, children }) {
  return (
    <div
      className={`rounded-xl transition-all ${selected ? 'cb-choice-on' : ''}`}
      // Inland Marine's chosen card carries the stroke alone, no glow.
      style={selected
        ? undefined
        : { background: 'var(--surface-card)', border: '1.5px solid var(--line)' }}
    >
      <button type="button" onClick={onSelect} className="w-full text-left px-4 py-3.5 flex items-start gap-3">
        <span
          className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
          style={{
            border: selected ? 'none' : '2px solid var(--line-strong)',
            background: selected ? BRAND_GRADIENT : 'transparent',
          }}
        >
          {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-bold" style={{ color: 'var(--ink)' }}>{label}</span>
          <span className="block text-[12px] text-gray-500 leading-relaxed mt-0.5">{detail}</span>
        </span>
      </button>
      {/* The revealed field lines up with the label, not the card edge. */}
      {selected && children && (
        <div className="pl-11 pr-4 pb-4">
          <div className="pt-4 cb-rule-brand">{children}</div>
        </div>
      )}
    </div>
  )
}

// A numbered step that ticks once it is done.
function StepMark({ n, done, title, detail, className = 'mb-3' }) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      {done ? (
        <span
          className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
          style={{ background: 'linear-gradient(88.09deg, rgba(92,46,212,0.15) 0%, rgba(166,20,195,0.15) 100%)' }}
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`signStep${n}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
                <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
              </linearGradient>
            </defs>
            <path d={`M5 13l4 4L19 7`} stroke={`url(#signStep${n})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : (
        <span
          className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold"
          style={{ border: '1.5px solid var(--line-strong)', color: '#9CA3AF' }}
        >
          {n}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>{title}</span>
        <span className="block text-[11.5px] text-gray-500 leading-relaxed">{detail}</span>
      </span>
    </div>
  )
}

const formatBytes = (n) =>
  (!n ? '' : n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

export default function SignAndBind({ form, set, errorFor, files = [], setFiles, onDownload }) {
  const [dragging, setDragging] = useState(false)
  const uploaded = files.length > 0
  const isUpload = form.signMethod === 'upload'

  // PDFs only, 10 MB each, 10 at most — the same rule Inland Marine holds to.
  const addFiles = (list) => {
    const incoming = [...(list || [])]
      .filter(f => (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) && f.size <= 10 * 1024 * 1024)
      .map(f => ({ name: f.name, size: f.size }))
      .filter(f => !files.some(e => e.name === f.name))
    setFiles([...files, ...incoming].slice(0, 10))
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading>Signature</Heading>
        <p className="text-[12px] text-gray-400 mb-3">
          The application has to be signed by the insured before it binds.
        </p>

        <div className="space-y-2.5">
          {SIGN_OPTIONS.map(o => (
            <ChoiceCard
              key={o.key}
              selected={form.signMethod === o.key}
              label={o.label}
              detail={o.note}
              onSelect={() => set('signMethod')(o.key)}
            >
              {o.key === 'esign' && (
                <div className="sm:max-w-sm">
                  <Input
                    label="Insured's email" required
                    value={form.insuredEmail} onChange={set('insuredEmail')}
                    placeholder={form.email || 'name@company.com'}
                    error={errorFor('insuredEmail')}
                  />
                </div>
              )}

              {o.key === 'upload' && (
                <div>
                  <StepMark
                    n={1}
                    done={!!form.downloaded || uploaded}
                    title="Download the binding application"
                    detail="The application with the terms above filled in."
                  />
                  <button
                    type="button"
                    onClick={() => { set('downloaded')(true); onDownload && onDownload() }}
                    className="ml-[26px] inline-flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white transition hover:opacity-90"
                    style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.25)' }}
                  >
                    Download binding application
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12m0 0l-4-4m4 4 4-4M5 21h14" />
                    </svg>
                  </button>

                  <div className="pt-4 mt-4 cb-rule-brand">
                    <StepMark
                      n={2}
                      done={uploaded}
                      title="Get it signed"
                      detail="Both the applicant and the agent sign it. Backdating is not permitted."
                      className=""
                    />
                  </div>

                  <div className="pt-4 mt-4 cb-rule-brand">
                    <StepMark
                      n={3}
                      done={uploaded}
                      title="Upload the signed copy"
                      detail="PDF only, up to 10 MB each, 10 files at most."
                    />

                    <label
                      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                      className={`cb-drop ${dragging ? 'cb-drop-on' : ''} cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all ${uploaded ? 'py-3.5' : 'py-7'}`}
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
                      />
                      <span className="cb-icon-tile w-11 h-11 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <defs>
                            <linearGradient id="signClipG" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
                              <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
                            </linearGradient>
                          </defs>
                          <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" stroke="url(#signClipG)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {uploaded ? (
                        <span className="text-xs text-gray-400">or <span className="text-gradient font-semibold">add more files</span></span>
                      ) : (
                        <>
                          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Drop the signed application here</span>
                          <span className="text-xs text-gray-400">or <span className="text-gradient font-semibold">click to browse</span></span>
                        </>
                      )}
                    </label>

                    {uploaded && (
                      <div className="space-y-2 mt-2.5">
                        {files.map(f => (
                          <div
                            key={f.name}
                            className="cb-file-row flex items-center gap-3 px-3 py-2.5 rounded-xl"
                          >
                            <span className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold truncate" style={{ color: 'var(--ink)' }}>{f.name}</span>
                              {f.size > 0 && <span className="block text-[10px] text-gray-400">{formatBytes(f.size)}</span>}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter(x => x.name !== f.name))}
                              aria-label={`Remove ${f.name}`}
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition hover:bg-gray-100"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errorFor('signedFiles') && (
                      <p className="text-[11px] text-red-500 mt-2">Add the signed application to continue.</p>
                    )}
                  </div>
                </div>
              )}
            </ChoiceCard>
          ))}
        </div>
        {errorFor('signMethod') && (
          <p className="text-[11px] text-red-500 mt-2">Choose how the application gets signed.</p>
        )}
      </div>

      <div>
        <Checkbox
          label="As an agent, I agree that information entered in this application is correct to my knowledge."
          checked={!!form.attested}
          onChange={set('attested')}
        />
        {errorFor('attested') && (
          <p className="text-[11px] text-red-500 mt-2">Tick this to submit the application.</p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          {isUpload
            ? 'Nothing binds until the signed application is checked.'
            : 'Nothing binds until the insured signs.'}
        </p>
      </div>
    </div>
  )
}
