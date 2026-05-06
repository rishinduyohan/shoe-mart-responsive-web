(function () {
  'use strict';

  const API_URL = 'http://localhost:8080/api';

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productsGrid = document.getElementById('products-grid');
  const cartBadge = document.getElementById('cart-badge');
  const cartTotalDisplay = document.getElementById('header-cart-total');
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSidebarTotal = document.getElementById('cart-sidebar-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const paymentOverlay = document.getElementById('payment-overlay');
  const receiptOverlay = document.getElementById('receipt-overlay');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  const profileBtn = document.getElementById('profile-btn');
  const loginModal = document.getElementById('login-modal-overlay');
  const registerModal = document.getElementById('register-modal-overlay');
  const profileDetailsModal = document.getElementById('profile-modal-overlay');
  const profileModalClose = document.getElementById('profile-modal-close');
  const loginModalClose = document.getElementById('login-modal-close');
  const registerModalClose = document.getElementById('register-modal-close');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  const logoutBtn = document.getElementById('logout-btn');

  let products = [];
  let cartItems = JSON.parse(sessionStorage.getItem('shoeMartCart')) || [];
  let currentUser = JSON.parse(localStorage.getItem('shoeMartUser')) || null;
  let cartTotalPriceValue = 0;
  let lastOrderedItems = [];

  async function fetchData(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  }

  async function postData(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Post failed');
      return await response.json();
    } catch (error) {
      console.error('Post error:', error);
      return null;
    }
  }

  function saveCart() {
    if (cartItems.length === 0) {
      sessionStorage.removeItem('shoeMartCart');
    } else {
      sessionStorage.setItem('shoeMartCart', JSON.stringify(cartItems));
    }
  }

  function showToast(message) {
    if (!toastMsg || !toast) return;
    toastMsg.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 400);
    }, 2800);
  }

  function renderProducts(filter = 'all') {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all'
      ? products
      : products.filter(p => (p.category || '').toLowerCase() === filter.toLowerCase() || (filter === 'casual' && (p.name || '').toLowerCase().includes('casual')));

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No products found at the moment.</p>';
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const price = product.priceValue !== undefined ? product.priceValue : (product.price || 0);

      card.innerHTML = `
        <div class="product-img-wrap">
          ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
          <img src="${product.image || 'assets/images/shoe-casual.png'}" alt="${product.name}" loading="lazy">
          <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${price}" data-image="${product.image}">Add to Cart</button>
        </div>
        <div class="product-info">
          <h3>${product.name || 'Unnamed Product'}</h3>
          <div class="product-rating">★★★★☆</div>
          <div class="product-price">
            <span class="price-current">Rs. ${price.toLocaleString()}</span>
            ${product.discount > 0 ? `<span class="price-old">Rs. ${(product.oldPrice || price).toLocaleString()}</span>` : ''}
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  function updateCartUI() {
    if (!cartItemsList) return;

    if (cartItems.length === 0) {
      cartItemsList.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
      cartBadge.textContent = '0';
      cartTotalDisplay.textContent = 'Rs. 0.00';
      cartSidebarTotal.textContent = 'Rs. 0.00';
      saveCart();
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

  function updateAuthUI() {
    if (!profileBtn) return;
    if (currentUser) {
      profileBtn.querySelector('span').textContent = currentUser.username;
      profileBtn.classList.add('logged-in');
    } else {
      profileBtn.querySelector('span').textContent = 'My profile';
      profileBtn.classList.remove('logged-in');
    }
  }

  function openProfileDetails() {
    if (!currentUser) return;
    document.getElementById('profile-display-name').textContent = currentUser.username;
    document.getElementById('profile-display-email').textContent = currentUser.email;
    document.getElementById('profile-display-role').textContent = currentUser.role;
    profileDetailsModal.classList.add('active');
  }

  async function loadInitialData() {
    try {
      products = await fetchData('products');
      renderProducts();
      updateAuthUI();
    } catch (err) {
      console.error('Critical error in loadInitialData:', err);
    }
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      if (currentUser) {
        openProfileDetails();
      } else {
        loginModal.classList.add('active');
      }
    });
  }
  if (loginModalClose) {
    loginModalClose.addEventListener('click', () => {
      loginModal.classList.remove('active');
      loginForm.reset();
    });
  }
  if (registerModalClose) {
    registerModalClose.addEventListener('click', () => {
      registerModal.classList.remove('active');
      registerForm.reset();
    });
  }
  if (profileModalClose) profileModalClose.addEventListener('click', () => profileDetailsModal.classList.remove('active'));

  if (switchToRegister) {
    switchToRegister.addEventListener('click', () => {
      loginModal.classList.remove('active');
      loginForm.reset();
      registerModal.classList.add('active');
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
      registerModal.classList.remove('active');
      registerForm.reset();
      loginModal.classList.add('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
      loginForm.reset();
    }
    if (e.target === registerModal) {
      registerModal.classList.remove('active');
      registerForm.reset();
    }
    if (e.target === profileDetailsModal) {
      profileDetailsModal.classList.remove('active');
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
      };

      const user = await postData('users/login', loginData);
      if (user) {
        currentUser = user;
        localStorage.setItem('shoeMartUser', JSON.stringify(user));
        showToast(`Welcome back, ${user.username}!`);
        loginForm.reset();
        loginModal.classList.remove('active');
        updateAuthUI();
      } else {
        showToast('Invalid email or password.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userData = {
        username: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        role: 'CUSTOMER'
      };

      const result = await postData('users', userData);
      if (result) {
        showToast('Account created successfully! Please login.');
        registerForm.reset();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
      } else {
        showToast('Registration failed. Try again.');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('shoeMartUser');
      profileDetailsModal.classList.remove('active');
      updateAuthUI();
      showToast('Logged out successfully.');
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      nav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  if (cartBtn) cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
      const id = e.target.dataset.id;
      const product = products.find(p => p.id == id);
      if (!product) return;

      const existing = cartItems.find(item => item.id == id);
      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: parseFloat(e.target.dataset.price),
          quantity: 1,
          image: e.target.dataset.image
        });
      }
      updateCartUI();
      showToast(`${product.name} added to cart!`);
    } else if (e.target.classList.contains('inc-btn')) {
      cartItems[e.target.dataset.index].quantity++;
      updateCartUI();
    } else if (e.target.classList.contains('dec-btn')) {
      if (cartItems[e.target.dataset.index].quantity > 1) {
        cartItems[e.target.dataset.index].quantity--;
        updateCartUI();
      }
    } else if (e.target.classList.contains('remove-item')) {
      cartItems.splice(e.target.dataset.index, 1);
      updateCartUI();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      document.getElementById('payment-total-amount').textContent = cartTotalPriceValue.toLocaleString();
      paymentOverlay.classList.add('active');
      cartSidebar.classList.remove('active');
    });
  }

  const methodItems = document.querySelectorAll('.method-item');
  methodItems.forEach(item => {
    item.addEventListener('click', () => {
      methodItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const method = item.dataset.method;
      
      document.getElementById('card-inputs').style.display = (method === 'card') ? 'block' : 'none';
      document.getElementById('paypal-inputs').style.display = (method === 'paypal') ? 'block' : 'none';
      document.getElementById('cod-inputs').style.display = (method === 'cod') ? 'block' : 'none';
      
      const payBtn = document.getElementById('pay-now-btn');
      if (method === 'cod') {
        payBtn.textContent = 'Confirm COD Order';
      } else if (method === 'paypal') {
        payBtn.textContent = 'Proceed to PayPal';
      } else {
        payBtn.textContent = `Pay Rs. ${cartTotalPriceValue.toLocaleString()}`;
      }
    });
  });

  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('pay-now-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Processing...';
      btn.disabled = true;

      const orderData = {
        customerName: e.target.querySelector('input[placeholder="John Doe"]').value || 'Walk-in Customer',
        customerEmail: 'customer@example.com',
        totalAmount: cartTotalPriceValue,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const savedOrder = await postData('orders', orderData);
      if (savedOrder) {
        showToast('Order placed successfully!');
        lastOrderedItems = [...cartItems];
        cartItems = [];
        updateCartUI();
        paymentOverlay.classList.remove('active');
        paymentForm.reset();

        document.getElementById('receipt-date').textContent = 'Date: ' + new Date().toLocaleString();
        const list = document.getElementById('receipt-items');
        list.innerHTML = '';
        orderData.items.forEach(item => {
          list.innerHTML += `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>Rs. ${(item.price * item.quantity).toLocaleString()}</td></tr>`;
        });
        document.getElementById('receipt-total').textContent = 'Rs. ' + cartTotalPriceValue.toLocaleString();
        receiptOverlay.classList.add('active');
      }

      btn.innerHTML = originalText;
      btn.disabled = false;
    });
  }

  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => receiptOverlay.classList.remove('active'));
  }

  const confirmPrintBtn = document.getElementById('confirm-print-btn');
  if (confirmPrintBtn) {
    confirmPrintBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(165, 149, 111);
      doc.text("ShoeMart", 105, 30, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text("Official Purchase Receipt", 105, 40, { align: 'center' });
      doc.text(`Date: ${new Date().toLocaleString()}`, 105, 48, { align: 'center' });
      
      doc.setDrawColor(230);
      doc.line(20, 55, 190, 55);

      doc.autoTable({
        startY: 65,
        head: [['Item', 'Qty', 'Price (Rs.)']],
        body: lastOrderedItems.map(item => [item.name, item.quantity, (item.price * item.quantity).toLocaleString()]),
        theme: 'striped',
        headStyles: { fillColor: [165, 149, 111] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text(`Total Amount: Rs. ${cartTotalPriceValue.toLocaleString()}`, 190, finalY, { align: 'right' });
      
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Thank you for shopping with ShoeMart!", 105, finalY + 20, { align: 'center' });

      doc.save(`ShoeMart_Receipt_${new Date().getTime()}.pdf`);
    });
  }

  loadInitialData();
  updateCartUI();

})();
