import { Suspense } from "react"
import BookingsClient from "./BookingsClient"

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-900">
              Loading bookings...
            </p>
          </div>
        </main>
      }
    >
      <BookingsClient />
    </Suspense>
  )
}
