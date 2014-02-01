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

    { method: 'GET',  
      path: '/', 
      handler: this.index 
    },

    // PEOPLE
    { method: 'GET',  
      path: '/people', 
      config: { auth: 'passport' }, 
      handler: this.listPeople 
    },
    { method: 'GET',
      path: '/people/{person}', 
      config: { auth: 'passport' }, 
      handler: this.getPerson 
    },
    { method: 'GET',  
      path: '/people/add', 
      config: { auth: 'passport' }, 
      handler: this.formPerson 
    },
    { method: 'POST', 
      path: '/people/add', 
      config: { auth: 'passport' }, 
      handler: this.createPerson 
    },
    { method: 'GET', 
      path: '/people/delete/{person}', 
      config: { auth: 'passport' }, 
      handler: this.deletePerson 
    },

    // AUTH

    { method: 'GET', path: '/login', handler: this.login },
    { method: 'GET', path: '/session', handler: this.session },
    { method: 'GET', path: '/auth/twitter', handler: this.twitterAuth },
    { method: 'GET', path: '/auth/twitter/callback', handler: this.twitterCallback },
    { method: 'GET', path: '/logout', handler: this.logout }

  ];

  return routes;


}
