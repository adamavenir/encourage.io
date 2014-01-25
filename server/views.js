var Person = require('./models/Person');

///////////////// INDEX

exports.index = function (request, reply) {
  reply.view('index');
};


///////////////// PEOPLE

exports.formPerson = function (request, reply) {
  reply.view('formPerson');
};

exports.createPerson = function (request, reply) {
  var form = request.payload;
  var p = Person.create({
    name  : form.name,
    email : form.email,
    when  : form.when
  });
  p.save(function (err) {
    Person.load(p.key, function (err, person) {
      reply().code(201).redirect('/people');
    })
  });
};

exports.listPeople = function (request, reply) {
  Person.all(function(err, data) {
    if(data.length === 0) {
      reply.view('noPeople');
    }
    else {
      reply.view('listPeople', { people : data});  
    }
  });
};

exports.deletePerson = function (request, reply) {
  var key = 'people!' + request.params.person;
  Person.delete(key, callback);
  var callback = reply.view('deleted').redirect('/people');
};


///////////////// 404

exports.notFound = function (request, reply) {
  reply('404');
};