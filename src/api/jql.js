class Jql {
  constructor () {
    this.query = 'assignee=currentUser()'
  }

  static create () {
    return new Jql()
  }
  
  getQuery (options) {
    this.setProjectFilter(options)
    this.setStatusFilter(options)
    this.setOrderBy()

    return this.query
  }

  setProjectFilter (options) {
    if (options.project) {
      this.query += '+AND+project=' + options.project
    }
  }

  setStatusFilter (options) {
    if (this.getStatus(options).length > 0) {
      this.query += '+AND+status+in+(' + this.getStatus(options).toString() + ')'
    }
  }

  setOrderBy () {
    this.query += '+order+by+key+ASC'
  }

  getStatus (options) {
    let status = []

    if (useDefaultStatus(options)) {
      return ['\"Open\"', '\"In+Progress\"', '\"Under+Review\"']
    }

    if (options.open) {
      status.push('\"Open\"')
    }

    if (options.in_progress) {
      status.push('\"In+Progress\"')
    }

    if (options.under_review) {
      status.push('\"Under+Review\"')
    }

    if (options.resolved) {
      status.push('\"Resolved\"')
    }

    return status
  }
}

module.exports = Jql

const useDefaultStatus = (options) => {
  return !options.open && !options.in_progress && !options.under_review && !options.resolved
}
