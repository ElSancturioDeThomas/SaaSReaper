import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

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
