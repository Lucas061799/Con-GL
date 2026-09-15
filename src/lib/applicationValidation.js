// What the application is still missing, by step. It lives here rather than in
// ApplicationFlow because the intake's rail shows the application's steps too,
// and both sides have to agree on which are done.
export function applicationMissing(form = {}, files = []) {
  const blank = (k) => !String(form[k] ?? '').trim()
  const words = (k) => String(form[k] ?? '').trim().split(/\s+/).filter(Boolean).length
  const out = { eligibility: [], coverage: [], review: [], bind: [] }

  if (blank('agreeTerms')) out.eligibility.push('agreeTerms')
  // Both free-text answers carry the legacy ten-word minimum.
  if (form.agreeTerms === 'no' && words('agreeExplanation') < 10) out.eligibility.push('agreeExplanation')
  if (words('operationsDescription') < 10) out.eligibility.push('operationsDescription')

  out.coverage.push(...['ccDeductible', 'ccGlLimits', 'ccDamagesToPremises', 'ccMedicalLimit'].filter(blank))
  // The tools cover needs its claims question answered, and a limit unless
  // the claims history rules the cover out.
  if (form.toolsEquipment) {
    if (blank('imClaims')) out.coverage.push('imClaims')
    else if (form.imClaims === 'no' && blank('imLimit')) out.coverage.push('imLimit')
  }
  if (form.employeeBenefits && blank('employeeBenefitsLimit')) out.coverage.push('employeeBenefitsLimit')
  // The tool floater's limit carries its own deductible, so it has to be picked.
  if (form.toolFloater && blank('toolFloaterLimit')) out.coverage.push('toolFloaterLimit')

  out.review.push(...['effectiveDate', 'paymentMethod', 'signMethod'].filter(blank))
  // Direct Bill asks for the instalment plan and who pays on top of that.
  if (form.paymentMethod === 'direct-bill') {
    out.review.push(...['installmentOption', 'payMethod'].filter(blank))
  }

  // eSign needs somewhere to send the request; the manual path needs the
  // signed copy back before anything can bind.
  if (blank('signMethod')) out.bind.push('signMethod')
  else if (form.signMethod === 'esign') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.insuredEmail ?? '').trim())) out.bind.push('insuredEmail')
  } else if (form.signMethod === 'upload' && files.length === 0) {
    out.bind.push('signedFiles')
  }
  if (!form.attested) out.bind.push('attested')

  return out
}
