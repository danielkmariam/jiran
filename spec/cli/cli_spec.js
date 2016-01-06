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
})
