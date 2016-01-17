class Api {
  constructor (JiraClient, Jql) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
    this.jql = Jql
  }

  getIssue (key) {
    return this.client
      .get('/issue/' + key)
      .then((issue) => {
        const fields = issue.fields
        return {
          'key': issue.key,
          'type': fields.issuetype.name,
          'summary': fields.summary,
          'status': fields.status.name,
          'projectName': fields.project.name,
          'projetcKey': fields.project.key
        }
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  getIssues (options) {
    return this.client
      .get('/search?jql=' + this.jql.getQuery(options))
      .then((response) => {
        if (response.total === 0) {
          throw new Error('There are no issues for current user')
        }

        let issues = []
        response.issues.map((issue) => {
          issues.push({
            'key': issue.key,
            'status': issue.fields.status.name,
            'summary': issue.fields.summary,
            'projectKey': issue.fields.project.key
          })
        })
        return issues
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  getIssueWorklogs (key) {
    return this.client
      .get('/issue/' + key + '/worklog')
      .then((response) => {
        if (response.total === 0) {
          throw new Error('There are no worklogs for this issue')
        }
        let worklogs = []
        response.worklogs.map((worklog) => {
          worklogs.push({
            'id': worklog.id,
            'timeSpent': worklog.timeSpent,
            'comment': worklog.comment.replace(/\r?\n|\r/g, ''),
            'author': worklog.author.displayName,
            'created': worklog.created
          })
        })
        return worklogs
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  addComment (key, comment) {
    return this.client
      .post('/issue/' + key + '/comment', {'body': comment})
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  addWorklog (key, timeSpent, comment) {
    return this.client
      .post('/issue/' + key + '/worklog', {'timeSpent': timeSpent, 'comment': comment})
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  transitionIssue (key, toStatus) {
    return this.getTransitionByName(key, toStatus)
      .then((transition) => {
        if (!transition) {
          throw new Error('\'' + toStatus + '\' transition is not avilable for issue ' + key)
        }
        return this.transition('/issue/' + key + '/transitions', transition.id)
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  getTransitionByName (key, name) {
    return this.client
      .get('/issue/' + key + '/transitions')
      .then((response) => {
        return response.transitions.every((transition) => {
          if (transition.to.name.toLowerCase().search(name) !== -1) {
            return transition
          }
        })
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  transition (url, transitionId) {
    return this.client
      .post(url, {'transition': {'id': transitionId}})
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }
}

module.exports = (JiraClient, Jql) => (new Api(JiraClient, Jql))
