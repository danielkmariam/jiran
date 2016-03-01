class Api {
  constructor (Client, Jql) {
    if (!Client) {
      throw new Error('Client is not set')
    }
    this.client = Client
    this.jql = Jql
  }

  static createApiWith (Client, Jql) {
    return new Api(Client, Jql)
  }

  getProjects (recent) {
    return this.client
      .get(`/project/?recent=${recent}`)
      .then((projects) => {
        return projects
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

  getIssues (project, options) {
    return this.client
      .get(`/search?jql=${this.jql.getQuery(project, options)}&maxResults=${this.client.maxResult}`)
      .then((response) => {
        if (response.total === 0) {
          throw new Error('There are no issues for current user')
        }

        let issues = []
        response.issues.map((issue) => {
          issues.push({
            'key': issue.key,
            'status': issue.fields.status.name,
            'summary': issue.fields.summary
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
        return response.worklogs.map((worklog) => {
          return {
            'id': worklog.id,
            'timeSpent': worklog.timeSpent,
            'timeSpentSeconds': worklog.timeSpentSeconds,
            'comment': worklog.comment.replace(/\r?\n|\r/g, ''),
            'authorName': worklog.author.name,
            'author': worklog.author.displayName,
            'created': worklog.created,
            'started': worklog.started
          }
        })
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

  addWorklog (key, timeSpent, comment, started) {
    let data = {
      'timeSpent': timeSpent,
      'comment': comment,
      'started': started
    }

    return this.client
      .post(`/issue/${key}/worklog`, data)
      .then(response => response)
      .catch(error => { throw new Error(error.message) })
  }

  transitionIssue (key, toStatus) {
    return this.getTransitionByName(key, toStatus)
      .then(transition => {
        if (transition.length === 0 || !transition[0].id) {
          throw new Error(`Either the issue is already on '${toStatus}' or the transition is not avilable for issue ${key}`)
        }
        return this.transition(key, transition[0].id)
      })
      .catch(error => { throw new Error(error.message) })
  }

  getTransitions (key) {
    return this.client
      .get(`/issue/${key}/transitions`)
      .then(transitions => transitions)
      .catch(error => { throw new Error(error.message) })
  }

  getTransitionByName (key, name) {
    return this.getTransitions(key)
      .then(transitions => {
        return transitions.transitions.filter(transition => {
          return transition.to.name.toLowerCase().search(name) !== -1
        })
      })
      .catch(error => { throw new Error(error.message) })
  }

  transition (key, transitionId) {
    return this.client
      .post(`/issue/${key}/transitions`, { 'transition': {'id': transitionId} })
      .then(response => response)
      .catch(error => { throw new Error(error.message) })
  }

  getWorklogs (fromDate, toDate, assignee) {
    let jql = 'worklogAuthor=' + assignee + '+AND+worklogDate>=' + fromDate + '+AND+worklogDate<=' + toDate

    return this.client
      .get('/search?jql=' + jql)
      .then((issuesWithworklogs) => {
        const promises = issuesWithworklogs.issues.map((issue) => {
          let issues = {
            key: issue.key,
            worklogs: []
          }

          return this.client
            .get('/issue/' + issue.key + '/worklog')
            .then((response) => {
              for (let worklog of response.worklogs) {
                let started = worklog.started.split('T')[0]
                if (isAssigneeTimeLog(worklog, assignee) && dateLoggedIsInRange(fromDate, toDate, started)) {
                  issues.worklogs.push({
                    'key': issue.key,
                    'timeSpent': worklog.timeSpent,
                    'timeSpentSeconds': worklog.timeSpentSeconds,
                    'started': started
                  })
                }
              }
              return issues
            })
        })
        return Promise.all(promises)
      })
  }
}

module.exports = Api

const isAssigneeTimeLog = (worklog, assignee) => {
  return worklog.author.name === assignee
}

const dateLoggedIsInRange = (fromDate, toDate, started) => {
  return started >= fromDate && started < toDate
}

