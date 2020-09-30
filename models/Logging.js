// Logging.js

var Meraki = require('./Meraki');
var Time = require('./Time');
const Config = require('./Config');
const Database = require('./Database');


class LoggingClass {
    constructor() {
        this.db = new Database.DatabaseClass(
            Config.databaseHostAddress, 
            Config.databaseHostPort, 
            Config.databaseDbName
        );
        
        this.updateDatabase(this);
    }
    
    async updateDatabase(self) {        
        console.log(Time.currentTimestamp() + " Starting organization scan...");
        var networks = await Meraki.v1.getNetworks(Config.organizationId);
        
        var now = new Date();
        var secondsSinceEpoch = Math.round(now.getTime() / 1000);
        
        var filteredByTag   = [];
        var filteredByGeoIp = [];
        var combined        = [];
        
        var supportedProducts = ['wireless', 'switch', 'appliance'];
        
        if (Config.logEveryNetwork) {
            combined = networks;
        } else {
            if (Config.logNetworksWithTag != "") {
                filteredByTag = self.filterNetworksByTag(networks);
            }
            
            if (Config.logGeoIpCountry != "") {
                filteredByGeoIp = self.filterNetworksByGeoIp(networks);
            }
            combined = self.combineNetworksLists(filteredByTag, filteredByGeoIp);
        }
        
        for (var i in combined) {
            var containsSupportedDevices = false;
            for (var j in combined[i].productTypes) {
                if (supportedProducts.includes(combined[i].productTypes[j])) {
                    containsSupportedDevices = true;
                    break;
                }
            }
            if (containsSupportedDevices) {
                
                var clients = await Meraki.v1.getNetworkClients(combined[i].id, Config.clientLookupTimeSeconds);
                for (var k in clients) {
                    // Exclude Meraki possible Meraki devices from other networks
                    if (!Config.excludedClientMacManufacturers.includes(clients[k].manufacturer)) {
                        self.db.logClient(self.db, combined[i].id, combined[i].name, clients[k], Time.currentTimestamp());
                        
                        var trafficHistory = await Meraki.v1.getNetworkClientTrafficHistory(combined[i].id, clients[k].id);
                        if (trafficHistory.length > 0) {
                            self.db.logClientTraffic(self.db, combined[i].id, combined[i].name, 
                                clients[k].id, trafficHistory, Time.currentTimestamp());
                        }     
                    }
                }
            }
        }
        console.log(Time.currentTimestamp() + " Organization scan complete");
        console.log(Time.currentTimestamp() + " Next scan in " + Config.scanIntervalMinutes + " minutes");
        setTimeout(function() {
            self.updateDatabase(self);
        }, Config.scanIntervalMinutes * 60000);           
    }
    
    filterNetworksByTag(networks) {
        var result = [];
        for (var i in networks) {
            if (networks[i].tags.includes(Config.logNetworksWithTag)) {
                result.push(networks[i]);
            }
        }
        return result;
    }
    
    filterNetworksByGeoIp(networks) {
        return [];
    }
    
    combineNetworksLists(netList1, netList2) {
        var result = [];
        
        for (var i in netList1) {
            result.push(netList1[i]);
        }
        for (var j in netList2) {
            var networkIsUnique = true;
            for (var k in netList1) {
                if(netlist2[j].id == netlist1[k].id) {
                    networkIsUnique = false;
                    break;
                }
            } 
            if (networkIsUnique) {
                result.push(netList2[j]);                
            }
        }
        
        return result;
    }
    
    dateToIsoString(date) {
        function pad(number) {
            var r = String(number);
            if ( r.length === 1 ) {
                r = '0' + r;
            }
            return r;
        }

        return this.getUTCFullYear()
            + '-' + pad( this.getUTCMonth() + 1 )
            + '-' + pad( this.getUTCDate() )
            + 'T' + pad( this.getUTCHours() )
            + ':' + pad( this.getUTCMinutes() )
            + ':' + pad( this.getUTCSeconds() )
            + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
            + 'Z';
    }
                
    
} // class LoggingClass

var Logging = new LoggingClass();

module.exports = Logging;