var config = require('config');
var https = require('https');

// test passing data to controller 
//exports.average_psi = 88;

var API_URL = config.get('PSI.apiConfig.url');
var API_KEY = config.get('PSI.apiConfig.key');
var WEBSITE_TITLE = config.get('PSI.website.siteTitle');
var data = { title: WEBSITE_TITLE };

exports.average_psi_website_title = WEBSITE_TITLE;
exports.average_psi_website_page_title = config.get('PSI.website.pageTitle');
console.log(config.get('PSI.website.siteTitle'));

var REGIONS = ['east', 'central', 'south', 'north', 'west', 'national'];

function getLast_N_Hours_DateTimes( last_number_of_hours ){

    datetime_list = []

    var today  = new Date();
    for (i=0;i<last_number_of_hours;i++){
        dt = new Date( today.getTime() - (1000 * 60 * 60 * i ) );
        //console.log(dt);
        var year = dt.getFullYear();
        var month = dt.getMonth() + 1;
        var day = dt.getDate();
        var dd = (day>9 ? '': '0') + day;
        var mm = (month>9 ? '': '0') + month;

        var hour = dt.getHours();
        var HH = (hour>9 ? '': '0') + hour;

        var query_dt=year + '-' + mm + '-' + dd + 'T' + HH + ':00:00';

        datetime_list.push( query_dt )
    }
    return datetime_list;
}


function getPSI(opts, cb) {

    https.request(opts, function(res) {
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

function getPSIReadingObject(json_object_result){
    var readings = json_object_result['items'][0]['readings']['psi_twenty_four_hourly'];
    //return JSON.stringify(readings);
    return readings;    
}

function get_average_PSI(all_readings){

    var summary = { }
    for( var i=0; i<REGIONS.length; i++ ){
        summary[REGIONS[i]] = [];
    }

    for(var i=0; i< all_readings.length; i++){
        readings = all_readings[i];
        summary['east'].push(readings['east']);
        summary['central'].push(readings['central']);
        summary['south'].push(readings['south']);
        summary['north'].push(readings['north']);
        summary['west'].push(readings['west']);
        summary['national'].push(readings['national']);
    }

    avg_psi = {};
    for( var i=0; i<REGIONS.length; i++ ){
        var region = REGIONS[i];
        var sum=0;
        var j=0

        for (j=0; j<summary[region].length; j++){
            sum+=summary[region][j];
        }
        var avg = sum/j;
        avg_psi[region] = Math.round(avg * 10) / 10;

        //avg_psi[region] = sum/j;
    }
    return avg_psi;

}

var datetime_hours_list = getLast_N_Hours_DateTimes(3);
var all_psi_data = '';
var all_readings = [];
var asyncLoop = require('node-async-loop');
asyncLoop(datetime_hours_list, function (item, next)
{
    var dt = item;
    var date = dt.substr(0,10);
    var query_param = 'date_time=' + encodeURI(dt) + '&' + 'date=' + encodeURI(date);

    // Temporary PSI api call
    var http = require('https'),
        url = require('url');

    var opts = url.parse( API_URL + query_param ),
        data = { title: 'PSI' };
    opts.headers = {};
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['api-key'] = API_KEY;
    opts.headers['method'] = 'GET';

    getPSI( opts, function(err, result){    
        if (err)
        {
            next(err);
            return;
        }
        var readings = getPSIReadingObject(result);
        all_readings.push(readings);
        next();
    });
}, function (err)
{
    if (err)
    {
        console.error('Error: ' + err.message);
        return;
    }
 
    exports.psi_data = all_readings;

    var average_psi_array = get_average_PSI(all_readings);
    console.log(JSON.stringify(average_psi_array));
    var average_psi_str = '<ol>';
    for (var k in average_psi_array){
        average_psi_str += '<li>' +  k + ':' +  average_psi_array[k] +'</li>'
    }
    average_psi_str += '</ol>';
    exports.average_psi = average_psi_str;
    console.log('Finished!');
});

