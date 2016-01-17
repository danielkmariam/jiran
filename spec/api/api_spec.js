var Client = require('../../src/api/client')
var Api = require('../../src/api/api')
var Jql = require('../../src/api/jql')

var expect = require('chai').expect
var assert = require('chai').assert
var sinon = require('sinon')

describe('Jira Api', function () {

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
    JiraApi = Api(JiraClient, Jql())
  })

  it('It should throw exception for missing Jira Client', function () {
    expect(() => (Api())).to.throw(Error)
  })

  it('It should be initialized with Jira Client', function () {
    expect(JiraApi.client).to.not.equal('undefined')
    expect(JiraApi.client.username).to.be.equal(ConfigData.username)
  })

  describe('Issue', function () {  
    it('It should return issue detail', function() {
      JiraApi.client.get = sinon.stub().returns(Promise.resolve({
        key: 'some key',
        fields: {
          issuetype: {name: 'issue type'},
          summary: 'summary',
          status: {name: 'status name'},
          project: {
            key: 'project key',
            name: 'project name'
          }
        }
      }));

      return JiraApi.getIssue({key: 'AAABB'})
        .then((issue) => {
          expect(issue.key).to.be.equal('some key')
          expect(issue.type).to.be.equal('issue type')
          expect(issue.summary).to.be.equal('summary')
          expect(issue.status).to.be.equal('status name')
          expect(issue.projectName).to.be.equal('project name')
          expect(issue.projetcKey).to.be.equal('project key')
        })
    })

    it('It should throw exception for invalid issue request', function() {
      JiraApi.client.get = sinon.stub().returns(Promise.reject(
        new Error('404 - Issue Does Not Exist')
      ));

      return JiraApi.getIssue({key: 'invalid'})
        .catch((error) => {
          expect(error.toString()).to.be.equal('Error: 404 - Issue Does Not Exist')
        })
    })
  })
  
  describe('User issues', function () {
    it('It should return all issues for current user', function () {
      JiraApi.client.get = sinon.stub().returns(Promise.resolve({
        total: 2,
        issues: [
          {
            key: 'KEY_1',
            fields: {
              status: {name: 'In Progress'},
              summary: 'Test issue 1',
              project: {key: 'PROJECT_KEY_1'}  
            }
          },
          {
            key: 'KEY_2',
            fields: {
              status: {name: 'Open'},
              summary: 'Test issue 2',
              project: {key:' PROJECT_KEY_2'}
            }
          }
        ]
      }))

      let options = {
        'open': false,
        'in_progress': false,
        'under_review': false,
        'resolved': false
      }
      return JiraApi.getIssues(options)
        .then((issues) => {
          expect(issues.length).to.be.equal(2)
          expect(issues[0].key).to.be.equal('KEY_1')
          expect(issues[0].status).to.be.equal('In Progress')
          expect(issues[0].summary).to.be.equal('Test issue 1')
          expect(issues[0].projectKey).to.be.equal('PROJECT_KEY_1')
        })
    })

    it('It should render message when no issue found for current user', function () {
      JiraApi.client.get = sinon.stub().returns(Promise.resolve({
        total: 0,
        issues: []
      }))

      return JiraApi.getIssues({project: 'PROJECT_KEY_1'})
        .catch((error) => {
          expect(error.toString()).to.be.equal('Error: There are no issues for current user')
        })
    })
  })

  describe('Issue worklogs', function () {
    it('It should return worklogs for an issue', function () {
      JiraApi.client.get = sinon.stub().returns(Promise.resolve({
        total: 1,
        worklogs: [{
          id: '12345',
          timeSpent: '1h 30m',
          comment: 'worklog comment',
          author: {displayName: 'logger name'},
          created: '12/12/2015'
        }]
      }))

      return JiraApi.getIssueWorklogs({key: 'AAABB'})
        .then((worklogs) => {
          expect(worklogs.length).to.be.equal(1)
          expect(worklogs[0].id).to.be.equal('12345')
          expect(worklogs[0].timeSpent).to.be.equal('1h 30m')
        })
    })

    it('It should render message when there are no worklogs for an issue', function () {

      JiraApi.client.get = sinon.stub().returns(Promise.resolve({
        total: 0,
        worklogs: []
      }))

      return JiraApi.getIssueWorklogs({key: 'AAABB'})
        .catch((error) => {
          expect(error.toString()).to.be.equal('Error: There are no worklogs for this issue')
        })
    })
  })
})
