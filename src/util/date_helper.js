let moment = require('moment')

class DateHelper {

  getStartOfWeek (date) {
    return moment().startOf('isoweek').format('YYYY-MM-DD')
  }

  getEndOfWeek (date) {
    return moment().endOf('isoweek').format('YYYY-MM-DD')
  }

  getWeekDays () {
    let monday = 1
    let sunday = 7

    let datesInRange = []
    for (let i = monday; i <= sunday; i++) {
      datesInRange.push(moment().isoWeekday(i).format('YYYY-MM-DD'))
    }
    return datesInRange
  }
}

module.exports = new DateHelper()
