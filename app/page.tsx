"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Hotel = {
  _id: string
  name: string
  city: string
  state: string
  rating: number
  price: number
  image: string
  propertyType: string
}

export default function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => setHotels(data.hotels || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            HotelBook
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="font-medium text-slate-900 hover:text-blue-600">
              Home
            </Link>

            <Link href="/hotels" className="font-medium text-slate-900 hover:text-blue-600">
              Hotels
            </Link>

            <Link href="/bookings" className="font-semibold text-blue-700 hover:text-blue-900">
              My Bookings
            </Link>

            <Link href="/login" className="font-medium text-slate-900 hover:text-blue-600">
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
            Hotel Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">
            Find the perfect hotel for your next stay
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            Discover hotels, resorts, villas and comfortable rooms across India.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/hotels"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700"
            >
              Explore Hotels
            </Link>

            <Link
              href="/bookings"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Hotels
            </h2>
            <p className="mt-2 text-slate-600">
              Discover our available properties.
            </p>
          </div>

          <Link href="/hotels" className="font-semibold text-blue-600">
            View All Hotels →
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center text-slate-700">
            Loading hotels...
          </p>
        ) : hotels.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h3 className="text-xl font-bold text-slate-900">
              No hotels found
            </h3>

            <Link
              href="/hotels"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.slice(0, 6).map((hotel) => (
              <Link
                key={hotel._id}
                href={`/hotels/${hotel._id}`}
                className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-lg"
              >
                <img
                  src={hotel.image || "/hotels/default.jpg"}
                  alt={hotel.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {hotel.name}
                      </h3>

                      <p className="text-sm text-slate-600">
                        {hotel.city}, {hotel.state}
                      </p>
                    </div>

                    <span className="rounded bg-green-100 px-2 py-1 font-bold text-green-700">
                      ★ {hotel.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-blue-600">
                    {hotel.propertyType}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    ₹{hotel.price.toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}/ night
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-slate-900 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h3 className="text-xl font-bold">HotelBook</h3>

          <div className="flex gap-6">
            <Link href="/hotels" className="text-slate-300 hover:text-white">
              Hotels
            </Link>

            <Link href="/bookings" className="text-slate-300 hover:text-white">
              My Bookings
            </Link>

            <Link href="/login" className="text-slate-300 hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}