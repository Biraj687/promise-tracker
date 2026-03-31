# 🚀 DASHBOARD SETUP - SUPABASE INTEGRATION

## ⚠️ CRITICAL: DO THIS FIRST

### Step 1: Create Supabase Storage Bucket (IF NOT EXISTS)
Go to: **Supabase Dashboard → Storage**

1. Click **+ Create a new bucket**
2. Name it: `**images**` (exactly)
3. Choose: **Public bucket** (important for image display)
4. Click Create

### Step 2: Set Storage RLS Policies
In Supabase Storage → select "images" bucket → Policies tab

**Add Policy 1 (Public Read):**
```sql
-- Anyone can view images
CREATE POLICY "Public access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

**Add Policy 2 (Authenticated Upload):**
```sql
-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

### Step 3: Run SQL Migration in Supabase
Go to: **Supabase Dashboard → SQL Editor → New Query**

Copy & paste entire contents of: **SUPABASE_DASHBOARD_MIGRATION.sql**

Then click **Execute**

This adds to your `categories` table:
- `description` field
- `image_url` field (stores public URL from Supabase Storage)
- `display_order` field (for sorting)

Also creates `cms_content` table for landing page settings.

### Step 4: Verify Migration Worked
Run this query in SQL Editor:

```sql
-- Check categories has new fields
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY column_name;

-- Check cms_content table exists
SELECT COUNT(*) FROM cms_content;

-- See first 3 category IDs
SELECT id, name, image_url FROM categories LIMIT 3;
```

---

## 📊 Dashboard Structure (NOW FIXED)

### Admin → Manage Promises
Shows only **first 3 categories** as main trackers:

1. **Tracker Card** displays:
   - Hero image (from your Supabase Storage bucket)
   - Tracker name & description
   - Promise count (total, completed, in progress)
   - **Edit Tracker & Promises** button

2. **Edit Modal** allows you to:
   - Upload new hero image (goes to Supabase Storage)
   - Edit tracker name/description  
   - View promises under this tracker
   - Save all to Supabase database

### Image Upload Flow:
```
User selects image → uploadImage() → Supabase Storage (public URL) 
→ URL saved to categories.image_url column → Shows in dashboard
```

---

## 🔧 How to Test

### Test 1: Upload an Image
1. Go to Admin → Manage Promises
2. Click **Edit Tracker & Promises** on any 3 main tracker cards
3. Click upload area, select a JPG/PNG image
4. Click **Save to Supabase**
5. Message should say: "Image uploaded to Supabase!"
6. Image should display on tracker card

### Test 2: Edit Hero Section
1. Change tracker title or description
2. Click **Save to Supabase**
3. Reload page
4. Changes should persist (saved to database)

### Test 3: Verify in Supabase
1. Go to Supabase Dashboard → Table Editor
2. Open **categories** table
3. Check first 3 rows have:
   - `image_url` field populated with public URLs
   - `description` field filled
4. Open **storage/images** bucket
5. Should see your uploaded image files

---

## ❌ If Images Don't Upload

### Check 1: Supabase Storage Bucket
```sql
-- In Supabase SQL Editor, check bucket exists:
SELECT id, name, public FROM storage.buckets WHERE name = 'images';
```

Should return: `images | true`

If missing, create it manually in Storage tab.

### Check 2: Storage RLS Policies
In Supabase → Storage → Policies tab
- Should see 2 policies for "images" bucket
- One for SELECT (public read)
- One for INSERT (authenticated upload)

### Check 3: Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try uploading image
4. Look for error messages
5. Share the error here if it fails

### Check 4: Supabase Client Config
File: `src/supabaseClient.js`

Should have:
```javascript
export const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

If URLs are blank/wrong, fix them.

---

## 📝 Database Schema After Migration

**categories table (new fields):**
```
✓ id, name, icon, color, created_at, created_by
+ description (NEW) - TEXT
+ image_url (NEW) - TEXT (stores Supabase Storage public URL)
+ parent_id (NEW) - BIGINT (for future nesting)
+ display_order (NEW) - INTEGER (for sorting)
```

**cms_content table (NEW):**
```
- id, section_key
- hero_title, hero_subtitle, hero_cta_text, hero_image_url
- header_logo_text, footer_text, site_name
- maintenance_mode, timezone, meta_description
- created_at, updated_at, created_by
```

---

## ✅ Success Checklist

- [ ] Supabase storage bucket "images" exists and is public
- [ ] Storage RLS policies are set up
- [ ] SQL Migration ran successfully
- [ ] New fields visible in categories table
- [ ] Image uploads work (show in browser, URL saved to database)
- [ ] Edit hero section saves to database
- [ ] Changes persist after page reload
- [ ] 3 trackers show in Admin → Manage Promises

---

## 🆘 Still Having Issues?

1. **Share error message from browser console**
2. **Check Supabase status page** (supastatus.com)
3. **Verify ANON_KEY is correct** in supabaseClient.js
4. **Make sure Supabase project is not paused**
5. **Try incognito/private browser window** (clear cache)

---

## Next Steps After Setup

Once dashboard works:
1. Upload high-quality images for your 3 main trackers
2. Add meaningful descriptions
3. Frontend will automatically display updated hero sections
4. Users see real tracker images on home page

**You're now using real Supabase backend!** 🎉
