import { NextRequest, NextResponse } from "next/server"

export function middleware(
request: NextRequest
) {
const userCookie =
request.cookies.get("user")

const protectedRoutes = [
"/feed",
"/discover",
"/server-feed",
"/users",
"/profile",
]

const isProtectedRoute =
protectedRoutes.some((route) =>
request.nextUrl.pathname.startsWith(
route
)
)

//
// NOT LOGGED IN
//
if (
isProtectedRoute &&
!userCookie
) {
return NextResponse.redirect(
new URL(
"/login",
request.url
)
)
}

return NextResponse.next()
}

export const config = {
matcher: [
"/feed/:path*",
"/discover/:path*",
"/server-feed/:path*",
"/users/:path*",
"/profile/:path*",
],
}
