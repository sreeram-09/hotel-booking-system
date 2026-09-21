"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Booking = {
  _id: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  roomPrice: number
  subtotal: number
  taxAmount: number
  discountAmount: number
  couponCode: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  hotelId: {
    _id: string
    name: string
    city: string
    state: string
    image: string
    propertyType: string
    rating: number
  }
  roomId: {
    _id: string
    roomNumber: string
    roomType: string
    bedType: string
    capacity: number
  }
}

export default function BookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccess("Your booking was confirmed successfully.")
    }

    loadBookings()
  }, [searchParams])

  async function loadBookings() {
    try {
      setLoading(true)

      const response = await fetch("/api/bookings")

      if (response.status === 401) {
        router.push("/login?redirect=/bookings")
        return
      }

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to load bookings")
        return
      }

      setBookings(data)
    } catch {
      setError("Unable to connect to the server")
    } finally {
      setLoading(false)
    }
  }

  async function cancelBooking(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    )

    if (!confirmed) {
      return
    }

    try {
      setCancelling(id)
      setError("")
      setSuccess("")

      const response = await fetch(
        `/api/bookings?id=${id}`,
        {
          method: "DELETE"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Cancellation failed")
        return
      }

      setSuccess("Booking cancelled successfully.")

      await loadBookings()
    } catch {
      setError("Unable to cancel booking")
    } finally {
      setCancelling(null)
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  function formatPaymentMethod(method: string) {
    const names: Record<string, string> = {
      card: "Card",
      upi: "UPI",
      netbanking: "Net Banking",
      pay_at_hotel: "Pay at Hotel"
    }

    return names[method] || method
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg font-semibold text-slate-900">
            Loading your bookings...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            My Bookings
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage your hotel reservations.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">🏨</div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-slate-600">
              You have not made any hotel reservations.
            </p>

            <button
              onClick={() => router.push("/hotels")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="grid md:grid-cols-[280px_1fr]">
                  <img
                   src={booking.hotelId?.image || "/hotels/default.jpg"}
                   alt={booking.hotelId?.name || "Hotel"}
                    className="h-full min-h-[230px] w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">
                          {booking.hotelId.propertyType}
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-slate-900">
                          {booking.hotelId?.name || "Hotel"}
                        </h2>

                        <p className="mt-1 text-slate-600">
                          {booking.hotelId?.city || ""}, {booking.hotelId?.state || ""}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Check-in
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Check-out
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Guests
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.guests}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Nights
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.nights}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200 p-5">
                      <h3 className="font-bold text-slate-900">
                        Room Details
                      </h3>

                      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                        <p className="text-slate-700">
                          <span className="font-semibold">
                            Room:
                          </span>{" "}
                          {booking.roomId.roomNumber}
                        </p>

                        <p className="text-slate-700">
                          <span className="font-semibold">
                            Type:
                          </span>{" "}
                          {booking.roomId.roomType}
                        </p>

                        <p className="text-slate-700">
                          <span className="font-semibold">
                            Bed:
                          </span>{" "}
                          {booking.roomId.bedType}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Payment
                        </h3>

                        <div className="mt-3 space-y-2 text-sm">
                          <p className="text-slate-700">
                            Method:{" "}
                            <span className="font-semibold">
                              {formatPaymentMethod(
                                booking.paymentMethod
                              )}
                            </span>
                          </p>

                          <p className="text-slate-700">
                            Payment Status:{" "}
                            <span className="font-semibold">
                              {booking.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Price Summary
                        </h3>

                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>Room</span>
                            <span>₹{booking.subtotal}</span>
                          </div>

                          <div className="flex justify-between text-slate-600">
                            <span>Tax</span>
                            <span>₹{booking.taxAmount}</span>
                          </div>

                          {booking.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>
                                Discount
                                {booking.couponCode
                                  ? ` (${booking.couponCode})`
                                  : ""}
                              </span>

                              <span>
                                -₹{booking.discountAmount}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
                            <span>Total</span>
                            <span>
                              ₹{booking.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() =>
                            cancelBooking(booking._id)
                          }
                          disabled={
                            cancelling === booking._id
                          }
                          className="rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancelling === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}