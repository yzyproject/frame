const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
let server = new Server();
class TestC {
    constructor () {}
    async cc ( ctx ) {
        let params = ctx.request.body;
        let obj = ctx.request.body;
        let result = await server.findOne();
        let res = {
            status:"success",
            array:result
        }
        ctx.response.body = res ;
    }
}
module.exports = TestC