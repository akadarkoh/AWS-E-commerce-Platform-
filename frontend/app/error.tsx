"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">Oops!</h1>
          <p className="text-xl text-[#6B6B6B]">Something went wrong</p>
          <p className="text-sm text-[#6B6B6B]">
            {"We're sorry, but an error occurred while processing your request."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} className="bg-[#1A1A1A] hover:bg-[#B8860B] text-white">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>

        <div className="pt-8 border-t border-[#E5E5E5]">
          <p className="text-xs text-[#6B6B6B]">
            If this problem persists, please contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
