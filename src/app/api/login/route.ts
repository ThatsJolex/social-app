import { NextRequest, NextResponse } from "next/server"
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import bcrypt from "bcryptjs"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // Find user by email
    const result = await dynamodb.send(
        //search the table
      new ScanCommand({
        TableName: "Users",
        FilterExpression: "email = :email", //FilterExpression used to find matching email
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    )

    const user = result.Items?.[0]

    // User not found
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Compare password safely using bcrypt instead of password === user.password since passwords are hashed, one is plain text and one is hashed.
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Success
    return NextResponse.json({
      message: "Login successful",
      user: {
        userId: user.userId,
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