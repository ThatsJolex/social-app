import { NextRequest, NextResponse } from "next/server"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function GET(req: NextRequest) {

  try {

    const userId =
      req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    const data = await dynamodb.send(
      new QueryCommand({
        TableName: "Follows",

        KeyConditionExpression:
          "followerId = :followerId",

        ExpressionAttributeValues: {
          ":followerId": userId,
        },
      })
    )

    return NextResponse.json(data.Items || [])

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    )
  }
}