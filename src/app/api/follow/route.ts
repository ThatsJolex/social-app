import { NextRequest, NextResponse } from "next/server"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { followerId, followingId } = body

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    await dynamodb.send(
      new PutCommand({
        TableName: "Follows",

        Item: {
          followerId,
          followingId,
        },
      })
    )

    return NextResponse.json({
      message: "Followed successfully",
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    )
  }
}