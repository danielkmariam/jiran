#!/usr/bin/env node --harmony

const Config = require('./cli/config')
const setupConfig = require('./cli/setup')

if (!Config.createConfigWith(setupConfig.getActiveConfig()).isSet()) {
  require('./commands/config')
} else {
  require('./commands/actions')
}
