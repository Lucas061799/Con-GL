import { forwardRef } from 'react'
import { CurrencyInput, Input, Textarea, PercentInput, ToggleQuestion } from '../components/FormField'
import Section, { FieldGroup, QuestionCard } from '../components/Section'
import { FIELD_HELP } from '../data/fieldHelp'
import { rulesForCodes, subKey, needsUnderwriterReview } from '../data/conditionalQuestions'

// Section 3 — exposure figures plus the two branching questions.
// Sub-contracting costs only exist when the applicant hires subs, and the
// new/remodel split only appears for pre-C-of-O residential work.
const BusinessOperations = forwardRef(function BusinessOperations(
  { form, set, errorFor, splitTotal, classCodes = [] }, ref
) {
  // Trades on the submission decide which underwriting questions apply.
  const rules = rulesForCodes(classCodes)
  const underwriterReview = needsUnderwriterReview(rules, form)

  return (
    <Section
      ref={ref}
      id="operations"
      title="Business Operations"
      subtitle="Please answer all questions accurately. Your responses help determine coverage eligibility."
    >
      <FieldGroup label="Financials & Employees">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <CurrencyInput
            label="Annual Gross Receipts" required
            hint={FIELD_HELP.grossReceipts}
            value={form.grossReceipts} onChange={set('grossReceipts')}
            error={errorFor('grossReceipts')}
          />
          <CurrencyInput
            label="Annual Employee Payroll" required
            hint={FIELD_HELP.employeePayroll}
            value={form.employeePayroll} onChange={set('employeePayroll')}
            error={errorFor('employeePayroll')}
          />
          <Input
            label="# of Employees" required
            value={form.employeeCount}
            onChange={(v) => set('employeeCount')(v.replace(/\D/g, ''))}
            placeholder="0"
            error={errorFor('employeeCount')}
          />
          <Input
            label="# of Active Owners" required
            hint={FIELD_HELP.activeOwners}
            value={form.activeOwners}
            onChange={(v) => set('activeOwners')(v.replace(/\D/g, ''))}
            placeholder="0"
            error={errorFor('activeOwners')}
          />
        </div>
      </FieldGroup>

      <FieldGroup label="Operations">
        <Textarea
          label="Description of Operations" required
          rows={3}
          value={form.operationsDescription} onChange={set('operationsDescription')}
          placeholder="Describe the work the business performs."
          error={errorFor('operationsDescription')}
        />
      </FieldGroup>

      <div className="space-y-2">
        <QuestionCard>
          <ToggleQuestion
            label="Does the applicant hire subcontractors?"
            value={form.hiresSubs} onChange={set('hiresSubs')}
          >
            <CurrencyInput
              label="Sub-Contracting Costs" required
              hint={FIELD_HELP.subContractingCosts}
              value={form.subContractingCosts} onChange={set('subContractingCosts')}
              className="max-w-[280px]"
              error={errorFor('subContractingCosts')}
            />
            <p className="text-[13px] text-gray-600 mt-5 mb-3">
              What % of sub-contracted work is done on single family or duplex dwellings?
            </p>
            <PercentInput
              label="Percentage" required
              value={form.subDwellingPct} onChange={set('subDwellingPct')}
              className="max-w-[170px]"
              error={errorFor('subDwellingPct')}
            />
          </ToggleQuestion>
        </QuestionCard>

        <QuestionCard>
          <ToggleQuestion
            label="Does the applicant perform new residential work prior to Certificate of Occupancy?"
            hint={FIELD_HELP.newResidential}
            value={form.newResidential} onChange={set('newResidential')}
          >
            <p className="text-[13px] text-gray-600 mb-3">
              Specify the percentage of each type of work the applicant performs.
            </p>
            <div className="flex gap-4">
              <PercentInput
                label="New" required
                value={form.newWorkPct} onChange={set('newWorkPct')}
                className="w-[170px]"
              />
              <PercentInput
                label="Remodeling" required
                value={form.remodelPct} onChange={set('remodelPct')}
                className="w-[170px]"
              />
            </div>
            <p className="text-[13px] font-bold text-navy mt-5">
              TOTAL: <span className="font-extrabold">{splitTotal}</span> %
            </p>
            {splitTotal !== 100 && (
              <p className="text-[12px] text-red-500 mt-1.5">Must add to 100</p>
            )}
          </ToggleQuestion>
        </QuestionCard>
      </div>

      {rules.length > 0 && (
        <div className="space-y-2">
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
      )}
    </Section>
  )
})

export default BusinessOperations
