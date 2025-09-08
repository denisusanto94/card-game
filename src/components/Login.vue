<template>
  <div class="login-container">
    <!-- Animated Background -->
    <div class="login-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- Login Content -->
    <div class="login-content">
      <div class="login-card">
        <!-- Header with enhanced styling -->
        <div class="login-header">
          <div class="logo-container">
            <img src="../assets/logo.png" alt="Game Logo" class="login-logo">
            <div class="logo-glow"></div>
          </div>
          <h1 class="login-title">
            <span class="title-text">Card Game</span>
            <div class="title-underline"></div>
          </h1>
          <p class="login-subtitle">🎮 Masuk untuk memulai petualangan</p>
        </div>

        <!-- Enhanced Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <div class="input-container">
              <label for="username" class="form-label">
                <span class="label-icon">👤</span>
                Username
              </label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                class="form-input"
                placeholder="Masukkan username"
                required
              >
              <div class="input-glow"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <label for="password" class="form-label">
                <span class="label-icon">🔒</span>
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="form-input"
                placeholder="Masukkan password"
                required
              >
              <div class="input-glow"></div>
            </div>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span class="button-content">
              <span v-if="!isLoading" class="button-text">
                <span class="button-icon">🚀</span>
                Masuk
              </span>
              <span v-else class="loading-content">
                <div class="loading-spinner"></div>
                <span>Loading...</span>
              </span>
            </span>
            <div class="button-shine"></div>
          </button>
        </form>

        <!-- Enhanced Footer -->
        <div class="login-footer">
          <div class="divider">
            <span class="divider-text">atau</span>
          </div>
          <button @click="handleGuestLogin" class="guest-button">
            <span class="guest-icon">🎭</span>
            Masuk sebagai Tamu
          </button>
        </div>
      </div>
    </div>

    <!-- Particle Effects -->
    <div class="particles">
      <div class="particle" v-for="n in 20" :key="n"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        alert('Mohon isi username dan password');
        return;
      }

      this.isLoading = true;
      
      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        
        // Store user data
        const userData = {
          username: this.username,
          loginTime: new Date().toISOString(),
          isGuest: false
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Emit login success event
        this.$emit('login-success', userData);
        
        console.log('Login successful:', userData);
      }, 1500);
    },
    
    handleGuestLogin() {
      const guestData = {
        username: 'Guest',
        loginTime: new Date().toISOString(),
        isGuest: true
      };
      
      localStorage.setItem('userData', JSON.stringify(guestData));
      
      // Emit login success event
      this.$emit('login-success', guestData);
      
      console.log('Guest login successful:', guestData);
    }
  }
}
</script>

<style>
@import '../assets/style/main.scss';
</style>
