/* ══════════════════════════════════════
   ShoeMart — Main JavaScript
   ══════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DOM refs ── */
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const addCartBtns = document.querySelectorAll('.btn-add-cart');
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  const cartCount = document.getElementById('cart-count');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const newsletterForm = document.getElementById('newsletter-form');

  let cartTotal = 0;
  let currentSlide = 0;

  /* ── Hero Slider Logic ── */
  const slidesContainer = document.querySelector('.hero-slides');
  const slideCount = document.querySelectorAll('.hero-slide').length;
  
  if (slidesContainer && slideCount > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;
      const offset = currentSlide * (100 / slideCount);
      slidesContainer.style.transform = `translateX(-${offset}%)`;
    }, 5000); // Change image every 5 seconds
  }

  /* ── Header scroll effect ── */
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Mobile nav toggle ── */
  hamburger.addEventListener('click', function () {
    const open = hamburger.classList.toggle('open');
    nav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Active state
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  /* ── Product filters ── */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var filter = btn.dataset.filter;
      productCards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Add to cart ── */
  addCartBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      cartTotal++;
      cartCount.textContent = cartTotal;
      cartCount.style.animation = 'none';
      void cartCount.offsetWidth; // reflow
      cartCount.style.animation = 'pop .3s ease';
      showToast(btn.dataset.product + ' added to cart!');
    });
  });

  /* ── Wishlist toggle ── */
  wishlistBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('active');
      var name = btn.closest('.product-card').querySelector('.product-name').textContent;
      if (btn.classList.contains('active')) {
        showToast(name + ' added to wishlist ♥');
      } else {
        showToast(name + ' removed from wishlist');
      }
    });
  });

  /* ── Newsletter ── */
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('newsletter-email').value;
    if (email) {
      showToast('Welcome aboard! Check ' + email + ' for updates.');
      newsletterForm.reset();
    }
  });

  /* ── Toast notification ── */
  var toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.hidden = true; }, 400);
    }, 2800);
  }

  /* ── Scroll-triggered fade-in ── */
  var fadeEls = document.querySelectorAll(
    '.feature-item, .collection-card, .product-card, .about-content, .about-image-wrap, .newsletter-content'
  );
  fadeEls.forEach(function (el) { el.classList.add('fade-up'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(function (el) { observer.observe(el); });

  /* ── Active nav on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY + 200;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (l) {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + id) l.classList.add('active');
        });
      }
    });
  }, { passive: true });

  /* ── Keyframe for cart pop ── */
  var style = document.createElement('style');
  style.textContent = '@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

})();
