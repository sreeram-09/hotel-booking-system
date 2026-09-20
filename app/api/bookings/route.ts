import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Room from "@/models/Room"
import User from "@/models/User"
import Offer from "@/models/Offer"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const session = await getCurrentUser()

    if (!session?.userId) {
      return NextResponse.json(
        {
          message: "Please login to view bookings"
        },
        {
          status: 401
        }
      )
    }

    const bookings = await Booking.find({
      userId: session.userId
    })
      .populate("hotelId")
      .populate("roomId")
      .sort({
        createdAt: -1
      })

    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch bookings"
      },
      {
        status: 500
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getCurrentUser()

    if (!session?.userId) {
      return NextResponse.json(
        {
          message: "Please login before booking a room"
        },
        {
          status: 401
        }
      )
    }

    const body = await request.json()

    if (
      !body.hotelId ||
      !body.roomId ||
      !body.checkIn ||
      !body.checkOut ||
      !body.guests
    ) {
      return NextResponse.json(
        {
          message: "Required booking information is missing"
        },
        {
          status: 400
        }
      )
    }

    const user = await User.findById(
      session.userId
    )

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found"
        },
        {
          status: 404
        }
      )
    }

    const room = await Room.findById(
      body.roomId
    )

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

    if (room.status !== "available") {
      return NextResponse.json(
        {
          message: "Room is not available"
        },
        {
          status: 400
        }
      )
    }

    if (
      Number(body.guests) > room.capacity
    ) {
      return NextResponse.json(
        {
          message: `This room can accommodate maximum ${room.capacity} guests`
        },
        {
          status: 400
        }
      )
    }

    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)

    if (
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime())
    ) {
      return NextResponse.json(
        {
          message: "Invalid booking dates"
        },
        {
          status: 400
        }
      )
    }

    const difference =
      checkOut.getTime() -
      checkIn.getTime()

    const nights = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    )

    if (nights <= 0) {
      return NextResponse.json(
        {
          message:
            "Check-out must be after check-in"
        },
        {
          status: 400
        }
      )
    }

    const roomPrice = room.price

    const subtotal =
      roomPrice * nights

    const taxRate = 0.12

    const taxAmount = Math.round(
      subtotal * taxRate
    )

    let discountAmount = 0
    let couponCode = ""

    if (body.couponCode) {
      const offer = await Offer.findOne({
        code: String(
          body.couponCode
        ).toUpperCase(),
        active: true,
        validFrom: {
          $lte: new Date()
        },
        validUntil: {
          $gte: new Date()
        }
      })

      if (
        offer &&
        subtotal >= offer.minimumAmount
      ) {
        couponCode = offer.code

        if (
          offer.discountType ===
          "percentage"
        ) {
          discountAmount =
            Math.round(
              subtotal *
                (offer.discountValue / 100)
            )

          if (
            offer.maximumDiscount > 0 &&
            discountAmount >
              offer.maximumDiscount
          ) {
            discountAmount =
              offer.maximumDiscount
          }
        } else {
          discountAmount =
            offer.discountValue
        }

        if (
          discountAmount > subtotal
        ) {
          discountAmount = subtotal
        }
      }
    }

    const totalAmount =
      subtotal +
      taxAmount -
      discountAmount

    const booking =
      await Booking.create({
        userId: session.userId,
        hotelId: body.hotelId,
        roomId: body.roomId,
        checkIn,
        checkOut,
        guests: Number(body.guests),
        nights,
        roomPrice,
        subtotal,
        taxAmount,
        discountAmount,
        couponCode,
        totalAmount,
        paymentMethod:
          body.paymentMethod ||
          "pay_at_hotel",
        paymentStatus: "pending",
        status: "confirmed"
      })

    await Room.findByIdAndUpdate(
      body.roomId,
      {
        status: "booked"
      }
    )

    return NextResponse.json(
      booking,
      {
        status: 201
      }
    )
  } catch {
    return NextResponse.json(
      {
        message: "Booking failed"
      },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB()

    const session = await getCurrentUser()

    if (!session?.userId) {
      return NextResponse.json(
        {
          message:
            "Please login to cancel a booking"
        },
        {
          status: 401
        }
      )
    }

    const { searchParams } =
      new URL(request.url)

    const id =
      searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          message:
            "Booking ID required"
        },
        {
          status: 400
        }
      )
    }

    const booking =
      await Booking.findOne({
        _id: id,
        userId: session.userId
      })

    if (!booking) {
      return NextResponse.json(
        {
          message:
            "Booking not found"
        },
        {
          status: 404
        }
      )
    }

    if (
      booking.status ===
      "cancelled"
    ) {
      return NextResponse.json(
        {
          message:
            "Booking is already cancelled"
        },
        {
          status: 400
        }
      )
    }

    booking.status = "cancelled"

    booking.cancelledAt =
      new Date()

    booking.cancellationReason =
      "Cancelled by user"

    if (
      booking.paymentStatus ===
      "paid"
    ) {
      booking.paymentStatus =
        "refunded"
    }

    await booking.save()

    await Room.findByIdAndUpdate(
      booking.roomId,
      {
        status: "available"
      }
    )

    return NextResponse.json({
      message:
        "Booking cancelled successfully"
    })
  } catch {
    return NextResponse.json(
      {
        message:
          "Cancellation failed"
      },
      {
        status: 500
      }
    )
  }
}