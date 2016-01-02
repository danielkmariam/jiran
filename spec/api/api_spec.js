var Client = require('../../src/api/client')
var Api = require('../../src/api/api')

var expect = require('chai').expect

describe('Api', function () {

  var ConfigData, JiraClient, JiraApi

  before(function () {
    ConfigData = {
      username: 'test',
      password: 'test',
      host: 'test.domain.com',
      protocol: 'https',
      port: '',
      apiVersion: '2'
    };

    JiraClient = Client(ConfigData)   
    JiraApi = Api(JiraClient)
  })

  it('It should throw exception for missing Jira Client', function () {
    expect(() => (Api())).to.throw(Error)
  })

  it('It should be initialized with Jira Client', function () {
    expect(JiraApi.client).to.not.equal('undefined')
    expect(JiraApi.client.username).to.be.equal(ConfigData.username)
  })
})
