import { createApp } from 'vue'
import App from './App.vue'

import '@nanoandrew4/vue3-carousel-3d/dist/style.css'
import { Carousel3dPlugin } from '@nanoandrew4/vue3-carousel-3d'
import { LinearGaugePlugin } from '@syncfusion/ej2-vue-lineargauge';

const app = createApp(App)

app.use(Carousel3dPlugin)
app.use(LinearGaugePlugin);
app.mount('#app')
    