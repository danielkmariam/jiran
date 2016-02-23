const expect = require('chai').expect

describe('Jql', function () {
  var Jql, options, projectKey
  beforeEach(function () {
    Jql = require('../../src/api/jql').create()
    projectKey = 'projectId'
    options = {
      'assignee': false,
      'open': false,
      'in_progress': false,
      'under_review': false,
      'resolved': false
    }
  })

  it('It should return open issues by default for the project', function () {
    let actual = 'project=projectId AND status in ("Open") order by priority desc'
    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return query with open, in progress and under review status options for the project', function () {
    options.assignee = true
    let actual = 'assignee=currentUser() AND project=projectId AND status in ("Open","In Progress","Under Review") order by priority desc'

    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })


  it('It should add project filter on the query', function () {
    Jql.setProjectFilter(projectKey)
    expect(Jql.query).to.be.equal('project=projectId')
  })

  it('It should return query with only open status', function () {
    options.open = true
    let actual = 'project=projectId AND status in ("Open") order by priority desc'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"Open\"')
    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return query with only in progress status', function () {
    options.in_progress = true
    let actual = 'project=projectId AND status in ("In Progress") order by priority desc'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"In Progress\"')   
    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return query with only under review status', function () {
    options.under_review = true
    let actual = 'project=projectId AND status in ("Under Review") order by priority desc'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"Under Review\"') 
    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return query with only resolved status', function () {
    options.resolved = true
    let actual = 'project=projectId AND status in ("Resolved") order by priority desc'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"Resolved\"')
    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return default statuses when no option passed', function () {
    expect(Jql.getStatus(options).length).to.be.equal(0)
  })

  it('It should return query with all available status options for the project', function () {
    options = {
      'open': true,
      'in_progress': true,
      'under_review': true,
      'resolved': true
    }
    let actual = 'project=projectId AND status in ("Open","In Progress","Under Review","Resolved") order by priority desc'

    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })

  it('It should return query with all available status options for the project filtered by assignee', function () {
    options = {
      'assignee': true,
      'open': true,
      'in_progress': true,
      'under_review': true,
      'resolved': true
    }

    let actual = 'assignee=currentUser() AND project=projectId AND status in ("Open","In Progress","Under Review","Resolved") order by priority desc'

    expect(Jql.getQuery(projectKey, options)).to.be.equal(actual)
  })
})