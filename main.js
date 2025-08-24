const initModelViewer = () => {
  const container = document.getElementById('model-container');
  const loading = document.getElementById('loading');
  
  if (!container) return;
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x525252);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enableZoom = true;
  controls.enablePan = false;
  
  controls.minDistance = 2;
  controls.maxDistance = 8;
  
  controls.rotateSpeed = 1.0;
  controls.screenSpacePanning = true;
  
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  
  controls.target.set(0, 0, 0);
  
  // controls.mouseButtons = {
  //   LEFT: THREE.MOUSE.ROTATE,
  //   MIDDLE: THREE.MOUSE.DOLLY,
  //   RIGHT: THREE.MOUSE.PAN
  // };
  
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('images/pinCad/');
  
  mtlLoader.load('revisedPin.mtl', (materials) => {
    materials.preload();
    
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('images/pinCad/');
    
    objLoader.load('revisedPin.obj', (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.x = -center.x;
      object.position.y = -center.y;
      object.position.z = -center.z;
      
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 3.0 / size;
      object.scale.set(scale, scale, scale);
      
      object.rotation.x = 180;
      object.rotation.y = 0;
      object.rotation.z = 0;
      
      scene.add(object);
      
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      
      controls.target.set(0, 0, 0);
      controls.update();
      
      if (loading) {
        loading.style.display = 'none';
      }
      
      console.log('Initial rotation:', {
        x: THREE.MathUtils.radToDeg(object.rotation.x).toFixed(1) + '°',
        y: THREE.MathUtils.radToDeg(object.rotation.y).toFixed(1) + '°',
        z: THREE.MathUtils.radToDeg(object.rotation.z).toFixed(1) + '°'
      });
      
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      
      animate();
      
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

function initContactPopup() {
  const contactLink = document.getElementById('contactLink');
  const contactPopup = document.getElementById('contactPopup');
  const closePopup = document.querySelector('.close-popup');

  if (!contactLink || !contactPopup) return;

  contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    contactPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closePopup.addEventListener('click', function() {
    contactPopup.classList.remove('active');
    document.body.style.overflow = '';
  });

  contactPopup.addEventListener('click', function(e) {
    if (e.target === contactPopup) {
      contactPopup.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactPopup.classList.contains('active')) {
      contactPopup.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initModelViewer();
  
  const initTestimonialCarousel = () => {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 10000;
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    const startAutoRotate = () => {
      slideInterval = setInterval(nextSlide, slideDuration);
    };
    const stopAutoRotate = () => {
      clearInterval(slideInterval);
    };

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

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoRotate();
        startAutoRotate();
      });
    });

    if (track) {
      track.addEventListener('mouseenter', stopAutoRotate);
      track.addEventListener('mouseleave', startAutoRotate);
    }
    showSlide(0);
    startAutoRotate();
  };

  if (document.querySelector('.testimonial-carousel')) {
    initTestimonialCarousel();
  }
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
      }
      
      if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  const initAboutCarousel = () => {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000;
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      if (slides[index]) slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      currentSlide = index;
    };
    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };
    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };
    const startAutoRotate = () => {
      slideInterval = setInterval(nextSlide, slideDuration);
    };
    const stopAutoRotate = () => {
      clearInterval(slideInterval);
    };

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

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoRotate();
        startAutoRotate();
      });
    });

    if (track) {
      track.addEventListener('mouseenter', stopAutoRotate);
      track.addEventListener('mouseleave', startAutoRotate);
    }
    showSlide(0);
    startAutoRotate();
  };

  if (document.querySelector('.about-carousel')) {
    initAboutCarousel();
  }
  
  initContactPopup();
  
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, 
          behavior: 'smooth'
        });
      }
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        const ans = faq.querySelector('.faq-answer');
        if (ans) {
          ans.style.maxHeight = '0';
        }
      });
      
      if (!isOpen) {
        item.classList.add('active');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

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
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  const preOrderButtons = document.querySelectorAll('.btn-primary');
  preOrderButtons.forEach(button => {
    button.addEventListener('click', handlePreOrder);
  });

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

  const animateElements = document.querySelectorAll('.feature-card, .faq-item');
  animateElements.forEach(element => {
    observer.observe(element);
  });
});

function handlePreOrder(e) {
  e.preventDefault();
  
  const button = e.currentTarget;
  const originalText = button.textContent;
  button.textContent = 'Processing...';
  button.disabled = true;
  
  setTimeout(() => {
    alert('Thank you for your pre-order! We\'ll be in touch soon with more details.');
    
    button.textContent = originalText;
    button.disabled = false;
  }, 1500);
}

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
