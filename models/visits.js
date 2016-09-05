var pg = require('pg');
var path = require('path');
var q = require('q');
var connectionString = require(path.join(__dirname, '../', 'config'));

var initial_date = new Date(2016, 7, 9, 21, 0 , 0);

exports.all = function(callback) {
  var deferrer = q.defer();
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        deferrer.reject(err);
      }

      // SQL Query > Delete Data
      var query = client.query("SELECT * FROM visits ORDER BY id DESC");

      // SQL Query > Select Data

      results = [];

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          deferrer.resolve(results);
      });
      deferrer.promise.nodeify(callback);
      return deferrer.promise;
  });
};













exports.create = function(attr, callback) {
  var deferrer = q.defer();


  pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        deferrer.reject(err);
      }
      var visit = parseToVisit(attr);
      var string_query = buildInsertIntoQuery(visit);
      // SQL Query > Delete Data
      var query = client.query(string_query, visit.values);

      // SQL Query > Select Data

      results = [];

      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
          done();
          deferrer.resolve(results);
      });
      deferrer.promise.nodeify(callback);
      return deferrer.promise;
  });
};


parseToVisit = function(attr, event_id) {

      var visit = {
          keys: [],
          values: []
      };


      //Add keys
      visit.keys.push("os"); //0
      visit.keys.push("browser"); //1
      visit.keys.push("ip"); //2
      visit.keys.push("date"); //33


      //Add attributes
      visit.values.push(attr.os); //0
      visit.values.push(attr.browser); //1
      visit.values.push(attr.ip); //2
      var date = new Date();
      var date2 = new Date();
      // date2.setHours(date.getHours() - 3);
      visit.values.push(date2); //3


      return visit;
};

function buildInsertIntoQuery(params) {

    query = "INSERT INTO visits(";
    for (var j = 0; j < params.keys.length; j++) {
        query += " " + params.keys[j] + ",";
    }
    //delete the last ","
    query = query.substring(0, query.length - 1);


    query += ") values(";
    for (var i = 0; i < params.keys.length; i++) {
        query += " $" + (i + 1) + ",";
    }

    //delete the last ","
    query = query.substring(0, query.length - 1);

    query += ");";

    return query;
}
