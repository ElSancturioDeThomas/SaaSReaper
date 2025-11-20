"use server";

import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { Subscription } from "@/lib/db";

export async function getSubscriptions() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Query subscriptions from database
  const subscriptions = await sql`
    SELECT * FROM subscriptions 
    WHERE user_id::text = ${user.id}
    ORDER BY renewal_date ASC
  `;

  // Transform database format (snake_case) to component format (camelCase with nested reminders)
  return subscriptions.map((sub: any) => {
    // Convert renewal_date to string format (YYYY-MM-DD for date inputs)
    let renewalDate = '';
    if (sub.renewal_date) {
      if (sub.renewal_date instanceof Date) {
        renewalDate = sub.renewal_date.toISOString().split('T')[0];
      } else if (typeof sub.renewal_date === 'string') {
        // If it's already a string, use it directly (might be YYYY-MM-DD or ISO string)
        renewalDate = sub.renewal_date.split('T')[0];
      } else {
        renewalDate = String(sub.renewal_date);
      }
    }

    return {
      id: sub.id?.toString() || String(sub.id),
      user_id: sub.user_id,
      name: sub.name || '',
      renewalDate,
      seats: sub.seats || 0,
      seatCost: sub.cost_per_seat != null ? parseFloat(String(sub.cost_per_seat)) : 0,
      reminders: {
        fiveDays: sub.remind_5d ?? false,
        twoDays: sub.remind_2d ?? false,
        oneDay: sub.remind_1d ?? false,
        oneHour: sub.remind_1h ?? false,
      },
      created_at: sub.created_at ? (sub.created_at instanceof Date ? sub.created_at.toISOString() : String(sub.created_at)) : undefined,
      updated_at: sub.updated_at ? (sub.updated_at instanceof Date ? sub.updated_at.toISOString() : String(sub.updated_at)) : undefined,
    };
  }) as any[];
}

export async function getUserPaymentStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { hasPaid: false, subscriptionCount: 0 };
  }

  const [paymentResult, countResult] = await Promise.all([
    sql`
      SELECT has_paid FROM user_payments 
      WHERE user_id::text = ${user.id}
      LIMIT 1
    `,
    sql`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE user_id::text = ${user.id}
    `
  ]);

  const hasPaid = paymentResult[0]?.has_paid || false;
  const subscriptionCount = parseInt(countResult[0]?.count || "0");

  return { hasPaid, subscriptionCount };
}

export async function addSubscription(data: Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check payment status and subscription count first
  const { hasPaid, subscriptionCount } = await getUserPaymentStatus();
  
  if (!hasPaid && subscriptionCount >= 3) {
    return { error: "PAYMENT_REQUIRED" };
  }

  // Insert subscription directly with user.id
  // The foreign key constraint will validate that the user exists in neon_auth.users_sync
  // Since subscriptions.user_id is TEXT, we insert the UUID string directly
  // PostgreSQL will validate it against neon_auth.users_sync(id) automatically
  try {
    const result = await sql`
      INSERT INTO subscriptions (
        user_id, name, renewal_date, seats, cost_per_seat,
        remind_5d, remind_2d, remind_1d, remind_1h
      )
      VALUES (
        ${user.id}, ${data.name}, ${data.renewal_date}::date, ${data.seats}, ${data.cost_per_seat},
        ${data.remind_5d}, ${data.remind_2d}, ${data.remind_1d}, ${data.remind_1h}
      )
      RETURNING *
    `;
    
    revalidatePath("/");
    return { data: result[0] as Subscription, error: null };
  } catch (error: any) {
    // If foreign key constraint violation, user doesn't exist in neon_auth.users_sync
    if (error.message?.includes('foreign key constraint') || error.message?.includes('fk_subscriptions_user')) {
      return { error: "User not found in database. Please sign in again." };
    }
    return { error: error.message || "Failed to add subscription. Please try again." };
  }
}

export async function updateSubscription(id: number, data: any) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Transform camelCase component format to snake_case database format
  const dbData: any = {};
  if (data.name !== undefined) dbData.name = data.name;
  if (data.renewalDate !== undefined) dbData.renewal_date = data.renewalDate;
  if (data.seats !== undefined) dbData.seats = data.seats;
  if (data.seatCost !== undefined) dbData.cost_per_seat = data.seatCost;
  if (data.reminders !== undefined) {
    if (data.reminders.fiveDays !== undefined) dbData.remind_5d = data.reminders.fiveDays;
    if (data.reminders.twoDays !== undefined) dbData.remind_2d = data.reminders.twoDays;
    if (data.reminders.oneDay !== undefined) dbData.remind_1d = data.reminders.oneDay;
    if (data.reminders.oneHour !== undefined) dbData.remind_1h = data.reminders.oneHour;
  }
  // Also handle direct snake_case format (for backward compatibility)
  if (data.renewal_date !== undefined) dbData.renewal_date = data.renewal_date;
  if (data.cost_per_seat !== undefined) dbData.cost_per_seat = data.cost_per_seat;
  if (data.remind_5d !== undefined) dbData.remind_5d = data.remind_5d;
  if (data.remind_2d !== undefined) dbData.remind_2d = data.remind_2d;
  if (data.remind_1d !== undefined) dbData.remind_1d = data.remind_1d;
  if (data.remind_1h !== undefined) dbData.remind_1h = data.remind_1h;

  // Update all provided fields in a single query
  // Use COALESCE to only update fields that are provided
  const result = await sql`
    UPDATE subscriptions 
    SET 
      name = COALESCE(${dbData.name ?? null}, name),
      renewal_date = COALESCE(${dbData.renewal_date ?? null}::date, renewal_date),
      seats = COALESCE(${dbData.seats ?? null}, seats),
      cost_per_seat = COALESCE(${dbData.cost_per_seat ?? null}, cost_per_seat),
      remind_5d = COALESCE(${dbData.remind_5d ?? null}, remind_5d),
      remind_2d = COALESCE(${dbData.remind_2d ?? null}, remind_2d),
      remind_1d = COALESCE(${dbData.remind_1d ?? null}, remind_1d),
      remind_1h = COALESCE(${dbData.remind_1h ?? null}, remind_1h),
      updated_at = NOW()
    WHERE user_id::text = ${user.id} AND id = ${id}
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error("Subscription not found or unauthorized");
  }

  // Don't call revalidatePath here - we're using optimistic updates
  // Revalidation causes full page re-renders which slows down rapid updates
  // Only revalidate on add/delete operations

  // Transform back to component format
  const sub = result[0] as any;
  
  // Convert renewal_date to string format (YYYY-MM-DD for date inputs)
  let renewalDate = '';
  if (sub.renewal_date) {
    if (sub.renewal_date instanceof Date) {
      renewalDate = sub.renewal_date.toISOString().split('T')[0];
    } else if (typeof sub.renewal_date === 'string') {
      renewalDate = sub.renewal_date.split('T')[0];
    } else {
      renewalDate = String(sub.renewal_date);
    }
  }

  return {
    id: sub.id?.toString() || String(sub.id),
    user_id: sub.user_id,
    name: sub.name || '',
    renewalDate,
    seats: sub.seats || 0,
    seatCost: sub.cost_per_seat != null ? parseFloat(String(sub.cost_per_seat)) : 0,
    reminders: {
      fiveDays: sub.remind_5d ?? false,
      twoDays: sub.remind_2d ?? false,
      oneDay: sub.remind_1d ?? false,
      oneHour: sub.remind_1h ?? false,
    },
    created_at: sub.created_at ? (sub.created_at instanceof Date ? sub.created_at.toISOString() : String(sub.created_at)) : undefined,
    updated_at: sub.updated_at ? (sub.updated_at instanceof Date ? sub.updated_at.toISOString() : String(sub.updated_at)) : undefined,
  };
}

export async function deleteSubscription(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM subscriptions 
    WHERE id = ${id} AND user_id::text = ${user.id}
  `;

  revalidatePath("/");
}
