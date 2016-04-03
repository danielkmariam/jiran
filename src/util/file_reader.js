const fs = require('fs')
const path = require('path')
const userhome = require('user-home')

module.exports = {
  findConfigFiles: dir => {
    let configDirFullPath = path.join(userhome, dir)
    let fileList = []
    fs.readdirSync(configDirFullPath).forEach(file => {
      if (fs.statSync(path.join(configDirFullPath, file)).isFile()) {
        fileList.push(file)
      }
    })
    return fileList
  }
}
