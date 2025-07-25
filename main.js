// Main JavaScript for QPin Website
// Initialize 3D Model Viewer
const initModelViewer = () => {
  const container = document.getElementById('model-container');
  const loading = document.getElementById('loading');
  
  if (!container) return;
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x525252);
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Add orbit controls with smooth horizontal rotation
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  // Basic settings
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enableZoom = true;
  controls.enablePan = false;
  
  // Camera distance constraints
  controls.minDistance = 2;
  controls.maxDistance = 8;
  
  // Rotation settings
  controls.rotateSpeed = 1.0;
  controls.screenSpacePanning = true; // Better for horizontal dragging
  
  // Remove all rotation constraints
  controls.minPolarAngle = 0; // Allow looking from top
  controls.maxPolarAngle = Math.PI; // Allow looking from bottom
  controls.minAzimuthAngle = -Infinity; // No limit on horizontal rotation
  controls.maxAzimuthAngle = Infinity; // No limit on horizontal rotation
  
  // Make the target point at the center of the model
  controls.target.set(0, 0, 0);
  
  // Disable vertical rotation with right-click if needed
  // controls.mouseButtons = {
  //   LEFT: THREE.MOUSE.ROTATE,
  //   MIDDLE: THREE.MOUSE.DOLLY,
  //   RIGHT: THREE.MOUSE.PAN
  // };
  
  // Load 3D model
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('images/');
  
  mtlLoader.load('centeredPin.mtl', (materials) => {
    materials.preload();
    
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('images/');
    
    objLoader.load('centeredPin.obj', (object) => {
      // Center the model
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.x = -center.x;
      object.position.y = -center.y;
      object.position.z = -center.z;
      
      // Scale the model to a reasonable size
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 3.0 / size;
      object.scale.set(scale, scale, scale);
      
      // Set initial rotation (in radians)
      // Rotation order: X, Y, Z
      object.rotation.x = 180;  // Tilt up/down (0 = level)
      object.rotation.y = 0;  // Rotate left/right (0 = front view)
      object.rotation.z = 0;  // Tilt left/right (0 = level)
      
      // Add the object to the scene
      scene.add(object);
      
      // Update camera position based on the initial rotation
      camera.position.set(0, 0, 5);  // Adjust these values to change the starting view
      camera.lookAt(0, 0, 0);
      
      // Update controls target and position
      controls.target.set(0, 0, 0);
      controls.update();
      
      // Hide loading text
      if (loading) {
        loading.style.display = 'none';
      }
      
      // Log current rotation for debugging
      console.log('Initial rotation:', {
        x: THREE.MathUtils.radToDeg(object.rotation.x).toFixed(1) + '°',
        y: THREE.MathUtils.radToDeg(object.rotation.y).toFixed(1) + '°',
        z: THREE.MathUtils.radToDeg(object.rotation.z).toFixed(1) + '°'
      });
      
      // Start animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Handle window resize
      const onWindowResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      
      window.addEventListener('resize', onWindowResize);
      
    }, undefined, (error) => {
      console.error('An error occurred loading the 3D model:', error);
      if (loading) {
        loading.textContent = 'Error loading 3D model';
      }
    });
  }, undefined, (error) => {
    console.error('An error occurred loading materials:', error);
    if (loading) {
      loading.textContent = 'Error loading materials';
    }
  });
};

// Contact Popup Functionality
function initContactPopup() {
  const contactLink = document.getElementById('contactLink');
  const contactPopup = document.getElementById('contactPopup');
  const closePopup = document.querySelector('.close-popup');

  if (!contactLink || !contactPopup) return;

  // Open popup when clicking contact link
  contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    contactPopup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
  });

  // Close popup when clicking close button
  closePopup.addEventListener('click', function() {
    contactPopup.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  });

  // Close popup when clicking outside the content
  contactPopup.addEventListener('click', function(e) {
    if (e.target === contactPopup) {
      contactPopup.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  });

  // Close popup when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactPopup.classList.contains('active')) {
      contactPopup.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize 3D model viewer
  initModelViewer();
  
  // Initialize carousels
  const initTestimonialCarousel = () => {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 10000; // 10 seconds

    // Show current slide
    const showSlide = (index) => {
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Show current slide and update dot
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    };

    // Next slide
    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    // Previous slide
    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    // Start auto-rotation
    const startAutoRotate = () => {
      slideInterval = setInterval(nextSlide, slideDuration);
    };

    // Stop auto-rotation
    const stopAutoRotate = () => {
      clearInterval(slideInterval);
    };

    // Event Listeners
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoRotate();
        startAutoRotate();
      });

      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoRotate();
        startAutoRotate();
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoRotate();
        startAutoRotate();
      });
    });

    // Pause auto-rotation on hover
    if (track) {
      track.addEventListener('mouseenter', stopAutoRotate);
      track.addEventListener('mouseleave', startAutoRotate);
    }

    // Initialize
    showSlide(0);
    startAutoRotate();
  };

  // Initialize the carousel if it exists on the page
  if (document.querySelector('.testimonial-carousel')) {
    initTestimonialCarousel();
  }
  // Navbar scroll behavior
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        // At top of page, show navbar
        navbar.classList.remove('scroll-up');
        return;
      }
      
      if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scrolling down, hide navbar
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scrolling up, show navbar
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // Initialize About Carousel (using same logic as testimonial carousel)
  const initAboutCarousel = () => {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds

    // Show current slide
    const showSlide = (index) => {
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Show current slide and update dot
      if (slides[index]) slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      currentSlide = index;
    };

    // Next slide
    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    // Previous slide
    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    // Start auto-rotation
    const startAutoRotate = () => {
      slideInterval = setInterval(nextSlide, slideDuration);
    };

    // Stop auto-rotation
    const stopAutoRotate = () => {
      clearInterval(slideInterval);
    };

    // Event Listeners
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoRotate();
        startAutoRotate();
      });

      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoRotate();
        startAutoRotate();
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoRotate();
        startAutoRotate();
      });
    });

    // Pause auto-rotation on hover
    if (track) {
      track.addEventListener('mouseenter', stopAutoRotate);
      track.addEventListener('mouseleave', startAutoRotate);
    }

    // Initialize
    showSlide(0);
    startAutoRotate();
  };

  // Initialize about carousel if it exists
  if (document.querySelector('.about-carousel')) {
    initAboutCarousel();
  }
  
  // Initialize contact popup
  initContactPopup();
  
  // Old carousel initialization function removed - using initAboutCarousel instead
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        const ans = faq.querySelector('.faq-answer');
        if (ans) {
          ans.style.maxHeight = '0';
        }
      });
      
      // Toggle current item if it wasn't open
      if (!isOpen) {
        item.classList.add('active');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn, .nav-links a');
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });

  function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Handle pre-order button click
  const preOrderButtons = document.querySelectorAll('.btn-primary');
  preOrderButtons.forEach(button => {
    button.addEventListener('click', handlePreOrder);
  });

  // Intersection Observer for animations
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1
  });

  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.feature-card, .faq-item');
  animateElements.forEach(element => {
    observer.observe(element);
  });
});

// Handle pre-order form submission
function handlePreOrder(e) {
  e.preventDefault();
  
  // Show loading state
  const button = e.currentTarget;
  const originalText = button.textContent;
  button.textContent = 'Processing...';
  button.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Show success message
    alert('Thank you for your pre-order! We\'ll be in touch soon with more details.');
    
    // Reset button
    button.textContent = originalText;
    button.disabled = false;
  }, 1500);
}

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
