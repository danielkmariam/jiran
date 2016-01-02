var url = require('url')
var request = require('request')

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
    this.options = {
      auth: {
        'user': this.username,
        'pass': this.password
      }
    }
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

  get (url, callback) {
    this.options.url = this.buildUrl(url)

    request.get(this.options, (error, response) => {
      if (error || response.statusCode !== 200) {
        return callback(error)
      }
      return callback(JSON.parse(response.body))
    })
  }
}

module.exports = (Config) => (new Client(Config))
