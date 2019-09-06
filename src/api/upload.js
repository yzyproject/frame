const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const fs = require('fs');
const path = require("path");
const Com = require ( "./_common")
let com = new Com()
let server = new Server();
class UploadFile {
    constructor () {}
     UploadImage ( ctx ) {
        const file = ctx.request.files.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join('static/upload') + `/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        if(file.length>0){
            for (let file of files) {
                // 创建可读流
                const reader = fs.createReadStream(file.path);
                // 获取上传文件扩展名
                let filePath = path.join('static/upload') + `/${file.name}`;
                // 创建可写流
                const upStream = fs.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
            }
        }
    }
}
module.exports = UploadFile;