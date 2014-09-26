var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var path = require('path');
var chai = require('chai');

var Haxfred = require('haxfred');
var helpers = require('../lib/helpers');
var irc_habit = require('../lib/haxfred-irc-habitrpg');

chai.use(expect);
chai.use(assert);
chai.use(sinonChai);


describe('Sending Data to HabitRPG', function () {
  // Setup haxfred for tests
  var haxfred;
  beforeEach(function() {
    haxfred = new Haxfred({
      adapters: ['../node_modules/haxfred-irc/lib/haxfred-irc.js', 'haxfred-irc-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGUsers: '../../../test/testconfig.json',
      habitRPGEmits: {
        "irc.upvote": {
          recipient: "recipient",
          id: "upvote",
          direction: true
        }
      },
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();
  });

   describe('listen for upvote event and if username is in config file, call sendToHabit()', function () {

     beforeEach(function() {
       sinon.stub(helpers, "sendToHabit");
     });

     afterEach(function() {
       helpers.sendToHabit.restore();
     });

     it('username is in config file, should call sendToHabit()', function(done){
          
        haxfred.emit('irc.upvote', {
           recipient: 'Alice',
           sender: 'bob',
           onComplete: function() {
             sinon.assert.calledWithMatch(helpers.sendToHabit, "ping", "pong", "upvote", true);
             done();
           }
        });
     });

     it('username is not in config file, should not call sendToHabit()', function(done){
          
        haxfred.emit('irc.upvote', {
           recipient: 'JERK',
           sender: 'bob',
           onComplete: function() {
             sinon.assert.neverCalledWith(helpers.sendToHabit, "ping", "pong", "upvote", true);
             done();
           }
        });
     });
   });

   /*
    * @TODO: When HabitAPI Module is updated to use new prototype schema, write tests involving the api
    */

});

describe('test error reporting for config', function () {
  it('should through console.error when no habitRPGUsers is provided', function () {
    sinon.spy(console, 'error')
    haxfred = new Haxfred({
      adapters: ['../node_modules/haxfred-irc/lib/haxfred-irc.js', 'haxfred-irc-habitrpg'],
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGUsers: null,
      habitRPGEmits: {
        "irc.upvote": {
          recipient: "recipient",
          id: "upvote",
          direction: true
        }
      },
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();

    expect(console.error).to.be.called;

    console.error.restore();
  });
});
