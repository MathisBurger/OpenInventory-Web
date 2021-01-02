const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/Frontend-Web'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/Frontend-Web/index.html'));
});

app.get('/api/*', function(req,res) {
  res.redirect("http://localhost:8080");
});
app.listen(80);
console.log("Started Webserver on port 8080");
