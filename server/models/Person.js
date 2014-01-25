var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var Person = new VeryLevelModel(
  {
    name: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
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
        return today.daysSince(this.when);
      },
      private: true
    },
    gravatar: { 
      derive: function() {
        return gravatar.url(this.email, 100);
      }
    },
    slug: { 
      derive: function () {
        return slugger(this.name);
      }, 
      private: false 
    },
    key: { 
      derive: function() {
        return Person.options.prefix + this.slug 
      }, 
      private: false 
    }
  }, 
  { 
    prefix: 'people!'
  }
);

module.exports = Person;