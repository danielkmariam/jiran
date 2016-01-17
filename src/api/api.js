class Api {
  constructor (JiraClient, Jql) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
    this.jql = Jql
  }

  getUser () {
    return this.client
      .get('/myself')
      .then((response) => {
        return {
          key: response.key,
          name: response.displayName,
          email: response.emailAddress
        }
      })
      .catch((error) => {
        throw new Error(error.message)
      })
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
    let url = '/issue/' + key + '/worklog'
    let body = {'timeSpent': timeSpent, 'comment': comment}
    return this.client
      .post(url, body)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  }

  transitionIssue (key, toStatus) {
    let url = '/issue/' + key + '/transitions'

    return this.client
      .get(url)
      .then((response) => {
        response.transitions.map((transition) => {
          if (transition.to.name.toLowerCase().search(toStatus) !== -1) {
            return this.transition(url, transition.id)
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
