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

  const subscriptions = await sql`
    SELECT * FROM subscriptions 
    WHERE user_id = ${user.id}
    ORDER BY renewal_date ASC
  `;

  return subscriptions as Subscription[];
}

export async function getUserPaymentStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { hasPaid: false, subscriptionCount: 0 };
  }

  const [paymentResult, countResult] = await Promise.all([
    sql`
      SELECT has_paid FROM user_payments 
      WHERE user_id = ${user.id}
      LIMIT 1
    `,
    sql`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE user_id = ${user.id}
    `
  ]);

  const hasPaid = paymentResult[0]?.has_paid || false;
  const subscriptionCount = parseInt(countResult[0]?.count || "0");

  return { hasPaid, subscriptionCount };
}

export async function addSubscription(data: Omit<Subscription, "id" | "user_id" | "created_at" | "updated_at">) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check payment status and subscription count
  const { hasPaid, subscriptionCount } = await getUserPaymentStatus();
  
  if (!hasPaid && subscriptionCount >= 3) {
    throw new Error("PAYMENT_REQUIRED");
  }

  const result = await sql`
    INSERT INTO subscriptions (
      user_id, name, renewal_date, seats, cost_per_seat,
      remind_5d, remind_2d, remind_1d, remind_1h
    )
    VALUES (
      ${user.id}, ${data.name}, ${data.renewal_date}, ${data.seats}, ${data.cost_per_seat},
      ${data.remind_5d}, ${data.remind_2d}, ${data.remind_1d}, ${data.remind_1h}
    )
    RETURNING *
  `;

  revalidatePath("/");
  return result[0] as Subscription;
}

export async function updateSubscription(id: number, data: Partial<Subscription>) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updates = [];
  const values = [];
  let paramCount = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(data.name);
  }
  if (data.renewal_date !== undefined) {
    updates.push(`renewal_date = $${paramCount++}`);
    values.push(data.renewal_date);
  }
  if (data.seats !== undefined) {
    updates.push(`seats = $${paramCount++}`);
    values.push(data.seats);
  }
  if (data.cost_per_seat !== undefined) {
    updates.push(`cost_per_seat = $${paramCount++}`);
    values.push(data.cost_per_seat);
  }
  if (data.remind_5d !== undefined) {
    updates.push(`remind_5d = $${paramCount++}`);
    values.push(data.remind_5d);
  }
  if (data.remind_2d !== undefined) {
    updates.push(`remind_2d = $${paramCount++}`);
    values.push(data.remind_2d);
  }
  if (data.remind_1d !== undefined) {
    updates.push(`remind_1d = $${paramCount++}`);
    values.push(data.remind_1d);
  }
  if (data.remind_1h !== undefined) {
    updates.push(`remind_1h = $${paramCount++}`);
    values.push(data.remind_1h);
  }

  updates.push(`updated_at = NOW()`);
  values.push(user.id, id);

  const query = `
    UPDATE subscriptions 
    SET ${updates.join(", ")}
    WHERE user_id = $${paramCount++} AND id = $${paramCount++}
    RETURNING *
  `;

  const result = await sql(query, values);

  revalidatePath("/");
  return result[0] as Subscription;
}

export async function deleteSubscription(id: number) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM subscriptions 
    WHERE id = ${id} AND user_id = ${user.id}
  `;

  revalidatePath("/");
}
