const program = require('commander')

const TableRenderer = require('../util/table_renderer')
const DateHelper = require('../util/date_helper')
const Logger = require('../util/logger').createLoggerWith(TableRenderer)
const Config = require('../cli/config').createConfigWith('config.json')
const ConfigPrompt = require('../cli/config_prompt')
const Jql = require('../api/jql')
const JiraClient = require('../api/client').createClientWith(Config.detail())
const JiraApi = require('../api/api').createApiWith(JiraClient, Jql.create())
const JiraCli = require('../cli/cli').createCliWith(JiraApi, TableRenderer, Logger, DateHelper)

const currentConfig = Config.detail()

program
  .version('1.0.0')

program
  .command('config')
  .description('Create account configuration')
  .option('-v, --view', 'view saved jira configuration', false)
  .option('-p, --project <key>', 'save default project to config')
  .option('-r, --rm_project', 'remove default project form config', false)
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
      Config.saveDefaultProject(options.project)
      Logger.success('Project \'' + options.project + '\' is saved as default')
    } else if (options.rm_project) {
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
  .command('log-time <issue> <time_spent>')
  .description('Log time to an issue')
  .option('-c, --comment [value]', 'comment')
  .option('-d, --date [value]', 'the date worklog will be added in \'YYYY-MM-DD\' format e.g. 2016-01-31', String)
  .action((issue, time_spent, options) => {
    JiraCli.addWorklog(issue, time_spent, options.comment, options.date)
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
  .description('View time spent on a week. Week is a single number [1, 2, 3, ...] to which how many weeks to go back')
  .action((week) => {
    JiraCli.renderDashboard(week, currentConfig)
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
