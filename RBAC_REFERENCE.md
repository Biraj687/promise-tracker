# RBAC (Role-Based Access Control) REFERENCE

## How It Works

### Architecture

```
User registers/logs in
        ↓
Supabase Auth validates password
        ↓
JWT token created (stored in browser)
        ↓
AuthContext fetches & stores profile.role
        ↓
Role available to all components via useAuth()
        ↓
ProtectedAdminRoute checks role
        ↓
RLS policies enforce at database level
```

### Current Roles

| Role | Can Access | Can Create/Edit/Delete |
|------|-----------|------------------|
| `admin` | /admin dashboard | ✅ Yes |
| `user` | Public pages only | ❌ No |

---

## Code Implementation

### 1. AuthContext - Where Role Comes From

**File:** `src/context/AuthContext.jsx`

```javascript
// After login, profile is fetched:
const fetchUserProfile = async (authUser) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role')  // ← Fetches role
    .eq('id', authUser.id)
    .single();

  setUser({
    id: authUser.id,
    email: authUser.email,
    username: authUser.email.split('@')[0],
    role: profile.role  // ← Stored here
  });
};
```

**Usage in components:**
```javascript
const { user, isAdmin } = useAuth();

console.log(user.role);  // 'admin' or 'user'
console.log(isAdmin);    // true or false
```

### 2. ProtectedAdminRoute - Frontend Enforcement

**File:** `src/components/ProtectedAdminRoute.jsx`

```javascript
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>Access Denied. Your role: {user.role}</div>;
  }

  return children;
};
```

**This blocks:**
- Non-logged-in users → redirect to login
- Non-admin users → show "Access Denied"
- Admin users → allow access

### 3. RLS Policies - Database Enforcement

**File:** `SUPABASE_SETUP.sql`

For creating/editing: Only admins
```sql
CREATE POLICY "Only admins can create promises"
  ON promises FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

For reading: Everyone
```sql
CREATE POLICY "Public promises are viewable"
  ON promises FOR SELECT
  USING (true);  -- Anyone can read
```

---

## How to Extend RBAC

### Adding a New Role: 'editor'

#### Step 1: Update Database Schema

```sql
-- Update CHECK constraint to include new role
ALTER TABLE profiles 
DROP CONSTRAINT profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'user', 'editor'));
```

#### Step 2: Update RLS Policies

```sql
-- Allow editors to update (but not delete)
CREATE POLICY "Editors can update promises"
  ON promises FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'editor')
    )
  );

-- Editors cannot delete
CREATE POLICY "Only admins can delete promises"
  ON promises FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

#### Step 3: Update Frontend

**In AuthContext.jsx:**
```javascript
const value = {
  user,
  loading,
  error,
  login,
  logout,
  isAdmin: user?.role === 'admin',
  isEditor: user?.role === 'editor',  // Add this
  canEdit: ['admin', 'editor'].includes(user?.role)  // Add this
};
```

**In components:**
```javascript
const { isEditor, canEdit } = useAuth();

if (canEdit) {
  // Show edit button
}
```

### Adding a New Role: 'viewer' (Read-Only)

```sql
-- Add to CHECK
ALTER TABLE profiles 
DROP CONSTRAINT profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'user', 'editor', 'viewer'));

-- Already have policy for SELECT (public read)
-- Viewers automatically get read-only access via existing policies
```

---

## Permission Matrix

### Complete Permission Matrix

| Action | Admin | Editor | Viewer | User |
|--------|:-------:|:-------:|:-------:|:---:|
| **View promises** | ✅ | ✅ | ✅ | ✅ |
| **Create promise** | ✅ | ❌ | ❌ | ❌ |
| **Edit promise** | ✅ | ✅ | ❌ | ❌ |
| **Delete promise** | ✅ | ❌ | ❌ | ❌ |
| **Access /admin** | ✅ | ❌ | ❌ | ❌ |
| **Create category** | ✅ | ❌ | ❌ | ❌ |
| **Edit category** | ✅ | ❌ | ❌ | ❌ |
| **Delete category** | ✅ | ❌ | ❌ | ❌ |
| **View other users** | ✅ | ❌ | ❌ | ❌ |

---

## SQL Reference: Common RLS Operations

### View All Policies

```sql
SELECT * FROM pg_policies 
WHERE tablename IN ('promises', 'categories', 'profiles')
ORDER BY tablename, policyname;
```

### Update User Role

```sql
-- Change user to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Change admin to user
UPDATE profiles 
SET role = 'user' 
WHERE email = 'admin@example.com';
```

### Revoke Access for User

```sql
-- Set to 'user' (read-only)
UPDATE profiles 
SET role = 'user' 
WHERE id = 'user_id_here';
```

### Create Test Users

```sql
-- Via SQL (if you know user ID)
INSERT INTO profiles (id, email, role) VALUES
  ('uuid-1', 'admin@test.com', 'admin'),
  ('uuid-2', 'editor@test.com', 'editor'),
  ('uuid-3', 'viewer@test.com', 'viewer');
```

---

## Security Considerations

### Frontend Security

⚠️ **Frontend can be hacked.** Never trust frontend-only checks.

❌ Bad (Frontend only):
```javascript
if (user.role === 'admin') {
  // Let user save data
}
```

✅ Good (Frontend + Database):
```javascript
// Frontend
if (user.role === 'admin') {
  // Show UI
}

// Database
// RLS policy blocks non-admins at database level
// Even if frontend is hacked, database protects data
```

### Token Storage Security

Supabase SDK stores tokens in:
- **Browser localStorage** (default)
- **SessionStorage** (session-only)
- **Memory** (custom)

Current: Uses browser localStorage (survives refresh, cleared on browser close)

### XSS Prevention

Even if attacker gets JWT token, they:
- Can only read/write via Supabase client
- Cannot bypass RLS policies
- Cannot act as user with higher privileges

---

## Testing Role-Based Access

### Test Admin Access

```bash
# 1. Login as admin
npm run dev

# 2. Go to http://localhost:5173/login
# 3. Enter admin@gov.np / password
# 4. Should see admin dashboard at /admin
# 5. Should see "Role: admin" in header
```

### Test Non-Admin Block

```bash
# 1. Create test user in Supabase → Users → Add
# Email: test@example.com
# Password: test123

# 2. Login as test@example.com
# 3. Try visiting /admin directly in URL
# 4. Should see "Access Denied" message

# 5. Try creating a category (if available in UI)
# 6. Backend RLS should block with 403 error
```

### Test RLS Database Protection

```javascript
// In browser console (Advanced)
// This should fail due to RLS:
supabase
  .from('promises')
  .insert([{ title: 'test' }])
  .then(r => console.log(r));

// As non-admin, you'll get:
// Error: new row violates row-level security policy
```

---

## Troubleshooting

### Issue: Admin can't access dashboard

**Check 1:** Is user's role = 'admin'?
```sql
SELECT * FROM profiles WHERE email = 'admin@gov.np';
-- Should show: role='admin'
```

**Check 2:** Is ProtectedAdminRoute receiving the role?
```javascript
// In browser DevTools → Application → Local Storage
// Look for Supabase session
// Redux (if installed) should show auth state
```

**Check 3:** Does RLS policy exist?
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'promises' 
AND policyname LIKE '%insert%';
```

### Issue: User getting 403 when trying to create promises

**This is correct behavior for non-admins.** Check:

```sql
-- Verify RLS is blocking
SELECT * FROM pg_policies 
WHERE tablename = 'promises';

-- Should have policy that checks role = 'admin'
```

---

## Migration from No RBAC to Full RBAC

### Before (Insecure)
```javascript
// Anyone logged in = admin
if (user) {
  // Full access
}
```

### After (Secure)
```javascript
// Check role at TWO levels
if (user?.role === 'admin') {
  // UI shows option
  
  // Try to save
  // RLS blocks if role != 'admin'
  // User gets error message
}
```

---

## Future Enhancements

### 1. Dynamic Permissions

Instead of hardcoded roles, store permissions in database:

```sql
CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  role TEXT,
  resource TEXT,
  action TEXT,  -- 'create', 'read', 'update', 'delete'
  UNIQUE(role, resource, action)
);
```

### 2. Granular RLS

Instead of all-or-nothing, allow users to edit specific promises:

```sql
CREATE TABLE promise_permissions (
  promise_id BIGINT,
  user_id UUID,
  can_edit BOOLEAN,
  FOREIGN KEY (promise_id) REFERENCES promises(id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- RLS policy
CREATE POLICY "Users can edit if granted"
  ON promises FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    OR id IN (
      SELECT promise_id FROM promise_permissions 
      WHERE user_id = auth.uid() AND can_edit = true
    )
  );
```

### 3. Time-Based Access

Revoke admin access after expiration:

```sql
ALTER TABLE profiles ADD COLUMN admin_expires_at TIMESTAMP;

-- RLS policy
CREATE POLICY "Admin access only if not expired"
  ON promises FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'admin' 
      AND (admin_expires_at IS NULL OR admin_expires_at > NOW())
    )
  );
```

---

**Conclusion:** The RBAC system is now enforced at both frontend (user experience) and database (security) levels, making it production-ready and secure against frontend tampering.
