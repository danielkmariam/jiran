# jiran - Jira Command line tool

## Prerequisites

    node >= 0.12.0

## Install
To install it globally and access it from any where on your system, run this command

    $ npm install -g jiran

## Available Commands

    Usage: jiran [options] [command]

    Commands:

      config [options]                         Create account configuration
      projects [options]                       View recent projects for current user
      issues [options] [project]               List top priority issues of a project, number of issues returned depends on the configured value of max results e.g. 20
      view <issue>                             View issue information
      pick <issue>                             Start working on an issue
      comment <issue> <comment>                Add comment to an issue
      log-time [options] <issue> <time_spent>  Log time to an issue
      review <issue>                           Move an issue for dev to review
      qa <issue>                               Move an issue for QA to check
      close <issue>                            Close an issue
      open <issue>                             Reopen an issue
      worklogs <issue>                         List worklogs for an issue
      dashboard [week]                         View time spent on a week. Week is a single number [1, 2, 3, ...] to which how many weeks to go back

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

## Usage
  
  **Configuration**

  The first task that needs to be performed before start using the tool is configuring Jira domain and credentials. To do so, we need to use `$ jiran config` command which will prompt us to fill required information. Upon completing required questions a `~/.jira/config.json` file accessible only to the current user will be created.

  To save Jira information to config file

    $ jiran config

  To view what is saved in config file

    $ jiran config -v

  To saved default project

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

   Log time to a task

    $ jiran log-time <issue key> '<1h 30m>'  -c '[comment goes here]' -d '[YYYY-MM-DD]'

   Time spent for a week defaults to the current week. The value of week is a single number [1, 2, ...] to which how many weeks to go back and see the time logged for that week.

Time logged for current week

    $ jiran dashboard

Time logged for last week
  
    $ jiran dashboard 1

## License

[MIT](https://github.com/danielkmariam/jiran/blob/master/LICENSE)
