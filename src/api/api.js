var Table = require('cli-table')
var TableRenderer = require('../table_renderer')

class Api {
  constructor (JiraClient) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
  }

  getUser () {
    this.client.get('/myself', (response) => {
      console.log('Current user detail'.green)

      TableRenderer.renderVertical([
        {'Key': response.key},
        {'Name': response.displayName},
        {'Email Address': response.emailAddress}
      ])
    })
  }

  getIssue (key, id) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey, (issue) => {
      if (issue) {
        const fields = issue.fields
        console.log('Issue detail summary'.green)

        TableRenderer.renderVertical([
          {'Key': issue.key},
          {'Issue Type': fields.issuetype.name},
          {'Summary': fields.summary},
          {'Status': fields.status.name},
          {'Project': fields.project.name + ' (' + fields.project.key + ')'}
        ])
      } else {
        console.warn('Can not find this issue using given key or id'.red)
      }
    })
  }

  getIssues () {
    let jql = 'assignee=currentUser()' +
      '+AND+status+in+("In+Progress","Under+Review")' +
      '+order+by+key+ASC'

    this.client.get('/search?jql=' + jql, (issues) => {
      if (issues && issues.total > 0) {
        let head = ['Key', 'Status', 'Summary']
        let rows = []
        issues.issues.map((issue) => {
          rows.push([issue.key, issue.fields.status.name, issue.fields.summary])
        })

        TableRenderer.render(head, rows)
      } else {
        console.warn('There are no issues for current user'.red)
      }
    })
  }

  getIssueWorklogs (key, id) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey + '/worklog', (worklogs) => {
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
  }
}

module.exports = (JiraClient) => (new Api(JiraClient))