import WorkSpan from './WorkSpan'
import TimeSpan from './TimeSpan'
import TimeOnly from './TimeOnly'





export class WorkDay {

    /**
     * @param {string} the date of the working day
     * @param {WorkSpan[]} a list where we see the logged in and logged out times
     */
    constructor(date, times) {
        this.date = date;
        this.times = times;
    }
    /**
     * calculate the total presence time
     * @returns {TimeSpan} - The time from the first login to the last logout
     */
    getPresenceTime(){
        const come = TimeOnly.Min(this.times.select(x => x.login))
        const left = TimeOnly.Max(this.times.select(x => x.logout))
        return left.subtract(come);

    }
    /**
     * Calculate the resulting interflex break
     * @returns {TimeSpan} - The total break time taken.
     */
    getBreakTime(){

    }

}
