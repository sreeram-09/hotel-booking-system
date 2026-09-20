import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import Room from "@/models/Room"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")?.trim()
    const city = searchParams.get("city")?.trim()
    const state = searchParams.get("state")?.trim()
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const propertyType = searchParams.get("propertyType")

    const filter: any = {}

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          city: {
            $regex: search,
            $options: "i"
          }
        },
        {
          state: {
            $regex: search,
            $options: "i"
          }
        }
      ]
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i"
      }
    }

    if (state) {
      filter.state = {
        $regex: state,
        $options: "i"
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {}

      if (minPrice) {
        filter.price.$gte = Number(minPrice)
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice)
      }
    }

    if (minRating) {
      filter.rating = {
        $gte: Number(minRating)
      }
    }

    if (propertyType) {
      filter.propertyType = propertyType
    }

    const hotels = await Hotel.find(filter).sort({
      rating: -1,
      price: 1
    })

    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({
          hotelId: hotel._id
        }).sort({
          price: 1
        })

        const availableRooms = rooms.filter(
          (room) => room.status === "available"
        )

        const lowestRoomPrice =
          rooms.length > 0
            ? Math.min(
                ...rooms.map((room) => room.price)
              )
            : hotel.price

        return {
          ...hotel.toObject(),
          totalRooms: rooms.length,
          availableRooms: availableRooms.length,
          lowestRoomPrice
        }
      })
    )

    return NextResponse.json({
      count: hotelsWithRooms.length,
      hotels: hotelsWithRooms
    })
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch hotels"
      },
      {
        status: 500
      }
    )
  }
}