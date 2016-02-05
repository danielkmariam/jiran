#!/usr/bin/env node

const Config = require('./cli/config').createConfigWith('config.json')

if (!Config.isSet()) {
  require('./commands/config')
} else {
  require('./commands/actions')
}
