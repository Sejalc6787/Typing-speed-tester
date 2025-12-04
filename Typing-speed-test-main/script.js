import * as THREE from 'three';
import { authManager } from './firebase-auth.js';

// ============================================
// 3D Background Animation with Three.js
// ============================================
class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xe2b714,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);

    // Create geometric shapes
    this.createGeometricShapes();

    // Animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  createGeometricShapes() {
    const geometries = [
      new THREE.TorusGeometry(0.5, 0.2, 16, 100),
      new THREE.OctahedronGeometry(0.5),
      new THREE.IcosahedronGeometry(0.5)
    ];

    this.shapes = [];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xe2b714,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      );
      
      this.shapes.push(mesh);
      this.scene.add(mesh);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate particles
    this.particles.rotation.y += 0.0005;
    this.particles.rotation.x += 0.0002;

    // Rotate shapes
    this.shapes.forEach((shape, index) => {
      shape.rotation.x += 0.001 * (index + 1);
      shape.rotation.y += 0.002 * (index + 1);
    });

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// ============================================
// Word Lists
// ============================================
const wordLists = {
  common: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
    'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
    'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
    'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
    'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
    'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
    'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is'
  ]
};

// ============================================
// Typing Test Application
// ============================================
class TypingTest {
  constructor() {
    this.mode = 'time';
    this.modeValue = 15;
    this.words = [];
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.isTestActive = false;
    this.startTime = null;
    this.timer = null;
    this.timeRemaining = 15;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.totalChars = 0;
    this.extraChars = 0;

    this.initElements();
    this.initEventListeners();
    this.generateWords();
    this.renderWords();
    this.showFocusOverlay();
    this.initFirebaseAuth();
  }

  initElements() {
    this.wordsContainer = document.getElementById('wordsContainer');
    this.typingInput = document.getElementById('typingInput');
    this.wpmDisplay = document.getElementById('wpmDisplay');
    this.accuracyDisplay = document.getElementById('accuracyDisplay');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.restartBtn = document.getElementById('restartBtn');
    this.resultModal = document.getElementById('resultModal');
    this.nextTestBtn = document.getElementById('nextTestBtn');
    this.themeBtn = document.getElementById('themeBtn');
    this.typingArea = document.getElementById('typingArea');
    this.themeModal = document.getElementById('themeModal');
    this.themeCloseBtn = document.getElementById('themeCloseBtn');
    this.themeGrid = document.getElementById('themeGrid');
    this.themeSearch = document.getElementById('themeSearch');
    this.teamBtn = document.getElementById('teamBtn');
    this.teamModal = document.getElementById('teamModal');
    this.teamCloseBtn = document.getElementById('teamCloseBtn');
    this.focusOverlay = document.getElementById('focusOverlay');
    this.languageBtn = document.getElementById('languageBtn');
    this.currentLanguage = document.getElementById('currentLanguage');
    
    // Auth elements
    this.accountBtn = document.getElementById('accountBtn');
    this.userMenu = document.getElementById('userMenu');
    this.loginModal = document.getElementById('loginModal');
    this.signupModal = document.getElementById('signupModal');
    this.loginCloseBtn = document.getElementById('loginCloseBtn');
    this.signupCloseBtn = document.getElementById('signupCloseBtn');
    this.loginForm = document.getElementById('loginForm');
    this.signupForm = document.getElementById('signupForm');
    this.showSignupLink = document.getElementById('showSignupLink');
    this.showLoginLink = document.getElementById('showLoginLink');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.googleLoginBtn = document.getElementById('googleLoginBtn');
    this.githubLoginBtn = document.getElementById('githubLoginBtn');
    this.googleSignupBtn = document.getElementById('googleSignupBtn');
    this.githubSignupBtn = document.getElementById('githubSignupBtn');
    this.forgotPasswordLink = document.getElementById('forgotPasswordLink');
    this.userName = document.getElementById('userName');
    this.userEmail = document.getElementById('userEmail');
    this.userAvatar = document.getElementById('userAvatar');
    
    // Settings elements
    this.settingsModal = document.getElementById('settingsModal');
    this.settingsCloseBtn = document.getElementById('settingsCloseBtn');
    this.profileBtn = document.getElementById('profileBtn');
    this.settingsBtn = document.getElementById('settingsBtn');
    
    // Username modal elements
    this.usernameModal = document.getElementById('usernameModal');
    this.usernameForm = document.getElementById('usernameForm');
    this.usernameInput = document.getElementById('usernameInput');
  }

  initEventListeners() {
    // Config buttons
    document.querySelectorAll('.config-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleConfigChange(e));
    });

    // Typing input
    this.typingInput.addEventListener('input', (e) => this.handleInput(e));
    this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Restart button
    this.restartBtn.addEventListener('click', () => this.restart());

    // Next test button
    this.nextTestBtn.addEventListener('click', () => this.nextTest());

    // Theme modal
    this.themeBtn.addEventListener('click', () => this.openThemeModal());
    this.themeCloseBtn.addEventListener('click', () => this.closeThemeModal());
    this.themeModal.addEventListener('click', (e) => {
      if (e.target === this.themeModal) this.closeThemeModal();
    });
    this.themeSearch.addEventListener('input', (e) => this.filterThemes(e.target.value));

    // Team modal
    this.teamBtn.addEventListener('click', () => this.openTeamModal());
    this.teamCloseBtn.addEventListener('click', () => this.closeTeamModal());
    this.teamModal.addEventListener('click', (e) => {
      if (e.target === this.teamModal) this.closeTeamModal();
    });

    // Footer About link opens team modal
    const footerAboutLink = document.getElementById('footerAboutLink');
    if (footerAboutLink) {
      footerAboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTeamModal();
      });
    }

    // Focus overlay
    this.focusOverlay.addEventListener('click', () => this.focusInput());
    this.typingArea.addEventListener('click', () => this.focusInput());

    // Global key press to focus
    document.addEventListener('keydown', (e) => {
      // Don't focus if typing in a modal or input field
      if (e.target.tagName === 'INPUT' && e.target !== this.typingInput) return;
      if (this.themeModal.classList.contains('show')) return;
      if (this.teamModal.classList.contains('show')) return;
      if (this.resultModal.classList.contains('show')) return;
      
      // Focus the input on any key press
      if (!this.typingInput.matches(':focus')) {
        this.focusInput();
      }
    });

    // Language selector (placeholder for now)
    this.languageBtn.addEventListener('click', () => {
      // Future: Open language selection modal
      console.log('Language selector clicked');
    });

    // Auth event listeners
    this.accountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isUserLoggedIn()) {
        this.toggleUserMenu();
      } else {
        this.openLoginModal();
      }
    });

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.accountBtn.contains(e.target) && !this.userMenu.contains(e.target)) {
        this.closeUserMenu();
      }
    });

    // Login modal
    this.loginCloseBtn.addEventListener('click', () => this.closeLoginModal());
    this.loginModal.addEventListener('click', (e) => {
      if (e.target === this.loginModal) this.closeLoginModal();
    });

    // Signup modal
    this.signupCloseBtn.addEventListener('click', () => this.closeSignupModal());
    this.signupModal.addEventListener('click', (e) => {
      if (e.target === this.signupModal) this.closeSignupModal();
    });

    // Switch between login and signup
    this.showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeLoginModal();
      this.openSignupModal();
    });

    this.showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSignupModal();
      this.openLoginModal();
    });

    // Form submissions
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));

    // Social auth buttons
    this.googleLoginBtn.addEventListener('click', () => this.handleGoogleAuth());
    this.githubLoginBtn.addEventListener('click', () => this.handleGithubAuth());
    this.googleSignupBtn.addEventListener('click', () => this.handleGoogleAuth());
    this.githubSignupBtn.addEventListener('click', () => this.handleGithubAuth());

    // Logout
    this.logoutBtn.addEventListener('click', () => this.handleLogout());

    // Forgot password
    this.forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleForgotPassword();
    });

    // Settings modal
    this.profileBtn.addEventListener('click', () => this.openSettings('profile'));
    this.settingsBtn.addEventListener('click', () => this.openSettings('preferences'));
    this.settingsCloseBtn.addEventListener('click', () => this.closeSettings());
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.closeSettings();
    });

    // Settings navigation
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchSettingsTab(tab);
      });
    });

    // Theme select in preferences
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = localStorage.getItem('theme') || 'serika-dark';
      themeSelect.addEventListener('change', (e) => {
        this.applyTheme(e.target.value);
      });
    }

    // Save profile button
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', () => this.saveProfile());
    }

    // Other settings buttons
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', () => this.changePassword());
    }

    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    if (verifyEmailBtn) {
      verifyEmailBtn.addEventListener('click', () => this.verifyEmail());
    }

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => this.deleteAccount());
    }

    // Clear stats button
    const clearStatsBtn = document.getElementById('clearStatsBtn');
    if (clearStatsBtn) {
      clearStatsBtn.addEventListener('click', () => this.clearStatistics());
    }

    // Username form submission
    this.usernameForm.addEventListener('submit', (e) => this.handleUsernameSubmit(e));

    // Click on words container to focus input
    this.wordsContainer.addEventListener('click', () => {
      this.typingInput.focus();
    });

    // Focus management
    this.typingInput.addEventListener('focus', () => {
      this.focusOverlay.classList.add('hidden');
      this.wordsContainer.classList.add('focused');
    });

    this.typingInput.addEventListener('blur', () => {
      if (!this.isTestActive) {
        this.showFocusOverlay();
      }
      this.wordsContainer.classList.remove('focused');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        this.restart();
      }
    });
  }

  handleConfigChange(e) {
    const btn = e.target;
    const mode = btn.dataset.mode;
    const value = parseInt(btn.dataset.value);

    // Update active state
    document.querySelectorAll('.config-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    this.mode = mode;
    this.modeValue = value;
    this.restart();
  }

  generateWords() {
    const count = this.mode === 'words' ? this.modeValue : 100;
    this.words = [];
    
    for (let i = 0; i < count; i++) {
      const randomWord = wordLists.common[Math.floor(Math.random() * wordLists.common.length)];
      this.words.push(randomWord);
    }
  }

  renderWords() {
    this.wordsContainer.innerHTML = '';
    
    this.words.forEach((word, wordIndex) => {
      const wordElement = document.createElement('div');
      wordElement.className = 'word';
      wordElement.dataset.wordIndex = wordIndex;

      word.split('').forEach((letter, letterIndex) => {
        const letterElement = document.createElement('span');
        letterElement.className = 'letter';
        letterElement.textContent = letter;
        letterElement.dataset.letterIndex = letterIndex;
        wordElement.appendChild(letterElement);
      });

      this.wordsContainer.appendChild(wordElement);
    });

    this.updateCurrentLetter();
  }

  updateCurrentLetter() {
    // Remove all current classes
    document.querySelectorAll('.letter.current').forEach(el => el.classList.remove('current'));

    // Add current class to current letter
    const currentWord = this.wordsContainer.querySelector(`[data-word-index="${this.currentWordIndex}"]`);
    if (currentWord) {
      const currentLetter = currentWord.querySelector(`[data-letter-index="${this.currentLetterIndex}"]`);
      if (currentLetter) {
        currentLetter.classList.add('current');
      }
    }
  }

  handleInput(e) {
    if (!this.isTestActive) {
      this.startTest();
    }

    const inputValue = e.target.value;
    const currentWord = this.words[this.currentWordIndex];

    // Check if space is pressed (word completed)
    if (inputValue.endsWith(' ')) {
      this.handleWordComplete(inputValue.trim());
      return;
    }

    // Update letter states
    this.updateLetterStates(inputValue);
    this.updateStats();
  }

  handleKeyDown(e) {
    // Prevent space at the beginning
    if (e.key === ' ' && this.typingInput.value === '') {
      e.preventDefault();
    }
  }

  handleWordComplete(typedWord) {
    const currentWord = this.words[this.currentWordIndex];
    const wordElement = this.wordsContainer.querySelector(`[data-word-index="${this.currentWordIndex}"]`);

    // Mark all letters in the word
    typedWord.split('').forEach((char, index) => {
      const letterElement = wordElement.querySelector(`[data-letter-index="${index}"]`);
      if (letterElement) {
        if (char === currentWord[index]) {
          letterElement.classList.add('correct');
          this.correctChars++;
        } else {
          letterElement.classList.add('incorrect');
          this.incorrectChars++;
        }
        this.totalChars++;
      } else {
        // Extra characters
        const extraLetter = document.createElement('span');
        extraLetter.className = 'letter extra incorrect';
        extraLetter.textContent = char;
        wordElement.appendChild(extraLetter);
        this.extraChars++;
        this.incorrectChars++;
        this.totalChars++;
      }
    });

    // Mark remaining letters as incorrect if word was too short
    for (let i = typedWord.length; i < currentWord.length; i++) {
      const letterElement = wordElement.querySelector(`[data-letter-index="${i}"]`);
      if (letterElement) {
        letterElement.classList.add('incorrect');
        this.incorrectChars++;
        this.totalChars++;
      }
    }

    // Move to next word
    this.currentWordIndex++;
    this.currentLetterIndex = 0;
    this.typingInput.value = '';

    // Check if test is complete (words mode)
    if (this.mode === 'words' && this.currentWordIndex >= this.words.length) {
      this.endTest();
      return;
    }

    this.updateCurrentLetter();
    this.updateStats();
  }

  updateLetterStates(inputValue) {
    const currentWord = this.words[this.currentWordIndex];
    const wordElement = this.wordsContainer.querySelector(`[data-word-index="${this.currentWordIndex}"]`);

    // Reset current word letters
    wordElement.querySelectorAll('.letter').forEach(letter => {
      if (!letter.classList.contains('extra')) {
        letter.classList.remove('correct', 'incorrect');
      }
    });

    // Remove extra letters from previous input
    wordElement.querySelectorAll('.letter.extra').forEach(el => el.remove());

    // Update letter states based on input
    inputValue.split('').forEach((char, index) => {
      let letterElement = wordElement.querySelector(`[data-letter-index="${index}"]`);
      
      if (!letterElement) {
        // Extra character
        letterElement = document.createElement('span');
        letterElement.className = 'letter extra incorrect';
        letterElement.textContent = char;
        wordElement.appendChild(letterElement);
      } else {
        if (char === currentWord[index]) {
          letterElement.classList.add('correct');
        } else {
          letterElement.classList.add('incorrect');
        }
      }
    });

    this.currentLetterIndex = inputValue.length;
    this.updateCurrentLetter();
  }

  startTest() {
    this.isTestActive = true;
    this.startTime = Date.now();

    if (this.mode === 'time') {
      this.timeRemaining = this.modeValue;
      this.startTimer();
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.timeDisplay.textContent = this.timeRemaining;

      if (this.timeRemaining <= 0) {
        this.endTest();
      }
    }, 1000);
  }

  updateStats() {
    // Calculate WPM
    if (this.startTime) {
      const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
      const wpm = Math.round((this.correctChars / 5) / timeElapsed) || 0;
      this.wpmDisplay.textContent = wpm;
    }

    // Calculate accuracy
    if (this.totalChars > 0) {
      const accuracy = Math.round((this.correctChars / this.totalChars) * 100) || 0;
      this.accuracyDisplay.textContent = accuracy;
    }
  }

  endTest() {
    this.isTestActive = false;
    clearInterval(this.timer);
    this.typingInput.disabled = true;

    // Calculate final stats
    const timeElapsed = (Date.now() - this.startTime) / 1000;
    const timeElapsedMinutes = timeElapsed / 60;
    const wpm = Math.round((this.correctChars / 5) / timeElapsedMinutes) || 0;
    const rawWpm = Math.round((this.totalChars / 5) / timeElapsedMinutes) || 0;
    const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0;

    // Save test result to statistics
    this.saveTestResult({
      wpm: wpm,
      rawWpm: rawWpm,
      accuracy: accuracy,
      correctChars: this.correctChars,
      totalChars: this.totalChars,
      timeElapsed: Math.round(timeElapsed),
      mode: this.mode,
      modeValue: this.modeValue,
      timestamp: Date.now()
    });

    // Show result modal
    document.getElementById('resultWpm').textContent = wpm;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultChars').textContent = `${this.correctChars}/${this.totalChars}`;
    document.getElementById('resultTime').textContent = Math.round(timeElapsed) + 's';
    document.getElementById('resultRawWpm').textContent = rawWpm;

    this.resultModal.classList.add('show');
  }

  // Save test result to statistics
  saveTestResult(result) {
    try {
      // Get existing stats
      const stats = this.getUserStats();
      
      // Update stats
      stats.testsCompleted = (stats.testsCompleted || 0) + 1;
      stats.totalTime = (stats.totalTime || 0) + result.timeElapsed;
      
      // Update best WPM
      if (!stats.bestWpm || result.wpm > stats.bestWpm) {
        stats.bestWpm = result.wpm;
      }
      
      // Calculate average accuracy
      const totalAccuracy = (stats.avgAccuracy || 0) * (stats.testsCompleted - 1) + result.accuracy;
      stats.avgAccuracy = Math.round(totalAccuracy / stats.testsCompleted);
      
      // Add to recent tests (keep last 10)
      if (!stats.recentTests) {
        stats.recentTests = [];
      }
      stats.recentTests.unshift(result);
      if (stats.recentTests.length > 10) {
        stats.recentTests = stats.recentTests.slice(0, 10);
      }
      
      // Save to localStorage
      localStorage.setItem('userStats', JSON.stringify(stats));
      
      console.log('Test result saved:', result);
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  }

  // Get user statistics
  getUserStats() {
    try {
      const stats = localStorage.getItem('userStats');
      return stats ? JSON.parse(stats) : {
        testsCompleted: 0,
        bestWpm: 0,
        avgAccuracy: 0,
        totalTime: 0,
        recentTests: []
      };
    } catch (error) {
      console.error('Error loading stats:', error);
      return {
        testsCompleted: 0,
        bestWpm: 0,
        avgAccuracy: 0,
        totalTime: 0,
        recentTests: []
      };
    }
  }

  restart() {
    // Reset state
    this.isTestActive = false;
    clearInterval(this.timer);
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.startTime = null;
    this.timeRemaining = this.mode === 'time' ? this.modeValue : 0;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.totalChars = 0;
    this.extraChars = 0;

    // Reset UI
    this.typingInput.value = '';
    this.typingInput.disabled = false;
    this.wpmDisplay.textContent = '0';
    this.accuracyDisplay.textContent = '100';
    this.timeDisplay.textContent = this.mode === 'time' ? this.modeValue : '0';
    this.resultModal.classList.remove('show');

    // Generate new words and render
    this.generateWords();
    this.renderWords();

    // Show focus overlay and focus input
    this.showFocusOverlay();
    this.typingInput.focus();
  }

  nextTest() {
    this.restart();
  }

  openThemeModal() {
    this.themeModal.classList.add('show');
    this.renderThemes();
  }

  closeThemeModal() {
    this.themeModal.classList.remove('show');
  }

  renderThemes(filter = '') {
    const themes = [
      { name: 'serika dark', colors: ['#323437', '#e2b714', '#646669', '#d1d0c5'] },
      { name: 'monokai', colors: ['#272822', '#e6db74', '#75715e', '#f8f8f2'] },
      { name: 'nord', colors: ['#2e3440', '#88c0d0', '#4c566a', '#d8dee9'] },
      { name: 'dracula', colors: ['#282a36', '#ff79c6', '#6272a4', '#f8f8f2'] },
      { name: 'gruvbox dark', colors: ['#282828', '#fabd2f', '#665c54', '#ebdbb2'] },
      { name: 'solarized dark', colors: ['#002b36', '#b58900', '#586e75', '#839496'] },
      { name: 'light', colors: ['#e5e5e5', '#e2b714', '#646669', '#323437'] },
      { name: 'terminal', colors: ['#000000', '#00ff00', '#008000', '#00ff00'] },
      { name: 'vscode', colors: ['#1e1e1e', '#4ec9b0', '#6a9955', '#d4d4d4'] },
      { name: 'ayu dark', colors: ['#0a0e14', '#ffb454', '#4d5566', '#b3b1ad'] }
    ];

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'serika-dark';
    
    const filteredThemes = themes.filter(theme => 
      theme.name.toLowerCase().includes(filter.toLowerCase())
    );

    this.themeGrid.innerHTML = filteredThemes.map(theme => {
      const themeId = theme.name.replace(/\s+/g, '-');
      const isActive = currentTheme === themeId;
      
      return `
        <div class="theme-card ${isActive ? 'active' : ''}" data-theme="${themeId}">
          <div class="theme-card-preview">
            ${theme.colors.map(color => `<div class="theme-card-color" style="background-color: ${color}"></div>`).join('')}
          </div>
          <div class="theme-card-name">${theme.name}</div>
        </div>
      `;
    }).join('');

    // Add click listeners to theme cards
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeName = card.dataset.theme;
        this.applyTheme(themeName);
      });
    });
  }

  filterThemes(query) {
    this.renderThemes(query);
  }

  applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    this.renderThemes(this.themeSearch.value);
  }

  openTeamModal() {
    this.teamModal.classList.add('show');
  }

  closeTeamModal() {
    this.teamModal.classList.remove('show');
  }

  focusInput() {
    this.typingInput.focus();
    this.focusOverlay.classList.add('hidden');
    this.wordsContainer.classList.add('focused');
  }

  showFocusOverlay() {
    this.focusOverlay.classList.remove('hidden');
    this.wordsContainer.classList.remove('focused');
  }

  // Settings Methods
  openSettings(tab = 'profile') {
    this.settingsModal.classList.add('show');
    this.closeUserMenu();
    this.switchSettingsTab(tab);
    this.loadUserProfile();
  }

  closeSettings() {
    this.settingsModal.classList.remove('show');
  }

  switchSettingsTab(tabName) {
    // Update nav items
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      }
    });

    // Update tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
  }

  loadUserProfile() {
    const user = authManager.getCurrentUser();
    if (user) {
      // Profile tab
      document.getElementById('profileDisplayName').value = user.displayName || '';
      document.getElementById('profileEmail').value = user.email || '';
      document.getElementById('profileAvatarLarge').textContent = 
        (user.displayName || user.email).charAt(0).toUpperCase();

      // Account tab
      document.getElementById('accountEmail').textContent = user.email || '';
      const createdDate = user.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';
      document.getElementById('accountCreated').textContent = createdDate;

      // Load stats from localStorage
      this.loadUserStats();
    }
  }

  loadUserStats() {
    const stats = this.getUserStats();
    
    // Update stat cards
    document.getElementById('statBestWpm').textContent = stats.bestWpm || 0;
    document.getElementById('statAvgAccuracy').textContent = (stats.avgAccuracy || 0) + '%';
    document.getElementById('statTestsCompleted').textContent = stats.testsCompleted || 0;
    document.getElementById('statTotalTime').textContent = this.formatTime(stats.totalTime || 0);
    
    // Display recent tests
    this.displayRecentTests(stats.recentTests || []);
  }

  displayRecentTests(tests) {
    const container = document.getElementById('recentTestsList');
    
    if (!tests || tests.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <p>No tests completed yet</p>
          <small>Start typing to see your results here!</small>
        </div>
      `;
      return;
    }
    
    const testsHTML = tests.map((test, index) => {
      const date = new Date(test.timestamp);
      const timeAgo = this.getTimeAgo(test.timestamp);
      const modeLabel = test.mode === 'time' ? `${test.modeValue}s` : `${test.modeValue} words`;
      
      return `
        <div class="recent-test-item">
          <div class="recent-test-header">
            <span class="recent-test-mode">${modeLabel}</span>
            <span class="recent-test-date">${timeAgo}</span>
          </div>
          <div class="recent-test-stats">
            <div class="recent-test-stat">
              <span class="recent-test-label">WPM</span>
              <span class="recent-test-value">${test.wpm}</span>
            </div>
            <div class="recent-test-stat">
              <span class="recent-test-label">Accuracy</span>
              <span class="recent-test-value">${test.accuracy}%</span>
            </div>
            <div class="recent-test-stat">
              <span class="recent-test-label">Time</span>
              <span class="recent-test-value">${test.timeElapsed}s</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = testsHTML;
  }

  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(seconds) {
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    return hours + 'h';
  }

  async saveProfile() {
    const displayName = document.getElementById('profileDisplayName').value;
    const bio = document.getElementById('profileBio').value;

    // TODO: Update Firebase profile
    // await updateProfile(auth.currentUser, { displayName });

    // Save bio to localStorage for now
    localStorage.setItem('userBio', bio);

    alert('Profile updated successfully!');
  }

  async changePassword() {
    const email = authManager.getUserEmail();
    if (!email) {
      alert('Please log in first');
      return;
    }

    const result = await authManager.resetPassword(email);
    if (result.success) {
      alert('Password reset email sent! Check your inbox.');
    } else {
      alert(result.error);
    }
  }

  async verifyEmail() {
    alert('Email verification feature coming soon!');
  }

  async deleteAccount() {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      const doubleConfirm = confirm(
        'This will permanently delete all your data. Are you absolutely sure?'
      );
      
      if (doubleConfirm) {
        // TODO: Implement account deletion with Firebase
        alert('Account deletion feature coming soon!');
      }
    }
  }

  clearStatistics() {
    const confirmed = confirm(
      'Are you sure you want to clear all your statistics? This cannot be undone.'
    );
    
    if (confirmed) {
      localStorage.removeItem('userStats');
      this.loadUserStats();
      alert('Statistics cleared successfully!');
    }
  }

  // Auth Methods
  isUserLoggedIn() {
    return authManager.isSignedIn();
  }

  toggleUserMenu() {
    this.userMenu.classList.toggle('show');
  }

  closeUserMenu() {
    this.userMenu.classList.remove('show');
  }

  openLoginModal() {
    this.loginModal.classList.add('show');
    this.loginForm.reset();
  }

  closeLoginModal() {
    this.loginModal.classList.remove('show');
  }

  openSignupModal() {
    this.signupModal.classList.add('show');
    this.signupForm.reset();
  }

  closeSignupModal() {
    this.signupModal.classList.remove('show');
  }

  // Initialize Firebase Auth
  initFirebaseAuth() {
    // Wait for Firebase to be initialized
    const checkFirebase = setInterval(() => {
      if (window.firebaseAuth && window.firebaseAuthFunctions) {
        clearInterval(checkFirebase);
        authManager.init(window.firebaseAuth, window.firebaseAuthFunctions);
        authManager.onAuthChange((user) => this.handleAuthStateChange(user));
        console.log('Auth manager initialized');
      }
    }, 100);
  }

  // Handle auth state changes
  handleAuthStateChange(user) {
    if (user) {
      // Check if user has a display name
      if (!user.displayName || user.displayName.trim() === '') {
        // Show username prompt
        this.showUsernamePrompt(user);
      } else {
        // User is signed in with display name
        this.updateUserUI(user);
      }
    } else {
      // User is signed out
      document.getElementById('notificationsBtn').style.display = 'none';
      console.log('User signed out');
    }
  }

  updateUserUI(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    this.userName.textContent = displayName;
    this.userEmail.textContent = user.email;
    this.userAvatar.textContent = displayName.charAt(0).toUpperCase();
    document.getElementById('notificationsBtn').style.display = 'flex';
    console.log('User signed in:', user.email);
  }

  showUsernamePrompt(user) {
    this.usernameModal.classList.add('show');
    this.usernameInput.value = '';
    this.usernameInput.focus();
    
    // Store user temporarily
    this.pendingUser = user;
  }

  async handleUsernameSubmit(e) {
    e.preventDefault();
    
    const username = this.usernameInput.value.trim();
    
    if (username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      alert('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Update Firebase profile
    if (this.pendingUser && window.firebaseAuthFunctions) {
      try {
        await window.firebaseAuthFunctions.updateProfile(this.pendingUser, {
          displayName: username
        });
        
        // Close modal and update UI
        this.usernameModal.classList.remove('show');
        this.updateUserUI(this.pendingUser);
        this.pendingUser = null;
        
        console.log('Username set:', username);
      } catch (error) {
        console.error('Error setting username:', error);
        alert('Failed to set username. Please try again.');
      }
    } else {
      // Fallback for testing without Firebase
      this.usernameModal.classList.remove('show');
      alert('Username set: ' + username);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const result = await authManager.signInWithEmail(email, password, rememberMe);
    
    if (result.success) {
      this.closeLoginModal();
      console.log('Login successful');
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

    if (password.length < 6) {
      alert('Password should be at least 6 characters');
      return;
    }

    // Validate username
    if (username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('Username can only contain letters, numbers, and underscores');
      return;
    }

    const result = await authManager.signUpWithEmail(email, password, username);
    
    if (result.success) {
      this.closeSignupModal();
      console.log('Signup successful');
      // Username prompt will show automatically via handleAuthStateChange
    } else {
      alert(result.error);
    }
  }

  async handleGoogleAuth() {
    const result = await authManager.signInWithGoogle();
    
    if (result.success) {
      this.closeLoginModal();
      this.closeSignupModal();
      console.log('Google auth successful');
    } else {
      alert(result.error);
    }
  }

  async handleGithubAuth() {
    const result = await authManager.signInWithGithub();
    
    if (result.success) {
      this.closeLoginModal();
      this.closeSignupModal();
      console.log('GitHub auth successful');
    } else {
      alert(result.error);
    }
  }

  async handleLogout() {
    const result = await authManager.signOut();
    
    if (result.success) {
      this.closeUserMenu();
      console.log('Logout successful');
    } else {
      alert(result.error);
    }
  }

  async handleForgotPassword() {
    const email = document.getElementById('loginEmail').value;
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    const result = await authManager.resetPassword(email);
    
    if (result.success) {
      alert(`Password reset email sent to ${email}. Please check your inbox.`);
    } else {
      alert(result.error);
    }
  }
}

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'serika-dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Initialize 3D background
  new BackgroundAnimation();

  // Initialize typing test
  new TypingTest();
});
