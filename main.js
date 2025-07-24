// Main JavaScript for QPin Website
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Testimonial Carousel
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
  
  // Initialize carousel
  const initCarousel = () => {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;

    const slides = document.querySelectorAll('.carousel-image:not([style*="display: none"])'); // Only count visible slides
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    
    // Clear existing dots and create new ones based on visible slides
    if (dotsContainer) {
      dotsContainer.innerHTML = ''; // Clear existing dots
      
      // Create dots based on number of visible slides
      for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.slide = i;
        dotsContainer.appendChild(dot);
      }
    }
    
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Show current slide
    const showSlide = (index) => {
      // Ensure index is within bounds
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      
      // Hide all slides and remove active class from dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Show current slide and update dot
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      currentSlide = index;
    };

    // Next slide
    const nextSlide = () => {
      showSlide((currentSlide + 1) % totalSlides);
    };

    // Previous slide
    const prevSlide = () => {
      showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    };

    // Navigation buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    // Dot navigation
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (!dot) return;
        
        const index = parseInt(dot.dataset.slide, 10);
        if (!isNaN(index)) {
          showSlide(index);
        }
      });
    }

    // Initialize
    showSlide(0);
    
    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    });
  };

  // Initialize carousel
  initCarousel();
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
