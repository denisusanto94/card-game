<template>
  <div class="language-switcher">
    <button 
      class="language-button"
      @click="toggleLanguageMenu"
      :class="{ 'active': showLanguageMenu }"
    >
      <span class="language-icon">🌐</span>
      <span class="current-language">{{ getCurrentLanguageName() }}</span>
      <span class="dropdown-arrow" :class="{ 'rotated': showLanguageMenu }">▼</span>
    </button>
    
    <div class="language-dropdown" v-if="showLanguageMenu" @click.stop>
      <div class="language-option" 
           v-for="lang in availableLanguages" 
           :key="lang.code"
           @click="switchLanguage(lang.code)"
           :class="{ 'active': currentLanguage === lang.code }"
      >
        <span class="language-flag">{{ lang.flag }}</span>
        <span class="language-name">{{ lang.name }}</span>
        <span class="checkmark" v-if="currentLanguage === lang.code">✓</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      showLanguageMenu: false,
      availableLanguages: [
        { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
      ]
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.getLocale()
    }
  },
  methods: {
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu
    },
    switchLanguage(langCode) {
      this.$i18n.setLocale(langCode)
      this.showLanguageMenu = false
      
      // Emit event to parent components to trigger re-render
      this.$emit('language-changed', langCode)
    },
    getCurrentLanguageName() {
      const lang = this.availableLanguages.find(l => l.code === this.currentLanguage)
      return lang ? lang.name : 'Indonesia'
    },
    handleClickOutside(event) {
      if (this.showLanguageMenu && !event.target.closest('.language-switcher')) {
        this.showLanguageMenu = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style lang="scss" scoped>
.language-switcher {
  position: relative;
  z-index: 1000;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: black;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.language-icon {
  font-size: 16px;
}

.current-language {
  font-size: 14px;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
  
  &.rotated {
    transform: rotate(180deg);
  }
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px;
  min-width: 140px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: black;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: #4CAF50;
  }
}

.language-flag {
  font-size: 16px;
}

.language-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.checkmark {
  font-size: 12px;
  color: #2E7D32;
  font-weight: bold;
}

// Mobile responsive
@media (max-width: 768px) {
  .language-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .current-language {
    font-size: 12px;
  }
  
  .language-dropdown {
    min-width: 120px;
  }
  
  .language-option {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
