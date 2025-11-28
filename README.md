# OrderHub - Modern Restaurant Ordering System

OrderHub is a robust, full-stack web application designed to streamline food ordering for customers and management for restaurant administrators. The system is built on a secure and scalable RESTful API architecture, seamlessly integrated with a dynamic React frontend to ensure high performance and maintainability.

## Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js (Vite/CRA)
* **State Management:** Redux Toolkit (Global state for Auth, Cart, Menu, Orders)
* **Styling:** Bootstrap 5 (Responsive UI), FontAwesome (Icons)
* **Routing:** React Router v6 (Protected & Admin Routes)
* **HTTP Client:** Axios (with Interceptors for JWT injection)
* **Notifications:** React Toastify

### Backend (Server-Side)
* **Runtime:** Node.js & Express.js
* **Database:** MySQL
* **ORM:** Sequelize (Schema definition, Associations, Validation)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt (Password Hashing)
* **File Handling:** Multer (Image uploads)
* **Security:** CORS, Express-Validator

---

## Key Features

### Customer Features
* **Authentication:** Secure Sign Up and Login.
* **Browse Menu:** View items with images, prices, and categories (Pizza, Burger, etc.).
* **Search & Filter:** Real-time searching and category filtering.
* **Shopping Cart:** Add/Remove items, adjust quantities, auto-calculate totals.
* **Checkout:** Review order summary and confirm payment (Cash on Delivery).
* **Order History:** View past orders and their current status.

### Admin Dashboard
* **Dashboard Stats:** Real-time overview of Total Revenue, Total Orders, Active Users, and Pending Orders.
* **Menu Management:** Add, Edit, and Delete menu items. Includes image uploading.
* **Order Management:** View all incoming orders and update status (Pending -> Processing -> Delivered).
* **User Management:** View list of registered users.

---
