import { forwardRef } from 'react'
import {
  CurrencyInput, Input, Select, DateInput, TreeSelect, PercentInput,
  ToggleQuestion, InfoTip,
} from '../components/FormField'
import Section, { FieldGroup, QuestionCard } from '../components/Section'
import { FIELD_HELP } from '../data/fieldHelp'
import { ENTITY_TYPES } from '../data/applicantOptions'
import { YEARS_OF_EXPERIENCE, YEARS_IN_BUSINESS, PRIOR_INSURANCE_TREE, PRIOR_INSURANCE_LEAVES } from '../data/intakeOptions'

// Business Operations, following the legacy step: the business itself, then
// its experience, then the exposure figures and the three branching questions.
//
// The questions a class code pulls in are not here: this screen is part of
// shopping the market, and those belong to whichever carrier is chosen.
const BusinessOperations = forwardRef(function BusinessOperations(
  { form, set, errorFor, splitTotal, footer }, ref
) {

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

      {/* Every question card is a direct child of the section, so they keep the
          same rhythm as the field groups above, and the ones a class code adds
          join that rhythm instead of starting a second stack. */}
      <>
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
      </>

      {/* The step's own action, inside the section — where Commercial Auto and
          GL-BOP keep theirs, rather than floating below every section. */}
      {footer}
    </Section>
  )
})

export default BusinessOperations
