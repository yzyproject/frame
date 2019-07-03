const mysql  = require('mysql');
const config = require("../../config.js");
const _ = require("underscore");
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
    async findOne(tablename,options,filter,orderBy,startPops,limits){ 
        // let sql = "select "+options+" from "+tablename+" where "
        function filterSring(filters){
            let f= ''
            let keys = _.keys(filters)
            keys.map((k,index)=>{
                f =f + `${k}=${filters[k]} ${index===keys.length-1?'':'and'}`
            })
            return f;
        }
        let sql = "select "+options+" from "+tablename+" where "+filterSring(filter)+" "
        // var  sql = 'select * from menus where admin_id=1 ORDER BY id desc limit 1,1';
        let res = await this.ConnectDB(sql)
        return res;
    }
}
module.exports = Server;