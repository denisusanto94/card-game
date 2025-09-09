// Custom i18n implementation
import en from './locales/en.json'
import id from './locales/id.json'

const translations = {
  en,
  id
}

class I18n {
  constructor() {
    this.locale = localStorage.getItem('language') || 'id' // Default to Indonesian
  }

  setLocale(locale) {
    this.locale = locale
    localStorage.setItem('language', locale)
  }

  getLocale() {
    return this.locale
  }

  t(key, params = {}) {
    const keys = key.split('.')
    let translation = translations[this.locale]
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k]
      } else {
        // Fallback to English if translation not found
        translation = translations.en
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey]
          } else {
            return key // Return key if no translation found
          }
        }
        break
      }
    }
    
    // Replace parameters in translation
    if (typeof translation === 'string') {
      return translation.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match
      })
    }
    
    return translation || key
  }
}

export default new I18n()
