const url = require('url')
const request = require('request')

class Client {
  constructor (Config) {
    if (!Config || !hasValidConfig(Config)) {
      throw new Error('Missing Config attribute')
    }

    this.username = Config.username
    this.password = Config.password
    this.apiVersion = Config.apiVersion
    this.protocol = Config.protocol
    this.host = Config.host
    this.port = Config.port === '80' ? '' : Config.port
    this.maxResult = Config.max_results
    this.options = {
      auth: {
        'user': this.username,
        'pass': this.password
      },
      json: true
    }
    this.domainData = {
      protocol: this.protocol,
      hostname: this.host,
      port: this.port
    }
  }

  static createClientWith (ConfigData) {
    return new Client(ConfigData)
  }

  get (url) {
    const options = this.options
    options.url = buildUrl(this.domainData, url, this.apiVersion)

    return new Promise((resolve, reject) => {
      request.get(options, (error, response) => {
        if (error || response.statusCode !== 200) {
          reject(new Error(response.statusCode + ' - ' + response.body.errorMessages[0]))
        } else {
          resolve(response.body)
        }
      })
    })
  }

  put (url, data) {
    const options = this.options
    options.url = buildUrl(this.domainData, url, this.apiVersion)
    options.body = data

    return new Promise((resolve, reject) => {
      request.put(options, (error, response) => {
        if (error || response.statusCode !== 200) {
          reject('Error')
        } else {
          resolve(response.body)
        }
      })
    })
  }

  post (url, data) {
    const options = this.options
    options.url = buildUrl(this.domainData, url, this.apiVersion)
    options.body = data

    return new Promise((resolve, reject) => {
      request.post(options, (error, response) => {
        if (error || response.statusCode.toString().split('')[0] !== '2') {
          reject(new Error('Error:  post failed'))
        } else {
          resolve(response.body)
        }
      })
    })
  }
}

module.exports = Client

const hasValidConfig = (Config) => {
  const keys = [
    'username',
    'password',
    'protocol',
    'host',
    'port',
    'apiVersion'
  ]
  return keys.every((key) => (Config.hasOwnProperty(key)))
}

const buildUrl = (domainData, pathname, apiVersion, basePath = 'rest/api/') => {
  domainData.pathname = basePath + apiVersion + pathname
  return decodeURIComponent(url.format(domainData))
}

