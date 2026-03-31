-- ============================================================================
-- PROMISE TRACKER: BETTER FIX (Drop and Recreate)
-- ============================================================================
-- This completely fixes the categories table
-- ============================================================================

-- STEP 1: Drop the broken table
DROP TABLE IF EXISTS categories CASCADE;

-- STEP 2: Recreate it with ALL columns correct
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Layers',
  color TEXT DEFAULT 'bg-primary/10 text-primary',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create RLS Policies
CREATE POLICY "Public categories are viewable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create categories"
  ON categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- STEP 5: Insert default categories
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
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- VERIFY IT WORKED
-- ============================================================================
-- Run this to confirm:
-- SELECT COUNT(*) as category_count FROM categories;
-- Should show: 12
