import { prisma } from '../lib/db'
import { userRepo } from '../repositories/user.repo'
<<<<<<< HEAD

export const notificationService = {
  async sendEventNotification(eventId: string, eventTitle: string) {
    // Get all users who have notifications enabled
    const users = await prisma.user.findMany({
      where: {
        notificationEnabled: true,
      },
      select: {
        id: true,
=======
import { sendEmail } from '../lib/email'

export const notificationService = {
  async sendEventNotification(
    eventId: string,
    eventTitle: string,
    eventDetails?: {
      location?: string
      startTime?: Date
      description?: string
    }
  ) {
    console.log('\n🔔 ===== SEND EVENT NOTIFICATION =====')
    console.log('🔔 Event ID:', eventId)
    console.log('🔔 Event Title:', eventTitle)
    console.log('🔔 Event Details:', JSON.stringify(eventDetails, null, 2))
    
    // Get only students (always send, no opt-out check)
    console.log('🔔 Fetching students from database...')
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
        email: true,
        name: true,
      },
    })

<<<<<<< HEAD
    // In a real implementation, you would send emails here
    // For now, we'll just log the notifications
    console.log(`Sending notifications to ${users.length} users about event: ${eventTitle}`)
    
    // TODO: Integrate with email service (SendGrid/Resend)
    // for (const user of users) {
    //   await sendEmail(user.email, `New event: ${eventTitle}`, ...)
    // }

    return { notified: users.length }
=======
    console.log('🔔 Found students:', users.length)
    console.log('🔔 Student emails:', users.map(u => u.email))

    if (users.length === 0) {
      console.log('🔔 ⚠️  No students found, skipping email send')
      console.log('🔔 ====================================\n')
      return { notified: 0 }
    }

    const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:3000'
    const eventUrl = `${baseUrl}/events/${eventId}`
    
    const locationText = eventDetails?.location ? ` at ${eventDetails.location}` : ''
    const timeText = eventDetails?.startTime 
      ? ` on ${new Date(eventDetails.startTime).toLocaleString()}`
      : ''

    const subject = `New Event: ${eventTitle}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Event Available!</h2>
        <p>We've just posted a new event:</p>
        <h3>${eventTitle}</h3>
        ${eventDetails?.description ? `<p>${eventDetails.description}</p>` : ''}
        ${locationText ? `<p><strong>Location:</strong> ${eventDetails?.location}</p>` : ''}
        ${timeText ? `<p><strong>When:</strong> ${new Date(eventDetails!.startTime!).toLocaleString()}</p>` : ''}
        <p>
          <a href="${eventUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Event Details
          </a>
        </p>
      </div>
    `
    const text = `New Event: ${eventTitle}${locationText}${timeText}\n\nView details: ${eventUrl}`

    // Send to all students
    const emails = users.map(u => u.email).filter(Boolean)
    console.log('🔔 Valid emails to send to:', emails.length)
    console.log('🔔 Email addresses:', emails)
    
    if (emails.length > 0) {
      console.log('🔔 Calling sendEmail...')
      await sendEmail(emails, subject, html, text)
      console.log('🔔 ✅ Email send completed')
    } else {
      console.log('🔔 ⚠️  No valid email addresses found')
    }

    console.log('🔔 ====================================\n')
    return { notified: emails.length }
  },

  async sendReservationConfirmation(
    userEmail: string,
    userName: string | null,
    eventTitle: string,
    quantity: number,
    eventDetails?: {
      location?: string
      startTime?: Date
    }
  ) {
    console.log('\n✉️  ===== SEND RESERVATION CONFIRMATION =====')
    console.log('✉️  User Email:', userEmail)
    console.log('✉️  User Name:', userName)
    console.log('✉️  Event Title:', eventTitle)
    console.log('✉️  Quantity:', quantity)
    console.log('✉️  Event Details:', JSON.stringify(eventDetails, null, 2))
    
    const subject = `Reservation Confirmed: ${eventTitle}`
    const greeting = userName ? `Hi ${userName},` : 'Hi,'
    
    const locationText = eventDetails?.location ? ` at ${eventDetails.location}` : ''
    const timeText = eventDetails?.startTime 
      ? ` on ${new Date(eventDetails.startTime).toLocaleString()}`
      : ''

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reservation Confirmed!</h2>
        <p>${greeting}</p>
        <p>Your reservation has been confirmed:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${eventTitle}</h3>
          <p><strong>Quantity:</strong> ${quantity}</p>
          ${locationText ? `<p><strong>Location:</strong> ${eventDetails?.location}</p>` : ''}
          ${timeText ? `<p><strong>When:</strong> ${new Date(eventDetails!.startTime!).toLocaleString()}</p>` : ''}
        </div>
        <p>We look forward to seeing you there!</p>
      </div>
    `
    const text = `${greeting}\n\nYour reservation for "${eventTitle}" (Quantity: ${quantity})${locationText}${timeText} has been confirmed.\n\nWe look forward to seeing you there!`

    console.log('✉️  Calling sendEmail...')
    await sendEmail(userEmail, subject, html, text)
    console.log('✉️  ✅ Email send completed')
    console.log('✉️  =========================================\n')
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  },

  async updateNotificationPreference(userId: string, enabled: boolean) {
    return userRepo.update(userId, { notificationEnabled: enabled })
  },
}

