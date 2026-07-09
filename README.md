# New Murtaza Asif Traders Firebase Store

A clean electronics e-commerce website built from the Gemini chat brief, adapted to use Firebase instead of PostgreSQL.

## Features

- React + Vite storefront with responsive product catalog, product detail, cart, checkout, account, admin, and support pages.
- Redux Toolkit cart with localStorage persistence.
- Firebase-ready Firestore catalog and order services.
- Firebase Auth-ready account page.
- Demo catalog fallback, so the website runs before Firebase keys are configured.

## Run Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and add Firebase web app keys to enable Firestore/Auth writes.

## Firebase Collections

- `products`: product documents keyed by product id or slug.
- `orders`: checkout records with customer, items, payment method, subtotal, shipping, total, and status.

When Firebase is not configured, product data comes from `src/data/demoCatalog.js` and orders/admin saves use local demo storage.
