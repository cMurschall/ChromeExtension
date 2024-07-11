import { describe, expect, test, assertType, expectTypeOf } from 'vitest'
import { WorkDay } from './WorkDay'
import { TimeOnly } from './TimeOnly';
import { WorkSpan } from './WorkSpan';
import { DateOnly } from './DateOnly';


const testData = [
    {
        day: "Monday",
        expectedWorkTime: 6.55,
        expectedPresenceTime: 8.25,
        workSpans: [
            new WorkSpan(new TimeOnly(8, 25), new TimeOnly(9, 22)),
            new WorkSpan(new TimeOnly(9, 43), new TimeOnly(13, 41)),
            new WorkSpan(new TimeOnly(15, 2), new TimeOnly(16, 40)),
        ]
    },
    {
        day: "Tuesday",
        expectedWorkTime: 7.82,
        expectedPresenceTime: 8.47,
        workSpans: [
            new WorkSpan(new TimeOnly(9, 14), new TimeOnly(14, 17)),
            new WorkSpan(new TimeOnly(14, 26), new TimeOnly(17, 42)),
        ]
    },
    {
        day: "Thursday",
        expectedWorkTime: 7.87,
        expectedPresenceTime: 8.70,
        workSpans: [
            new WorkSpan(new TimeOnly(8, 58), new TimeOnly(11, 39)),
            new WorkSpan(new TimeOnly(12, 29), new TimeOnly(17, 40)),
        ]
    },
    {
        day: "Friday",
        expectedWorkTime: 7.97,
        expectedPresenceTime: 8.47,
        workSpans: [
            new WorkSpan(new TimeOnly(9, 3), new TimeOnly(17, 31))
        ]
    },
    {
        day: "Friday 2",
        expectedWorkTime: 6.53,
        expectedPresenceTime: 7.23,
        workSpans: [
            new WorkSpan(new TimeOnly(8, 56), new TimeOnly(10, 30)),
            new WorkSpan(new TimeOnly(10, 53), new TimeOnly(15, 50)),
            new WorkSpan(new TimeOnly(15, 50), new TimeOnly(15, 52)),
            new WorkSpan(new TimeOnly(15, 52), new TimeOnly(15, 57)),
            new WorkSpan(new TimeOnly(16, 9), new TimeOnly(16, 10)),
        ]
    },
    {
        day: "Overtime day",
        expectedWorkTime: 9.42,
        expectedPresenceTime: 10.17,
        workSpans: [
            new WorkSpan(new TimeOnly(7, 48), new TimeOnly(17, 58))
        ]
    },
]

const workSpansMonday = [ // expected    6,55 hours
    new WorkSpan(new TimeOnly(8, 25), new TimeOnly(9, 22)),
    new WorkSpan(new TimeOnly(9, 43), new TimeOnly(13, 41)),
    new WorkSpan(new TimeOnly(15, 2), new TimeOnly(16, 40)),
]

// const workSpansTuesday = [ // expected      7,82 hours
//     new WorkSpan(new TimeOnly(9, 14), new TimeOnly(14, 17)),
//     new WorkSpan(new TimeOnly(14, 26), new TimeOnly(17, 42)),
// ]

// const workSpansThursday = [ // expected      7,87 hours
//     new WorkSpan(new TimeOnly(8, 58), new TimeOnly(11, 39)),
//     new WorkSpan(new TimeOnly(12, 29), new TimeOnly(17, 40)),
// ]

// const workSpansFriday = [ // expected         7,97 hours
//     new WorkSpan(new TimeOnly(9, 3), new TimeOnly(17, 31))
// ]

describe('WorkDay', () => {
    test('should correctly initialize date and times', () => {
        const workday = new WorkDay("Monday", workSpansMonday)
        expect(workday.times.length).toBe(3);
    });

    test.each(testData)('should correctly calculate the presence time for $day', ({ day, expectedPresenceTime, workSpans }) => {
        const workday = new WorkDay(day, workSpans);
        if (expectedPresenceTime) {
            const presenceTime = workday.presenceTime();
            expect(presenceTime.totalHours()).toBeCloseTo(expectedPresenceTime, 1);
        }
    });

    test.each(testData)('should correctly calculate the work time for $day', ({ day, expectedWorkTime, workSpans }) => {
        const workday = new WorkDay(day, workSpans);
        const workTime = workday.workTime();
        expect(workTime.totalHours()).toBeCloseTo(expectedWorkTime, 1);
    });



    test('workday end', () => {
        const workday = new WorkDay("testData", [new WorkSpan(new TimeOnly(8, 17), new TimeOnly(8, 17))]);
        workday.times[0].logout = workday.workEndTime();
        expect(workday.overtime().totalHours()).toBeCloseTo(0);
        expect(workday.workTime().totalHours()).toBeCloseTo(7.9);
    });

    test('workday end2', () => {
        const workday = new WorkDay("testData", [new WorkSpan(new TimeOnly(8, 17), new TimeOnly(16, 41))]);
        expect(workday.overtime().totalHours()).toBeCloseTo(0);
        expect(workday.workTime().totalHours()).toBeCloseTo(7.9);
    });


    test('it parses german date', () => {
        const workday = new WorkDay("Mo.,01.07.", []);
        expect(workday.workDate().getMonth()).toBe(7);
        expect(workday.workDate().getDay()).toBe(1);
    });

    test('it parses english date', () => {
        const workday = new WorkDay("Mon,7/1", []);
        expect(workday.workDate().getMonth()).toBe(7);
        expect(workday.workDate().getDay()).toBe(1);
    });



    test('Mo.,08.07.	', () => {
        const workday = new WorkDay("Mon,7/1", [
            new WorkSpan(new TimeOnly(8, 42), new TimeOnly(13, 58)),
            new WorkSpan(new TimeOnly(14, 23), new TimeOnly(16, 31))]);
        expect(workday.overtime().totalHours()).toBe(0);
        expect(workday.workTime().totalHours()).toBeCloseTo(7.31, 1);
    });

    test('Di.,09.07.	', () => {
        const workday = new WorkDay("Di.,09.07.	", [
            new WorkSpan(new TimeOnly(11, 19), new TimeOnly(17, 29))]);
        expect(workday.overtime().totalHours()).toBe(0);
        expect(workday.workTime().totalHours()).toBeCloseTo(6.17, 1);
    });


});

