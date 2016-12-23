/*jshint esversion: 6, node: true*/
'use strict';

const Proxyquire = require('proxyquire');
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
let statusCode = 200;

const MockConfig = {};
const BitbucketMock = {};
const JiraMock = {
    getJira(key, callback) {

        return callback(null, {
            data: {
                key
            },
            statusCode
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
    '../../config': {

        get(key) {

            return MockConfig[key];
        }
    }
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

lab.experiment('Get JIRA', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/bjproxy/jira/ABC-12'
        };

        done();
    });


    lab.test('it returns jira data', (done) => {

        request.url = '/bjproxy/jira/ABC-12';

        server.inject(request, (response) => {

            Code.expect(response.result).to.equal({
                key: 'ABC-12'
            });
            Code.expect(response.statusCode).to.equal(statusCode);

            done();
        });
    });

    lab.test('it returns jira data and status from jira', (done) => {

        statusCode = 404;
        request.url = '/bjproxy/jira/ABC-12';

        server.inject(request, (response) => {

            Code.expect(response.result).to.equal({
                key: 'ABC-12'
            });
            Code.expect(response.statusCode).to.equal(statusCode);

            done();
        });
    });

    lab.test('it returns error when jira call fails', (done) => {

        request.url = '/bjproxy/jira/ABC-12';
        JiraMock.getJira = (key, callback) => {

            return callback('very big error');
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });

    lab.test('it returns Unauthorized when apiKey doesnt match', (done) => {

        request.url = '/bjproxy/jira/ABC-12';
        MockConfig['/apiKey'] = 'my-123-key';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(401);

            done();
        });
    });
});
