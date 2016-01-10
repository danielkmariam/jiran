var expect = require('chai').expect
var jql = require('../../src/api/jql')

describe('Jql', function () {
  var Jql, options
  beforeEach(function () {
    Jql = jql()
    options = {
      'open': false,
      'in_progress': false,
      'under_review': false,
      'resolved': false
    }
  })

  it('It should set current user as default filter', function () {
    expect(Jql.query).to.be.equal('assignee=currentUser()')
  })

  it('It should add project filter on the query', function () {
    options.project = 'projectId'

    Jql.setProjectFilter(options)
    expect(Jql.query).to.be.equal('assignee=currentUser()+AND+project=projectId')
  })

  it('It should return query with only open status', function () {
    options.open = true
    expect(Jql.getStatus(options)[0]).to.be.equal('\"Open\"')

    let actual = 'assignee=currentUser()+AND+status+in+("Open")+order+by+key+ASC'
    expect(Jql.getQuery(options)).to.be.equal(actual)

  })

  it('It should return query with only in progress status', function () {
    options.in_progress = true
    let actual = 'assignee=currentUser()+AND+status+in+("In+Progress")+order+by+key+ASC'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"In+Progress\"')   
    expect(Jql.getQuery(options)).to.be.equal(actual)
  })

  it('It should return query with only under review status', function () {
    options.under_review = true
    let actual = 'assignee=currentUser()+AND+status+in+("Under+Review")+order+by+key+ASC'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"Under+Review\"') 
    expect(Jql.getQuery(options)).to.be.equal(actual)
  })

  it('It should return query with only resolved status', function () {
    options.resolved = true
    let actual = 'assignee=currentUser()+AND+status+in+("Resolved")+order+by+key+ASC'

    expect(Jql.getStatus(options)[0]).to.be.equal('\"Resolved\"')
    expect(Jql.getQuery(options)).to.be.equal(actual)
  })

  it('It should return default statuses when no option passed', function () {
    expect(Jql.getStatus(options).length).to.be.equal(3)
    expect(Jql.getStatus(options)[0]).to.be.equal('\"Open\"')
    expect(Jql.getStatus(options)[1]).to.be.equal('\"In+Progress\"')
    expect(Jql.getStatus(options)[2]).to.be.equal('\"Under+Review\"')
  })

  it('It should return query with all available status options', function () {
    options = {
      'open': true,
      'in_progress': true,
      'under_review': true,
      'resolved': true
    }

    let actual = 'assignee=currentUser()+AND+status+in+("Open","In+Progress","Under+Review","Resolved")+order+by+key+ASC'

    expect(Jql.getQuery(options)).to.be.equal(actual)
  })
})