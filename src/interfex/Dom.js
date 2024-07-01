
import {
    NormalBreakTime,
    NormalWorkTime,
    NormalWorkTimeLimit,
    ExtendedBreakTime,
    ExtendedWorkTimeLimit,
} from './Constants'



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


function findStartPageTable() {
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

    var doc = frameMain.contentDocument || frameMain.contentWindow.document;

    var checkClass = doc.getElementsByClassName('iflxHomeTable');
    if (checkClass == undefined || checkClass === undefined) {
        // console.log("iflxHomeTable is null")
        return null;
    }

    //console.log(Array.from(checkClass).length === 0)

    if (Array.from(checkClass).length === 0) {
        // console.log("checkClass is null")
        return null;
    }

    var tables = doc.getElementsByTagName('table');


    // // let tables2 = doc.querySelectorAll('table');
    // // var times = doc.getElementsByClassName('iflxQujouTabTime1');
    // // iterate all tables and find the correct one
    var filteredTables = Array.from(tables).filter((table) => table.getElementsByClassName('iflxQujouTab2').length);
    var  innerMost = Array.from(filteredTables).filter((table) => table.getElementsByTagName('table').length == 0);
    // return innerMost;

    return Array.from(tables)[2];
}


function findBookingTable() {
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

    var doc = frameMain.contentDocument || frameMain.contentWindow.document;

    var checkClass = doc.getElementsByClassName('iflxBookingsTabReadonly');
    if (checkClass == undefined || checkClass === undefined) {
        // console.log("iflxBookingsTabReadonly is null")
        return null;
    }
    if (checkClass.length === 0) {
        // console.log("checkClass is null")
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

const zeroPad = (num, places) => String(num).padStart(places, '0')

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
                const workDay = workdayList.find(x => x.date == dateCell.trim());
                if (workDay != undefined && workDay.times.length) {
                    const workHours = workDay.workTime().totalHours();
                    const breakHours = workDay.breakTime().totalMinutes();
                    const overTime = workDay.overtime().totalHours();

                    let summary = `Worked: ${workHours.toFixed(2)}h (${breakHours.toFixed(0)}min break)`;

                    // if workEndTime is in future, append:

                    if (overTime > 0) {
                        summary += `\r\nOvertime: ${overTime.toFixed(2)}h`
                    } else {
                        const workEnd = workDay.workEndTime();
                        summary += `\r\Go home at: ${zeroPad(workEnd.hours, 2)}:${zeroPad(workEnd.minutes, 2)}`
                    }

                    cells[1].innerText = summary;
                    cells[1].style['width'] = "300";
                    cells[1].style['color'] = "red";
                    // format italic
                    cells[1].style['font-style'] = "italic";


                    // const low = NormalWorkTimeLimit.totalHours();
                    // const hight = ExtendedWorkTimeLimit.totalHours();
                    // const optimum = NormalWorkTime.totalHours();

                    // cells[4].innerHTML = `<meter min="0" max="10" low="${low}" high="${hight}" optimum="${optimum}" value="${workHours}"/>`;
                }
            }
        }
    });


}
