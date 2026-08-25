import { forwardRef } from 'react'
import { Select, Input, PhoneInput, Checkbox, TreeSelect } from '../components/FormField'
import Section, { FieldGroup } from '../components/Section'
import { YEARS_OF_EXPERIENCE, YEARS_IN_BUSINESS, PRIOR_INSURANCE_TREE, PRIOR_INSURANCE_LEAVES } from '../data/intakeOptions'

const ApplicantContact = forwardRef(function ApplicantContact({ form, set, errorFor }, ref) {
  return (
    <Section ref={ref} id="applicant" title="Applicant Information">
      <FieldGroup label="Rating Answers">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
        <Select
          label="Years of Experience" required
          options={YEARS_OF_EXPERIENCE}
          value={form.yearsOfExperience} onChange={set('yearsOfExperience')}
          placeholder="Select"
          error={errorFor('yearsOfExperience')}
        />
        <Select
          label="Years in Business" required
          options={YEARS_IN_BUSINESS}
          value={form.yearsInBusiness} onChange={set('yearsInBusiness')}
          placeholder="Select"
          error={errorFor('yearsInBusiness')}
        />
        <TreeSelect
          label="Prior Insurance History" required
          tree={PRIOR_INSURANCE_TREE}
          leafLabels={PRIOR_INSURANCE_LEAVES}
          value={form.priorInsurance} onChange={set('priorInsurance')}
          placeholder="Select"
          error={errorFor('priorInsurance')}
        />
        </div>
      </FieldGroup>

      <FieldGroup label="Contact Details">
        <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
        <Input
          label="Applicant First Name"
          value={form.firstName} onChange={set('firstName')}
          placeholder="First name"
        />
        <Input
          label="Middle Name"
          value={form.middleName} onChange={set('middleName')}
          placeholder="Middle name"
        />
        <Input
          label="Last Name" required
          value={form.lastName} onChange={set('lastName')}
          placeholder="Last name"
          error={errorFor('lastName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <PhoneInput
          label="Phone" required
          value={form.phone} onChange={set('phone')}
          error={errorFor('phone')}
        />
        <PhoneInput
          label="Mobile"
          value={form.mobile} onChange={set('mobile')}
        />
      </div>

      <Input
        label="Email" required
        type="email"
        value={form.email} onChange={set('email')}
        placeholder="name@company.com"
        error={errorFor('email')}
      />

      <div>
        <Input
          label="Website Address"
          value={form.website} onChange={set('website')}
          placeholder="https://example.com"
        />
        <p className="text-[11px] text-gray-400 mt-1.5">Example: https://example.com</p>
      </div>

      <Checkbox
        label="Spanish speaking inspection required"
        checked={!!form.spanishInspection}
        onChange={set('spanishInspection')}
      />
        </div>
      </FieldGroup>
    </Section>
  )
})

export default ApplicantContact
