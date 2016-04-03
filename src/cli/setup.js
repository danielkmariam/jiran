const fs = require('fs')
const path = require('path')
const userhome = require('user-home')

class Setup {
  constructor () {
    this.configFilename = path.resolve(__dirname, '../setup.json')
  }

  switchConfig (configFilename) {
    let setupData = JSON.parse(fs.readFileSync(this.configFilename))
    setupData.config = configFilename

    fs.writeFileSync(this.configFilename, JSON.stringify(setupData), 'utf8')
  }

  configFileExists (configFilename) {
    try {
      return fs.statSync(path.join(userhome, this.getConfigDirectory(), configFilename)).isFile()
    } catch (err) {
      return false
    }
  }

  getActiveConfig () {
    return JSON.parse(fs.readFileSync(this.configFilename)).config
  }

  getConfigDirectory () {
    return JSON.parse(fs.readFileSync(this.configFilename)).configDirectory
  }
}

module.exports = new Setup()
