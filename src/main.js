import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'

import '@nanoandrew4/vue3-carousel-3d/dist/style.css'
import { Carousel3dPlugin } from '@nanoandrew4/vue3-carousel-3d'
import { LinearGaugePlugin } from '@syncfusion/ej2-vue-lineargauge';

const app = createApp(App)

// Make i18n available globally
app.config.globalProperties.$t = i18n.t.bind(i18n)
app.config.globalProperties.$i18n = i18n

app.use(Carousel3dPlugin)
app.use(LinearGaugePlugin);
app.mount('#app')
    