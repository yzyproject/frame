const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const fs = require('fs');
const path = require("path");
const Com = require ( "../api/_common");
const OSS = require('ali-oss');
const crypto = require('crypto');
const config = require("../../config");
let com = new Com()
let server = new Server();
class Upload{
    constructor(ctx){
        this.file = ctx.request.files.file;
        this.UploadType = config.upload_type;
        this.imageTypeBool = true;
    }
    file2md5(filename){
        return new Promise((resv, rejc) => {
            let rs = fs.createReadStream(filename);
            let hash = crypto.createHash("md5");
            rs.on("data", hash.update.bind(hash));
            rs.on("end", function() {
              resv(hash.digest("hex"));
            });
        });
    }
    checkImageType(image_type){
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(image_type)){
           console.log("=====请上传正确的图片格式====")
           this.imageTypeBool = false;
           return false;
        }
    }
}
class LocalUpload extends Upload {
    constructor(ctx){
        super(ctx);
    }
    async UploadFile ( ctx ) {
        this.checkImageType(this.file.name);
        if(this.imageTypeBool){
            // 创建可读流
            const reader = fs.createReadStream(this.file.path);
            let filePath = path.join('static/upload') + `/${this.file.name}`;
            // 创建可写流
            const upStream = fs.createWriteStream(filePath);
            reader.pipe(upStream);
            if(this.file.length>0){
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
}
class OssUpload extends Upload{
    constructor(ctx){
        super(ctx);
    }
    async UploadFile(){
        let client = new OSS(config.oss);
        // 创建可读流
        const reader = fs.createReadStream(this.file.path);
        let md5 = await this.file2md5(this.file.path);
        // 可读流通过管道写入可写流
        let ext_name = path.extname(this.file.name);
        this.checkImageType(ext_name);
        if(this.imageTypeBool){
            let result = await client.put(md5 + ext_name, reader);
            console.log(result);
        }
    } 
}
class MultipartUpload extends Upload{
    constructor(ctx){
        super(ctx);
    }
    async  UploadFile () {
        let client = new OSS(config.oss);
        try {
            const progress = async function (p) {
                console.log(p);
            };
             // 创建可读流
            const reader = fs.createReadStream(this.file.path);
            let md5 = await this.file2md5(this.file.path);
            // 可读流通过管道写入可写流
            let ext_name = path.extname(this.file.name);
            this.checkImageType(ext_name);
            if(this.imageTypeBool){
                let result = await client.multipartUpload(md5 + ext_name, this.file.path, {
                    progress,
                    meta: {
                        year: 2017,
                        people: 'test'
                    }
               });
               let head = await client.head(md5 + ext_name);
               console.log(head);
            }
        } catch (e) {
         // 捕获超时异常
          if (e.code === 'ConnectionTimeoutError') {
            console.log("Woops,超时啦!");
            // do ConnectionTimeoutError operation
          }
          console.log(e)
        }
      }
}
class RunUpload extends Upload{
    constructor(ctx){
        super(ctx);
        this.states = {
            LocalUpload:new LocalUpload(ctx),
            OssUpload:new OssUpload(ctx),
            MultipartUpload:new MultipartUpload(ctx)
        }
        var upload_type = this.UploadType;
        this.Change(upload_type);
    }
    Change(upload_type){
        this.CurryUpload = this.states[upload_type].UploadFile();
    }
}
module.exports = RunUpload;