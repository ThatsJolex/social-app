import { NextRequest, NextResponse } from "next/server"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      userId: string
    }>
  }
) {
  try {
    const { userId } = await context.params

    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Users",
      })
    )

    const user = data.Items?.find(
      (user) => user.userId === userId
    )

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}