var program = require('commander')
var ConfigPrompt = require('../../lib/cli/config_prompt')

var TableRenderer = require('../../lib/util/table_renderer')
var Logger = require('../../lib/util//logger')(TableRenderer)

program
  .version('1.0.0')
  .command('config')
  .description('Create account configuration')
  .action((options) => {
    ConfigPrompt()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  Logger.error('You don\'t have configuration file yet. Please run \'$ jiran config\' and follow the instruction')
}
