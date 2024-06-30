/** Class representing a span of time (hours and minutes).  */
export class TimeSpan {
    constructor(hours, minutes) {
        this.hours = hours + Math.floor(minutes / 60);
        this.minutes = minutes % 60;
        if (this.minutes < 0) {
            this.minutes += 60;
            this.hours--;
        }
    }
    /**
    Create a TimeSpan instance from a total number of minutes.
    @param {number} totalMinutes - The total number of minutes.
    @returns {TimeSpan} - The new TimeSpan instance.
    */
    static fromMinutes(totalMinutes) {
        return new TimeSpan(0, totalMinutes);
    }

    /**
    Create a TimeSpan instance from a total number of hours.
    @param {number} totalHours - The total number of hours.
    @returns {TimeSpan} - The new TimeSpan instance.
    */
    static fromHours(totalHours) {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        return new TimeSpan(hours, minutes);
    }

    /**
    Add another TimeSpan to this instance.
    @param {TimeSpan} other - The other TimeSpan.
    @returns {TimeSpan} - The resulting TimeSpan.
    */
    add(other) {
        const totalMinutes = (this.hours + other.hours) * 60 + this.minutes + other.minutes;
        return TimeSpan.fromMinutes(totalMinutes);
    }

    /**
    Subtract another TimeSpan from this instance.
    @param {TimeSpan} other - The other TimeSpan.
    @returns {TimeSpan} - The resulting TimeSpan.
    */
    subtract(other) {
        const totalMinutes = (this.hours - other.hours) * 60 + this.minutes - other.minutes;
        return TimeSpan.fromMinutes(totalMinutes);
    }
}
