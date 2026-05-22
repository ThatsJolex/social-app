import { NextRequest, NextResponse } from "next/server"
import {
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      postId,
      userId,
      username,
      text,
    } = body

    const comment = {
      commentId: crypto.randomUUID(),
      postId,
      userId,
      username,
      text,
      createdAt: Date.now(),
    }

    await dynamodb.send(
      new PutCommand({
        TableName: "Comments",
        Item: comment,
      })
    )

    return NextResponse.json(comment)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const postId =
      req.nextUrl.searchParams.get("postId")

    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Comments",
      })
    )

    const comments =
      data.Items?.filter(
        (comment) =>
          comment.postId === postId
      ) || []

    return NextResponse.json(comments)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}