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
  .option('-o, --open', 'open issues', false)
  .option('-i, --in_progress', 'in progress issues', false)
  .option('-u, --under_review', 'under review issues', false)
  .option('-r, --resolved', 'resolved issues', false)
  .option('-p, --project <key>', 'filter issues by project key', String)
  .action((options) => {
    if (options) {
      JiraCli.renderIssues(options)
    } else {
      JiraCli.renderIssues()
    }
  })

program
  .command('issue <key>')
  .description('Show issue information')
  .option('-k, --key <key>', 'issue identifier key', String)
  .action((options) => {
    JiraCli.renderIssue(options)
  })

program
  .command('pick')
  .description('Move an issue to in progress status')
  .option('-k, --key <key>', 'issue identifier key', String)
  .action((options) => {
    if (options.key) {
      JiraCli.transitionIssue(options, 'in progress')
    }
  })

program
  .command('dev-to-check')
  .description('Move an issue to dev to check status')
  .option('-k, --key <key>', 'issue identifier key', String)
  .action((options) => {
    if (options.key) {
      JiraCli.transitionIssue(options, 'under review')
    }
  })

program
  .command('close')
  .description('Move and issue to close status')
  .option('-k, --key <name>', 'issue identifier key', String)
  .action((options) => {
    if (options.key) {
      JiraCli.transitionIssue(options, 'close')
    }
  })

program
  .command('worklogs')
  .description('List worklogs for an issue')
  .option('-k, --key <key>', 'issue identifier key', String)
  .action((options) => {
    JiraCli.renderIssueWorklogs(options)
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}

