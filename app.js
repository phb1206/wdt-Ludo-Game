var express = require("express");
var http = require("http");

var indexRouter = require("./routes/index");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/", indexRouter);
app.get("/game", indexRouter);