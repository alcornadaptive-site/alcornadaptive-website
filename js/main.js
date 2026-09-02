/**
 * Alcorn Adaptive - Main JavaScript
 * Handles scroll animations, mobile menu, and header behavior
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');

  // ----- Mobile Menu Toggle -----
  function initMobileMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
      const isActive = nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('active') &&
          !nav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ----- Header Scroll Behavior -----
  function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class when past threshold
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ----- Scroll Animations -----
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up, .stagger-children');

    if (!animatedElements.length) return;

    // Check if element is in viewport
    function isInViewport(element, offset) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= windowHeight - offset;
    }

    // Animate elements in view
    function checkAnimations() {
      animatedElements.forEach(function(element) {
        if (isInViewport(element, 100) && !element.classList.contains('visible')) {
          element.classList.add('visible');
        }
      });
    }

    // Initial check
    checkAnimations();

    // Check on scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          checkAnimations();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ----- Smooth Scroll for Anchor Links -----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ----- Hero Animation on Load -----
  function initHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      // Trigger fade-in animations after a short delay
      setTimeout(function() {
        const fadeElements = heroContent.querySelectorAll('.fade-in-up');
        fadeElements.forEach(function(el, index) {
          setTimeout(function() {
            el.classList.add('visible');
          }, index * 200);
        });
      }, 300);
    }
  }

  // ----- New Location Announcement Bar -----
  // Three jobs:
  //   1. Publish the bar's real rendered height to --banner-height, so the fixed
  //      header sits below it even when the copy wraps to two or three lines.
  //   2. Slide it up out of the way 15s after load. It has said its piece by
  //      then, and on a phone it's holding a chunk of the viewport hostage for
  //      as long as it stays. The address is in the footer of every page.
  //   3. Retire it entirely after a year, so a "new location" notice can't go on
  //      calling a year-old address new if nobody redeploys the site.
  // After it expires, delete the <aside> from the four HTML pages.
  const BANNER_EXPIRES = new Date(2027, 8, 2); // month is 0-indexed: Sep 2, 2027, local time
  const BANNER_VISIBLE_MS = 15000;
  const BANNER_EXIT_MS = 500; // keep in step with the transition in style.css

  function initAnnouncementBar() {
    const bar = document.getElementById('announcementBar');
    if (!bar) return;

    const root = document.documentElement;

    const setHeight = function(px) {
      root.style.setProperty('--banner-height', px + 'px');
    };

    if (new Date() >= BANNER_EXPIRES) {
      bar.remove();
      setHeight(0);
      return;
    }

    // Once the exit starts, the re-measure listeners below must stop fighting it:
    // translateY doesn't change offsetHeight, so an orientationchange mid-slide
    // would put --banner-height straight back and leave a gap above the header.
    let leaving = false;

    const syncHeight = function() {
      if (leaving) return;
      setHeight(bar.offsetHeight);
    };

    syncHeight();
    // Re-measure once webfonts settle and whenever the bar can rewrap.
    window.addEventListener('load', syncHeight);
    window.addEventListener('resize', syncHeight);
    window.addEventListener('orientationchange', syncHeight);

    const retire = function() {
      leaving = true;
      // .banner-leaving is what licenses the header/hero to animate; see the
      // comment on .header for why those transitions can't just be standing.
      root.classList.add('banner-leaving');
      bar.classList.add('announcement-bar--leaving');
      setHeight(0); // header and hero reclaim the space on the same curve
      window.setTimeout(function() {
        bar.remove();
        root.classList.remove('banner-leaving');
      }, BANNER_EXIT_MS + 50);
    };

    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.setTimeout(function() {
      if (reduced) {
        leaving = true;
        bar.remove();
        setHeight(0);
        return;
      }
      retire();
    }, BANNER_VISIBLE_MS);
  }

  // ----- Initialize Everything -----
  function init() {
    initAnnouncementBar();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initSmoothScroll();
    initHeroAnimation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
