import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-[#1A1A1A]">404</h1>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Page Not Found</h2>
          <p className="text-lg text-[#6B6B6B] text-pretty">
            {"We couldn't find the page you're looking for. It might have been moved or doesn't exist."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#1A1A1A] hover:bg-[#B8860B] text-white">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-[#6B6B6B]">
            Need help?{" "}
            <Link href="#" className="text-[#B8860B] hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
