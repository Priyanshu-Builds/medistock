# Authentication & Role System Analysis

## 🔐 How Login & Signup Roles Work

### Current Implementation

#### 1. **Signup Process** (`/signup`)

**Current Flow:**
1. User fills out form: email, password, full name, **and selects their own role**
2. Role options available: `viewer`, `staff`, `manager`, `admin`
3. Data is sent to Supabase Auth via `signUp()` with role in `user_meta_data`
4. Database trigger `handle_new_user()` automatically creates profile with the selected role
5. Email verification is required (if enabled in Supabase)

**Code Location:** `src/app/(auth)/signup/page.tsx`

```typescript
// User can select ANY role during signup
const [role, setRole] = useState<string>('viewer')

// Role is sent in user metadata
supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      role: role,  // ⚠️ User-selected role
    },
  },
})
```

**Database Trigger:** `supabase-schema.sql` lines 359-377
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')  -- ⚠️ Accepts user-provided role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

#### 2. **Login Process** (`/login`)

**Current Flow:**
1. User enters email and password
2. Supabase Auth validates credentials
3. Session is created
4. `useUser` hook fetches profile with role
5. RBAC checks use role from profile

**Code Location:** `src/app/(auth)/login/page.tsx`

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

**No role changes during login** - role is read from existing profile.

---

#### 3. **Role-Based Access Control (RBAC)**

**Role Hierarchy:**
1. **Admin** - Full system access
2. **Manager** - Can manage products, suppliers
3. **Staff** - Can create orders, manage inventory
4. **Viewer** - Read-only access

**Implementation:**
- UI-level restrictions in components
- Database-level RLS policies
- `useUser` hook provides role checks: `isAdmin`, `isManager`, `isStaff`

**Code Location:** `src/lib/hooks/use-user.ts`

---

## ⚠️ **CRITICAL SECURITY ISSUES**

### 🚨 **Issue #1: Self-Assigned Roles (CRITICAL)**

**Problem:**
- Users can select **any role** during signup, including `admin`
- No validation or approval process
- Anyone can create an admin account

**Impact:**
- **CRITICAL** - Complete system compromise possible
- Unauthorized users can gain full access
- Not production-ready

**Current Code:**
```typescript
// signup/page.tsx - Line 21
const [role, setRole] = useState<string>('viewer')

// User can change this to 'admin' in the UI
<SelectItem value="admin">Admin</SelectItem>
```

---

### 🚨 **Issue #2: No Role Validation**

**Problem:**
- Database trigger accepts role from user metadata without validation
- No server-side check to prevent privilege escalation
- Role can be modified via API if not protected

**Impact:**
- Users could potentially modify their role after signup
- Need additional RLS policies to prevent role updates

---

### 🚨 **Issue #3: No Approval Workflow**

**Problem:**
- New users get immediate access based on self-selected role
- No admin approval required
- No email verification for role assignment

**Impact:**
- Cannot control who gets elevated privileges
- No audit trail for role assignments

---

## ✅ **What's Working Well**

### 1. **Database-Level Security (RLS)**
- ✅ Row Level Security enabled on all tables
- ✅ Policies enforce role-based access
- ✅ Users can only see/modify data based on their role

### 2. **UI-Level Restrictions**
- ✅ Buttons disabled for unauthorized actions
- ✅ Clear feedback via toast notifications
- ✅ Consistent RBAC implementation

### 3. **Authentication**
- ✅ Supabase Auth handles password hashing
- ✅ Email verification supported
- ✅ Session management works correctly

### 4. **Profile Creation**
- ✅ Automatic profile creation via trigger
- ✅ Profile linked to auth user
- ✅ Cascade delete on user removal

---

## 🔧 **Production-Ready Fixes Required**

### **Priority 1: Fix Role Assignment (CRITICAL)**

#### **Solution A: Default to Viewer Only (Recommended)**

**1. Remove role selection from signup form:**
```typescript
// Remove role select dropdown
// Always default to 'viewer'
```

**2. Update database trigger:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'viewer'  -- Always default to viewer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**3. Add admin-only role update policy:**
```sql
-- Only admins can update roles
CREATE POLICY "Only admins can update roles" ON profiles
  FOR UPDATE USING (
    -- Can update own profile except role
    (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
    OR
    -- Admins can update any profile including role
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    -- Prevent non-admins from changing roles
    (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**4. Create User Management API/UI:**
- Admin-only interface to assign roles
- Audit log for role changes
- Email notifications for role updates

---

#### **Solution B: Invitation-Only System**

**1. Remove public signup:**
- Only admins can create accounts
- Send invitation emails with role pre-assigned

**2. Invitation flow:**
- Admin creates user with role
- User receives email with signup link
- User completes profile (no role selection)

---

### **Priority 2: Add Role Update Protection**

**1. Prevent role updates via RLS:**
```sql
-- Add column-level policy or check constraint
ALTER TABLE profiles ADD CONSTRAINT role_update_check
  CHECK (
    -- Allow initial insert
    true
    OR
    -- Prevent role changes unless admin
    (role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );
```

**2. Add server-side validation:**
- API route to handle role updates
- Verify requester is admin
- Log all role changes

---

### **Priority 3: Add Audit Logging**

**1. Create audit log table:**
```sql
CREATE TABLE role_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  old_role TEXT,
  new_role TEXT,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT
);
```

**2. Trigger on role changes:**
```sql
CREATE OR REPLACE FUNCTION log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role THEN
    INSERT INTO role_audit_log (user_id, old_role, new_role, changed_by)
    VALUES (NEW.id, OLD.role, NEW.role, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_change_audit
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION log_role_change();
```

---

### **Priority 4: Email Verification**

**1. Enable email verification in Supabase:**
- Settings → Authentication → Email Auth
- Enable "Confirm email"

**2. Block access until verified:**
```typescript
// Check email verification status
const { data: { user } } = await supabase.auth.getUser()
if (!user?.email_confirmed_at) {
  // Redirect to verification page
}
```

---

## 📋 **Production Readiness Checklist**

### **Authentication & Authorization**
- [ ] ❌ **CRITICAL:** Remove self-role assignment from signup
- [ ] ❌ **CRITICAL:** Add role update protection (RLS + API)
- [ ] ⚠️ Add email verification requirement
- [ ] ⚠️ Add account approval workflow (optional)
- [ ] ✅ Password hashing (Supabase handles)
- [ ] ✅ Session management (Supabase handles)
- [ ] ✅ RLS policies (implemented)

### **Security**
- [ ] ⚠️ Add rate limiting on login/signup
- [ ] ⚠️ Add CAPTCHA for signup
- [ ] ⚠️ Add password strength requirements
- [ ] ⚠️ Add account lockout after failed attempts
- [ ] ✅ HTTPS (handled by hosting)
- [ ] ✅ CORS protection (Supabase handles)

### **Audit & Compliance**
- [ ] ❌ Add role change audit log
- [ ] ⚠️ Add login attempt logging
- [ ] ⚠️ Add user activity tracking
- [ ] ⚠️ Add data retention policies

### **User Experience**
- [ ] ✅ Clear error messages
- [ ] ✅ Loading states
- [ ] ⚠️ Password reset flow
- [ ] ⚠️ Account recovery
- [ ] ⚠️ Two-factor authentication (optional)

---

## 🎯 **Recommended Implementation Plan**

### **Phase 1: Critical Security Fixes (Immediate)**
1. Remove role selection from signup form
2. Update database trigger to always default to 'viewer'
3. Add RLS policy to prevent role updates (except admins)
4. Create admin-only user management interface

### **Phase 2: Enhanced Security (Week 1)**
1. Add email verification requirement
2. Add role change audit logging
3. Add rate limiting
4. Add password strength validation

### **Phase 3: Production Hardening (Week 2)**
1. Add CAPTCHA
2. Add account lockout
3. Add comprehensive audit logging
4. Add user activity tracking

---

## 📊 **Current Status Summary**

| Component | Status | Production Ready? |
|-----------|--------|------------------|
| **Login** | ✅ Working | ✅ Yes (with enhancements) |
| **Signup** | ⚠️ Working | ❌ **NO** (self-role assignment) |
| **Role Assignment** | ❌ Insecure | ❌ **NO** |
| **RBAC (UI)** | ✅ Working | ✅ Yes |
| **RLS Policies** | ✅ Working | ✅ Yes |
| **Profile Management** | ✅ Working | ✅ Yes |

---

## 🚀 **Quick Fix for Immediate Production**

**Minimum viable fix (30 minutes):**

1. **Remove role dropdown from signup:**
```typescript
// Delete lines 102-116 in signup/page.tsx
// Remove role state
```

2. **Update trigger to force 'viewer':**
```sql
-- Run in Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'viewer'  -- Always viewer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. **Add role update protection:**
```sql
-- Only admins can update roles
CREATE POLICY "Admins can update roles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

**This makes it production-safe immediately!** ✅

---

## 📝 **Conclusion**

**Current State:**
- ❌ **NOT production-ready** due to self-role assignment
- ✅ Authentication and RBAC infrastructure is solid
- ✅ Database security (RLS) is well-implemented

**After Fixes:**
- ✅ Will be production-ready with recommended changes
- ✅ Secure role management
- ✅ Proper audit trail

**Recommendation:** Implement Phase 1 fixes immediately before production deployment.
