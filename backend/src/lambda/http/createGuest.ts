import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { CreateGuestRequest } from "../../requests/CreateGuestRequest";
import { createGuest } from "../../businessLogic/guests";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newGuest: CreateGuestRequest = JSON.parse(event.body);

  if (!newGuest.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "name is empty"
      })
    };
  } else if (!newGuest.table) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "table field is empty"
      })
    };
  }

  const guest = await createGuest(event, newGuest);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      item: guest
    })
  };
};
