var colors = require('colors')

class Logger {
  warn (message) {
    console.log(colors.yellow(message))
  }

  error (message) {
    console.log(colors.red(message))
  }
}

module.exports = new Logger()
