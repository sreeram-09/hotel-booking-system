import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import Room from "@/models/Room"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    await connectDB()

    const { id } = await params

    const hotel = await Hotel.findById(id).lean()

    if (!hotel) {
      return NextResponse.json(
        {
          message: "Hotel not found"
        },
        {
          status: 404
        }
      )
    }

    const rooms = await Room.find({
      hotelId: hotel._id
    })
      .sort({
        price: 1
      })
      .lean()

    return NextResponse.json({
      hotel: {
        ...hotel,
        _id: hotel._id.toString()
      },
      rooms: rooms.map((room) => ({
        ...room,
        _id: room._id.toString(),
        hotelId: room.hotelId.toString()
      }))
    })
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch hotel"
      },
      {
        status: 500
      }
    )
  }
}