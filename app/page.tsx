
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function loadHotels() {
      try {
        const response = await fetch("/api/hotels")
        const data = await response.json()
        setHotels(data.hotels || [])
      } catch {
        setHotels([])
      } finally {
        setLoading(false)
      }
    }

    loadHotels()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (search.trim()) params.set("search", search.trim())
    if (city.trim()) params.set("city", city.trim())
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)

    params.set("guests", guests)

    router.push(`/hotels?${params.toString()}`)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <main className="min-h-screen bg-slate-50">

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            onClick={closeMenu}
            className="text-2xl font-bold text-blue-700"
          >
            HotelBook
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/hotels"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              Hotels
            </Link>

            <Link
              href="/bookings"
              className="font-semibold text-blue-700 hover:text-blue-900"
            >
              My Bookings
            </Link>

            <Link
              href="/login"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-2xl text-slate-900 md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">

            <div className="flex flex-col gap-2">

              <Link
                href="/"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-slate-900 hover:bg-slate-100"
              >
                Home
              </Link>

              <Link
                href="/hotels"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-slate-900 hover:bg-slate-100"
              >
                Hotels
              </Link>

              <Link
                href="/bookings"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50"
              >
                My Bookings
              </Link>

              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-slate-900 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Register
              </Link>

            </div>
          </div>
        )}
      </nav>

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            Hotel Booking System
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-6xl">
            Find your perfect stay across India
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            Search hotels, resorts, villas and rooms in your favorite destinations.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 rounded-2xl bg-white p-5 shadow-2xl"
          >

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search Hotel
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Hotel or location"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end">

              <div className="w-full md:w-48">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Guests
                </label>

                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7 Guests</option>
                  <option value="8">8 Guests</option>
                  <option value="9">9 Guests</option>
                  <option value="10">10 Guests</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 md:w-auto"
              >
                🔍 Search Hotels
              </button>

            </div>

          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Hotels
            </h2>

            <p className="mt-2 text-slate-600">
              Discover our available properties.
            </p>
          </div>

          <Link
            href="/hotels"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            View All Hotels →
          </Link>

        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-lg text-slate-700">
              Loading hotels...
            </p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              No hotels found
            </h3>

            <Link
              href="/hotels"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <img
                  src={hotel.image || "/hotels/default.jpg"}
                  alt={hotel.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {hotel.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {hotel.city}, {hotel.state}
                      </p>
                    </div>

                    <span className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700">
                      ★ {hotel.rating}
                    </span>

                  </div>

                  <p className="mt-3 font-medium text-blue-600">
                    {hotel.propertyType}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    ₹{hotel.price.toLocaleString("en-IN")}
                    <span className="ml-1 text-sm font-normal text-slate-500">
                      / night
                    </span>
                  </p>

                </div>

              </Link>
            ))}

          </div>
        )}

      </section>

      <section className="border-t bg-white px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-slate-50 p-6">
            <div className="text-3xl">🏨</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              100+ Hotels
            </h3>
            <p className="mt-2 text-slate-600">
              Explore hotels across multiple cities.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-6">
            <div className="text-3xl">🔒</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Secure Booking
            </h3>
            <p className="mt-2 text-slate-600">
              Your booking information is securely stored.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-6">
            <div className="text-3xl">📋</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Easy Management
            </h3>
            <p className="mt-2 text-slate-600">
              Manage your bookings from My Bookings.
            </p>
          </div>

        </div>
      </section>

      <footer className="bg-slate-900 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <h3 className="text-xl font-bold">
            HotelBook
          </h3>

          <div className="flex flex-wrap gap-6">
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

