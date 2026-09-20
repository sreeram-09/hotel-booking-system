import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const email = String(body.email || "")
      .trim()
      .toLowerCase()

    const password = String(body.password || "")

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required"
        },
        { status: 400 }
      )
    }

    const user = await User.findOne({
      email
    }).select("+password")

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password"
        },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!validPassword) {
      return NextResponse.json(
        {
          message: "Invalid email or password"
        },
        { status: 401 }
      )
    }

    const token = await createToken(
      user._id.toString(),
      user.role
    )

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })

    response.cookies.set(
      "auth_token",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      }
    )

    return response
  } catch {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    )
  }
}