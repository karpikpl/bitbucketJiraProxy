/*jshint esversion: 6, node: true*/
'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../test-config');
const Hapi = require('hapi');
const IndexPlugin = require('../../../server/api/index');
const Nock = require('nock');

const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [IndexPlugin];
    server = new Hapi.Server();
    server.connection({
        port: Config.get('/port/web')
    });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        done();
    });
});

lab.experiment('Index Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/bjproxy'
        };

        done();
    });


    lab.test('it returns the default message', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result.message).to.match(/welcome to the Stash & JIRA proxy/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

lab.experiment('Stash Notification', () => {

    let jiraMock;
    let bitbucketMock;
    let bitbucketRequestData;
    const project = 'PROJECT_1';
    const repository = 'rep_1';
    const prId = 502;
    const version = 99;
    const key = 'HA-8714';
    const reviewers = 'reviewer1,user';
    const jiraData = {
        key,
        'fields': {
            'summary': 'Rating manager mock rejects request with valid exchange rate values',
            'issuetype': {
                'name': 'Bug'
            },
            'customfield_10008': 'FR-325',
            'priority': {
                'name': 'High',
                'id': '2'
            }
        }
    };
    const newPrTitle = `[P${jiraData.fields.priority.id}] ${key} ${jiraData.fields.summary}`;
    const bitbucketData = {
        id: prId,
        'version': version + 1,
        'title': newPrTitle,
        'description': '- contract start date to invalid\r\n - then clicks X button',
        'reviewers': [{
            'user': {
                'name': 'reviewer1'
            }
        }, {
            'user': {
                'name': 'user'
            }
        }]
    };

    lab.beforeEach((done) => {

        bitbucketRequestData = {
            id: prId.toString(),
            title: newPrTitle,
            version: version.toString(),
            reviewers: [{
                user: {
                    name: 'reviewer1'
                }
            }, {
                user: {
                    name: 'user'
                }
            }]
        };

        request = {
            method: 'GET',
            url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
        };

        jiraMock = Nock('https://' + Config.get('/jira/host') + ':' + Config.get('/jira/port'))
            .get(`/rest/api/2/issue/${key}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`)
            .basicAuth({
                user: Config.get('/jira/user'),
                pass: Config.get('/jira/pass')
            })
            .reply(200, jiraData)
            .log(console.log);

        bitbucketMock = Nock('https://' + Config.get('/bitbucket/host') + ':' + Config.get('/bitbucket/port'))
            .put(`/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests/${prId}`, bitbucketRequestData)
            .basicAuth({
                user: Config.get('/bitbucket/user'),
                pass: Config.get('/bitbucket/pass')
            })
            .reply(200, bitbucketData)
            .log(console.log);

        done();
    });


    lab.test('it updates PR with Jira title', (done) => {

        server.inject(request, (response) => {

            Code.expect(jiraMock.isDone()).to.be.true();
            Code.expect(bitbucketMock.isDone()).to.be.true();
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({
                data: bitbucketData,
                statusCode: 200
            });

            done();
        });
    });

    lab.test('it updates PR with Jira title when no reviewers', (done) => {

        delete bitbucketRequestData.reviewers;
        request.url = `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${''}`;

        server.inject(request, (response) => {

            Code.expect(jiraMock.isDone()).to.be.true();
            Code.expect(bitbucketMock.isDone()).to.be.true();
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.equal({
                data: bitbucketData,
                statusCode: 200
            });

            done();
        });
    });

    [{
        case: 'no id',
        url: `/bjproxy/notification?PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
    }, {
        case: 'no version',
        url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
    }, {
        case: 'no branch',
        url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
    }, {
        case: 'no project',
        url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
    }, {
        case: 'no repo',
        url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`
    }, {
        case: 'no reviewers',
        url: `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${key}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}`
    }].forEach((testCase) => {

        lab.test(`it returns 400 (Bad Request) when PR data incomplete URL: ${testCase.case}`, (done) => {

            request.url = testCase.url;

            server.inject(request, (response) => {

                Code.expect(jiraMock.isDone()).to.be.false();
                Code.expect(bitbucketMock.isDone()).to.be.false();
                Code.expect(response.statusCode).to.equal(400);

                done();
            });
        });
    });


    [{
        code: 500,
        data: {
            msg: 'error'
        }
    }, {
        code: 500,
        data: {}
    }].forEach((testCase) => {

        lab.test('it returns 400 (Bad Request) when Jira could not be found', (done) => {

            request.url = `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${'HA-1'}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`;
            jiraMock = Nock('https://' + Config.get('/jira/host') + ':' + Config.get('/jira/port'))
                .get(`/rest/api/2/issue/${'HA-1'}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`)
                .basicAuth({
                    user: Config.get('/jira/user'),
                    pass: Config.get('/jira/pass')
                })
                .reply(testCase.code, testCase.data)
                .log(console.log);

            server.inject(request, (response) => {

                Code.expect(jiraMock.isDone()).to.be.true();
                Code.expect(bitbucketMock.isDone()).to.be.false();
                Code.expect(response.statusCode).to.equal(400);

                done();
            });
        });
    });

    lab.test('it returns 400 (Bad Request) when Jira server responds with error', (done) => {

        request.url = `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${'HA-1'}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`;
        jiraMock = Nock('https://' + Config.get('/jira/host') + ':' + Config.get('/jira/port'))
            .get(`/rest/api/2/issue/${'HA-1'}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`)
            .basicAuth({
                user: Config.get('/jira/user'),
                pass: Config.get('/jira/pass')
            })
            .replyWithError('something awful happened')
            .log(console.log);

        server.inject(request, (response) => {

            Code.expect(jiraMock.isDone()).to.be.true();
            Code.expect(bitbucketMock.isDone()).to.be.false();
            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });
});
