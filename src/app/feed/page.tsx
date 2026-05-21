 
 
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type User = {
  userId: string
  username: string
  email: string
}

type Post = {
  userId: string
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

  const [selectedFile, setSelectedFile] =
  useState<File | null>(null)

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

    fetchPosts(parsedUser)
  }, [])

  //
  // FETCH POSTS
  //
  const fetchPosts = async (currentUser: User) => {
    try {
      //
      // GET FOLLOWING
      //
      const followResponse = await fetch(
        `/api/following?userId=${currentUser.userId}`
      )

      const followingData = await followResponse.json()

      const followingIds = Array.isArray(followingData)
  ? followingData.map(
      (follow: { followingId: string }) =>
        follow.followingId
    )
  : []

      //
      // INCLUDE YOUR OWN POSTS
      //
      followingIds.push(currentUser.userId)

      //
      // GET POSTS
      //
      const response = await fetch("/api/posts")

      const data = await response.json()

      //
      // FILTER POSTS
      //
      const filteredPosts = data.filter(
        (post: Post) =>
          followingIds.includes(post.userId)
      )

      //
      // SORT POSTS
      //
      const sortedPosts = filteredPosts.sort(
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
    let uploadedImageUrl = ""

//
// UPLOAD IMAGE
//
if (selectedFile) {

  const formData = new FormData()

  formData.append("file", selectedFile)

  const uploadResponse = await fetch(
    "/api/upload",
    {
      method: "POST",
      body: formData,
    }
  )

  const uploadData =
    await uploadResponse.json()

  uploadedImageUrl =
    uploadData.imageUrl
}
    if (!user || !content.trim()) return

    try {
      const response = await fetch("/api/posts", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          content,
          imageUrl: uploadedImageUrl,
          userId: user.userId,
          username: user.username,
        }),
      })

      const data = await response.json()

      setPosts(prev => [data.post, ...prev])

      setContent("")
      setSelectedFile(null)

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
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
    }
  }}
  style={{
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
            <Link href={`/profile/${post.userId}`}>
  <h3
    style={{
      cursor: "pointer",
      color: "blue",
    }}
  >
    {post.username}
  </h3>
</Link>

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