# Link-Shortener
A production-ready URL shortener backend built with NestJS, Prisma, and PostgreSQL. Features include short link generation, redirection, click tracking, and clean scalable architecture.

# 🔗 URL Shortener Service (NestJS + Prisma)

A modern URL shortener backend built with **NestJS**, **Prisma**, and **PostgreSQL (Neon)**.
This project demonstrates clean architecture, REST API design, and production-ready backend practices.

---

## 🚀 Features

* 🔗 Create short URLs from long URLs
* ⚡ Fast redirect to original URL
* 📊 Click tracking (analytics)
* 🧾 URL statistics endpoint
* 🧠 Custom alias support
* 🛡️ Input validation using DTO
* ⚙️ Environment-based configuration

---

## 🧱 Tech Stack

* **Backend Framework**: NestJS
* **ORM**: Prisma
* **Database**: PostgreSQL (Neon)
* **Validation**: class-validator
* **Language**: TypeScript

---

## 📁 Project Structure

```
src/
 ├ config/
 ├ prisma/
 │   ├ prisma.service.ts
 │   └ prisma.module.ts
 │
 ├ url/
 │   ├ dto/
 │   ├ url.controller.ts
 │   ├ url.service.ts
 │   └ url.module.ts
 │
 ├ app.module.ts
 └ main.ts

prisma/
 ├ schema.prisma
 └ prisma.config.ts
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="your_postgresql_connection_string"
BASE_URL="http://localhost:3000"
```

---

## 🛠️ Installation

```bash
# install dependencies
npm install

# generate prisma client
npx prisma generate

# run migrations (optional if schema already applied)
npx prisma migrate dev

# start development server
npm run start:dev
```

---

## 📡 API Endpoints

### 🔹 Create Short URL

```
POST /shorten
```

**Request Body:**

```json
{
  "originalUrl": "https://example.com",
  "customAlias": "optionalAlias"
}
```

**Response:**

```json
{
  "id": "...",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://example.com",
  "createdAt": "..."
}
```

---

### 🔹 Redirect

```
GET /:shortCode
```

**Behavior:**

* Redirects to original URL
* Increments click count
* Returns 404 if not found or expired

---

### 🔹 Get Statistics

```
GET /stats/:shortCode
```

**Response:**

```json
{
  "id": "...",
  "shortCode": "abc123",
  "originalUrl": "https://example.com",
  "clickCount": 10,
  "createdAt": "..."
}
```

---

## 🧠 How It Works

1. User submits a long URL
2. System generates a unique short code (Base62)
3. URL is stored in database
4. Accessing the short URL:

   * looks up database
   * increments click count
   * redirects to original URL

---

## 📈 Future Improvements

* Redis caching for faster redirects
* Rate limiting (anti abuse)
* Advanced analytics (IP, device, location)
* Authentication & user dashboard
* Custom domain support
* Queue system for event tracking

---

## 👨‍💻 Author

Built by **Hammam Muhammad Yazid**
Computer Science student & backend enthusiast 🚀

---

## ⭐ Notes

This project is designed as a **portfolio-level backend system** focusing on:

* Clean architecture
* Scalability considerations
* Real-world backend patterns
