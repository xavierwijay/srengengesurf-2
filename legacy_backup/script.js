// DOM Elements
const elements = {
  header: document.querySelector(".header"),
  mobileMenu: document.getElementById("mobileMenu"),
  burgerBtn: document.getElementById("burgerBtn"),
  closeMenuBtn: document.getElementById("closeMenu"),
  mobileLinks: document.querySelectorAll(".mobile-link"),
  loading: document.querySelector(".loading"),
  swiper: document.querySelector(".swiper"),
  packagesSwiper: document.querySelector(".packages-swiper"),
};

// Utility Functions
const utils = {
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  smoothScrollTo: (target) => {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  },
};

// Header Scroll Effect
class HeaderManager {
  constructor() {
    this.header = elements.header;
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener(
      "scroll",
      utils.debounce(() => {
        this.handleScroll();
      }, 10)
    );
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class for styling
    if (currentScrollY > 50) {
      this.header.classList.add("scrolled");
    } else {
      this.header.classList.remove("scrolled");
    }

    this.lastScrollY = currentScrollY;
  }
}

// Mobile Menu Manager
class MobileMenuManager {
  constructor() {
    this.menu = elements.mobileMenu;
    this.burgerBtn = elements.burgerBtn;
    this.closeBtn = elements.closeMenuBtn;
    this.links = elements.mobileLinks;
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.menu || !this.burgerBtn || !this.closeBtn) return;

    this.burgerBtn.addEventListener("click", () => this.openMenu());
    this.closeBtn.addEventListener("click", () => this.closeMenu());

    // Close menu when clicking on links
    this.links.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking on overlay
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay) {
      overlay.addEventListener("click", () => this.closeMenu());
    }
  }

  openMenu() {
    this.menu.classList.add("active");
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay) overlay.classList.add("active");
    this.isOpen = true;

    // Prevent scrolling using multiple methods for better mobile support
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Store current scroll position
    this.scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = "100%";

    // Prevent touch scroll events
    this.preventScrollHandler = this.preventScroll.bind(this);
    document.addEventListener("touchmove", this.preventScrollHandler, {
      passive: false,
    });
    document.addEventListener("wheel", this.preventScrollHandler, {
      passive: false,
    });

    // Animate links
    this.links.forEach((link, index) => {
      link.style.transitionDelay = `${index * 0.1}s`;
    });

    // Force mobile menu footer visibility
    setTimeout(() => {
      const footer = document.querySelector(".mobile-menu-footer");
      if (footer) {
        footer.style.display = "flex";
        footer.style.visibility = "visible";
        footer.style.opacity = "1";
        footer.style.transform = "translateX(0)";
        footer.style.position = "relative";
        footer.style.bottom = "0";
        footer.style.marginTop = "auto";
        footer.style.flexShrink = "0";
      }
    }, 200);
  }

  closeMenu() {
    this.menu.classList.remove("active");
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay) overlay.classList.remove("active");
    this.isOpen = false;

    // Re-enable scrolling
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Restore scroll position
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    if (this.scrollY !== undefined) {
      window.scrollTo(0, this.scrollY);
    }

    // Remove scroll prevention
    if (this.preventScrollHandler) {
      document.removeEventListener("touchmove", this.preventScrollHandler);
      document.removeEventListener("wheel", this.preventScrollHandler);
    }

    // Reset transition delays
    this.links.forEach((link) => {
      link.style.transitionDelay = "";
    });
  }

  preventScroll(e) {
    // Allow scrolling within the mobile menu itself, but prevent background scroll
    if (!this.menu.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}

// Swiper Manager
class SwiperManager {
  constructor() {
    this.swiperElement = elements.swiper;
    this.packagesSwiperElement = elements.packagesSwiper;
    this.reviewsSwiperElement = document.querySelector(".reviews-swiper");
    this.swiper = null;
    this.packagesSwiper = null;
    this.reviewsSwiper = null;
    this.init();
  }

  init() {
    this.initMainSwiper();
    this.initPackagesSwiper();
    this.initReviewsSwiper();
  }

  initMainSwiper() {
    if (!this.swiperElement || typeof Swiper === "undefined") return;

    try {
      this.swiper = new Swiper(this.swiperElement, {
        loop: true,
        spaceBetween: 24,
        grabCursor: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        },
        on: {
          init: function () {
            this.navigation.prevEl.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            `;
            this.navigation.nextEl.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            `;
          },
        },
      });
    } catch (error) {
      console.error("Main Swiper initialization failed:", error);
    }
  }

  initPackagesSwiper() {
    if (!this.packagesSwiperElement || typeof Swiper === "undefined") {
      console.log("Packages Swiper element not found or Swiper not loaded");
      return;
    }

    try {
      console.log("Initializing Packages Swiper...");
      this.packagesSwiper = new Swiper(this.packagesSwiperElement, {
        loop: false,
        spaceBetween: 24,
        grabCursor: true,
        autoplay: false,
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
        on: {
          init: function () {
            console.log("Packages Swiper initialized successfully");
            // Add arrow icons to navigation buttons
            const prevBtn = this.navigation.prevEl;
            const nextBtn = this.navigation.nextEl;

            if (prevBtn) {
              prevBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              `;
            }

            if (nextBtn) {
              nextBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              `;
            }
          },
        },
      });
    } catch (error) {
      console.error("Packages Swiper initialization failed:", error);
    }
  }

  initReviewsSwiper() {
    if (!this.reviewsSwiperElement || typeof Swiper === "undefined") {
      console.log("Reviews Swiper element not found or Swiper not loaded");
      return;
    }

    try {
      console.log("Initializing Reviews Swiper...");
      this.reviewsSwiper = new Swiper(this.reviewsSwiperElement, {
        loop: true,
        spaceBetween: 24,
        grabCursor: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
        on: {
          init: function () {
            console.log("Reviews Swiper initialized successfully");
            // Add arrow icons to navigation buttons
            const prevBtn = this.navigation.prevEl;
            const nextBtn = this.navigation.nextEl;

            if (prevBtn) {
              prevBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              `;
            }

            if (nextBtn) {
              nextBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              `;
            }
          },
        },
      });
    } catch (error) {
      console.error("Reviews Swiper initialization failed:", error);
    }
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.animatedElements = document.querySelectorAll("[data-aos]");
    this.init();
  }

  init() {
    if (typeof AOS === "undefined") {
      this.initCustomAnimations();
      return;
    }

    // Initialize AOS
    AOS.init({
      once: true,
      duration: 700,
      offset: 40,
      easing: "ease-out-cubic",
      delay: 0,
    });
  }

  initCustomAnimations() {
    // Fallback animations if AOS is not available
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    this.animatedElements.forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });
  }
}

// Loading Manager
class LoadingManager {
  constructor() {
    this.loading = elements.loading;
    this.init();
  }

  init() {
    if (!this.loading) return;

    // Hide loading screen when page is fully loaded
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.hideLoading();
      }, 500);
    });

    // Also hide when DOM is ready
    if (document.readyState === "complete") {
      setTimeout(() => {
        this.hideLoading();
      }, 500);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          this.hideLoading();
        }, 500);
      });
    }

    // Fallback: hide loading after 2 seconds (reduced from 3)
    setTimeout(() => {
      this.hideLoading();
    }, 2000);

    // Additional fallback: hide loading after 1 second for live server
    setTimeout(() => {
      this.hideLoading();
    }, 1000);
  }

  hideLoading() {
    if (this.loading) {
      this.loading.classList.add("hidden");
      setTimeout(() => {
        this.loading.style.display = "none";
      }, 500);
    }

    // Additional fallback for live server
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
      loadingElement.classList.add("hidden");
      setTimeout(() => {
        loadingElement.style.display = "none";
      }, 500);
    }
  }
}

// Performance Optimizer
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.lazyLoadImages();

    // Optimize scroll events
    this.optimizeScrollEvents();

    // Preload critical resources
    this.preloadResources();

    // Optimize animations
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  optimizeScrollEvents() {
    // Use passive listeners for better performance
    const scrollOptions = { passive: true };

    window.addEventListener("scroll", () => {}, scrollOptions);
    window.addEventListener("touchmove", () => {}, scrollOptions);
  }

  preloadResources() {
    // Preload critical images
    const criticalImages = [
      "./img/backgroundhero.png",
      "./img/srngengelogoo.png",
      "./img/texthero.png",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      link.fetchPriority = "high";
      document.head.appendChild(link);
    });
  }

  optimizeAnimations() {
    // Use Intersection Observer for better performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.willChange = "transform";
            } else {
              entry.target.style.willChange = "auto";
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe elements with animations
      document
        .querySelectorAll(".card, .package-card, .review-card")
        .forEach((el) => {
          observer.observe(el);
        });
    }
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error);
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason);
    });
  }
}

// Main App Class
class SrengengeApp {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    try {
      // Initialize all managers
      this.managers = {
        header: new HeaderManager(),
        mobileMenu: new MobileMenuManager(),
        swiper: new SwiperManager(),
        animation: new AnimationManager(),
        loading: new LoadingManager(),
        performance: new PerformanceOptimizer(),
        errorHandler: new ErrorHandler(),
      };

      // Initialize smooth scrolling for anchor links
      this.initSmoothScrolling();

      // Initialize additional features
      this.initAdditionalFeatures();

      console.log("Srengenge App initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Srengenge App:", error);
    }
  }

  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = anchor.getAttribute("href");
        utils.smoothScrollTo(target);
      });
    });
  }

  initAdditionalFeatures() {
    // Add hover effects to cards
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });

    // Add click effects to buttons
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Create ripple effect
        const ripple = document.createElement("span");
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple");

        btn.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Initialize gallery expand functionality
    this.initGalleryExpand();

    // Initialize pax counter functionality
    this.initPaxCounter();
  }

  initPaxCounter() {
    // Initialize pax counters for all packages dengan harga masing-masing
    for (let i = 1; i <= 4; i++) {
      this.updatePaxDisplay(i);
      this.updateTotalPrice(i, basePrice[i]); // Gunakan harga individual
    }
  }

  initGalleryExpand() {
    const expandBtn = document.getElementById("expandGallery");
    const hiddenItems = document.querySelectorAll(".gallery-hidden");
    const expandText = expandBtn?.querySelector(".expand-text");
    const collapseText = expandBtn?.querySelector(".collapse-text");
    const expandIcon = expandBtn?.querySelector(".expand-icon");

    if (!expandBtn) return;

    expandBtn.addEventListener("click", () => {
      const isExpanded = expandBtn.getAttribute("aria-expanded") === "true";

      if (!isExpanded) {
        // Show all gallery items
        hiddenItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("show");
          }, index * 100); // Stagger animation
        });

        // Update button state
        expandBtn.setAttribute("aria-expanded", "true");
        if (expandText) expandText.style.display = "none";
        if (collapseText) collapseText.style.display = "inline";
        if (expandIcon) expandIcon.textContent = "📷";

        // Smooth scroll to show new items
        setTimeout(() => {
          const firstHiddenItem = document.querySelector(
            ".gallery-hidden.show"
          );
          if (firstHiddenItem) {
            firstHiddenItem.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 500);
      } else {
        // Hide additional gallery items
        hiddenItems.forEach((item) => {
          item.classList.remove("show");
        });

        // Update button state
        expandBtn.setAttribute("aria-expanded", "false");
        if (expandText) expandText.style.display = "inline";
        if (collapseText) collapseText.style.display = "none";
        if (expandIcon) expandIcon.textContent = "📷";

        // Scroll back to gallery section
        const gallerySection = document.getElementById("gallery");
        if (gallerySection) {
          gallerySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }
}

// Initialize the app when the script loads
new SrengengeApp();

// Optimized loading screen management
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const loading = document.querySelector(".loading");
    if (loading) {
      loading.classList.add("hidden");
      setTimeout(() => (loading.style.display = "none"), 500);
    }
  }, 800);
});

// Fallback for slow connections
setTimeout(() => {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.classList.add("hidden");
    loading.style.display = "none";
  }
}, 2500);

// Global pax counter functions
let paxCounts = { 1: 1, 2: 1, 3: 1, 4: 1 };

// Base prices untuk setiap package (bisa disesuaikan sesuai kebutuhan)
const basePrice = {
  1: 800000, // Surf & Camp - 500K
  2: 350000, // Beginner Package - 850K
  3: 250000, // Beginner Package (copy) - 850K
  4: 850000, // Beginner Package (copy) - 850K
};

function increasePax(packageId) {
  if (paxCounts[packageId] < 20) {
    // Max 20 pax
    paxCounts[packageId]++;
    updatePaxDisplay(packageId);
    updateTotalPrice(packageId, basePrice[packageId]);
  }
}

function decreasePax(packageId) {
  if (paxCounts[packageId] > 1) {
    // Min 1 pax
    paxCounts[packageId]--;
    updatePaxDisplay(packageId);
    updateTotalPrice(packageId, basePrice[packageId]);
  }
}

function updatePaxDisplay(packageId) {
  const paxElement = document.getElementById(`pax-${packageId}`);
  const decreaseBtn = document.getElementById(`decrease-${packageId}`);
  const increaseBtn = document.getElementById(`increase-${packageId}`);

  if (paxElement) {
    paxElement.textContent = paxCounts[packageId];
  }

  // Update button states
  if (decreaseBtn) {
    decreaseBtn.disabled = paxCounts[packageId] <= 1;
  }

  if (increaseBtn) {
    increaseBtn.disabled = paxCounts[packageId] >= 20;
  }
}

function updateTotalPrice(packageId, packageBasePrice) {
  const totalElement = document.getElementById(`total-${packageId}`);
  const totalPrice = packageBasePrice * paxCounts[packageId];

  if (totalElement) {
    // Format price with K for thousands
    const formattedPrice =
      totalPrice >= 1000000
        ? `Rp ${(totalPrice / 1000000).toFixed(1)}M`
        : `Rp ${(totalPrice / 1000).toFixed(0)}K`;

    totalElement.textContent = `Total: ${formattedPrice}`;
  }
}

function bookPackage(packageId, packageName) {
  const pax = paxCounts[packageId];
  const packageBasePrice = basePrice[packageId];
  const totalPrice = packageBasePrice * pax;
  const formattedPrice =
    totalPrice >= 1000000
      ? `${(totalPrice / 1000000).toFixed(1)}M`
      : `${(totalPrice / 1000).toFixed(0)}K`;

  const message = `Hai kak saya tertarik dengan Paket ${packageName} ini.. sebanyak ${pax} pax tanggal yang ready di hari apa ya kak?`;

  const whatsappUrl = `https://wa.me/6285183001691?text=${encodeURIComponent(
    message
  )}`;

  // Open WhatsApp in new tab
  window.open(whatsappUrl, "_blank");
}

// ===== DUAL GALLERY SYSTEM - MOBILE EXPAND/COLLAPSE =====
class DualGallerySystem {
  constructor() {
    this.mobileExpandBtn = null;
    this.mobileHiddenGallery = null;
    this.isExpanded = false;
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Wait for DOM content to load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.mobileExpandBtn = document.getElementById("mobileExpandBtn");
    this.mobileHiddenGallery = document.querySelector(".mobile-gallery-hidden");

    if (this.mobileExpandBtn) {
      this.mobileExpandBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleToggle();
      });
    }

    // Handle window resize
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.handleResize();
      }, 250)
    );
  }

  handleToggle() {
    if (this.isAnimating) return;

    this.isExpanded = !this.isExpanded;
    this.isAnimating = true;

    if (this.isExpanded) {
      this.expandGallery();
    } else {
      this.collapseGallery();
    }

    this.updateButton();
  }

  expandGallery() {
    if (!this.mobileHiddenGallery) return;

    // Add show class with animation
    this.mobileHiddenGallery.style.display = "flex";

    // Force reflow for animation
    this.mobileHiddenGallery.offsetHeight;

    // Add show class
    this.mobileHiddenGallery.classList.add("show");

    // Add staggered animations to cards
    const hiddenCards = this.mobileHiddenGallery.querySelectorAll(
      ".mobile-gallery-card"
    );
    hiddenCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = "translateY(0)";
        card.style.opacity = "1";
      }, index * 100);
    });

    // Animation complete
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  collapseGallery() {
    if (!this.mobileHiddenGallery) return;

    // Add exit animations to cards
    const hiddenCards = this.mobileHiddenGallery.querySelectorAll(
      ".mobile-gallery-card"
    );
    const reverseCards = Array.from(hiddenCards).reverse();

    reverseCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = "translateY(20px)";
        card.style.opacity = "0";
      }, index * 50);
    });

    // Remove show class and hide
    setTimeout(() => {
      this.mobileHiddenGallery.classList.remove("show");

      setTimeout(() => {
        this.mobileHiddenGallery.style.display = "none";
        this.isAnimating = false;

        // Scroll back to gallery
        this.scrollToGallery();
      }, 300);
    }, 200);
  }

  updateButton() {
    if (!this.mobileExpandBtn) return;

    this.mobileExpandBtn.classList.toggle("expanded", this.isExpanded);

    // Add button press animation
    this.mobileExpandBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.mobileExpandBtn.style.transform = "";
    }, 150);
  }

  scrollToGallery() {
    if (window.innerWidth > 767) return; // Only on mobile

    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      const headerHeight =
        document.querySelector(".header")?.offsetHeight || 70;
      const targetPosition = gallerySection.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

  handleResize() {
    // Reset on desktop
    if (window.innerWidth > 767) {
      if (this.isExpanded) {
        this.isExpanded = false;
        if (this.mobileHiddenGallery) {
          this.mobileHiddenGallery.classList.remove("show");
          this.mobileHiddenGallery.style.display = "none";
        }
        this.updateButton();
      }
    }
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize Dual Gallery System
const dualGallery = new DualGallerySystem();

// Add CSS animations dynamically
const galleryAnimationCSS = `
<style>
.mobile-gallery-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mobile-gallery-hidden .mobile-gallery-card {
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.mobile-gallery-hidden.show .mobile-gallery-card {
  transform: translateY(0);
  opacity: 1;
}

@keyframes mobileCardSlideIn {
  from {
    transform: translateY(30px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes mobileCardSlideOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML("beforeend", galleryAnimationCSS);
