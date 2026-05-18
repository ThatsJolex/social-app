import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const dynamo = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
})