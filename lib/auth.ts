import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = process.env.AUTH_SECRET

if (!secret) {
  throw new Error("AUTH_SECRET is not defined")
}

const secretKey = new TextEncoder().encode(secret)

export async function createToken(
  userId: string,
  role: string
) {
  return await new SignJWT({
    userId,
    role
  })
    .setProtectedHeader({
      alg: "HS256"
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    )

    return payload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()

  const token =
    cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}