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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHotels()
  }, [])

  async function loadHotels() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/hotels")
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to load hotels")
        return
      }

      if (Array.isArray(data.hotels)) {
        setHotels(data.hotels)
      } else {
        setHotels([])
      }
    } catch {
      setError("Unable to connect to the server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-700 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-widest text-blue-200">
            HOTEL BOOKING SYSTEM
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Explore Hotels
          </h1>

          <p className="mt-3 text-lg text-blue-100">
            Find comfortable stays across India
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
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

            <button
              onClick={loadHotels}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && error === "" && hotels.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No hotels found
            </h2>

            <p className="mt-2 text-slate-600">
              No hotels are currently available.
            </p>
          </div>
        )}

        {!loading && error === "" && hotels.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Available Hotels
              </h2>

              <p className="mt-2 text-slate-600">
                {hotels.length} hotels available
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
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
                        {hotel.rating} ?
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

                    {hotel.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                        {hotel.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-sm text-slate-500">
                          Starting from
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                          ?{hotel.price}
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
          </>
        )}
      </section>
    </main>
  )
}
