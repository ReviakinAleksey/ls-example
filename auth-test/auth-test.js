const http = require('http');
const util = require('util');
const assert = require("assert");

const restApi = process.env.REST_API_ENPOINT;
const get = util.promisify(http.get);


const firstEndpoint = `${restApi}/first`;
console.log('Starting GET', firstEndpoint);

http.get(firstEndpoint, {headers: {'Authorization': 'token-allow'}}, (cb) => {
    assert.equal(cb.statusCode,  200);
});