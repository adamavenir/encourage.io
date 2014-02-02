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

  authenticated = function (request, reply) {
    User.getByIndex('twitterId', request.session.user.id, function (err, user) {
      if (err) {
        console.log('err', err)
      }
      if (user) {
        console.log(user.__verymeta.data.key, 'user exists, logging in...');
        request.session.userid = user.__verymeta.data.key;
        reply().code(201).redirect('/people');
      }
      else {
        var u = User.create({
          name : request.session.user.displayName,
          twitterId : request.session.user.id,
          avatar: request.session.user._json.profile_image_url
        });
        u.save(function (err) {
          console.log('saved', u.__verymeta.data);
          reply().code(201).redirect('/people');
          request.session.userid = u.__verymeta.data.key;
        });
      }
    })
  };

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
    reply.view('formPerson', { user : user });
  };

  createPerson = function (request, reply) {

    var form = request.payload;

    User.getByIndex('twitterId', request.session.user.id, function (err, user) {
      if (err) {
        console.log(err);
      }
      else {
        var p = user.createChild(Person, {
          firstName : form.firstName,
          lastName  : form.lastName,
          email     : form.email,
          when      : form.when
        });

        p.save(function (err) {
          console.log('saved', p.__verymeta.data.fullName)
          reply().code(201).redirect('/people');
        });
      }
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
    User.load(request.session.userid, function (err, user) {
      if (err) {
        console.log(err);
      }
      else {
        user.getChildren(Person, function (err, people) {
          if (err) { console.log(err); }
          if (people.length === 0) {
            reply.view('noPeople', { user : request.session.user });
          }
          else {
            reply.view('listPeople', { people : people, user : request.session.user });
          }
        });
      }
    });

  };


 resetPerson = function (request, reply) {
    User.load(request.session.userid, function (err, user) {
      console.log('user', user);
      if (err) { console.log('err', err)}
      else {
        Person.load(request.params.person, function (err, person) {
          console.log('user', user);
          if (err) { console.log('err', err) }
          else {
            var p = user.createChild(Person, {
              firstName : person.firstName,
              lastName  : person.lastName,
              email     : person.email,
              when      : "now"
            });

            p.save(function (err) {
              console.log('reset', p.__verymeta.data.fullName)
              reply().code(201).redirect('/people');
              Person.delete(request.params.person, callback);
              var callback = console.log('deleted', request.params.person)
            });
          }
        })
      }
    })
  };


  deletePerson = function (request, reply) {
    var key = request.params.person;
    Person.delete(key, callback);
    var callback = reply.view('deleted').redirect('/people');
  };


  ///////////////// 404

  notFound = function (request, reply) {
    reply('404');
  };


}

