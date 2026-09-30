# Fixora Admin Web Portal

> **Modern Admin Web Dashboard for Fixora Repair Shop Management System**

Fixora Web Admin Portal is built with **Vite**, **React 18**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Axios**. It provides shop owners and managers with a web interface to log in, configure branch locations, manage staff roles (`ROLE_OWNER`, `ROLE_MANAGER`, `ROLE_TECHNICIAN`, `ROLE_RECEPTIONIST`, `ROLE_ACCOUNTANT`), monitor repair jobs, manage inventory, and configure global shop settings.

---

## 🚀 Quick Start (Development)

1. Open terminal in `D:\Personal\fixora-web`:
   ```bash
   npm install
   npm run dev
   ```
   *(Or double-click `run-web.bat` on Windows)*

2. Open browser to:
   👉 **`http://localhost:3000`**

3. Log in with pre-seeded staff credentials:
   - **Email**: `karim@techcare.com`
   - **Password**: `password123`

---

## 🛠️ Tech Stack & Key Features
- **Vite + React 18 + TypeScript**: Ultra-fast SPA application with hot module replacement.
- **Tailwind CSS**: Modern slate theme with cyan/blue accents.
- **Spring Boot REST API Proxy**: Proxies `/api/*` to `http://localhost:8082` (or `http://localhost:8080`).
- **Lucide React Icons**: Crisp vector icon set.
- **Stateless JWT Auth Context**: Automatic token persistence and 401 error interceptor redirection.

---

## 📄 License
Copyright © 2026 Fixora Platform. All rights reserved.
