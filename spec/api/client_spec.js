const Client = require('../../src/api/client')
const EncryptDecrypter = require('../../src/cli/encrypt_decrypter')
const request = require('request')
const expect = require('chai').expect

describe('Jira client', function () {
  describe('With valid config information', function () {
    let JiraClient, configData

    before(function () {
      configData = {
        username: 'testname',
        password: '6c1c88c2d6c9307924631245',
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
      expect(JiraClient.options).to.deep.equal({
        auth: {
          'user': configData.username,
          'pass': EncryptDecrypter.decrypt(configData.password)
        },
        json: true
      })
      expect(JiraClient.apiVersion).to.be.equal(configData.apiVersion)
      expect(JiraClient.domainData).to.deep.equal({
        protocol: configData.protocol,
        hostname: configData.host,
        port: ''
      })
    })
  })

  describe('With missing config information', function () {
    it('It should throw exception when config object does not have all request fields', function () {
      const configData = {
        username: 'test',
        password: '6c1c88c2d6c9307924631245'
      }
      expect((configData) => (Client.createClientWith(configData))).to.throw(Error)
    })
  })
})
