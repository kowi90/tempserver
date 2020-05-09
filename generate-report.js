fs = require('fs');

function generate () {
let rawdata = fs.readFileSync('db.json');
let weather = JSON.parse(rawdata);

const rawReport = weather.tempdata.reduce((acc, curr) => {
    const date = new Date(curr.createdAt)
    const sqldate = date.toISOString().substring(0, 10);
    return {...acc, ...{
        [sqldate] : [
            ...(acc[sqldate] ? acc[sqldate] : []),
            curr
        ]
    }}
},{});

const report = Object.keys(rawReport).reduce((acc, curr) => {
    return {
        ...acc,
        [curr]: {
            avg: (rawReport[curr].reduce((a, c) => a + parseInt(c.value, 10), 0) / rawReport[curr].length).toFixed(2),
            max: rawReport[curr].reduce((a, c) => ((c.value > a) ? c.value : a), 0),
            min: rawReport[curr].reduce((a, c) => ((c.value < a) ? c.value : a), 100),
        }};
}, {});

    return new Promise((resolve,rej) => {
        fs.writeFile('report.json', JSON.stringify(report), function (err) {
            if (err) {
                resolve({ status: 'error', error: err})
            }
            resolve({ status: 'done'});
          });
    });
}

module.exports = { generate };