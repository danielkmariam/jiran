class Cli {
  constructor (JiraApi, TableRenderer, Logger) {
    this.api = JiraApi
    this.tableRenderer = TableRenderer
    this.logger = Logger
  }

  renderIssue (issue) {
    return this.api
      .getIssue((issue))
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

  renderIssues (options) {
    return this.api
      .getIssues(options)
      .then((issues) => {
        this.tableRenderer.render(
          ['Issue key', 'Status', 'Summary', 'Project key'],
          issues.map((issue) => {
            return [issue.key, issue.status, issue.summary, issue.projectKey]
          })
        )
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  renderTransitions (options) {
    return this.api
      .getTransitions(options.key)
      .then((transitions) => {
        this.tableRenderer.render(
          ['Id', 'Name'],
          transitions.map((transition) => {
            return [transition.id, transition.name]
          })
        )
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  transitionIssue (issue, status) {
    return this.api
      .transitionIssue(issue, status)
      .then((response) => {
        this.logger.success('Issue ' + issue + ' transitioned to ' + status + ' status')
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  addComment (issue, comment) {
    return this.api
      .addComment(issue, comment)
      .then((response) => {
        this.logger.success('Comment added to issue ' + issue)
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  addWorklog (issue, timeSpent, comment) {
    return this.api
      .addWorklog(issue, timeSpent, comment)
      .then((response) => {
        this.logger.success('Worklog ' + timeSpent + ' added to issue ' + issue)
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }

  renderIssueWorklogs (issue) {
    return this.api
      .getIssueWorklogs(issue)
      .then((worklogs) => {
        this.tableRenderer.render(
          ['Worklog Id', 'Timespent', 'Comment', 'Author', 'Created'],
          worklogs.map((worklog) => {
            return [
              worklog.id,
              worklog.timeSpent,
              worklog.comment,
              worklog.author,
              worklog.created.split('T')[0]
            ]
          })
        )
      })
      .catch((error) => {
        this.logger.error(error.message)
      })
  }
}

module.exports = (JiraApi, TableRenderer, Logger) => (new Cli(JiraApi, TableRenderer, Logger))
