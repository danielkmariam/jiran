const program = require('commander')
const setup = require('../setup')
const setupConfig = require('../cli/setup')

const Config = require('../cli/config').createConfigWith(setupConfig.getActiveConfig())
const currentConfig = Config.detail()

const TableRenderer = require('../util/table_renderer')
const DateHelper = require('../util/date_helper')
const FileReader = require('../util/file_reader')
const Logger = require('../util/logger').createLoggerWith(TableRenderer)

const Jql = require('../api/jql')
const JiraClient = require('../api/client').createClientWith(currentConfig)
const JiraApi = require('../api/api').createApiWith(JiraClient, Jql.create())
const JiraCli = require('../cli/cli').createCliWith(JiraApi, TableRenderer, Logger, DateHelper, FileReader)
const ConfigPrompt = require('../cli/config_prompt')

program
  .version('1.2.1')

program
  .command('config')
  .description('Manage configuration')
  .option('-s, --switch_to [switch]', 'switch to different user configuration', String)
  .option('-f, --filename [filename]', 'save user configuration to a given file', String)
  .option('-l, --list [list]', 'List available config options', false)
  .option('-v, --view', 'view current configuration', false)
  .option('-e, --edit', 'edit current configuration', false)
  .option('-d, --daily_hours <hours>', 'save daily hours to config, e.g. 7.5h', String)
  .option('-p, --project <key>', 'save default project to config'. String)
  .option('-m, --max_results <key>', 'save maximum number of issues returned for issue query'. String)
  .option('-r, --rm_project', 'remove default project form config', false)
  .action(options => {
    if (options.switch_to) {
      if (setupConfig.configFileExists(options.switch_to)) {
        setupConfig.switchConfig(options.switch_to)
        Logger.success(`Configuration file is switched to '${options.switch_to}'`)
      } else {
        Logger.error(`Configuration file '${options.switch_to}' does not exist. You can do one of the following:
  - View available configuration files and choose from list, '$ jiran config -l'
  - Add the new configuration file '$ jiran config -f ${options.switch_to} answering questions'
        `)
      }
    } else if (options.list) {
      JiraCli.renderAvailableConfigFiles(
        setupConfig.getConfigDirectory(),
        setupConfig.getActiveConfig()
      )
    } else if (options.filename) {
      const message = 'Adding new configuration'
      TableRenderer.renderTitle(message)
      Logger.log('─'.repeat(message.length).gray)

      ConfigPrompt
        .createPromptWith(require('../cli/config').createConfigWith(options.filename))
        .create()
    } else if (options.view) {
      TableRenderer.renderTitle('Current configuration detail')
      TableRenderer.renderVertical([
        {'Username': currentConfig.username},
        {'Password': currentConfig.password},
        {'Host': currentConfig.host},
        {'Protocol': currentConfig.protocol},
        {'Port': currentConfig.port},
        {'Api version': currentConfig.apiVersion},
        {'Default project': currentConfig.project},
        {'Default daily hours ': currentConfig.daily_hours || setup.dailyHours},
        {'Maximum results ': currentConfig.max_results || setup.maxResults}
      ])
    } else if (options.project) {
      Config.saveDefaultProject(options.project)
      Logger.success('Project \'' + options.project + '\' is saved as default')
    } else if (options.rm_project) {
      Config.removeDefaultProject()
      Logger.warn('Default project is removed')
    } else if (options.daily_hours) {
      Config.saveDailyHours(options.daily_hours)
      Logger.success(`Daily hours '${options.daily_hours}' is saved as default`)
    } else if (options.max_results) {
      Config.saveMaxResults(options.max_results)
      Logger.success(`Maximum results '${options.max_results}' is saved as default`)
    } else if (options.edit) {
      const message = 'You are about to edit existing configuration!'
      TableRenderer.renderTitle(message)
      Logger.log('─'.repeat(message.length).gray)
      ConfigPrompt.createPromptWith(Config).edit()
    }
  })

program
  .command('projects')
  .description('View recent projects for current user')
  .option('-r, --recent [int]', 'Number of recent projects to view, default is set to 5', setup.mostRecentProjects)
  .action(options => JiraCli.renderProjects(options.recent))

program
  .command('issues [project]')
  .description(`List top priority issues of a project, number of issues returned depends on the configured value of max results e.g. ${currentConfig.max_results || setup.maxResults}`)
  .option('-a, --assignee', 'display current user issues on this project', false)
  .option('-o, --open', 'include open issues', false)
  .option('-i, --in_progress', 'include in-progress issues', false)
  .option('-u, --under_review', 'include under-review issues', false)
  .option('-r, --resolved', 'include resolved issues', false)
  .action((project, options) => {
    let projectKey = project || currentConfig.project

    if (!projectKey) {
      Logger.warn(`Project key is required or default project needs to be set first '$ jiran config -p <ABC>'`)
      process.exit(1)
    }

    if (options) {
      JiraCli.renderIssues(projectKey, options)
    } else {
      JiraCli.renderIssues(projectKey)
    }
  })

program
  .command('view <issue>')
  .description('View issue information')
  .action(issue => JiraCli.renderIssue(issue))

program
  .command('pick <issue>')
  .description('Start working on an issue')
  .action(issue => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'in progress')
    }
  })

program
  .command('comment <issue> <comment>')
  .description('Add comment to an issue')
  .action((issue, comment) => JiraCli.addComment(issue, comment))

program
  .command('log-time <issue> <time_spent>')
  .description('Log time to an issue')
  .option('-c, --comment [comment]', 'comment', String)
  .option('-d, --date [date]', 'the date worklog will be added in \'YYYY-MM-DD\' format e.g. 2016-01-31', String)
  .option('-r, --date_range [range]', 'the date range in \'YYYY-MM-DD\' format separated by space e.g. `2016-01-31 2016-02-04`', String)
  .action((issue, time_spent, options) => {
    if (options.date_range) {
      JiraCli.addWorklogs(issue, time_spent, options.comment, options.date_range)
    } else {
      JiraCli.addWorklog(issue, time_spent, options.comment, options.date)
    }
  })

program
  .command('worklogs <issue>')
  .description('View work logs for an issue')
  .action(issue => JiraCli.renderIssueWorklogs(issue))

program
  .command('update-worklog <issue> <worklog>')
  .description('Update an existing worklog entry')
  .option('-t, --time_spent [time]', 'time spent', String)
  .option('-c, --comment [comment]', 'comment', String)
  .option('-d, --date [date]', 'date worklog in \'YYYY-MM-DD\' format e.g. 2016-01-31', String)
  .action((issue, worklog, options) => {
    let data = {}
    if (options.time_spent) {
      data.timeSpent = options.time_spent
    }

    if (options.comment) {
      data.comment = options.comment
    }

    if (options.date) {
      data.started = DateHelper.getWorklogDate(options.date)
    }

    if (Object.keys(data).length === 0) {
      Logger.error('At least one of the options [time_spent, comment, date] should be set to update a worklog')
    } else {
      JiraApi.updateWorklog(issue, worklog, data)
    }
  })

program
  .command('delete-worklog <issue> <worklog>')
  .description('Delete an existing worklog entry')
  .action((issue, worklog) => JiraCli.deleteWorklog(issue, worklog))

program
  .command('review <issue>')
  .description('Move an issue for dev to review')
  .action(issue => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'under review')
    }
  })

program
  .command('qa <issue>')
  .description('Move an issue for QA to check')
  .action(issue => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'qa')
    }
  })

program
  .command('close <issue>')
  .description('Close an issue')
  .action(issue => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'close')
    }
  })

program
  .command('open <issue>')
  .description('Reopen an issue')
  .action(issue => {
    if (issue) {
      JiraCli.transitionIssue(issue, 'open')
    }
  })

program
  .command('dashboard [week]')
  .description('View time spent on a week. Week is a single number [1, 2, 3, ...] to which how many weeks to go back')
  .action(week => JiraCli.renderDashboard(week, currentConfig))

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
