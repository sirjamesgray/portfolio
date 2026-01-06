-- Add chat messages, quotes, and invoicing support

-- Create enum for quote status
DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for invoice status
DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Messages table for project-scoped chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status quote_status DEFAULT 'draft',
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  valid_until TIMESTAMPTZ,
  line_items JSONB DEFAULT '[]',
  terms TEXT,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table (for Stripe integration)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status invoice_status DEFAULT 'draft',
  amount DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  invoice_url TEXT,
  invoice_pdf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add quote_id reference to projects (the accepted quote)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS accepted_quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL;

-- Add stripe customer id to track customer in Stripe
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Messages policies: users can see messages for their projects
DROP POLICY IF EXISTS "Users can view their project messages" ON messages;
CREATE POLICY "Users can view their project messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Users can send messages to their projects" ON messages;
CREATE POLICY "Users can send messages to their projects"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
      OR
      EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
    )
  );

DROP POLICY IF EXISTS "Service role full access messages" ON messages;
CREATE POLICY "Service role full access messages"
  ON messages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Quotes policies
DROP POLICY IF EXISTS "Users can view their project quotes" ON quotes;
CREATE POLICY "Users can view their project quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Admins can manage quotes" ON quotes;
CREATE POLICY "Admins can manage quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Service role full access quotes" ON quotes;
CREATE POLICY "Service role full access quotes"
  ON quotes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Invoices policies
DROP POLICY IF EXISTS "Users can view their project invoices" ON invoices;
CREATE POLICY "Users can view their project invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Service role full access invoices" ON invoices;
CREATE POLICY "Service role full access invoices"
  ON invoices FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
