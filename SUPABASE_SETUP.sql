-- ============================================================================
-- PROMISE TRACKER: SUPABASE SECURITY SCHEMA & RLS POLICIES
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Execute all queries in order
-- ============================================================================

-- 1. CREATE PROFILES TABLE (User roles and metadata)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Admins can update profiles
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 2. CREATE CATEGORIES TABLE (Stored in DB instead of localStorage)
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Layers',
  color TEXT DEFAULT 'bg-primary/10 text-primary',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read categories
CREATE POLICY "Public categories are viewable"
  ON categories FOR SELECT
  USING (true);

-- Policy: Only admins can insert categories
CREATE POLICY "Only admins can create categories"
  ON categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can update categories
CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can delete categories
CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 3. UPDATE PROMISES TABLE (Add RLS if not already present)
-- ============================================================================

-- Enable RLS on promises table (if not already enabled)
ALTER TABLE promises ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read promises
CREATE POLICY "Public promises are viewable"
  ON promises FOR SELECT
  USING (true);

-- Policy: Only admins can insert promises
CREATE POLICY "Only admins can create promises"
  ON promises FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can update promises
CREATE POLICY "Only admins can update promises"
  ON promises FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy: Only admins can delete promises
CREATE POLICY "Only admins can delete promises"
  ON promises FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 4. CREATE NEWS UPDATES TABLE (Recent progress updates)
-- ============================================================================

CREATE TABLE IF NOT EXISTS news_updates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_url TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  promise_id BIGINT REFERENCES promises(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news_updates table
ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read news
CREATE POLICY "Public news are viewable"
  ON news_updates FOR SELECT
  USING (true);

-- Policy: Only admins can manage news
CREATE POLICY "Only admins can manage news"
  ON news_updates FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 5. CREATE VOLUNTEER REQUESTS TABLE (Join Campaign)
-- ============================================================================

CREATE TABLE IF NOT EXISTS volunteer_requests (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  type TEXT CHECK (type IN ('volunteer', 'verify_data')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on volunteer_requests table
ALTER TABLE volunteer_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (send request)
CREATE POLICY "Anyone can send volunteer requests"
  ON volunteer_requests FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view/manage requests
CREATE POLICY "Only admins can manage volunteer requests"
  ON volunteer_requests FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ============================================================================
-- 6. INSERT DEFAULT CATEGORIES
-- ============================================================================

INSERT INTO categories (name, icon, color) VALUES
  ('साझा प्रतिबद्धता, समन्वय र जनविश्वास', 'Gavel', 'bg-blue-100 text-blue-800'),
  ('प्रशासनिक सुधार, पुनसंरचना र मितव्ययिता', 'Globe', 'bg-indigo-100 text-indigo-800'),
  ('सार्वजनिक सेवा प्रवाह र गुनासो व्यवस्थापन', 'TrendingUp', 'bg-green-100 text-green-800'),
  ('डिजिटल शासन र डेटा गोभर्नेन्स र सञ्चार', 'Wheat', 'bg-amber-100 text-amber-800'),
  ('सुशासन, पारदर्शिता र भ्रष्टाचार नियंत्रण', 'Briefcase', 'bg-orange-100 text-orange-800'),
  ('सार्वजनिक खरीद र परियोजना व्यवस्थापन सुधार', 'HardHat', 'bg-slate-100 text-slate-800'),
  ('लगानी, उद्योग निजी क्षेत्र प्रवर्द्धन र पर्यटन', 'Zap', 'bg-yellow-100 text-yellow-800'),
  ('उर्जा तथा जलस्रोत', 'GraduationCap', 'bg-cyan-100 text-cyan-800'),
  ('राजस्व सुधार', 'Stethoscope', 'bg-red-100 text-red-800'),
  ('स्वास्थ्य, शिक्षा र मानव विकास', 'Mountain', 'bg-emerald-100 text-emerald-800'),
  ('कृषि, भूमि पूर्वाधार र आधारभूत सेवा', 'Activity', 'bg-pink-100 text-pink-800'),
  ('अन्य रणनीतिक र सामाजिक सुरक्षा निर्णयहरू', 'Users', 'bg-purple-100 text-purple-800')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CREATE TRIGGER: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. STORAGE BUCKETS SETUP
-- ============================================================================
-- Note: Storage buckets usually need to be created via the Dashboard
-- But policies can be set via SQL

-- Policy for 'images' bucket (must exist first)
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================================================
-- 6. VERIFY RLS IS ENABLED ON ALL TABLES
-- ============================================================================
-- Run this query to verify (not a command to execute, just for reference):
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('profiles', 'categories', 'promises');
-- All should show TRUE for rowsecurity

-- ============================================================================
-- DEPLOYMENT CHECKLIST:
-- ============================================================================
-- ✅ Run all SQL above
-- ✅ Verify RLS is enabled: SELECT tablename, rowsecurity FROM pg_tables;
-- ✅ Test as admin: Can CRUD all data
-- ✅ Test as user: Can only SELECT (read-only)
-- ✅ Disable public signup in Supabase Auth settings
-- ✅ Seed at least one admin user via Supabase Auth
