const router = require("koa-router")();
const fs = require("fs");
const path = require("path");
//数组去空
module.exports = (app)=>{
    app.use(async (ctx,next)=>{
        let pathArry = ctx.path.split("/").map(v => v.trim()).filter(v => v.length !== 0)
        let url = ctx.path;
        let urls = ctx.path.split("/");        
        let clt = urls[urls.length-1] || "/";
        let registers = clt;
        router.get('/',async(ctx, next)=>{
            let a = "a"
            // let {name, password} = ctx.request.body
            ctx.response.body = `Hello！`
        })
        router.post('/user/register',async(ctx, next)=>{
            let {name, password} = ctx.request.body
            if( name === 'ikcamp' && password === '123456' ){
              ctx.response.body = `Hello， ${name}！`
            }else{
              ctx.response.body = '账号信息错误'
            }
        })
        await next()
    })
    app.use(router.routes())
    .use(router.allowedMethods())
}
