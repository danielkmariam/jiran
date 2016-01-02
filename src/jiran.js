#!/usr/local/bin/node

var program = require('commander')
var Table = require('cli-table')
var Config = require('../lib/config')()
var JiraClient = require('../lib/api/client')(Config.detail())
var JiraApi = require('../lib/api/api')(JiraClient)

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
    const table = new Table({
      style: {compact: true, head: ['green']}
    })
    table.push(
      {'Username': currentConfig.username},
      {'Password': currentConfig.password},
      {'Host': currentConfig.host},
      {'Protocol': currentConfig.protocol},
      {'Port': currentConfig.port},
      {'Api version': currentConfig.apiVersion}
    )
    console.log(table.toString())
  })

program
  .command('user')
  .description('Show current user information')
  .action(() => {
    JiraApi.getUser()
  })

program
  .command('issues')
  .description('List current user issues')
  .action(() => {
    JiraApi.getIssues()
  })

program
  .command('issue')
  .description('Show issue information')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier id', String)
  .action((key, id) => {
    JiraApi.getIssue(key, id)
  })

program
  .command('worklog')
  .description('List worklogs for an issue')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier Id', String)
  .action((key, id) => {
    JiraApi.getIssueWorklogs(key, id)
  })

program.parse(process.argv)
