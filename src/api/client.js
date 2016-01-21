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
      },
      json: true
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
    return keys.every((key) => (Config.hasOwnProperty(key)))
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

  get (url) {
    this.options.url = this.buildUrl(url)
    return new Promise((resolve, reject) => {
      request.get(this.options, (error, response) => {
        if (error || response.statusCode !== 200) {
          reject(new Error(response.statusCode + ' - ' + response.body.errorMessages[0]))
        } else {
          resolve(response.body)
        }
      })
    })
  }

  put (url, data) {
    this.options.url = this.buildUrl(url)
    this.options.body = data
    return new Promise((resolve, reject) => {
      request.put(this.options, (error, response) => {
        if (error || response.statusCode !== 200) {
          reject('Error')
        } else {
          resolve(response.body)
        }
      })
    })
  }

  post (url, data) {
    this.options.url = this.buildUrl(url)
    this.options.body = data

    return new Promise((resolve, reject) => {
      request.post(this.options, (error, response) => {
        if (error || response.statusCode.toString().split('')[0] !== '2') {
          reject(new Error('Error:  post failed'))
        } else {
          resolve(response.body)
        }
      })
    })
  }
}

module.exports = (Config) => (new Client(Config))
