const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const userhome = require('user-home')
const setupConfig = require('../cli/setup')
const EncryptDecrypter = require('./encrypt_decrypter')

class Config {
  constructor (fileName) {
    this.filename = fileName
    this.configFilename = path.join(userhome, setupConfig.getConfigDirectory(), this.filename)
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
    let data = Object.assign({}, configData)
    data.password = EncryptDecrypter.encrypt(configData.password)

    createFolder(this.configFilename)
    fs.writeFileSync(this.configFilename, JSON.stringify(data), 'utf8')

    setupConfig.switchConfig(this.filename)
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
  mkdirp.sync(path.dirname(filepath), '0755', (error) => {
    if (error) console.error(error)
  })
}
