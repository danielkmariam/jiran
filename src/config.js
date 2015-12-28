var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var userhome = require('user-home')

class Config {
  constructor (fileName = 'config.json') {
    this.configDirPath = path.join(userhome, '.jira', '/')
    this.configFilePath = path.join(this.configDirPath, fileName)

    this.createFolder()
  }

  createFolder () {
    mkdirp(this.configDirPath, '0755', (error) => {
      if (error) console.error(error)
    })
  }

  save (configData) {
    fs.writeFileSync(this.configFilePath, JSON.stringify(configData), 'utf8')
  }

  detail () {
    let configFile = fs.readFileSync(this.configFilePath)
    return JSON.parse(configFile)
  }
}

module.exports = (filenName) => {
  return new Config(filenName)
}
