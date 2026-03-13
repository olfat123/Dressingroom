# Dressingroom

A full-featured multi-vendor e-commerce platform built with Laravel, Inertia.js, and React. Dressingroom supports multiple vendors, product variations, order management, a blog, coupons, and a modern bilingual (Arabic / English) storefront.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 18, Inertia.js 2 |
| Styling | Tailwind CSS 3, custom design tokens |
| Icons | Lucide React |
| Admin panel | Filament |
| Media | Spatie Media Library |
| Payments | Paymob |
| Build tool | Vite 6 |
| Database | MySQL |

## Features

- **Multi-vendor** — vendors can list products and manage their own store
- **Product variations** — support for size, color, and custom attribute types
- **Cart & Checkout** — persistent cart, coupon codes, address book, multiple payment methods
- **Order management** — order tracking, status updates, reorder, and cancellation
- **Blog** — categorized posts with related articles
- **Wishlist** — per-user saved products
- **Bilingual** — full Arabic and English support with RTL layout
- **Admin panel** — Filament-powered dashboard for managing products, orders, vendors, and settings

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL

## Installation

```bash
# Clone the repository
git clone https://github.com/olfat123/Dressingroom.git
cd Dressingroom

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Copy environment file and generate key
cp .env.example .env
php artisan key:generate

# Configure your database in .env, then run migrations and seeders
php artisan migrate --seed

# Build frontend assets
npm run build

# Start the development server
php artisan serve
```

For local development with hot-reload:

```bash
npm run dev
```

## Environment Variables

Key variables to set in `.env`:

```
APP_URL=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

MAIL_MAILER=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=

PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_IFRAME_ID=

FILESYSTEM_DISK=public
```

## License

This project is proprietary software. All rights reserved.
