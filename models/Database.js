// Database.js

const CLIENT_COLLECTION_NAME    = "clients";
const USAGE_COLLECTION_NAME     = "clientTraffic";
const GEOIP_COLLECTION_NAME     = "geoIpMappings";

class DatabaseClass {
    constructor(host, port, dbName) {
        this.dbName = dbName;
        this.dbUrl = "mongodb://" + host + ":" + port + "/" + dbName;
        this.mongoParameters = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
    }
        
    insertDocument(self, collectionName, documentData) {
        var MongoClient = require('mongodb').MongoClient
            , assert = require('assert');

        // Use connect method to connect to the Server
        MongoClient.connect(self.dbUrl, self.mongoParameters, function(err, db) {
            assert.equal(null, err);
            
            var dbo = db.db(self.dbName);
            
            // Insert a single document
            dbo.collection(collectionName).insertOne(documentData, function(err, r) {
                assert.equal(null, err);
                assert.equal(1, r.insertedCount);

                db.close();
            });
        });
    }
    
    findAndUpdateDocument(self, collectionName, matchData, newData) {
        var MongoClient = require('mongodb').MongoClient
            , assert = require('assert');

        // Use connect method to connect to the Server
        MongoClient.connect(self.dbUrl, self.mongoParameters, function(err, db) {
            assert.equal(null, err);
            
            var dbo = db.db(self.dbName);
            
            for (var key in matchData) {
                var matchFirstKey = key;
                break;
            }
            
            // Modify and return the modified document
            dbo.collection(collectionName).findOneAndUpdate(matchData, {$set: newData}, {
                returnOriginal: false
                , upsert: true
            }, function(err, r) {
                assert.equal(null, err);

                db.close();
            });
        });        
    }
    
    logClient(self, networkId, networkName, clientData, timestamp) {
        var record = {
            networkId   : networkId,
            networkName : networkName,
            scanTime    : timestamp
        };
        
        for (var key in clientData) {
            record[key] = clientData[key];
        }
        
        self.insertDocument(self, CLIENT_COLLECTION_NAME, clientData);
    }
    
    logClientTraffic(self, networkId, networkName, clientId, trafficData, timestamp) {
        var record = {
            networkId   : networkId,
            clientId    : clientId,
            networkName : networkName,
            scanTime    : timestamp,
            trafficData : []
        };
        
        for (var key in trafficData) {
            record["trafficData"].push(trafficData[key]);
        }
        
        var matchValues = {
            networkId   : networkId,
            clientId    : clientId            
        };
        
        self.findAndUpdateDocument(self, USAGE_COLLECTION_NAME, matchValues, record);
    }
    
    
    
}   // class DatabaseClass

module.exports.DatabaseClass = DatabaseClass;