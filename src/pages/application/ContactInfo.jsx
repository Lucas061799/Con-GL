import { Input, PhoneInput, Select, Checkbox } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import { AVAILABLE_STATES } from '../../data/applicantOptions'

function AddressBlock({ prefix = '', form, set, errorFor }) {
  const k = (name) => (prefix ? prefix + name[0].toUpperCase() + name.slice(1) : name)
  return (
    <div className="space-y-5">
      <Input label="Street Address" required value={form[k('street')]} onChange={set(k('street'))} error={errorFor(k('street'))} />
      <Input value={form[k('suite')]} onChange={set(k('suite'))} placeholder="Apt, Suite, Building (optional)" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
        <Input label="City" required value={form[k('city')]} onChange={set(k('city'))} placeholder="City" error={errorFor(k('city'))} />
        <Select label="State/Province" required options={AVAILABLE_STATES} value={form[k('state')]} onChange={set(k('state'))} placeholder="Select" error={errorFor(k('state'))} />
        <Input
          label="Postal Code" required maxLength={5}
          value={form[k('postalCode')]}
          onChange={(v) => set(k('postalCode'))(v.replace(/\D/g, ''))}
          placeholder="Zip" error={errorFor(k('postalCode'))}
        />
      </div>
    </div>
  )
}

export default function ContactInfo({ form, set, errorFor }) {
  return (
    <>
      <FieldGroup label="Contact Details">
        <div className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">
              Applicant Name<span className="text-red-400 ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <Input value={form.firstName} onChange={set('firstName')} placeholder="First name" error={errorFor('firstName')} />
              <Input value={form.middleName} onChange={set('middleName')} placeholder="Middle Name" />
              <Input value={form.lastName} onChange={set('lastName')} placeholder="Last name" error={errorFor('lastName')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Input label="Email Address" required type="email" value={form.email} onChange={set('email')} error={errorFor('email')} />
            <PhoneInput label="Phone Number" required value={form.phone} onChange={set('phone')} error={errorFor('phone')} />
            <PhoneInput label="Cell Number" value={form.mobile} onChange={set('mobile')} placeholder="Optional" />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Business Address">
        <AddressBlock form={form} set={set} errorFor={errorFor} />
        <div className="mt-5">
          <Checkbox
            label="Mailing address is same as Business address"
            checked={!!form.mailingSame}
            onChange={set('mailingSame')}
          />
        </div>
      </FieldGroup>

      {!form.mailingSame && (
        <FieldGroup label="Mailing Address">
          <AddressBlock prefix="mail" form={form} set={set} errorFor={errorFor} />
        </FieldGroup>
      )}
    </>
  )
}
