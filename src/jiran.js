#!/usr/local/bin/node

var program = require('commander')
var Config = require('../lib/config')()

var prompt = require('prompt')
var configPrompt = () => {
  prompt.start()
  prompt.message = ''
  prompt.delimiter = ''

  var schema = {
    properties: {
      username: {
        description: 'Username:'.green,
        required: true
      },
      password: {
        description: 'Password:'.green,
        hidden: true
      },
      host: {
        description: 'Host:'.green,
        required: true
      },
      protocol: {
        description: 'Protocol:'.green,
        default: 'https',
        required: true
      },
      port: {
        description: 'Port <optional>:'.green
      },
      apiVersion: {
        description: 'Api version:'.green,
        default: '2',
        required: true
      }
    }
  }

  prompt.get(schema, (err, configData, callback) => {
    if (err) callback(false)

    Config.save(configData)
  })
}

program
  .version('0.0.1')

program
  .command('config-set')
  .description('Set jira configuration for a user')
  .action(configPrompt)

program
  .command('config-show')
  .description('Show saved jira configuration')
  .action(() => {
    const currentConfig = Config.detail()

    console.log('Current user jira configuration')
    console.log('Username:'.green, currentConfig.username)
    console.log('Password:'.green, currentConfig.password)
    console.log('Host:'.green, currentConfig.host)
    console.log('Protocol:'.green, currentConfig.protocol)
    console.log('Port:'.green, currentConfig.port)
    console.log('Api version:'.green, currentConfig.apiVersion)
  })

program.parse(process.argv)
