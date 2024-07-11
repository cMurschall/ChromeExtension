import { describe, expect, test } from 'vitest'
import { TimeSpan } from './TimeSpan'


describe('TimeSpan', () => {
    test('should correctly initialize hours and minutes', () => {
        const span = new TimeSpan(2, 30);
        expect(span.hours).toBe(2);
        expect(span.minutes).toBe(30);
    });

    test('should correctly create TimeSpan from minutes', () => {
        const span = TimeSpan.fromMinutes(150);
        expect(span.hours).toBe(2);
        expect(span.minutes).toBe(30);
    });

    test('should correctly create TimeSpan from hours', () => {
        const span = TimeSpan.fromHours(1.5);
        expect(span.hours).toBe(1);
        expect(span.minutes).toBe(30);
    });

    // test('should correctly create and round TimeSpan from hours', () => {
    //     const span = TimeSpan.fromHours(9.24);
    //     expect(span.totalHours()).toBeCloseTo(9.24)
    // });


    test('should correctly add two TimeSpan instances', () => {
        const span1 = new TimeSpan(1, 45);
        const span2 = new TimeSpan(1, 30);
        const result = span1.add(span2);

        expect(result.hours).toBe(3);
        expect(result.minutes).toBe(15);
    });

    test('should correctly subtract two TimeSpan instances', () => {
        const span1 = new TimeSpan(2, 15);
        const span2 = new TimeSpan(1, 50);
        const result = span1.subtract(span2);

        expect(result.hours).toBe(0);
        expect(result.minutes).toBe(25);
    });

    test('total hours', () => {
        expect(new TimeSpan(1, 0).totalHours()).toBeCloseTo(1.);
        expect(new TimeSpan(1, 15).totalHours()).toBeCloseTo(1.25);
        expect(new TimeSpan(1, 30).totalHours()).toBeCloseTo(1.50);
        expect(new TimeSpan(1, 45).totalHours()).toBeCloseTo(1.75);
    });


    test('total minutes', () => {
        expect(new TimeSpan(1, 0).totalMinutes()).toBeCloseTo(60);
        expect(new TimeSpan(1, 15).totalMinutes()).toBeCloseTo(75);
        expect(new TimeSpan(1, 30).totalMinutes()).toBeCloseTo(90);
        expect(new TimeSpan(1, 45).totalMinutes()).toBeCloseTo(105);
    });


    test('max', () => {
        var max = TimeSpan.Max([TimeSpan.Empty(), TimeSpan.fromHours(0.5)]);
        expect(max.totalHours()).toBeCloseTo(0.5);
    });

    test('max throws error if not an array is given', () => {
        expect(() => {
            TimeSpan.Max(TimeSpan.Empty(), TimeSpan.Empty())
        }).toThrow();
    });

    test('sum throws error if not an array is given', () => {
        expect(() => {
            TimeSpan.Sum(TimeSpan.Empty(), TimeSpan.Empty())
        }).toThrow();
    });
});