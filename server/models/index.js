var models = {
  Person: require('./Person'),
};

function attachDB(db) {
  Object.keys(models).forEach(function (modelname) {
    models[modelname].options.db = db;
  });
}

module.exports = {
  models: models,
  attachDB: attachDB
};