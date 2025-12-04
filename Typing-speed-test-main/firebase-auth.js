// ============================================
// Firebase Authentication Integration
// ============================================

// Import Firebase modules (you'll need to add these to your HTML)
// <script type="module">
//   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
//   import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
// </script>

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBntyu6HtuyC_fopU6BwlRXNbtzTftJ1I",
  authDomain: "typingsite-1952f.firebaseapp.com",
  projectId: "typingsite-1952f",
  storageBucket: "typingsite-1952f.firebasestorage.app",
  messagingSenderId: "295840132830",
  appId: "1:295840132830:web:746954f7d66e0c4c091c4f",
  measurementId: "G-K8YPRERTRQ"
};

// Note: Firebase will be initialized in index.html
// This file will use the global Firebase instance

class FirebaseAuthManager {
  constructor() {
    this.auth = null; // Will be initialized with Firebase auth
    this.authFunctions = null;
    this.currentUser = null;
    this.onAuthChangeCallback = null;
  }

  // Initialize Firebase Auth
  init(auth, authFunctions) {
    this.auth = auth;
    this.authFunctions = authFunctions;
    this.setupAuthListener();
    console.log('FirebaseAuthManager initialized');
  }

  // Listen for auth state changes
  setupAuthListener() {
    if (this.auth && this.authFunctions) {
      this.authFunctions.onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        if (this.onAuthChangeCallback) {
          this.onAuthChangeCallback(user);
        }
      });
    }
  }

  // Set callback for auth state changes
  onAuthChange(callback) {
    this.onAuthChangeCallback = callback;
  }

  // Email/Password Sign Up
  async signUpWithEmail(email, password, username) {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      const userCredential = await this.authFunctions.createUserWithEmailAndPassword(this.auth, email, password);
      await this.authFunctions.updateProfile(userCredential.user, { displayName: username });
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email, password, rememberMe = false) {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      const userCredential = await this.authFunctions.signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      const provider = new this.authFunctions.GoogleAuthProvider();
      const result = await this.authFunctions.signInWithPopup(this.auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // GitHub Sign In
  async signInWithGithub() {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      const provider = new this.authFunctions.GithubAuthProvider();
      const result = await this.authFunctions.signInWithPopup(this.auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign Out
  async signOut() {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      await this.authFunctions.signOut(this.auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out' };
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      if (!this.auth || !this.authFunctions) {
        throw new Error('Firebase not initialized');
      }
      
      await this.authFunctions.sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is signed in
  isSignedIn() {
    return this.currentUser !== null;
  }

  // Get user display name
  getUserDisplayName() {
    return this.currentUser?.displayName || this.currentUser?.email?.split('@')[0] || 'User';
  }

  // Get user email
  getUserEmail() {
    return this.currentUser?.email || '';
  }

  // Get user avatar (first letter of name)
  getUserAvatar() {
    const name = this.getUserDisplayName();
    return name.charAt(0).toUpperCase();
  }

  // Convert Firebase error codes to user-friendly messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/popup-closed-by-user': 'Sign in cancelled',
      'auth/cancelled-popup-request': 'Sign in cancelled',
      'auth/popup-blocked': 'Popup blocked. Please allow popups for this site'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again';
  }
}

// Export singleton instance
export const authManager = new FirebaseAuthManager();
