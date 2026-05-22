import dotenv from "dotenv"

dotenv.config({
  path: "../../.env.local",
})
import {
  DynamoDBClient,
  CreateTableCommand,
} from "@aws-sdk/client-dynamodb"


const client = new DynamoDBClient({
  region: process.env.AWS_REGION,

  endpoint: process.env.DYNAMODB_ENDPOINT,

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function createTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "Comments",

      AttributeDefinitions: [
        {
          AttributeName: "commentId",
          AttributeType: "S",
        },
      ],

      KeySchema: [
        {
          AttributeName: "commentId",
          KeyType: "HASH",
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    })

    const response =
      await client.send(command)

    console.log(
      "Table created:",
      response
    )

  } catch (error) {
    console.error(error)
  }
}

createTable()