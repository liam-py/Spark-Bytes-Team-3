import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
) {
  console.log('\n📧 ===== EMAIL SEND ATTEMPT =====')
  console.log('📧 RESEND_API_KEY:', process.env.RESEND_API_KEY ? `✅ Set (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '❌ NOT SET')
  console.log('📧 RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev (default)')
  
  if (!process.env.RESEND_API_KEY) {
    console.warn('📧 ❌ RESEND_API_KEY not set, skipping email send')
    return
  }

  let recipients = Array.isArray(to) ? to : [to]
  console.log('📧 Original recipients:', recipients)
  console.log('📧 Subject:', subject)
  console.log('📧 HTML length:', html.length, 'chars')
  
  // Use onboarding@resend.dev for testing (no domain verification needed)
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  console.log('📧 Using FROM email:', fromEmail)
  
  // In test mode (onboarding@resend.dev), Resend only allows sending to account owner's email
  const isTestMode = fromEmail === 'onboarding@resend.dev'
  const accountOwnerEmail = process.env.RESEND_TEST_EMAIL || 'akutbi@bu.edu'
  
  if (isTestMode) {
    const originalCount = recipients.length
    recipients = recipients.filter(email => email === accountOwnerEmail)
    if (recipients.length === 0) {
      recipients = [accountOwnerEmail] // Fallback to account owner if none match
    }
    if (originalCount > recipients.length) {
      console.warn(`📧 ⚠️  TEST MODE: Resend test emails can only be sent to account owner (${accountOwnerEmail})`)
      console.warn(`📧 ⚠️  Filtered ${originalCount} recipients to ${recipients.length} (only account owner)`)
      console.warn(`📧 ⚠️  For production, verify a domain at resend.com/domains to send to all recipients`)
    }
  }
  
  console.log('📧 Final recipients:', recipients)
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })
    
    // Check if there's an error in the response
    if (result.error) {
      console.error('📧 ❌ Resend API returned an error!')
      console.error('📧 Error status:', result.error.statusCode)
      console.error('📧 Error message:', result.error.message)
      console.error('📧 Full response:', JSON.stringify(result, null, 2))
      
      // In test mode, don't throw error - just log it
      if (isTestMode) {
        console.warn('📧 ⚠️  Test mode: Email sending failed but continuing (this is expected in test mode)')
        console.log('📧 ==============================\n')
        return
      }
      
      throw new Error(`Resend API error: ${result.error.message}`)
    }
    
    console.log('📧 ✅ Email sent successfully!')
    console.log('📧 Response:', JSON.stringify(result, null, 2))
    console.log('📧 ==============================\n')
  } catch (error: any) {
    console.error('📧 ❌ Failed to send email!')
    console.error('📧 Error message:', error.message)
    console.error('📧 Error details:', error)
    if (error.response) {
      console.error('📧 Error response:', JSON.stringify(error.response, null, 2))
    }
    
    // In test mode, don't throw error - just log it
    if (isTestMode) {
      console.warn('📧 ⚠️  Test mode: Email sending failed but continuing (this is expected in test mode)')
      console.log('📧 ==============================\n')
      return
    }
    
    console.error('📧 ==============================\n')
    throw error
  }
}

