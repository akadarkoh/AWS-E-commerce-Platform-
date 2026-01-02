"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const products = [
  { id: 1, name: "Modern Lounge Chair", price: 599, category: "Furniture", image: "/modern-minimalist-lounge-chair.jpg" },
  { id: 2, name: "Ceramic Vase Set", price: 89, category: "Decor", image: "/elegant-ceramic-vase-set.jpg" },
  { id: 3, name: "Arc Floor Lamp", price: 349, category: "Lighting", image: "/modern-arc-floor-lamp.jpg" },
  { id: 4, name: "Plush Velvet Sofa", price: 1299, category: "Furniture", image: "/plush-velvet-sofa.jpg" },
  { id: 5, name: "Abstract Wall Art", price: 249, category: "Decor", image: "/abstract-wall-art.png" },
  { id: 6, name: "Elegant Pendant Light", price: 199, category: "Lighting", image: "/elegant-pendant-light.jpg" },
  { id: 7, name: "Minimalist Coffee Table", price: 449, category: "Furniture", image: "/minimalist-coffee-table.png" },
  { id: 8, name: "Decorative Mirror", price: 179, category: "Decor", image: "/decorative-round-mirror.webp" },
]

export default function EcommercePage() {
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [email, setEmail] = useState("")
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: (typeof products)[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1A1A1A] text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-5">
          Added to cart!
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-[#1A1A1A]">LUXE</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B] transition-colors">
                  Shop
                </a>
                <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B] transition-colors">
                  Collections
                </a>
                <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B] transition-colors">
                  About
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#B8860B] text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5E5] bg-white">
            <nav className="flex flex-col gap-4 px-4 py-4">
              <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B]">
                Shop
              </a>
              <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B]">
                Collections
              </a>
              <a href="#" className="text-[#1A1A1A] hover:text-[#B8860B]">
                About
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
                <h2 className="text-xl font-bold text-[#1A1A1A]">Shopping Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <p className="text-[#6B6B6B] text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-[#FAFAF9] rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1A1A1A]">{item.name}</h3>
                          <p className="text-[#B8860B] font-medium">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                              -
                            </Button>
                            <span className="text-[#1A1A1A] w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                              +
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-[#E5E5E5] p-6 space-y-4">
                  <div className="flex justify-between text-lg font-bold text-[#1A1A1A]">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                  <Button className="w-full bg-[#1A1A1A] hover:bg-[#B8860B] text-white">Checkout</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-[#1A1A1A] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-balance">Elevate Your Space</h2>
            <p className="text-xl text-[#E5E5E5] text-pretty">
              Discover our curated collection of timeless furniture and décor pieces that transform your house into a
              home.
            </p>
            <Button size="lg" className="bg-[#B8860B] hover:bg-[#967210] text-white">
              Shop Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-[#E5E5E5] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {["All", "Furniture", "Decor", "Lighting"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-[#1A1A1A] hover:bg-[#2A2A2A]" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">{product.category}</p>
                    <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#B8860B]">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      className="bg-[#1A1A1A] hover:bg-[#B8860B] text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#1A1A1A] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">Stay in the Loop</h2>
          <p className="text-[#E5E5E5]">
            Subscribe to our newsletter for exclusive offers and interior design inspiration.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button className="bg-[#B8860B] hover:bg-[#967210] text-white">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-[#1A1A1A] mb-4">LUXE</h3>
              <p className="text-[#6B6B6B] text-sm">Premium furniture and décor for modern living.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Furniture
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Lighting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Décor
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#B8860B]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E5E5E5] text-center text-sm text-[#6B6B6B]">
            © 2026 LUXE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
