export const dynamic = "force-dynamic"

import Link from "next/link"
import Navbar from "@/components/Navbar"

import { ScanCommand } from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

type User = {
  userId: string
  username: string
  email: string
}

async function getUsers(): Promise<User[]> {

  const data = await dynamodb.send(
    new ScanCommand({
      TableName: "Users",
    })
  )

  return (data.Items as User[]) || []
}

export default async function UsersPage() {

  const users = await getUsers()

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Navbar />

      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        Find Users
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.userId}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Link
              href={`/profile/${user.userId}`}
            >
              <h2
                style={{
                  color: "#2563eb",
                }}
              >
                {user.username}
              </h2>
            </Link>

            <p
              style={{
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              {user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}