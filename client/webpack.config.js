var ENV = process.env.ENV || "client";
if(ENV=="server"){
    var config=require("./build/webpack-build-server")
}else{
    config=require("./build/webpack-build-client")
}
module.exports = config;

