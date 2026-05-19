/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FeedPage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Feed</h1>

      <p>Welcome {user.username}</p>

      <p>Your social network feed will appear here.</p>
    </div>
  )
}