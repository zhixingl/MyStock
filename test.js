util = require('util');

//util.log("This is log!");
util.error("This is error!");
var str = util.format("THis is number %d", 12);
//util.log(str);
util.log("THis is number %d", 12);
util.log(str);