const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
let server = new Server();
class TestC {
    constructor () {}
    cc ( ctx ) {
        let params = ctx.request.body;
        let obj = ctx.request.body;
        let result = server.findOne();
        ctx.response.body = result;
    }
}
module.exports = TestC