import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,

  endpoint: process.env.DYNAMODB_ENDPOINT,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fakeMyKeyId",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "fakeSecretAccessKey",
  },
})

export const dynamodb = DynamoDBDocumentClient.from(client)