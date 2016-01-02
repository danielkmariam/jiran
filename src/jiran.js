#!/usr/local/bin/node
var url = require('url')

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

    console.log('Jira configuration')
    console.log('Username:'.green, currentConfig.username)
    console.log('Password:'.green, currentConfig.password)
    console.log('Host:'.green, currentConfig.host)
    console.log('Protocol:'.green, currentConfig.protocol)
    console.log('Port:'.green, currentConfig.port)
    console.log('Api version:'.green, currentConfig.apiVersion)
  })

program
  .command('user')
  .description('Show current user information')
  .action(() => {
    JiraApi.getUser((response) => {
      console.log('Current user detail'.green)
      var table = new Table()
      table.push(
        {'Key': response.key},
        {'Name': response.displayName},
        {'Email Address': response.emailAddress}
      )
      console.log(table.toString())
    })
  })

program
  .command('issue')
  .description('Show issue information')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier id', String)
  .action((key, id) => {
    JiraApi.getIssue(key, id, (issue) => {
      if (issue) {
        console.log('Issue detail summary'.green)

        const fields = issue.fields
        const link = url.format({
          protocol: Config.detail().protocol,
          hostname: Config.detail().host,
          pathname: '/browse/' + issue.key
        })
        const table = new Table({
          style : { compact : true, head: ['green']}
        })
        table.push(
          {'Key': issue.key},
          {'Issue Type': fields.issuetype.name},
          {'Summary': fields.summary},
          {'Status':fields.status.name},
          {'link': link},
          {'Project': fields.project.name + ' (' + fields.project.key +')'}
        )
        console.log(table.toString())
      } else {
        console.warn('Can not find this issue using given key or id'.red)
      }
    })
  })

program
  .command('worklog')
  .description('List worklogs for an issue')
  .option('-k, --key', 'issue identifier key', String)
  .option('-i, --id', 'issue identifier Id', String)
  .action((key, id) => {
    JiraApi.getIssueWorklogs(key, id, (worklogs) => {
      if (worklogs.total > 0) {
        const table = new Table({
          head: ['Worklog Id', 'Timespent', 'Comment', 'Worklog by', 'Created'],
          style : { compact : true, head: ['green']}
        })

        worklogs.worklogs.map((worklog) => {
          table.push(
            [worklog.id, worklog.timeSpent, worklog.comment, worklog.author.displayName, worklog.created]
          )
        })
        console.log(table.toString())
      } else {
        console.warn('No time logged for this issue'.red)
      }
    })
  })

program.parse(process.argv)
