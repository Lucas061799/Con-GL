// Applicant Information step — option sets and helper copy, transcribed from
// the BTIS staging flow.

export const ENTITY_TYPES = [
  { value: 'corporation',      label: 'Corporation' },
  { value: 'joint-venture',    label: 'Joint Venture' },
  { value: 'llc',              label: 'Limited Liability Company' },
  { value: 'limited-partner',  label: 'Limited Partnership' },
  { value: 'partnership',      label: 'Partnership' },
  { value: 'sole-proprietor',  label: 'Sole Proprietor or Individual' },
]

// Shown in the "i" bubble next to Entity Type.
export const ENTITY_TYPE_HELP = [
  ['Sole Proprietor/Individual', 'a person who is the exclusive owner of a business, entitled to keep all profits after tax has been paid but liable for all losses.'],
  ['Corporation', 'a company or group of people authorized to act as a single entity (legally a person) and recognized as such in law.'],
  ['Joint Venture', 'a commercial enterprise undertaken jointly by two or more parties that otherwise retain their distinct identities.'],
  ['Limited Liability Company', "a corporate structure whereby the members of the company cannot be held personally liable for the company's debts or liabilities."],
  ['Partnership', 'a business operation between two or more individuals who share management and profits.'],
  ['Limited Partnership', 'a limited partnership is a form of partnership in which some of the partners contribute only financially and are liable only to the extent of the amount of money that they have invested.'],
]

// States the product is filed in — matches the "Available in" tooltip.
export const AVAILABLE_STATES = [
  'AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN',
  'KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE',
  'NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','RI','SC','SD','TN','TX',
  'UT','VA','VT','WA','WI','WV','WY',
]

// The Classifications step says "add up to four" on the legacy screens. The
// three-trade limit that used to sit beside this went with the phase-two
// screen that was the only thing reading it.
export const MAX_INTAKE_CLASSIFICATIONS = 4
