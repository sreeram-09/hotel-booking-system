import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const phone = String(body.phone || "").trim()
    const password = String(body.password || "")

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least 6 characters"
        },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({
      email
    })

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email is already registered"
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    )

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user"
    })

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    )
  }
}