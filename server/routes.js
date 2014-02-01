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

    { method: 'GET', path: '/login', handler: this.login },
    { method: 'GET', path: '/auth/twitter', handler: this.twitterAuth },
    { method: 'GET', path: '/auth/twitter/callback', handler: this.twitterCallback },
    { method: 'GET', path: '/logout', handler: this.logout }

  ];

  return routes;


}
