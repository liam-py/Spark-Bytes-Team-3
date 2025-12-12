export type AdminUserSummary = {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'STUDENT' | string
  createdEventsCount: number
  reservationsCount: number
}

export type AdminUserDetails = AdminUserSummary & {
  createdEvents: Array<{
    id: string
    title: string
    location: string
    startTime: string
    endTime: string
  }>
  reservations: Array<{
    id: string
    eventId: string
    eventTitle: string
    createdAt: string
  }>
}
