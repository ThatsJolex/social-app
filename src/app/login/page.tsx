"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
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

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      router.push("/feed")

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
          Welcome Back
        </h1>

        <p className="page-subtitle">
          Login to continue
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
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
            onClick={handleLogin}
            disabled={loading}
            className="primary-button"
          >
            {loading
              ? "Logging in..."
              : "Login"}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}