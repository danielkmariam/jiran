#!/usr/local/bin/node

var program = require('commander')
var TableRenderer = require('../lib/table_renderer')
var Config = require('../lib/config')()
var ConfigPrompt = require('../lib/config_prompt')
var JiraClient = require('../lib/api/client')(Config.detail())
var JiraApi = require('../lib/api/api')(JiraClient)

program
  .version('0.0.1')

program
  .command('config-create')
  .description('Create jira configuration')
  .action(ConfigPrompt)

program
  .command('config-show')
  .description('Show saved jira configuration')
  .action(() => {
    const currentConfig = Config.detail()
    TableRenderer.renderVertical([
      {'Username': currentConfig.username},
      {'Password': currentConfig.password},
      {'Host': currentConfig.host},
      {'Protocol': currentConfig.protocol},
      {'Port': currentConfig.port},
      {'Api version': currentConfig.apiVersion}
    ])
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
