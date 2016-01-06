class Api {
  constructor (JiraClient, TableRenderer, Logger) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
    this.tableRenderer = TableRenderer
    this.logger = Logger
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
        throw new Error(error.statusCode + ' - ' + error.body.message)
      })
  }

  getIssue (options) {
    return this.client
      .get('/issue/' + (options.key || options.id))
      .then((issue) => {
        const fields = issue.fields

        this.tableRenderer.renderTitle('Issue detail summary')
        this.tableRenderer.renderVertical([
          {'Key': issue.key},
          {'Issue Type': fields.issuetype.name},
          {'Summary': fields.summary},
          {'Status': fields.status.name},
          {'Project': fields.project.name + ' (' + fields.project.key + ')'}
        ])
      })
      .catch((error) => {
        this.logger.error(error.statusCode + ': ' + error.body.errorMessages[0])
      })
  }

  getIssues (options) {
    let jql = ''
    if (options && options.project) {
      jql = 'project=' + options.project + '+AND+'
    }

    jql += 'assignee=currentUser()' +
      '+AND+status+in+("Open","In+Progress","Under+Review")' +
      '+order+by+key+ASC'

    return this.client
      .get('/search?jql=' + jql)
      .then((response) => {
        if (response.total > 0) {
          let head = ['Issue key', 'Status', 'Summary', 'Project key']
          let rows = []
          response.issues.map((issue) => {
            rows.push([issue.key, issue.fields.status.name, issue.fields.summary, issue.fields.project.key])
          })
          this.tableRenderer.render(head, rows)
        } else {
          this.logger.warn('There are no issues for current user')
        }
      })
      .catch((error) => {
        this.logger.error(error.statusCode + ': ' + error.body.errorMessages[0])
      })
  }

  getIssueWorklogs (options) {
    return this.client
      .get('/issue/' + (options.key || options.id) + '/worklog')
      .then((response) => {
        if (response.total > 0) {
          let head = ['Worklog Id', 'Timespent', 'Comment', 'Worklog by', 'Created']
          let rows = []
          response.worklogs.map((worklog) => {
            rows.push([worklog.id, worklog.timeSpent, worklog.comment, worklog.author.displayName, worklog.created])
          })
          this.tableRenderer.render(head, rows)
        } else {
          this.logger.warn('There are no worklogs for this issue')
        }
      })
      .catch((error) => {
        this.logger.error(error.statusCode + ': ' + error.body.errorMessages[0])
      })
  }
}

module.exports = (JiraClient, TableRenderer, Logger) => (new Api(JiraClient, TableRenderer, Logger))
