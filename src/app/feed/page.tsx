/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  createdAt: number
}

export default function FeedPage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  const [posts, setPosts] = useState<Post[]>([])

  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  //
  // CHECK LOGIN
  //
  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)

    setUser(parsedUser)

    fetchPosts()
  }, [router])

  //
  // FETCH POSTS
  //
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")

      const data = await response.json()

      const sortedPosts = data.sort(
        (a: Post, b: Post) =>
          b.createdAt - a.createdAt
      )

      setPosts(sortedPosts)

    } catch (error) {
      console.error(error)
    }
  }

  //
  // CREATE POST
  //
  const handleCreatePost = async () => {
    if (!user || !content.trim()) return

    try {
      const response = await fetch("/api/posts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          content,
          imageUrl,
          userId: user.userId,
          username: user.username,
        }),
      })

      const data = await response.json()

      setPosts(prev => [data.post, ...prev])

      setContent("")
      setImageUrl("")

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
        margin: "20px auto",
      }}
    >
      <h1>Social Feed</h1>

      <p>Welcome {user.username}</p>

      {/* CREATE POST */}

      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
          }}
        />

        <input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{
            width: "100%",
            marginTop: "10px",
          }}
        />

        <button
          onClick={handleCreatePost}
          style={{
            marginTop: "10px",
          }}
        >
          Post
        </button>
      </div>

      {/* POSTS */}

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
            <h3>{post.username}</h3>

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