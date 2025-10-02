import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Import AOS for scroll animations
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app.mount('#app')

// Initialize AOS after mounting
AOS.init({
  duration: 1000,
  easing: 'ease-in-out-cubic',
  once: false,
  mirror: true
})
