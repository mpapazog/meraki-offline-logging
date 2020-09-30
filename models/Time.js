// Time.js

var { DateTime } = require('luxon');

class TimeClass {
    constructor() {
        
    }
    
    currentTimestamp () {
        return DateTime.utc().toISO();
    }    
    
} // class TimeClass

var Time = new TimeClass();

module.exports = Time;