const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");

let server = new Server();
class TestC {
    constructor () {}
    async login ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let obj = ctx.request.body;
        let agnet =util.inspect(ctx.userAgent)
        let result = await server.find("admin",options,filter,orderBy,startPops,limit);
        let res = {};
        if(result[0]){
           res = {
                status:"success",
                array:result,
                code:200
            }
        }
        
        ctx.response.body = res ;
    }
}
module.exports = TestC