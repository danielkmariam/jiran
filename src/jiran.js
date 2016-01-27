#!/usr/bin/env node

var program = require('commander')
var TableRenderer = require('../lib/util/table_renderer')
var Logger = require('../lib/util/logger')(TableRenderer)
var DateHelper = require('../lib/util/date_helper')
var Config = require('../lib/cli/config')()
var ConfigPrompt = require('../lib/cli/config_prompt')

var Jql = require('../lib/api/jql')
var JiraClient = require('../lib/api/client')(Config.detail())
var JiraApi = require('../lib/api/api')(JiraClient, Jql())
var JiraCli = require('../lib/cli/cli')(JiraApi, TableRenderer, Logger, DateHelper)

const currentConfig = Config.detail()

program
  .version('1.0.0')

program
  .command('config')
  .description('Create account configuration')
  .option('-v, --view', 'view saved jira configuration', false)
  .option('-p, --project <key>', 'save default project')
  .option('-r, --rm_project', 'remove default project', false)
  .action((options) => {
    if (options.view) {
      TableRenderer.renderVertical([
        {'Username': currentConfig.username},
        {'Password': currentConfig.password},
        {'Host': currentConfig.host},
        {'Protocol': currentConfig.protocol},
        {'Port': currentConfig.port},
        {'Api version': currentConfig.apiVersion},
        {'Default project': currentConfig.project}
      ])
    } else if (options.project) {
      Config.setDefaultProject(options.project)
      Logger.success('Default project is saved')
    } else if (options.rm_default_project) {
      Config.rmDefaultProject()
      Logger.warn('Default project is removed')
    } else {
      ConfigPrompt()
    }
  })

program
  .command('issues')
  .description('List current user issues')
  .option('-p, --project [key]', 'filter issues by project', currentConfig.project)
  .option('-o, --open', 'include open issues', false)
  .option('-i, --in_progress', 'include in-progress issues', false)
  .option('-u, --under_review', 'include under-review issues', false)
  .option('-r, --resolved', 'include resolved issues', false)
  .action((options) => {
    if (options) {
      JiraCli.renderIssues(options)
    } else {
      JiraCli.renderIssues()
    }
  })

program
  .command('view <issue>')
  .description('View issue information')
  .action((issue) => {
    JiraCli.renderIssue(issue)
  })

program
  .command('pick <issue>')
  .description('Start working on an issue')
  .action((issue) => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'in progress')
    }
  })

program
  .command('comment <issue> <comment>')
  .description('Add comment to an issue')
  .action((issue, comment) => {
    JiraCli.addComment(issue, comment)
  })

program
  .command('log-time <issue> <time_spent> [comment]')
  .description('Log time to an issue')
  .action((issue, time_spent, comment) => {
    JiraCli.addWorklog(issue, time_spent, comment)
  })

program
  .command('review <issue>')
  .description('Move an issue for dev to review')
  .action((issue) => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'under review')
    }
  })

program
  .command('qa <issue>')
  .description('Move an issue for QA to check')
  .action((issue) => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'qa')
    }
  })

program
  .command('close <issue>')
  .description('Close an issue')
  .action((issue) => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'close')
    }
  })

program
  .command('open <issue>')
  .description('Reopen an issue')
  .action((issue) => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'open')
    }
  })

program
  .command('worklogs <issue>')
  .description('List worklogs for an issue')
  .action((issue) => {
    JiraCli.renderIssueWorklogs(issue)
  })

program
  .command('dashboard [week]')
  .description('View time spent over a week period, default to the current week')
  .action((week) => {
    JiraCli.renderDashboard(week, currentConfig.username)
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}

