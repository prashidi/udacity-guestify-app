import { apiEndpoint } from '../config'
import { Guest } from '../types/Guest'
import { CreateGuestRequest } from '../types/CreateGuestRequest'
import Axios from 'axios'
import { UpdateGuestRequest } from '../types/UpdateGuestRequest'

export async function getGuests(idToken: string): Promise<Guest[]> {
  console.log('Fetching guests')

  const response = await Axios.get(`${apiEndpoint}/guests`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Guests:', response.data)
  return response.data.items
}

export async function createGuest(
  idToken: string,
  newGuest: CreateGuestRequest
): Promise<Guest> {
  const response = await Axios.post(
    `${apiEndpoint}/guests`,
    JSON.stringify(newGuest),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchGuest(
  idToken: string,
  guestId: string,
  updatedGuest: UpdateGuestRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/guests/${guestId}`,
    JSON.stringify(updatedGuest),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteGuest(
  idToken: string,
  guestId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/guests/${guestId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  guestId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/guests/${guestId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
