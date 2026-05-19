/* eslint-disable react-hooks/immutability */
"use client"

import { useEffect, useState } from "react"

type User = {
  userId: string
  username: string
  email: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")

      const data = await response.json()

      setUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleFollow = async (followingId: string) => {
    try {
      const storedUser = localStorage.getItem("user")

      if (!storedUser) return

      const currentUser = JSON.parse(storedUser)

      await fetch("/api/follow", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          followerId: currentUser.userId,
          followingId,
        }),
      })

      alert("User followed")
    } catch (error) {
      console.error(error)
    }
  }

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
          gap: "20px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.userId}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
            }}
          >
            <h3>{user.username}</h3>

            <p>{user.email}</p>

            <button
              onClick={() => handleFollow(user.userId)}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}