#!/usr/local/bin/node

var program = require('commander')
var colors = require('colors')
var TableRenderer = require('../lib/util/table_renderer')
var Logger = require('../lib/util//logger')

var Config = require('../lib/cli/config')()
var ConfigPrompt = require('../lib/cli/config_prompt')

var Jql = require('../lib/api/jql')
var JiraClient = require('../lib/api/client')(Config.detail())
var JiraApi = require('../lib/api/api')(JiraClient, Jql())
var JiraCli = require('../lib/cli/cli')(JiraApi, TableRenderer, Logger)

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
    JiraCli.renderUser()
  })

program
  .command('issues')
  .description('List current user issues')
  .option('-p, --project <key>', 'user issues by the project', String)
  .option('-o, --open [open]', 'Open issues', false)
  .option('-i, --in_progress [progress]', 'In progress issues', false)
  .option('-u, --under_review [reviw]', 'Under review issues', false)
  .option('-r, --resolved [resolved]', 'Resolved issues', false)
  .action((options) => {
    if (options) {
      JiraCli.renderIssues(options)
    } else {
      JiraCli.renderIssues()
    }
  })

program
  .command('issue')
  .description('Show issue information')
  .option('-k, --key <name>', 'issue identifier key', String)
  .option('-i, --id <name>', 'issue identifier id', String)
  .action((options) => {
    JiraCli.renderIssue(options)
  })

program
  .command('worklogs')
  .description('List worklogs for an issue')
  .option('-k, --key <name>', 'issue identifier key', String)
  .option('-i, --id <name>', 'issue identifier Id', String)
  .action((options) => {
    JiraCli.renderIssueWorklogs(options)
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}

