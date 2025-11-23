-- Yearly transactions table (annual expenses/income)
CREATE TABLE yearly_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  amount DECIMAL(15, 2) NOT NULL,
  type transaction_type NOT NULL,
  occurrence_month INTEGER NOT NULL CHECK (occurrence_month BETWEEN 1 AND 12),
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_yearly_transactions_user_id ON yearly_transactions(user_id);
CREATE INDEX idx_yearly_transactions_is_deleted ON yearly_transactions(is_deleted);
CREATE INDEX idx_yearly_transactions_start_year ON yearly_transactions(start_year);
CREATE INDEX idx_yearly_transactions_end_year ON yearly_transactions(end_year);
CREATE INDEX idx_yearly_transactions_occurrence_month ON yearly_transactions(occurrence_month);

-- Enable Row Level Security
ALTER TABLE yearly_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for yearly_transactions
CREATE POLICY "Users can view their own yearly transactions"
  ON yearly_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own yearly transactions"
  ON yearly_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own yearly transactions"
  ON yearly_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own yearly transactions"
  ON yearly_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_yearly_transactions_updated_at BEFORE UPDATE ON yearly_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

