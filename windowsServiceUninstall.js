/*jshint esversion: 6, node: true*/
'use strict';

const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
    name:'BitBucket Jira Proxy',
    description: 'Proxy for handling events between JIRA and BitBucket',
    script: 'C:\\bitbucketjiraproxy\\server.js'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', () => {

    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();
