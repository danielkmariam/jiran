var Client = require('../src/api/client')
var expect = require('chai').expect

require('chai').should()

describe('Jira api client', function () {
  describe('With valid config information', function () {
    var JiraClient, configData

    before(function () {
      configData = {
        username: 'test',
        password: 'test',
        host: 'test.domain.com',
        protocol: 'https',
        port: '',
        apiVersion: '2'
      };

      JiraClient = new Client(configData)
    })

    it('It should not throw exception for valid config object', function () {
      expect(() => { return JiraClient }).to.not.throw(Error)
    })

    it('It should set default properties for api requests', function () {
      JiraClient.username.should.be.equal(configData.username)
      JiraClient.password.should.be.equal(configData.password)
      JiraClient.protocol.should.be.equal(configData.protocol)
      JiraClient.host.should.be.equal(configData.host)
      JiraClient.port.should.be.equal(configData.port)
      JiraClient.apiVersion.should.be.equal(configData.apiVersion)
    })
  })

  describe('With invalid config information', function () {
    it('It should throw exception when config object does not have all request fields', function () {      
      var configData = {
        username: 'test',
        password: 'test'
      }
      expect((configData) => { new Client(configData) }).to.throw(Error)
    })
  })
})