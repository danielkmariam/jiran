#!/usr/bin/env node

var Config = require('../lib/cli/config')()

if (!Config.isSet()) {
  require('../lib/commands/config')
} else {
  require('../lib/commands/actions')
}
