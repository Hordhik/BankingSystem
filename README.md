# 💸 Fluit Banking App Dashboard
## 🏦 About The Project

**Fluit** is a modern banking application designed to provide a seamless and intuitive digital banking experience.  
It includes a **responsive public-facing landing page** to attract new users and a **comprehensive, feature-rich dashboard** for existing customers to manage their finances.

This project demonstrates **modern frontend development practices**, including:
- Component-based architecture  
- Responsive design  
- Dynamic rendering  

---

## 🚀 Key Features

### 🏛️ Landing Page
A visually appealing and informative promotional page with:
- **Responsive Header:** Sticky header with scroll-spy navigation and a hamburger menu for mobile.  
- **Feature Sections:** Hero section, card carousel, onboarding flowchart, features grid, and loans section.  

### 📊 User Dashboard
A secure and modular dashboard for all user activities:
- **Dynamic Content:** Sidebar navigation dynamically renders page-specific content.  
- **Payments & Transfers:** Central hub for viewing card details, balances, transfer options, and recent activities.  
- **Card Management:** Manage cards, view limits, set PINs, and apply for new cards.  
- **Financial Products:** Tabbed interface to explore loans, investments, and personal portfolio.  
- **Exclusive Offers:** Combined view of personalized *Pre-Approved* and *Partner* offers.  

---

## 🧠 Tech Stack

This project is built with a modern frontend stack:

| Technology | Purpose |
|-------------|----------|
| ⚛️ **React** | Building user interfaces |
| ⚡ **Vite** | Next-gen frontend tooling for fast development |
| 🧭 **React Router** | Declarative routing |
| 🎨 **CSS (Flexbox + Grid)** | Fully responsive layouts |

---

## 📁 Project Structure

```bash
/src
|-- /assets/
|-- /components/           # Shared components (Header, Sections, etc.)
|-- /Dashboard/
|   |-- /CardsPage/
|   |-- /LoansSection/
|   |-- /OffersSection/
|   |-- /Payments/
|   |-- /PortfolioSection/
|   |-- /Transactions/
|   |-- Dashboard.jsx
|   `-- Dashboard.css
|
|-- /LandingPage/
|   |-- Landingpage.jsx
|   `-- Landingpage.css
|
|-- App.jsx                # Main application component (handles routing)
`-- main.jsx               # Application entry point
