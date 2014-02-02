var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var Person = new VeryLevelModel(
  {
    uid: {
      processIn: function(uid) {
        return uid;
      },
      type: new type().isNumeric().len(1,80),
      required: true
    },
    firstName: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    lastName: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    fullName: {
      derive: function () {
        return this.firstName + ' ' + this.lastName;
      },
      private: false
    },
    email: {
      type: new type().isEmail(),
      required: true
    },
    when: {
      processIn: function(when) {
        if(when.length > 0) {
          when = Date.create(when);
          return when;
        }
        else {
          when = Date.create('now');
          return when;
        }
      }
    },
    daysSince: {
      derive: function() {
        var today = Date.create('today');
        var since = today.daysSince(this.when);
        if (since < 0) { 
          since = since + 7; 
          return since;
        }
        else return since;
      },
      private: true,
      index: "daysSince"
    },
    gravatar: { 
      derive: function() {
        return gravatar.url(this.email, 100);
      }
    },
    slug: { 
      derive: function () {
        return slugger(this.fullName);
      }, 
      private: false,
      index: "slug"
    }
  }, 
  { 
    prefix: 'people!'
  }
);

module.exports = Person;