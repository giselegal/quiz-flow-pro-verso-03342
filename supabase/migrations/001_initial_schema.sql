-- Quiz Quest Challenge Verse - Supabase Schema Migration
-- Migração do SQLite para PostgreSQL

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- UTM Analytics table
CREATE TABLE IF NOT EXISTS utm_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  participant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Participants table
CREATE TABLE IF NOT EXISTS quiz_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  quiz_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funnels table (core table)
CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on funnels table
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;

-- Funnel Pages table
CREATE TABLE IF NOT EXISTS funnel_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on funnel_pages table
ALTER TABLE funnel_pages ENABLE ROW LEVEL SECURITY;

-- Funnel Versions table (for backup/history)
CREATE TABLE IF NOT EXISTS funnel_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  funnel_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Conversion Events table
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_email TEXT,
  value DECIMAL DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id TEXT NOT NULL,
  quiz_id TEXT,
  responses JSONB NOT NULL,
  scores JSONB,
  predominant_style TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotmart Purchases table
CREATE TABLE IF NOT EXISTS hotmart_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT NOT NULL UNIQUE,
  buyer_email TEXT,
  buyer_name TEXT,
  product_id TEXT,
  product_name TEXT,
  amount DECIMAL,
  currency TEXT DEFAULT 'BRL',
  status TEXT,
  event_type TEXT,
  purchase_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  method TEXT DEFAULT 'POST',
  headers JSONB,
  secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_versions_funnel_id ON funnel_versions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_utm_analytics_participant_id ON utm_analytics(participant_id);
CREATE INDEX IF NOT EXISTS idx_quiz_participants_email ON quiz_participants(email);
CREATE INDEX IF NOT EXISTS idx_quiz_results_participant_id ON quiz_results(participant_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_email ON conversion_events(user_email);
CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_buyer_email ON hotmart_purchases(buyer_email);

-- RLS Policies for secure access

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Funnels policies - users can only access their own funnels
CREATE POLICY "Users can view own funnels" ON funnels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own funnels" ON funnels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own funnels" ON funnels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own funnels" ON funnels
  FOR DELETE USING (auth.uid() = user_id);

-- Funnel pages policies - access through funnel ownership
CREATE POLICY "Users can view own funnel pages" ON funnel_pages
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM funnels 
      WHERE funnels.id = funnel_pages.funnel_id 
      AND funnels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own funnel pages" ON funnel_pages
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM funnels 
      WHERE funnels.id = funnel_pages.funnel_id 
      AND funnels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own funnel pages" ON funnel_pages
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM funnels 
      WHERE funnels.id = funnel_pages.funnel_id 
      AND funnels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own funnel pages" ON funnel_pages
  FOR DELETE USING (
    EXISTS(
      SELECT 1 FROM funnels 
      WHERE funnels.id = funnel_pages.funnel_id 
      AND funnels.user_id = auth.uid()
    )
  );

-- Allow public read access for published funnels (for quiz participation)
CREATE POLICY "Public can view published funnels" ON funnels
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published funnel pages" ON funnel_pages
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM funnels 
      WHERE funnels.id = funnel_pages.funnel_id 
      AND funnels.is_published = true
    )
  );

-- Allow public access for quiz participation and results
CREATE POLICY "Public can create quiz participants" ON quiz_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create quiz results" ON quiz_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create utm analytics" ON utm_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create conversion events" ON conversion_events
  FOR INSERT WITH CHECK (true);

-- Allow public access for Hotmart webhooks
CREATE POLICY "Public can create hotmart purchases" ON hotmart_purchases
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON funnels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funnel_pages_updated_at BEFORE UPDATE ON funnel_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
