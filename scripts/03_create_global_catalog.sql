-- 1. The Global Catalog
CREATE TABLE IF NOT EXISTS saas_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  category TEXT, -- 'Productivity', 'Entertainment', etc.
  description TEXT,
  status TEXT DEFAULT 'verified', -- 'verified', 'pending', 'user_created'
  default_cost DECIMAL(10, 2), -- Helpful for auto-fill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast search in the "Quick Select" dropdown
CREATE INDEX IF NOT EXISTS idx_saas_products_name ON saas_products(name);

-- 2. Update Existing Subscriptions to link to Global Catalog
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'product_id') THEN
        ALTER TABLE subscriptions 
        ADD COLUMN product_id UUID REFERENCES saas_products(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. The Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users_sync(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES saas_products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- One review per product per user
);

