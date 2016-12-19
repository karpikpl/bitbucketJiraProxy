/*jshint esversion: 6, node: true*/
'use strict';
const Https = require('https');
const Config = require('../../config');

class bitbucketClient {

    constructor() {

        this.serverUrl = Config.get('/bitbucket/host');
        this.serverPort = Config.get('/bitbucket/port');
        this.auth = 'Basic ' + new Buffer(Config.get('/bitbucket/user') + ':' + Config.get('/bitbucket/pass')).toString('base64');
    }

    createRequestOptions(method, id, project, repository) {

        return {
            host: this.serverUrl,
            port: this.serverPort,
            path: `/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests/${id}`,
            method,
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json'
            }
        };
    }

    getPR(id, project, repository, callback) {

        const options = this.createRequestOptions('GET', id, project, repository);

        console.log(`Trying to read PR from ${options.host}:${options.port}${options.path}`);

        const req = Https.request(options, (res) => {

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

    updatePR(pr, callback) {
        // call to /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}
        const options = this.createRequestOptions('PUT', pr.id, pr.project, pr.repository);

        const req = Https.request(options, (res) => {

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
            id: pr.id,
            title: pr.title,
            version: pr.version
        }));
        req.end();
    }
}

module.exports = bitbucketClient;
