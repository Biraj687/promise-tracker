# 🔧 IMAGE UPLOAD FIX - DIAGNOSTIC & SETUP GUIDE

## ✅ FIXES APPLIED

I've improved the image upload functionality with:

1. ✅ **File validation** - Checks file type and size (5MB max)
2. ✅ **Better error messages** - Show exactly what failed
3. ✅ **Console logging** - Debug info for troubleshooting
4. ✅ **Improved error handling** - Clear messages to user
5. ✅ **URL generation fix** - Proper Supabase URL handling
6. ✅ **Upsert enabled** - Can re-upload same filename

---

## 🐛 COMMON UPLOAD FAILURES & FIXES

### Issue 1: "Storage bucket not found" or "images bucket doesn't exist"

**Solution:**

1. Open Supabase Dashboard → Storage
2. Check if "images" bucket exists
3. If NOT, create it:
   - Click `+ Create a new bucket`
   - Name: `images` (exactly)
   - Select: **Public bucket** (important!)
   - Click Create

### Issue 2: "Permission denied" when uploading

**Solution: Fix RLS Policies**

1. Go to Supabase Dashboard → Storage → `images` bucket
2. Click **Policies** tab
3. Delete any existing policies
4. Add these policies:

```sql
-- Policy 1: Anyone can READ images (public download)
CREATE POLICY "Public access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Authenticated users can UPLOAD
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Admins can DELETE
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
```

### Issue 3: "CORS error" or "Cross-Origin" error

**Solution: CORS is automatic on Supabase**

No action needed - Supabase handles CORS automatically for authenticated requests.

### Issue 4: "File too large" error

**Solution: Compress image before upload**

Current limit: 5MB

If upload still fails:
1. Resize image to max 1920×1080px
2. Compress to ~500KB-2MB
3. Use tools: TinyPNG, ImageOptim, or online compressors

### Issue 5: "Invalid file type" error

**Allowed types:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)

**Not allowed:**
- ❌ SVG
- ❌ BMP
- ❌ TIFF

### Issue 6: Upload succeeds but image doesn't show

**Check 1: JSON viewing the public URL**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for message: `🔗 Public URL: https://...`
4. Copy that URL
5. Paste in new tab - should show image

**Check 2: Supabase Storage**

1. Dashboard → Storage → `images` folder
2. Should see uploaded files in `public/` subfolder
3. If not there, upload failed silently

---

## 🧪 TESTING UPLOAD (Step by Step)

### Test 1: Check Console Logging

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try uploading image
4. Look for messages like:
   ```
   📤 Starting image upload: myimage.jpg
   📝 Filename: 1704067200000-myimage.jpg
   🪣 Bucket: images
   ✅ Upload successful: {...}
   🔗 Public URL: https://obxzzjhictoljoixuctg.supabase.co/storage/v1/object/public/images/public/1704067200000-myimage.jpg
   ```

If you see `❌ Upload error:`, it will show the exact problem.

### Test 2: Direct Supabase Test

```javascript
// Run this in browser Console (F12)
import { supabase } from './supabaseClient';

// Try uploading
const testFile = new File(['test'], 'test.png', { type: 'image/png' });
const { data, error } = await supabase.storage
  .from('images')
  .upload('public/test.png', testFile);

if (error) {
  console.log('❌ Error:', error);
} else {
  console.log('✅ Success:', data);
  console.log('URL:', supabase.storage.from('images').getPublicUrl('public/test.png').data.publicUrl);
}
```

### Test 3: Admin Access Test

1. Login as admin (goldenmud@gmail.com)
2. Go to /admin/promises
3. Click "Edit" on a category or "New Promise"
4. Try uploading small test image (< 500KB)
5. Check console for detailed error messages

---

## ✨ NEW ERROR MESSAGES

When upload fails, you'll now see clear messages:

```
❌ Upload failed: Invalid file type. Allowed: JPG, PNG, WebP, GIF. Got: image/svg+xml
❌ Upload failed: File too large. Max 5MB, got 7.23MB
❌ Upload failed: Image upload failed: User not authenticated (Status: 401)
❌ Upload failed: Image upload failed: you do not have permission to perform this action
```

---

## 📋 COMPLETE SETUP CHECKLIST

Use this to verify everything is ready:

```
SUPABASE STORAGE SETUP:
☐ Bucket "images" exists
☐ Bucket is set to PUBLIC (not private)
☐ Storage RLS policies are created (4 policies)

CURRENT USER:
☐ Logged in as admin (role = 'admin')
☐ Admin user exists in profiles table
☐ User email verified in Supabase Auth

IMAGE REQUIREMENTS:
☐ File is JPEG, PNG, WebP, or GIF
☐ File size < 5MB
☐ Image dimensions ideal: 1920×1080px or smaller

BROWSER:
☐ Cookies enabled
☐ Local storage not full
☐ Browser cache cleared (Ctrl+Shift+Del)
☐ No ad blockers blocking supabase.co

NETWORK:
☐ Internet connection stable
☐ No VPN/proxy blocking storage
☐ HTTPS used (not HTTP)
```

---

## 🚀 IF STILL FAILING

### Step 1: Enable Debug Mode

Add this to `src/context/DataContext.jsx` at the top:

```javascript
// Add after imports
const DEBUG_UPLOADS = true;  // Set to true for verbose logging
```

### Step 2: Capture Error

1. Follow Test 1 above (Console logging)
2. Copy the exact error message
3. Share error message

### Step 3: Verify Supabase Project

1. Go to Supabase Dashboard
2. Check project status (green = healthy)
3. Check API Health (Settings → API)
4. Click "Verify" button - should show "Connection successful"

### Step 4: Manual Upload Test

1. Supabase Dashboard → Storage → images
2. Click "Upload" button manually
3. Try uploading a test image
4. If manual upload works → Frontend issue
5. If manual upload fails → Supabase bucket issue

---

## 🎯 AFTER FIX - TEST FLOW

```
1. Login to admin dashboard
   ☐ /admin loads
   ☐ See "Manage Categories" or "Manage Promises"

2. Try uploading image
   ☐ Click upload button
   ☐ Select JPEG/PNG file (< 2MB)
   ☐ See loading spinner
   ☐ Get success message ✅

3. Verify in storage
   ☐ Image shows in preview
   ☐ Can save promise/category
   ☐ Image persists on page reload

4. Check on frontend
   ☐ Homepage shows promise/category with image
   ☐ Image displays correctly
   ☐ No broken image icons
```

---

## 📞 TROUBLESHOOTING COMMANDS

**Check Supabase connection:**
```javascript
// In browser console:
const session = await supabase.auth.getSession();
console.log('Session:', session);
```

**Check storage access:**
```javascript
// In browser console:
const { data } = await supabase.storage.listBuckets();
console.log('Buckets:', data);
```

**Check RLS policies:**
```
Supabase Dashboard
→ Storage
→ images bucket
→ Policies tab
→ Should see 4 policies listed
```

---

## 📊 EXPECTED UPLOAD BEHAVIOR

### On Success:
```
🔄 Handling image upload: photo.jpg Size: 1234567 Type: image/jpeg
📤 Starting image upload: photo.jpg
📝 Filename: 1704067200000-photo.jpg
🪣 Bucket: images
✅ Upload successful: {...}
🔗 Public URL: https://...
✅ Promise image uploaded successfully!
```

### On Failure:
```
🔄 Handling image upload: photo.jpg Size: 1234567 Type: image/svg+xml
📤 Starting image upload: photo.jpg
❌ Upload failed: Invalid file type...
❌ Upload failed: Invalid file type. Allowed: JPG, PNG, WebP, GIF. Got: image/svg+xml. Check browser console for details.
```

---

## 🔗 SUPABASE DOCUMENTATION

- [Storage Setup](https://supabase.com/docs/guides/storage/quickstart)
- [RLS Policies](https://supabase.com/docs/guides/storage/security)
- [Upload Files](https://supabase.com/docs/reference/javascript/storage-from-upload)

---

**Version:** 1.0  
**Last Updated:** April 1, 2026  
**Status:** ✅ Ready to Test
