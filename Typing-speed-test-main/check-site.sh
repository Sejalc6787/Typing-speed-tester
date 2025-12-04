#!/bin/bash
echo "=== Checking KeySprint Site Components ==="
echo ""

# Check HTML structure
echo "✓ Checking HTML Components:"
grep -q "id=\"bg-canvas\"" index.html && echo "  ✓ 3D Background canvas" || echo "  ✗ Missing background canvas"
grep -q "id=\"wordsContainer\"" index.html && echo "  ✓ Words container" || echo "  ✗ Missing words container"
grep -q "id=\"typingInput\"" index.html && echo "  ✓ Typing input" || echo "  ✗ Missing typing input"
grep -q "id=\"loginModal\"" index.html && echo "  ✓ Login modal" || echo "  ✗ Missing login modal"
grep -q "id=\"signupModal\"" index.html && echo "  ✓ Signup modal" || echo "  ✗ Missing signup modal"
grep -q "id=\"themeModal\"" index.html && echo "  ✓ Theme modal" || echo "  ✗ Missing theme modal"
grep -q "id=\"teamModal\"" index.html && echo "  ✓ Team modal" || echo "  ✗ Missing team modal"
grep -q "id=\"settingsModal\"" index.html && echo "  ✓ Settings modal" || echo "  ✗ Missing settings modal"
grep -q "id=\"usernameModal\"" index.html && echo "  ✓ Username modal" || echo "  ✗ Missing username modal"
grep -q "id=\"accountBtn\"" index.html && echo "  ✓ Account button" || echo "  ✗ Missing account button"

echo ""
echo "✓ Checking JavaScript Classes:"
grep -q "class BackgroundAnimation" script.js && echo "  ✓ BackgroundAnimation class" || echo "  ✗ Missing BackgroundAnimation"
grep -q "class TypingTest" script.js && echo "  ✓ TypingTest class" || echo "  ✗ Missing TypingTest"
grep -q "class FirebaseAuthManager" firebase-auth.js && echo "  ✓ FirebaseAuthManager class" || echo "  ✗ Missing FirebaseAuthManager"

echo ""
echo "✓ Checking Firebase Integration:"
grep -q "initializeApp" index.html && echo "  ✓ Firebase initialization" || echo "  ✗ Missing Firebase init"
grep -q "firebaseConfig" index.html && echo "  ✓ Firebase config" || echo "  ✗ Missing Firebase config"
grep -q "getAuth" index.html && echo "  ✓ Firebase Auth" || echo "  ✗ Missing Firebase Auth"

echo ""
echo "✓ Checking CSS Themes:"
grep -q "serika-dark" style.css && echo "  ✓ Serika Dark theme" || echo "  ✗ Missing theme"
grep -q "monokai" style.css && echo "  ✓ Monokai theme" || echo "  ✗ Missing theme"
grep -q "nord" style.css && echo "  ✓ Nord theme" || echo "  ✗ Missing theme"
grep -q "dracula" style.css && echo "  ✓ Dracula theme" || echo "  ✗ Missing theme"

echo ""
echo "=== Site Check Complete ==="
