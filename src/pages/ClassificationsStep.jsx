import { forwardRef } from 'react'
import Section, { FieldGroup } from '../components/Section'
import ClassificationRows from '../components/ClassificationRows'

// Step one of the legacy flow: the class split, before anything is asked about
// the applicant. Rows must add up to exactly 100%.
//
// No class description here: it differs by carrier, so it belongs to the
// carrier's own rater, not to the one screen that shops all of them. The rows
// themselves are shared with that rater's eligibility page, which edits the
// same list.
const ClassificationsStep = forwardRef(function ClassificationsStep(
  { classifications, setClassifications }, ref
) {
  return (
    <Section ref={ref} id="classes" title="Classifications">
      <FieldGroup label="Classification (add up to four)">
        <ClassificationRows
          classifications={classifications}
          setClassifications={setClassifications}
        />
      </FieldGroup>
    </Section>
  )
})

export default ClassificationsStep
