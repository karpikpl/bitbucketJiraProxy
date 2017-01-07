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
            const reviewersSlugs = request.query.PULL_REQUEST_REVIEWERS_SLUG;

            if (!id || !version || !branch || !project || !repository || reviewersSlugs === undefined) {
                return reply(Boom.badRequest('Not all required parameters provided. Check documentation for API description'));
            }

            const reviewers = reviewersSlugs && reviewersSlugs
                .split(',')
                .map((name) => {

                    return {
                        user: {
                            name
                        }
                    };
                });

            // find Jira Key
            const jiraKeys = JIRA.getJiraKeys(branch);

            if (!jiraKeys || jiraKeys.length !== 1) {
                return reply(Boom.badRequest(`Invalid branch name ${branch}`));
            }

            console.log('Getting JIRA data for ' + jiraKeys[0]);
            jiraClient.getJira(jiraKeys[0], (err, jiraData) => {

                if (err || !jiraData || jiraData.statusCode !== 200) {
                    console.error(err);
                    return reply(Boom.badRequest(`Could not get jira ${jiraKeys[0]}`));
                }

                const jiraTitle = (jiraData.data.fields.parent && jiraData.data.fields.parent.fields.summary) || jiraData.data.fields.summary;
                const jiraPriority = (jiraData.data.fields.parent && jiraData.data.fields.parent.fields.priority.id) || jiraData.data.fields.priority.id;

                const newTitle = `[P${jiraPriority}] ${jiraKeys[0]} ${jiraTitle}`;

                const newPrData = {
                    id,
                    version,
                    project,
                    repository,
                    title: newTitle
                };

                if (reviewers) {
                    newPrData.reviewers = reviewers;
                }

                bitbucketClient.updatePR(newPrData, (err, res) => {

                    if (err) {
                        console.error(err);
                        return reply(Boom.badRequest(`Could update PR ${id}`));
                    }

                    reply(res).code(res.statusCode);
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

            console.log('getting PR');

            if (Config.get('/apiKey') && apiKey !== Config.get('/apiKey')) {
                return reply(Boom.unauthorized('Invalid apiKey'));
            }

            bitbucketClient.getPR(id, project, repository, (err, res) => {

                if (err) {
                    console.error(err);
                    return reply(Boom.badRequest(`Could get PR ${id}`));
                }

                reply(res.data).code(res.statusCode);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/bjproxy/jira/{key}',
        handler: function (request, reply) {

            const key = request.params.key;
            const apiKey = request.query.apiKey || request.headers.apikey;

            if (Config.get('/apiKey') && apiKey !== Config.get('/apiKey')) {
                return reply(Boom.unauthorized('Invalid apiKey'));
            }

            jiraClient.getJira(key, (err, res) => {

                if (err) {
                    console.error(err);
                    return reply(Boom.badRequest(`Could get JIRA ${key}`));
                }

                reply(res.data).code(res.statusCode);
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api'
};
