/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic"
import { getAllPosts } from "@/lib/posts"

export default async function ServerFeedPage() {

  //
  // SERVER SIDE DATA FETCHING
  //
  const posts = await getAllPosts()

  //
  // SORT POSTS
  //
  const sortedPosts = posts.sort(
    (a, b) => b.createdAt - a.createdAt
  )

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
      }}
    >
      <h1>Server Rendered Feed</h1>

      <p>
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