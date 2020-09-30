// DashboardApiV1.js

const axios = require('axios');

class DashboardApiV1Class {
    constructor(apiKey, baseUrl, timeout) {
        this.api = axios.create({
            baseURL: baseUrl,
            timeout: timeout,
            headers: {"Authorization": "Bearer " + apiKey}
        });        
    }
    
    async getOpenAPISpec(organizationId) {  
        var endpoint = "/organizations/" + organizationId + "/openapiSpec";
        var result = {error: "General failure"};
        
        try {
            const response = await this.api.get(endpoint);
            result = response.data;
        } catch (error) {
            console.log(error);
        }
        return result;
    }
    
    async getNetworks(organizationId) {
        var endpoint = "/organizations/" + organizationId + "/networks";
        
        try {
            const response = await this.api.get(endpoint);
            var result = response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
        return result;
    }
    
    async getNetworkClients(networkId, timespan) { 
        var endpoint = "/networks/" + networkId + "/clients?timespan=" + timespan;
        
        try {
            const response = await this.api.get(endpoint);
            var result = response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
        return result;
    }
    
    async getNetworkClientTrafficHistory(networkId, clientId) { 
        var endpoint = "/networks/" + networkId + "/clients/" + clientId + "/trafficHistory";
        
        try {
            const response = await this.api.get(endpoint);
            var result = response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
        return result;
    }    
    
} // class MerakiClass

var DashboardApiV1 = new DashboardApiV1Class();

module.exports = DashboardApiV1;
module.exports.DashboardApiV1Class = DashboardApiV1Class;