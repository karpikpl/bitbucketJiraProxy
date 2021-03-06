/*jshint esversion: 6, node: true*/
'use strict';
const Https = require('https');
const Config = require('../../config');

class jiraClient {

    static getJiraKeys(text) {

        return text.match(new RegExp(Config.get('/jira/keyRegex'), 'gi'));
    }

    constructor() {

        console.log('configuring Jira using config for ' + Config.get('/projectName'));
        const jiraUser = Config.get('/jira/user');
        const jiraPass = Config.get('/jira/pass');
        this.serverUrl = Config.get('/jira/host');
        this.serverPort = Config.get('/jira/port');
        this.auth = 'Basic ' + new Buffer(jiraUser + ':' + jiraPass).toString('base64');
    }

    createRequestOptions(method, key) {
        //curl -u admin:admin http://localhost:8090/jira/rest/api/2/issue/MKY-1

        return {
            host: this.serverUrl,
            port: this.serverPort,
            path: `/rest/api/2/issue/${key}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`,
            method,
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

            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                callback(null, { data: JSON.parse(chunk), statusCode: res.statusCode });
            });
        });

        req.on('error', (e) => {

            callback(e);
        });

        req.end();
    }
}

module.exports = jiraClient;
