const http = require('https');

const options = {
  hostname: 'velonex24-api.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://www.velonex24.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Body:', body));
});

req.on('error', (e) => {
  console.error('Problem with request:', e.message);
});

req.end();
