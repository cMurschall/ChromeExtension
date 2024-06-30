import { TimeSpan } from './TimeSpan'

/**
class representing a time of day (hours and minutes).
*/
export class TimeOnly {
    /**
    Create a TimeOnly instance.
    @param {number} hours - The hours (0-23).
    @param {number} minutes - The minutes (0-59).
    */
    constructor(hours, minutes) {
        this.hours = hours;
        this.minutes = minutes;
    }

    /**
    Subtract another TimeOnly instance from this instance.
    @param {TimeOnly} other - The other TimeOnly instance.
    @returns {TimeSpan} - The TimeSpan representing the difference.
    */
    subtract(other) {
        const thisMinutes = this.hours * 60 + this.minutes;
        const otherMinutes = other.hours * 60 + other.minutes;
        const diffMinutes = thisMinutes - otherMinutes;
        return new TimeSpan(0, diffMinutes);
    }


    /**
    Add a TimeOnly to this instance.
    @param {TimeSpan} other - The TimeSpan to add
    @returns {TimeOnly} - The TimeSpan representing the difference.
    */
    addTimeSpan(span) {
        const totalMinutes = this.hours * 60 + this.minutes + span.hours * 60 + span.minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        return new TimeOnly(newHours, newMinutes);
    }

    /**
Finds the min instance
@param {TimeOnly[]} times
@returns {TimeOnly}
*/
    static Min(times) {
        if (times.length === 0) throw new Error("At least one TimeOnly instance is required");
        return times.reduce((min, current) => {
            const minTotalMinutes = min.hours * 60 + min.minutes;
            const currentTotalMinutes = current.hours * 60 + current.minutes;
            return currentTotalMinutes < minTotalMinutes ? current : min;
        });
    }
    /**
Finds the max instance
@param {TimeOnly[]} times
@returns {TimeOnly}
*/
    static Max(times) {
        if (times.length === 0) throw new Error("At least one TimeOnly instance is required");
        return times.reduce((max, current) => {
            const maxTotalMinutes = max.hours * 60 + max.minutes;
            const currentTotalMinutes = current.hours * 60 + current.minutes;
            return currentTotalMinutes > maxTotalMinutes ? current : max;
        });
    }


    /**
     * Parses a time string (9:03, or 9:03am / 17:31 or 5:31pm)
     * @param {string} timeString 
     * @returns {TimeOnly} parsed time instance
     */
    static FromTimeString(timeString) {
        timeString = timeString.trim();
        if (timeString.includes('am') || timeString.includes('AM') || timeString.includes('pm') || timeString.includes('PM')) {
            let timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
            let match = timeString.match(timeRegex);
            if (!match) {
                throw new Error(`Invalid time format: ${timeString}`);
            }

            let hours = parseInt(match[1], 10);
            let minutes = parseInt(match[2], 10);
            let period = match[3].trim();

            if (period) {
                hours = hours % 12;
                if (period.toLowerCase() === 'pm') {
                    hours += 12;
                }
            }
            return new TimeOnly(hours, minutes);

        }
        else {
            let [hours, minutes] = timeString.split(':').map(Number);
            return new TimeOnly(hours, minutes);
        }
    }
}