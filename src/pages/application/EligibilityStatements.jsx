import { useState } from 'react'
import { Textarea, YesNo, ToggleQuestion } from '../../components/FormField'
import { FieldGroup, QuestionCard } from '../../components/Section'
import { rulesForCodes, subKey } from '../../data/conditionalQuestions'
import { CLASS_CODES } from '../../data/classCodes'
import ClassificationRows from '../../components/ClassificationRows'
import {
  POLICY_ELIGIBILITY, TERMS_AND_CONDITIONS, AGREE_QUESTION, OPERATIONS_NOTE,
} from '../../data/coverageOptions'

const codeLabel = (code) => CLASS_CODES.find(c => c.code === code)?.label ?? code
// The classifications step prints the code beside the trade, so this page
// names them the same way — it is the same choice being read back.
const codeTag = (code) => `${codeLabel(code)} [${code}]`

// The classes first — what they cover, then the questions they pull in, so
// everything that hangs off the chosen classifications reads as one block.
// The general eligibility statements follow, and only then the terms and
// whether the applicant agrees.
// Small uppercase label, no rule — the section title already has one. An
// `action` sits at the right of the label.
function Heading({ children, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-2.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 pl-0.5">
        {children}
      </h3>
      {action}
    </div>
  )
}

// Stand-in copy for the class guide, the same for every class because none
// of it is RLI's — it is here so the block reads as prose rather than as
// grey bars. Lighter than the statements below it, and the note under the
// list says what it is. Replace wholesale when the real guide arrives.
const SAMPLE_INCLUDED = [
  'Preparation, installation and finishing work performed at the job site.',
  'Incidental repair, adjustment and clean-up arising from those operations.',
]
const SAMPLE_EXCLUDED = [
  'Any operation that carries a classification code of its own.',
  'Work at heights, or in conditions, the class guide places outside this class.',
  'Materials or installations supplied but not installed by the applicant.',
]

function PlaceholderLines({ lines }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed" style={{ color: '#9CA3AF' }}>
          <span className="shrink-0 mt-[7px] w-1 h-1 rounded-full" style={{ background: 'var(--line-strong)' }} />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

export default function EligibilityStatements({ form, set, errorFor, rows = [], setClassifications }) {
  const codes = rows.map(r => r.code).filter(Boolean)
  const declined = form.agreeTerms === 'no'
  // The trade-specific questions belong to the carrier, so they are asked
  // here rather than while the market is still being shopped.
  const rules = rulesForCodes(codes)

  // The rows are a read-back until someone needs them otherwise, so the
  // editor is folded away. It opens on its own when the split will not do —
  // a class with no code, or percentages that miss 100 — because then there
  // is nothing to read and something to fix.
  const [editing, setEditing] = useState(false)
  const rowsValid =
    rows.length > 0 &&
    rows.every(r => r.code) &&
    rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0) === 100
  const canEdit = typeof setClassifications === 'function'
  const showEditor = canEdit && (editing || !rowsValid)

  return (
    <div className="space-y-6">
      <div>
        {/* Reading the statements is exactly when someone works out they
            picked the wrong class, so the rows are editable right here rather
            than three screens back. Same list, same component as the
            classifications step — the statements below redraw as it changes. */}
        <Heading
          action={canEdit && rowsValid && (
            <button
              type="button"
              onClick={() => setEditing(e => !e)}
              className="shrink-0 text-[11px] font-semibold transition hover:opacity-70 text-accent"
            >
              {editing ? 'Done' : 'Change or remove \u2192'}
            </button>
          )}
        >
          Classification Statements
        </Heading>
        {/* Boxed, so an open editor reads as a panel over the statements
            rather than as the top of them. */}
        {showEditor && (
          <QuestionCard className="mb-5">
            <ClassificationRows
              classifications={rows}
              setClassifications={setClassifications}
            />
          </QuestionCard>
        )}
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
                    <PlaceholderLines lines={SAMPLE_INCLUDED} />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                      The following operations are not included in this classification:
                    </p>
                    <PlaceholderLines lines={SAMPLE_EXCLUDED} />
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

      {rules.length > 0 && (
        <div>
          <Heading>Class-Specific Questions</Heading>
          <div className="space-y-2">
            {rules.map(rule => (
              <QuestionCard key={rule.id}>
                <ToggleQuestion
                  label={rule.question}
                  value={form[rule.id]}
                  onChange={set(rule.id)}
                >
                  {rule.sub.type === 'yesno' ? (
                    <>
                      <ToggleQuestion
                        label={rule.sub.question}
                        value={form[subKey(rule)]}
                        onChange={set(subKey(rule))}
                      />
                      {/* The notice is what this answer did, so it sits with
                          the answer. Outside the card it took the same eight
                          pixels that separate one question from the next, and
                          read as a third question. It is padded and spaced
                          like the Yes pill above it — px-3, a 3.5 mark, gap-2
                          — so its icon lands on the radio's column and its
                          text on the label's. */}
                      {rule.sub.underwriterReviewOnYes && form[subKey(rule)] === 'yes' && (
                        <div className="notice-brand rounded-xl px-3 py-3.5 flex items-start gap-2 mt-4">
                          <svg className="w-3.5 h-3.5 shrink-0 mt-px" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                            <defs>
                              {/* userSpaceOnUse, or the stroke on the "!" vanishes: a
                                  vertical line has a zero-width bounding box, and an
                                  objectBoundingBox gradient over one paints nothing. */}
                              <linearGradient id="uwNoteG" gradientUnits="userSpaceOnUse" x1="3" y1="12" x2="21" y2="12">
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
                    </>
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

          </div>
        </div>
      )}

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
