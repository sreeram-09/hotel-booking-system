import { Suspense } from "react"
import RegisterClient from "./RegisterClient"

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-900">
              Loading registration...
            </p>
          </div>
        </main>
      }
    >
      <RegisterClient />
    </Suspense>
  )
}
