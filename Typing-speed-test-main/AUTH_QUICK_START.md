# Authentication Quick Start

## What I Need From You

To connect Firebase Authentication, provide these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Where to Get These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new one)
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" section
5. Click Web icon (</>)
6. Copy the config object

## Quick Setup (3 Steps)

### Step 1: Add Firebase to HTML

Add before `</body>` in `index.html`:

```html
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

  const firebaseConfig = {
    // PASTE YOUR CONFIG HERE
  };

  const app = initializeApp(firebaseConfig);
  window.firebaseAuth = getAuth(app);
</script>
```

### Step 2: Enable Auth Methods in Firebase

1. Firebase Console → Authentication → Sign-in method
2. Enable:
   - ✅ Email/Password
   - ✅ Google (add support email)
   - ✅ GitHub (optional - needs OAuth setup)

### Step 3: Update firebase-auth.js

1. Open `firebase-auth.js`
2. Replace the `firebaseConfig` with your values
3. Uncomment all Firebase code (remove `//` from Firebase lines)

## That's It!

The UI is already built. Just provide your Firebase config and enable auth methods.

## Test It

1. Click account icon → Register
2. Create account with email/password
3. Check Firebase Console → Authentication → Users
4. Your user should appear!

## Current Features

✅ Email/Password signup
✅ Email/Password login  
✅ Google sign-in
✅ GitHub sign-in
✅ Password reset
✅ Remember me
✅ User menu with logout
✅ Profile dropdown
✅ Responsive design
✅ Theme integration

## Mock Mode (Current)

Until Firebase is connected:
- Uses localStorage to simulate auth
- Login/signup work but don't persist
- Perfect for testing UI
- No real authentication

## Need More Help?

See `FIREBASE_SETUP.md` for detailed instructions.
