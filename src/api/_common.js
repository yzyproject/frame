const fs = require('fs');
const join = require('path').join;
const jwt = require('jsonwebtoken');
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
    creatToken(ctx,user){
        let token = jwt.sign({
            name:user.name || "",
            password:user.password
        },'yzy012' //自定义内容 ，可以是密钥
         ,{
          expiresIn: 60*60 //60秒到期时间
        });
        return token;
    }
}
module.exports = Common