# 💸 Fluit Banking System

> **A modern, secure, and full-stack digital banking experience.**

**Fluit** is a comprehensive banking application designed to demonstrate a production-ready full-stack architecture. It seamlessly integrates a robust **Spring Boot** backend with a dynamic **React** frontend to provide users with a premium digital banking interface.

The system features a public-facing landing page for customer acquisition and a secure, feature-rich dashboard for account management, transactions, and financial planning.

---

## 🚀 Key Features

### 🏛️ Frontend (Client)
- **Modern UI/UX:** Built with React and CSS Grid/Flexbox for a responsive, premium feel.
- **Landing Page:** Interactive promotional page with scroll-spy navigation and onboarding flows.
- **User Dashboard:**
    - **Dynamic Sidebar:** Context-aware navigation.
    - **Financial Overview:** Real-time balance updates and transaction history.
    - **Card Management:** View card details, set PINs, and block/unblock cards.
    - **Loan & Portfolio:** Apply for loans and view investment summaries.
    - **Offers:** Personalized pre-approved offers.

### 🔐 Backend (Server)
- **Secure Authentication:** JWT-based stateless authentication with BCrypt password hashing.
- **RESTful API:** Well-structured endpoints for users, accounts, loans, and transactions.
- **Database Integration:** JPA/Hibernate with MySQL (production) or H2 (dev) support.
- **Role-Based Access:** Secure endpoints for Users and Admins.
- **Robust Error Handling:** Global exception handling for consistent API responses.

---

## 🛠️ Tech Stack

### Frontend
| Tech | Description |
|------|-------------|
| ⚛️ **React** | Component-based UI library |
| ⚡ **Vite** | Next-generation frontend tooling |
| 🧭 **React Router** | Client-side routing |
| 🎨 **CSS3** | Custom responsive styling (Variables, Flexbox, Grid) |
| 🔄 **Axios** | HTTP client for API communication |

### Backend
| Tech | Description |
|------|-------------|
| ☕ **Java 17** | Core programming language |
| 🍃 **Spring Boot 3** | Backend framework (Web, Security, Data JPA) |
| 🔒 **Spring Security** | Authentication & Authorization (JWT) |
| 🗄️ **MySQL / H2** | Relational Database Management |
| 🏗️ **Maven** | Dependency management & build tool |

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v16+) & **npm**
- **Java Development Kit (JDK)** (v17+)
- **Maven**
- **MySQL** (Optional, defaults to H2 in-memory DB if configured)

### 1️⃣ Backend Setup (Server)

1.  Navigate to the server directory:
    ```bash
    cd Server
    ```
2.  Configure the database in `src/main/resources/application.properties` (if using MySQL).
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    The server will start on `http://localhost:6060`.

### 2️⃣ Frontend Setup (Client)

1.  Navigate to the client directory:
    ```bash
    cd Client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will be accessible at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate and receive JWT |
| **GET** | `/api/loans` | Fetch all loans (Admin) / User loans |
| **POST** | `/api/loans/apply` | Apply for a new loan |
| **GET** | `/api/cards` | Fetch user cards |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
