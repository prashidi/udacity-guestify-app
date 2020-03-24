import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { UpdateGuestRequest } from "../../requests/UpdateGuestRequest";
import { updateGuest } from "../../businessLogic/guests";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const guestId = event.pathParameters.guestId;
  const userId = getUserId(event);

  const updatedGuest: UpdateGuestRequest = JSON.parse(event.body);

  await updateGuest(userId, guestId, updatedGuest);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({})
  };
};
