# TradeWithUs - B2B Trading Platform

A modern B2B platform for connecting traders and showcasing products.


## Project Overview

TradeWithUs is a full-stack application that enables businesses to create profiles, list products, and connect with potential trading partners. The platform features:

- Company profile management
- Product catalog with detailed listings
- User authentication and authorization
- Responsive design for desktop and mobile devices


## Deployment

The application is deployed and accessible at the following URLs:

- **Frontend:** https://tradewithus.udayps.com/
- **Backend API:** https://tradewithapi.udayps.com (via PHP reverse proxy)



## Repository Structure
```
tradewithus/
├── next/               # Frontend (Next.js)
├── backend/
│   ├── backend_JS/     # Node.js/Express/TypeScript backend
│   └── backend_JAVA/   # Java Spring Boot backend (alternative implementation)
└── README.md           # This file
```

## Components

### Frontend (Next.js)

The frontend is built with Next.js and provides:
- Dynamic company profiles
- Product catalog browsing
- Responsive design

[Frontend Documentation](./next/README.md)

### Backend

#### JavaScript/TypeScript Implementation

Node.js, Express, TypeScript, and MongoDB-based backend:
- RESTful API for products and profiles
- JWT authentication
- Database seeding

[Node.js Backend Documentation](./backend/backend_JS/README.md)

#### Java Implementation

Alternative Spring Boot and MongoDB-based backend:
- Feature parity with JS implementation
- Spring Security with JWT
- Maven build system

[Java Backend Documentation](./backend/backend_JAVA/README.md)

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- Java 17 (for Java backend only)
- Maven (for Java backend only)

### Running the Application

1. **Start the backend:**

   JavaScript backend:
   ```bash
   cd backend/backend_JS
   npm install
   npm run seed  # Optional: populate with sample data
   npm run dev
   ```

   Or Java backend:
   ```bash
   cd backend/backend_JAVA
   mvn clean install
   mvn spring-boot:run
   ```

2. **Start the frontend:**
   ```bash
   cd next
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## API Endpoints

Both backend implementations expose the same API endpoints:

- **Authentication:**
  - `POST /auth/signup` - Register a new user
  - `POST /auth/login` - Log in and get JWT token
  - `GET /auth/me` - Get current user info

- **Products:**
  - `GET /product/all` - Get all products
  - `GET /product/{productId}` - Get product by ID
  - `POST /product` - Create product (requires auth)
  - `PUT /product/{productId}` - Update product (requires auth)
  - `DELETE /product/{productId}` - Delete product (requires auth)

- **Profiles:**
  - `GET /profile/all` - Get all profiles
  - `GET /profile/{profileId}` - Get profile by ID
  - `POST /profile` - Create profile (requires auth)
  - `PUT /profile/{profileId}` - Update profile (requires auth)
  - `DELETE /profile/{profileId}` - Delete profile (requires auth)

For detailed API documentation, refer to the backend README files. 