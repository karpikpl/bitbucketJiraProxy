/*jshint esversion: 6, node: true*/
'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../config');


const lab = exports.lab = Lab.script();


lab.experiment('Config', () => {

    lab.test('it gets config data', (done) => {

        Code.expect(Config.get('/')).to.be.an.object();
        done();
    });


    lab.test('it gets config meta data', (done) => {

        Code.expect(Config.meta('/')).to.match(/this file configures the proxy/i);
        done();
    });

    lab.test('it gets config data when provided file doesnt exist', (done) => {

        // Arrange
        process.argv[2] = 'somefile.json';

        // Act
        const result = Config.loadConfigSync();

        // Assert
        Code.expect(result.get('/')).to.be.an.object();
        done();
    });

    lab.test('it gets config data from provided file', (done) => {

        // Arrange
        process.argv[2] = 'test/test-configData.json';
        console.log('Process argv' + process.argv);

        // Act
        const result = Config.loadConfigSync();

        // Assert
        Code.expect(result.get('/projectName')).to.equal('stashJiraproxyTest');
        done();
    });

    lab.test('it gets config data from env variable', (done) => {

        // Arrange
        process.argv[2] = undefined;
        process.env.CONFIG = 'test/test-configData.json';
        console.log('Process argv' + process.argv);

        // Act
        const result = Config.loadConfigSync();

        // Assert
        Code.expect(result.get('/projectName')).to.equal('stashJiraproxyTest');
        done();
    });

    lab.test('it gets config from default when not parameter or config variable', (done) => {

        // Arrange
        process.argv[2] = undefined;
        process.env.CONFIG = undefined;
        console.log('Process argv' + process.argv);

        // Act
        const result = Config.loadConfigSync();

        // Assert
        Code.expect(result.get('/bitbucket/host')).to.equal('[stash-host]');
        done();
    });
});
