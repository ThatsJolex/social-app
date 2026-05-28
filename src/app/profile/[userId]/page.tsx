/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @next/next/no-img-element */

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"

type User = {
  userId: string
  username: string
  email: string
}

type Post = {
  postId: string
  content: string
  imageUrl: string
  username: string
  userId: string
  createdAt: number
}

export default function ProfilePage() {
  const params = useParams()

  const userId = params.userId as string

  const [user, setUser] =
    useState<User | null>(null)

  const [posts, setPosts] =
    useState<Post[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userResponse = await fetch(
        `/api/users/${userId}`
      )

      const userData =
        await userResponse.json()

      setUser(userData)

      const postsResponse = await fetch(
        "/api/posts"
      )

      const postsData =
        await postsResponse.json()

      const filteredPosts = postsData
        .filter(
          (post: Post) =>
            post.userId === userId
        )
        .sort(
          (a: Post, b: Post) =>
            b.createdAt - a.createdAt
        )

      setPosts(filteredPosts)

    } catch (error) {
      console.error(error)
    }
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Navbar />

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "25px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {user.username
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h1>{user.username}</h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Posts
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.postId}
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                lineHeight: "1.6",
              }}
            >
              {post.content}
            </p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginTop: "15px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}