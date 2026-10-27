/**
 * CONTACT — THE SINGLE AUTHORITATIVE CONFIGURATION POINT.
 *
 * Ported (TS -> JS) from the desktop project's src/contactInfo.ts. Values are
 * the owner's own, supplied verbatim — nothing is invented. Remaining empty
 * URLs stay empty until the owner supplies them.
 */
import portraitArtwork from '../assets/my_background-contact.png'

export const CONTACT_EMAIL = 'mr.utkarsh.raj.chauhan@gmail.com'

export const PORTRAIT_SRC = portraitArtwork

export const SOCIAL_PROFILES = [
  { id: 'linkedin', platform: 'LinkedIn', label: 'Professional network', url: 'https://www.linkedin.com/in/utkarshrajchauhan000001' },
  { id: 'instagram', platform: 'Instagram', label: 'Visual work and updates', url: '' },
  { id: 'github', platform: 'GitHub', label: 'Selected public projects', url: 'https://github.com/MrUtkarshRajChauhan' },
  { id: 'facebook', platform: 'Facebook', label: 'Social profile', url: '' },
  { id: 'x', platform: 'X (Twitter)', label: 'Updates and conversations', url: '' },
  { id: 'reddit', platform: 'Reddit', label: 'Communities and discussions', url: '' },
]

export const CONTACT_SUBJECT = 'Project enquiry'

export const CONTACT_BODY_LINES = [
  'Hi,',
  '',
  'I came across your portfolio and would like to discuss a project.',
  '',
  'Project details:',
  '',
  'Timeline:',
  '',
  'Budget range:',
  '',
  'Best regards,',
]

export const CONTACT_BODY = CONTACT_BODY_LINES.join('\n')

export const CONTACT_EMAIL_CONFIGURED = CONTACT_EMAIL.trim().length > 0

export function buildMailtoHref(email = CONTACT_EMAIL) {
  const subject = encodeURIComponent(CONTACT_SUBJECT)
  const body = encodeURIComponent(CONTACT_BODY)
  return `mailto:${email}?subject=${subject}&body=${body}`
}

export function buildGmailComposeUrl(email = CONTACT_EMAIL) {
  const url = new URL('https://mail.google.com/mail/')
  url.searchParams.set('view', 'cm')
  url.searchParams.set('fs', '1')
  url.searchParams.set('to', email)
  url.searchParams.set('su', CONTACT_SUBJECT)
  url.searchParams.set('body', CONTACT_BODY)
  return url.toString()
}
