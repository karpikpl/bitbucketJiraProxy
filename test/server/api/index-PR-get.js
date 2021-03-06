/*jshint esversion: 6, node: true*/
'use strict';

const Proxyquire = require('proxyquire').noPreserveCache();
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
let statusCode = 200;

const MockConfig = {};
const BitbucketMock = {
    getPR(id, project, repository, callback) {

        return callback(null, {
            data: {
                id,
                project,
                repository
            },
            statusCode
        });
    }
};
const JiraMock = {};
const ConfigMock = {

    get(key) {

        return MockConfig[key];
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

lab.experiment('Get PR', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/bjproxy/pullRequest/5'
        };

        done();
    });


    lab.test('it returns the pull request data for harmony when only id provided', (done) => {

        request.url = '/bjproxy/pullRequest/5';

        server.inject(request, (response) => {

            Code.expect(response.result).to.equal({
                id: '5',
                project: 'EN',
                repository: 'harmony'
            });
            Code.expect(response.statusCode).to.equal(statusCode);

            done();
        });
    });

    lab.test('it returns the pull request data when apiKey matches one from config', (done) => {

        const project = 'XY';
        const repository = 'R_X';
        statusCode = 418;
        request.url = `/bjproxy/pullRequest/5?project=${project}&repository=${repository}`;

        server.inject(request, (response) => {

            Code.expect(response.result).to.equal({
                id: '5',
                project,
                repository
            });
            Code.expect(response.statusCode).to.equal(statusCode);

            done();
        });
    });

    lab.test('it returns error when bitbucket call fails', (done) => {

        request.url = '/bjproxy/pullRequest/5';
        BitbucketMock.getPR = (id, project, repository, callback) => {

            return callback('very big error');
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });

    lab.test('it returns Unauthorized when apiKey doesnt match', (done) => {

        request.url = '/bjproxy/pullRequest/5';
        MockConfig['/apiKey'] = 'my-123-key';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(401);

            done();
        });
    });
});
