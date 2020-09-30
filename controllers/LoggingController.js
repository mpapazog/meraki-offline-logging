// LoggingController.js

var express = require('express');
var router = express.Router();
router.use(express.json());

var Logging = require('../models/Logging');

// Returns help 
router.get('/', function (req, res) {
    try 
    {
        var docs = {help:"API not implemented yet"};      
    } 
    catch(err)
    {
        res.status(500).json({errors:"Server error GET /"});
    }
    res.status(200).json(docs); 
});

module.exports = router;