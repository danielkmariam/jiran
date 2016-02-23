const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const userhome = require('user-home')

class Config {
  constructor (fileName) {
    this.configFilename = path.join(userhome, '.jira', '/', fileName)
  }

  static createConfigWith (filename) {
    return new Config(filename)
  }

  isSet () {
    try {
      return fs.statSync(this.configFilename).isFile()
    } catch (err) {
      return false
    }
  }

  save (configData) {
    createFolder(this.configFilename)
    fs.writeFileSync(this.configFilename, JSON.stringify(configData), 'utf8')
  }

  detail () {
    return JSON.parse(fs.readFileSync(this.configFilename))
  }

  saveDefaultProject (project) {
    let configData = this.detail()
    configData.project = project

    this.save(configData)
  }

  removeDefaultProject (project) {
    let configData = this.detail()
    configData.project = ''

    this.save(configData)
  }

  saveDailyHours (dailyHours) {
    let configData = this.detail()
    configData.daily_hours = dailyHours

    this.save(configData)
  }

  saveMaxResults (maxResults) {
    let configData = this.detail()
    configData.max_results = maxResults

    this.save(configData)
  }

}

module.exports = Config

const createFolder = (filepath) => {
  mkdirp(path.dirname(filepath), '0755', (error) => {
    if (error) console.error(error)
  })
}
