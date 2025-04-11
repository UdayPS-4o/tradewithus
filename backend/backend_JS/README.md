# TradeWithUs - Backend Service

## Overview

This directory contains the backend service for the TradeWithUs B2B platform. It handles managing trader profiles, product catalogs, and user authentication using a Node.js, Express, TypeScript, and MongoDB stack.

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** JWT (jsonwebtoken)
*   **Validation:** express-validator
*   **Development:** ts-node-dev, nodemon

## Features

*   **Catalog Management Service:** Handles product data (CRUD operations).
*   **Profile Management Service:** Handles trader profile data (CRUD operations).
*   **Authentication:** User signup and login using JWT.
*   **Data Validation:** Middleware for validating incoming request data.
*   **Error Handling:** Centralized error handling middleware.
*   **Database Seeding:** Scripts to populate the database with initial/sample data.
*   **API Testing:** Basic end-to-end tests for API endpoints using `fetch`.
*   **Environment Configuration:** Uses `.env` files for managing secrets and settings.

## Project Structure (Backend)

```
backend/
├── src/
│   ├── config/        # Database connection, etc.
│   ├── controllers/   # Request handlers
│   ├── database/      # Seeding scripts
│   ├── middleware/    # Express middleware (auth, validation, errors)
│   ├── models/        # Mongoose schemas and models
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic and database interactions
│   ├── tests/         # API tests
│   ├── types/         # Shared TypeScript types/interfaces
│   └── index.ts       # Main application entry point
├── .env               # Local environment variables (ignored by git)
├── .env.example       # Example environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json      # TypeScript configuration
```

## Setup and Running

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   MongoDB (Running locally or accessible via URI)
*   Git

### Installation

1.  **Clone the repository (if not already done):**
    ```bash
    git clone https://github.com/UdayPS-4o/tradewithus
    cd tradewithus/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file and add your specific configuration:
        ```dotenv
        PORT=8000
        MONGODB_URI=mongodb://localhost:27017/tradewithus # Replace with your MongoDB connection string
        JWT_SECRET=your_strong_jwt_secret_key # IMPORTANT: Change this for production
        API_URL=http://localhost:8000 # Base URL for the backend (used in tests)
        ```

### Running the Server

1.  **Compile TypeScript (for production or before running tests):**
    ```bash
    npm run build
    ```

2.  **Seed the database (Optional but recommended for testing/development):**
    *   To populate with a minimal dataset:
        ```bash
        npm run seed:min
        ```
    *   To populate with a larger, more comprehensive dataset (overwrites existing data):
        ```bash
        npm run seed
        ```

3.  **Start the server:**
    *   **Development Mode** (with auto-recompilation and restart on file changes):
        ```bash
        npm run dev
        ```
    *   **Production Mode** (runs the compiled JavaScript code from `dist/`):
        ```bash
        npm start
        ```
    The backend server should now be running on the port specified in your `.env` file (default: `http://localhost:8000`).

### Running Tests

Ensure the server is **not** running in a separate terminal, as the test script will start its own instance.

```bash
npm test
```
This command will compile the TypeScript code and then run the API tests defined in `src/tests/api.test.ts`.

## API Endpoints & Usage

The backend exposes RESTful APIs for managing products, profiles, and authentication.

**Base URL:** (As defined in `.env`, e.g., `http://localhost:8000`)

### Authentication 

*   **`POST /auth/signup`**: Register a new user.
    *   Body: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "password123" }`
*   **`POST /auth/login`**: Log in an existing user, returns JWT token.
    *   Body: `{ "email": "john.doe@example.com", "password": "password123" }`
*   **`GET /auth/me`**: Get current user details (Requires Bearer Token).
    *   Header: `Authorization: Bearer <your_jwt_token>`
*   **`DELETE /auth/user/{userId}`**: Delete a user (Requires Bearer Token of the user being deleted).
    *   Header: `Authorization: Bearer <your_jwt_token>`

### Catalog Management Service

*   **`GET /product/all`**: Get all products.
*   **`GET /product/{productId}`**: Get a specific product by its `productId`.
    *   Example: `GET /product/black-pepper`
*   **`POST /product`**: Create a new product.
    *   Requires Bearer Token authentication.
    *   Body: (See `src/models/Product.ts` for schema, `src/database/seed.ts` for examples)
    ```json
    {
      "productId": "unique-product-id-123",
      "productName": "New Gadget",
      "images": ["url1", "url2"],
      "sellerId": "seller-profile-id",
      "price": { "current": 99, "range": { "min": 90, "max": 110 } },
      "details": { "name": "Gadget", "product": "Electronic Gadget", "origin": "China", ... },
      "shipping": { "hsCode": "HS8517", "minQuantity": "10", ... }
    }
    ```
*   **`PUT /product/{productId}`**: Update an existing product.
    *   Requires Bearer Token authentication.
    *   Body: Same structure as POST, provide fields to update.
*   **`DELETE /product/{productId}`**: Delete a product.
    *   Requires Bearer Token authentication.

#### Example `curl` commands (Products):

```bash
# Get all products
curl http://localhost:8000/product/all

# Get specific product
curl http://localhost:8000/product/black-pepper

# Create a new product (replace <token> with actual JWT)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{ ...product_data... }' http://localhost:8000/product

# Update a product (replace <token>)
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{ "productName": "Updated Name" }' http://localhost:8000/product/unique-product-id-123

# Delete a product (replace <token>)
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/product/unique-product-id-123
```

### Profile Management Service

*   **`GET /profile/all`**: Get all profiles.
*   **`GET /profile/{profileId}`**: Get a specific profile by its `profileId`.
    *   Example: `GET /profile/kmg-robust`
*   **`POST /profile`**: Create a new profile.
    *   Requires Bearer Token authentication.
    *   Body: (See `src/models/Profile.ts` for schema, `src/database/seed.ts` for examples)
    ```json
    {
      "profileId": "unique-profile-id-456",
      "businessName": "Awesome Corp",
      "logo": "https://example.com/logo.png",
      "businessOverview": "We make awesome things.",
      ...rest of profile fields
    }
    ```
*   **`PUT /profile/{profileId}`**: Update an existing profile.
    *   Requires Bearer Token authentication.
    *   Body: Same structure as POST, provide fields to update.
*   **`DELETE /profile/{profileId}`**: Delete a profile.
    *   Requires Bearer Token authentication.

#### Example `curl` commands (Profiles):

```bash
# Get all profiles
curl http://localhost:8000/profile/all

# Get specific profile
curl http://localhost:8000/profile/kmg-robust

# Create a new profile (replace <token>)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{ ...profile_data... }' http://localhost:8000/profile

# Update a profile (replace <token>)
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{ "businessName": "Updated Business Name" }' http://localhost:8000/profile/unique-profile-id-456

# Delete a profile (replace <token>)
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8000/profile/unique-profile-id-456
```

## Database Design

MongoDB is used with Mongoose ODM. The following collections are defined:

*   **`products` Collection:** Stores product details. Schema defined in `src/models/Product.ts`.
*   **`profiles` Collection:** Stores trader profile information. Schema defined in `src/models/Profile.ts`.
*   **`users` Collection:** Stores user authentication details (email, hashed password, name). Schema defined in `src/models/User.ts`.

Relationships are primarily handled by storing IDs (e.g., `sellerId` in the `Product` model refers to a `profileId` in the `Profile` model).

## Code Quality & Concepts

*   **Modularity:** Code is organized into services, controllers, models, routes, and middleware following standard Express patterns.
*   **Separation of Concerns:** Database logic is encapsulated within services and models, distinct from request/response handling in controllers.
*   **TypeScript:** Utilizes strong typing for better code safety and maintainability.
*   **Asynchronous Operations:** Leverages `async/await` for non-blocking I/O operations.
*   **Dependency Injection (Implicit):** Services and controllers are typically instantiated and exported as singletons.

## Available Scripts

In the `package.json`, you can find the following scripts:

*   `npm start`: Starts the production server (runs compiled JS from `dist/`).
*   `npm run dev`: Starts the development server using `ts-node-dev` for auto-reloading.
*   `npm run build`: Compiles TypeScript code to JavaScript in the `dist/` directory.
*   `npm run seed`: Clears and seeds the database with the full dataset from `src/database/seed.ts`.
*   `npm run seed:min`: Clears and seeds the database with the minimal dataset from `src/database/seed_min.ts`.
*   `npm test`: Runs the API tests located in `src/tests/api.test.ts`. 