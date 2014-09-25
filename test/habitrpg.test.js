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
      // Config is necessary to pass
      // @TODO determine how to deal with lack of config
      // haxfred-irc doesnt care if the server isnt defined.
      // It probably shouldnt care about the rest of its config.
      nicks: [ 'haxfred' ],
      channels: [
        '#foo'
      ],
      habitRPGUsers: '../test/testconfig.json',
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
             sinon.assert.calledWithMatch(helpers.sendToHabit, "ping", "pong", "haxfred", true);
             done();
           }
        });


     });

     it('username is not in config file, should not call sendToHabit()', function(done){
          
        haxfred.emit('irc.upvote', {
           recipient: 'JERK',
           sender: 'bob',
           onComplete: function() {
             sinon.assert.neverCalledWith(helpers.sendToHabit, "ping", "pong", "haxfred", true);
             done();
           }
        });


     });
   });

   /*
   describe('sendToHabit()', function() {
     beforeEach(function() {
       sinon.stub(habitapi, "updateTaskScore");
     });

     afterEach(function() {
       habitUser.updateTaskScore.restore();
     });

     it('calls habitapi.user.updateTaskScore()', function(done) {
       helpers.sendToHabit('alice', 'apiKeyMan', 'robotcop', true);
       sinon.assert.calledWithMatch('robotcop', true);
     });
     it('calls habitapi.user.updateTaskScore with default direction');
     it('calls habitapi.user.updateTaskScore with default id');
   });*/

});
