var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var userhome = require('user-home')

class Config {
  constructor (fileName = 'config.json') {
    this.configFilename = path.join(userhome, '.jira', '/', fileName)
    this.createFolder()
  }

  createFolder () {
    mkdirp(path.dirname(this.configFilename), '0755', (error) => {
      if (error) console.error(error)
    })
  }

  save (configData) {
    fs.writeFileSync(this.configFilename, JSON.stringify(configData), 'utf8')
  }

  detail () {
    let configFile = fs.readFileSync(this.configFilename)
    return JSON.parse(configFile)
  }
}

module.exports = (filenName) => {
  return new Config(filenName)
}
