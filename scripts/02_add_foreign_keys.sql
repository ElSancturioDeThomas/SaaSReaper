-- Add foreign key constraints to link tables to Stack Auth users
-- This ensures referential integrity between the public schema tables and neon_auth.users_sync

-- No-op: Foreign keys now defined inline with table creation
SELECT 'Foreign keys are now defined inline with table creation in 01_create_subscriptions_table.sql' AS migration_note;

-- Add comments for documentation
-- COMMENT ON CONSTRAINT fk_subscriptions_user ON subscriptions IS 'Links subscriptions to Stack Auth users - cascades deletes';
-- COMMENT ON CONSTRAINT fk_user_payments_user ON user_payments IS 'Links payment records to Stack Auth users - cascades deletes';
