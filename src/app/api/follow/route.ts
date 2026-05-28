import { NextRequest, NextResponse } from "next/server"

import {
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      followerId,
      followingId,
    } = body

    //
    // CHECK EXISTING FOLLOW
    //
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Follows",
      })
    )

    const existingFollow =
      data.Items?.find(
        (follow) =>
          follow.followerId === followerId &&
          follow.followingId === followingId
      )

    //
    // UNFOLLOW
    //
    if (existingFollow) {

      await dynamodb.send(
        new DeleteCommand({
          TableName: "Follows",

          Key: {
            followId:
              existingFollow.followId,
          },
        })
      )

      return NextResponse.json({
        following: false,
      })
    }

    //
    // FOLLOW
    //
    await dynamodb.send(
      new PutCommand({
        TableName: "Follows",

        Item: {
          followId: crypto.randomUUID(),
          followerId,
          followingId,
        },
      })
    )

    return NextResponse.json({
      following: true,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to follow user",
      },
      {
        status: 500,
      }
    )
  }
}