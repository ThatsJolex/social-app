import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

import { dynamodb } from "@/lib/dynamodb"

import {
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { username, email, password } = body

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUsers = await dynamodb.send(
      new ScanCommand({
        TableName: "Users",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    )

    if (existingUsers.Items && existingUsers.Items.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user object
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    }

    // Save user
    await dynamodb.send(
      new PutCommand({
        TableName: "Users",
        Item: user,
      })
    )

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}