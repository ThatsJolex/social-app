/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

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

  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      //
      // GET USER
      //
      const userResponse = await fetch(
        `/api/users/${userId}`
      )

      const userData = await userResponse.json()

      setUser(userData)

      //
      // GET POSTS
      //
      const postsResponse = await fetch(
        "/api/posts"
      )

      const postsData = await postsResponse.json()

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
    return <p>Loading profile...</p>
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
      }}
    >
      <h1>{user.username}</h1>

      <p>{user.email}</p>

      <hr
        style={{
          margin: "20px 0",
        }}
      />

      <h2>Posts</h2>

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
              border: "1px solid #ccc",
              padding: "15px",
            }}
          >
            <p>{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
