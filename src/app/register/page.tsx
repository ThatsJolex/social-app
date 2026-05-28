"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] = useState("")

  const handleRegister = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      router.push("/login")

    } catch (error) {
      console.error(error)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">
          Create Account
        </h1>

        <p className="page-subtitle">
          Join the social app
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="input"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="input"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="primary-button"
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>

          {error && (
            <p
              style={{
                color: "red",
              }}
            >
              {error}
            </p>
          )}

          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}