// Product Data
const products = [
  {
    id: 1,
    name: "Modern Lounge Chair",
    category: "furniture",
    price: 599,
    description: "Sleek contemporary seating with premium upholstery",
    image: "/public/modern-lounge-chair.png",
  },
  {
    id: 2,
    name: "Ceramic Vase Set",
    category: "decor",
    price: 89,
    description: "Handcrafted artisan pottery collection",
    image: "/public/ceramic-vase-set.png",
  },
  {
    id: 3,
    name: "Arc Floor Lamp",
    category: "lighting",
    price: 329,
    description: "Adjustable modern lighting fixture",
    image: "/public/arc-floor-lamp.jpg",
  },
  {
    id: 4,
    name: "Plush Velvet Sofa",
    category: "furniture",
    price: 1299,
    description: "Luxurious three-seater with deep cushioning",
    image: "/public/plush-velvet-sofa.png",
  },
  {
    id: 5,
    name: "Abstract Wall Art",
    category: "decor",
    price: 199,
    description: "Contemporary canvas print collection",
    image: "/public/abstract-wall-art.png",
  },
  {
    id: 6,
    name: "Elegant Pendant Light",
    category: "lighting",
    price: 249,
    description: "Minimalist hanging fixture with brass accents",
    image: "/public/elegant-pendant-light.png",
  },
  {
    id: 7,
    name: "Modern Coffee Table",
    category: "furniture",
    price: 449,
    description: "Marble top with geometric metal base",
    image: "/public/modern-coffee-table.png",
  },
  {
    id: 8,
    name: "Decorative Throw Pillows",
    category: "decor",
    price: 59,
    description: "Set of textured accent cushions",
    image: "/public/decorative-throw-pillows.png",
  },
]

// Cart State
let cart = []

// DOM Elements
const productsGrid = document.getElementById("productsGrid")
const cartBtn = document.getElementById("cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const cartOverlay = document.getElementById("cartOverlay")
const cartClose = document.getElementById("cartClose")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")
const cartTotal = document.getElementById("cartTotal")
const filterButtons = document.querySelectorAll(".filter-btn")
const menuToggle = document.getElementById("menuToggle")
const mainNav = document.getElementById("mainNav")
const newsletterForm = document.getElementById("newsletterForm")
const notification = document.getElementById("notification")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCart()
  renderProducts("all")
  setupEventListeners()
})

// Render Products
function renderProducts(category) {
  const filteredProducts = category === "all" ? products : products.filter((p) => p.category === category)

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Filter Products
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")
    const category = btn.dataset.category
    renderProducts(category)
  })
})

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  saveCart()
  updateCart()
  showNotification("Added to cart!")
}

// Update Quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart()
      updateCart()
    }
  }
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCart()
  showNotification("Removed from cart")
}

// Update Cart Display
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>'
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

// Cart Sidebar Controls
function openCart() {
  cartSidebar.classList.add("active")
  cartOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeCart() {
  cartSidebar.classList.remove("active")
  cartOverlay.classList.remove("active")
  document.body.style.overflow = ""
}

// Local Storage
function saveCart() {
  localStorage.setItem("luxeCart", JSON.stringify(cart))
}

function loadCart() {
  const savedCart = localStorage.getItem("luxeCart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCart()
  }
}

// Notification
function showNotification(message) {
  notification.textContent = message
  notification.classList.add("show")
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Setup Event Listeners
function setupEventListeners() {
  // Cart controls
  cartBtn.addEventListener("click", openCart)
  cartClose.addEventListener("click", closeCart)
  cartOverlay.addEventListener("click", closeCart)

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active")
    menuToggle.classList.toggle("active")
  })

  // Newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Thank you for subscribing!")
      newsletterForm.reset()
    })
  }

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
        // Close mobile menu if open
        mainNav.classList.remove("active")
      }
    })
  })

  // Close cart with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartSidebar.classList.contains("active")) {
      closeCart()
    }
  })

  // Header scroll effect
  let lastScroll = 0
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }

    lastScroll = currentScroll
  })
}
