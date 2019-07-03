const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
let server = new Server();
class TestC {
    constructor () {}
    async cc ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let obj = ctx.request.body;
        let result = await server.findOne("admin",options,filter,orderBy,startPops,limit);
        let res = {
            status:"success",
            array:result
        }
        ctx.response.body = res ;
    }
}
module.exports = TestC