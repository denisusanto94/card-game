<template>
  <div class="login-container">
    <!-- Language Switcher -->
    <div class="login-language-switcher">
      <LanguageSwitcher @language-changed="handleLanguageChange" />
    </div>

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
            <span class="title-text">{{ $t('login.title') }}</span>
            <div class="title-underline"></div>
          </h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <!-- Enhanced Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <div class="input-container">
              <label for="username" class="form-label">
                <span class="label-icon">👤</span>
                {{ $t('login.username') }}
              </label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                class="form-input"
                :placeholder="$t('login.usernamePlaceholder')"
                required
              >
              <div class="input-glow"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <label for="password" class="form-label">
                <span class="label-icon">🔒</span>
                {{ $t('login.password') }}
              </label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="form-input"
                :placeholder="$t('login.passwordPlaceholder')"
                required
              >
              <div class="input-glow"></div>
            </div>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span class="button-content">
              <span v-if="!isLoading" class="button-text">
                <span class="button-icon">🚀</span>
                {{ $t('login.loginButton') }}
              </span>
              <span v-else class="loading-content">
                <div class="loading-spinner"></div>
                <span>{{ $t('login.loading') }}</span>
              </span>
            </span>
            <div class="button-shine"></div>
          </button>
        </form>

        <!-- Enhanced Footer -->
        <div class="login-footer">
          <div class="divider">
            <span class="divider-text">{{ $t('login.or') }}</span>
          </div>
          <button @click="handleGuestLogin" class="guest-button">
            <span class="guest-icon">🎭</span>
            {{ $t('login.guestLogin') }}
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
import LanguageSwitcher from './LanguageSwitcher.vue'

export default {
  name: 'LoginComponent',
  components: {
    LanguageSwitcher
  },
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
        alert(this.$t('login.fillFields'));
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
    },
    handleLanguageChange() {
      // Force re-render by updating a reactive property
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
.login-language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

// Mobile responsive
@media (max-width: 768px) {
  .login-language-switcher {
    top: 15px;
    right: 15px;
  }
}
</style>
