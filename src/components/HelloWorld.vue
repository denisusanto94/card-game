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
            <p class="dropdown-type">{{ userData?.isGuest ? $t('game.guestUser') : $t('game.registeredUser') }}</p>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-actions">
          <!-- Language Switcher -->
          <div class="dropdown-language-switcher">
            <LanguageSwitcher @language-changed="handleLanguageChange" />
          </div>
          <button @click="handleLogout" class="dropdown-logout">
            <span class="logout-icon"></span>
            {{ $t('game.logout') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Level Display -->
    <div class="level-display-section">
      <div class="level-badges">
        <div class="level-badge" :class="{ 'active': currentLevel >= 1, 'current': currentLevel === 1 }">
      <img src="../assets/level-badge/level-1.svg" alt="level-1" />
          <!-- <span class="level-number">1</span> -->
        </div>
        <div class="level-badge" :class="{ 'active': currentLevel >= 2, 'current': currentLevel === 2 }">
      <img src="../assets/level-badge/level-2.svg" alt="level-2" />
          <!-- <span class="level-number">2</span> -->
        </div>
        <div class="level-badge" :class="{ 'active': currentLevel >= 3, 'current': currentLevel === 3 }">
      <img src="../assets/level-badge/level-3.svg" alt="level-3" />
          <!-- <span class="level-number">3</span> -->
        </div>
        <div class="level-badge" :class="{ 'active': currentLevel >= 4, 'current': currentLevel === 4 }">
      <img src="../assets/level-badge/level-4.svg" alt="level-4" />
          <!-- <span class="level-number">4</span> -->
        </div>
      </div>
      <div class="level-info-card">
        <h2 class="current-level-title">{{ currentLevelname(currentLevel) }}</h2>
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
                <img :src="getCardImage(slide.image)" alt="card-back"/>
              </div>
            </template>
          </vue-flip>
        </Slide>
      </Carousel3d>
    </div>
    <div v-if="showCard" class="card-controls-container">
      <button class="reset-shuffle-button" @click="resetAndShuffleCards">
        <span class="button-icon">🔄</span>
        <span class="button-text">{{ $t('game.resetShuffle') }}</span>
        <div class="button-shine"></div>
      </button>
      <button class="reset-shuffle-button" @click="resetAndShuffleCurrentLevel($event)">
        <span class="button-icon">🃏</span>
        <span class="button-text">{{ $t('game.resetLevelShuffle') }}</span>
        <div class="button-shine"></div>
      </button>
      <button v-if="showShuffleCurrentLevelButton" class="reset-shuffle-button" @click="shuffleCurrentLevel($event)">
        <span class="button-icon">🔀</span>
        <span class="button-text">{{ $t('game.shuffleLevel') }}</span>
        <div class="button-shine"></div>
      </button>
      <button class="reset-shuffle-button" @click="shuffleUnopenedCurrentLevel($event)">
        <span class="button-icon">🔃</span>
        <span class="button-text">{{ $t('game.shuffleUnopenedLevel') }}</span>
        <div class="button-shine"></div>
      </button>
    </div>

    <!-- Enlarged Card Dialog -->
    <transition name="carddlg">
      <div v-if="showCardDialog" class="card-dialog-overlay" @click="closeCardDialog">
        <div class="card-dialog" @click.stop>
          <img :src="dialogCardSrc" alt="card-enlarged" class="card-dialog-image" />
          <button class="card-dialog-close" @click="closeCardDialog">×</button>
        </div>
      </div>
    </transition>
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
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showResetDialog" class="dialog-overlay" @click="closeResetDialog">
      <div class="dialog-container" @click.stop>
        <div class="dialog-header">
          <div class="dialog-icon">⚠️</div>
          <h3>{{ $t('dialog.confirmReset') }}</h3>
          <div class="dialog-subtitle">{{ $t('dialog.resetShuffleCards') }}</div>
        </div>
        <div class="dialog-content">
          <p class="dialog-question">{{ $t('dialog.resetQuestion') }}</p>
          <div class="dialog-warning-box">
            <div class="warning-icon">🚨</div>
            <p class="dialog-warning">{{ $t('dialog.allProgressLost') }}</p>
          </div>
          <div class="dialog-info">
            <div class="info-item">
              <span class="info-icon">📊</span>
              <span>{{ $t('game.level') }}: {{ currentLevel }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">⭐</span>
              <span>{{ $t('game.xp') }}: {{ totalLevel }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🃏</span>
              <span>{{ $t('game.openedCards') }}: {{ openedCards.length }}</span>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="dialog-button dialog-button-no" @click="closeResetDialog">
            <span class="button-icon">❌</span>
            <span>{{ $t('dialog.no') }}</span>
          </button>
          <button class="dialog-button dialog-button-yes" @click="confirmReset">
            <span class="button-icon">✅</span>
            <span>{{ $t('dialog.yesReset') }}</span>
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
        {{ $t('game.spin') }}
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

    <!-- Fireworks Container -->
    <div v-if="showFireworks" class="fireworks-container" ref="fireworksContainer">
      <!-- Fireworks will be dynamically generated here -->
    </div>

    <!-- Level Up Celebration -->
    <div v-if="showLevelUpCelebration" class="level-up-celebration" @click="closeLevelUpCelebration">
      <div class="level-up-message">
        {{ $t('celebration.levelUp') }}<br>
        <span style="font-size: 1.5rem; opacity: 0.9;">{{ $t('game.level') }} {{ currentLevel }}</span>
      </div>
    </div>
  </div>      
</template>

<script>
import { VueFlip } from 'vue-flip';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
  components: {
    'vue-flip': VueFlip,
    LanguageSwitcher
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
      showFireworks: false,
      showLevelUpCelebration: false,
      showResetDialog: false,
      showUserMenu: false,
      openedImageMap: {},
      showCardDialog: false,
      dialogCardSrc: null,
      showShuffleCurrentLevelButton: false,
      cards:[
        {image: '1.png', text: 'level 1', level:10, isOpened: false},
        {image: '2.png', text: 'level 1', level:10, isOpened: false},
        {image: '3.png', text: 'level 1', level:10, isOpened: false},
        {image: '4.png', text: 'level 1', level:10, isOpened: false},
        {image: '5.png', text: 'level 1', level:10, isOpened: false}
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
      // Calculate current level based on total level (every 50 levels = 1 level up), capped at 4
      return Math.min(Math.floor(this.totalLevel / 50) + 1, 4);
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
      if (this.currentLevel === 4) {
        return `${progressInLevel}/${nextLevelRequirement} XP (Taboo)`;
      }
      return `${progressInLevel}/${nextLevelRequirement} XP to ${this.currentLevelname(this.currentLevel+1)}`;
    },
    currentLevelMusic() {
      const level = this.currentLevel;
      // Map levels to bgm assets in assets/bgm/
      // 1 -> warm, 2 -> hot, 3 -> wild, 4 -> taboo
      if (level >= 4) {
        return require('../assets/bgm/bgm-taboo.mp3');
      } else if (level === 3) {
        return require('../assets/bgm/bgm-wild.mp3');
      } else if (level === 2) {
        return require('../assets/bgm/bgm-hot.mp3');
      } else {
        return require('../assets/bgm/bgm-warm.mp3');
      }
    },
    currentLevelBackground() {
      const level = this.currentLevel;
      if (level === 4) {
        return require('../assets/background/background-taboo.png');
      } else if (level === 3) {
        return require('../assets/background/background-wild.png');
      } else if (level === 2) {
        return require('../assets/background/background-hot.png');
      } else {
        return require('../assets/background/background-warm.png');
      }
    }
  },
  watch: {
    currentLevel(newLevel, oldLevel) {
      console.log(`Level watcher triggered: ${oldLevel} -> ${newLevel}`);
      
      // Check if level increased (but stop celebrations at MAX level 4)
      if (newLevel > oldLevel && oldLevel > 0 && newLevel < 4) {
        console.log(`Level up! From level ${oldLevel} to level ${newLevel}`);
        this.playLevelUpSound();
        this.triggerFireworks();
        this.showLevelUpCelebration = true;
        
        // Auto-hide celebration after 3 seconds
        setTimeout(() => {
          this.showLevelUpCelebration = false;
        }, 3000);
      }
      
      // Change background music and background when level changes
      if (newLevel !== oldLevel) {
        console.log(`Level changed from ${oldLevel} to ${newLevel}, changing background and music`);
        this.changeBackgroundMusic();
        // Add a small delay to ensure the level change is processed
        setTimeout(() => {
          this.changeBackground();
          // Close all cards and refresh slider
          this.resetCardsForNewLevel();
        }, 100);
      }
    }
  },
  methods: {
    getCardImage(image) {
      return require(`../assets/card/level-${this.currentLevel}/${image}`);
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
        // Prevent duplicate level gain for the same image
        const imageKey = `${this.currentLevel}:${currentCard.image}`;
        if (!this.openedImageMap[imageKey]) {
          currentCard.isOpened = true;
          this.openedCards.push({...currentCard});
          this.totalLevel += currentCard.level;
          this.openedImageMap[imageKey] = true;
          console.log(`Opened ${currentCard.text} - Level ${currentCard.level}`);
        } else {
          console.log('Duplicate card opened - no level gain');
        }
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
      this.openedImageMap = {}
      
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
    resetAndShuffleCurrentLevel(event) {
      // Play shuffle sound effect only
      this.playShuffleSound();

      // Add button animation feedback
      const button = event && event.target ? event.target : null;
      if (button && button.classList) {
        button.classList.add('shuffle-animation');
      }

      // Reset progress within the current level back to 0 (keep same level)
      const currentLevelStart = (this.currentLevel - 1) * 50;
      this.totalLevel = currentLevelStart;

      // Set shuffling state and temporarily hide cards for effect
      this.isShuffling = true;
      const wasVisible = this.showCard;
      this.showCard = false;

      // Reset only card open states for current level; keep XP and level
      this.cards.forEach(card => {
        card.isOpened = false;
      });
      this.openedCards = [];
      // Keep openedImageMap entries for other levels; remove current level only
      const newMap = {};
      const currentPrefix = `${this.currentLevel}:`;
      Object.keys(this.openedImageMap).forEach(key => {
        if (!key.startsWith(currentPrefix)) {
          newMap[key] = true;
        }
      });
      this.openedImageMap = newMap;

      // Show cards again with shuffle effect
      setTimeout(() => {
        this.showCard = wasVisible || true;
        this.isShuffling = false;
        if (button && button.classList) {
          button.classList.remove('shuffle-animation');
          button.classList.add('shuffle-success');
          setTimeout(() => {
            button.classList.remove('shuffle-success');
          }, 600);
        }
      }, 500);

      console.log('Current level cards reset and shuffled');
    },
    shuffleCurrentLevel(event) {
      // Play shuffle sound effect only
      this.playShuffleSound();

      // Button feedback
      const button = event && event.target ? event.target : null;
      if (button && button.classList) {
        button.classList.add('shuffle-animation');
      }

      // Shuffle visible cards without changing opened state or XP
      this.isShuffling = true;
      const wasVisible = this.showCard;
      this.showCard = false;

      // Simple Fisher-Yates shuffle on cards array
      const shuffled = [...this.cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.cards = shuffled;

      setTimeout(() => {
        this.showCard = wasVisible || true;
        this.isShuffling = false;
        if (button && button.classList) {
          button.classList.remove('shuffle-animation');
          button.classList.add('shuffle-success');
          setTimeout(() => {
            button.classList.remove('shuffle-success');
          }, 600);
        }
      }, 500);

      console.log('Current level cards shuffled');
    },
    shuffleUnopenedCurrentLevel(event) {
      // Play shuffle SFX
      this.playShuffleSound();

      console.log(event)
    },
    openCardDialog(src) {
      this.dialogCardSrc = src
      this.showCardDialog = true
    },
    closeCardDialog() {
      this.showCardDialog = false
      this.dialogCardSrc = null
    },
    resetCardsForNewLevel() {
      // Reset open states
      this.cards.forEach(card => {
        card.isOpened = false
      })
      this.openedCards = []
      this.openedImageMap = {}
      // Toggle visibility to refresh 3d carousel
      const wasVisible = this.showCard
      this.showCard = false
      setTimeout(() => {
        this.showCard = wasVisible || true
      }, 200)
    },
    /* revert: removed dynamic card loader */
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
        
        // Change the source to Level 1 music (Warm)
        audio.src = require('../assets/bgm/bgm-warm.mp3');
        
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
    currentLevelname(level) {
      switch (level) {
        case 1:
          return this.$t('Warm');
        case 2:
          return this.$t('Hot');
        case 3:
          return this.$t('Wild');
        case 4:
          return this.$t('Taboo');
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
    },
    
    // Fireworks methods
    triggerFireworks() {
      this.showFireworks = true;
      this.createFireworks();
      
      // Hide fireworks after animation completes
      setTimeout(() => {
        this.showFireworks = false;
      }, 4000);
    },
    
    createFireworks() {
      const container = this.$refs.fireworksContainer;
      if (!container) return;
      
      // Clear any existing fireworks
      container.innerHTML = '';
      
      // Create multiple fireworks with more variety
      const fireworkCount = 12;
      const colors = [
        'firework-red', 'firework-blue', 'firework-yellow', 'firework-purple', 
        'firework-pink', 'firework-green', 'firework-orange', 'firework-cyan',
        'firework-magenta', 'firework-lime', 'firework-indigo', 'firework-teal'
      ];
      
      // Create different types of fireworks
      for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
          const colorClass = colors[i % colors.length];
          const fireworkType = Math.random();
          
          if (fireworkType < 0.3) {
            // Create burst firework (multiple explosions)
            this.createBurstFirework(container, colorClass);
          } else if (fireworkType < 0.6) {
            // Create spiral firework
            this.createSpiralFirework(container, colorClass);
          } else {
            // Create regular firework
            this.createSingleFirework(container, colorClass);
          }
        }, i * 150); // Faster stagger for more excitement
      }
    },
    
    createSingleFirework(container, colorClass) {
      // Random position for the firework
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.2); // Upper 60% of screen
      
      // Create rocket
      const rocket = document.createElement('div');
      rocket.className = 'firework-rocket';
      rocket.style.left = x + 'px';
      rocket.style.bottom = '0px';
      container.appendChild(rocket);
      
      // Create explosion after rocket reaches target
      setTimeout(() => {
        this.createExplosion(container, x, y, colorClass);
        rocket.remove();
      }, 1500);
    },
    
    createExplosion(container, x, y, colorClass, particleCount = 12) {
      // Create main explosion
      const explosion = document.createElement('div');
      explosion.className = `firework-explosion ${colorClass}`;
      explosion.style.left = x + 'px';
      explosion.style.top = y + 'px';
      container.appendChild(explosion);
      
      // Create particles with enhanced variety
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle ${colorClass}`;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random direction for particles with more variety
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 120;
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--random-x', randomX + 'px');
        particle.style.setProperty('--random-y', randomY + 'px');
        
        // Add random delay for more natural effect
        particle.style.animationDelay = Math.random() * 0.2 + 's';
        
        container.appendChild(particle);
        
        // Remove particles after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
          }
        }, 1500 + Math.random() * 500);
      }
      
      // Remove explosion after animation
      setTimeout(() => {
        if (explosion.parentNode) {
          explosion.remove();
        }
      }, 1000);
    },
    
    
    closeLevelUpCelebration() {
      this.showLevelUpCelebration = false;
    },
    
    // New firework types
    createBurstFirework(container, colorClass) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.2);
      
      // Create rocket
      const rocket = document.createElement('div');
      rocket.className = 'firework-rocket';
      rocket.style.left = x + 'px';
      rocket.style.bottom = '0px';
      container.appendChild(rocket);
      
      // Create multiple explosions after rocket reaches target
      setTimeout(() => {
        rocket.remove();
        
        // Create 3-5 smaller explosions in a cluster
        const burstCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < burstCount; i++) {
          setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            this.createExplosion(container, x + offsetX, y + offsetY, colorClass, 8);
          }, i * 100);
        }
      }, 1500);
    },
    
    createSpiralFirework(container, colorClass) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.2);
      
      // Create rocket
      const rocket = document.createElement('div');
      rocket.className = 'firework-rocket';
      rocket.style.left = x + 'px';
      rocket.style.bottom = '0px';
      container.appendChild(rocket);
      
      // Create spiral explosion after rocket reaches target
      setTimeout(() => {
        rocket.remove();
        
        // Create spiral pattern of explosions
        const spiralCount = 8;
        for (let i = 0; i < spiralCount; i++) {
          setTimeout(() => {
            const angle = (i / spiralCount) * Math.PI * 2;
            const radius = 30 + i * 10;
            const spiralX = x + Math.cos(angle) * radius;
            const spiralY = y + Math.sin(angle) * radius;
            this.createExplosion(container, spiralX, spiralY, colorClass, 6);
          }, i * 80);
        }
      }, 1500);
    },
    handleLanguageChange() {
      // Force re-render by updating a reactive property
      this.$forceUpdate();
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

<style lang="scss" scoped>
.level-display-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin: 16px 0 20px;
}

.level-badges {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-badge {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: saturate(1.12) contrast(1.06);
    -webkit-filter: saturate(1.12) contrast(1.06);
  }

  .level-number {
    position: absolute;
    right: 6px;
    bottom: 6px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 800;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 10px;
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
  }

  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.34);
  }

  &.active {
    filter: saturate(1.1) brightness(1.04);
  }

  &.current {
    transform: scale(1.06);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.38);
  }
}

.level-info-card {
  width: 100%;
  max-width: 520px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06));
  box-shadow: 0 14px 34px rgba(0,0,0,0.22);
  backdrop-filter: blur(10px);
}

.card-controls-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.reset-shuffle-button {
  flex: 1;
}

.current-level-title {
  margin: 0 0 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #ffffff;
}

/* Card Dialog Styles */
.card-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.card-dialog {
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}

.card-dialog-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-dialog-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.85);
  color: #111;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

/* Transition for dialog */
.carddlg-enter-active, .carddlg-leave-active {
  transition: opacity 0.2s ease, transform 0.24s ease;
}
.carddlg-enter-from, .carddlg-leave-to {
  opacity: 0;
}
.carddlg-enter-from .card-dialog {
  transform: scale(0.88);
}
.carddlg-leave-to .card-dialog {
  transform: scale(0.94);
}

@media (max-width: 768px) {
  .level-badge {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }
}

.dropdown-language-switcher {
  margin-bottom: 12px;
  padding: 0 4px;
  
  // Override the language switcher button styles for dropdown context
  :deep(.language-button) {
    width: 100%;
    justify-content: flex-start;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.15));
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.25));
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.3));
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
    }
  }
  
  // Style the language icon and text
  :deep(.language-icon) {
    font-size: 16px;
    margin-right: 8px;
  }
  
  :deep(.current-language) {
    flex: 1;
    text-align: left;
    font-size: 14px;
  }
  
  :deep(.dropdown-arrow) {
    font-size: 10px;
    transition: transform 0.2s ease;
    margin-left: 8px;
    
    &.rotated {
      transform: rotate(180deg);
    }
  }
  
  // Position and style the language dropdown
  :deep(.language-dropdown) {
    position: absolute;
    top: 100%;
    right: 4px;
    left: 4px;
    margin-top: 4px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 8px;
    backdrop-filter: blur(15px);
    box-shadow: 0 10px 40px rgba(255, 255, 255, 0.2);
    z-index: 1001;
    animation: dropdownSlideIn 0.3s ease;
  }
  
  // Style language options
  :deep(.language-option) {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    font-size: 14px;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.2));
      transform: translateX(4px);
      color: white;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
      color: #10b981;
      border: 1px solid rgba(34, 197, 94, 0.4);
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    }
  }
  
  :deep(.language-flag) {
    font-size: 16px;
  }
  
  :deep(.language-name) {
    flex: 1;
    font-weight: 500;
  }
  
  :deep(.checkmark) {
    font-size: 12px;
    color: #10b981;
    font-weight: bold;
  }
}

// Dropdown animation
@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Mobile responsive
@media (max-width: 768px) {
  .dropdown-language-switcher {
    margin-bottom: 10px;
    padding: 0 2px;
    
    :deep(.language-button) {
      padding: 8px 10px;
      font-size: 13px;
    }
    
    :deep(.current-language) {
      font-size: 13px;
    }
    
    :deep(.language-dropdown) {
      right: 2px;
      left: 2px;
      padding: 4px;
    }
    
    :deep(.language-option) {
      padding: 6px 10px;
      font-size: 13px;
    }
  }
}
</style>
<style lang="scss" scoped>
</style>
