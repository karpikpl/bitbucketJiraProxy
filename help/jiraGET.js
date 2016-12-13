/*jshint esversion: 6, node: true*/
'use strict';

return {
    'expand': 'renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations',
    'id': '30645',
    'self': 'https://atlassian.net/rest/api/2/issue/30645',
    'key': 'HA-8620',
    'fields': {
        'customfield_11700': null,
        'summary': 'Something manager mock rejects request with valid exchange rate values',
        'issuetype': {
            'self': 'https://atlassian.net/rest/api/2/issuetype/1',
            'id': '1',
            'description': 'A problem which impairs or prevents the functions of the product.',
            'iconUrl': 'https://atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
            'name': 'Bug',
            'subtask': false,
            'avatarId': 10303
        },
        'customfield_10008': 'FR-325',
        'created': '2016-11-09T14:40:28.587-0500',
        'aggregateprogress': {
            'progress': 3600,
            'total': 3600,
            'percent': 100
        },
        'priority': {
            'self': 'https://atlassian.net/rest/api/2/priority/2',
            'iconUrl': 'https://atlassian.net/images/icons/priorities/high.svg',
            'name': 'High',
            'id': '2'
        },
        'customfield_11500': null,
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
        }
    }
};
