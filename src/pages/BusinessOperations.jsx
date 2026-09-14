import { forwardRef } from 'react'
import {
  CurrencyInput, Input, Select, DateInput, TreeSelect, Textarea, PercentInput,
  ToggleQuestion, InfoTip,
} from '../components/FormField'
import Section, { FieldGroup, QuestionCard } from '../components/Section'
import { FIELD_HELP } from '../data/fieldHelp'
import { ENTITY_TYPES } from '../data/applicantOptions'
import { YEARS_OF_EXPERIENCE, YEARS_IN_BUSINESS, PRIOR_INSURANCE_TREE, PRIOR_INSURANCE_LEAVES } from '../data/intakeOptions'
import { rulesForCodes, subKey, needsUnderwriterReview } from '../data/conditionalQuestions'

// Business Operations, following the legacy step: the business itself, then
// its experience, then the exposure figures and the three branching questions.
const BusinessOperations = forwardRef(function BusinessOperations(
  { form, set, errorFor, splitTotal, classCodes = [] }, ref
) {
  // Trades on the submission decide which underwriting questions apply.
  const rules = rulesForCodes(classCodes)
  const underwriterReview = needsUnderwriterReview(rules, form)

  return (
    <Section ref={ref} id="operations" title="Business Operations">
      <FieldGroup label="The Business">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-x-6 gap-y-5">
            <DateInput
              label="Effective start date" required
              value={form.effectiveDate} onChange={set('effectiveDate')}
              error={errorFor('effectiveDate')}
            />
            <Input
              label="DBA" required
              value={form.dba} onChange={set('dba')}
              error={errorFor('dba')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] gap-x-6 gap-y-5">
            <Input
              label="Legal business name" required
              value={form.legalName} onChange={set('legalName')}
              error={errorFor('legalName')}
            />
            <Select
              label="Structure of the business" required
              hint={FIELD_HELP.entityType}
              options={ENTITY_TYPES}
              value={form.entityType} onChange={set('entityType')}
              placeholder="Select One"
              error={errorFor('entityType')}
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Experience & History">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <Select
              label="Years of experience" required
              options={YEARS_OF_EXPERIENCE}
              value={form.yearsOfExperience} onChange={set('yearsOfExperience')}
              placeholder="Select One"
              error={errorFor('yearsOfExperience')}
            />
            <Select
              label="Years in business" required
              options={YEARS_IN_BUSINESS}
              value={form.yearsInBusiness} onChange={set('yearsInBusiness')}
              placeholder="Select One"
              error={errorFor('yearsInBusiness')}
            />
          </div>
          <TreeSelect
            label="Insurance History" required
            tree={PRIOR_INSURANCE_TREE}
            leafLabels={PRIOR_INSURANCE_LEAVES}
            value={form.priorInsurance} onChange={set('priorInsurance')}
            placeholder="Select One"
            error={errorFor('priorInsurance')}
          />
        </div>
      </FieldGroup>

      <FieldGroup label="Financials">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <CurrencyInput
            label="Annual gross receipts" required
            hint={FIELD_HELP.grossReceipts}
            value={form.grossReceipts} onChange={set('grossReceipts')}
            error={errorFor('grossReceipts')}
          />
          <Input
            label="Number of owners active in the field" required
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
            label="Does the Applicant have any employees?"
            value={form.hasEmployees} onChange={set('hasEmployees')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Input
                label="Number of employees" required
                hint={FIELD_HELP.employeeCount}
                value={form.employeeCount}
                onChange={(v) => set('employeeCount')(v.replace(/\D/g, ''))}
                placeholder="0"
                error={errorFor('employeeCount')}
              />
              <CurrencyInput
                label="Annual employee payroll" required
                hint={FIELD_HELP.employeePayroll}
                value={form.employeePayroll} onChange={set('employeePayroll')}
                error={errorFor('employeePayroll')}
              />
            </div>
          </ToggleQuestion>
        </QuestionCard>

        <QuestionCard>
          <ToggleQuestion
            label="Does the Applicant hire subcontractors?"
            value={form.hiresSubs} onChange={set('hiresSubs')}
          >
            <CurrencyInput
              label="Annual subcontracting costs" required
              hint={FIELD_HELP.subContractingCosts}
              value={form.subContractingCosts} onChange={set('subContractingCosts')}
              className="max-w-[280px]"
              error={errorFor('subContractingCosts')}
            />
            <p className="text-[13px] text-gray-600 mt-5 mb-3">
              What % of sub-contracted work is done on single family or duplex dwellings?
              <span className="inline-flex align-middle ml-1.5 -mt-px">
                <InfoTip title={FIELD_HELP.subDwellingPct.title}>
                  {FIELD_HELP.subDwellingPct.body}
                </InfoTip>
              </span>
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
            label="Does the Applicant perform residential work prior to the certificate of occupancy?"
            hint={FIELD_HELP.newResidential}
            value={form.newResidential} onChange={set('newResidential')}
          >
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
