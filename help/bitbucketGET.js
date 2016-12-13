/*jshint esversion: 6, node: true*/
'use strict';

return {
    'id': 435,
    'version': 23,
    'title': 'FIX: Contract Start Date Error not disappearing when modifies:',
    'description': '- contract start date to invalid\r\n - then clicks X button',
    'state': 'MERGED',
    'open': false,
    'closed': true,
    'createdDate': 1478814166027,
    'updatedDate': 1479740437127,
    'fromRef': {
        'id': 'refs/heads/bugfix/PN-8644-contract-start-date-error-not-disappearing',
        'displayId': 'bugfix/PN-8644-contract-start-date-error-not-disappearing',
        'latestCommit': 'ad8b58ebd65e8c36324e797bf5719ff8661188f9',
        'repository': {
            'slug': 'repo_1',
            'id': 143,
            'name': 'repo_1',
            'scmId': 'git',
            'state': 'AVAILABLE',
            'statusMessage': 'Available',
            'forkable': true,
            'project': {
                'key': 'PN',
                'id': 2,
                'name': 'Project Name',
                'public': false,
                'type': 'NORMAL',
                'links': {
                    'self': [{
                        'href': 'repo_1'
                    }]
                }
            },
            'public': false,
            'links': {
                'clone': [{
                    'href': 'https://user@stash.com/scm/pn/repo_1.git',
                    'name': 'http'
                }, {
                    'href': 'ssh://git@stash.com:7999/pn/repo_1.git',
                    'name': 'ssh'
                }],
                'self': [{
                    'href': 'https://stash.com/projects/pn/repos/repo_1/browse'
                }]
            }
        }
    },
    'toRef': {
        'id': 'refs/heads/release/1.2',
        'displayId': 'release/1.2',
        'latestCommit': '38ab608b75317fce171020f04e081a82d459119f',
        'repository': {
            'slug': 'repo_1',
            'id': 143,
            'name': 'repo_1',
            'scmId': 'git',
            'state': 'AVAILABLE',
            'statusMessage': 'Available',
            'forkable': true,
            'project': {
                'key': 'PN',
                'id': 2,
                'name': 'Project Name',
                'public': false,
                'type': 'NORMAL',
                'links': {
                    'self': [{
                        'href': 'https://stash.com/projects/PN'
                    }]
                }
            },
            'public': false,
            'links': {
                'clone': [{
                    'href': 'https://user@stash.com/scm/pn/repo_1.git',
                    'name': 'http'
                }, {
                    'href': 'ssh://git@stash.com:7999/pn/repo_1.git',
                    'name': 'ssh'
                }],
                'self': [{
                    'href': 'https://stash.com/projects/PN/repos/repo_1/browse'
                }]
            }
        }
    },
    'locked': false,
    'author': {
        'user': {
            'name': 'user2',
            'emailAddress': 'user2@company.com',
            'id': 4260,
            'displayName': 'User 2',
            'active': true,
            'slug': 'user2',
            'type': 'NORMAL',
            'links': {
                'self': [{
                    'href': 'https://stash.company.com/users/user2'
                }]
            }
        },
        'role': 'AUTHOR',
        'approved': false,
        'status': 'UNAPPROVED'
    },
    'reviewers': [{
        'user': {
            'name': 'qa1',
            'emailAddress': 'qa1@company.com',
            'id': 3930,
            'displayName': 'QA 1',
            'active': true,
            'slug': 'qa1',
            'type': 'NORMAL',
            'links': {
                'self': [{
                    'href': 'https://stash.company.com/users/qa1'
                }]
            }
        },
        'role': 'REVIEWER',
        'approved': false,
        'status': 'UNAPPROVED'
    }, {
        'user': {
            'name': 'lead1',
            'emailAddress': 'lead1@company.com',
            'id': 2277,
            'displayName': 'Lead 1 (Company)',
            'active': true,
            'slug': 'lead1',
            'type': 'NORMAL',
            'links': {
                'self': [{
                    'href': 'https://stash.company.com/users/lead1'
                }]
            }
        },
        'role': 'REVIEWER',
        'approved': true,
        'status': 'APPROVED'
    }, {
        'user': {
            'name': 'qa2',
            'emailAddress': 'qa2@company.com',
            'id': 4275,
            'displayName': 'QA 2',
            'active': true,
            'slug': 'qa2',
            'type': 'NORMAL',
            'links': {
                'self': [{
                    'href': 'https://stash.company.com/users/qa2'
                }]
            }
        },
        'role': 'REVIEWER',
        'approved': true,
        'status': 'APPROVED'
    }],
    'participants': [{
        'user': {
            'name': 'user',
            'emailAddress': 'user@company.com',
            'id': 2222,
            'displayName': '',
            'active': true,
            'slug': 'user',
            'type': 'NORMAL',
            'links': {
                'self': [{
                    'href': 'https://stash.company.com/users/user'
                }]
            }
        },
        'role': 'PARTICIPANT',
        'approved': false,
        'status': 'UNAPPROVED'
    }],
    'links': {
        'self': [{
            'href': 'https://stash.com/projects/PN/repos/repo_1/pull-requests/435'
        }]
    }
};
