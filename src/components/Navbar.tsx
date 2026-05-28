"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "15px 20px",
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginBottom: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/feed">
          <button style={navButton}>
            Feed
          </button>
        </Link>

        <Link href="/discover">
          <button style={navButton}>
            Discover
          </button>
        </Link>

        <Link href="/users">
          <button style={navButton}>
            Users
          </button>
        </Link>

        <Link href="/server-feed">
          <button style={navButton}>
            Server Feed
          </button>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          ...navButton,
          backgroundColor: "#ef4444",
        }}
      >
        Logout
      </button>
    </div>
  )
}

const navButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "black",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
}