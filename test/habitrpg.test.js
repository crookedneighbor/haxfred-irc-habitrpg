var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;
var assert = require('chai').assert;
var path = require('path');
var chai = require('chai');

var Haxfred = require('haxfred');
var irc_habit = require('../lib/haxfred-irc-habitrpg');
var helpers = require('../lib/helpers');

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
      habitRPGUsers: { bob: ["00000", "AAAAAA"] },
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();
  });

   describe('getHabitCredentials()', function () {
      
      var users = {alice: ["00000", "AAAAA"], bob: ["11111", "BBBBB"], charlie: ["22222", "BBBBB"]};

      it('expect to get bob\'s credentials when passing his exact name', function () {
        var username = "bob";
        expect(helpers.getHabitCredentials(users, username)).to.deep.equal(users['bob']);
      });
      it('expect to get bob\'s credentials when passing his name with a captial letter', function () {
        var username = "Bob";
        expect(helpers.getHabitCredentials(users, username)).to.deep.equal(users['bob']);
      });
      it('expect to get bob\'s credentials when passing his name with a mixed casing', function () {
        var username = "bOB";
        expect(helpers.getHabitCredentials(users, username)).to.deep.equal(users['bob']);
      });
      it('expect to not get credentials when passing a user that is not in the list', function () {
        var username = "foo";
        expect(helpers.getHabitCredentials(users, username)).to.not.be.ok;
      });
   });
   /*
    * @TODO: Ask for help in writing this test
    *
   describe('sendToHabit()', function () {
      
      var users = {alice: ["00000", "AAAAA"], bob: ["11111", "BBBBB"], charlie: ["22222", "BBBBB"]};

      it('expect to get an error when sending faulty habit creds', function () {
        var id = users['bob'][0];
        var api = users['bob'][1];
        var habit = "foo";
        var direction = true;

        expect(helpers.sendToHabit(id, api, habit, direction)).to.throw(Error);
      });
   });
   */

   /*
    * @TODO: Ask for help in writing this test
    *
   describe('emit upvote event', function () {
     // Since we dont really want to setup the irc module for a test

     it('should emit an upvote event', function(done){
          var habitSpy = sinon.spy();
          setTimeout(function(){
            assert(habitSpy.called, 'Upvote event did not fire.');
            assert(habitSpy.calledOnce, 'Upvote fired more than once');
            done();
          }, 1000);
          haxfred.on('irc.habitrpg', habitSpy);
          
          haxfred.emit('irc.upvote', {
             recipient: 'alice',
             sender: 'bob',
          });

       done();
     });
   });
   */
});
