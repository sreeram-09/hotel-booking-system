
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
  propertyType?: string
  description?: string
}

export default function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHotels("")
  }, [])

  async function loadHotels(value: string) {
    try {
      setError("")

      let url = "/api/hotels"

      if (value.trim() !== "") {
        const encodedSearch = encodeURIComponent(value.trim())
        url = "/api/hotels?search=" + encodedSearch
      }

      const response = await fetch(url)

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to load hotels")
        setHotels([])
        return
      }

      if (Array.isArray(data.hotels)) {
        setHotels(data.hotels)
      } else if (Array.isArray(data)) {
        setHotels(data)
      } else {
        setHotels([])
      }
    } catch {
      setError("Unable to connect to the server")
      setHotels([])
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSearching(true)
    loadHotels(search)
  }

  function clearSearch() {
    setSearch("")
    setSearching(true)
    loadHotels("")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-700 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-widest text-blue-200">
            HOTEL BOOKING SYSTEM
          </p>

          <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">
            Find Your Perfect Stay
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Discover and book hotels across India
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search city or hotel name"
                className="flex-1 rounded-xl border border-slate-300 px-5 py-4 text-slate-900 outline-none focus:border-blue-600"
              />

              <button
                type="submit"
                disabled={searching}
                className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>

              {search !== "" && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-xl border border-slate-300 px-6 py-4 font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {search.trim() !== ""
              ? "Search Results"
              : "Available Hotels"}
          </h2>

          {search.trim() !== "" && (
            <p className="mt-2 text-slate-600">
              Results for: {search}
            </p>
          )}

          <p className="mt-2 text-slate-600">
            {hotels.length} hotels found
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="font-semibold text-slate-900">
              Loading hotels...
            </p>
          </div>
        )}

        {!loading && error !== "" && (
          <div className="rounded-2xl bg-red-50 p-6">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          error === "" &&
          hotels.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No hotels found
              </h3>

              <p className="mt-2 text-slate-600">
                Try another city or hotel name.
              </p>

              {search !== "" && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
                >
                  Show All Hotels
                </button>
              )}
            </div>
          )}

        {!loading &&
          error === "" &&
          hotels.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg"
                >
                  <div className="h-52 bg-slate-200">
                    {hotel.image ? (
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {hotel.name}
                      </h3>

                      <span className="rounded-lg bg-green-100 px-2 py-1 text-sm font-bold text-green-700">
                        {hotel.rating} ★
                      </span>
                    </div>

                    <p className="mt-2 text-slate-600">
                      {hotel.city}, {hotel.state}
                    </p>

                    {hotel.propertyType && (
                      <p className="mt-2 text-sm text-slate-500">
                        {hotel.propertyType}
                      </p>
                    )}

                    <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-sm text-slate-500">
                          Starting from
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                          ₹{hotel.price}
                        </p>

                        <p className="text-xs text-slate-500">
                          per night
                        </p>
                      </div>

                      <Link
                        href={"/hotels/" + hotel._id}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        View Hotel
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>
    </main>
  )
}

