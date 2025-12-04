# Firebase Authentication Setup Guide

## Overview

Your KeySprint typing test now has a complete authentication system ready for Firebase integration. This guide will help you connect it to Firebase.

## What's Already Built

### UI Components ✅
- **Login Modal** - Email/password + social auth
- **Signup Modal** - Registration with username
- **User Menu** - Profile dropdown with logout
- **Social Auth Buttons** - Google and GitHub
- **Password Reset** - Forgot password functionality
- **Remember Me** - Persistent login option

### Features ✅
- Form validation
- Password confirmation
- Error handling structure
- User state management
- Responsive design
- Theme integration

## Firebase Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "KeySprint" (or your choice)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password** - Click Enable
   - ✅ **Google** - Click Enable, add support email
   - ✅ **GitHub** - Click Enable, follow GitHub OAuth setup

#### GitHub OAuth Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://YOUR-PROJECT.firebaseapp.com/__/auth/handler`
4. Copy Client ID and Client Secret to Firebase

### 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** icon (</>)
4. Register app with nickname: "KeySprint Web"
5. Copy the `firebaseConfig` object

### 4. Add Firebase to Your Project

#### Option A: Using CDN (Recommended for quick setup)

Add these script tags to your `index.html` before the closing `</body>` tag:

```html
<!-- Firebase App (the core Firebase SDK) -->
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
  } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Make auth available globally
  window.firebaseAuth = auth;
  window.GoogleAuthProvider = GoogleAuthProvider;
  window.GithubAuthProvider = GithubAuthProvider;
  window.firebaseAuthFunctions = {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
  };
</script>
```

#### Option B: Using npm (For production)

```bash
npm install firebase
```

Then update `firebase-auth.js` to import from 'firebase/auth'.

### 5. Update firebase-auth.js

Open `firebase-auth.js` and:

1. Replace `YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, etc. with your actual Firebase config
2. Uncomment all the Firebase import statements
3. Uncomment the Firebase initialization code
4. Uncomment all the Firebase method calls in each function

### 6. Connect Auth Manager to Your App

In `script.js`, add this to the `TypingTest` constructor:

```javascript
// Import auth manager
import { authManager } from './firebase-auth.js';

// In constructor, after initElements():
if (window.firebaseAuth) {
  authManager.init(window.firebaseAuth);
  authManager.onAuthChange((user) => {
    this.handleAuthStateChange(user);
  });
}
```

### 7. Update Auth Methods in script.js

Replace the mock auth methods with real Firebase calls:

```javascript
async handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  const result = await authManager.signInWithEmail(email, password, rememberMe);
  
  if (result.success) {
    this.closeLoginModal();
    // User state will be updated by onAuthStateChanged
  } else {
    alert(result.error);
  }
}

async handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupPasswordConfirm').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  const result = await authManager.signUpWithEmail(email, password, username);
  
  if (result.success) {
    this.closeSignupModal();
    // User state will be updated by onAuthStateChanged
  } else {
    alert(result.error);
  }
}

async handleGoogleAuth() {
  const result = await authManager.signInWithGoogle();
  if (result.success) {
    this.closeLoginModal();
    this.closeSignupModal();
  } else {
    alert(result.error);
  }
}

async handleGithubAuth() {
  const result = await authManager.signInWithGithub();
  if (result.success) {
    this.closeLoginModal();
    this.closeSignupModal();
  } else {
    alert(result.error);
  }
}

async handleLogout() {
  const result = await authManager.signOut();
  if (result.success) {
    this.closeUserMenu();
  }
}

handleAuthStateChange(user) {
  if (user) {
    // User is signed in
    this.userName.textContent = user.displayName || user.email.split('@')[0];
    this.userEmail.textContent = user.email;
    this.userAvatar.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
    document.getElementById('notificationsBtn').style.display = 'flex';
  } else {
    // User is signed out
    document.getElementById('notificationsBtn').style.display = 'none';
  }
}
```

## What You Need to Provide

### Required Information:
1. ✅ Firebase Project ID
2. ✅ Firebase API Key
3. ✅ Firebase Auth Domain
4. ✅ Firebase Storage Bucket
5. ✅ Firebase Messaging Sender ID
6. ✅ Firebase App ID

### Optional (for GitHub auth):
7. GitHub OAuth Client ID
8. GitHub OAuth Client Secret

## Testing the Integration

### 1. Test Email/Password Signup
- Click account icon → Register
- Fill in username, email, password
- Click "sign up"
- Check Firebase Console → Authentication → Users

### 2. Test Email/Password Login
- Click account icon → Login
- Enter email and password
- Click "sign in"
- User menu should appear

### 3. Test Google Auth
- Click "Continue with Google"
- Select Google account
- Should redirect back and show user menu

### 4. Test GitHub Auth
- Click "Continue with GitHub"
- Authorize the app
- Should redirect back and show user menu

### 5. Test Logout
- Click account icon (when logged in)
- Click "Logout"
- Should return to logged out state

### 6. Test Password Reset
- Click "forgot password?"
- Enter email
- Check email for reset link

## Security Rules (Firestore - Optional)

If you want to store user typing test results:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /results/{resultId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Additional Features You Can Add

### 1. Save Typing Test Results
```javascript
import { getFirestore, collection, addDoc } from 'firebase/firestore';

async saveTestResult(wpm, accuracy, time) {
  const db = getFirestore();
  await addDoc(collection(db, 'results'), {
    userId: auth.currentUser.uid,
    wpm: wpm,
    accuracy: accuracy,
    time: time,
    timestamp: new Date()
  });
}
```

### 2. User Profile Page
- Display user stats
- Show typing history
- Personal best scores
- Progress charts

### 3. Leaderboard
- Global rankings
- Friend rankings
- Daily/weekly/monthly boards

### 4. Email Verification
```javascript
import { sendEmailVerification } from 'firebase/auth';

await sendEmailVerification(auth.currentUser);
```

## Troubleshooting

### Common Issues:

**"Firebase not defined"**
- Make sure Firebase scripts are loaded before your app scripts
- Check browser console for script loading errors

**"Auth domain not authorized"**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**"Popup blocked"**
- Social auth requires popups
- Ask users to allow popups for your site

**"Invalid API key"**
- Double-check your Firebase config
- Make sure you copied the entire config object

**"Email already in use"**
- User tried to sign up with existing email
- Direct them to login instead

## Current Mock Behavior

Until you connect Firebase, the app uses localStorage to simulate authentication:
- Login/Signup stores user data locally
- Logout clears local data
- User menu shows mock user info
- No actual authentication happens

## Need Help?

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- Check `firebase-auth.js` for implementation details
- All auth UI is already built and styled!

---

**Ready to connect!** Just add your Firebase config and uncomment the code in `firebase-auth.js`. 🚀
