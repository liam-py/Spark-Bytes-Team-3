import { prisma } from '../lib/db'
import { userRepo } from '../repositories/user.repo'

export const notificationService = {
  async sendEventNotification(eventId: string, eventTitle: string) {
    // Get all users who have notifications enabled
    const users = await prisma.user.findMany({
      where: {
        notificationEnabled: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // In a real implementation, you would send emails here
    // For now, we'll just log the notifications
    console.log(`Sending notifications to ${users.length} users about event: ${eventTitle}`)
    
    // TODO: Integrate with email service (SendGrid/Resend)
    // for (const user of users) {
    //   await sendEmail(user.email, `New event: ${eventTitle}`, ...)
    // }

    return { notified: users.length }
  },

  async updateNotificationPreference(userId: string, enabled: boolean) {
    return userRepo.update(userId, { notificationEnabled: enabled })
  },
}

