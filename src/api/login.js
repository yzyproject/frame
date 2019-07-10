const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const jwt = require('jsonwebtoken');
let server = new Server();
class TestC {
    constructor () {}
    async login ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let obj = ctx.request.body;
        let agnet =util.inspect(ctx.userAgent)
        let result = await server.find("admin",options,filter,orderBy,startPops,limit);
        let res = {};
        let token ="";
        if(result[0]){
            token = jwt.sign({
                name:result[0].name
            },'yzy012' //随便一点内容，撒盐：加密的时候混淆
             ,{
              expiresIn: 60 //60秒到期时间
            });
            res = {
                status:"success",
                array:result,
                token:token,
                code:200
            }
        }
        jwt.verify(token, 'yzy012', function (err, decoded) {
            if (!err){
               console.log(decoded.name); //会输出123，如果过了60秒，则有错误。
            }
        })
        ctx.response.body = res ;
    }
}
module.exports = TestC