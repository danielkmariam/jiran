var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var userhome = require('user-home')

class Config {
  constructor (fileName = 'config.json') {
    this.configFilename = path.join(userhome, '.jira', '/', fileName)
    this.createFolder()
  }

  isSet () {
    try {
      return fs.statSync(this.configFilename).isFile()
    } catch (err) {
      return false
    }
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
    return JSON.parse(fs.readFileSync(this.configFilename))
  }

  setDefaultProject (project) {
    let configData = this.detail()
    configData.project = project

    this.save(configData)
  }

  removeDefaultProject (project) {
    let configData = this.detail()
    configData.project = ''

    this.save(configData)
  }
}

module.exports = (filenName) => (new Config(filenName))
