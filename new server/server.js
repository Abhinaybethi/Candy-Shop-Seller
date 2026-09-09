const http = require('http');

const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/html');

  let message;

  if (req.url === '/home') {
    message = 'Welcome home';
  } 
  else if (req.url === '/about') {
    message = 'Welcome to About Us';
  } 
  else if (req.url === '/node') {
    message = 'Welcome to my Node Js project';
  } 
  else {
    message = 'Page Not Found';
  }

  res.end(`<h1>${message}</h1>`);
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});