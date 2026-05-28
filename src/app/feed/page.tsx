import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

type Post = {
  postId: string
  userId: string
  username: string
  content: string
  imageUrl?: string
  createdAt: number
  likes?: number
}

async function getPosts(): Promise<Post[]> {

  const data = await dynamodb.send(
    new ScanCommand({
      TableName: "Posts",
    })
  )

  const posts =
    (data.Items as Post[]) || []

  return posts.sort(
    (a, b) =>
      b.createdAt - a.createdAt
  )
}

export default async function FeedPage() {

  const posts = await getPosts()

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
      }}
    >
      <h1>Server Rendered Feed</h1>

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

            <p>
              Likes: {post.likes || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}