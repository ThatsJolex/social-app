/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" })

const {
  DynamoDBClient,
  CreateTableCommand,
} = require("@aws-sdk/client-dynamodb")

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function createTable() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: "Follows",

        AttributeDefinitions: [
          {
            AttributeName: "followerId",
            AttributeType: "S",
          },
          {
            AttributeName: "followingId",
            AttributeType: "S",
          },
        ],

        KeySchema: [
          {
            AttributeName: "followerId",
            KeyType: "HASH",
          },
          {
            AttributeName: "followingId",
            KeyType: "RANGE",
          },
        ],

        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Follows table created")
  } catch (error) {
    console.error(error)
  }
}

createTable()