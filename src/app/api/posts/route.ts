import { NextRequest, NextResponse } from "next/server"
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { content, imageUrl, userId, username } = body

    const post = {
      postId: crypto.randomUUID(),
      content,
      imageUrl,
      userId,
      username,
      createdAt: Date.now(),
    }

    await dynamodb.send(
      new PutCommand({
        TableName: "Posts",
        Item: post,
      })
    )

    return NextResponse.json({
      message: "Post created",
      post,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Posts",
      })
    )

    return NextResponse.json(data.Items)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}