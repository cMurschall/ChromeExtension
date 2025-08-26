import { createApp } from 'vue'
import App from './App.vue'

import { findTable, findJournal, updateWorkDaysTable,generateMonthJournalPlot, addHomeOfficeLoginButton } from './interfex/Dom'
import { parseWorkdaysTable } from './interfex/Parser'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.append(root)

const app = createApp(App)
app.mount(root)



function start() {
    let table = findTable();
    if (table) {
        const workDays = parseWorkdaysTable(table);
        // console.log('parsed workdays:', {workDays})
        updateWorkDaysTable(table, workDays);
    }
    let journal = findJournal();
    if (journal) {
        generateMonthJournalPlot(journal);
    }

    addHomeOfficeLoginButton();
}

setInterval(() => start(), 1000);
