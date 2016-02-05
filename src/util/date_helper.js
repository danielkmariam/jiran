const moment = require('moment')

class DateHelper {
  getMoment (value) {
    return value ? moment(value) : moment()
  }

  getWorklogDate (started) {
    return this.getMoment(started).format('YYYY-MM-DD[T]hh:mm:ss.SSSZZ')
  }

  getStartOf (weekAgo) {
    return this.getDateFor(weekAgo).startOf('isoweek').format('YYYY-MM-DD')
  }

  getEndOf (weekAgo) {
    return this.getDateFor(weekAgo).endOf('isoweek').format('YYYY-MM-DD')
  }

  getWeekDaysFor (weekAgo) {
    let monday = 1
    let sunday = 7
    let currentDate = this.getDateFor(weekAgo)

    let datesInRange = []
    for (let i = monday; i <= sunday; i++) {
      datesInRange.push(currentDate.isoWeekday(i).format('YYYY-MM-DD'))
    }
    return datesInRange
  }

  getDateFor (weekAgo) {
    return moment().weekday((weekAgo * -7) + 1)
  }
}

module.exports = new DateHelper()
