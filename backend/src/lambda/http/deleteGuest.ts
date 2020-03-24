import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";

import { deleteGuest } from "../../businessLogic/guests";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const guestId = event.pathParameters.guestId;
  const userId = getUserId(event);

  await deleteGuest(userId, guestId);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({})
  };
};
