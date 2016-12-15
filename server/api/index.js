/*jshint esversion: 6, node: true*/
'use strict';
const Bitbucket = require('../../APIs/bitbucket/bitbucket');
const JIRA = require('../../APIs/jira/jira');
const bitbucketClient = new Bitbucket();
const jiraClient = new JIRA();
const Boom = require('boom');
const Config = require('../../config');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/bjproxy',
        handler: function (request, reply) {

            reply({
                message: `welcome to the Stash & JIRA proxy\nJira: ${Config.get('/jira/host')}\nBitbucket: ${Config.get('/bitbucket/host')}`
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/bjproxy/notification',
        handler: function (request, reply) {

            const id = request.query.PULL_REQUEST_ID;
            //const title = request.query.PULL_REQUEST_TITLE;
            const version = request.query.PULL_REQUEST_VERSION;
            const branch = request.query.PULL_REQUEST_FROM_BRANCH;
            const project = request.query.PULL_REQUEST_FROM_REPO_PROJECT_KEY;
            const repository = request.query.PULL_REQUEST_FROM_REPO_SLUG;

            // find Jira Key
            const jiraKeys = JIRA.getJiraKeys(branch);

            if (jiraKeys.length !== 1) {
                return reply(Boom.badRequest(`Invalid branch name ${branch}`));
            }

            console.log('Getting JIRA data for ' + jiraKeys[0]);
            jiraClient.getJira(jiraKeys[0], (err, jiraData) => {

                if (err) {
                    return console.error(err);
                }

                const jiraTitle = (jiraData.fields.parent && jiraData.fields.parent.fields.summary) || jiraData.fields.summary;
                const jiraPriority = (jiraData.fields.parent && jiraData.fields.parent.fields.priority.id) || jiraData.fields.priority.id;

                const newTitle = `[P${jiraPriority}] ${jiraKeys[0]} ${jiraTitle}`;

                bitbucketClient.updatePR({
                    id,
                    version,
                    project,
                    repository,
                    title: newTitle
                }, (err, res) => {

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
        path: '/bjproxy/pullRequest/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const project = request.query.project || 'EN';
            const repository = request.query.repository || 'harmony';
            const apiKey = request.query.apiKey || request.headers.apikey;


            if (Config.get('/apiKey') && apiKey !== Config.get('/apiKey')) {
                return reply(Boom.unauthorized('Invalid apiKey'));
            }

            bitbucketClient.getPR(id, project, repository, (err, res) => {

                if (err) {
                    return console.error(err);
                }

                reply(res);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/bjproxy/jira/{key}',
        handler: function (request, reply) {

            const key = request.params.key;
            const apiKey = request.query.apiKey || request.headers.apikey;

            console.log(request.headers);

            if (Config.get('/apiKey') && apiKey !== Config.get('/apiKey')) {
                return reply(Boom.unauthorized('Invalid apiKey'));
            }

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
