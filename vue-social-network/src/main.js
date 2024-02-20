import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css';


import { createApp } from 'vue'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia)


registerPlugins(app)

app.mount('#app')
