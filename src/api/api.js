var TableRenderer = require('../cli/table_renderer')
var colors = require('colors')

class Api {
  constructor (JiraClient) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
  }

  getUser () {
    this.client
      .get('/myself')
      .then((response) => {
        TableRenderer.renderTitle('Current user detail')
        TableRenderer.renderVertical([
          {'Key': response.key},
          {'Name': response.displayName},
          {'Email Address': response.emailAddress}
        ])
      })
      .catch((error) => {
        console.log(colors.red('%s: %s'), error.statusCode, error.body..errorMessages[0])
      })
  }

  getIssue (options) {
    let idOrKey = options.key || options.id

    this.client
      .get('/issue/' + idOrKey)
      .then((issue) => {
        const fields = issue.fields
        TableRenderer.renderTitle('Issue detail summary')
        TableRenderer.renderVertical([
          {'Key': issue.key},
          {'Issue Type': fields.issuetype.name},
          {'Summary': fields.summary},
          {'Status': fields.status.name},
          {'Project': fields.project.name + ' (' + fields.project.key + ')'}
        ])
      })
      .catch((error) => {
        console.log(colors.red('%s: %s'), error.statusCode, error.body.errorMessages[0])
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

    this.client
      .get('/search?jql=' + jql)
      .then((issues) => {
        if (issues.total > 0) {
          let head = ['Issue key', 'Status', 'Summary', 'Project key']
          let rows = []
          issues.issues.map((issue) => {
            rows.push([issue.key, issue.fields.status.name, issue.fields.summary, issue.fields.project.key])
          })

          TableRenderer.render(head, rows)
        } else {
          console.warn(colors.red('There are no issues for current user'))
        }
      })
      .catch((error) => {
        console.log(colors.red('%s: %s'), error.statusCode, error.body.errorMessages[0])
      })
  }

  getIssueWorklogs (options) {
    let idOrKey = options.key || options.id

    this.client
      .get('/issue/' + idOrKey + '/worklog')
      .then((worklogs) => {
        if (worklogs.total > 0) {
          let head = ['Worklog Id', 'Timespent', 'Comment', 'Worklog by', 'Created']
          let rows = []
          worklogs.worklogs.map((worklog) => {
            rows.push([worklog.id, worklog.timeSpent, worklog.comment, worklog.author.displayName, worklog.created])
          })
          TableRenderer.render(head, rows)
        } else {
          console.warn('No time logged for this issue'.red)
        }
      })
      .catch((error) => {
        console.log(colors.red('%s: %s'), error.statusCode, error.body.errorMessages[0])
      })
  }
}

module.exports = (JiraClient) => (new Api(JiraClient))
