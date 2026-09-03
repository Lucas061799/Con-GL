// Underwriting questions that only apply to certain trades. A rule fires when
// any classification on the submission carries one of its class codes, so a
// contractor who splits work across four trades sees every question their mix
// pulls in.
//
// `field` is the path the answer maps to on the submission payload — keep it
// alongside the question so the mapping doesn't drift once the API is wired.
export const CONDITIONAL_QUESTIONS = [
  {
    id: 'specialCoatings',
    // Painting Exterior/Interior, Sign Painting Exterior/Interior
    classCodes: ['98304', '98305', '99004', '99003'],
    question: 'Does the businesses’ operations include any use of special coatings or applications such as epoxy?',
    field: 'Submission.Application.SpecialCoatings',
    sub: {
      type: 'text',
      question: 'Please provide details of the special coatings or epoxy used',
      field: 'Submission.Application.SpecialCoatingsDescription',
    },
  },
  {
    id: 'cleaningWithOtherOps',
    // Window Cleaning
    classCodes: ['99975'],
    question: 'Does the business perform cleaning in conjunction with other operations?',
    field: 'Submission.Application.OperationsIncludeOtherThanCleaning',
    sub: {
      type: 'text',
      question: 'Please provide details of the other operations',
      field: 'Submission.Application.OperationsIncludeOtherThanCleaningDescription',
    },
  },
  {
    id: 'highValueHomes',
    // 98483 (Plumbing - Residential) is in the carrier's trigger list but not
    // yet in classCodes.js — it sits in one of the transcription GAPs.
    classCodes: [
      '91111', '91340', '91341', '91342', '91551', '91560', '92338', '92478',
      '94569', '95647', '95648', '97447', '98304', '98305', '98482', '98483',
      '99746', '99975',
    ],
    question: 'Is any work being completed on high value homes, valued at over $2,000,000, EXCLUDING land value?',
    field: 'Submission.Application.HighValueHomes',
    sub: {
      type: 'yesno',
      question: 'Is more than 15% of the customer’s work performed on High Value Home projects, over $2,000,000, EXCLUDING land value?',
      field: 'Submission.Application.HighValueHomesExceedThreshold',
      // A yes here can't be auto-bound — it goes to an underwriter.
      underwriterReviewOnYes: true,
    },
  },
]

// Field keys held on `form` for a rule. The parent answer keeps the rule id,
// the sub answer suffixes it.
export const subKey = (rule) => `${rule.id}Sub`

export const rulesForCodes = (codes) => {
  const set = new Set(codes.filter(Boolean))
  return CONDITIONAL_QUESTIONS.filter(r => r.classCodes.some(c => set.has(c)))
}

// True once an answered rule has tripped its underwriter-review condition.
export const needsUnderwriterReview = (rules, form) =>
  rules.some(r => r.sub?.underwriterReviewOnYes && form[r.id] === 'yes' && form[subKey(r)] === 'yes')
