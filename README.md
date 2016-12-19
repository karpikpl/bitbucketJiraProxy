# stashJiraproxy

Proxy between Jira and Stash (Bitbucket Server)
It gets notification from Stash (Bitbucket Server), parses it for Jira id, gets Jira data and updates Pull Request title.


## Usage

This requires https://github.com/tomasbjerre/pull-request-notifier-for-bitbucket to be configured with:
* PULL_REQUEST_ID
* PULL_REQUEST_VERSION
* PULL_REQUEST_FROM_BRANCH
* PULL_REQUEST_FROM_REPO_PROJECT_KEY
* PULL_REQUEST_FROM_REPO_SLUG

and point to this proxy
```
/bjproxy/notification
```

this will trigger a call to JIRA configured in `config.js` followed by a call to bitbucket server (also defined in `config.js`) which updates the PR title using `[P${jiraPriority}] ${jiraKeys[0]} ${jiraTitle}` pattern.

## License

MIT
