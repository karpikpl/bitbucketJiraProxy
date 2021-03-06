/*jshint esversion: 6, node: true*/
'use strict';

const Proxyquire = require('proxyquire');
const Lab = require('lab');
const Code = require('code');
const Nock = require('nock');
const Config = require('../../test-config');
const Jira = Proxyquire('../../../APIs/jira/jira', {
    '../../config': {
        get: (key) => Config.get(key)
    }
});

const lab = exports.lab = Lab.script();

lab.experiment('GetJiraKeys should return jira ids', () => {

    lab.test('it returns jira key', (done) => {
        // Arrange
        const text = 'my commit with jira key HA-12 and some text';

        // Act
        const result = Jira.getJiraKeys(text);

        // Assert
        Code.expect(result).to.contain('HA-12');
        done();
    });

    lab.test('it returns jira keys when more than one', (done) => {
        // Arrange
        const text = 'my commit HA-56 with jira key HA-1 and some text';

        // Act
        const result = Jira.getJiraKeys(text);

        // Assert
        Code.expect(result).to.contain('HA-1');
        Code.expect(result).to.contain('HA-56');
        done();
    });
});

lab.experiment('getJira should return jira data using basic auth', () => {

    lab.test('it returns jira data', (done) => {
        // Arrange
        const jira = new Jira();
        const key = 'HA-567';
        const jiraData = { key };

        const jiraMock = Nock('https://' + Config.get('/jira/host') + ':' + Config.get('/jira/port'))
            .get(`/rest/api/2/issue/${key}?fields=summary,created,status,aggregateprogress,priority,issuetype,customfield_11500,customfield_11700,customfield_10008`)
            .basicAuth({
                user: Config.get('/jira/user'),
                pass: Config.get('/jira/pass')
            })
            .reply(200, jiraData)
            .log(console.log);

        // Act
        jira.getJira(key, (err, data) => {

            // Assert
            Code.expect(err).to.be.null();
            Code.expect(jiraMock.isDone()).to.be.true();
            Code.expect(data).to.be.equal({ data: jiraData, statusCode: 200 });
            done();
        });
    });
});
