var https = require('https');

// test passing data to controller 
exports.average_psi = 88;

// Get current date and time  YYYY-mm-ddTHH:Min:S format

var today  = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();
var dd = (day>9 ? '': '0') + day;
var mm = (month>9 ? '': '0') + month;
var date = year + '-' + mm + '-' + dd;

// Temporary PSI api call
var http = require('https'),
    url = require('url');

var opts = url.parse('https://api.data.gov.sg/v1/environment/psi?date_time=2017-05-02T01%3A25%3A15&date=2017-05-02'),
    data = { title: 'Test' };
opts.headers = {};
opts.headers['Content-Type'] = 'application/json';
opts.headers['api-key'] = 'wF6sWKjwfrGdfsWz9tCe4nFjsuS0nTLF';
opts.headers['method'] = 'GET';

function getPSI(options, cb) {

    http.request(opts, function(res) {
      var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var result = JSON.parse(body);
            cb(null, result);
        });
        res.on('error', cb);

      // do whatever you want with the response
      res.pipe(process.stdout);
    }).end(JSON.stringify(data));
}

getPSI( opts, function(err, result){
    if (err){
        return console.log('Error while trying to get the PSI data.', err);
    }
    console.log(result);
    exports.psi_data = JSON.stringify(result);
});

