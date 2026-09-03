import { Input, PhoneInput, Select, Checkbox } from '../../components/FormField'
import { AVAILABLE_STATES } from '../../data/applicantOptions'

export default function ContactInfo({ form, set, errorFor }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
          Applicant Name
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
          <Input value={form.firstName} onChange={set('firstName')} placeholder="First name" error={errorFor('firstName')} />
          <Input value={form.middleName} onChange={set('middleName')} placeholder="Middle Name" />
          <Input value={form.lastName} onChange={set('lastName')} placeholder="Last name" error={errorFor('lastName')} />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
          Business Address
        </label>
        <div className="space-y-5">
          <Input value={form.street} onChange={set('street')} error={errorFor('street')} />
          <Input value={form.suite} onChange={set('suite')} placeholder="Apt, Suite, Building (optional)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Input value={form.city} onChange={set('city')} placeholder="City" error={errorFor('city')} />
            <Select options={AVAILABLE_STATES} value={form.state} onChange={set('state')} placeholder="State" error={errorFor('state')} />
            <Input maxLength={5} value={form.postalCode} onChange={(v) => set('postalCode')(v.replace(/\D/g, ''))} placeholder="Zip" error={errorFor('postalCode')} />
          </div>
        </div>
      </div>

      <Checkbox
        label="Mailing address is same as Business address"
        checked={!!form.mailingSame}
        onChange={set('mailingSame')}
      />

      {!form.mailingSame && (
        <div>
          <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
            Mailing Address
          </label>
          <div className="space-y-5">
            <Input value={form.mailStreet} onChange={set('mailStreet')} error={errorFor('mailStreet')} />
            <Input value={form.mailSuite} onChange={set('mailSuite')} placeholder="Apt, Suite, Building (optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <Input value={form.mailCity} onChange={set('mailCity')} placeholder="City" error={errorFor('mailCity')} />
              <Select options={AVAILABLE_STATES} value={form.mailState} onChange={set('mailState')} placeholder="State" error={errorFor('mailState')} />
              <Input maxLength={5} value={form.mailPostalCode} onChange={(v) => set('mailPostalCode')(v.replace(/\D/g, ''))} placeholder="Zip" error={errorFor('mailPostalCode')} />
            </div>
          </div>
        </div>
      )}

      <Input label="Email Address" required type="email" value={form.email} onChange={set('email')} error={errorFor('email')} />
      <PhoneInput label="Phone Number" required value={form.phone} onChange={set('phone')} error={errorFor('phone')} />
      <PhoneInput label="Cell Number" value={form.mobile} onChange={set('mobile')} placeholder="Applicant's Cell Phone Number (optional)" />
    </div>
  )
}
