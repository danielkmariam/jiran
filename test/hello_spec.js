require('chai').should()

describe('Hello', function () {
  it('It should say hello to the world', function () {
    'Hello world'.should.include('Hello')
  })
})