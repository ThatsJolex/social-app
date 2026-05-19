/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

async function createTables() {
  try {
    // USERS TABLE
    await client.send(
      new CreateTableCommand({
        TableName: "Users",
        AttributeDefinitions: [
          {
            AttributeName: "userId",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "userId",
            KeyType: "HASH",
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Users table created")
  } catch (err) {
    console.log("Users table may already exist")
  }

  try {
    // POSTS TABLE
    await client.send(
      new CreateTableCommand({
        TableName: "Posts",
        AttributeDefinitions: [
          {
            AttributeName: "postId",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "postId",
            KeyType: "HASH",
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Posts table created")
  } catch (err) {
    console.log("Posts table may already exist")
  }
}

createTables()