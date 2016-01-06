
var fs = require('fs')
var config = require('../../src/cli/config')
var expect = require('chai').expect

describe('Config', function () {
  var Config, expected 
  
  beforeEach(function () {
    Config = config('config_test.json')
    expected = {
      username: 'test',
      password: 'test',
      host: 'test.domain.com',
      protocol: 'https',
      port: '',
      apiVersion: '2'
    }
  })

  after(function () {
    try {
      fs.unlinkSync(Config.configFilename)
    } catch(e) {
      return false
    }
  })

  it('It should save config information', function () {
    
    Config.save(expected)

    var actual = JSON.parse(fs.readFileSync(Config.configFilename))

    expect(expected.username).to.be.equal(actual.username)
    expect(expected.apiVersion).to.be.equal(actual.apiVersion)
  })

  it('It should render saved config information', function () {
    
    var actual = Config.detail()

    expect(expected.username).to.be.equal(actual.username)
    expect(expected.password).to.be.equal(actual.password)
    expect(expected.host).to.be.equal(actual.host)
    expect(expected.protocol).to.be.equal(actual.protocol)
    expect(expected.port).to.be.equal(actual.port)
    expect(expected.apiVersion).to.be.equal(actual.apiVersion)
  })
})