import http from 'http';
const app = require('./appConfig');

module.exports = http.createServer(app);

