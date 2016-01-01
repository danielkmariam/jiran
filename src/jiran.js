#!/usr/local/bin/node

var program = require('commander')
var Config = require('../lib/config')()
var JiraClient = require('../lib/api/client').getClient(Config.detail())

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
  .command('config-create')
  .description('Create jira configuration')
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

program
  .command('issue')
  .description('Show issue information')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier id', String)
  .action((key, id) => {
    JiraClient.getIssue(key, id, (response) => {
      const fields = response.fields
      console.log('======================================')
      console.log('ID:'.green, response.id)
      console.log('Key:'.green, response.key)
      console.log('Issue Type:'.green, fields.issuetype.name)
      console.log('Project:'.green, fields.project.key + '-' + fields.project.name)
      console.log('Summary:'.green, fields.summary)
      console.log('Status:'.green, fields.status.name)
    })
  })

program
  .command('worklog')
  .description('List worklogs for an issue')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier Id', String)
  .action((key, id) => {
    JiraClient.getWorklogs(key, id, (worklogs) => {
      worklogs.worklogs.map((worklog) => {
        console.log('======================================')
        console.log('ID:'.green, worklog.id)
        console.log('Comment:'.green, worklog.comment)
        console.log('Created:'.green, worklog.created)
        console.log('Updated:'.green, worklog.updated)
        console.log('Timespent:'.green, worklog.timeSpent)
        console.log('Displayname:'.green, worklog.author.displayName)
      })
    })
  })

program.parse(process.argv)
