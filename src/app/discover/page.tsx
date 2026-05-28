/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
 
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"

type User = {
  userId: string
  username: string
  email: string
}

type Follow = {
  followingId: string
}

export default function DiscoverPage() {

  const [users, setUsers] =
    useState<User[]>([])

  const [currentUser, setCurrentUser] =
    useState<User | null>(null)

  const [followingIds, setFollowingIds] =
    useState<string[]>([])

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user")

    if (storedUser) {

      const parsedUser =
        JSON.parse(storedUser)

      setCurrentUser(parsedUser)

      fetchFollowing(parsedUser.userId)
    }

    fetchUsers()

  }, [])

  //
  // USERS
  //
  const fetchUsers = async () => {

    try {

      const response =
        await fetch("/api/users")

      const data =
        await response.json()

      setUsers(data)

    } catch (error) {
      console.error(error)
    }
  }

  //
  // FOLLOWING
  //
  const fetchFollowing =
    async (userId: string) => {

      try {

        const response =
          await fetch(
            `/api/following?userId=${userId}`
          )

        const data =
          await response.json()

        const ids = data.map(
          (follow: Follow) =>
            follow.followingId
        )

        setFollowingIds(ids)

      } catch (error) {
        console.error(error)
      }
    }

  //
  // FOLLOW / UNFOLLOW
  //
  const handleFollow =
    async (followingId: string) => {

      if (!currentUser) return

      try {

        const response =
          await fetch("/api/follow", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              followerId:
                currentUser.userId,

              followingId,
            }),
          })

        const data =
          await response.json()

        if (data.following) {

          setFollowingIds(prev => [
            ...prev,
            followingId,
          ])

        } else {

          setFollowingIds(prev =>
            prev.filter(
              id => id !== followingId
            )
          )
        }

      } catch (error) {
        console.error(error)
      }
    }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <Navbar />
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "25px",
        }}
      >
        Discover Users
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {users
          .filter(
            user =>
              user.userId !==
              currentUser?.userId
          )
          .map((user) => {

            const isFollowing =
              followingIds.includes(
                user.userId
              )

            return (
              <div
                key={user.userId}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "14px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.08)",

                  display: "flex",
                  justifyContent:
                    "space-between",

                  alignItems: "center",
                }}
              >
                <div>
                  <Link
                    href={`/profile/${user.userId}`}
                  >
                    <h2
                      style={{
                        color: "#2563eb",
                        marginBottom: "6px",
                      }}
                    >
                      {user.username}
                    </h2>
                  </Link>

                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleFollow(
                      user.userId
                    )
                  }
                  style={{
                    padding:
                      "10px 18px",

                    borderRadius: "8px",

                    border: "none",

                    backgroundColor:
                      isFollowing
                        ? "#e5e7eb"
                        : "black",

                    color:
                      isFollowing
                        ? "black"
                        : "white",

                    fontWeight: "bold",
                  }}
                >
                  {isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}