import { Textarea, ToggleQuestion } from '../../components/FormField'
import { QuestionCard } from '../../components/Section'
import { rulesForCodes, subKey, needsUnderwriterReview } from '../../data/conditionalQuestions'

// The questions a trade drags in. Same rule set the indication used, asked
// again here because the classifications can change on the way through.
export default function ClassCodeQuestions({ form, set, errorFor, classCodes = [] }) {
  const rules = rulesForCodes(classCodes)
  const underwriterReview = needsUnderwriterReview(rules, form)

  if (rules.length === 0) {
    return (
      <p className="text-[13px] text-gray-500 py-8 text-center">
        None of the selected trades carry extra questions.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {rules.map(rule => (
        <QuestionCard key={rule.id}>
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
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(92,46,212,0.05)', border: '1px solid rgba(92,46,212,0.18)' }}
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="#5C2ED4" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5" strokeLinecap="round" /><circle cx="12" cy="16.5" r="0.6" fill="#5C2ED4" />
          </svg>
          <p className="text-[12.5px] text-gray-600 leading-relaxed">
            <span className="font-bold text-navy">This submission needs underwriter review.</span>{' '}
            High value home work above the 15% threshold can't be bound automatically — an
            underwriter will pick it up after you submit.
          </p>
        </div>
      )}
    </div>
  )
}
