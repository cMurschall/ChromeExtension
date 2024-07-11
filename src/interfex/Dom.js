import { DateOnly } from './DateOnly'
import {
    NormalBreakTime,
    NormalWorkTime,
    NormalWorkTimeLimit,
    ExtendedBreakTime,
    ExtendedWorkTimeLimit,
} from './Constants'
import { toDisplayString } from 'vue';



function getTextFromElement(element) {
    if (element.innerText == undefined) {
        return element.textContent.trim();
    }
    return element.innerText.trim()
}

export function findTable() {

    var table = findStartPageTable();
    if (table) {
        return table;
    }
    return findBookingTable();
}



function getMainPage() {
    var frameMainIFrame = document.getElementById('mainIFrame');
    if (frameMainIFrame === null || frameMainIFrame === undefined) {
        // console.log("frameMainIFrame is null")
        return null;
    }
    var frameMainIFrameDoc = frameMainIFrame.contentDocument || frameMainIFrame.contentWindow.document;

    var frameMain = frameMainIFrameDoc.getElementsByName('Main')[0];
    if (frameMain === null || frameMain === undefined) {
        // console.log("frameMain is null")
        return null;
    }
    return frameMain.contentDocument || frameMain.contentWindow.document;
}


function findStartPageTable() {
    var doc = getMainPage();

    var checkClass = doc.getElementsByClassName('iflxHomeTable');
    if (checkClass == undefined || checkClass === undefined) {
        console.log("iflxHomeTable is null")
        return null;
    }

    //console.log(Array.from(checkClass).length === 0)

    if (Array.from(checkClass).length === 0) {
        console.log("checkClass is null")
        return null;
    }

    var tables = doc.getElementsByTagName('table');


    // // let tables2 = doc.querySelectorAll('table');
    // // var times = doc.getElementsByClassName('iflxQujouTabTime1');
    // // iterate all tables and find the correct one
    var filteredTables = Array.from(tables).filter((table) => table.getElementsByClassName('iflxQujouTab2').length);
    var innerMost = Array.from(filteredTables).filter((table) => table.getElementsByTagName('table').length == 0);
    // return innerMost;

    return Array.from(tables)[2];
}


function findBookingTable() {
    var doc = getMainPage();

    var checkClass = doc.getElementsByClassName('iflxBookingsTabReadonly');
    if (checkClass == undefined || checkClass === undefined) {
        console.log("iflxBookingsTabReadonly is null")
        return null;
    }
    if (checkClass.length === 0) {
        console.log("checkClass is null")
        return null;
    }

    var tables = doc.getElementsByTagName('table');
    // let tables2 = doc.querySelectorAll('table');
    // var times = doc.getElementsByClassName('iflxQujouTabTime1');
    // iterate all tables and find the correct one
    var filteredTables = Array.from(tables).filter((table) => table.getAttribute('width') == 755);

    if (!filteredTables.length) {

        return null;
    }

    return filteredTables[0];
}


export function addHomeOfficeLoginButton() {
    var doc = getMainPage();
    var logOutButton = Array.from(doc.getElementsByClassName('iflxButtonFactoryTextContainerOuter'))[0];
    if (logOutButton) {
        const trElement = logOutButton.closest('tr');

        // Check if the button is already appended
        if (trElement.querySelector('.unique-button')) {
            return;

        }

        // Create a new <td> element
        const newTd = document.createElement('td');

        // Create a new button element
        const button = document.createElement('button');
        button.textContent = 'Select Home Office';
        button.classList.add('unique-button');
        button.style['color'] = "red";
        button.style['position'] = "relative";
        button.style['left'] = "-300px";
        // Add a click handler to the button
        button.addEventListener('click', function () {
            // Find the select element by its ID
            var selectElement = doc.getElementById('iflxBookingMask_F_bookAbsenceReason');

            // Check if the select element is found
            if (selectElement) {
                // Set the value to 33
                selectElement.value = '33';

                // Trigger a change event for all the event listeners
                selectElement.dispatchEvent(new Event('change'));
            } else {
                console.error('Select element not found');
            }
        });

        // Append the button to the <td> element
        newTd.appendChild(button);

        // Append the <td> element to the <tr> element
        trElement.appendChild(newTd);
        // var isLoggedIn =  ['out', 'gehen'].some(t =>  button.innerText.toLowerCase().indexOf(t) >= 0 );
        console.log('is logged in', trElement)
    }

    // var logInButton = Array.from(doc.getElementsByClassName('iflxSimpleBtn iflxSimpleBtnStandardH20'))[0];
    // if (logInButton) {
    //     // console.log('is logged out')
    // }

}

const zeroPad = (num, places) => String(num).padStart(places, '0')
const formatTimeSpan = timeSpan => {
    if (timeSpan.totalHours() > 1) {
        return `${timeSpan.hours.toFixed(0)}:${timeSpan.minutes.toFixed(0)}h`;
    }
    return `${timeSpan.minutes.toFixed(0)} min`;
}
/**
 * 
 * @param {HTMLElement} table 
 * @param {WorkDay[]} workdayList 
 */
export function updateWorkDaysTable(table, workdayList) {
    let rows = table.querySelectorAll('tbody > tr');

    rows.forEach(row => {
        let cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            // Check if the first cell contains a date
            let dateCell = getTextFromElement(cells[0]);

            if (dateCell) {
                const cellDate = DateOnly.parseDateOnly(dateCell);
                const index = workdayList.findIndex(x => x.date == dateCell.trim());
                if (index >= 0) {

                    const workDay = workdayList[index]
                    if (workDay.times.length == 0) {
                        console.log(`no workday data for ${dateCell}, continuing`)
                        return;
                    }

                    const workHours = workDay.workTime().totalHours();
                    const breakHours = workDay.breakTime().totalMinutes();
                    const overTime = workDay.overtime();

                    let summary = `Worked: ${workHours.toFixed(2)}h (with ${breakHours.toFixed(0)} min break)`;

                    const isToday = cellDate.isToday()
                    const hasOvertime = overTime.totalHours() > 0;

                    if (isToday) {
                        if (hasOvertime) {
                            summary += `\r\nOvertime: ${formatTimeSpan(overTime)}`
                        } else {
                            console.log("overtime is",overTime.totalHours() )
                            const workEnd = workDay.workEndTime();
                            summary += `\r\Go home at: ${zeroPad(workEnd.hours, 2)}:${zeroPad(workEnd.minutes, 2)}`
                        }
                    } else  if (hasOvertime)
                    {
                        summary += `\r\nOvertime: ${formatTimeSpan(overTime)}`
                    }


                    // if (!isToday || hasOvertime) {
                    //     summary += `\r\nOvertime: ${formatTimeSpan(overTime)}`
                    // } else {
                    //     const workEnd = workDay.workEndTime();
                    //     summary += `\r\Go home at: ${zeroPad(workEnd.hours, 2)}:${zeroPad(workEnd.minutes, 2)}`
                    // }

                    cells[1].innerText = summary;
                    cells[1].style['width'] = "300";
                    cells[1].style['color'] = "red";
                    // format italic
                    cells[1].style['font-style'] = "italic";


                    const low = NormalWorkTimeLimit.totalHours();
                    const hight = ExtendedWorkTimeLimit.totalHours();
                    const optimum = NormalWorkTime.totalHours();

                    //    cells[4].innerHTML = `<meter min="0" max="10" low="${low}" high="${hight}" optimum="${optimum}" value="${workHours}"/>`;
                }
            }
        }
    });


}
