// Import Three.js library
const THREE = window.THREE || require("three")

document.addEventListener("DOMContentLoaded", () => {
  // Initialize 3D models
  initModel("hero-model")
  initModel("about-model")
  initModel("product-model")

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Close mobile menu if open
        const navLinks = document.querySelector(".nav-links")
        const hamburger = document.querySelector(".hamburger")
        if (navLinks) navLinks.classList.remove("active")
        if (hamburger) hamburger.classList.remove("active")

        // Scroll to the target
        const navHeight = 80
        const targetPosition = targetElement.offsetTop - navHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Update URL without page jump
        history.pushState(null, null, targetId)
      }
    })
  })

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // FAQ accordion functionality
  const faqQuestions = document.querySelectorAll(".faq-question")

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentNode
      const isActive = faqItem.classList.contains("active")

      // Close all FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active")
      }
    })
  })

  // Enhanced navbar scroll effect
  let lastScroll = 0
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    if (currentScroll <= 0) {
      navbar.style.transform = "translateY(0)"
      navbar.style.boxShadow = "none"
      return
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll down - hide navbar
      navbar.style.transform = "translateY(-100%)"
    } else if (currentScroll < lastScroll) {
      // Scroll up - show navbar
      navbar.style.transform = "translateY(0)"
      navbar.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)"
    }

    lastScroll = currentScroll
  })

  // Pre-order button interactions
  const preOrderButtons = document.querySelectorAll(".cta-primary")
  preOrderButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Add ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)

      // Handle pre-order logic
      if (!this.getAttribute("href") || this.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        handlePreOrder()
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .faq-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

// 3D Model Initialization with enhanced visuals
function initModel(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  // Scene setup
  const scene = new THREE.Scene()

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 5)

  // Renderer setup with enhanced settings
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // Create QPin-like device
  const group = new THREE.Group()

  // Main body (rounded rectangle)
  const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 0.3)
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1f1f1f,
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.castShadow = true
  group.add(body)

  // Screen (glowing)
  const screenGeometry = new THREE.PlaneGeometry(1.6, 1.6)
  const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff33,
    transparent: true,
    opacity: 0.9,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.z = 0.16
  group.add(screen)

  // Pin attachment
  const pinGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5)
  const pinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.2,
  })
  const pin = new THREE.Mesh(pinGeometry, pinMaterial)
  pin.position.set(0, -1.5, -0.25)
  pin.rotation.x = Math.PI / 2
  group.add(pin)

  scene.add(group)

  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0xffff33, 0.5, 10)
  scene.add(pointLight)

  // Controls for product model
  let controls
  if (containerId === "product-model") {
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.0
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  }

  // Animation variables
  let time = 0

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
    time += 0.01

    // Rotate the group for hero and about models
    if (containerId !== "product-model") {
      group.rotation.y = Math.sin(time * 0.5) * 0.3
      group.rotation.x = Math.sin(time * 0.3) * 0.1
    }

    // Pulsing screen effect
    screen.material.opacity = 0.7 + Math.sin(time * 2) * 0.2

    // Update controls
    if (controls) {
      controls.update()
    }

    renderer.render(scene, camera)
  }

  // Handle window resize
  function onWindowResize() {
    const width = container.clientWidth
    const height = container.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  window.addEventListener("resize", onWindowResize, false)

  // Start animation
  animate()
}

// Pre-order handling
function handlePreOrder() {
  // Create modal or redirect to checkout
  const modal = document.createElement("div")
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `

  const content = document.createElement("div")
  content.style.cssText = `
        background: #1f1f1f;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        border: 1px solid #404040;
    `

  content.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #f1f1f1;">Pre-order Confirmed!</h3>
        <p style="margin-bottom: 1.5rem; color: #a3a3a3;">Thank you for your interest in QPin. We'll notify you when pre-orders are available.</p>
        <button onclick="this.closest('[style*=fixed]').remove()" style="
            background: #FFFF33;
            color: #1F1F1F;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
        ">Close</button>
    `

  modal.appendChild(content)
  document.body.appendChild(modal)

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

// Add ripple effect styles
const style = document.createElement("style")
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
