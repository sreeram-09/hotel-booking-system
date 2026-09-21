import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import Room from "@/models/Room"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const city = searchParams.get("city") || ""
    const state = searchParams.get("state") || ""
    const minPrice = Number(searchParams.get("minPrice") || 0)
    const maxPrice = Number(searchParams.get("maxPrice") || 0)
    const minRating = Number(searchParams.get("minRating") || 0)
    const propertyType = searchParams.get("propertyType") || ""

    const filter: any = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ]
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" }
    }

    if (state) {
      filter.state = { $regex: state, $options: "i" }
    }

    if (minPrice > 0 || maxPrice > 0) {
      filter.price = {}

      if (minPrice > 0) {
        filter.price.$gte = minPrice
      }

      if (maxPrice > 0) {
        filter.price.$lte = maxPrice
      }
    }

    if (minRating > 0) {
      filter.rating = { $gte: minRating }
    }

    if (propertyType) {
      filter.propertyType = propertyType
    }

    const hotels = await Hotel.find(filter)
      .sort({
        rating: -1,
        price: 1
      })
      .lean()

    const result = await Promise.all(
      hotels.map(async (hotel: any) => {
        const rooms = await Room.find({
          hotelId: hotel._id
        })
          .select("price status")
          .lean()

        const availableRooms = rooms.filter(
          (room: any) => room.status === "available"
        )

        const prices = rooms
          .map((room: any) => Number(room.price))
          .filter((price: number) => !Number.isNaN(price))

        return {
          ...hotel,
          _id: hotel._id.toString(),
          totalRooms: rooms.length,
          availableRooms: availableRooms.length,
          lowestRoomPrice:
            prices.length > 0
              ? Math.min(...prices)
              : hotel.price
        }
      })
    )

    return NextResponse.json({
      count: result.length,
      hotels: result
    })
  } catch (error) {
    console.error("HOTELS API ERROR:", error)

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