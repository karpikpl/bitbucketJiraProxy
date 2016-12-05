/*jshint esversion: 6, node: true*/
'use strict';
const Https = require('https');

const harmonyKey = /HA-\d+/gi;

class jiraClient {

    static getJiraKeys(text) {

        return text.match(harmonyKey);
    }

    constructor(serverUrl, serverPort, username, password) {

        this.serverUrl = serverUrl;
        this.serverPort = serverPort;
        this.auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    }

    createRequestOptions(method, key) {
        //curl -u admin:admin http://localhost:8090/jira/rest/api/2/issue/MKY-1

        return {
            host: this.serverUrl,
            port: this.serverPort,
            path: `/rest/api/2/issue/${key}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`,
            method: method || 'GET',
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json'
            }
        };
    }

    getJira(key, callback) {

        const options = this.createRequestOptions('GET', key);

        console.log(`Trying to get Jira from ${options.host}:${options.port}${options.path}`);

        const req = Https.request(options, (res) => {

            // res.statusCode
            // res.headers
            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                callback(null, JSON.parse(chunk));
            });
        });

        req.on('error', (e) => {

            callback(e);
        });

        req.end();
    }
}

module.exports = jiraClient;
