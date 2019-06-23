const router = require("koa-router")();
const bodyParser = require('koa-bodyparser')
const path = require("path");
const config = require("./config.js");
const Com = require ( "./src/api/_common")
let com = new Com();
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
    let url = ctx.path.split("/").filter(p => p!=="");
    let fn = url.pop();  
    url = url.join("")   
    let fileNames = Com.fileURL('./src/api');
    fileNames.map(f => {
      let pm = f.replace("src\\api\\","").split("\\").join("").split(".")[0];
      pageMap[pm] = require("./" + f.replace(/\\/g,"/"))
    })
    router.get('/',async(ctx, next)=>{
      ctx.response.body = `Hello api！`
    })
    router.post(path,async(ctx, next)=>{
      new pageMap[url]()[fn](ctx);
    })
    await next()
  })
  app.use(router.routes())
  .use(router.allowedMethods())
}
