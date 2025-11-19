-- Updated user_id to UUID type to match users_sync table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  renewal_date DATE NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  cost_per_seat DECIMAL(10, 2) NOT NULL,
  remind_5d BOOLEAN DEFAULT false,
  remind_2d BOOLEAN DEFAULT false,
  remind_1d BOOLEAN DEFAULT false,
  remind_1h BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users_sync(id) ON DELETE CASCADE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Updated user_id to UUID type to match users_sync table
CREATE TABLE IF NOT EXISTS user_payments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  has_paid BOOLEAN DEFAULT false,
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users_sync(id) ON DELETE CASCADE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_payments_user_id ON user_payments(user_id);
