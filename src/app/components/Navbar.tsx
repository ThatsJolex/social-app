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
    <nav className="navbar">
      <div className="nav-content">
        <Link href="/feed">
          <h2>Social App</h2>
        </Link>

        <div className="nav-links">
          <Link
            href="/feed"
            className="nav-link"
          >
            Feed
          </Link>

          <Link
            href="/discover"
            className="nav-link"
          >
            Discover
          </Link>

          <Link
            href="/users"
            className="nav-link"
          >
            Users
          </Link>

          <button
            onClick={handleLogout}
            className="primary-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}