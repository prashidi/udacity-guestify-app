export interface Guest {
  guestId: string
  name: string
  table: number
  checkin: boolean
  type: string
  attachmentUrl?: string
}
