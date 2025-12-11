import { organizerRepo } from '../repositories/organizer.repo'

export const organizerService = {
  async requestOrganizerStatus(userId: string) {
    return organizerRepo.requestOrganizerStatus(userId)
  },

  async approveOrganizer(userId: string) {
    return organizerRepo.approveOrganizer(userId)
  },

  async rejectOrganizer(userId: string) {
    return organizerRepo.rejectOrganizer(userId)
  },

  async getPendingRequests() {
    return organizerRepo.getPendingRequests()
  },
}

