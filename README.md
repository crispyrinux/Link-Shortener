<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
=======
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
>>>>>>> b4d6737ca39b63edeb6e238b7ff0995753e9a568
