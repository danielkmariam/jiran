var Client = require('../../src/api/client')
var Issue = require('../../src/api/issue')

var expect = require('chai').expect

describe('Issue', function () {

  var ConfigData, JiraClient, JiraIssue

  before(function () {
    ConfigData = {
      username: 'test',
      password: 'test',
      host: 'test.domain.com',
      protocol: 'https',
      port: '',
      apiVersion: '2'
    };

    JiraClient = Client.getClient(ConfigData)   
    JiraIssue = new Issue(JiraClient)
  })

  it('It should throw exception for missing Jira Client', function () {
    expect(() => (new Issue())).to.throw(Error)
  })

  it('It should be initialized with Jira Client', function () {
    expect(JiraIssue.client).to.not.equal('undefined')
    expect(JiraIssue.client.username).to.be.equal(ConfigData.username)
  })
})
