const bodyParser = require('koa-bodyparser')
const config = require("../../config");
const redis = require("redis");
class Data{
    constructor(pageMapObj,fn){
        this.pageMapObj = pageMapObj;
        this.fn = fn;
      
    }
    //从redis取数据
    getDataFromRedis(){
        client = redis.createClient();
        client.on("error", function (err) {
            console.log("Error " + err);
        });
        client.set("string key", "string val", redis.print);
        client.hset("hash key", "hashtest 1", "some value", redis.print);
        client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
        client.hkeys("hash key", function (err, replies) {
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
            });
            client.quit();
        });
        client.get("string key", function(err, reply) {    // reply is null when the key is missing
            console.log("============reply:",reply);
        });
    }
    //数据库查询数据
    async getDataFromDB(ctx){
        let data = await this.pageMapObj[this.fn](ctx);
        ctx.response.body = data;
    }
    addRedisCach(){
        
    }
}
module.exports = Data;