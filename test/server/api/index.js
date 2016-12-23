/*jshint esversion: 6, node: true*/
'use strict';

const Proxyquire = require('proxyquire').noPreserveCache();
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const ConfigMockData = {
    '/port/web': 9090
};
const ConfigMock = {

    get(key) {

        return ConfigMockData[key];
    }
};
let jiraData;
let bitbucketData;
const BitbucketMock = {
    updatePR(pr, callback) {

        return callback(null, {
            data: bitbucketData,
            statusCode: 200
        });
    }
};
const JiraMock = {
    getJira(key, callback) {

        return callback(null, {
            data: jiraData,
            statusCode: 200
        });
    }
};
const IndexPlugin = Proxyquire('../../../server/api/index', {
    '../../APIs/bitbucket/bitbucket': function Bitbucket() {

        return BitbucketMock;
    },
    '../../APIs/jira/jira': function JIRA() {

        return JiraMock;
    },
    '../../config': ConfigMock
});

const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [IndexPlugin];
    server = new Hapi.Server();
    server.connection({
        port: 9090
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

    let bitbucketRequestData;
    const project = 'PROJECT_1';
    const repository = 'rep_1';
    const prId = 502;
    const version = 99;
    const key = 'HA-8714';
    const reviewers = 'reviewer1,user';
    jiraData = {
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
    bitbucketData = {
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

        done();
    });


    lab.test('it updates PR with Jira title', (done) => {

        server.inject(request, (response) => {

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
            JiraMock.getJira = (_, callback) => {

                return callback(null, {
                    data: testCase.data,
                    statusCode: testCase.code
                });
            };

            server.inject(request, (response) => {

                Code.expect(response.statusCode).to.equal(400);

                done();
            });
        });
    });

    lab.test('it returns 400 (Bad Request) when Jira server responds with error', (done) => {

        request.url = `/bjproxy/notification?PULL_REQUEST_ID=${prId}&PULL_REQUEST_VERSION=${version}&PULL_REQUEST_FROM_BRANCH=refs/heads/bugfix/${'HA-1'}-styling-for-accordion-for-related2&PULL_REQUEST_FROM_REPO_PROJECT_KEY=${project}&PULL_REQUEST_FROM_REPO_SLUG=${repository}&PULL_REQUEST_REVIEWERS_SLUG=${reviewers}`;

        JiraMock.getJira = (_, callback) => {

            return callback('something awful happened');
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });
});
