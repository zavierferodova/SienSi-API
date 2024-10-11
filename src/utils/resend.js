const { Resend } = require('resend')
const { getEnv } = require('./env-util')

const apiKey = getEnv('RESEND_API_KEY').trim()
const resend = new Resend(apiKey)
const resendVerifiedDomain = getEnv('RESEND_VERIFIED_DOMAIN').trim()

const sendEmail = async ({ from, to, subject, html, attachments }) => {
  return await resend.emails.send({
    from, to, subject, html, attachments
  })
}

module.exports = {
  sendEmail,
  resendVerifiedDomain
}
