<template>
  <div class="hello">
    <!-- Animated Background Elements -->
    <div class="background-effects">
      <div class="floating-particles">
        <div class="particle" v-for="n in 12" :key="n"></div>
      </div>
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- User Avatar Navigation -->
    <div class="user-avatar-container">
      <div class="user-avatar" @click="toggleUserMenu" :class="{ 'active': showUserMenu }">
        <div class="avatar-circle">
          <span class="avatar-text">{{ getAvatarText(userData?.username || 'Player') }}</span>
        </div>
        <div class="avatar-status"></div>
      </div>
      
      <!-- User Dropdown Menu -->
      <div class="user-dropdown" v-if="showUserMenu" @click.stop>
        <div class="dropdown-header">
          <div class="dropdown-avatar">
            <span class="dropdown-avatar-text">{{ getAvatarText(userData?.username || 'Player') }}</span>
          </div>
          <div class="dropdown-info">
            <h4 class="dropdown-name">{{ userData?.username || 'Player' }}</h4>
            <p class="dropdown-type">{{ userData?.isGuest ? 'Guest User' : 'Registered User' }}</p>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-actions">
          <button @click="handleLogout" class="dropdown-logout">
            <span class="logout-icon"></span>
            Logout
          </button>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Level Display -->
    <div class="level-display-section">
      <div class="level-badges">
        <div class="level-badge" :class="{ 'active': currentLevel >= 1, 'current': currentLevel === 1 }">
      <img src="../assets/level-1.png" alt="level-1" />
          <span class="level-number">1</span>
        </div>
        <div class="level-badge" :class="{ 'active': currentLevel >= 2, 'current': currentLevel === 2 }">
      <img src="../assets/level-2.png" alt="level-2" />
          <span class="level-number">2</span>
        </div>
        <div class="level-badge" :class="{ 'active': currentLevel >= 3, 'current': currentLevel === 3 }">
      <img src="../assets/level-3.png" alt="level-3" />
          <span class="level-number">3</span>
        </div>
      </div>
      <div class="level-info-card">
        <h2 class="current-level-title">Level {{ currentLevel }}</h2>
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: levelProgressPercentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ levelProgressText }}</span>
        </div>
      </div>
    </div>
    <div v-if="showCard" class="vue-flip-container" :class="{ 'shuffle-show': isShuffling }">
      <Carousel3d 
        :on-main-slide-click="onSelect" 
        :width="280" 
        :height="390"
        @before-slide-change="onBeforeSlideChange"
        @after-slide-change="onAfterSlideChange"
      >
        <Slide v-for="(slide, index) in cards" :index="index" :key="index" style="background-color: #ffffff00; border: none;">
          <vue-flip active-click>
            <template v-slot:front>
              <div class="front">
                <img src="../assets/back.jpeg" alt="card-front"/>
              </div>
            </template>
            <template v-slot:back>
              <div class="back">
                <img :src="getCardImage(slide.image)" alt="card-back" />
              </div>
            </template>
          </vue-flip>
        </Slide>
      </Carousel3d>
    </div>
    <div v-if="showCard" class="card-controls-container">
      <button class="reset-shuffle-button" @click="resetAndShuffleCards">
        <span class="button-icon">🔄</span>
        <span class="button-text">Reset & Shuffle Cards</span>
        <div class="button-shine"></div>
      </button>
    </div>
    <!-- <div class="progress-bar-container">
      <img src="../assets/progress-60.png" alt="progress-bar" />
    </div> -->

    <!-- Level Display Section -->
    <div v-if="false" class="level-display-container">
      <h3>Opened Cards</h3>
      <div class="opened-cards-list">
        <div v-for="(card, index) in openedCards" :key="index" class="opened-card-item">
          <img :src="getCardImage(card.image)" :alt="card.text" class="opened-card-image" />
          <div class="opened-card-info">
            <span class="card-name">{{ card.text }}</span>
            <span class="card-level">Level: {{ card.level }}</span>
          </div>
        </div>
      </div>
      <div class="total-level-display">
        <span class="total-level-label">Total Level:</span>
        <span class="total-level-value">{{ totalLevel }}</span>
      </div>
      
    </div>

    <!-- Music Control Section -->
    <div class="music-control-container">
      <button 
        class="music-toggle-button"
        @click="toggleMusic"
        :class="{ 'music-playing': isMusicPlaying }"
      >
        <span class="music-icon">{{ isMusicPlaying ? '🔊' : '🔇' }}</span>
        <span class="music-text">{{ isMusicPlaying ? 'Music ON' : 'Music OFF' }}</span>
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showResetDialog" class="dialog-overlay" @click="closeResetDialog">
      <div class="dialog-container" @click.stop>
        <div class="dialog-header">
          <div class="dialog-icon">⚠️</div>
          <h3>Konfirmasi Reset</h3>
          <div class="dialog-subtitle">Reset & Shuffle Cards</div>
        </div>
        <div class="dialog-content">
          <p class="dialog-question">Apakah Anda ingin mereset kartu dan mengacaknya?</p>
          <div class="dialog-warning-box">
            <div class="warning-icon">🚨</div>
            <p class="dialog-warning">Semua progress akan hilang!</p>
          </div>
          <div class="dialog-info">
            <div class="info-item">
              <span class="info-icon">📊</span>
              <span>Level: {{ currentLevel }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">⭐</span>
              <span>XP: {{ totalLevel }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🃏</span>
              <span>Kartu Terbuka: {{ openedCards.length }}</span>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="dialog-button dialog-button-no" @click="closeResetDialog">
            <span class="button-icon">❌</span>
            <span>Tidak</span>
          </button>
          <button class="dialog-button dialog-button-yes" @click="confirmReset">
            <span class="button-icon">✅</span>
            <span>Ya, Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Wheel of Fortune Section -->
    <div  v-if="showSpin" class="wheel-of-fortune-container">
      <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
        <div 
          v-for="(segment, index) in segments" 
          :key="index"
          class="segment"
          :style="{
            backgroundColor: segment.color,
            transform: `rotate(${(360 / segments.length) * index}deg)`
          }"
        >
          <span class="segment-text">{{ segment.text }}</span>
        </div>
      </div>
      
      <div class="pointer"><img src="../assets/pokeball.png" alt="pointer" width="50px"/></div>
      
      <button 
        class="spin-button"
        :disabled="isSpinning"
        @click="spinWheel"
      >
        SPIN
      </button>
    </div>

    <!-- Background Music -->
    <audio 
      ref="backgroundMusic" 
      loop 
      preload="auto"
      autoplay
      @loadeddata="onMusicLoaded"
      @error="onMusicError"
      @play="onMusicPlay"
      @pause="onMusicPause"
    >
      <source :src="currentLevelMusic" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Card Open Sound Effect -->
    <audio 
      ref="openCardSound" 
      preload="auto"
      @loadeddata="onOpenCardSoundLoaded"
      @error="onOpenCardSoundError"
    >
      <source src="../assets/open-card.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Swipe Navigation Sound Effect -->
    <audio 
      ref="swipeSound" 
      preload="auto"
      @loadeddata="onSwipeSoundLoaded"
      @error="onSwipeSoundError"
    >
      <source src="../assets/swipe.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Level Up Sound Effect -->
    <audio 
      ref="levelUpSound" 
      preload="auto"
      @loadeddata="onLevelUpSoundLoaded"
      @error="onLevelUpSoundError"
    >
      <source src="../assets/level-up.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Shuffle Cards Sound Effect -->
    <audio 
      ref="shuffleSound" 
      preload="auto"
      @loadeddata="onShuffleSoundLoaded"
      @error="onShuffleSoundError"
    >
      <source src="../assets/shuffle-cards.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Open Dialog Sound Effect -->
    <audio 
      ref="openDialogSound" 
      preload="auto"
      @loadeddata="onOpenDialogSoundLoaded"
      @error="onOpenDialogSoundError"
    >
      <source src="../assets/open-dialog.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Dialog Yes Sound Effect -->
    <audio 
      ref="dialogYesSound" 
      preload="auto"
      @loadeddata="onDialogYesSoundLoaded"
      @error="onDialogYesSoundError"
    >
      <source src="../assets/dialog-yes.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Dialog No Sound Effect -->
    <audio 
      ref="dialogNoSound" 
      preload="auto"
      @loadeddata="onDialogNoSoundLoaded"
      @error="onDialogNoSoundError"
    >
      <source src="../assets/dialog-no.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>      
</template>

<script>
import { VueFlip } from 'vue-flip';

export default {
  components: {
    'vue-flip': VueFlip,
  },
  name: 'HelloWorld',
  props: {
    msg: String,
    userData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      getPrize: 1,
      showSpin: false,
      showPrize: false,
      showCard: true,
      rotation: 0,
      isSpinning: false,
      isShuffling: false,
      openedCards: [],
      totalLevel: 0,
      isMusicPlaying: true,
      musicLoaded: false,
      autoplayAttempted: false,
      openCardSoundLoaded: false,
      swipeSoundLoaded: false,
      levelUpSoundLoaded: false,
      shuffleSoundLoaded: false,
      openDialogSoundLoaded: false,
      dialogYesSoundLoaded: false,
      dialogNoSoundLoaded: false,
      previousLevel: 1,
      showResetDialog: false,
      showUserMenu: false,
      cards:[
        {image: '1.jpeg', text: 'level 1', level:10, isOpened: false},
        {image: '2.jpeg', text: 'level 2', level:10, isOpened: false},
        {image: '3.jpeg', text: 'level 3', level:10, isOpened: false},
        {image: '4.jpeg', text: 'level 4', level:10, isOpened: false},
        {image: '5.jpeg', text: 'level 5', level:10, isOpened: false},
        {image: '6.jpeg', text: 'level 6', level:10, isOpened: false},
        {image: '7.jpeg', text: 'level 7', level:10, isOpened: false},
        {image: '8.jpeg', text: 'level 8', level:30, isOpened: false},
      ],
      segments: [
        {color: '#FF6B6B', text: '1', level:'5'},
        {color: '#4ECDC4', text: '2', level:'5'},
        {color: '#45B7D1', text: '3', level:'5'},
        {color: '#96CEB4', text: '4', level:'5'},
        {color: '#FFEAA7', text: '5', level:'10'},
        {color: '#DDA0DD', text: '6', level:'15'},
        {color: '#98D8C8', text: '7', level:'25'},
        {color: '#F7DC6F', text: '8', level:'40'}
      ]
    }
  },
  computed: {
    currentLevel() {
      // Calculate current level based on total level (every 50 levels = 1 level up)
      return Math.floor(this.totalLevel / 50) + 1;
    },
    levelProgressPercentage() {
      // Calculate progress within current level (0-100%)
      const currentLevelStart = (this.currentLevel - 1) * 50;
      const progressInLevel = this.totalLevel - currentLevelStart;
      return Math.min((progressInLevel / 50) * 100, 100);
    },
    levelProgressText() {
      const currentLevelStart = (this.currentLevel - 1) * 50;
      const progressInLevel = this.totalLevel - currentLevelStart;
      const nextLevelRequirement = 50;
      return `${progressInLevel}/${nextLevelRequirement} XP to Level ${this.currentLevel + 1}`;
    },
    currentLevelMusic() {
      const level = this.currentLevel;
      if (level >= 3) {
        return require('../assets/bgm-lvl-3.mp3');
      } else if (level >= 2) {
        return require('../assets/bgm-lvl-2.mp3');
      } else {
        return require('../assets/bgm-lvl-1.mp3');
      }
    },
    currentLevelBackground() {
      const level = this.currentLevel;
      if (level >= 3) {
        return require('../assets/bg-lvl-3.jpg');
      } else if (level >= 2) {
        return require('../assets/bg-lvl-2.jpg');
      } else {
        return require('../assets/bg-lvl-1.jpg');
      }
    }
  },
  watch: {
    currentLevel(newLevel, oldLevel) {
      console.log(`Level watcher triggered: ${oldLevel} -> ${newLevel}`);
      
      // Check if level increased
      if (newLevel > oldLevel && oldLevel > 0) {
        console.log(`Level up! From level ${oldLevel} to level ${newLevel}`);
        this.playLevelUpSound();
      }
      
      // Change background music and background when level changes
      if (newLevel !== oldLevel) {
        console.log(`Level changed from ${oldLevel} to ${newLevel}, changing background and music`);
        this.changeBackgroundMusic();
        // Add a small delay to ensure the level change is processed
        setTimeout(() => {
          this.changeBackground();
        }, 100);
      }
    }
  },
  methods: {
    getCardImage(image) {
      return require(`../assets/${image}`);
    },
    changeBackgroundMusic() {
      if (!this.musicLoaded) {
        console.log('Music not loaded yet, will change when loaded');
        return;
      }

      const audio = this.$refs.backgroundMusic;
      if (audio && this.isMusicPlaying) {
        // Store current playing state
        const wasPlaying = this.isMusicPlaying;
        
        // Change the source to new level music
        audio.src = this.currentLevelMusic;
        
        // Reload the audio
        audio.load();
        
        // Resume playing if it was playing before
        if (wasPlaying) {
          audio.play().then(() => {
            console.log(`Background music changed to level ${this.currentLevel} music`);
          }).catch(error => {
            console.log('Failed to play new level music:', error);
          });
        }
      }
    },
    changeBackground() {
      console.log(`changeBackground called for level ${this.currentLevel}`);
      console.log(`Current level background: ${this.currentLevelBackground}`);
      
      // Update the background image directly on the .hello element
      const helloElement = document.querySelector('.hello');
      if (helloElement) {
        const newBackground = `url(${this.currentLevelBackground})`;
        helloElement.style.backgroundImage = newBackground;
        console.log(`Background changed to level ${this.currentLevel} background: ${this.currentLevelBackground}`);
        console.log(`New background style applied: ${newBackground}`);
      } else {
        console.log('Hello element not found!');
      }
    },
    onSelect() {
      // Play card open sound effect
      this.playOpenCardSound();
      
      // Find the current card that was clicked
      const currentCard = this.cards.find(card => !card.isOpened);
      if (currentCard) {
        currentCard.isOpened = true;
        this.openedCards.push({...currentCard});
        this.totalLevel += currentCard.level;
        console.log(`Opened ${currentCard.text} - Level ${currentCard.level}`);
      }
    },
    handleWinner(winner) {
      let prize = parseInt(winner.text);
      if(prize === 8) {
        prize = 1
      } else {
        prize++
      } 
      this.getPrize = prize 
      this.showPrize = true
      this.showCard = true
    },
    resetAndShuffleCards() {
      // Play open dialog sound effect
      this.playOpenDialogSound();
      
      // Show confirmation dialog instead of immediately resetting
      this.showResetDialog = true;
    },
    confirmReset() {
      // Play dialog yes sound effect
      this.playDialogYesSound();
      
      // Close dialog
      this.showResetDialog = false;
      
      // Play shuffle sound effect
      this.playShuffleSound();
      
      // Add button animation
      const button = event.target
      button.classList.add('shuffle-animation')
      
      // Set shuffling state
      this.isShuffling = true
      
      // Hide cards for shuffle effect
      this.showCard = false
      this.showPrize = false
      
      // Reset all cards to unopened state
      this.cards.forEach(card => {
        card.isOpened = false
      })
      
      // Reset opened cards and level tracking
      this.openedCards = []
      this.totalLevel = 0
      
      // Change background music to Level 1 music since we're resetting to Level 1
      this.changeToLevel1Music();
      
      // Show cards again with shuffle effect
      setTimeout(() => {
        this.showCard = true
        // Remove button animation and add success effect
        button.classList.remove('shuffle-animation')
        button.classList.add('shuffle-success')
        setTimeout(() => {
          this.isShuffling = false
          button.classList.remove('shuffle-success')
        }, 600) // Wait for shuffle-show animation to complete
      }, 500)
      
      console.log('Cards reset and shuffled!')
    },
    closeResetDialog() {
      // Play dialog no sound effect
      this.playDialogNoSound();
      
      this.showResetDialog = false;
    },
    changeToLevel1Music() {
      if (!this.musicLoaded) {
        console.log('Music not loaded yet, will change when loaded');
        return;
      }

      const audio = this.$refs.backgroundMusic;
      if (audio && this.isMusicPlaying) {
        // Store current playing state
        const wasPlaying = this.isMusicPlaying;
        
        // Change the source to Level 1 music
        audio.src = require('../assets/bgm-lvl-1.mp3');
        
        // Reload the audio
        audio.load();
        
        // Resume playing if it was playing before
        if (wasPlaying) {
          audio.play().then(() => {
            console.log('Background music changed to Level 1 music after reset');
          }).catch(error => {
            console.log('Failed to play Level 1 music after reset:', error);
          });
        }
      }
    },
    spinWheel() {
      this.showCard = false
      this.showPrize = false
      
      if (this.isSpinning) return;
      
      this.isSpinning = true;
      const randomRotation = Math.random() * 360 + 2160; // At least 6 full rotations
      const duration = 6000; // 6 seconds
      
      this.rotation += randomRotation;
      
      setTimeout(() => {
        this.isSpinning = false;
        const normalizedRotation = this.rotation % 360;
        const segmentIndex = Math.floor(((360 - normalizedRotation) / (360 / this.segments.length)) % this.segments.length);
        this.handleWinner(this.segments[segmentIndex]);
      }, duration);
    },
    toggleMusic() {
      if (!this.musicLoaded) {
        console.log('Music not loaded yet');
        return;
      }

      const audio = this.$refs.backgroundMusic;
      
      if (this.isMusicPlaying) {
        audio.pause();
        this.isMusicPlaying = false;
        console.log('Music paused');
      } else {
        // Modern browsers require user interaction to play audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isMusicPlaying = true;
            console.log('Music started playing');
          }).catch(error => {
            console.log('Play prevented:', error);
            // Music will be controlled by the button state
          });
        }
      }
    },
    onMusicLoaded() {
      this.musicLoaded = true;
      console.log('Background music loaded successfully');
      
      // Try to start autoplay when music is loaded
      if (!this.autoplayAttempted) {
        this.attemptAutoplay();
      }
      
      // Also try immediate autoplay
      const audio = this.$refs.backgroundMusic;
      if (audio && this.isMusicPlaying) {
        audio.volume = 0.7;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Immediate autoplay failed:', error);
          });
        }
      }
    },
    onMusicError(error) {
      console.error('Error loading background music:', error);
      this.musicLoaded = false;
    },
    onMusicPlay() {
      this.isMusicPlaying = true;
      console.log('Music started playing');
    },
    onMusicPause() {
      this.isMusicPlaying = false;
      console.log('Music paused');
    },
    attemptAutoplay() {
      if (!this.musicLoaded || this.autoplayAttempted) {
        return;
      }
      
      this.autoplayAttempted = true;
      const audio = this.$refs.backgroundMusic;
      
      if (audio) {
        // Set volume to ensure it's audible
        audio.volume = 0.7;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isMusicPlaying = true;
            console.log('Autoplay successful - music started');
          }).catch(error => {
            console.log('Autoplay prevented by browser:', error);
            // Keep music state as playing even if autoplay fails
            // User can manually start it with the button
            this.isMusicPlaying = true;
          });
        }
      }
    },
    playOpenCardSound() {
      if (!this.openCardSoundLoaded) {
        console.log('Open card sound not loaded yet');
        return;
      }

      const openCardAudio = this.$refs.openCardSound;
      if (openCardAudio) {
        // Reset audio to beginning and play
        openCardAudio.currentTime = 0;
        const playPromise = openCardAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Open card sound played');
          }).catch(error => {
            console.log('Open card sound play failed:', error);
          });
        }
      }
    },
    playSwipeSound() {
      if (!this.swipeSoundLoaded) {
        console.log('Swipe sound not loaded yet');
        return;
      }

      const swipeAudio = this.$refs.swipeSound;
      if (swipeAudio) {
        // Reset audio to beginning and play
        swipeAudio.currentTime = 0;
        const playPromise = swipeAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Swipe sound played');
          }).catch(error => {
            console.log('Swipe sound play failed:', error);
          });
        }
      }
    },
    onBeforeSlideChange(index) {
      console.log('Before slide change to index:', index);
    },
    onAfterSlideChange(index) {
      console.log('After slide change to index:', index);
      // Play swipe sound when navigating between cards
      this.playSwipeSound();
    },
    onOpenCardSoundLoaded() {
      this.openCardSoundLoaded = true;
      console.log('Open card sound loaded successfully');
    },
    onOpenCardSoundError(error) {
      console.error('Error loading open card sound:', error);
      this.openCardSoundLoaded = false;
    },
    onSwipeSoundLoaded() {
      this.swipeSoundLoaded = true;
      console.log('Swipe sound loaded successfully');
    },
    onSwipeSoundError(error) {
      console.error('Error loading swipe sound:', error);
      this.swipeSoundLoaded = false;
    },
    playLevelUpSound() {
      if (!this.levelUpSoundLoaded) {
        console.log('Level up sound not loaded yet');
        return;
      }

      const levelUpAudio = this.$refs.levelUpSound;
      if (levelUpAudio) {
        // Reset audio to beginning and play
        levelUpAudio.currentTime = 0;
        const playPromise = levelUpAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Level up sound played');
          }).catch(error => {
            console.log('Level up sound play failed:', error);
          });
        }
      }
    },
    onLevelUpSoundLoaded() {
      this.levelUpSoundLoaded = true;
      console.log('Level up sound loaded successfully');
    },
    onLevelUpSoundError(error) {
      console.error('Error loading level up sound:', error);
      this.levelUpSoundLoaded = false;
    },
    playShuffleSound() {
      if (!this.shuffleSoundLoaded) {
        console.log('Shuffle sound not loaded yet');
        return;
      }

      const shuffleAudio = this.$refs.shuffleSound;
      if (shuffleAudio) {
        // Reset audio to beginning and play
        shuffleAudio.currentTime = 0;
        const playPromise = shuffleAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Shuffle sound played');
          }).catch(error => {
            console.log('Shuffle sound play failed:', error);
          });
        }
      }
    },
    onShuffleSoundLoaded() {
      this.shuffleSoundLoaded = true;
      console.log('Shuffle sound loaded successfully');
    },
    onShuffleSoundError(error) {
      console.error('Error loading shuffle sound:', error);
      this.shuffleSoundLoaded = false;
    },
    playOpenDialogSound() {
      if (!this.openDialogSoundLoaded) {
        console.log('Open dialog sound not loaded yet');
        return;
      }

      const openDialogAudio = this.$refs.openDialogSound;
      if (openDialogAudio) {
        // Reset audio to beginning and play
        openDialogAudio.currentTime = 0;
        const playPromise = openDialogAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Open dialog sound played');
          }).catch(error => {
            console.log('Open dialog sound play failed:', error);
          });
        }
      }
    },
    onOpenDialogSoundLoaded() {
      this.openDialogSoundLoaded = true;
      console.log('Open dialog sound loaded successfully');
    },
    onOpenDialogSoundError(error) {
      console.error('Error loading open dialog sound:', error);
      this.openDialogSoundLoaded = false;
    },
    playDialogYesSound() {
      if (!this.dialogYesSoundLoaded) {
        console.log('Dialog yes sound not loaded yet');
        return;
      }

      const dialogYesAudio = this.$refs.dialogYesSound;
      if (dialogYesAudio) {
        // Reset audio to beginning and play
        dialogYesAudio.currentTime = 0;
        const playPromise = dialogYesAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Dialog yes sound played');
          }).catch(error => {
            console.log('Dialog yes sound play failed:', error);
          });
        }
      }
    },
    onDialogYesSoundLoaded() {
      this.dialogYesSoundLoaded = true;
      console.log('Dialog yes sound loaded successfully');
    },
    onDialogYesSoundError(error) {
      console.error('Error loading dialog yes sound:', error);
      this.dialogYesSoundLoaded = false;
    },
    playDialogNoSound() {
      if (!this.dialogNoSoundLoaded) {
        console.log('Dialog no sound not loaded yet');
        return;
      }

      const dialogNoAudio = this.$refs.dialogNoSound;
      if (dialogNoAudio) {
        // Reset audio to beginning and play
        dialogNoAudio.currentTime = 0;
        const playPromise = dialogNoAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Dialog no sound played');
          }).catch(error => {
            console.log('Dialog no sound play failed:', error);
          });
        }
      }
    },
    onDialogNoSoundLoaded() {
      this.dialogNoSoundLoaded = true;
      console.log('Dialog no sound loaded successfully');
    },
    onDialogNoSoundError(error) {
      console.error('Error loading dialog no sound:', error);
      this.dialogNoSoundLoaded = false;
    },
    handleLogout() {
      // Close user menu
      this.showUserMenu = false;
      // Emit logout event to parent component
      this.$emit('logout');
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    getAvatarText(username) {
      if (!username) return 'P';
      // Get first letter of username, or first two letters if it's a single character
      if (username.length === 1) {
        return username.toUpperCase();
      }
      return username.substring(0, 2).toUpperCase();
    },
    handleClickOutside(event) {
      // Close user menu if clicking outside
      if (this.showUserMenu && !event.target.closest('.user-avatar-container')) {
        this.showUserMenu = false;
      }
    }
  },
  mounted() {
    // Set initial background
    this.changeBackground();
    
    // Try to load the music when component is mounted
    if (this.$refs.backgroundMusic) {
      this.$refs.backgroundMusic.volume = 0.7;
      this.$refs.backgroundMusic.load();
      
      // Try autoplay multiple times to ensure it starts
      setTimeout(() => {
        this.attemptAutoplay();
      }, 500);
      
      setTimeout(() => {
        this.attemptAutoplay();
      }, 1000);
      
      setTimeout(() => {
        this.attemptAutoplay();
      }, 2000);
    }

    // Load sound effects
    if (this.$refs.openCardSound) {
      this.$refs.openCardSound.load();
    }
    if (this.$refs.swipeSound) {
      this.$refs.swipeSound.load();
    }
    if (this.$refs.levelUpSound) {
      this.$refs.levelUpSound.load();
    }
    if (this.$refs.shuffleSound) {
      this.$refs.shuffleSound.load();
    }
    if (this.$refs.openDialogSound) {
      this.$refs.openDialogSound.load();
    }
    if (this.$refs.dialogYesSound) {
      this.$refs.dialogYesSound.load();
    }
    if (this.$refs.dialogNoSound) {
      this.$refs.dialogNoSound.load();
    }

    // Add click outside listener for user menu
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style>
@import '../assets/style/main.css';
</style>