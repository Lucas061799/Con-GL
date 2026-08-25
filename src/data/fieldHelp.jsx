import { ENTITY_TYPE_HELP, AVAILABLE_STATES } from './applicantOptions'

// Help content for the "i" popovers. Each entry is { title, body } — the
// title fills the popover's tinted header, the body its scrolling panel.
// Wording for the operations fields is transcribed from the BTIS flow.

export const FIELD_HELP = {
  grossReceipts: {
    title: 'Annual Gross Receipts',
    body: (
      <p>
        Total amount of invoices submited and paid over the course of a year,
        without subtracting for any costs or expenses.
      </p>
    ),
  },

  employeePayroll: {
    title: 'Annual Employee Payroll',
    body: (
      <p>
        Total annual payroll of employees and labor pool personnel active in
        the field (Do not include Owner Payroll).
      </p>
    ),
  },

  subContractingCosts: {
    title: 'Sub-Contracting Costs',
    body: (
      <p>
        Total amount paid to subcontractors over the course of a year. A
        subcontractor is a contractor paid to help complete a project.
      </p>
    ),
  },

  activeOwners: {
    title: '# of Active Owners',
    body: (
      <p>
        Includes all proprietors, partners, and officers active in the
        business—except those that exclusively handle clerical duties.
      </p>
    ),
  },

  mainClassCode: {
    title: 'Main Class Code',
    body: <p>The trade that makes up the largest share of the business's receipts.</p>,
  },

  newResidential: {
    title: 'New Residential Construction',
    body: (
      <div className="space-y-2">
        <p>
          By selecting <span className="font-semibold">NO</span>, the Applicant
          DOES NOT perform work on new residential structures, prior to the
          certificate of occupancy, they MAY BE eligible for a premium credit.
        </p>
        <p>
          If the Applicant DOES perform work on residential structures prior to
          the certificate of occupancy, please select{' '}
          <span className="font-semibold">YES</span>. The credit will no longer
          be available for this piece of business.
        </p>
      </div>
    ),
  },

  entityType: {
    title: 'Entity Types',
    body: (
      <div className="space-y-2">
        {ENTITY_TYPE_HELP.map(([term, def]) => (
          <p key={term}>
            <span className="font-semibold">{term}:</span> {def}
          </p>
        ))}
      </div>
    ),
  },

  state: {
    title: 'Available States',
    body: (
      <div className="space-y-2">
        <p className="font-semibold">This product is filed in:</p>
        <p>{AVAILABLE_STATES.join(', ')}.</p>
      </div>
    ),
  },
}
