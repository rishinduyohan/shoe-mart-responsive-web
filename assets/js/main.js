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

  /* ── Products Data ── */
  const products = [
    { id: 1, name: 'Work Shoe', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-casual.png' },
    { id: 2, name: 'Women Casual', category: 'women', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-runner.png' },
    { id: 3, name: 'Men Casual', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-athletic.png' },
    { id: 4, name: 'Women Casual', category: 'women', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-heels.png' },
    { id: 5, name: 'Women Casual', category: 'women', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-boots.png' },
    { id: 6, name: 'Men Casual', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 5, image: 'assets/images/shoe-loafer.png' },
    { id: 7, name: 'Unisex Casual', category: 'unisex', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-hiking.png' },
    { id: 8, name: 'Men Casual', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-runner.png' }
  ];

  const productsGrid = document.getElementById('products-grid');

  function renderProducts(filter = 'all') {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter || (filter === 'casual' && p.name.toLowerCase().includes('casual')));

    filteredProducts.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
          <div class="product-price">
            <span class="price-current">$${product.price}</span>
            <span class="price-old">$${product.oldPrice}</span>
            <span class="price-discount">${product.discount}% Off</span>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  /* ── Product filters ── */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderProducts(btn.dataset.filter);
    });
  });

  // Initial render
  renderProducts();

  /* ── Load More ── */
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // simulate loading more products
      const extraProducts = [
        { id: 9, name: 'Casual Comfort', category: 'unisex', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-casual.png' },
        { id: 10, name: 'Work Pro', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-casual.png' },
        { id: 11, name: 'Women Style', category: 'women', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-heels.png' },
        { id: 12, name: 'Men Sport', category: 'men', price: 299.43, oldPrice: 534.33, discount: 24, rating: 4, image: 'assets/images/shoe-athletic.png' }
      ];
      
      extraProducts.forEach(product => {
        products.push(product);
      });
      
      renderProducts(document.querySelector('.filter-btn.active').dataset.filter);
      loadMoreBtn.style.display = 'none'; // hide after loading more for this demo
    });
  }

  /* ── Add to cart ── */
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-cart')) {
      const btn = e.target;
      cartTotal++;
      cartCount.textContent = cartTotal;
      cartCount.style.animation = 'none';
      void cartCount.offsetWidth; // reflow
      cartCount.style.animation = 'pop .3s ease';
      showToast(btn.dataset.product + ' added to cart!');
    }
  });

  /* ── Wishlist toggle ── */
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('wishlist-btn')) {
      const btn = e.target;
      btn.classList.toggle('active');
      var name = btn.closest('.product-card').querySelector('h3').textContent;
      if (btn.classList.contains('active')) {
        showToast(name + ' added to wishlist ♥');
      } else {
        showToast(name + ' removed from wishlist');
      }
    }
  });

  /* ── Newsletter ── */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('newsletter-email').value;
      if (email) {
        showToast('Welcome aboard! Check ' + email + ' for updates.');
        newsletterForm.reset();
      }
    });
  }

  /* ── Toast notification ── */
  var toastTimer;
  function showToast(message) {
    if (!toastMsg || !toast) return;
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
    '.feature-item, .product-card, .about-content, .about-image-wrap, .newsletter-content'
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
