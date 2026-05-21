/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
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

    //
    // GET ALL FOLLOWS
    //
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Follows",
      })
    )

    //
    // FILTER ONLY CURRENT USER FOLLOWS
    //
    const following =
      data.Items?.filter(
        (follow: any) => 
          follow.followerId === userId
      ) || []

    return NextResponse.json(following)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    )
  }
}