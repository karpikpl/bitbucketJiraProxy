/*jshint esversion: 6, node: true*/
'use strict';
const Http = require('http');
const Config = require('../../config');

class bitbucketClient {

    constructor(projectKey, repositorySlug) {

        this.serverUrl = Config.get('/bitbucket/host');
        this.serverPort = Config.get('/bitbucket/port');
        this.projectKey = projectKey;
        this.repositorySlug = repositorySlug;
        this.auth = 'Basic ' + new Buffer(Config.get('/bitbucket/user') + ':' + Config.get('/bitbucket/pass')).toString('base64');
    }

    createRequestOptions(method, id) {

        return {
            host: this.serverUrl,
            port: this.serverPort,
            path: `/bitbucket/rest/api/1.0/projects/${this.projectKey}/repos/${this.repositorySlug}/pull-requests/${id}`,
            method: method || 'GET',
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json'
            }
        };
    }

    getPR(id, callback) {

        const options = this.createRequestOptions('GET', id);

        console.log(`Trying to read PR from ${options.host}:${options.port}${options.path}`);

        const req = Http.request(options, (res) => {

            // res.statusCode
            // res.headers
            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                callback(null, chunk);
            });
        });

        req.on('error', (e) => {

            callback(e);
        });

        req.end();
    }

    updatePR(title, id, version, callback) {
        // call to /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}
        const options = this.createRequestOptions('PUT', id);

        const req = Http.request(options, (res) => {

            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                callback(null, chunk);
            });
        });

        req.on('error', (e) => {

            callback(e);
        });

        // write data to request body
        req.write(JSON.stringify({
            id,
            title,
            version
        }));
        req.end();
    }
}

module.exports = bitbucketClient;
