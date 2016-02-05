const colors = require('colors')

class Logger {
  constructor (TableRenderer) {
    this.tableRenderer = TableRenderer
  }

  static createLoggerWith (TableRenderer) {
    return new Logger(TableRenderer)
  }

  success (message) {
    this.tableRenderer.renderCell([colors.green(message)])
  }

  warn (message) {
    this.tableRenderer.renderCell([colors.yellow(message)])
  }

  error (message) {
    this.tableRenderer.renderCell([colors.red(message)])
  }
}

module.exports = Logger
