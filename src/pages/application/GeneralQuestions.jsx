import { Input, Checkbox, ToggleQuestion } from '../../components/FormField'
import { QuestionCard } from '../../components/Section'
import { GENERAL_DISCLOSURES } from '../../data/applicationOptions'

export default function GeneralQuestions({ form, set, errorFor }) {
  const disclosures = form.disclosures || {}
  const anyDisclosure = GENERAL_DISCLOSURES.some(d => !d.isNone && disclosures[d.key])

  const toggle = (d) => {
    // "None" and the individual disclosures are mutually exclusive.
    const next = d.isNone
      ? { none: !disclosures.none }
      : { ...disclosures, none: false, [d.key]: !disclosures[d.key] }
    set('disclosures')(next)
  }

  return (
    <div className="space-y-4">
      <QuestionCard>
        <ToggleQuestion
          label="Does applicant work out of state?"
          value={form.worksOutOfState} onChange={set('worksOutOfState')}
        >
          <Input
            value={form.outOfStateList} onChange={set('outOfStateList')}
            placeholder="If yes, indicate state(s)"
            error={errorFor('outOfStateList')}
          />
        </ToggleQuestion>
      </QuestionCard>

      <QuestionCard>
        <ToggleQuestion
          label="Does the applicant own or operate any other entity, business or company?"
          value={form.otherEntity} onChange={set('otherEntity')}
        >
          <Input
            value={form.otherEntityDetail} onChange={set('otherEntityDetail')}
            error={errorFor('otherEntityDetail')}
          />
        </ToggleQuestion>
      </QuestionCard>

      <QuestionCard>
        <p className="text-[15px] font-bold text-navy mb-4">Select one or more of the following:</p>
        <div className="space-y-3">
          {GENERAL_DISCLOSURES.map(d => (
            <Checkbox
              key={d.key}
              label={d.isNone ? <span className="font-bold text-navy">{d.label}</span> : d.label}
              checked={!!disclosures[d.key]}
              onChange={() => toggle(d)}
            />
          ))}
        </div>
        {anyDisclosure && (
          <div className="mt-4">
            <Input
              value={form.disclosureExplanation} onChange={set('disclosureExplanation')}
              placeholder="If yes, please explain:"
              error={errorFor('disclosureExplanation')}
            />
          </div>
        )}
      </QuestionCard>
    </div>
  )
}
