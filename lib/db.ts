import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env.local file."
  );
}

// Ensure the connection string is properly formatted
// Remove any trailing whitespace and ensure it's a valid string
let connectionString = databaseUrl.trim();

// If using pooler endpoint, try converting to non-pooler for serverless driver
// The serverless driver may need the direct connection endpoint
if (connectionString.includes('-pooler.')) {
  // Replace pooler endpoint with direct endpoint
  connectionString = connectionString.replace('-pooler.', '.');
}

export const sql = neon(connectionString);

export interface Subscription {
  id: number;
  user_id: string;
  name: string;
  renewal_date: string;
  seats: number;
  cost_per_seat: number;
  remind_5d: boolean;
  remind_2d: boolean;
  remind_1d: boolean;
  remind_1h: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPayment {
  id: number;
  user_id: string;
  has_paid: boolean;
  stripe_payment_intent_id?: string;
  paid_at?: string;
  created_at?: string;
}
