import { DateInput, Select } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import { YEARS_IN_BUSINESS, YEARS_OF_EXPERIENCE } from '../../data/intakeOptions'

export default function InsuranceHistory({ form, set, errorFor }) {
  return (
    <FieldGroup label="Effective Date & History">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <DateInput
          label="Proposed effective start date." required
          value={form.effectiveDate} onChange={set('effectiveDate')}
          error={errorFor('effectiveDate')}
        />
        <Select
          label="Years in Business" required
          options={YEARS_IN_BUSINESS}
          value={form.yearsInBusiness} onChange={set('yearsInBusiness')}
          placeholder="Select…"
          error={errorFor('yearsInBusiness')}
        />
        <Select
          label="Years of experience" required
          options={YEARS_OF_EXPERIENCE}
          value={form.yearsOfExperience} onChange={set('yearsOfExperience')}
          placeholder="Select…"
          error={errorFor('yearsOfExperience')}
        />
      </div>
    </FieldGroup>
  )
}
