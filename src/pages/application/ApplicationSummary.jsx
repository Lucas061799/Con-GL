import { Panel, Row, EditButton } from '../../components/SummaryPanel'
import { CLASS_CODES } from '../../data/classCodes'
import { ENTITY_TYPES } from '../../data/applicantOptions'
import { YEARS_OF_EXPERIENCE, YEARS_IN_BUSINESS } from '../../data/intakeOptions'
import {
  CC_DEDUCTIBLES, CC_GL_LIMITS, CC_DAMAGES_TO_PREMISES, CC_MEDICAL_LIMITS,
  CC_RECOMMENDED, CC_ADDITIONAL_INSUREDS, CC_OPTIONAL,
} from '../../data/coverageOptions'

const labelOf = (options, value) => options.find(o => (o.value ?? o) === value)?.label ?? ''
const codeLabel = (code) => {
  const found = CLASS_CODES.find(c => c.code === code)
  return found ? `${found.code} - ${found.label}` : code
}
const yesNo = (v) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : '')
const money = (v) => (String(v ?? '').trim() ? `$${Number(String(v).replace(/\D/g, '')).toLocaleString()}` : '')
const lines = (parts) => parts.filter(Boolean).join(', ')

// The application read back the way the legacy review step reads it, in the
// panels the submitted receipt already uses.
export default function ApplicationSummary({ form = {}, rows = [], onEdit }) {
  const address = lines([form.street, lines([form.city, form.state, form.postalCode].filter(Boolean))])
  const mailing = form.mailingSame
    ? address
    : lines([form.mailStreet, lines([form.mailCity, form.mailState, form.mailPostalCode].filter(Boolean))])

  const picked = [...CC_RECOMMENDED, ...CC_ADDITIONAL_INSUREDS.filter(o => o.price), ...CC_OPTIONAL]
    .filter(o => form[o.key])

  const edit = (step, label) => (onEdit ? <EditButton onClick={() => onEdit(step)} label={label} /> : null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      <Panel title="Classification(s)" icon="doc">
        {rows.filter(r => r.code).map(r => (
          <Row key={r.code} label={codeLabel(r.code)} value={`${r.percentage || 0} %`} />
        ))}
      </Panel>

      <Panel title="Contact Information" icon="user">
        <Row label="Name" value={lines([form.firstName, form.middleName, form.lastName].filter(Boolean)).replace(/,/g, ' ')} />
        <Row label="Business Address" value={address} />
        <Row label="Mailing Address" value={mailing} />
        <Row label="Phone" value={form.phone} />
        <Row label="Mobile Phone" value={form.mobile} />
        <Row label="Email Address" value={form.email} />
      </Panel>

      <Panel title="Business Information" icon="building">
        <Row label="Effective Date" value={form.effectiveDate} />
        <Row label="Legal Business Name" value={form.legalName} />
        <Row label="DBA" value={form.dba} />
        <Row label="Structure Of Business" value={labelOf(ENTITY_TYPES, form.entityType)} />
        <Row label="Industry Experience" value={labelOf(YEARS_OF_EXPERIENCE, form.yearsOfExperience)} />
        <Row label="Business Experience" value={labelOf(YEARS_IN_BUSINESS, form.yearsInBusiness)} />
        <Row label="# of Owners" value={form.activeOwners} />
        <Row label="Annual Gross Receipts" value={money(form.grossReceipts)} />
        <Row label="Does The Applicant have any Employees?" value={yesNo(form.hasEmployees)} />
        <Row label="Does The Applicant hire SubContractors?" value={yesNo(form.hiresSubs)} />
        <Row
          label="Does The Applicant Perform residential work prior to the certificate of occupancy?"
          value={yesNo(form.newResidential)}
        />
      </Panel>

      <Panel title="Terms & Conditions" icon="clock" action={edit('eligibility', 'Terms & Conditions')}>
        <Row label="Terms Agreement Response" value={yesNo(form.agreeTerms)} />
        <Row label="Description of Operations" value={form.operationsDescription} />
      </Panel>

      <Panel title="Deductible & Limits" icon="shield" action={edit('coverage', 'Deductible & Limits')}>
        <Row label="Deductible" value={labelOf(CC_DEDUCTIBLES, form.ccDeductible)} />
        <Row label="GL Limits" value={labelOf(CC_GL_LIMITS, form.ccGlLimits)} />
        <Row label="Damage Limits" value={labelOf(CC_DAMAGES_TO_PREMISES, form.ccDamagesToPremises)} />
        <Row label="Medical Limits" value={labelOf(CC_MEDICAL_LIMITS, form.ccMedicalLimit)} />
      </Panel>

      <Panel
        title="Additional Insureds and Optional Coverages"
        icon="tools"
        action={edit('coverage', 'Additional Insureds and Optional Coverages')}
      >
        <Row label="Blanket Additional Insured form" value="Included" />
        <Row label="Owners, Lessees or Contractors: Completed Operations CG 2037" value="Available upon request" />
        {picked.map(o => <Row key={o.key} label={o.label} value="Yes" />)}
      </Panel>
    </div>
  )
}
