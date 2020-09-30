# meraki-offline-logging
Node.js/MongoDB project that logs information from the Meraki dashboard into a database.

# Project overview
Compliance reasons or archiving strategies might require exporting data from dashboard into an external database. This project is an example of how to do that using Node.js and MongoDB. The project currently logs networks clients and their traffic history only.

# Installation and startup
* Install Node.js: https://nodejs.org/en/
* Install MongoDB. You can get the community version of MongoDB here, including Compass: https://www.mongodb.com/try/download/community
* Install the MongoDB Compass tool for viewing the contents of your database. The Community Edition is enough for the needs of this project. If you selected not to install it on your MongoDB server, you can get it here: https://www.mongodb.com/products/compass
* Copy the contents or this repository to your server
* Edit file **/models/Config.js**
* Find the following text:
```
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
```
* Replace the contents of variables **apiKey** and **organizationId** to match your environment. If you have installed Node.js and MongoDB on separate servers, you will need to modify **databaseHostAddress** as well
* In the project directory (the one where server.js is), run the following commands:
```
npm install
node server.js
```
* The server will run and scan your organization with the frequency defined in Config variable **scanIntervalMinutes**. The default value is 60  minutes. If you want to quickly verify how subsequent scans will affect the database, you can lower this to 1 minute. You will need to restart the Node.js server process to apply changes to the Config.js file
* To include a network in the scan process, either tag it in the Meraki dashboard with the label defined in Config variable **logNetworksWithTag**, or set **logEveryNetwork** to **true**
* Use the MongoDBCompass tool that came with MongoDB to view the contents of your database

# Known issues
The code does not handle "Retry-after" headers returned by the Meraki Dashboard API request limiter or paginated reponses properly yet. These will be fixed at a later time.

# Useful links
The official Meraki API developer page: https://developer.cisco.com/meraki
