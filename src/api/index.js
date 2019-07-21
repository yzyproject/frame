const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const Com = require ( "./_common")
let com = new Com()
let server = new Server();
class IndexPage {
    constructor () {}
    async getFunctions ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let agnet =util.inspect(ctx.userAgent)
        let result = await server.find("functions",options,filter,orderBy,startPops,limit);
        let res = {
            type:"000"
        };
        let token ="";
        if(result[0]){
            res = {
                status:"success",
                array:result,
                code:200
            }
        }else{
            res = {
                status:"success",
                code:500,
                info:"服务器连接成功，没有查到数据"
            }
        }
        ctx.response.body = res ;
    }
}
module.exports = IndexPage