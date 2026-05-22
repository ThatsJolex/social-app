import { NextRequest, NextResponse } from "next/server"
import {
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { postId } = body

    //
    // GET CURRENT POST
    //
    const existingPost = await dynamodb.send(
      new GetCommand({
        TableName: "Posts",
        Key: {
          postId,
        },
      })
    )

    if (!existingPost.Item) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const currentLikes =
      existingPost.Item.likes || 0

    //
    // UPDATE LIKES
    //
    await dynamodb.send(
      new UpdateCommand({
        TableName: "Posts",
        Key: {
          postId,
        },
        UpdateExpression:
          "SET likes = :likes",
        ExpressionAttributeValues: {
          ":likes": currentLikes + 1,
        },
      })
    )

    return NextResponse.json({
      message: "Post liked",
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    )
  }
}