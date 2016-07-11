const fs = require('fs')

class BatchTimeLog {

  getBatch (file) {
    let flatten = {'valid': [], 'invalid': []}
    for (let ticket of JSON.parse(fs.readFileSync(file, 'utf8'))) {
      if (!ticket.worklog) continue

      for (let worklog of ticket.worklog) {
        worklog.ticket = ticket.ticket

        if (ticket.ticket && worklog.time && worklog.date) {
          flatten.valid.push(worklog)
        } else {
          worklog.status = 'failed'
          worklog.message = 'Missing required value(s)'
          flatten.invalid.push(worklog)
        }
      }
    }
    return flatten
  }
}

module.exports = new BatchTimeLog()
