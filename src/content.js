import { createApp } from 'vue'
import App from './App.vue'

import { findTable, updateWorkDaysTable, addHomeOfficeLoginButton } from './interfex/Dom'
import { parseWorkdaysTable } from './interfex/Parser'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.append(root)

const app = createApp(App)
app.mount(root)


console.log({mode: process.env.NODE_ENV})
console.log('hi')



function start() {
    let table = findTable();
    if (table) {
        const workDays = parseWorkdaysTable(table);
        // console.log('parsed workdays:', {workDays})
        updateWorkDaysTable(table, workDays);
    }
    addHomeOfficeLoginButton();
}

setInterval(() => start(), 1000);


