'use strict'

describe('UserService', function () {
  beforeEach(module('mean.ffxivCrafter_base'))
  beforeEach(module(function ($provide) {
    $provide.value('MeanUser', {
      user: {
      },
      acl: {
        allowed: ['admin', 'see a', 'see c']
      }
    })
  }))

  var UserService

  beforeEach(inject(function (_UserService_) {
    UserService = _UserService_
  }))


  it('exists', function (done) {
    expect(UserService).toBeDefined()
    done()
  })

  it('provides a user', function (done) {
    expect(UserService.user).toBeDefined()
    done()
  })

  it('is allowed to see a', function (done) {
    expect(UserService.allowed('see a')).toBe(true)
    done()
  })

  it('is not allowed to see b', function (done) {
    expect(UserService.allowed('see b')).toBe(false)
    done()
  })
})
