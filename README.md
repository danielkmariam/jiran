# jiran - Jira Command line tool

## Prerequisites

    node >= 4.0.1

## Install
To install it globally and access it from any where on your system, run this command

    $ npm install -g jiran

## Available Commands

    Usage: jiran [options] [command]

    Commands:

      config [options]                         Create account configuration
      issues [options]                         List current user issues
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

  The first task that needs to be perofrmed before start using the tool is configuring Jira domain and credentials. To do so, we need to use `$ jiran config` command which will prompt us to fill required information. Upon completing required questions a `~/.jira/config.json` file accessable only to the current user will be created.

  To save jira information to config file

    $ jiran config

  To view what is saved in config file
  
    $ jiran config -v

  **Using other commands**

   List all issues for the current user
    
    $ jiran issues 
    
   Transition a task to in progress
    
    $ jiran pick <issue key>
   
   Log time to a task
    
    $ jiran log-time <ABC-12> '<1h 30m>'  -c '[comment goes here]' -d '[YYYY-MM-DD]'

   Time spent for a week defaults to the current week. The value of week is a single number [1, 2, ...] to which how many weeks to go back and see the time logged for that week.

Time logged for current week
  
    $ jiran dashboard 

Time logged for last week
  
    $ jiran dashboard 1 

## License
[MIT](https://github.com/danielkmariam/jiran/blob/master/LICENSE)