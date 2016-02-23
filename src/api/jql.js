class Jql {
  constructor () {
    this.query = ''
  }

  static create () {
    return new Jql()
  }

  getQuery (project, options) {
    this.setAssigneeFilter(options)
    this.setProjectFilter(project)
    this.setStatusFilter(options)
    this.setOrderBy()

    return this.query
  }

  setProjectFilter (project) {
    this.query += `project=${project}`
  }

  setAssigneeFilter (options) {
    if (options.assignee) {
      this.query += `assignee=currentUser() AND `
    }
  }

  setStatusFilter (options) {
    let defaultStatuses = [`"Open"`]
    if (options.assignee && useDefaultStatus(options)) {
      defaultStatuses = [`"Open"`, `"In Progress"`, `"Under Review"`]
    } else if (this.getStatus(options).length > 0) {
      defaultStatuses = this.getStatus(options)
    }

    this.query += ` AND status in (${defaultStatuses.toString()})`
  }

  setOrderBy () {
    this.query += ` order by priority desc`
  }

  getStatus (options) {
    let status = []

    if (options.open) {
      status.push(`"Open"`)
    }

    if (options.in_progress) {
      status.push(`"In Progress"`)
    }

    if (options.under_review) {
      status.push(`"Under Review"`)
    }

    if (options.resolved) {
      status.push(`"Resolved"`)
    }

    return status
  }
}

module.exports = Jql

const useDefaultStatus = (options) => {
  return !options.open && !options.in_progress && !options.under_review && !options.resolved
}
