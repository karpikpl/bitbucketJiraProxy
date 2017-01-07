/*jshint esversion: 6, node: true*/
'use strict';
const Config = require('../../config');
const Https = (Config.get('/bitbucket/https') || Config.get('/bitbucket/port') === 443) ? require('https') : require('http');
const Fetch = require('node-fetch');

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
            path: `${Config.get('/bitbucket/path') || ''}/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests/${id}`,
            method,
            headers: {
                'Authorization': this.auth,
                'Content-Type': 'application/json'
            }
        };
    }

    getPR(id, project, repository, callback) {

        const options = this.createRequestOptions('GET', id, project, repository);

        console.log(`Trying to read PR from https://${options.host}:${options.port}${options.path}`);

        const opts = { method: 'GET', headers: options.headers };
        let statusCode;
        Fetch(`https://${options.host}:${options.port}${options.path}`, opts)
            .then((res) => {

                statusCode = res.status;
                return res.json();
            })
            .then((json) => {

                return callback(null, { data: json, statusCode });
            })
            .catch(() => {

                callback('error fetching data from bitbucket');
            });
    }

    updatePR(pr, callback) {
        // call to /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}
        // https://developer.atlassian.com/static/rest/bitbucket-server/4.12.0/bitbucket-rest.html#idp2309600
        const options = this.createRequestOptions('PUT', pr.id, pr.project, pr.repository);

        const req = Https.request(options, (res) => {

            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                callback(null, { data: JSON.parse(chunk), statusCode: res.statusCode });
            });
        });

        req.on('error', (e) => {

            callback(e);
        });

        const requestBody = JSON.stringify({
            id: pr.id,
            title: pr.title,
            version: pr.version,
            reviewers: pr.reviewers
        });

        // write data to request body
        req.write(requestBody);
        req.end();
    }
}

module.exports = bitbucketClient;
