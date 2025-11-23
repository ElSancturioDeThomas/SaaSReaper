"use server";

import { sql } from "@/lib/db";

export interface SaaSProduct {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  category: string | null;
  description: string | null;
  status: string | null;
  default_cost: number | null;
  created_at: string;
}

export async function getSaaSProducts(search?: string) {
  try {
    if (search) {
      const searchPattern = `%${search}%`;
      const products = await sql`
        SELECT * FROM saas_products 
        WHERE status = 'verified' 
        AND (name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
        ORDER BY name ASC
        LIMIT 50
      `;
      return products as unknown as SaaSProduct[];
    } else {
      const products = await sql`
        SELECT * FROM saas_products 
        WHERE status = 'verified' 
        ORDER BY name ASC
        LIMIT 100
      `;
      return products as unknown as SaaSProduct[];
    }
  } catch (error) {
    console.error("Error fetching SaaS products:", error);
    return [];
  }
}

