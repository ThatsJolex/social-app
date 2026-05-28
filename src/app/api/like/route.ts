/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { DeleteCommand } from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { postId, userId } = body

    //
    // CHECK IF ALREADY LIKED
    //
    const likesData = await dynamodb.send(
      new ScanCommand({
        TableName: "Likes",
      })
    )

    const existingLike =
      likesData.Items?.find(
        (like) =>
          like.postId === postId &&
          like.userId === userId
      )

    //
    // UNLIKE
    //
    if (existingLike) {

      await dynamodb.send(new DeleteCommand({
        TableName: "Likes",
        Key: {
          likeId: existingLike.likeId,
        },
      }))
       

      const existingPost =
        await dynamodb.send(
          new GetCommand({
            TableName: "Posts",
            Key: {
              postId,
            },
          })
        )

      const currentLikes =
        existingPost.Item?.likes || 0

      await dynamodb.send(
        new UpdateCommand({
          TableName: "Posts",

          Key: {
            postId,
          },

          UpdateExpression:
            "SET likes = :likes",

          ExpressionAttributeValues: {
            ":likes":
              Math.max(currentLikes - 1, 0),
          },
        })
      )

      return NextResponse.json({
        liked: false,
      })
    }

    //
    // CREATE LIKE
    //
    await dynamodb.send(
      new PutCommand({
        TableName: "Likes",

        Item: {
          likeId: crypto.randomUUID(),
          postId,
          userId,
        },
      })
    )

    //
    // GET POST
    //
    const existingPost =
      await dynamodb.send(
        new GetCommand({
          TableName: "Posts",
          Key: {
            postId,
          },
        })
      )

    const currentLikes =
      existingPost.Item?.likes || 0

    //
    // UPDATE COUNT
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
      liked: true,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to like post",
      },
      {
        status: 500,
      }
    )
  }
}