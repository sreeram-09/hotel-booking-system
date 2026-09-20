import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Room from "@/models/Room"

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {
  try {
    const { id } = await context.params

    await connectDB()

    const room = await Room.findById(id)

    if (!room) {
      return NextResponse.json(
        {
          message: "Room not found"
        },
        {
          status: 404
        }
      )
    }

    return NextResponse.json(room)
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch room"
      },
      {
        status: 500
      }
    )
  }
}