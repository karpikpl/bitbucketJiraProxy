/*jshint esversion: 6, node: true*/
'use strict';

const Confidence = require('confidence');
const FS = require('fs');
const Path = require('path');

const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the proxy.',
    projectName: 'stashJiraproxy',
    port: {
        web: {
            $filter: 'env',
            test: 9090,
            $default: 8080
        }
    },
    bitbucket: {
        user: 'usr',
        pass: 'pwd',
        host: '[stash-host]',
        port: 443
    },
    jira: {
        user: 'usr',
        pass: 'pwd',
        host: '[jira-host]',
        port: 443
    }
};

const loadConfig = function (callback) {

    let pathToConfig = process.argv[2] || process.env.CONFIG;

    if (pathToConfig) {

        // make absolute
        pathToConfig = Path.join(__dirname, pathToConfig);

        FS.readFile(pathToConfig, 'utf8', (err, data) => {

            if (err) {
                callback(err);
                return console.error(`Error loading configuration from "${pathToConfig}" defaulting to config.js`);
            }

            try {
                console.log(`Loading configuration from ${pathToConfig}`);
                const parsed = JSON.parse(data);
                return callback(null, new Confidence.Store(parsed));
            }
            catch (err2) {
                callback(err2);
                return console.error(`Error loading configuration from "${pathToConfig}" defaulting to config.js`);
            }
        });
    }

    return callback(null, new Confidence.Store(config));
};

let store;

loadConfig((err, data) => {

    if (err) {
        return console.error(err);
    }

    console.log(`Using jira: ${data.get('/jira/host')}\nUsing bitbucket: ${data.get('/bitbucket/host')}`);
    store = data;
});


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
