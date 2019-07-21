const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const Com = require ( "./_common")
let com = new Com()
let server = new Server();
class TestC {
    constructor () {}
    async login ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let agnet = util.inspect(ctx.userAgent)
        let result = await server.find("admin",options,filter,orderBy,startPops,limit);
        let res = {};
        let token ="";
        if(result[0]){
            let token = await com.creatToken(ctx,result[0],agnet);
            res = {
                status:"success",
                array:result,
                token:token || "",
                code:200
            }
        }else{
            res = {
                status:"success",
                code:500,
                info:"用户名或密码不正确"
            }
        }
        ctx.response.body = res ;
    }
}
module.exports = TestC