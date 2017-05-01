var last_number_of_hours = 3

function getLast_N_Hours_DateTimes( last_number_of_hours ){

    datetime_list = []

    var today  = new Date();
    for (i=0;i<last_number_of_hours;i++){
        dt = new Date( today.getTime() - (1000 * 60 * 60 * i ) );
        console.log(dt);
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

list = getLast_N_Hours_DateTimes(last_number_of_hours);
console.log(list);
