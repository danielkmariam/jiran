const program = require('commander')
const Config = require('../cli/config').createConfigWith('config.json')
const ConfigPrompt = require('../cli/config_prompt').createPromptWith(Config)

const TableRenderer = require('../util/table_renderer')
const Logger = require('../util/logger').createLoggerWith(TableRenderer)

program
  .version('1.0.0')
  .command('config')
  .description('Create account configuration')
  .action((options) => {
    const message = 'Adding new configuration'
    TableRenderer.renderTitle(message)
    Logger.log('─'.repeat(message.length).gray)

    ConfigPrompt.create()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  Logger.error('You don\'t have configuration file yet. Please run \'$ jiran config\' and follow the instruction')
}
