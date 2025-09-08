<template>
  <div id="app">
    <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <HelloWorld v-else :user-data="userData" @logout="handleLogout" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Login
  },
  data() {
    return {
      isLoggedIn: false,
      userData: null
    }
  },
  methods: {
    handleLoginSuccess(userData) {
      this.userData = userData;
      this.isLoggedIn = true;
      console.log('User logged in successfully:', userData);
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.userData = null;
      localStorage.removeItem('userData');
      console.log('User logged out');
    }
  },
  mounted() {
    // Check if user is already logged in
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        this.userData = JSON.parse(savedUserData);
        this.isLoggedIn = true;
        console.log('User already logged in:', this.userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/main.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: $font-family-primary;
}

#app {
  font-family: $font-family-primary;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
