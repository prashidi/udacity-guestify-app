import * as AWS from "aws-sdk";

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { GuestItem } from "../models/GuestItem";
import { UpdateGuestRequest } from "../requests/UpdateGuestRequest";
import { GenerateUploadUrlRequest } from "../requests/GenerateUploadUrlRequest";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);

export class GestsAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly guestsTable = process.env.GUESTS_TABLE,
    private readonly userIdIndex = process.env.GUESTS_TABLE_GSI,
    private readonly guestsBucket = process.env.GUESTS_S3_BUCKET,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'})
  ) {}

  async getAllGuests(userId: string): Promise<GuestItem[]> {
    console.log("getting all guests for user with id", userId);
    const result = await this.docClient
      .query({
        TableName: this.guestsTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise();

    const items = result.Items;
    return items as GuestItem[];
  }

  async createGuest(guest: GuestItem): Promise<GuestItem> {
    await this.docClient
      .put({
        TableName: this.guestsTable,
        Item: guest
      })
      .promise();

    return guest;
  }

  async updateGuest(
    userId: string,
    guestId: string,
    updatedGuest: UpdateGuestRequest
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.guestsTable,
        Key: {
          userId: userId,
          guestId: guestId
        },
        UpdateExpression:
          "set #name = :name, #table = :table, #checkin = :checkin, #type = :type",
        ExpressionAttributeValues: {
          ":name": updatedGuest.name,
          ":table": updatedGuest.table,
          ":checkin": updatedGuest.checkin,
          ":type": updatedGuest.type
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#table": "table",
          "#checkin": "checkin",
          "#type": "type"
        }
      })
      .promise();
  }

  async deleteGuest(userId: string, guestId: string) {
    await this.docClient
      .delete({
        TableName: this.guestsTable,
        Key: {
          userId: userId,
          guestId: guestId
        }
      })
      .promise();
  }

  async updateGuestAttachmentUrl(
    userId: string,
    guestId: string,
    attachmentUrl: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.guestsTable,
        Key: {
          userId: userId,
          guestId: guestId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.guestsBucket}.s3.amazonaws.com/${attachmentUrl}`
        }
      })
      .promise();
  }

  async getPresignedUploadURL(
    createSignedUrlRequest: GenerateUploadUrlRequest
  ) {
    return this.s3.getSignedUrl("putObject", createSignedUrlRequest);
  }
}
