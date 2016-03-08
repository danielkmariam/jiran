
class Cli {
  constructor (JiraApi, TableRenderer, Logger, DateHelper) {
    this.api = JiraApi
    this.tableRenderer = TableRenderer
    this.logger = Logger
    this.dateHelper = DateHelper
  }

  static createCliWith (JiraApi, TableRenderer, Logger, DateHelper) {
    return new Cli(JiraApi, TableRenderer, Logger, DateHelper)
  }

  renderProjects (recent) {
    return this.api
      .getProjects(recent)
      .then(projects => {
        this.tableRenderer.render(
          ['Project key', 'Short Description'],
          projects.map(project => [project.key, project.name])
        )
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  renderIssue (issue) {
    return this.api
      .getIssue(issue)
      .then(issue => {
        this.tableRenderer.renderTitle('Issue detail summary')
        this.tableRenderer.renderVertical([
          {'Key': issue.key},
          {'Issue Type': issue.type},
          {'Summary': issue.summary},
          {'Status': issue.status},
          {'Project': issue.projectName + ' (' + issue.projectKey + ')'}
        ])
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  renderIssues (project, options) {
    return this.api
      .getIssues(project, options)
      .then(issues => {
        this.tableRenderer.render(
          ['Issue key', 'Status', 'Summary'],
          issues.map(issue => [issue.key, issue.status, issue.summary])
        )
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  renderTransitions (options) {
    return this.api
      .getTransitions(options.key)
      .then(transitions => {
        this.tableRenderer.render(
          ['Id', 'Name'],
          transitions.map(transition => [transition.id, transition.name])
        )
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  transitionIssue (issue, status) {
    return this.api
      .transitionIssue(issue, status)
      .then(response => {
        this.logger.success('Issue ' + issue + ' transitioned to ' + status + ' status')
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  addComment (issue, comment) {
    return this.api
      .addComment(issue, comment)
      .then(response => {
        this.logger.success('Comment added to issue ' + issue)
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  addWorklog (issue, timeSpent, comment, started) {
    let dateStarted = this.dateHelper.getWorklogDate(started)

    return this.api
      .addWorklog(issue, timeSpent, comment, dateStarted)
      .then(response => {
        this.logger.success('Worklog ' + timeSpent + ' added to issue ' + issue)
      })
      .catch(error => { this.logger.error(error.toString()) })
  }

  renderIssueWorklogs (issue) {
    return this.api
      .getIssueWorklogs(issue)
      .then(worklogs => {
        this.tableRenderer.render(
          ['Worklog Id', 'Timespent', 'Comment', 'Author', 'Created'],
          worklogs.map(worklog => {
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
      .catch(error => { this.logger.error(error.message) })
  }

  renderDashboard (weekAgo, config) {
    const DATE_FORMAT = 'dddd, DD/MM/YYYY'
    const DAILY_HOURS = config.daily_hours || 7.5
    const fromDate = this.dateHelper.getStartOf(weekAgo)
    const toDate = this.dateHelper.getEndOf(weekAgo)
    const days = this.dateHelper.getWeekDaysFor(weekAgo)
    const formattedFromDate = this.dateHelper.getMoment(fromDate).format(DATE_FORMAT)
    const formattedToDate = this.dateHelper.getMoment(toDate).format(DATE_FORMAT)

    const defaultworklogs = Array(days.length).fill('')
    const columns = ['Issue'].concat(days)
    const totals = ['Total'.green].concat(defaultworklogs)

    let issueKeyLength = 0
    let dailyHoursInSeconds = DAILY_HOURS * 3600

    return this.api
      .getWorklogs(fromDate, toDate, config.username)
      .then(worklogs => {
        let rows = []
        worklogs.map(issueWorklogs => {
          let timeLoggedInSeconds = [issueWorklogs.key].concat(defaultworklogs)
          issueWorklogs.worklogs.map(worklog => {
            let index = columns.indexOf(worklog.started)
            let prevTimeLog = timeLoggedInSeconds[index] ? timeLoggedInSeconds[index] : 0
            let prevTotalTime = totals[index] ? totals[index] : 0

            timeLoggedInSeconds[index] = prevTimeLog + worklog.timeSpentSeconds
            totals[index] = prevTotalTime + worklog.timeSpentSeconds
          })

          issueKeyLength = issueWorklogs.key.length > issueKeyLength ? issueWorklogs.key.length : issueKeyLength

          return rows.push(changeTimeSpentToHours(timeLoggedInSeconds))
        })

        if (rows.length > 0) {
          rows.push(innerTotalLines(days, issueKeyLength))
          rows.push(changeTotalTimeSpentToHours(totals, dailyHoursInSeconds))

          this.tableRenderer.render(columns, rows)
          this.logger.log(`Total daily hours is ${DAILY_HOURS}hrs\n`)
        } else {
          this.logger.warn(`No time logged yet for week staring ${formattedFromDate} to ${formattedToDate}`)
        }
      })
      .catch(error => { this.logger.error(error.message) })
  }
}

module.exports = Cli

const changeTimeSpentToHours = (timeSpentSeconds) => {
  return timeSpentSeconds.map((timeSpent, key) => {
    return (key === 0 || timeSpent === '') ? timeSpent : (timeSpent / 3600).toFixed(2) + 'h'
  })
}

const changeTotalTimeSpentToHours = (timeSpentSeconds, dailyHoursInSeconds) => {
  return timeSpentSeconds.map((timeSpent, key) => {
    if (key === 0 || timeSpent === '') {
      return timeSpent
    }

    const timeSpentInHour = (timeSpent / 3600).toFixed(2) + 'h'
    return (timeSpent < dailyHoursInSeconds) ? timeSpentInHour.red : timeSpentInHour.green
  })
}

const innerTotalLines = (days, lineLength) => {
  return Array(days.length + 1).fill('─'.repeat(lineLength).gray)
}
