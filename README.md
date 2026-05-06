# ShoeMart - Responsive E-commerce Website

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,figma" />
  </a>
</p>

---

ShoeMart is a high-end, fully responsive e-commerce solution. This frontend implementation provides a premium shopping experience for customers and a robust management suite for administrators, all powered by clean, modular Vanilla JavaScript.

## 🌟 Key Modules

### 🛒 Customer Storefront
- **Dynamic Shopping Cart:** Real-time persistence with `sessionStorage`, quantity controls, and live subtotal calculations.
- **Secure Payment Gateway:** Simulated multi-method checkout (Card, PayPal, COD) with processing states and validation.
- **Instant Receipts:** Professional PDF receipt generation upon purchase completion.
- **Fluid Navigation:** Category-based filtering and smooth scroll-reveal animations.

### 🛡️ Admin Management Suite
- **Executive Dashboard:** Real-time financial overview with dynamic **Chart.js** revenue visualization.
- **Inventory Control:** Full CRUD operations for product management with image upload support.
- **Order Analytics:** Itemized order tracking with customer details and status management.
- **Data Export:** Generate professional **PDF Sales Reports** and **XLSX Inventory Exports** instantly.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core** | HTML5 (Semantic), CSS3 (Grid/Flexbox), JavaScript (ES6+) |
| **Charts** | [Chart.js](https://www.chartjs.org/) for data visualization |
| **Reporting** | [jsPDF](https://github.com/parallax/jsPDF) & [SheetJS](https://sheetjs.com/) |
| **Design** | [Montserrat](https://fonts.google.com/specimen/Montserrat) & [Outfit](https://fonts.google.com/specimen/Outfit) Typography |

## 📂 Modular Project Structure

The project follows a modular "Asset-First" architecture for maximum maintainability:

```text
/
├── index.html              # Main Storefront entry
├── admin-login.html        # Admin Entry Portal
├── admin-dashboard.html    # Executive Management Suite
├── assets/
│   ├── css/
│   │   ├── style.css       # Core design system
│   │   ├── admin-style.css # Dashboard-specific styles
│   │   └── admin-login.css # Login portal aesthetics
│   ├── js/
│   │   ├── main.js        # Storefront & Cart logic
│   │   ├── admin-script.js # Dashboard & Reporting logic
│   │   └── admin-login.js  # Admin Auth logic
│   └── images/             # Optimized assets & product media
└── README.md
```

## 🚀 Getting Started

1. **Clone the Project:**
   ```bash
   git clone https://github.com/rishinduyohan/shoe-mart-responsive-web.git
   ```
2. **Launch Application:**
   Open `index.html` in any modern browser.
3. **Admin Access:**
   Navigate to `admin-login.html`. 
   *Note: Ensure the Backend API is running for live data functionality.*

## 💎 Design Standards
- **Clean Code:** 100% comment-free, production-ready source code.
- **Premium UI:** Glassmorphism effects, curated "Mocha" color palette (`#A5956F`).
- **Responsive:** Fluid typography using `clamp()` and 100% adaptive layouts.

---