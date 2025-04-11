# TradeWithUs Frontend

This is the frontend application for TradeWithUs. It's built with Next.js and connects to the backend API.

## Prerequisites

- Node.js (v14 or higher)
- Backend service running on http://localhost:8000

## Installation

1. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Frontend Features

- Dynamic company profiles
- Product catalog
- Responsive design

## Connection to Backend

The frontend connects to the backend API to fetch data for:

- Company profiles
- Product catalog

The API connection is configured in `app/api/index.ts` and set to use the backend at `http://localhost:8000`. If your backend is running on a different URL, you'll need to update this configuration.

## Important Files

- `app/[companyId]/page.tsx` - Company profile page
- `app/[companyId]/products/[productId]/page.tsx` - Product detail page
- `app/api/index.ts` - API client for connecting to the backend

## Development

Before running the frontend, make sure the backend server is up and running:

1. Start the backend server:
```bash
cd ../backend_JS
npm start
```

2. If the database is empty, seed it with initial data:
```bash
npm run seed
```

3. Then start the frontend:
```bash
cd ../next
npm run dev
``` 