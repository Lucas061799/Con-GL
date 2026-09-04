import { Input, CurrencyInput, Select, Textarea, PercentInput, ToggleQuestion } from '../../components/FormField'
import { FIELD_HELP } from '../../data/fieldHelp'
import { FieldGroup, QuestionCard } from '../../components/Section'
import { STRUCTURE_OF_BUSINESS } from '../../data/applicationOptions'

export default function BusinessInfo({ form, set, errorFor }) {
  const occupancyTotal = (Number(form.newWorkPct) || 0) + (Number(form.remodelPct) || 0)

  return (
    <>
      <FieldGroup label="Legal Identity">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Input
          label="Legal business name" required
          value={form.legalName} onChange={set('legalName')}
          error={errorFor('legalName')}
        />
        <Input
          label="Contractor license number"
          value={form.licenseNumber} onChange={set('licenseNumber')}
          placeholder="Enter the contractor license number."
        />
        <Select
          label="Structure of business" required
          hint={FIELD_HELP.entityType}
          options={STRUCTURE_OF_BUSINESS}
          value={form.entityType} onChange={set('entityType')}
          placeholder="Select…"
          error={errorFor('entityType')}
        />
        <Input
          label="Number of owners active in the field" required
          hint={FIELD_HELP.activeOwners}
          value={form.activeOwners}
          onChange={(v) => set('activeOwners')(v.replace(/\D/g, ''))}
          error={errorFor('activeOwners')}
        />
        <CurrencyInput
          label="Annual gross receipts" required
          hint={FIELD_HELP.grossReceipts}
          value={form.grossReceipts} onChange={set('grossReceipts')}
          error={errorFor('grossReceipts')}
        />
      </div>
      </FieldGroup>

      <div className="space-y-2">
      <QuestionCard>
      <ToggleQuestion
        label="Does the applicant have employees?"
        value={form.hasEmployees} onChange={set('hasEmployees')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <Input
            label="Number of employees" required
            hint={FIELD_HELP.employeeCount}
            value={form.employeeCount}
            onChange={(v) => set('employeeCount')(v.replace(/\D/g, ''))}
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
        label="Does the applicant hire subcontractors?"
        value={form.hiresSubs} onChange={set('hiresSubs')}
      >
        <div className="space-y-5">
          <CurrencyInput
            label="Annual subcontracting costs" required
            hint={FIELD_HELP.subContractingCosts}
            value={form.subContractingCosts} onChange={set('subContractingCosts')}
            className="max-w-[320px]"
            error={errorFor('subContractingCosts')}
          />
          <div>
            <p className="text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
              What percentage of subcontracted work is done on single family or duplex dwellings?
            </p>
            <PercentInput
              value={form.subDwellingPct} onChange={set('subDwellingPct')}
              className="max-w-[200px]"
              error={errorFor('subDwellingPct')}
            />
          </div>
        </div>
      </ToggleQuestion>
      </QuestionCard>

      <QuestionCard>
      <ToggleQuestion
        label="The applicant performs residential work prior to the structure being approved for occupancy."
        hint={FIELD_HELP.newResidential}
        value={form.newResidential} onChange={set('newResidential')}
      >
        <p className="text-[13px] text-gray-600 mb-3">
          Specify the percentage of each type of work the applicant performs prior to approval of occupancy.
        </p>
        <div className="flex gap-6">
          <PercentInput
            label="New" required
            value={form.newWorkPct} onChange={set('newWorkPct')}
            className="w-[200px]"
            error={errorFor('newWorkPct')}
          />
          <PercentInput
            label="Remodeling" required
            value={form.remodelPct} onChange={set('remodelPct')}
            className="w-[200px]"
            error={errorFor('remodelPct') && 'Remodeling percentage of work is required.'}
          />
        </div>
        <div className="flex items-center justify-between mt-5 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
          <span className="text-[14px] font-bold text-navy">Total</span>
          <span className={`text-[14px] font-bold ${occupancyTotal === 100 ? 'text-navy' : 'text-red-500'}`}>
            {occupancyTotal}
          </span>
        </div>
        {occupancyTotal !== 100 && (
          <p className="text-[12px] text-red-500 mt-1.5">The total percentage must be 100.</p>
        )}
      </ToggleQuestion>
      </QuestionCard>
      </div>

      <FieldGroup label="Operations">
      <div>
        <p className="text-[13px] font-semibold text-gray-600 tracking-wide">
          Describe the operations of the business.
        </p>
        <p className="text-[12px] italic text-gray-400 mb-1.5">
          Example: New ground-up construction or new custom homes.
        </p>
        <Textarea
          rows={4}
          value={form.operationsDescription} onChange={set('operationsDescription')}
          placeholder="(10 words or more - Example: Interior electrical work for office or commercial spaces in Orange County."
          error={errorFor('operationsDescription') && 'Describe the operations in 10 words or more.'}
        />
      </div>
      </FieldGroup>
    </>
  )
}
