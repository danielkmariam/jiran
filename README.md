# jiran - Jira Command line tool

## Prerequisites

    node >= 0.12.0

## Install
To install it globally and access it from any where on your system, run this command

    $ npm install -g jiran

## Available Commands

    Usage: jiran [options] [command]

    Commands:

      config [options]                            Manage configuration
      projects [options]                          View recent projects for current user
      issues [options] [project]                  List top priority issues of a project, number of issues returned depends on the configured value of max results e.g. 20
      view <issue>                                View issue information
      pick <issue>                                Start working on an issue
      comment <issue> <comment>                   Add comment to an issue
      log-time [options] <issue> <time_spent>     Log time to an issue
      worklogs <issue>                            View worklogs for an issue
      update-worklog [options] <issue> <worklog>  Update an existing worklog entry
      delete-worklog <issue> <worklog>            Delete an existing worklog entry
      review <issue>                              Move an issue for dev to review
      qa <issue>                                  Move an issue for QA to check
      close <issue>                               Close an issue
      open <issue>                                Reopen an issue
      dashboard [week]                            View time spent on a week. Week is a single number [1, 2, 3, ...] to which how many weeks to go back

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

## Usage
  
  **Configuration**

  The first task that needs to be performed before start using the tool is configuring Jira domain and credentials. To do so, we need to use `$ jiran config` command which will prompt us to fill required information. Upon completing required questions a `~/.jiran/config/default.json` file accessible only to the current user will be created.

  To save Jira information to default json file

    $ jiran config

   It is possible to have multiple configuration files. To save Jira information to a file name of your choice

      $ jiran config -f <name-of-file.json>

  To view available configuration files

      $ jiran config -l

  To switch to a specific configuration from the list available

      $ jiran config -s <name-of-file.json>

  To view what is saved in config file

    $ jiran config -v

  To save default project to the current configuration

    $ jiran config -p <project key>

  **Using other commands**

  List recent projects for current user

    $ jiran projects

   List top issues for a default project. Default project is configured using `$ jiran config -p <project key>`

    $ jiran issues

   List top issues for a given project key

     $ jiran issues <project key>

   Transition a task to in progress

    $ jiran pick <issue key>

   Log time for a task on the current date

    $ jiran log-time <issue key> '<1h 30m>'  -c '[comment text]'

  Log time for a task on a specific date

     $ jiran log-time <issue key> '<1h 30m>'  -c '[comment text]' -d '[YYYY-MM-DD]'

  Log time for a task on date range

     $ jiran log-time <issue key> '<1h 30m>'  -c '[comment text]' -r '[YYYY-MM-DD YYYY-MM-DD]'

   Time spent for a week defaults to the current week. The value of week is a single number [1, 2, ...] to which how many weeks to go back and see the time logged for that week.

  Batch time log, data is read form a json file

    $ jiran batch-time-log -f </path/to/file.json>

    Above file contains json data in the following format

    [
      {
        "ticket": "A123",
        "worklog": [
          {"time": "1h", "date": "2016-12-01", "comment": "this is comment 1"},
          {"time": "1h", "date": "2016-12-02", "comment": "this is comment 2"}
        ]
      },
      {
        "ticket": "A124",
        "worklog": [
          {"time": "1h", "date": "2016-12-01", "comment": "this is comment 1"}
        ]
      }
    ]


Time logged for current week

    $ jiran dashboard

Time logged for last week
  
    $ jiran dashboard 1

## License

[MIT](https://github.com/danielkmariam/jiran/blob/master/LICENSE)
