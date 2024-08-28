/** Class representing a span of time (hours and minutes).  */
export class TimeSpan {
    constructor(hours, minutes) {
        this.hours = hours + Math.floor(minutes / 60);
        this.minutes = minutes % 60;
        if (this.minutes < 0) {
            // this.minutes *= -1;
            this.hours++;
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

    totalHours() {
        return this.hours + this.minutes / 60;
    }


    totalMinutes() {
        return this.hours * 60 + this.minutes;
    }



    /**
      Calculates the sum of a list of {Timespan}.
      @param {TimeSpan[]} times - A list of {TimeSpan}
      @returns {TimeSpan} - The summed time
      */
    static Sum(times) {
        if(!Array.isArray(times)){
            throw new Error('Cannot calculate Sum, given parameter is not an array.');
        }
        let time = TimeSpan.fromHours(0);
        for (let index = 0; index < times.length; index++) {
            time = time.add(times[index]);
        }
        return time;
    }


    /**
  Gets the maximum the sum of a list of {Timespan}.
  @param {TimeSpan[]} times - A list of {TimeSpan}
  @returns {TimeSpan} - The summed time
  */
    static Max(times) {
        if(!Array.isArray(times)){
            throw new Error('Cannot calculate Max, given parameter is not an array.');
        }
        let maxTime = TimeSpan.fromHours(0);
        for (let index = 0; index < times.length; index++) {
            if (times[index].isGreaterThan(maxTime)) {
                maxTime = times[index];
            }
        }
        return maxTime;
    }


    
    /**
     * Returns an empty TimeSpan
     * @returns {TimeSpan} - A span with 0 hours.
     */
    static Empty(){
        return new TimeSpan(0, 0);
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


    /**
    Returns true if the other time span is longer
    @param {TimeSpan} other - The other TimeSpan.
    @returns {boolean}
    */
    isLessThan(other) {
        return this.totalHours() < other.totalHours();
    }

    /**
    Returns true if the other time span is shorter
    @param {TimeSpan} other - The other TimeSpan.
    @returns {boolean}
    */
    isGreaterThan(other) {
        return this.totalHours() > other.totalHours();
    }


}
