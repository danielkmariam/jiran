const program = require('commander')

const Config = require('../cli/config')
const ConfigPrompt = require('../cli/config_prompt')

const TableRenderer = require('../util/table_renderer')
const Logger = require('../util/logger').createLoggerWith(TableRenderer)

program
  .version('1.2.1')
  .command('config')
  .description('Create account configuration')
  .option('-f, --filename [filename]', 'Config filename')
  .action(options => {
    const message = 'Adding new configuration'
    TableRenderer.renderTitle(message)
    Logger.log('─'.repeat(message.length).gray)

    ConfigPrompt
      .createPromptWith(Config.createConfigWith(options.filename || 'default.json'))
      .create()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  Logger.error('You don\'t have configuration file yet. Please run \'$ jiran config\' and follow the instruction')
}
