import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { expect } from 'chai'
import path from 'path'
import chai from 'chai'

import Haxfred from 'haxfred'

// Helpers
import habitHelper from '../lib/helpers/habit'
import emitHelper from '../lib/helpers/emits'
import userHelper from '../lib/helpers/users'

chai.use(sinonChai)

describe('Sending Data to HabitRPG', function () {
  beforeEach(function () {
    this.haxfred = new Haxfred({
      adapters: ['haxfred-irc', 'haxfred-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGUsers: '../../../test/testconfig.json',
      habitRPGEmits: {
        'irc.upvote': {
          recipient: 'recipient',
          id: 'upvote',
          direction: true
        }
      },
      rootDir: path.resolve(__dirname, '../lib')
    })

    this.haxfred.initialize()
  })

  describe('listen for upvote event and if username is in config file, call sendToHabit()', function () {
    beforeEach(function () {
      sinon.stub(habitHelper, 'sendToHabit')
    })

    afterEach(function () {
      habitHelper.sendToHabit.restore()
    })

    it('username is in config file, should call sendToHabit()', function (done) {
      this.haxfred.emit('irc.upvote', {
        recipient: 'Alice',
        sender: 'bob',
        onComplete: function () {
          sinon.assert.calledWithMatch(habitHelper.sendToHabit, 'ping', 'pong', 'upvote', true)
          done()
        }
      })
    })

    it('username is not in config file, should not call sendToHabit()', function (done) {
      this.haxfred.emit('irc.upvote', {
        recipient: 'JERK',
        sender: 'bob',
        onComplete: function () {
          sinon.assert.neverCalledWith(habitHelper.sendToHabit, 'ping', 'pong', 'upvote', true)
          done()
        }
      })
    })
  })

  /*
   * @TODO: When HabitAPI Module is updated to use new prototype schema, write tests involving the api
   */
})

describe('test error reporting for config', function () {
  beforeEach(function () {
    sinon.spy(console, 'error')
  })
  afterEach(function () {
    console.error.restore()
  })

  it('should throw console.error when no habitRPGUsers is provided', function () {
    let haxfred = new Haxfred({
      adapters: ['haxfred-irc', 'haxfred-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGEmits: {
        'irc.upvote': {
          recipient: 'recipient',
          id: 'upvote',
          direction: true
        }
      },
      rootDir: path.resolve(__dirname, '../lib')
    })

    haxfred.initialize()

    expect(console.error).to.be.calledWith('No config found for Habit RPG users.')
  })

  it('should throw console.error when habitRPGEmits is not an object', function () {
    let haxfred = new Haxfred({
      adapters: ['haxfred-irc', 'haxfred-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGUsers: '../../../test/testconfig.json',
      habitRPGEmits: 'not an object',
      rootDir: path.resolve(__dirname, '../lib')
    })

    haxfred.initialize()

    expect(console.error).to.be.calledWith('habitRPGEmits must be an object')
  })

  it('should throw console.error when users config file is missing a uuid or token', function () {
    let haxfred = new Haxfred({
      adapters: ['haxfred-irc', 'haxfred-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [ '#foo' ],
      habitRPGUsers: '../../../test/badtestconfig.json',
      rootDir: path.resolve(__dirname, '../lib')
    })

    haxfred.initialize()

    expect(console.error).to.be.calledWith('Alice is missing a uuid/token, or is not formatted correctly')
    expect(console.error).to.be.calledWith('boB is missing a uuid/token, or is not formatted correctly')
    // @TODO, get value of users variable to make sure valid users still come through
  })
})

describe('Testing user helper', function () {
  let config = {
    hades: {
      uuids: 'foo',
      token: 'bar'
    },
    Persephone: {
      uuid: 'foo',
      token: 'bar'
    },
    Orpheus: {
      uuid: 'foo'
    },
    Eurdice: {}
  }

  let users = userHelper.formatUsers(config)

  it('Expect users object to not include user with missing uuid', function () {
    expect(users).to.not.have.property('hades')
  })

  it('Expect users object to not include user with missing token', function () {
    expect(users).to.not.have.property('orpheus')
  })

  it('Expect users object to not include user with missing uuid and token', function () {
    expect(users).to.not.have.property('eurdice')
  })

  it('Expect users object to include user with uuid and token', function () {
    expect(users).to.have.property('persephone')
  })
})

describe('Testing emits helper', function () {
  let default_id = 'not haxfred'
  let config = {
    'irc.foo': {},
    'irc.bar': {
      id: 'bar',
      recipient: 'from',
      direction: false
    },
    'irc.ping': {
      direction: 'down'
    },
    'irc.pong': {
      direction: true
    },
    'irc.zing': {
      direction: 'up'
    },
    'irc.zow': {
      direction: 'zing'
    }
  }
  let emits = emitHelper.formatEmits(config)

  it('Expect emit with no id specified to use the default id', function () {
    expect(emits['irc.foo']).to.have.property('id').to.equal('haxfred')
  })

  it('Expect emit with no recipient specified to use the default recipient', function () {
    expect(emits['irc.foo']).to.have.property('recipient').to.equal('recipient')
  })

  it('Expect emit with no direction specified to use the default direction', function () {
    expect(emits['irc.foo']).to.have.property('direction').to.equal(true)
  })

  it('Expect emit with specified id to have the specified id', function () {
    expect(emits['irc.bar']).to.have.property('id').to.equal('bar')
  })

  it('Expect emit with specified recipient to have the specified recipient', function () {
    expect(emits['irc.bar']).to.have.property('recipient').to.equal('from')
  })

  it('Expect emit with specified direction to have the specified direction', function () {
    expect(emits['irc.bar']).to.have.property('direction').to.equal(false)
  })

  it('Expect emit with specified direction of "down" to have a direction of false', function () {
    expect(emits['irc.ping']).to.have.property('direction').to.equal(false)
  })

  it('Expect emit with specified direction of "up" to have a direction of true', function () {
    expect(emits['irc.pong']).to.have.property('direction').to.equal(true)
  })

  it('Expect emit with specified direction of anything other than down or false to have a direction of true', function () {
    expect(emits['irc.zow']).to.have.property('direction').to.equal(true)
  })

  it('Expect emits object to return false when a string is passed in instead of an object', function () {
    let emitString = emitHelper.formatEmits('string')
    expect(emitString).to.equal(false)
  })

  it('Expect emits object to return false when a number is passed in instead of an object', function () {
    let emitNumber = emitHelper.formatEmits(42)
    expect(emitNumber).to.equal(false)
  })

  it('Expect emits object to return false when blank object is passed in', function () {
    let blankEmit = emitHelper.formatEmits({})
    expect(blankEmit).to.equal(false)
  })

  it('Expect emit with no id specified to use default id passed into function', function () {
    let configObj = {'irc.foo': {}}
    let emitsObj = emitHelper.formatEmits(configObj, default_id)
    expect(emitsObj['irc.foo']).to.have.property('id').to.equal('not haxfred')
  })
})
