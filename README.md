# jiran - Jira Command line tool

## Install
To install it globally and access it from any where on your system, run this command

```
$ npm install -g jiran
```

## Available Commands
    Usage: jiran [options] [command]

      config [options]                         Create account configuration
      issues [options] <project>               List issues of a project
      view <issue>                             View issue information
      pick <issue>                             Start working on an issue
      comment <issue> <comment>                Add comment to an issue
      log-time <issue> <time_spent> [comment]  Log time to an issue
      review <issue>                           Move an issue for dev to review
      qa <issue>                               Move an issue for QA to check
      close <issue>                            Close an issue
      open <issue>                             Reopen an issue
      worklogs <issue>                         List worklogs for an issue
      dashboard [week]                         View time spent over a week period, default to the current week

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

## Usage
  ### Configuration
  The first task that needs to be perofrmed before start using the tool is configuring Jira domain and credentials. To do so use the `config` comand which will prompt you to fill required information. Upon completing all the questions a `~/.jira/config.json` file accessable only to the current user will be created.

  To save jira information to config file
  ```
  $ jiran config
  ```

  To view what is saved in config file
  ```
  $ jiran config -v

  ```