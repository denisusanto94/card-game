<template>
  <div class="hello">
    <!-- <h1 v-if="showPrize">Pokemon Anda: {{ getPrize }}</h1> -->
    <!-- Card Display Section -->
    <div class="level-container">
      <img src="../assets/level-1.png" alt="level-1" />
      <img src="../assets/level-2.png" alt="level-2" />
      <img src="../assets/level-3.png" alt="level-3" />
    </div>
    <div v-if="showCard" class="vue-flip-container" :class="{ 'shuffle-show': isShuffling }">
      <Carousel3d :on-main-slide-click="onSelect" :width="280" :height="390">
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
      <button class="reset-shuffle-button" @click="resetAndShuffleCards">Reset & Shuffle Cards</button>
    </div>
    <!-- <div class="progress-bar-container">
      <img src="../assets/progress-60.png" alt="progress-bar" />
    </div> -->

    <!-- Level Display Section -->
    <div v-if="openedCards.length > 0" class="level-display-container">
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
      
      <!-- Level Progression -->
      <div class="level-progression">
        <div class="progression-header">
          <span class="progression-label">Level Progress</span>
          <span class="progression-level">{{ currentLevel }}</span>
        </div>
        <div class="progression-bar">
          <div class="progression-fill" :style="{ width: levelProgressPercentage + '%' }"></div>
        </div>
        <div class="progression-text">
          {{ levelProgressText }}
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
    msg: String
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
    }
  },
  methods: {
    getCardImage(image) {
      return require(`../assets/${image}`);
    },
    onSelect() {
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
    }
  }
}
</script>

<style>
@import '../assets/style/main.css';
</style>