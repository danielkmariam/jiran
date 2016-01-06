var Client = require('../../src/api/client')
var Api = require('../../src/api/api')
var TableRenderer = require('../../src/util/table_renderer')
var Logger = require('../../src/util/logger')

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
    JiraApi = Api(JiraClient, TableRenderer, Logger)
  })

  it('It should throw exception for missing Jira Client', function () {
    expect(() => (Api())).to.throw(Error)
  })

  it('It should be initialized with Jira Client', function () {
    expect(JiraApi.client).to.not.equal('undefined')
    expect(JiraApi.client.username).to.be.equal(ConfigData.username)
  })

  it('It should return current user details', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.resolve({
      key: 'some key',
      displayName: 'display name',
      emailAddress: 'foo@bar.com'
    }));

    return JiraApi.getUser()
      .then((response) => {
        expect(response.key).to.be.equal('some key')
        expect(response.name).to.be.equal('display name')
        expect(response.email).to.be.equal('foo@bar.com')
      })
  })

  it('It should throw exception when faild to fetch user data', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.reject({
      statusCode: 404,
      body: { message: ['Unable to fetch user detail']}
    }));

    return JiraApi.getUser()
      .catch((error) => {
        expect(error.toString()).to.be.equal('Error: 404 - Unable to fetch user detail')
      })
  })

  it('It should return jira issue detail', function() {
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

  it('It should render 404 with text message for invalid jira issue request', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.reject({
      statusCode: 404,
      body: { errorMessages: ['Issue Does Not Exist']}
    }));

    return JiraApi.getIssue({key: 'invalid'})
      .catch((error) => {
        expect(error.toString()).to.be.equal('Error: 404 - Issue Does Not Exist')
      })
  })

  it('It should render worklogs for an issue', function () {
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

    JiraApi.tableRenderer.render = sinon.spy()

    return JiraApi.getIssueWorklogs({options: 'AAABB'})
      .then(() => {
        assert(JiraApi.tableRenderer.render.calledWith(
          ['Worklog Id', 'Timespent', 'Comment', 'Worklog by', 'Created'],
          [['12345', '1h 30m', 'worklog comment', 'logger name', '12/12/2015']]
        ))
      })
  })

  it('It should render warning worklogs not found for an issue', function () {
    JiraApi.client.get = sinon.stub().returns(Promise.resolve({
      total: 0,
      worklogs: []
    }))

    JiraApi.logger.warn = sinon.spy()

    return JiraApi.getIssueWorklogs({options: 'AAABB'})
      .then(() => {
        assert(JiraApi.logger.warn.calledWith('There are no worklogs for this issue'))
      })
  })

  it('It should render all issues for current user', function () {
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

    JiraApi.tableRenderer.render = sinon.spy()

    return JiraApi.getIssues()
      .then(() => {
        assert(JiraApi.tableRenderer.render.calledWith(
          ['Issue key', 'Status', 'Summary', 'Project key'],
          [
            [ 'KEY_1', 'In Progress', 'Test issue 1', 'PROJECT_KEY_1' ],
            [ 'KEY_2', 'Open', 'Test issue 2', ' PROJECT_KEY_2' ]
          ]
        ))
      })
  })

  it('It should render warning no issue found for current user', function () {
    JiraApi.client.get = sinon.stub().returns(Promise.resolve({
      total: 0,
      issues: []
    }))

    JiraApi.logger.warn = sinon.spy()

    return JiraApi.getIssues({options: 'PROJECT_KEY_1'})
      .then(() => {
        assert(JiraApi.logger.warn.calledWith('There are no issues for current user'))
      })
  })
})
