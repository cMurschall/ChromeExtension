import { describe, expect, test } from 'vitest'
import { WorkDay } from './WorkDay'
import { TimeOnly } from './TimeOnly';
import { WorkSpan } from './WorkSpan';


const workSpansMonday = [ // expected    6,55 hours
    new WorkSpan(new TimeOnly(8, 25), new TimeOnly(9, 22)),
    new WorkSpan(new TimeOnly(9, 43), new TimeOnly(13, 41)),
    new WorkSpan(new TimeOnly(15, 2), new TimeOnly(16, 40)),
]

const workSpansTuesday = [ // expected      7,82 hours
    new WorkSpan(new TimeOnly(9, 14), new TimeOnly(14, 17)),
    new WorkSpan(new TimeOnly(14, 26), new TimeOnly(17, 42)),
]

const workSpansThursday = [ // expected      7,87 hours
    new WorkSpan(new TimeOnly(8, 58), new TimeOnly(11, 39)),
    new WorkSpan(new TimeOnly(12, 29), new TimeOnly(17, 40)),
]

const workSpansFriday = [ // expected         7,97 hours
    new WorkSpan(new TimeOnly(9, 3), new TimeOnly(17, 31))
]

describe('WorkDay', () => {
    test('should correctly initialize date and times', () => {
        const workdayFriday = new WorkDay("Monday", workSpansMonday)
        expect(workdayFriday.times.length).toBe(3);

    });


});

