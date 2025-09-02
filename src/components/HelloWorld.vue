<template>
  <div class="hello">
    <!-- <h1 v-if="showPrize">Pokemon Anda: {{ getPrize }}</h1> -->
    <!-- Card Display Section -->
    <div class="level-container">
      <img src="../assets/level-1.png" alt="level-1" />
      <img src="../assets/level-2.png" alt="level-2" />
      <img src="../assets/level-3.png" alt="level-3" />
    </div>
    <div v-if="showCard" class="vue-flip-container">
      <vue-flip active-click="true" width="200px" height="50px">
        <template v-slot:front>
          <div class="front">
            <img src="../assets/back.jpeg" alt="card-front" />
          </div>
        </template>
        <template v-slot:back>
          <div class="back">
            <img :src="getCardImage" alt="card-back" />
          </div>
        </template>
      </vue-flip>
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
      segments: [
        {color: '#FF6B6B', text: '1'},
        {color: '#4ECDC4', text: '2'},
        {color: '#45B7D1', text: '3'},
        {color: '#96CEB4', text: '4'},
        {color: '#FFEAA7', text: '5'},
        {color: '#DDA0DD', text: '6'},
        {color: '#98D8C8', text: '7'},
        {color: '#F7DC6F', text: '8'}
      ]
    }
  },
  computed: {
    getCardImage() {
      return require(`../assets/${this.getPrize}.jpeg`);
    }
  },
  methods: {
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

<style scoped>

.hello {
  margin: 0;
  padding: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('../assets/bg.jpg');
  height: 100vh;
}

.level-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  img {
    width: 80px;
    height: 80px;
    margin: 10px;
    cursor: pointer;
  } 
  img:hover {
    transform: scale(1.1);
  }
}

/* Card Display Styles */
.vue-flip-container {
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}

.front img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.back img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Wheel of Fortune Styles */
.wheel-of-fortune-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 140px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 25px;
  padding: 20px;
  box-sizing: border-box;
}

.wheel {
  width: 360px;
  height: 360px;
  border-radius: 50%;
  position: relative;
  transition: transform 6s cubic-bezier(0.23, 1, 0.32, 1);
  border: 16px solid #2c3e50;
  overflow: hidden;
  background: transparent;
  will-change: transform;
  font-size: 0;
  line-height: 0;
  box-sizing: border-box;
  flex-shrink: 0;
}

.segment {
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  margin: 0;
  padding: 0;
  background: inherit;
  border: none;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  filter: brightness(1.1);
  aspect-ratio: 1;
  overflow: visible;
}

.segment:hover {
  filter: brightness(1.15) contrast(1.1);
  transform: scale(1.02);
}

.segment-text {
  transform: rotate(318deg) translate(45px, 9px);
  font-weight: bold;
  color: white;
  font-size: 30px;
  white-space: nowrap;
  letter-spacing: 0.2px;
  text-align: center;
  position: relative;
  pointer-events: none;
  z-index: 1000;
  margin: 10px;
}

.pointer {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  z-index: 15;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
  100% { transform: translateX(-50%) scale(1); }
}

.spin-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #e74c3c;
  border: 5px solid white;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  z-index: 5;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.spin-button:hover:not(:disabled) {
  background: #c0392b;
  transform: translate(-50%, -50%) scale(1.1);
}

.spin-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: translate(-50%, -50%) scale(1);
}

.spin-button:active:not(:disabled) {
  transform: translate(-50%, -50%) scale(0.92);
}
</style>