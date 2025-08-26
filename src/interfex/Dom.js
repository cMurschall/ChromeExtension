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

export function findJournal() {
    var doc = getMainPage();
    var checkClass = doc.getElementsByClassName('iflxMojouDataDiv');
    if (checkClass == undefined || checkClass === undefined) {
        console.log("iflxMojouDataDiv is null")
        return null;
    }

    if (Array.from(checkClass).length === 0) {
        console.log("checkClass is null")
        return null;
    }

    // first table
    var table = checkClass[0].querySelector("table");

    if (!table) {
        return null;
    }

    return table;
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

const zeroPad = (num, places) => String(Math.floor(num)).padStart(places, '0')

const formatTimeSpan = timeSpan => {

    if (timeSpan.totalHours() > 1) {
        return `${timeSpan.hours.toFixed(0)}:${zeroPad(timeSpan.minutes, 2)}h`;
    }
    return `${zeroPad(timeSpan.totalMinutes(), 2)} min`;
}

const formatDate = date => `${zeroPad(date.hours, 2)}:${zeroPad(date.minutes, 2)}`

const updateElement = (element, text) => {

    element.innerText = text;
    element.style['width'] = "300";
    element.style['color'] = "red";
    // format italic
    element.style['font-style'] = "italic";

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

        if (cells.length < 6) {
            return;
        }

        // Check if the first cell contains a date
        let dateCell = getTextFromElement(cells[0]);
        if (!dateCell) {
            return;
        }
        const cellDate = DateOnly.parseDateOnly(dateCell);
        const index = workdayList.findIndex(x => x.date == dateCell.trim());
        if (index < 0) {
            return;
        }

        const workDay = workdayList[index]
        if (workDay.times.length == 0) {
            console.log(`no workday data for ${dateCell}, continuing`)
            return;
        }

        const workHours = workDay.workTime().totalHours();
        const breakHours = workDay.breakTimeTotal().totalMinutes();
        const overTime = workDay.overtime();

        let summary = `Worked: ${workHours.toFixed(2)}h (with ${breakHours.toFixed(0)} min break)`;

        const isToday = cellDate.isToday()
        const hasOvertime = overTime.totalHours() > 0;

        if (isToday) {
            if (hasOvertime) {
                summary += `\r\nOvertime: ${formatTimeSpan(overTime)}`

                const hasExtendedNormalWorkingTime = workDay.workTime().isGreaterThan(NormalWorkTimeLimit);
                const hasTakenExtendedWorkingTimeBreaks = workDay.breakTimeLaw().isGreaterThan(ExtendedBreakTime);
                if (hasExtendedNormalWorkingTime && !hasTakenExtendedWorkingTimeBreaks) {
                    console.log("busy day!")
                    let forcedBreakTime = workDay.firstLogIn().addTimeSpan(ExtendedWorkTimeLimit);
                    let forcedText = `Forced 15 minute break at: ${formatDate(forcedBreakTime)}`

                    if (workDay.breakTimeLaw().isLessThan(NormalBreakTime)) {
                        forcedBreakTime = forcedBreakTime.addTimeSpan(NormalBreakTime);
                        forcedText = `Forced 45 minute break at: ${formatDate(forcedBreakTime)}`
                    }

                    updateElement(cells[4], forcedText);
                }

            } else {
                const workEnd = workDay.workEndTime();
                summary += `\r\Go home at: ${formatDate(workEnd)}`


                // notify users when the forced break will appear
                const hasNotTakenBreaks = breakHours < 15;
                const isNotOverNormalWorkTimeLimit = workDay.workTime().isLessThan(NormalWorkTimeLimit);

                if (hasNotTakenBreaks && isNotOverNormalWorkTimeLimit) {
                    const forcedBreakTime = workDay.firstLogIn().addTimeSpan(NormalWorkTimeLimit);
                    const forcedText = `Forced 30 minute break at: ${formatDate(forcedBreakTime)}`
                    updateElement(cells[4], forcedText);
                }

            }
        } else {
            if (hasOvertime) {
                summary += `\r\nOvertime: ${formatTimeSpan(overTime)}`
            } else {
                summary += `\r\nShorttime: ${formatTimeSpan(overTime)}`
            }
        }
        updateElement(cells[1], summary);


        // const low = NormalWorkTimeLimit.totalHours();
        // const hight = ExtendedWorkTimeLimit.totalHours();
        // const optimum = NormalWorkTime.totalHours();

        //    cells[4].innerHTML = `<meter min="0" max="10" low="${low}" high="${hight}" optimum="${optimum}" value="${workHours}"/>`;

    });
}





export function generateMonthJournalPlot(table) {
    if (!table) {
        console.warn("[plot] table ist null/undefined");
        return;
    }

    const rows = table.querySelectorAll("tbody > tr");
    let cumShould = 0;
    let cumActual = 0;
    const cumulative = [];

    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 11) return;

        const day = cells[0]?.innerText.trim();
        if (!day) return;

        const shouldWorkAsString = cells[9]?.innerText.trim();
        const actualWorkAsString = cells[10]?.innerText.trim();

        const shouldWork = parseFloat(shouldWorkAsString.replace(',', '.')) || 0;
        const actualWork = parseFloat(actualWorkAsString.replace(',', '.')) || 0;

        // Wenn beide 0 sind, überspringen (leere Tage/Wochenende)
        if (shouldWork === 0 && actualWork === 0) {
            cumulative.push({ should: cumShould, actual: cumActual, day });
        };

        cumShould += shouldWork;
        cumActual += actualWork;
        cumulative.push({ should: cumShould, actual: cumActual, day });
    });

    // Canvas & Wrapper sicherstellen
    const { ctx, canvas } = ensurePlotCanvasBesideTable(table);
    if (!ctx) {
        console.warn("[plot] Kein 2D-Kontext verfügbar.");
        return;
    }

    renderPlotBasic(ctx, canvas, cumulative);
}

function ensurePlotCanvasBesideTable(table) {

    let wrapper = table.closest('#month-plot-wrapper');

    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'month-plot-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '16px';

        const parent = table.parentNode;
        // const parent = document.querySelector('#iflxMojouDataDiv')[0];
        parent.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    }

    const allPlots = wrapper.querySelectorAll('#month-plot');
    for (let i = 1; i < allPlots.length; i++) allPlots[i].remove();


    const allCanvas = wrapper.querySelectorAll('#monthPlotCanvas');
    for (let i = 1; i < allCanvas.length; i++) allCanvas[i].remove();


    let plotDiv = wrapper.querySelector('#month-plot');
    if (!plotDiv) {
        plotDiv = document.createElement('div');
        plotDiv.id = 'month-plot';
        plotDiv.style.width = '600px';
        plotDiv.style.height = '300px';
        plotDiv.style.flex = '0 0 auto';
        wrapper.appendChild(plotDiv);
    }


    let canvas = plotDiv.querySelector('#monthPlotCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'monthPlotCanvas';
        canvas.width = 800;
        canvas.height = 400;
        plotDiv.appendChild(canvas);
    }
    const dataDiv = table.closest("#dataDiv");
    if (dataDiv) {
        dataDiv.style.removeProperty("width");
    }

    const ctx = canvas.getContext('2d');
    return { ctx, canvas };
}

// Sehr simpler Line-Chart ohne externe Lib
function renderPlotBasic(ctx, canvas, cumulative) {

    //  console.log("Rendering plot", { ctx, canvas, cumulative });

    // Canvas clearen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!cumulative.length) {
        ctx.fillStyle = "#444";
        ctx.font = "14px sans-serif";
        ctx.fillText("Keine Daten für Plot.", 10, 20);
        return;
    }

    // Layout
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const w = canvas.width - padding.left - padding.right;
    const h = canvas.height - padding.top - padding.bottom;

    // Skalen
    const maxY = Math.max(
        ...cumulative.map(d => Math.max(d.should, d.actual))
    );
    const minY = 0;
    const n = cumulative.length;

    const x = i => padding.left + (i / (n - 1)) * w;
    const y = v => padding.top + h - ((v - minY) / (maxY - minY || 1)) * h;

    // Achsen
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // x-Achse
    ctx.moveTo(padding.left, padding.top + h);
    ctx.lineTo(padding.left + w, padding.top + h);
    // y-Achse
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + h);
    ctx.stroke();

    // Y-Label
    ctx.fillStyle = "#000";
    ctx.font = "12px sans-serif";
    ctx.fillText("Stunden", padding.left, padding.top - 6);

    // Y-Ticks (3)
    const ticks = 3;
    ctx.fillStyle = "#666";
    for (let t = 0; t <= ticks; t++) {
        const v = minY + (t / ticks) * (maxY - minY);
        const yy = y(v);
        ctx.beginPath();
        ctx.moveTo(padding.left - 5, yy);
        ctx.lineTo(padding.left, yy);
        ctx.strokeStyle = "#bbb";
        ctx.stroke();

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(v.toFixed(1).replace('.', ','), padding.left - 8, yy);
    }


    // X-Ticks: mondays only
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Indizes all mondays
    const mondayIdx = [];
    for (let k = 0; k < n; k++) {
        const d = (cumulative[k].day || "").toLowerCase().trim();
        if (/^mo(\.| |ntag)?\b/.test(d)) mondayIdx.push(k); // "Mo.", "Mo ", "Montag"
    }

    // Fallback
    const indices = mondayIdx.length ? mondayIdx : Array.from({ length: Math.ceil(n / 7) }, (_, i) => i * 7).filter(i => i < n);

    for (const i of indices) {
        const xx = x(i);
        const yy = padding.top + h;

        // Tick-Strich
        ctx.beginPath();
        ctx.moveTo(xx, yy);
        ctx.lineTo(xx, yy + 5);
        ctx.strokeStyle = "#bbb";
        ctx.stroke();

        // Label
        ctx.fillText(cumulative[i].day , xx, yy + 7);
    }

    // Linie: Soll (rot)
    drawLine(ctx, cumulative.map((d, i) => [x(i), y(d.should)]), "#e53935");

    // Linie: Ist (grün)
    drawLine(ctx, cumulative.map((d, i) => [x(i), y(d.actual)]), "#43a047");

    // Legende
    const legendX = padding.left + 10;
    const legendY = padding.top + 10;
    drawLegend(ctx, legendX, legendY, [
        { label: "Soll kum.", color: "#e53935" },
        { label: "Ist kum.", color: "#43a047" },
    ]);



}

function drawLine(ctx, points, color) {
    if (!points.length) return;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
}

function drawLegend(ctx, x, y, items) {
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const box = 10;
    const gap = 8;
    items.forEach((it, idx) => {
        const yy = y + idx * (box + gap);
        ctx.fillStyle = it.color;
        ctx.fillRect(x, yy - box / 2, box, box);
        ctx.fillStyle = "#000";
        ctx.fillText(it.label, x + box + 6, yy);
    });
}


