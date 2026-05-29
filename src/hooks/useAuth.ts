/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  getCurrentUser,
  User,
} from "@/lib/auth"

export function useAuth() {
  const router = useRouter()

  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const currentUser =
      getCurrentUser()

    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router])

  return {
    user,
    loading,
  }
}