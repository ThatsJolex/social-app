/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" })
const {
  DynamoDBClient,
  CreateTableCommand,
} = require("@aws-sdk/client-dynamodb")

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
})

async function createTables() {
  try {
    // USERS TABLE
    await client.send(
      new CreateTableCommand({
        TableName: "Users",
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },//"S" shows that the userId must be a string
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Users table created")

    // POSTS TABLE
    await client.send(
      new CreateTableCommand({
        TableName: "Posts",
        AttributeDefinitions: [
          { AttributeName: "postId", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "postId", KeyType: "HASH" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Posts table created")

    // FOLLOWS TABLE
    await client.send(
      new CreateTableCommand({
        TableName: "Follows",
        AttributeDefinitions: [
          { AttributeName: "followId", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "followId", KeyType: "HASH" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    )

    console.log("Follows table created")
  } catch (error) {
    console.error(error)
  }
}

createTables()