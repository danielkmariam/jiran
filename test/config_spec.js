
var fs = require('fs')
var config = require('../src/config')

require('chai').should()

describe('Config', function () {
  let Config, expected 
  
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
      fs.unlinkSync(Config.configFilePath)
    } catch(e) {
      return false
    }
  })

  it('It should save config information', function (done) {
    Config.save(expected)

    let actual = JSON.parse(fs.readFileSync(Config.configFilePath))

    expected.username.should.be.equal(actual.username)
    expected.apiVersion.should.be.equal(actual.apiVersion)

    done()
  })

  it('It should return saved config information', function (done) {
    
    let actual = Config.detail()

    expected.username.should.be.equal(actual.username)
    expected.apiVersion.should.be.equal(actual.apiVersion)

    done()
  })
})