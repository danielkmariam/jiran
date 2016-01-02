var Table = require('cli-table')

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
      const table = new Table({
        style: {compact: true, head: ['green']}
      })
      table.push(
        {'Key': response.key},
        {'Name': response.displayName},
        {'Email Address': response.emailAddress}
      )
      console.log(table.toString())
    })
  }

  getIssue (key, id) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey, (issue) => {
      if (issue) {
        console.log('Issue detail summary'.green)

        const fields = issue.fields
        const table = new Table({
          style: {compact: true, head: ['green']}
        })
        table.push(
          {'Key': issue.key},
          {'Issue Type': fields.issuetype.name},
          {'Summary': fields.summary},
          {'Status': fields.status.name},
          {'Project': fields.project.name + ' (' + fields.project.key + ')'}
        )
        console.log(table.toString())
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
        const table = new Table({
          head: ['Key', 'Status', 'Summary'],
          style: {compact: true, head: ['green']}
        })

        issues.issues.map((issue) => {
          table.push(
            [issue.key, issue.fields.status.name, issue.fields.summary]
          )
        })
        console.log(table.toString())
      } else {
        console.warn('There are no issues for current user'.red)
      }
    })
  }

  getIssueWorklogs (key, id) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey + '/worklog', (worklogs) => {
      if (worklogs.total > 0) {
        const table = new Table({
          head: ['Worklog Id', 'Timespent', 'Comment', 'Worklog by', 'Created'],
          style: {compact: true, head: ['green']}
        })

        worklogs.worklogs.map((worklog) => {
          table.push(
            [worklog.id, worklog.timeSpent, worklog.comment, worklog.author.displayName, worklog.created]
          )
        })
        console.log(table.toString())
      } else {
        console.warn('No time logged for this issue'.red)
      }
    })
  }
}

module.exports = (JiraClient) => (new Api(JiraClient))
