import { describe, expect, test } from 'vitest'
import { TimeOnly } from './TimeOnly'

describe('TimeOnly', () => {
    test('should correctly initialize hours and minutes', () => {
        const time = new TimeOnly(10, 30);
        expect(time.hours).toBe(10);
        expect(time.minutes).toBe(30);
    });

    test('should correctly subtract two TimeOnly instances', () => {
        const time1 = new TimeOnly(10, 30);
        const time2 = new TimeOnly(8, 45);
        const span = time1.subtract(time2);

        expect(span.hours).toBe(1);
        expect(span.minutes).toBe(45);
    });

    test('should handle subtraction resulting in negative minutes correctly', () => {
        const time1 = new TimeOnly(10, 15);
        const time2 = new TimeOnly(8, 45);
        const span = time1.subtract(time2);

        expect(span.hours).toBe(1);
        expect(span.minutes).toBe(30);
    });

    test('should handle subtraction resulting in zero correctly', () => {
        const time1 = new TimeOnly(10, 30);
        const time2 = new TimeOnly(10, 30);
        const span = time1.subtract(time2);

        expect(span.hours).toBe(0);
        expect(span.minutes).toBe(0);
    });

    
    test('should return the minimum of multiple TimeOnly instances', () => {
        const time1 = new TimeOnly(10, 30);
        const time2 = new TimeOnly(8, 45);
        const time3 = new TimeOnly(9, 15);
        const minTime = TimeOnly.Min([time1, time2, time3]);

        expect(minTime).toBe(time2);
    });

    test('should return the maximum of multiple TimeOnly instances', () => {
        const time1 = new TimeOnly(10, 30);
        const time2 = new TimeOnly(8, 45);
        const time3 = new TimeOnly(9, 15);
        const maxTime = TimeOnly.Max([time1, time2, time3]);

        expect(maxTime).toBe(time1);
    });

    test('it parses 9:03', () => {
        const time = TimeOnly.FromTimeString("9:03")
        expect(time.hours).toBe(9);
        expect(time.minutes).toBe(3);
    });

    test('it parses 9:03am', () => {
        const time = TimeOnly.FromTimeString("9:03am")
        expect(time.hours).toBe(9);
        expect(time.minutes).toBe(3);
    });

    test('it parses 17:31', () => {
        const time = TimeOnly.FromTimeString("17:31")
        expect(time.hours).toBe(17);
        expect(time.minutes).toBe(31);
    });

    test('it parses  5:31pm', () => {
        const time = TimeOnly.FromTimeString("5:31pm")
        expect(time.hours).toBe(17);
        expect(time.minutes).toBe(31);
    });


});
