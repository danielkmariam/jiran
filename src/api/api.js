var TableRenderer = require('../cli/table_renderer')

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

  getIssue (options) {
    let idOrKey = options.key || options.id
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

  getIssues (options) {
    let jql = ''
    if (options && options.project) {
      jql = 'project=' + options.project + '+AND+'
    }

    jql += 'assignee=currentUser()' +
      '+AND+status+in+("Open","In+Progress","Under+Review")' +
      '+order+by+key+ASC'

    this.client.get('/search?jql=' + jql, (issues) => {
      if (issues && issues.total > 0) {
        let head = ['Issue key', 'Status', 'Summary', 'Project key', ]
        let rows = []
        issues.issues.map((issue) => {
          rows.push([issue.key, issue.fields.status.name, issue.fields.summary, issue.fields.project.key])
        })

        TableRenderer.render(head, rows)
      } else {
        console.warn('There are no issues for current user'.red)
      }
    })
  }

  getIssueWorklogs (options) {
    let idOrKey = options.key || options.id
    this.client.get('/issue/' + idOrKey + '/worklog', (worklogs) => {
      if (worklogs && worklogs.total > 0) {
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
