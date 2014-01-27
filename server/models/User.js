var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var User = new VeryLevelModel(
  {
    name: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    email: {
      type: new type().isEmail(),
      required: true
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
  },
  { 
    prefix: 'users!'
  }
);

module.exports = User;