# SaaS Reaper

**Stop getting fucked by auto-renewals**

SaaS Reaper is a subscription management application that helps you track and manage your recurring SaaS subscriptions, preventing unexpected auto-renewals and helping you stay on top of your monthly expenses.

## 🌐 Live Application

**Production URL:** [https://app.saasreaper.com](https://app.saasreaper.com)

## 📋 Overview

SaaS Reaper is a Next.js-based web application designed to help users track their SaaS subscriptions, monitor renewal dates, and manage subscription costs. The app provides a clean, modern interface for managing multiple subscriptions with features like customizable reminders, multi-currency support, and a freemium payment model.

### Key Features

- **Subscription Tracking**: Add and manage multiple SaaS subscriptions with details like renewal dates, seat counts, and per-seat costs
- **Smart Reminders**: Configure reminders at 5 days, 2 days, 1 day, and 1 hour before renewal dates
- **Multi-Currency Support**: View costs in USD, EUR, GBP, JPY, CAD, or AUD
- **Cost Analytics**: See your total monthly subscription costs at a glance
- **Freemium Model**: Free tier allows tracking up to 3 subscriptions; one-time payment ($9.97) unlocks unlimited tracking
- **User Authentication**: Secure sign-up and sign-in functionality
- **Payment Integration**: Stripe integration for one-time payments to unlock premium features

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: Neon (PostgreSQL) with serverless driver
- **Authentication**: Custom cookie-based session management
- **Payments**: Stripe for payment processing
- **Deployment**: Vercel

## 📁 Project Structure

```
├── app/
│   ├── actions/          # Server actions for auth, payments, subscriptions
│   ├── auth/             # Sign-in and sign-up pages
│   ├── payment/           # Payment success page
│   └── page.tsx          # Main dashboard
├── components/
│   ├── ui/               # Reusable UI components (Radix UI)
│   ├── subscription-manager.tsx
│   ├── subscription-card.tsx
│   ├── add-subscription-dialog.tsx
│   └── payment-dialog.tsx
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection and types
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Utility functions
└── scripts/              # SQL migration scripts
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users_sync**: User accounts with email, password hash, and name
- **subscriptions**: Subscription records with renewal dates, seat counts, costs, and reminder preferences
- **user_payments**: Payment records tracking which users have unlocked premium features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Neon PostgreSQL database
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 28_SaasReaper
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL=your_neon_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run database migrations:
Execute the SQL scripts in the `scripts/` directory in order:
- `00_create_users_table.sql`
- `01_create_subscriptions_table.sql`
- `02_add_foreign_keys.sql`

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔒 Security Notes

⚠️ **Important**: The current authentication implementation uses SHA-256 for password hashing, which is not secure for production use. Consider migrating to bcrypt or Argon2 before deploying to production.

## 📄 License

Private project - All rights reserved
