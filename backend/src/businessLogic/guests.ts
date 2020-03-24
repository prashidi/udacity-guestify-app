import * as uuid from "uuid";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { GuestItem } from "../models/GuestItem";
import { GuestUpdate } from "../models/GuestUpdate";
import { GestsAccess } from "../dataLayer/guestsAccess";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CreateGuestRequest } from "../requests/CreateGuestRequest";
import { getUserId } from "../lambda/utils";
import { UpdateGuestRequest } from "../requests/UpdateGuestRequest";
import { GenerateUploadUrlRequest } from "../requests/GenerateUploadUrlRequest";
//import { UploadUrl } from "../models/UploadUrl";

const XAWS = AWSXRay.captureAWS(AWS);

const guestBucket = process.env.GUESTS_S3_BUCKET;
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: "v4"
});

const guestsAccess = new GestsAccess();

export async function getAllGuests(userId: string): Promise<GuestItem[]> {
  console.log("Business logic - get all guests");
  const items = await guestsAccess.getAllGuests(userId);
  console.log(items);
  return items;
}

export async function createGuest(
  event: APIGatewayProxyEvent,
  createGuestRequest: CreateGuestRequest
): Promise<GuestItem> {
  const guestId = uuid.v4();

  const userId = getUserId(event);

  const guest = {
    userId,
    guestId,
    checkin: false,
    attachmentUrl: `https://${guestBucket}.s3.amazonaws.com/${guestId}`,
    ...createGuestRequest
  };

  await guestsAccess.createGuest(guest);

  return guest as GuestItem;
}

export async function updateGuest(
  userId: string,
  guestId: string,
  updateGuestRequest: UpdateGuestRequest
): Promise<GuestUpdate> {
  const updatedGuest = {
    userId,
    guestId,
    ...updateGuestRequest
  };

  await guestsAccess.updateGuest(userId, guestId, updatedGuest);

  return updatedGuest;
}

export async function deleteGuest(
  userId: string,
  guestId: string
): Promise<void> {
  await guestsAccess.deleteGuest(userId, guestId);
}

export async function generateUploadUrl(
  userId: string,
  guestId: string,
  generateUploadUrlRequest: GenerateUploadUrlRequest
): Promise<string> {
  const attachmentId = uuid.v4();

  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: guestBucket,
    Key: attachmentId,
    Expires: 300,
    ...generateUploadUrlRequest
  });

  await guestsAccess.updateGuestAttachmentUrl(userId, guestId, attachmentId);

  return uploadUrl;
}

