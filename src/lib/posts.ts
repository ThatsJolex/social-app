import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function getAllPosts() {
  const data = await dynamodb.send(
    new ScanCommand({
      TableName: "Posts",
    })
  )

  return data.Items || []
}