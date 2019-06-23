const mysql  = require('mysql');
const config = require("../../config.js");
class Server{
    constructor(){}
    ConnectDB(sql){
        return new Promise((resolve)=>{
            var connection = mysql.createConnection(config.mysql); 
            connection.connect();
            connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                resolve(result)
            });
            connection.end();
        })
    }
    async findOne(options,filter,orderBy,startPops,limit){ 
        var  sql = 'select * from menus where admin_id=1 ORDER BY id desc limit 1,1';
        let res = await this.ConnectDB(sql)
    }
}
module.exports = Server;