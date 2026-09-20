import { Suspense } from "react"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-900">
              Loading login...
            </p>
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
