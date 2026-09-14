import { Textarea, YesNo } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import { CLASS_CODES } from '../../data/classCodes'
import {
  POLICY_ELIGIBILITY, TERMS_AND_CONDITIONS, AGREE_QUESTION, OPERATIONS_NOTE,
} from '../../data/coverageOptions'

const codeLabel = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? code

// The legacy step reads the eligibility statements, then the operations
// included in each chosen class, then the terms — and only then asks whether
// the applicant agrees.
function Heading({ children }) {
  return (
    <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase mb-3 pb-2" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--line-strong)' }}>
      {children}
    </h3>
  )
}

function PlaceholderLines({ widths }) {
  return (
    <div className="space-y-1.5 pl-3">
      {widths.map((w, i) => (
        <div key={i} className="h-2.5 rounded-full" style={{ width: w, background: 'var(--fill-subtle)' }} />
      ))}
    </div>
  )
}

export default function EligibilityStatements({ form, set, errorFor, rows = [] }) {
  const codes = rows.map(r => r.code).filter(Boolean)
  const declined = form.agreeTerms === 'no'

  return (
    <div className="space-y-6">
      <div>
        <Heading>Policy Eligibility Statement</Heading>
        <ul className="space-y-2.5 pl-1">
          {POLICY_ELIGIBILITY.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              <span className="shrink-0 mt-[7px] w-1 h-1 rounded-full" style={{ background: '#9CA3AF' }} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Heading>Classification Statements</Heading>
        {codes.length === 0 ? (
          <p className="text-[12.5px] text-gray-400">Pick a classification to see its statements.</p>
        ) : (
          <div className="space-y-5">
            {codes.map(code => (
              <div key={code}>
                <p className="text-[13px] font-bold mb-3" style={{ color: 'var(--ink)' }}>{codeLabel(code)}</p>
                <div className="space-y-3 pl-1">
                  <div>
                    <p className="text-[12.5px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                      The following operations are included in this classification:
                    </p>
                    <PlaceholderLines widths={['84%', '66%']} />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                      The following operations are not included in this classification:
                    </p>
                    <PlaceholderLines widths={['72%', '88%', '58%']} />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-gray-400">
              Placeholder — the class guide copy is not wired up yet.
            </p>
          </div>
        )}
      </div>

      <div>
        <Heading>Terms &amp; Conditions</Heading>
        <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          {TERMS_AND_CONDITIONS}
        </p>
      </div>

      <FieldGroup label="Agreement">
        <p className="text-[13px] font-bold leading-relaxed mb-3" style={{ color: 'var(--ink)' }}>
          {AGREE_QUESTION}
        </p>
        <YesNo value={form.agreeTerms} onChange={set('agreeTerms')} />
        {errorFor('agreeTerms') && (
          <p className="text-[11px] text-red-500 mt-2">Answer this to continue.</p>
        )}

        {declined && (
          <div className="mt-5">
            <Textarea
              label="Please explain" required
              rows={4}
              value={form.agreeExplanation} onChange={set('agreeExplanation')}
              placeholder="(10 words or more)"
              error={errorFor('agreeExplanation')}
            />
          </div>
        )}

        <div className="mt-5">
          <Textarea
            label="Description of Operations (must be at least 10 words)" required
            rows={4}
            value={form.operationsDescription} onChange={set('operationsDescription')}
            error={errorFor('operationsDescription')}
          />
          <p className="text-[12px] font-semibold mt-2" style={{ color: '#5C2ED4' }}>
            {OPERATIONS_NOTE}
          </p>
        </div>
      </FieldGroup>
    </div>
  )
}
