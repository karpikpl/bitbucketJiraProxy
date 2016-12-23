/*jshint esversion: 6, node: true*/
'use strict';

const Confidence = require('confidence');


const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    $meta: 'This file configures the proxy.',
    projectName: 'stashJiraproxy - test config',
    port: {
        web: {
            $filter: 'env',
            test: 9090,
            $default: 8080
        }
    },
    bitbucket: {
        user: 'usr1',
        pass: 'pwd1',
        host: 'stash.host.here',
        port: 443
    },
    jira: {
        user: 'usr2',
        pass: 'pwd2',
        host: 'jira.host.here',
        port: 443,
        keyRegex: 'HA-\\d+'
    }
};


const store = new Confidence.Store(config);

exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
