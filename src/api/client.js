var url = require('url')
var request = require('request')
var Issue = require('./issue')

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
    let uri = url.format({
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      pathname: basePath + apiVersion + pathname
    })

    return decodeURIComponent(uri)
  }

  makeRequest (options, callback) {
    options.auth = {
      'user': this.username,
      'pass': this.password
    }

    request(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return callback(error)
      }
      return callback(JSON.parse(body))
    })
  }

  getIssue (key, id, callback) {
    return Issue(this).getIssue(key, id, callback)
  }

  getWorklogs (key, id, callback) {
    return Issue(this).getWorklogs(key, id, callback)
  }
}

module.exports.getClient = (Config) => (new Client(Config))
