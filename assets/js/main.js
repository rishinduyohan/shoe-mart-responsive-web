(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const addCartBtns = document.querySelectorAll('.btn-add-cart');
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotalDisplay = document.getElementById('header-cart-total');
  const profileBtn = document.getElementById('profile-btn');
  const langBtn = document.getElementById('lang-btn');
  const searchBtn = document.getElementById('search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSidebarTotal = document.getElementById('cart-sidebar-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const receiptOverlay = document.getElementById('receipt-overlay');
  const receiptItemsList = document.getElementById('receipt-items');
  const receiptTotal = document.getElementById('receipt-total');
  const confirmPrintBtn = document.getElementById('confirm-print-btn');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const newsletterForm = document.getElementById('newsletter-form');

  let cartItems = JSON.parse(sessionStorage.getItem('shoeMartCart')) || [];
  let cartTotalPriceValue = 0;
  let currentSlide = 0;

  function saveCart() {
    sessionStorage.setItem('shoeMartCart', JSON.stringify(cartItems));
  }

  updateCartUI();

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput.focus(), 300);
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        showToast('Searching for: ' + query);
        searchOverlay.classList.remove('active');
        searchInput.value = '';
      }
    });
  }

  const slidesContainer = document.querySelector('.hero-slides');
  const slideCount = document.querySelectorAll('.hero-slide').length;
  
  if (slidesContainer && slideCount > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;
      const offset = currentSlide * (100 / slideCount);
      slidesContainer.style.transform = `translateX(-${offset}%)`;
    }, 5000);
  }

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', function () {
    const open = hamburger.classList.toggle('open');
    nav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  if (profileBtn) {
    profileBtn.addEventListener('click', () => showToast('Opening your profile...'));
  }
  if (langBtn) {
    langBtn.addEventListener('click', () => showToast('Language selection coming soon!'));
  }

  const products = [
    { id: 1, name: 'Work Shoe', category: 'men', price: '12,500', oldPrice: '15,000', discount: 16, rating: 4, image: 'assets/images/shoe-casual.png', priceValue: 12500 },
    { id: 2, name: 'Women Casual', category: 'women', price: '8,900', oldPrice: '12,000', discount: 25, rating: 4, image: 'assets/images/shoe-runner.png', priceValue: 8900 },
    { id: 3, name: 'Men Casual', category: 'men', price: '14,200', oldPrice: '18,500', discount: 23, rating: 4, image: 'assets/images/hero-banner-3.png', priceValue: 14200 },
    { id: 4, name: 'Women Casual', category: 'women', price: '9,500', oldPrice: '13,000', discount: 27, rating: 4, image: 'assets/images/shoe-heels.png', priceValue: 9500 },
    { id: 5, name: 'Women Casual', category: 'women', price: '11,000', oldPrice: '14,500', discount: 24, rating: 4, image: 'assets/images/shoe-boots.png', priceValue: 11000 },
    { id: 6, name: 'Men Casual', category: 'men', price: '15,800', oldPrice: '20,000', discount: 21, rating: 5, image: 'assets/images/shoe-loafer.png', priceValue: 15800 },
    { id: 7, name: 'Unisex Casual', category: 'unisex', price: '13,400', oldPrice: '17,000', discount: 21, rating: 4, image: 'assets/images/shoe-hiking.png', priceValue: 13400 },
    { id: 8, name: 'Men Casual', category: 'men', price: '10,500', oldPrice: '13,500', discount: 22, rating: 4, image: 'assets/images/shoe-runner.png', priceValue: 10500 }
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
          <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.priceValue}">Add to Cart</button>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
          <div class="product-price">
            <span class="price-current">Rs. ${product.price}</span>
            <span class="price-old">Rs. ${product.oldPrice}</span>
            <span class="price-discount">${product.discount}% Off</span>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

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

  renderProducts();

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      const extraProducts = [
        { id: 9, name: 'Casual Comfort', category: 'unisex', price: '9,800', oldPrice: '13,000', discount: 25, rating: 4, image: 'assets/images/shoe-casual.png', priceValue: 9800 },
        { id: 10, name: 'Work Pro', category: 'men', price: '16,500', oldPrice: '21,000', discount: 21, rating: 4, image: 'assets/images/hero-banner-2.png', priceValue: 16500 },
        { id: 11, name: 'Women Style', category: 'women', price: '11,200', oldPrice: '15,000', discount: 25, rating: 4, image: 'assets/images/shoe-heels.png', priceValue: 11200 },
        { id: 12, name: 'Men Sport', category: 'men', price: '14,900', oldPrice: '19,500', discount: 24, rating: 4, image: 'assets/images/shoe-athletic.png', priceValue: 14900 }
      ];
      
      extraProducts.forEach(product => {
        products.push(product);
      });
      
      renderProducts(document.querySelector('.filter-btn.active').dataset.filter);
      loadMoreBtn.style.display = 'none';
    });
  }

  if (cartBtn && cartSidebar) {
    cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
  }

  if (cartCloseBtn && cartSidebar) {
    cartCloseBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));
  }

  function updateCartUI() {
    if (!cartItemsList) return;
    
    if (cartItems.length === 0) {
      cartItemsList.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
      cartBadge.textContent = '0';
      cartTotalDisplay.textContent = 'Rs. 0.00';
      cartSidebarTotal.textContent = 'Rs. 0.00';
      return;
    }

    cartItemsList.innerHTML = '';
    let total = 0;
    let count = 0;

    cartItems.forEach((item, index) => {
      total += item.price * item.quantity;
      count += item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Rs. ${item.price.toLocaleString()}</p>
          <div class="qty-controls">
            <button class="qty-btn dec-btn" data-index="${index}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn inc-btn" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item" data-index="${index}">Remove</button>
      `;
      cartItemsList.appendChild(itemEl);
    });

    cartBadge.textContent = count;
    cartTotalDisplay.textContent = 'Rs. ' + total.toLocaleString();
    cartSidebarTotal.textContent = 'Rs. ' + total.toLocaleString();
    cartTotalPriceValue = total;
    saveCart();
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = parseInt(e.target.dataset.index);
      cartItems.splice(index, 1);
      updateCartUI();
    } else if (e.target.classList.contains('inc-btn')) {
      const index = parseInt(e.target.dataset.index);
      cartItems[index].quantity++;
      updateCartUI();
    } else if (e.target.classList.contains('dec-btn')) {
      const index = parseInt(e.target.dataset.index);
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        updateCartUI();
      }
    }
  });

  const paymentOverlay = document.getElementById('payment-overlay');
  const paymentCloseBtn = document.getElementById('payment-close-btn');
  const paymentForm = document.getElementById('payment-form');
  const methodItems = document.querySelectorAll('.method-item');
  const paymentTotalAmount = document.getElementById('payment-total-amount');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      
      paymentTotalAmount.textContent = cartTotalPriceValue.toLocaleString();
      paymentOverlay.classList.add('active');
      cartSidebar.classList.remove('active');
    });
  }

  if (paymentCloseBtn) {
    paymentCloseBtn.addEventListener('click', () => {
      paymentOverlay.classList.remove('active');
    });
  }

  methodItems.forEach(item => {
    item.addEventListener('click', () => {
      methodItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const method = item.dataset.method;
      const cardSection = document.getElementById('card-inputs');
      const paypalSection = document.getElementById('paypal-inputs');
      const codSection = document.getElementById('cod-inputs');

      cardSection.style.display = method === 'card' ? 'block' : 'none';
      paypalSection.style.display = method === 'paypal' ? 'block' : 'none';
      codSection.style.display = method === 'cod' ? 'block' : 'none';

      // Fix "invalid form control is not focusable" by toggling required
      cardSection.querySelectorAll('input').forEach(input => {
        input.required = (method === 'card');
      });
    });
  });

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('pay-now-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Processing...';
      btn.disabled = true;

      setTimeout(() => {
        paymentOverlay.classList.remove('active');
        generateReceipt();
        receiptOverlay.classList.add('active');
        btn.innerHTML = originalText;
        btn.disabled = false;
        showToast('Payment successful!');
      }, 2000);
    });
  }

  function generateReceipt() {
    if (!receiptItemsList) return;
    
    receiptItemsList.innerHTML = '';
    const date = new Date().toLocaleString();
    document.getElementById('receipt-date').textContent = 'Date: ' + date;

    cartItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>Rs. ${(item.price * item.quantity).toLocaleString()}</td>
      `;
      receiptItemsList.appendChild(row);
    });

    receiptTotal.textContent = 'Rs. ' + cartTotalPriceValue.toLocaleString();
  }

  if (confirmPrintBtn) {
    confirmPrintBtn.addEventListener('click', () => {
      window.print();
      cartItems = [];
      updateCartUI();
      receiptOverlay.classList.remove('active');
      showToast('Purchase successful! Thank you.');
    });
  }

  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
      receiptOverlay.classList.remove('active');
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-cart')) {
      const btn = e.target;
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const product = products.find(p => p.id == id);
      
      const existing = cartItems.find(item => item.id == id);
      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({
          id: id,
          name: name,
          price: price,
          quantity: 1,
          image: product ? product.image : 'assets/images/shoe-casual.png'
        });
      }
      
      updateCartUI();
      
      btn.classList.add('added');
      const originalContent = btn.innerHTML;
      if (window.innerWidth <= 767) {
        btn.setAttribute('data-original', '+');
      } else {
        btn.textContent = 'Added!';
      }
      
      setTimeout(() => {
        btn.classList.remove('added');
        if (window.innerWidth <= 767) {
        } else {
          btn.textContent = 'Add to Cart';
        }
      }, 1500);

      if (cartBadge) {
        cartBadge.style.animation = 'none';
        void cartBadge.offsetWidth;
        cartBadge.style.animation = 'pop .3s ease';
      }
      
      showToast(name + ' added to cart!');
    }
  });

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

  var style = document.createElement('style');
  style.textContent = '@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

})();
