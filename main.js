// Main JavaScript for QPin Website
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel
  const initCarousel = () => {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;

    const slides = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

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
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
      });
    });

    // Initialize
    showSlide(0);
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
