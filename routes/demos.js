const { TooManyRequests } = require('http-errors');
const fetch = require('node-fetch');
var moment = require('moment-timezone');
var dateFormat = require('dateformat');
const { now } = require('moment-timezone');

var cron = require('node-cron');


exports.demo = async (req, res, next) => {
    fetch('http://localhost:3000/services', {
        method: 'GET'
    }).then((response) => {
        response.json().then((jsonResponse) => {
            jsonResponse.forEach(element => {
                console.log('-----------------');
                if (element.current_state === 1 || 2) {
                    console.log(element.host_name);
                    console.log(`error found for ${element.host_name}`);
                } else {
                    console.log("error");
                }
                console.log('-----------------');
            });
        })
        // assuming your json object is wrapped in an array

    }).catch((err) => {
        console.log(`Error: ${err}`)
    });

    return res.json("h")
}



cron.schedule('* * * * *', () => {

(async (req, res ,next) => {
    fetch('http://localhost:3210/services', {
        method: 'GET'
    }).then((response) => {
        response.json().then((jsonResponse) => {
            jsonResponse.forEach(element => {


           
                if (element.current_state == 0) {
                //    console.log("OK");
          
                } else {
                    console.log('-----------------');
                    function sendMail() {
                        if (element.current_state == 2) {
                            let Globalaa = element.current_state = 'critical' 
                            // console.log(element.current_state);
                        }
                        if (element.current_state == 1) {
                            let Globalaa = element.current_state = 'warning' 
                        }
                        const body = { title: element.host_name , services: element.service_description, statusof: element.current_state , assign_to: "", priorities:"urgent", breach:"null", actions: "triggered"};
                                                                                   
                         fetch('http://164.52.201.141:3005/demo/5', {
                            method: 'post',
                            body:    JSON.stringify(body),
                            headers: { 'Content-Type': 'application/json' },
                        })
                        .then(res => res.json())
                        .then(json => console.log(json));
                    }
                    sendMail()
                    console.log(element.current_state);
                    console.log(element.host_name);
                    console.log(`error found for ${element.host_name}`);

                    
                    console.log('-----------------');
                }
            });
        })
       
        
    }).catch((err) => {
        console.log(`Error: ${err}`)
    });
    
    // return res.json("h")
} )();

});


// console.log(moment().format('DD/MM/YYYY h:mm:ss a')); 
// // var now = new Date();
// const datess = `${dateFormat(now, "dd/mm/yyyy h:MM:ss tt")}`
// console.log(datess);
// const dateNow = `${moment().format('DD/MM/YYYY h:mm:ss a')}`
// const dateNow1 = `${moment().format('DD/MM/YYYY h:mm:ss a')}`
//  const timestart = moment().add(120, 'minutes').format('DD/MM/YYYY h:mm:ss a')
//  const timeminus = moment().subtract(60, 'minutes').format('DD/MM/YYYY h:mm:ss a')
//  console.log(timestart)
//  console.log(timeminus);
// if (datess != dateNow) {
//     console.log("dates are not matching");
// } else {
//     console.log("matching");
// }

// const title = ['google.com' , 'facebook.com']
// console.log(title);

// var daty = '27/11/2020 03:40:21 PM'

// var minus =  moment().subtract(60, 'minutes').format('DD/MM/YYYY h:mm:ss a')



// var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
// m.hours(); // 5
// m.add(24, 'hours').hours();

// console.log(m);