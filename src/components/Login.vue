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

<style scoped>
/* Main Container */
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Animated Background */
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  z-index: 1;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Floating Shapes */
.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: 3s;
}

.shape-5 {
  width: 70px;
  height: 70px;
  top: 10%;
  right: 10%;
  animation-delay: 4s;
}

.shape-6 {
  width: 90px;
  height: 90px;
  bottom: 20%;
  left: 50%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Gradient Overlay */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 3;
}

/* Login Content */
.login-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 45px 35px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.login-logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.2),
    0 0 0 4px rgba(255, 255, 255, 0.1);
  animation: logoFloat 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.login-title {
  margin-bottom: 12px;
  position: relative;
}

.title-text {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  from { filter: brightness(1); }
  to { filter: brightness(1.2); }
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 8px auto 0;
  border-radius: 2px;
  animation: underlineExpand 1s ease-out 0.5s both;
}

@keyframes underlineExpand {
  from { width: 0; }
  to { width: 60px; }
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Form */
.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.input-container {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.label-icon {
  margin-right: 8px;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  color: #333;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.8);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.2),
    0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border-radius: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.form-input:focus + .input-glow {
  opacity: 1;
}

/* Login Button */
.login-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  animation: buttonGradient 3s ease infinite;
}

@keyframes buttonGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-icon {
  font-size: 20px;
  animation: rocketBounce 2s ease-in-out infinite;
}

@keyframes rocketBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-button:hover .button-shine {
  left: 100%;
}

/* Footer */
.login-footer {
  text-align: center;
}

.divider {
  position: relative;
  margin: 25px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.guest-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  padding: 14px 25px;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.guest-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.guest-icon {
  font-size: 18px;
  animation: maskFloat 3s ease-in-out infinite;
}

@keyframes maskFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 5;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 8s linear infinite;
}

.particle:nth-child(odd) {
  animation-duration: 6s;
}

.particle:nth-child(even) {
  animation-duration: 10s;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-content {
    padding: 15px;
    max-width: 380px;
  }
  
  .login-card {
    padding: 35px 25px;
  }
  
  .title-text {
    font-size: 28px;
  }
  
  .login-logo {
    width: 75px;
    height: 75px;
  }
  
  .form-input {
    padding: 14px 18px;
    font-size: 15px;
  }
  
  .login-button {
    padding: 16px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 10px;
    max-width: 350px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .title-text {
    font-size: 24px;
  }
  
  .login-logo {
    width: 65px;
    height: 65px;
  }
  
  .form-input {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .login-button {
    padding: 14px;
    font-size: 15px;
  }
  
  .guest-button {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
