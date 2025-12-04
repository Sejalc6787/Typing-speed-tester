# Enable Firebase Authentication

## ✅ Firebase is Already Configured!

Your Firebase config is already integrated. Now you just need to enable authentication methods in the Firebase Console.

## Step-by-Step Instructions

### 1. Go to Firebase Console

Visit: https://console.firebase.google.com/project/typingsite-1952f/authentication

Or:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **typingsite-1952f**
3. Click **Authentication** in the left sidebar

### 2. Enable Email/Password Authentication

1. Click on **Sign-in method** tab
2. Find **Email/Password** in the list
3. Click on it
4. Toggle **Enable** switch to ON
5. Click **Save**

✅ **Done!** Users can now sign up with email and password.

### 3. Enable Google Authentication

1. Still in **Sign-in method** tab
2. Find **Google** in the list
3. Click on it
4. Toggle **Enable** switch to ON
5. Select a **Project support email** from dropdown
6. Click **Save**

✅ **Done!** Users can now sign in with Google.

### 4. Enable GitHub Authentication (Optional)

This requires a GitHub OAuth App:

#### Step 4a: Create GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: KeySprint
   - **Homepage URL**: `https://typingsite-1952f.web.app` (or your domain)
   - **Authorization callback URL**: `https://typingsite-1952f.firebaseapp.com/__/auth/handler`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret**
7. Copy the **Client Secret**

#### Step 4b: Add to Firebase

1. Back in Firebase Console → Authentication → Sign-in method
2. Find **GitHub** in the list
3. Click on it
4. Toggle **Enable** switch to ON
5. Paste **Client ID** and **Client Secret**
6. Copy the **Authorization callback URL** shown
7. Click **Save**

✅ **Done!** Users can now sign in with GitHub.

### 5. Add Authorized Domains

If you're deploying to a custom domain:

1. In Firebase Console → Authentication → Settings
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Enter your domain (e.g., `keysprint.com`)
5. Click **Add**

Default domains already authorized:
- `localhost` (for development)
- `typingsite-1952f.web.app`
- `typingsite-1952f.firebaseapp.com`

## Test Your Authentication

### Test Email/Password Signup:
1. Open your app: http://localhost:5174
2. Click the account icon (top right)
3. Click "register"
4. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
   - Confirm password: test123
5. Click "sign up"
6. Check Firebase Console → Authentication → Users
7. You should see the new user!

### Test Email/Password Login:
1. Click account icon → "login"
2. Enter the email and password you just created
3. Click "sign in"
4. You should see your user menu appear!

### Test Google Sign-In:
1. Click account icon → "login"
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the app
5. You should be signed in!

### Test Logout:
1. Click account icon (when logged in)
2. Click "Logout"
3. You should be signed out

## Verify Everything Works

✅ Check Firebase Console → Authentication → Users
- You should see all users who signed up
- Email/password users show email
- Google users show Google profile
- GitHub users show GitHub profile

## Troubleshooting

### "Firebase not initialized"
- Refresh the page
- Check browser console for errors
- Make sure Firebase scripts loaded

### "Popup blocked" (Google/GitHub)
- Allow popups for your site
- Try again

### "Email already in use"
- User already registered
- Use login instead of signup

### "Invalid email"
- Check email format
- Must be valid email address

### "Weak password"
- Password must be at least 6 characters

### "Wrong password"
- Check password is correct
- Use "forgot password" to reset

## What's Working Now

✅ Email/Password signup
✅ Email/Password login
✅ Google sign-in (after enabling)
✅ GitHub sign-in (after enabling)
✅ Password reset
✅ User state persistence
✅ Logout
✅ User profile display
✅ Real-time auth state updates

## Next Steps (Optional)

### Save Typing Test Results
Add Firestore to save user scores:
```javascript
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();
await addDoc(collection(db, 'results'), {
  userId: user.uid,
  wpm: 75,
  accuracy: 98,
  timestamp: new Date()
});
```

### Email Verification
Require users to verify email:
```javascript
import { sendEmailVerification } from 'firebase/auth';
await sendEmailVerification(user);
```

### User Profiles
Store additional user data in Firestore

### Leaderboards
Query top scores from Firestore

---

**That's it!** Just enable the auth methods in Firebase Console and you're ready to go! 🚀
