import { WorkSpan } from './WorkSpan'
import { TimeSpan } from './TimeSpan'
import { TimeOnly } from './TimeOnly'
import {
    NormalBreakTime,
    NormalWorkTime,
    NormalWorkTimeLimit,
    ExtendedBreakTime,
    ExtendedWorkTimeLimit,
} from './constants'

/**
 * 
 * @param {WorkSpan[]} times a list where we see the logged in and logged out times
 * @returns {TimeSpan[]} - The list of actual taken breaks
 */
function actualBreaksTaken(times) {
    if (times.length == 0 || times.length == 1) {
        return [TimeSpan.fromHours(0)];
    }

    let breaks = [];
    for (let index = 1; index < times.length; index++) {
        var pause = times[index].login.subtract(times[index - 1].logout)
        breaks.push(pause);
    }
    return breaks;
}

/**
 * Calculates the total break time according to german Arbeitsrecht
 * @param {TimeSpan} presenceTime - The time the worker was present
 * @param {TimeSpan[]} breakTimes - The list of actual taken breaks
 * @returns {TimeSpan} the calculated sum of break times according to german Arbeitsrecht
 */
function calculateBreak(presenceTime, breakTimes) {
    let breaksTakenSoFar = TimeSpan.Sum(breakTimes);
    let orderedBreaks = Array.from(breakTimes).toSorted((a, b) => b.totalHours()-a.totalHours());


    if (presenceTime.isLessThan(NormalWorkTimeLimit)) {
        return breaksTakenSoFar;
    }
    if (presenceTime.isGreaterThan(ExtendedWorkTimeLimit)) {
        // check for 45 breaks after 9 hours todo
        if (breaksTakenSoFar.isLessThan(ExtendedBreakTime)) {
            return ExtendedBreakTime;
        }
        return breaksTakenSoFar;
    }


    // no break
    if(orderedBreaks.length == 0){
        return TimeSpan.fromMinutes(30);
    }
    if(orderedBreaks[0].isLessThan(TimeSpan.fromMinutes(10))){
        return TimeSpan.fromMinutes(30).add(breaksTakenSoFar);
    }
    
    // do we have a 30 minute break?
    if (orderedBreaks[0].isGreaterThan(NormalBreakTime)) {
        return breaksTakenSoFar;
    }


    // do we have two 15 minute breaks?
    if (orderedBreaks.length > 1) {
        let pause1Okay = orderedBreaks[0].isGreaterThan(TimeSpan.fromMinutes(15));
        let pause2Okay = orderedBreaks[1].isGreaterThan(TimeSpan.fromMinutes(15));
        if(!pause1Okay){
            orderedBreaks[0] = TimeSpan.fromMinutes(30);
        }
        else if(!pause2Okay){
            orderedBreaks[0] = TimeSpan.fromMinutes(30);
        }
        return TimeSpan.Sum(orderedBreaks);
    }


    return TimeSpan.fromMinutes(30);

}

export class WorkDay {

    /**
     * @param {string} date the date of the working day
     * @param {WorkSpan[]} times a list where we see the logged in and logged out times
     */
    constructor(date, times) {
        this.date = date;
        this.times = times;
    }
    /**
     * calculate the total presence time
     * @returns {TimeSpan} - The time from the first login to the last logout
     */
    presenceTime() {
        const come = TimeOnly.Min(this.times.map(x => x.login));
        const left = TimeOnly.Max(this.times.map(x => x.logout));
        return left.subtract(come);

    }
    /**
     * Calculate the resulting interflex break
     * @returns {TimeSpan} - The total break time taken.
     */
    breakTime() {
        const breaksTaken = actualBreaksTaken(this.times);
        return calculateBreak(this.presenceTime(), breaksTaken);
    }

    /**
     * Calculate the resulting interflex work
     * @returns {TimeSpan} - The total work time.
     */
    workTime() {
        return this.presenceTime().subtract(this.breakTime())
    }

    workEndTime(){
        const come = TimeOnly.Min(this.times.map(x => x.login));
        return come.addTimeSpan(NormalWorkTime).addTimeSpan(this.breakTime());
    }

    overtime(){
        return this.workTime().subtract(NormalWorkTime);
    }


    /**
     * Calculate the actual worked time
     * @returns {TimeSpan} - The total work time.
     */
    workTimePure() {
        return TimeSpan.Sum(this.times.map(x => x.duration()));
    }
}
