import { forwardRef } from 'react'
import { Input, Select, PhoneInput, Checkbox } from '../components/FormField'
import Section, { FieldGroup } from '../components/Section'
import { FIELD_HELP } from '../data/fieldHelp'
import { AVAILABLE_STATES } from '../data/applicantOptions'

// Applicant Information, in the legacy order: who they are, where they are,
// how to reach them, then the licence and the two extras at the foot.
const ApplicantContact = forwardRef(function ApplicantContact({ form, set, errorFor }, ref) {
  const same = !!form.mailingSame

  return (
    <Section ref={ref} id="applicant" title="Applicant Information">
      <FieldGroup label="Applicant Name">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
          <Input
            label="First Name"
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
      </FieldGroup>

      <FieldGroup label="Business Address">
        <div className="space-y-5">
          <Input
            label="Business Address" required
            value={form.street} onChange={set('street')}
            error={errorFor('street')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Input
              label="City" required
              value={form.city} onChange={set('city')}
              error={errorFor('city')}
            />
            <Select
              label="State/Province" required
              hint={FIELD_HELP.state}
              options={AVAILABLE_STATES}
              value={form.state} onChange={set('state')}
              placeholder="Select"
              error={errorFor('state')}
            />
            <Input
              label="Postal Code" required
              maxLength={5}
              value={form.postalCode}
              onChange={(v) => set('postalCode')(v.replace(/\D/g, ''))}
              error={errorFor('postalCode')}
            />
          </div>

          <Checkbox
            label="Mailing address is the same as the Business address."
            checked={same}
            onChange={set('mailingSame')}
          />

          {/* The legacy screen keeps the mailing block on show and fills it from
              the business address while the box is ticked. */}
          <Input
            label="Mailing Address" required={!same}
            value={same ? form.street : form.mailStreet}
            onChange={set('mailStreet')}
            disabled={same}
            error={errorFor('mailStreet')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Input
              label="City" required={!same}
              value={same ? form.city : form.mailCity}
              onChange={set('mailCity')}
              disabled={same}
              error={errorFor('mailCity')}
            />
            {same ? (
              <Input label="State/Province" value={form.state} disabled />
            ) : (
              <Select
                label="State/Province" required
                options={AVAILABLE_STATES}
                value={form.mailState} onChange={set('mailState')}
                placeholder="Select"
                error={errorFor('mailState')}
              />
            )}
            <Input
              label="Postal Code" required={!same}
              maxLength={5}
              value={same ? form.postalCode : form.mailPostalCode}
              onChange={(v) => set('mailPostalCode')(v.replace(/\D/g, ''))}
              disabled={same}
              error={errorFor('mailPostalCode')}
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Contact Details">
        <div className="space-y-5">
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
            label="Email Address" required
            type="email"
            value={form.email} onChange={set('email')}
            placeholder="name@company.com"
            error={errorFor('email')}
          />

          <div>
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
              Contractors license or Application fee number
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.licenseNumber || ''}
                onChange={(e) => set('licenseNumber')(e.target.value)}
                placeholder="License or app. fee number"
                className="w-full border border-gray-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 hover:border-gray-300 transition-all"
              />
              <button
                type="button"
                aria-label="Look up license"
                onClick={() => window.alert('License lookup is not wired up yet.')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md transition hover:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <Input
              label="Website address"
              value={form.website} onChange={set('website')}
              placeholder="https://example.com"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">https://example.com</p>
          </div>

          <Checkbox
            label="Click here if Spanish speaking inspection is required"
            checked={!!form.spanishInspection}
            onChange={set('spanishInspection')}
          />
        </div>
      </FieldGroup>
    </Section>
  )
})

export default ApplicantContact
