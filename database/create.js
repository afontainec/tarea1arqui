var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE visits(id SERIAL PRIMARY KEY, os VARCHAR(40), browser VARCHAR(40), ip VARCHAR(40), date TIMESTAMP NOT NULL)');
query.on('end', function() { client.end(); });
