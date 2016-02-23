const prompt = require('prompt')
const DAILY_HOURS = '7.5'
const MAX_RESULTS = 20

class ConfigPrompt {
  constructor (Config) {
    this.config = Config

    this.schema = {
      properties: {
        username: {
          description: 'Username:'.green,
          required: true
        },
        password: {
          description: 'Password:'.green,
          hidden: true,
          required: true
        },
        host: {
          description: 'Host:'.green,
          required: true
        },
        protocol: {
          description: 'Protocol:'.green,
          default: 'https'
        },
        port: {
          description: 'Port [optional]:'.green,
          default: '80'
        },
        apiVersion: {
          description: 'Api version:'.green,
          default: '2'
        },
        project: {
          description: 'Default project [optional]:'.green
        },
        daily_hours: {
          description: 'Default daily hours [optional]:'.green,
          default: DAILY_HOURS
        },
        max_results: {
          description: 'Maximum query result [optional]:'.green,
          default: MAX_RESULTS
        }
      }
    }
  }

  static createPromptWith (Config) {
    return new ConfigPrompt(Config)
  }

  create () {
    prompt.start()
    prompt.message = ''
    prompt.delimiter = ''

    prompt.get(this.schema, (err, configData, callback) => {
      if (err) callback(false)

      this.config.save(configData)
    })
  }

  edit () {
    prompt.start()
    prompt.message = ''
    prompt.delimiter = ''

    const data = this.config.detail()

    const schema = this.schema
    schema.properties.username.default = data.username
    schema.properties.host.default = data.host
    schema.properties.protocol.default = data.protocol
    schema.properties.port.default = data.port
    schema.properties.apiVersion.default = data.apiVersion
    schema.properties.project.default = data.project
    schema.properties.daily_hours.default = data.daily_hours || DAILY_HOURS
    schema.properties.max_results.default = data.max_results || MAX_RESULTS

    prompt.get(schema, (err, configData, callback) => {
      if (err) callback(false)

      this.config.save(configData)
    })
  }
}

module.exports = ConfigPrompt

