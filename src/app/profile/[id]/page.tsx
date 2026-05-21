/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamodb } from "@/lib/dynamodb"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProfilePage({
  params,
}: Props) {

  //
  // GET ID FROM URL
  //
  const { id } = await params

  //
  // GET ALL POSTS
  //
  const data = await dynamodb.send(
    new ScanCommand({
      TableName: "Posts",
    })
  )

  //
  // FILTER POSTS
  //
  const userPosts =
    data.Items?.filter(
      (post: any) =>
        post.userId === id
    ) || []

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
      }}
    >
      <h1>User Profile</h1>

      <p>User ID: {id}</p>

      <h2>User Posts</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {userPosts.map((post: any) => (
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