export type User = {
  userId: string
  username: string
  email: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedUser =
    localStorage.getItem("user")

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem("user")
}