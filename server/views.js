var Person = require('./models/Person');

module.exports = function views(server) {

  ///////////////// INDEX

  index = function (request, reply) {
    reply.view('index');
  };

  ///////////////// PEOPLE

  formPerson = function (request, reply) {
    reply.view('formPerson');
  };

  createPerson = function (request, reply) {
    var Passport = server.plugins.travelogue.passport;
    Passport.authenticate('twitter')(request, reply);
    var form = request.payload;
    var p = Person.create({
      name  : form.name,
      email : form.email,
      when  : form.when,
      uid   : request.session.user.id
    });
    console.log('uid:', request.session.user.id);
    p.save(function (err) {
      Person.load(p.key, function (err, person) {
        reply().code(201).redirect('/people');
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
      if(data.length === 0) {
        reply.view('noPeople');
      }
      else {
        reply.view('listPeople', { people : data});  
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

