import { Textarea, YesNo, ToggleQuestion } from '../../components/FormField'
import { FieldGroup, QuestionCard } from '../../components/Section'
import { rulesForCodes, subKey, needsUnderwriterReview } from '../../data/conditionalQuestions'
import { CLASS_CODES } from '../../data/classCodes'
import {
  POLICY_ELIGIBILITY, TERMS_AND_CONDITIONS, AGREE_QUESTION, OPERATIONS_NOTE,
} from '../../data/coverageOptions'

const codeLabel = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? code
// The classifications step prints the code beside the trade, so this page
// names them the same way — it is the same choice being read back.
const codeTag = (code) => `${codeLabel(code)} [${code}]`

// The order the meeting settled on: what the chosen classes cover, then the
// eligibility statements in general, then the questions those classes pull in
// — and only after all three, the terms and whether the applicant agrees.
// Small uppercase label, no rule — the section title already has one.
function Heading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
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
  // The trade-specific questions belong to the carrier, so they are asked
  // here rather than while the market is still being shopped.
  const rules = rulesForCodes(codes)
  const underwriterReview = needsUnderwriterReview(rules, form)
  // Which of the chosen classes asked for a question. Mostly one, but the
  // high value homes question hangs off eighteen class codes, so a mix of
  // trades can pull the same question in twice over — it is named once, with
  // every class that wanted it, rather than repeated under each.
  const askedBy = (rule) => [...new Set(codes)].filter(c => rule.classCodes.includes(c))

  return (
    <div className="space-y-6">
      <div>
        <Heading>Classification Statements</Heading>
        {codes.length === 0 ? (
          <p className="text-[12.5px] text-gray-400">Pick a classification to see its statements.</p>
        ) : (
          <div className="space-y-5">
            {codes.map(code => (
              <div key={code}>
                <p className="text-[13px] font-bold mb-3" style={{ color: 'var(--ink)' }}>{codeTag(code)}</p>
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

      {rules.length > 0 && (
        <div>
          <Heading>Class-Specific Questions</Heading>
          <div className="space-y-2">
            {rules.map(rule => (
              <QuestionCard key={rule.id}>
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  {askedBy(rule).map(c => (
                    <span key={c} className="class-pill text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {codeTag(c)}
                    </span>
                  ))}
                </div>
                <ToggleQuestion
                  label={rule.question}
                  value={form[rule.id]}
                  onChange={set(rule.id)}
                >
                  {rule.sub.type === 'yesno' ? (
                    <ToggleQuestion
                      label={rule.sub.question}
                      value={form[subKey(rule)]}
                      onChange={set(subKey(rule))}
                    />
                  ) : (
                    <Textarea
                      label={rule.sub.question} required
                      rows={2}
                      value={form[subKey(rule)]} onChange={set(subKey(rule))}
                      placeholder="Add the details here."
                      error={errorFor(subKey(rule))}
                    />
                  )}
                </ToggleQuestion>
              </QuestionCard>
            ))}

            {underwriterReview && (
              <div className="notice-brand rounded-xl p-4 flex items-start gap-3">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="uwNoteG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
                      <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="9" stroke="url(#uwNoteG)" />
                  <path d="M12 8v5" stroke="url(#uwNoteG)" strokeLinecap="round" />
                  <circle cx="12" cy="16.5" r="0.6" fill="url(#uwNoteG)" />
                </svg>
                <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                  <span className="font-bold" style={{ color: 'var(--ink)' }}>This submission needs underwriter review.</span>{' '}
                  High value home work above the 15% threshold can&rsquo;t be bound automatically — an
                  underwriter will pick it up after you submit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
          <p className="text-[12px] font-semibold mt-2 text-accent">
            {OPERATIONS_NOTE}
          </p>
        </div>
      </FieldGroup>
    </div>
  )
}
