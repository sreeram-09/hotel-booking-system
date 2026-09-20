"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const hotelId = params.id as string
  const roomId = searchParams.get("roomId")

  const [hotel, setHotel] = useState<any>(null)
  const [room, setRoom] = useState<any>(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("pay_at_hotel")
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const meResponse = await fetch("/api/auth/me")

      if (meResponse.status === 401) {
        router.push(
          `/login?redirect=/hotels/${hotelId}/book?roomId=${roomId}`
        )
        return
      }

      const response = await fetch(`/api/hotels/${hotelId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to load hotel")
        return
      }

      setHotel(data.hotel)

      const selectedRoom = data.rooms.find(
        (item: any) => item._id === roomId
      )

      if (!selectedRoom) {
        setError("Selected room was not found")
        return
      }

      setRoom(selectedRoom)
    } catch {
      setError("Failed to load booking information")
    } finally {
      setLoading(false)
    }
  }

  function calculateNights() {
    if (!checkIn || !checkOut) {
      return 0
    }

    const start = new Date(checkIn)
    const end = new Date(checkOut)

    const difference =
      end.getTime() - start.getTime()

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }

  const nights = calculateNights()
  const subtotal = room && nights > 0
    ? room.price * nights
    : 0

  const tax = Math.round(subtotal * 0.12)
  const total = subtotal + tax

  async function handleBooking() {
    setError("")

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (nights <= 0) {
      setError("Check-out must be after check-in")
      return
    }

    if (guests < 1 || guests > room.capacity) {
      setError(
        `Guests must be between 1 and ${room.capacity}`
      )
      return
    }

    try {
      setBooking(true)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests,
          paymentMethod
        })
      })

      const data = await response.json()

      if (response.status === 401) {
        router.push(
          `/login?redirect=/hotels/${hotelId}/book?roomId=${roomId}`
        )
        return
      }

      if (!response.ok) {
        setError(data.message || "Booking failed")
        return
      }

      router.push("/bookings?success=true")
    } catch {
      setError("Unable to complete booking")
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-semibold text-slate-900">
            Loading booking details...
          </p>
        </div>
      </main>
    )
  }

  if (error && !hotel) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center">
          <p className="font-semibold text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 font-semibold text-blue-600"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-slate-900">
          Complete Your Booking
        </h1>

        <p className="mt-2 text-slate-600">
          Reserve your room at {hotel?.name}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Booking Details
            </h2>

            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Hotel
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {hotel?.name}
              </p>

              <p className="mt-1 text-slate-600">
                {hotel?.city}, {hotel?.state}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Room
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {room?.roomType} · Room {room?.roomNumber}
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="font-semibold text-slate-900">
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-900">
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="font-semibold text-slate-900">
                Number of Guests
              </label>

              <input
                type="number"
                min="1"
                max={room?.capacity || 1}
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              />

              <p className="mt-1 text-sm text-slate-500">
                Maximum {room?.capacity} guests
              </p>
            </div>

            <div className="mt-6">
              <label className="font-semibold text-slate-900">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              >
                <option value="pay_at_hotel">
                  Pay at Hotel
                </option>

                <option value="upi">
                  UPI
                </option>

                <option value="card">
                  Card
                </option>

                <option value="netbanking">
                  Net Banking
                </option>
              </select>
            </div>
          </div>

          <div className="h-fit rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Price Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>
                  ₹{room?.price} × {nights || 0} nights
                </span>

                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxes</span>
                <span>₹{tax}</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={booking}
              className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking
                ? "Confirming Booking..."
                : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}