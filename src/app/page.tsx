import Link from "next/link"

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="card">
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "14px",
          }}
        >
          Social App
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Share posts and connect
          with people.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Link href="/login">
            <button className="primary-button">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="secondary-button">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}