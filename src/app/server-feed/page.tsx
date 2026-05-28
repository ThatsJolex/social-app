/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic"

import Navbar from "@/components/Navbar"

import { getAllPosts } from "@/lib/posts"

export default async function ServerFeedPage() {

  const posts = await getAllPosts()

  const sortedPosts = posts.sort(
    (a, b) => b.createdAt - a.createdAt
  )

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
          marginBottom: "10px",
        }}
      >
        Server Rendered Feed
      </h1>

      <p
        style={{
          marginBottom: "25px",
          color: "#6b7280",
        }}
      >
        These posts were fetched on the server.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {sortedPosts.map((post: any) => (
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
            <h3
              style={{
                marginBottom: "10px",
                color: "#2563eb",
              }}
            >
              {post.username}
            </h3>

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

            <p
              style={{
                marginTop: "15px",
                color: "#6b7280",
              }}
            >
              ❤️ {post.likes || 0} likes
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}