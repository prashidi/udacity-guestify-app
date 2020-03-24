export interface GuestItem {
  userId: string;
  guestId: string;
  name: string;
  table: number;
  checkin: boolean;
  type: string;
  attachmentUrl?: string;
}
