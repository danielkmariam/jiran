
class Cli {
  constructor (JiraApi, TableRenderer, Logger) {
    this.api = JiraApi
    this.tableRenderer = TableRenderer
    this.logger = Logger
  }

  renderUser () {
    return this.api
      .getUser()
      .then((user) => {
        this.tableRenderer.renderTitle('Current user detail')
        this.tableRenderer.renderVertical([
          {'Key': user.key},
          {'Name': user.name},
          {'Email Address': user.email}
        ])
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  renderIssue (options) {
    return this.api
      .getIssue((options.key || options.id))
      .then((issue) => {
        this.tableRenderer.renderTitle('Issue detail summary')
        this.tableRenderer.renderVertical([
          {'Key': issue.key},
          {'Issue Type': issue.type},
          {'Summary': issue.summary},
          {'Status': issue.status},
          {'Project': issue.projectName + ' (' + issue.projectKey + ')'}
        ])
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  renderIssueWorklogs (options) {
    return this.api
      .getIssueWorklogs(options)
      .then((worklogs) => {
        if (worklogs.length > 0) {
          let head = ['Worklog Id', 'Timespent', 'Comment', 'Author', 'Created']
          let rows = []
          worklogs.map((worklog) => {
            rows.push([
              worklog.id,
              worklog.timeSpent,
              worklog.comment,
              worklog.author,
              worklog.created
            ])
          })
          this.tableRenderer.render(head, rows)
        } else {
          this.logger.warn('There are no worklogs for this issue')
        }
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }
}

module.exports = (JiraApi, TableRenderer, Logger) => (new Cli(JiraApi, TableRenderer, Logger))
