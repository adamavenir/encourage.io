var views     = require('./views');
var Types     = require('hapi').types;

module.exports = function _routes(server, views) {

  var Passport = server.plugins.travelogue.passport;

  var routes = [

    // GET STATIC FILES
    { method: 'GET',  path: '/{path*}',   
      handler: {
        directory: { 
          path: './public', 
          listing: false, 
          index: true 
        }
      }  
    },

    { method: 'GET',  path: '/', handler: this.index },

    // PEOPLE
    { method: 'GET',  path: '/people', handler: this.listPeople },
    { method: 'GET',  path: '/people/{person}', handler: this.getPerson },
    { method: 'GET',  path: '/people/add', handler: this.formPerson },
    { method: 'POST', path: '/people/add', handler: this.createPerson },
    { method: 'GET', path: '/people/delete/{person}', handler: this.deletePerson },

    // AUTH

    { method: 'GET', path: '/login',
      config: {
        handler: function (request, reply) {
          Passport.authenticate('twitter')(request, reply);
          var html = '<a href="/auth/twitter">Login with Twitter</a>';
          if (request.session) {
            html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
          }
          reply(html);
        }
      }
    },

    { method: 'GET', path: '/auth/twitter',
      config: {
        handler: function (request, reply) {
          Passport.authenticate('twitter')(request, reply);
        }
      }
    },

    { method: 'GET', path: '/auth/twitter/callback',
      config: {
        handler: function (request, reply) {
          Passport.authenticate('twitter', {
            failureRedirect: '/login',
            successRedirect: '/',
            failureFlash: true
          })(request, reply, function () {
            reply().redirect('/');
          });
        }
      }
    },

    { method: 'GET', path: '/logout',
      config: {
        handler: function (request, reply) {
          request.session._logOut();
          reply().redirect('/');
        }
      }
    }

  ];

  return routes;


}
