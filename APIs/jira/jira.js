/*jshint esversion: 6, node: true*/
'use strict';
const Http = require('http');

const harmonyKey = /HA-\d+/g;

class jiraClient {

    static getJiraKeys(text) {

        return harmonyKey.exec(text);
    }
}

module.exports = jiraClient;
