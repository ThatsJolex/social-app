import "dotenv/config"

import {
  DynamoDBClient,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",

  endpoint: process.env.DYNAMODB_ENDPOINT|| "http://localhost:8000",

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID || "fake",

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "fake",
  },
})

async function createTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "Likes",

      AttributeDefinitions: [
        {
          AttributeName: "likeId",
          AttributeType: "S",
        },
      ],

      KeySchema: [
        {
          AttributeName: "likeId",
          KeyType: "HASH",
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    })

    await client.send(command)

    console.log("Likes table created")

  } catch (error) {
    console.error(error)
  }
}

createTable()