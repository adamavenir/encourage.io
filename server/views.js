var Person = require('./models/Person');
var User = require('./models/User');

module.exports = function views(server) {

  var Passport = server.plugins.travelogue.passport;

  ///////////////// INDEX

  index = function (request, reply) {
    if (request.session.user) {
      var user = request.session.user;
      user.img = user._json.profile_image_url;
      reply.view('index', { user : user });
    }
    else {
      reply.view('index');
    }
  };


  ///////////////// AUTH

  login = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };

  dologin = function (request, reply) {
    var user = request.session.user;
    var u = User.create({
      name : user.displayName,
      twitterId  : user.id,
      avatar: user._json.img
    });
    u.save(function (err) {
      reply().code(201).redirect('/people');
    });
  }

  logout = function (request, reply) {
    request.session._logOut();
    reply().redirect('/');
  };

  twitterAuth = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
  };

  twitterCallback = function (request, reply) {
    Passport.authenticate('twitter', {
      failureRedirect: '/login',
      successRedirect: '/authenticated',
      failureFlash: true
    })(request, reply, function () {
      reply().redirect('/authenticated');
    });
  };

  session = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };  


  ///////////////// PEOPLE

  formPerson = function (request, reply) {
    var user = request.session.user;
    user.img = user._json.profile_image_url;
    reply.view('formPerson', { user : user });
  };

  createPerson = function (request, reply) {
    var Passport = server.plugins.travelogue.passport;
    Passport.authenticate('twitter')(request, reply);
    var form = request.payload;
    var u = User.getByIndex('twitterId', request.session.user.id);
    var p = u.createChild(Person, {
      firstName : form.firstName,
      lastName  : form.lastName,
      email     : form.email,
      when      : form.when
    });
    p.save(function (err) {
      u.getChildren(Person, function (err, objs) {
        objs.forEach(function (person) {
          console.log(person.__verymeta.parent.fullName + "adding: " + person.fullName);
          reply().code(201).redirect('/people');
        })
      })
    });
  };

  getPerson = function (request, reply) {
    Person.load(Person.options.prefix + request.params.person, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        reply.view('person', value);
      }
    });
  };

  listPeople = function (request, reply) {
    Person.all(function(err, data) {
      var user = request.session.user;
      user.img = user._json.profile_image_url;
      if(data.length === 0) {
        reply.view('noPeople', { user : user });
      }
      else {
        reply.view('listPeople', { people : data, user : user });  
      }
    });
  };

  deletePerson = function (request, reply) {
    var key = Person.options.prefix + request.params.person;
    Person.delete(key, callback);
    var callback = reply.view('deleted').redirect('/people');
  };


  ///////////////// 404

  notFound = function (request, reply) {
    reply('404');
  };


}

