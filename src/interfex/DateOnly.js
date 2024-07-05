


export class DateOnly {
    constructor(month, day) {
        this.setMonth(month);
        this.setDay(day);
    }

    // Getter for month
    getMonth() {
        return this.month;
    }

    // Setter for month with validation
    setMonth(month) {
        if (month < 1 || month > 12) {
            throw new Error("Invalid month. Please enter a value between 1 and 12.");
        }
        this.month = month;
    }

    // Getter for day
    getDay() {
        return this.day;
    }

    // Setter for day with validation
    setDay(day) {
        if (day < 1 || day > 31) {
            throw new Error("Invalid day. Please enter a value between 1 and 31.");
        }
        this.day = day;
    }

    // Method to display the date in a readable format
    toString() {
        return `${this.month.toString().padStart(2, '0')}-${this.day.toString().padStart(2, '0')}`;
    }

    // Method to check if two DateOnly instances are the same
    equals(other) {
        if (!(other instanceof DateOnly)) {
            return false;
        }
        return this.month === other.getMonth() && this.day === other.getDay();
    }

/**
 * Parses a date string
 * @param {string} dateString 
 * @returns {DateOnly}
 */
    static parseDateOnly(dateString){

        const regexGermanFormat = /(?<day>\w{2})\.,(?<date>\d{2})\.(?<month>\d{2})\./;
        const regexEnglishFormat = /(?<day>\w{3}),(?<month>\d{1,2})\/(?<date>\d{1,2})/;

        let match = dateString.match(regexGermanFormat);
        if(!match){
            match = dateString.match(regexEnglishFormat);
        }
        if(match){
            const { day, month, date } = match.groups;
            return new DateOnly(parseInt(month), parseInt(date))
        }

        return new DateOnly(1,1)
    }
}