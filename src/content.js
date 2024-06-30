import { createApp } from 'vue'
import App from './App.vue'

import { findTable, updateWorkDaysTable } from './interfex/dom'
import { parseWorkdaysTable } from './interfex/parser'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.append(root)

const app = createApp(App)
app.mount(root)




function start() {
    let table = findTable();
    if (table) {
        const workDays = parseWorkdaysTable(table);
        updateWorkDaysTable(table, workDays);
    }
}

setInterval(() => start(), 1000);


