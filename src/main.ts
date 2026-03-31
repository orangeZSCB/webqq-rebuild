import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/reset.css'
import './styles/webqq20-base.css'
import './styles/webqq20-shell.css'
import './styles/webqq20-window.css'

const app = createApp(App)

app.use(createPinia())
app.mount('#app')
