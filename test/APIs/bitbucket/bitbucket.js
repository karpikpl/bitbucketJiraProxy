/*jshint esversion: 6, node: true*/
'use strict';

const Proxyquire = require('proxyquire');
const Lab = require('lab');
const Code = require('code');
const Nock = require('nock');
const Config = require('../../test-config');
const Bitbucket = Proxyquire('../../../APIs/bitbucket/bitbucket', {
    '../../config': {
        get: (key) => Config.get(key)
    }
});

const lab = exports.lab = Lab.script();
let bitbucketClient;
let bitbucketMock;
const prId = 25;
const project = 'PROJECT_1';
const repository = 'rep_1';
const bitbucketData = {
    id: prId,
    'version': 23,
    'title': 'FIX: Contract Start Date Error not disappearing when modifies:',
    'description': '- contract start date to invalid\r\n - then clicks X button'
};

lab.beforeEach((done) => {

    bitbucketClient = new Bitbucket(project, repository);
    done();
});

lab.experiment('bitbucket', () => {

    lab.test('getPr returns pull request data', (done) => {

        // Arrange
        bitbucketMock = Nock('https://' + Config.get('/bitbucket/host') + ':' + Config.get('/bitbucket/port'))
            .get(`/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests/${prId}`)
            .basicAuth({
                user: Config.get('/bitbucket/user'),
                pass: Config.get('/bitbucket/pass')
            })
            .reply(200, bitbucketData)
            .log(console.log);

        // Act
        bitbucketClient.getPR(prId, project, repository, (err, data) => {

            // Assert
            Code.expect(err).to.be.null();
            Code.expect(bitbucketMock.isDone()).to.be.true();
            Code.expect(JSON.parse(data)).to.be.equal(bitbucketData);
            done();
        });
    });

    lab.test('updatePR should update title on the PR', (done) => {
        // Arrange
        const newTitle = 'new title';
        const version = 99;
        bitbucketMock = Nock('https://' + Config.get('/bitbucket/host') + ':' + Config.get('/bitbucket/port'), {
            id: prId,
            title: newTitle,
            version
        })
            .put(`/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests/${prId}`)
            .basicAuth({
                user: Config.get('/bitbucket/user'),
                pass: Config.get('/bitbucket/pass')
            })
            .reply(200, bitbucketData)
            .log(console.log);

        // Act
        bitbucketClient.updatePR({
            id: prId,
            version,
            project,
            repository,
            title: newTitle
        }, (err, data) => {

            // Assert
            Code.expect(err).to.be.null();
            Code.expect(bitbucketMock.isDone()).to.be.true();
            Code.expect(JSON.parse(data)).to.be.equal(bitbucketData);
            done();
        });
    });
});
