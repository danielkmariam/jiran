var colors = require('colors')

class Logger {
  success (message) {
    console.log(colors.green(message))
  }
  warn (message) {
    console.log(colors.yellow(message))
  }

  error (message) {
    console.log(colors.red(message))
  }
}

module.exports = new Logger()
