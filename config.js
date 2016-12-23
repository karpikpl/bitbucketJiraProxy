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
        port: 443,
        keyRegex: 'HA-\\d+'
    }
};

const loadConfigSync = () => {

    let pathToConfig = process.argv[2] || process.env.CONFIG;

    if (pathToConfig) {
        // make absolute
        pathToConfig = Path.join(__dirname, pathToConfig);

        try {
            const data = FS.readFileSync(pathToConfig, 'utf8');
            console.log(`Loading configuration from ${pathToConfig}`);
            const parsed = JSON.parse(data);
            return new Confidence.Store(parsed);
        }
        catch (err) {
            console.error(`Error loading configuration from "${pathToConfig}" defaulting to config.js`);
        }
    }

    return new Confidence.Store(config);
};

const store = loadConfigSync();

console.log(`Using jira: ${store.get('/jira/host')}\nUsing bitbucket: ${store.get('/bitbucket/host')}`);

exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};

exports.loadConfigSync = loadConfigSync;
