// Config.js

class ConfigClass {
    constructor() {
        // Edit the values below to match your environment parameters
        
        // Meraki Dashboard communication parameters
        this.apiKey                         = '1234';
        this.organizationId                 = '4321';
        this.v1BaseUrl                      = 'https://api-mp.meraki.com/api/v1';
        this.maxRetries                     = 3;
        this.requestTimeout                 = 60000; // Milliseconds
        
        // Network scan parameters
        this.scanIntervalMinutes            = 60; // How long to wait between organization scans. Default: 60
        this.logNetworksWithTag             = "offline-logging";
        this.logEveryNetwork                = false;
        this.clientLookupTimeSeconds        = 2678400; // Maximum: 2678400 for up to 31 days client lookup depth
        this.excludedClientMacManufacturers = [
            'Cisco Meraki', 
            'Meraki'
        ]; // MAC addresses belonging to these manufacturers are excluded from client lists
                
        // Database connection parameters
        this.databaseHostAddress            = "127.0.0.1";
        this.databaseHostPort               = "27017";
        this.databaseDbName                 = "meraki";
                
    }
} // class ConfigClass

const Config = new ConfigClass();

module.exports = Config;