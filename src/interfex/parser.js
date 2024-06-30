import { WorkDay } from './WorkDay'
import { TimeOnly } from './TimeOnly'
import { WorkSpan } from './WorkSpan';


function getTextFromElement(element) {
    if (element.innerText == undefined) {
        return element.textContent.trim();
    }
    return element.innerText.trim()
}


/**
 * @returns {WorkDay[]}
 */
export function parseWorkdaysTable(table) {

    let workdays = [];
    let currentTime = new Date(); // Get current time
    let rows = table.querySelectorAll('tbody > tr');

    rows.forEach(row => {
        let cells = row.querySelectorAll('td');
        if (cells.length >= 8) {
            // Check if the first cell contains a date
            let dateCell = getTextFromElement(cells[0]);

            if (dateCell) {
                // let currentDate = parseToDate(dateCell.trim());

                // // parse 0.00 formatted time
                // let [hours, minuteFraction] = expectedTimeCell.trim().split('.').join(',').split(',').map(Number);
                // let expectedWorkDuration = Duration.fromObject({ hours: hours, minutes: (minuteFraction / 100) * 60 });

                const workDay = new WorkDay(dateCell.trim(), [])
                workdays.push(workDay)
            }

            // Extract login and logout times
            let beginTime = getTextFromElement(cells[2]);
            // If we are on the last row and we hav not logged out, use the current time as the end time
            let endTime = getTextFromElement(cells[3]) || `${currentTime.getHours()}:${currentTime.getMinutes()}`;

            if (beginTime && endTime) {
                const login = TimeOnly.FromTimeString(beginTime.trim());
                const logout = TimeOnly.FromTimeString(endTime.trim());
                const span = new WorkSpan(login, logout);
                workdays[workdays.length - 1].times.push(span);
            }
        }
    });

    return workdays;
}
