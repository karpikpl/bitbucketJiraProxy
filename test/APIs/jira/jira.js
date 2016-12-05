/*jshint esversion: 6, node: true*/
'use strict';

const Lab = require('lab');
const Code = require('code');

const Jira = require('../../../APIs/jira/jira');

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
