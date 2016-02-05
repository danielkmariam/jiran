const Client = require('../../src/api/client')
const request = require('request')
const expect = require('chai').expect

describe('Jira client', function () {
  describe('With valid config information', function () {
    let JiraClient, configData

    before(function () {
      configData = {
        username: 'test',
        password: 'test',
        host: 'test.domain.com',
        protocol: 'https',
        port: '80',
        apiVersion: '2'
      };

      JiraClient = Client.createClientWith(configData)
    })

    it('It should not throw exception for valid config object', function () {
      expect(() => (JiraClient)).to.not.throw(Error)
    })

    it('It should set default properties for api requests', function () {
      expect(JiraClient.username).to.be.equal(configData.username)
      expect(JiraClient.password).to.be.equal(configData.password)
      expect(JiraClient.protocol).to.be.equal(configData.protocol)
      expect(JiraClient.host).to.be.equal(configData.host)
      expect(JiraClient.port).to.be.equal('')
      expect(JiraClient.apiVersion).to.be.equal(configData.apiVersion)
    })
  })

  describe('With missing config information', function () {
    it('It should throw exception when config object does not have all request fields', function () {      
      const configData = {
        username: 'test',
        password: 'test'
      }
      expect((configData) => (Client.createClientWith(configData))).to.throw(Error)
    })
  })
})

