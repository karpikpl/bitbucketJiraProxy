/*jshint esversion: 6, node: true*/
'use strict';
const Bitbucket = require('../../APIs/bitbucket/bitbucket');
const JIRA = require('../../APIs/jira/jira');
const bitbucketClient = new Bitbucket('localhost', 7990, 'PROJECT_1', 'rep_1', 'admin', 'admin');
const jiraClient = new JIRA('ensemble.atlassian.net', 443, 'FORTracker', 'F0RTr@cker@Google');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            reply({
                message: 'welcome to the Stash & JIRA proxy'
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/notification',
        handler: function (request, reply) {

            const id = request.query.PULL_REQUEST_ID;
            const title = request.query.PULL_REQUEST_TITLE;
            const version = request.query.PULL_REQUEST_VERSION;
            const branch = request.query.PULL_REQUEST_FROM_BRANCH;

            bitbucketClient.updatePR(title + ' updated!', id, version, (err, res) => {

                if (err) {
                    return console.error(err);
                }

                reply(res);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/pullRequest/{id}',
        handler: function (request, reply) {

            const id = request.params.id;

            console.log('GET TEST - attempting to get PR: ' + id);
            bitbucketClient.getPR(5, (err, res) => {

                if (err) {
                    return console.error(err);
                }

                reply(res);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/jira/{key}',
        handler: function (request, reply) {

            const key = request.params.key;

            console.log('GET TEST - attempting to get JIRA: ' + key);
            jiraClient.getJira(key, (err, res) => {

                if (err) {
                    return console.error(err);
                }

                reply(res);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
