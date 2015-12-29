var url = require('url')

class Client {
  constructor (Config) {
    if (!this.hasValidConfig(Config)) {
      throw new Error('Missing Config attribute')
    }

    this.username = Config.username
    this.password = Config.password
    this.apiVersion = Config.apiVersion
    this.protocol = Config.protocol
    this.host = Config.host
    this.port = Config.port
  }

  hasValidConfig (Config) {
    let keys = [
      'username',
      'password',
      'protocol',
      'host',
      'port',
      'apiVersion'
    ]

    return keys.every((key) => { return Config.hasOwnProperty(key) })
  }

  buildUrl (pathname, apiVersion = this.apiVersion, basePath = 'rest/api/') {
    return url.format({
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      pathname: basePath + apiVersion + pathname
    })
  }
}

module.exports = Client
