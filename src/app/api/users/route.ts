import { NextResponse } from "next/server"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

export async function GET() {
  try {
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "Users",
      })
    )

    return NextResponse.json(data.Items || [])

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}