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
    avatar: {
      required: false
    },
    slug: { 
      derive: function () {
        return slugger(this.name);
      }, 
      private: false 
    },
    key: {
      processIn: function(twitterId) {
        return twitterId;
      },
      index: "twitterId"
    }
  },
  { 
    prefix: 'users!'
  }
);

module.exports = User;