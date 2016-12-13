/*jshint esversion: 6, node: true*/
'use strict';

return {
    'expand': 'renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations',
    'id': '31612',
    'self': 'https://atlassian.net/rest/api/2/issue/31612',
    'key': 'PN-8891',
    'fields': {
        'customfield_11700': null,
        'summary': 'On clicking start application, app directs to home page',
        'issuetype': {
            'self': 'https://atlassian.net/rest/api/2/issuetype/5',
            'id': '5',
            'description': 'The sub-task of the issue',
            'iconUrl': 'https://atlassian.net/secure/viewavatar?size=xsmall&avatarId=10316&avatarType=issuetype',
            'name': 'Sub-task',
            'subtask': true,
            'avatarId': 10316
        },
        'parent': {
            'id': '31429',
            'key': 'PN-8859',
            'self': 'https://atlassian.net/rest/api/2/issue/31429',
            'fields': {
                'summary': 'Paperbased flow - setting application state to completed',
                'status': {
                    'self': 'https://atlassian.net/rest/api/2/status/10600',
                    'description': '',
                    'iconUrl': 'https://atlassian.net/images/icons/statuses/generic.png',
                    'name': 'PO Review',
                    'id': '10600',
                    'statusCategory': {
                        'self': 'https://atlassian.net/rest/api/2/statuscategory/4',
                        'id': 4,
                        'key': 'indeterminate',
                        'colorName': 'yellow',
                        'name': 'In Progress'
                    }
                },
                'priority': {
                    'self': 'https://atlassian.net/rest/api/2/priority/1',
                    'iconUrl': 'https://atlassian.net/images/icons/priorities/highest.svg',
                    'name': 'Highest',
                    'id': '1'
                },
                'issuetype': {
                    'self': 'https://atlassian.net/rest/api/2/issuetype/10001',
                    'id': '10001',
                    'description': 'A user story. Created by JIRA Software - do not edit or delete.',
                    'iconUrl': 'https://atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype',
                    'name': 'Story',
                    'subtask': false,
                    'avatarId': 10315
                }
            }
        },
        'customfield_10008': null,
        'created': '2016-12-01T12:32:06.868-0500',
        'aggregateprogress': {
            'progress': 28800,
            'total': 28800,
            'percent': 100
        },
        'priority': {
            'self': 'https://atlassian.net/rest/api/2/priority/3',
            'iconUrl': 'https://atlassian.net/images/icons/priorities/medium.svg',
            'name': 'Medium',
            'id': '3'
        },
        'customfield_11500': null,
        'status': {
            'self': 'https://atlassian.net/rest/api/2/status/10004',
            'description': 'Stories in this status have been deployed to QA',
            'iconUrl': 'https://atlassian.net/images/icons/statuses/generic.png',
            'name': 'Dev Complete',
            'id': '10004',
            'statusCategory': {
                'self': 'https://atlassian.net/rest/api/2/statuscategory/3',
                'id': 3,
                'key': 'done',
                'colorName': 'green',
                'name': 'Done'
            }
        }
    }
};
