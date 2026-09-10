const requestHandler = (req, res) => {
  const url = req.url;

  res.setHeader("Content-Type", "text/html");

  if (url === "/home") {
    res.end("<h1>Welcome home</h1>");
  } 
  else if (url === "/about") {
    res.end("<h1>Welcome to About Us</h1>");
  } 
  else if (url === "/node") {
    res.end("<h1>Welcome to my Node Js project</h1>");
  } 
  else {
    res.statusCode = 404;
    res.end("<h1>Page Not Found</h1>");
  }
};

module.exports = requestHandler;