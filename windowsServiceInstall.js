/*jshint esversion: 6, node: true*/
'use strict';

const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
    name:'BitBucket Jira Proxy',
    description: 'Proxy for handling events between JIRA and BitBucket',
    script: 'C:\\bitbucketjiraproxy\\server.js',
    env: {
        name: 'CONFIG',
        value: 'configSecret.json'
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {

    svc.start();
    console.log('Service started.');
});

svc.install();
