/**
 * Fields in a request to update a single guest.
 */
export interface UpdateGuestRequest {
  name: string;
  table: number;
  checkin: boolean;
  type: string;
}
