/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"

type User = {
  userId: string
  username: string
  email: string
}

export default function DiscoverPage() {

  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  //
  // LOAD USERS
  //
  useEffect(() => {

    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }

    fetchUsers()

  }, [])

  //
  // FETCH USERS
  //
  const fetchUsers = async () => {

    try {

      const response = await fetch("/api/users")

      const data = await response.json()

      setUsers(data)

    } catch (error) {
      console.error(error)
    }
  }

  //
  // FOLLOW USER
  //
  const handleFollow = async (followingId: string) => {

    if (!currentUser) return

    try {

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
      <h1>Discover Users</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {users
          .filter(user => user.userId !== currentUser?.userId)
          .map((user) => (
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