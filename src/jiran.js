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
  .command('config')
  .description('Create jira configuration')
  .option('-s, --show <name>', 'show saved jira configuration', String)
  .action((options) => {
    if (options.show) {
      const currentConfig = Config.detail()
      TableRenderer.renderVertical([
        {'Username': currentConfig.username},
        {'Password': currentConfig.password},
        {'Host': currentConfig.host},
        {'Protocol': currentConfig.protocol},
        {'Port': currentConfig.port},
        {'Api version': currentConfig.apiVersion}
      ])
    } else {
      ConfigPrompt()
    }
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
  .option('-k, --key <name>', 'issue identifier key', String)
  .option('-i, --id <name>', 'issue identifier id', String)
  .action((options) => {
    JiraApi.getIssue(options)
  })

program
  .command('worklogs')
  .description('List worklogs for an issue')
  .option('-k, --key <name>', 'issue identifier key', String)
  .option('-i, --id <name>', 'issue identifier Id', String)
  .action((options) => {
    JiraApi.getIssueWorklogs(options)
  })

program.parse(process.argv)
