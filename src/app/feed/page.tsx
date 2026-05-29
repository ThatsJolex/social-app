/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
 
/* eslint-disable @next/next/no-img-element */

"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"

import Link from "next/link"
import Navbar from "@/components/Navbar"


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
  likes?: number
}

type Comment = {
  commentId: string
  postId: string
  username: string
  text: string
}

export default function FeedPage() {
  

  const [user, setUser] = useState<User | null>(null)

  const [posts, setPosts] = useState<Post[]>([])

  const [content, setContent] = useState("")

  const [comments, setComments] = useState<{
    [key: string]: Comment[]
  }>({})

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  //
// LOAD USER
//
useEffect(() => {
  const storedUser =
    localStorage.getItem("user")

  if (!storedUser) {
    return
  }

  const parsedUser =
    JSON.parse(storedUser)

  setUser(parsedUser)

  fetchPosts(parsedUser)

}, [])

  //
  // FETCH POSTS
  //
  const fetchPosts = async (
    currentUser: User
  ) => {
    try {
      //
      // GET FOLLOWING
      //
      const followResponse = await fetch(
        `/api/following?userId=${currentUser.userId}`
      )

      const followingData =
        await followResponse.json()

      const followingIds = Array.isArray(
        followingData
      )
        ? followingData.map(
            (
              follow: {
                followingId: string
              }
            ) => follow.followingId
          )
        : []

      //
      // INCLUDE YOUR OWN POSTS
      //
      followingIds.push(currentUser.userId)

      //
      // GET POSTS
      //
      const response = await fetch(
        "/api/posts"
      )

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
      const sortedPosts =
        filteredPosts.sort(
          (a: Post, b: Post) =>
            b.createdAt - a.createdAt
        )

      setPosts(sortedPosts)

      //
      // FETCH COMMENTS
      //
      const commentsMap: {
        [key: string]: Comment[]
      } = {}

      for (const post of sortedPosts) {
        const response = await fetch(
          `/api/comments?postId=${post.postId}`
        )

        const data =
          await response.json()

        commentsMap[post.postId] = data
      }

      setComments(commentsMap)
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

      formData.append(
        "file",
        selectedFile
      )

      const uploadResponse =
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

      const uploadData =
        await uploadResponse.json()

      uploadedImageUrl =
        uploadData.imageUrl
    }

    if (!user || !content.trim()) return

    try {
      const response = await fetch(
        "/api/posts",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            content,
            imageUrl: uploadedImageUrl,
            userId: user.userId,
            username: user.username,
          }),
        }
      )

      const data = await response.json()

      setPosts((prev) => [
        data.post,
        ...prev,
      ])

      setContent("")
      setSelectedFile(null)

      fetchPosts(user)
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
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <><Navbar />
      <div></div>
      </>
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "25px",
          backgroundColor: "white",
          padding: "15px 20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            Social Feed
          </h1>

          <p
            style={{
              margin: "5px 0 0 0",
              color: "#6b7280",
            }}
          >
            Welcome {user.username}
          </p>
        </div>

        
      </div>

      {/* CREATE POST */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: "100px",
            borderRadius: "10px",
            border:
              "1px solid #d1d5db",
            padding: "12px",
            resize: "none",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setSelectedFile(
                e.target.files[0]
              )
            }
          }}
          style={{
            marginTop: "12px",
          }}
        />

        <button
          onClick={handleCreatePost}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "black",
            color: "white",
            marginTop: "12px",
            cursor: "pointer",
            fontWeight: "bold",
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
        {posts.length === 0 && (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#6b7280",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            No posts yet.
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post.postId}
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "20px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* USER HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  backgroundColor:
                    "#d1d5db",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  fontWeight: "bold",
                  color: "#374151",
                  fontSize: "18px",
                }}
              >
                {post.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <Link
                href={`/profile/${post.userId}`}
              >
                <h3
                  style={{
                    color: "#2563eb",
                    margin: 0,
                    cursor: "pointer",
                  }}
                >
                  {post.username}
                </h3>
              </Link>
            </div>

            {/* POST CONTENT */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#111827",
              }}
            >
              {post.content}
            </p>

            {/* POST IMAGE */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginTop: "15px",
                  objectFit: "cover",
                  maxHeight: "500px",
                }}
              />
            )}

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={async () => {
                  try {
                    await fetch(
                      "/api/like",
                      {
                        method: "POST",

                        headers: {
                          "Content-Type":
                            "application/json",
                        },

                        body: JSON.stringify(
  {
    postId:
      post.postId,

    userId:
      user.userId,
  }
),
                      }
                    )

                    fetchPosts(user)
                  } catch (error) {
                    console.error(error)
                  }
                }}
                style={{
                  padding:
                    "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor:
                    "black",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Like (
                {post.likes || 0})
              </button>

              {user.userId ===
                post.userId && (
                <button
                  onClick={async () => {
                    try {
                      await fetch(
                        "/api/posts",
                        {
                          method:
                            "DELETE",

                          headers: {
                            "Content-Type":
                              "application/json",
                          },

                          body: JSON.stringify({
  postId: post.postId,
  userId: user.userId,
}),
                        }
                      )

                      fetchPosts(user)
                    } catch (error) {
                      console.error(
                        error
                      )
                    }
                  }}
                  style={{
                    padding:
                      "10px 16px",
                    borderRadius:
                      "8px",
                    border: "none",
                    backgroundColor:
                      "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    fontWeight:
                      "bold",
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            {/* COMMENTS */}
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <input
                placeholder="Write a comment..."
                onKeyDown={async (
                  e
                ) => {
                  if (
                    e.key !== "Enter"
                  )
                    return

                  const text =
                    e.currentTarget
                      .value

                  if (
                    !text.trim()
                  )
                    return

                  try {
                    const input =
                      e.currentTarget

                    await fetch(
                      "/api/comments",
                      {
                        method:
                          "POST",

                        headers: {
                          "Content-Type":
                            "application/json",
                        },

                        body: JSON.stringify(
                          {
                            postId:
                              post.postId,
                            userId:
                              user.userId,
                            username:
                              user.username,
                            text,
                          }
                        ),
                      }
                    )

                    input.value = ""

                    fetchPosts(user)
                  } catch (error) {
                    console.error(
                      error
                    )
                  }
                }}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  borderRadius: "8px",
                  border:
                    "1px solid #d1d5db",
                }}
              />

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                {(Array.isArray(
                  comments[
                    post.postId
                  ]
                )
                  ? comments[
                      post.postId
                    ]
                  : []
                ).map(
                  (comment) => (
                    <div
                      key={
                        comment.commentId
                      }
                      style={{
                        marginBottom:
                          "10px",
                        backgroundColor:
                          "#f9fafb",
                        padding:
                          "10px",
                        borderRadius:
                          "8px",
                      }}
                    >
                      <strong>
                        {
                          comment.username
                        }
                      </strong>

                      :{" "}
                      {
                        comment.text
                      }
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}