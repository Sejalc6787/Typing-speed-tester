# Login System Test Guide

## ✅ How to Test the Login System

### Test 1: Account Icon Click (Not Logged In)

**Steps:**
1. Open http://localhost:5174
2. Look at top-right corner
3. Click the **account icon** (person icon)

**Expected Result:**
- ✅ Login modal should appear
- ✅ Shows "login" title
- ✅ Email and password fields visible
- ✅ "Continue with Google" button visible
- ✅ "Continue with GitHub" button visible
- ✅ "forgot password?" link visible
- ✅ "don't have an account? register" link visible

**If It Doesn't Work:**
- Check browser console for errors (F12)
- Verify Firebase is initialized (should see "Firebase initialized successfully!" in console)
- Refresh the page

---

### Test 2: Switch to Signup

**Steps:**
1. From login modal, click **"register"** link at bottom
2. Signup modal should appear

**Expected Result:**
- ✅ Signup modal replaces login modal
- ✅ Shows "register" title
- ✅ Username field visible
- ✅ Email field visible
- ✅ Password field visible
- ✅ Verify password field visible
- ✅ Social auth buttons visible
- ✅ "already have an account? login" link visible

---

### Test 3: Email/Password Signup

**Steps:**
1. Click account icon → register
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123`
   - Verify password: `test123`
3. Click **"sign up"** button

**Expected Result (Firebase Enabled):**
- ✅ Signup modal closes
- ✅ Username prompt appears
- ✅ Enter username (e.g., "testuser")
- ✅ Click "continue"
- ✅ User is logged in
- ✅ Account icon shows user menu on click
- ✅ Notifications icon appears

**Expected Result (Firebase Not Enabled):**
- ⚠️ Error message: "Firebase not initialized" or similar
- Need to enable Firebase Authentication first

---

### Test 4: Email/Password Login

**Steps:**
1. Click account icon → login
2. Fill in:
   - Email: `test@example.com`
   - Password: `test123`
3. Check "remember me" (optional)
4. Click **"sign in"** button

**Expected Result (Firebase Enabled):**
- ✅ Login modal closes
- ✅ User is logged in
- ✅ Account icon shows user menu on click
- ✅ User name appears in menu
- ✅ User email appears in menu
- ✅ Avatar shows first letter of name

**Expected Result (Firebase Not Enabled):**
- ⚠️ Error message appears
- Need to enable Firebase Authentication

---

### Test 5: Google Sign-In

**Steps:**
1. Click account icon → login
2. Click **"Continue with Google"** button
3. Select Google account in popup
4. Authorize the app

**Expected Result (Firebase Enabled):**
- ✅ Google popup appears
- ✅ Select account
- ✅ Popup closes
- ✅ User is logged in
- ✅ If no display name: username prompt appears
- ✅ Account menu shows Google profile info

**Expected Result (Firebase Not Enabled):**
- ⚠️ Error: "Firebase not initialized"
- Need to enable Google auth in Firebase Console

---

### Test 6: Account Icon Click (Logged In)

**Steps:**
1. After logging in successfully
2. Click the **account icon** again

**Expected Result:**
- ✅ User menu dropdown appears (NOT login modal)
- ✅ Shows user avatar (first letter)
- ✅ Shows user name
- ✅ Shows user email
- ✅ Shows "Profile" button
- ✅ Shows "Settings" button
- ✅ Shows "Logout" button

---

### Test 7: User Menu Actions

**From User Menu:**

**Profile Button:**
- Click "Profile"
- ✅ Settings modal opens
- ✅ Profile tab is active
- ✅ Shows user information

**Settings Button:**
- Click "Settings"
- ✅ Settings modal opens
- ✅ Preferences tab is active
- ✅ Shows theme selector and toggles

**Logout Button:**
- Click "Logout"
- ✅ User menu closes
- ✅ User is logged out
- ✅ Notifications icon disappears
- ✅ Clicking account icon shows login modal again

---

### Test 8: Close User Menu

**Steps:**
1. Click account icon (when logged in)
2. User menu appears
3. Click anywhere outside the menu

**Expected Result:**
- ✅ User menu closes
- ✅ Can click account icon again to reopen

---

### Test 9: Forgot Password

**Steps:**
1. Click account icon → login
2. Enter email: `test@example.com`
3. Click **"forgot password?"** link

**Expected Result (Firebase Enabled):**
- ✅ Alert: "Password reset email sent to test@example.com"
- ✅ Check email inbox for reset link
- ✅ Click link to reset password

**Expected Result (Firebase Not Enabled):**
- ⚠️ Error message
- Need Firebase Authentication enabled

---

### Test 10: Close Modals

**Login/Signup Modal:**
- Click X button (top right)
- ✅ Modal closes
- Click outside modal (on dark background)
- ✅ Modal closes

**Settings Modal:**
- Click X button (top right)
- ✅ Modal closes
- Click outside modal
- ✅ Modal closes

**Username Prompt:**
- Cannot close until username is entered
- ✅ Must complete to proceed

---

## 🔧 Troubleshooting

### Issue: Login modal doesn't appear

**Check:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Verify `accountBtn` element exists
4. Check if click event is registered

**Fix:**
- Refresh the page
- Clear browser cache
- Check if script.js loaded correctly

---

### Issue: "Firebase not initialized" error

**Check:**
1. Look for "Firebase initialized successfully!" in console
2. Verify Firebase SDK loaded
3. Check Firebase config in index.html

**Fix:**
1. Enable Authentication in Firebase Console
2. Enable Email/Password provider
3. Enable Google provider (optional)
4. Refresh the page

---

### Issue: User menu doesn't show after login

**Check:**
1. Verify user is actually logged in
2. Check console for auth state changes
3. Look for "User signed in:" message

**Fix:**
- Check `handleAuthStateChange` method
- Verify `updateUserUI` is called
- Check if user has display name

---

### Issue: Account icon not clickable

**Check:**
1. Inspect element in browser
2. Verify button exists
3. Check z-index and positioning

**Fix:**
- Verify HTML structure is correct
- Check CSS for `pointer-events: none`
- Ensure no overlapping elements

---

## 📋 Quick Checklist

Before testing, ensure:
- [ ] Dev server is running (http://localhost:5174)
- [ ] Firebase SDK loaded (check console)
- [ ] No JavaScript errors in console
- [ ] Account icon visible in top-right
- [ ] Login modal HTML exists
- [ ] Signup modal HTML exists
- [ ] User menu HTML exists

---

## 🎯 Expected Console Messages

### On Page Load:
```
Firebase initialized successfully!
Auth manager initialized
```

### On Login Success:
```
Login successful
User signed in: user@example.com
```

### On Signup Success:
```
Signup successful
User signed in: user@example.com
```

### On Logout:
```
Logout successful
User signed out
```

---

## 🔐 Firebase Setup Required

To fully test authentication:

1. **Enable Email/Password:**
   - Go to Firebase Console
   - Authentication → Sign-in method
   - Enable Email/Password

2. **Enable Google (Optional):**
   - Same location
   - Enable Google
   - Select support email

3. **Test:**
   - Refresh your app
   - Try signing up
   - Should work without errors!

---

## ✅ Success Criteria

The login system is working correctly if:

1. ✅ Clicking account icon shows login modal (when not logged in)
2. ✅ Can switch between login and signup
3. ✅ Can sign up with email/password
4. ✅ Username prompt appears after signup
5. ✅ Can log in with email/password
6. ✅ Clicking account icon shows user menu (when logged in)
7. ✅ User menu shows correct information
8. ✅ Can access Profile and Settings
9. ✅ Can log out successfully
10. ✅ After logout, clicking account icon shows login modal again

---

**Everything is set up correctly! Just enable Firebase Authentication and test! 🚀**
