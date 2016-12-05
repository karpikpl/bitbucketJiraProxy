/*jshint esversion: 6, node: true*/
'use strict';
const Http = require('http');

const harmonyKey = /HA-\d+/gi;

class jiraClient {

    static getJiraKeys(text) {

        return text.match(harmonyKey);
    }
}

module.exports = jiraClient;
