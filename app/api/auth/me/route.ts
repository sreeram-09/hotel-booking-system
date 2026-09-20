import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getCurrentUser()

    if (!session?.userId) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(
      session.userId
    )

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage
      }
    })
  } catch {
    return NextResponse.json(
      {
        message: "Failed to get current user"
      },
      { status: 500 }
    )
  }
}