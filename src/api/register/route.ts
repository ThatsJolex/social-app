import { NextRequest, NextResponse } from "next/server"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { dynamo } from "@/lib/dynamodb"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const docClient = DynamoDBDocumentClient.from(dynamo)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      userId: uuidv4(),
      username,
      email,
      password: hashedPassword,
    }

    await docClient.send(
      new PutCommand({
        TableName: "Users",
        Item: user,
      })
    )

    return NextResponse.json({
      message: "User created",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}