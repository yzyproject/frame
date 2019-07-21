const router = require("koa-router")();
const bodyParser = require('koa-bodyparser')
const path = require("path");
const config = require("./config.js");
const Com = require ( "./src/api/_common")
const util = require("util");
const jwt = require('jsonwebtoken');
let com = new Com();
const Server = require("./src/model/server");
let server = new Server();
module.exports = (app)=>{
  app.use(async (ctx,next)=>{
    let pageMap = {};
    var whiteList = config.whiteList;
    if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin ? ctx.request.header.origin.split("//")[1] : "")) {
        ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        ctx.set("Content-Type", "application/json;charset=utf-8");
    }
    let pathArry = ctx.path.split("/").map(v => v.trim()).filter(v => v.length !== 0)
    let path = ctx.path;
    if(path.indexOf("\\") > -1){
      path.replace("\\","/")
    }
    let url = ctx.path.split("/").filter(p => p!=="");
    let fn = url.pop();  
    url = url.join("")   
    let fileNames = Com.fileURL('./src/api');
    
    fileNames.map(f => {
      let pm = f.replace("src/api/","").split("/").join("").split(".")[0];
      pageMap[pm] = require("./" + f)
    })
    router.get('/',async(ctx, next)=>{
      ctx.response.body = `Hello api！`
    })
    router.post(path,async(ctx, next)=>{
      if(pageMap.hasOwnProperty(url)){
        let pageMapObj =  new pageMap[url]();
        if(typeof pageMapObj[fn] === "function"){
          if(fn === "login"){
            await pageMapObj[fn](ctx);
          }else{
            let token = ctx.header.authorization || ""
            token = token.replace(/\"/g,"")
            let tokenStatus = await com.checkToken(token)
            if(tokenStatus === true){
              await pageMapObj[fn](ctx);
            }else{
              ctx.response.body = tokenStatus ;
            }
          }
        }else{
          console.error("请求的方法不存在")
        }
      }else{
        console.error("请求的路径不存在")
      }
    })
    await next()
  })
  app.use(router.routes())
  .use(router.allowedMethods())
}
