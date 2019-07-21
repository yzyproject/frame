const fs = require('fs');
const join = require('path').join;
const jwt = require('jsonwebtoken');
const Server = require("../model/server");
let server = new Server();
const config = require("../../config.js");
class Common{
    constructor(){}
    static fileURL(startPath){
        let result=[];
        function finder(path) {
            let files=fs.readdirSync(path);
            files = files.filter(f =>{
                if(!f.startsWith("_") && !f.startsWith(".")){
                    return f
                }
            });
            files.forEach((val,index) => {
                let fPath=join(path,val);
                let stats=fs.statSync(fPath);
                if(stats.isDirectory()) finder(fPath);
                if(stats.isFile()){
                    if(fPath.indexOf("\\")>-1){
                        fPath = fPath.replace(/\\/g,"/")
                    }
                    result.push(fPath)
                };
            });
        }
        finder(startPath);
        return result;
    }
    async creatToken(ctx,user,agnet){
        let token = jwt.sign({
            id:user.id,
            name:user.name || "",
        },config.tokenKey //自定义内容 ，可以是密钥
         ,{
          expiresIn: 60*60*24 //到期时间
        });
        let fields = "id,user_name,user_token";
        let values = "'"+user.id+"','"+user.name+"','"+token+"'"
        await server.addOne("cache",fields,values);
        return token;
    }
    async checkToken(token){
        let tokenStatus = false;
        let tokenCode = {
            statusCode:403,
            info:"未经允许禁止访问"
        };
        console.log("1")
        return new Promise((resolve)=>{
            jwt.verify(token, config.tokenKey, async function (err, decoded) {
                if (!err){
                  let id =  decoded.id || "";
                  let data = {
                    options:"user_token",
                    filter:{ id:id},
                    orderBy:"",
                    startPops:0,
                    limit:1
                  }
                  let user_token = await server.find("cache",data.options,data.filter,data.orderBy,data.startPops,data.limit)
                  if(token === (user_token[0]||{}).user_token || ""){
                    tokenStatus = true;
                    resolve(tokenStatus)
                    console.log("2")
                  }else{
                    console.log("身份验证失败")
                    resolve(tokenCode)
                  }
                }else{
                    resolve(tokenCode)
                    console.error(err)
                }
              })
        })
    }
}
module.exports = Common;