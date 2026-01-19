-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'transport', 'misc', 'rent', 'custom')),
  custom_category TEXT,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create savings_goals table
CREATE TABLE public.savings_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#10b981',
  icon TEXT NOT NULL DEFAULT 'piggy-bank',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_income table (single row per user/month)
CREATE TABLE public.monthly_income (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  month TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  other_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create monthly_rent table (single row per user/month)
CREATE TABLE public.monthly_rent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  month TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create custom_categories table
CREATE TABLE public.custom_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (allowing public access for now - single user)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_rent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

-- Create public access policies (single user mode)
CREATE POLICY "Allow public access to expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to savings_goals" ON public.savings_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to monthly_income" ON public.monthly_income FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to monthly_rent" ON public.monthly_rent FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to custom_categories" ON public.custom_categories FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monthly_income_updated_at BEFORE UPDATE ON public.monthly_income FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monthly_rent_updated_at BEFORE UPDATE ON public.monthly_rent FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();