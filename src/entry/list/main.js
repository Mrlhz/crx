import { createApp } from 'vue'
import App from './app.vue'
import router from '../../routers/list'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'

// import 'element-plus/es/components/table/style/css'
// import 'element-plus/es/components/table-column/style/css'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

console.log('list script run')

app.use(router)
app.use(ElButton)
app.use(ElTable)
app.use(ElTableColumn)
app.mount('#app')

