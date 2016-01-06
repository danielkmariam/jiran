var Client = require('../../src/api/client')
var request = require('request')
var expect = require('chai').expect

describe('Jira client', function () {
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

      JiraClient = Client(configData)
    })

    it('It should not throw exception for valid config object', function () {
      expect(() => (JiraClient)).to.not.throw(Error)
    })

    it('It should set default properties for api requests', function () {
      expect(JiraClient.username).to.be.equal(configData.username)
      expect(JiraClient.password).to.be.equal(configData.password)
      expect(JiraClient.protocol).to.be.equal(configData.protocol)
      expect(JiraClient.host).to.be.equal(configData.host)
      expect(JiraClient.port).to.be.equal(configData.port)
      expect(JiraClient.apiVersion).to.be.equal(configData.apiVersion)
    })

    it('It should build request url', function () {
      var expected = 'https://test.domain.com/rest/api/2/issue'

      expect(JiraClient.buildUrl('/issue')).to.be.equal(expected)
    })
  })

  describe('With missing config information', function () {
    it('It should throw exception when config object does not have all request fields', function () {      
      var configData = {
        username: 'test',
        password: 'test'
      }
      expect((configData) => (Client(configData))).to.throw(Error)
    })
  })
})