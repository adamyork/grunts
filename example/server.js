var express = require('express');
var app = express();
app.use(express.static('public'))

app.listen(8085);
console.log('local application server started on port 8085.');
console.log('ctrl-c to exit.');