var Client = require('../../src/api/client')
var Api = require('../../src/api/api')
var Cli = require('../../src/cli/cli')

var TableRenderer = require('../../src/util/table_renderer')
var Logger = require('../../src/util/logger')

var expect = require('chai').expect
var assert = require('chai').assert
var sinon = require('sinon')

describe('Jira Cli', function () {

  var ConfigData, JiraClient, JiraApi, JiraCli

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

    JiraCli = Cli(JiraApi, TableRenderer, Logger)
  })

  it('It should render current user details', function() {
    JiraApi.getUser = sinon.stub().returns(Promise.resolve({
      key: 'some key',
      name: 'display name',
      email: 'foo@bar.com'
    }));

    JiraCli.tableRenderer.renderTitle = sinon.spy();
    JiraCli.tableRenderer.renderVertical = sinon.spy();

    return JiraCli.renderUser()
      .then(() => {
        assert(JiraCli.tableRenderer.renderTitle.calledWith('Current user detail'))
        assert(JiraCli.tableRenderer.renderVertical.calledWith([
          {'Key': 'some key'},
          {'Name': 'display name'},
          {'Email Address': 'foo@bar.com'}
        ]))
      })
  })

  it('It should render 404 with text message for invalid user request', function() {
    JiraApi.getUser = sinon.stub().returns(Promise.reject('404 - Unable to fetch user detail'))
    JiraCli.logger.error = sinon.spy();

    return JiraCli.renderUser()
      .catch(() => {
        assert(JiraCli.logger.error.calledWith('404 - Unable to fetch user detail'))
      })
  })

  it('It should render jira issue detail', function() {
    JiraApi.getIssue = sinon.stub().returns(Promise.resolve({
      key: 'some key',
      type: 'issue type',
      summary: 'summary',        
      status: 'status name',
      projectKey: 'project key',
      projectName: 'project name'
    }));

    JiraCli.tableRenderer.renderTitle = sinon.spy();
    JiraCli.tableRenderer.renderVertical = sinon.spy();

    return JiraCli.renderIssue({key: 'AAABB'})
      .then(() => {
        assert(JiraCli.tableRenderer.renderTitle.calledWith('Issue detail summary'))
        assert(JiraCli.tableRenderer.renderVertical.calledWith([
          {'Key': 'some key'},
          {'Issue Type': 'issue type'},
          {'Summary': 'summary'},
          {'Status': 'status name'},
          {'Project': 'project name (project key)'}
        ]))
      })
  })

  it('It should render worklogs for an issue', function () {
    JiraApi.getIssueWorklogs = sinon.stub().returns(Promise.resolve([{
      id: '12345',
      timeSpent: '1h 30m',
      comment: 'worklog comment',
      author: 'logger name',
      created: '12/12/2015'
    }]))

    JiraCli.tableRenderer.render = sinon.spy()

    return JiraCli.renderIssueWorklogs({options: 'AAABB'})
      .then(() => {
        assert(JiraCli.tableRenderer.render.calledWith(
          ['Worklog Id', 'Timespent', 'Comment', 'Author', 'Created'],
          [['12345', '1h 30m', 'worklog comment', 'logger name', '12/12/2015']]
        ))
      })
  })

  it('It should render warning when worklogs not found for an issue', function () {
    JiraApi.getIssueWorklogs = sinon.stub().returns(Promise.resolve([]))

    JiraCli.logger.warn = sinon.spy()
    return JiraCli.renderIssueWorklogs({options: 'AAABB'})
      .then(() => {
        assert(JiraCli.logger.warn.calledWith('There are no worklogs for this issue'))
      })
  })

  it('It should render 404 with text message for invalid issue', function () {
    JiraApi.getIssueWorklogs = sinon.stub().returns(Promise.reject('404 - Issue Does Not Exist'))
    JiraCli.logger.error = sinon.spy();

    return JiraCli.renderIssueWorklogs({options: 'AAABB'})
      .catch(() => {
        assert(JiraCli.logger.error.calledWith('404 - Issue Does Not Exist'))
      })
  })

})
