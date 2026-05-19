import { NextRequest, NextResponse } from "next/server"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { followerId, followingId } = body

    const follow = {
      followId: crypto.randomUUID(),
      followerId,
      followingId,
    }

    await dynamodb.send(
      new PutCommand({
        TableName: "Follows",
        Item: follow,
      })
    )

    return NextResponse.json({
      message: "Followed user",
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    )
  }
}