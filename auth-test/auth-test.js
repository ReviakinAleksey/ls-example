const http = require('http');
const util = require('util');
const assert = require("assert");

const restApi = process.env.REST_API_ENPOINT;


const firstEndpoint = `${restApi}/first`;
const public = `${restApi}/public`;
console.log('Starting GET', firstEndpoint);


function debugFunc(res, cb) {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
        rawData += chunk;
    });
    res.on('end', () => {
        cb(null, rawData);
    });
}

const debugResponse = util.promisify(debugFunc);

http.get(firstEndpoint, {headers: {'Authorization': 'token-disallow'}}, (cb) => {
    debugResponse(cb)
        .then((response) => {
            console.log('TEST1', 'Received status:', cb.statusCode);
            console.log('TEST1', 'Response:', response);
            assert.notEqual(cb.statusCode, 200);
        });
});

http.get(firstEndpoint, {headers: {'Authorization': 'token-allow'}}, (cb) => {
    debugResponse(cb)
        .then((response) => {
            console.log('TEST2', 'Received status:', cb.statusCode);
            console.log('TEST2', 'Response:', response);
            assert.equal(cb.statusCode, 200);
        });
});

http.get(public, {}, (cb) => {
    debugResponse(cb)
        .then((response) => {
            console.log('TEST3', 'Received status:', cb.statusCode);
            console.log('TEST3', 'Response:', response);
            assert.equal(cb.statusCode, 200);
        });
});