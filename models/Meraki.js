// Meraki.js

const Config = require('./Config');
const apiV1 = require('./DashboardApiV1');

class MerakiClass {
    constructor() {
        this.v1 = new apiV1.DashboardApiV1Class(Config.apiKey, Config.v1BaseUrl, Config.requestTimeout);
    }    
} // class MerakiClass

var Meraki = new MerakiClass();

module.exports = Meraki;