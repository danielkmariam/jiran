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

  it('It should render current user details', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.resolve({
      key: 'some key',
      displayName: 'display name',
      emailAddress: 'foo@bar.com'
    }));

    JiraApi.tableRenderer.renderTitle = sinon.spy();
    JiraApi.tableRenderer.renderVertical = sinon.spy();

    return JiraApi.getUser()
      .then(() => {
        assert(JiraApi.tableRenderer.renderTitle.calledWith('Current user detail'))
        assert(JiraApi.tableRenderer.renderVertical.calledWith([
          {'Key': 'some key'},
          {'Name': 'display name'},
          {'Email Address': 'foo@bar.com'}
        ]))
      })
  })

  it('It should render 404 with text message for invalid user request', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.reject({
      statusCode: 404,
      body: { errorMessages: ['Unable to fetch user detail']}
    }));

    JiraApi.logger.error = sinon.spy();

    return JiraApi.getUser()
      .then(() => { throw new Error()})
      .catch(() => {
        assert(JiraApi.logger.error.calledWith('404: Unable to fetch user detail'))
      })
  })

  it('It should render jira issue detail', function() {
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

    JiraApi.tableRenderer.renderTitle = sinon.spy();
    JiraApi.tableRenderer.renderVertical = sinon.spy();

    return JiraApi.getIssue({key: 'AAABB'})
      .then(() => {
        assert(JiraApi.tableRenderer.renderTitle.calledWith('Issue detail summary'))
        assert(JiraApi.tableRenderer.renderVertical.calledWith([
          {'Key': 'some key'},
          {'Issue Type': 'issue type'},
          {'Summary': 'summary'},
          {'Status': 'status name'},
          {'Project': 'project name (project key)'}
        ]))
      })
  })

  it('It should render 404 with text message for invalid jira issue request', function() {
    JiraApi.client.get = sinon.stub().returns(Promise.reject({
      statusCode: 404,
      body: { errorMessages: ['Issue Does Not Exist']}
    }));

    JiraApi.logger.error = sinon.spy()

    return JiraApi.getIssue({key: 'invalid'})
      .then(() => { throw new Error()})
      .catch(() => {
        assert(JiraApi.logger.error.calledWith('404: Issue Does Not Exist'))
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

  it('It should render worklogs not found for an issue', function () {
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
})
