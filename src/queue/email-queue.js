const { sendEmail } = require('../utils/resend')
const Bull = require('bull')

const emailQueue = new Bull('siensi-email', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
})

const processEmailQueue = async (job) => {
  try {
    const { data } = job
    const { from, to, subject, html, attachments } = data
    console.log(`Sending email to ${to}`)
    const result = await sendEmail({
      from,
      to,
      subject,
      html,
      attachments
    })

    if (result.error) {
      throw new Error(`Failed sending email to ${to}`)
    }

    console.log(`Success sending email to ${to}`)
  } catch (e) {
    console.error(e)
  }
}

emailQueue.process(processEmailQueue)

module.exports = emailQueue
