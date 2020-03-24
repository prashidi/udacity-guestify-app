import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { getUserIdFromEvent } from "../../auth/utils";
import { getAllGuests } from "../../businessLogic/guests";
import { createLogger } from "../../utils/logger";

const logger = createLogger("getTodosHandler");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Get all guests", event);
  const userId = getUserIdFromEvent(event);

  const items = await getAllGuests (userId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items
    })
  };
};
