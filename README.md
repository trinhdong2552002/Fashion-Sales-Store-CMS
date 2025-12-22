# 🛡️ Fashion Store - Admin CMS Dashboard

> The Management Dashboard for Fashion Sales Store. Allows administrators to manage products, orders, users, and view sales statistics.

### 🔗 Live Demo & API
* **Live App:** [https://fashion-sales-store.site.name.vn](https://fashion-sales-store.site.name.vn)
* **Backend API:** [Swagger UI Link](https://springadamstore-production.up.railway.app/adamstore/swagger-ui/index.html)

---

### 🔐 Admin Credentials (Login Info)
**Use this account to access the dashboard:**

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `123456` |

---

## 📸 Screenshots

* Admin Dashboard

 <img width="1920" height="963" alt="image" src="https://github.com/user-attachments/assets/13ca00e1-1d3c-4d64-8a38-4d9fdc51cb8e" />
 <img width="1920" height="965" alt="image" src="https://github.com/user-attachments/assets/b590e3a5-eb2e-4336-8b51-9475ab40cf79" />
 <img width="1920" height="961" alt="image" src="https://github.com/user-attachments/assets/085dae27-5ec7-48d7-aefb-2c1f4655a361" />
 <img width="1919" height="958" alt="Screenshot 2025-12-22 at 15 21 24" src="https://github.com/user-attachments/assets/b2640523-4c05-4936-9123-8a968a243897" />
 <img width="1920" height="962" alt="image" src="https://github.com/user-attachments/assets/d4fd6dc7-1be3-423a-8a45-781448542d74" />
 <img width="1920" height="962" alt="image" src="https://github.com/user-attachments/assets/9495766b-350d-4dff-a6fc-6a3168d69c7b" />
 <img width="1920" height="960" alt="image" src="https://github.com/user-attachments/assets/0028cbc0-6e7a-47aa-a67b-6a46c334b3be" />
 <img width="1920" height="963" alt="image" src="https://github.com/user-attachments/assets/44adcab1-90f1-4b56-92d1-4fc25553e15b" />


## 🚀 Tech Stack

**Frontend:**
* ![React](https://img.shields.io/badge/React-19-blue) **ReactJS (Vite)**
* ![Redux](https://img.shields.io/badge/Redux-Toolkit-purple) **Redux Toolkit & RTK Query**
* ![MUI](https://img.shields.io/badge/MUI-Material_UI-blue) **Material UI**
* **Authentication:** JWT, React Router DOM (Protected Routes)

---

## 🛠️ Installation & Setup (Local Development)

### 1. Frontend Setup (Client)

Prerequisites: Node.js (v18+) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/trinhdong2552002/Fashion-Sales-Store-CMS.git
cd Fashion-Sales-Store

# 2. Install dependencies
npm install

# 3. Create .env file (if needed) and run development server
npm run dev

```
Open http://localhost:5173 to view it in the browser.

To build for production:
   npm run build

### 2. Backend Setup (Docker)
You can run the full backend stack (Spring Boot + MySQL + Redis) instantly using Docker.
```bash
# 1. Clone the Backend repository
git clone https://github.com/trinhdong2552002/Spring_AdamStore.git
cd Spring_AdamStore

# 2. Stop any running containers (optional)
docker-compose down

# 3. Start the application
docker-compose up -d
```
Note: The backend service requires environment variables (.env). Please contact the author if you need the env file for local development, or use the Docker image provided.

## 📖 API Documentation & Testing
Once the backend is running (locally or live), you can explore the API endpoints via Swagger UI:

``` bash
Local Swagger: http://localhost:8080/adamstore/swagger-ui/index.html

JSON Docs: http://localhost:8080/adamstore/v3/api-docs/backend-service
```

## 💳 Test Payment Credentials (VNPAY)
Use these credentials to test the payment flow in Sandbox mode:

| Bank                  | NCB                      |
|-----------------------|--------------------------|
| Card Number           | 9704198526191432198      |
| Cardholder Name       | NGUYEN VAN A             |
| Issue Date            | 07/15                    |
| OTP Password          | 123456                   |
