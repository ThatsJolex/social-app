export const dynamic = "force-dynamic"
import Link from "next/link"
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
        margin: "20px auto",
      }}
    >
      <h1>Find Users</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.userId}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <Link
              href={`/profile/${user.userId}`}
            >
              {user.username}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}