import Link from "next/link"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import Room from "@/models/Room"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function HotelDetailsPage({ params }: Props) {
  await connectDB()

  const { id } = await params

  const hotel = await Hotel.findById(id).lean()

  if (!hotel) {
    notFound()
  }

  const rooms = await Room.find({
    hotelId: hotel._id
  })
    .sort({ price: 1 })
    .lean()

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/hotels"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Hotels
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="h-[420px] w-full object-cover"
          />

          <div className="p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  {hotel.propertyType}
                </p>

                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                  {hotel.name}
                </h1>

                <p className="mt-2 text-slate-600">
                  {hotel.city}, {hotel.state}
                </p>

                <p className="mt-2 text-slate-600">
                  {hotel.address}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 px-5 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ★ {hotel.rating}
                </div>
                <div className="text-sm text-slate-600">
                  Guest Rating
                </div>
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-700">
              {hotel.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Check-in</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {hotel.checkInTime}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Check-out</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {hotel.checkOutTime}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Starting Price</p>
                <p className="mt-1 font-semibold text-slate-900">
                  ₹{hotel.price}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Rooms</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {rooms.length}
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Amenities
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {(hotel.amenities || []).map((amenity: string) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Available Rooms
              </h2>

              <div className="mt-5 space-y-5">
                {rooms.map((room: any) => (
                  <div
                    key={room._id.toString()}
                    className="rounded-2xl border border-slate-200 p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {room.roomType}
                        </h3>

                        <p className="mt-2 text-slate-600">
                          Room {room.roomNumber} · {room.bedType}
                        </p>

                        <p className="mt-1 text-slate-600">
                          Capacity: {room.capacity} guests · {room.size} sq ft
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(room.amenities || []).map((item: string) => (
                            <span
                              key={item}
                              className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ₹{room.price}
                        </p>

                        <p className="text-sm text-slate-500">
                          per night
                        </p>

                        {room.status === "available" ? (
                          <Link
                            href={`/hotels/${hotel._id.toString()}/book?roomId=${room._id.toString()}`}
                            className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                          >
                            Book Room
                          </Link>
                        ) : (
                          <span className="mt-4 inline-block rounded-xl bg-red-100 px-6 py-3 font-semibold text-red-700">
                            {room.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Hotel Policies
              </h2>

              <ul className="mt-4 space-y-2">
                {(hotel.policies || []).map((policy: string) => (
                  <li
                    key={policy}
                    className="text-slate-700"
                  >
                    • {policy}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
