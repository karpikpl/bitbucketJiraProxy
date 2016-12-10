/*jshint esversion: 6, node: true*/
'use strict';
const Bitbucket = require('../../APIs/bitbucket/bitbucket');
const JIRA = require('../../APIs/jira/jira');
const bitbucketClient = new Bitbucket('EN', 'harmony');
const jiraClient = new JIRA();
const Boom = require('boom');

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
            //const title = request.query.PULL_REQUEST_TITLE;
            const version = request.query.PULL_REQUEST_VERSION;
            const branch = request.query.PULL_REQUEST_FROM_BRANCH;

            // find Jira Key
            const jiraKeys = JIRA.getJiraKeys(branch);

            if (jiraKeys.length !== 1) {
                return reply(Boom.badRequest(`Invalid branch name ${branch}`));
            }

            jiraClient.getJira(jiraKeys[0], (err, jiraData) => {

                if (err) {
                    return console.error(err);
                }

                const jiraTitle = (jiraData.fields.parent && jiraData.fields.parent.fields.summary) || jiraData.fields.summary;
                const jiraPriority = (jiraData.fields.parent && jiraData.fields.parent.fields.priority.id) || jiraData.fields.priority.id;

                const newTitle = `[P${jiraPriority}] ${jiraTitle}`;

                bitbucketClient.updatePR(newTitle, id, version, (err, res) => {

                    if (err) {
                        return console.error(err);
                    }

                    reply(res);
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/pullRequest/{id}',
        handler: function (request, reply) {

            const id = request.params.id;

            bitbucketClient.getPR(id, (err, res) => {

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
