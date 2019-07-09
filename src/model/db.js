const mysql  = require('mysql');
const config = require("../../config.js");
class DB{
    constructor(){}
    ConnectDB(sql){
        return new Promise((resolve)=>{
            let maxConnectionNum = 3;
            //处理连接失败情况
            function handleError (err) {
                if (err) {
                  // 如果是连接断开，自动重新连接
                  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    maxConnectionNum --;
                    if(maxConnectionNum >=0){
                        connect();
                    }else{
                        connection.destroy();
                    }
                  } else {
                    console.error(err.stack || err);
                  }
                }
            }
            //连接数据库
            function connect () {
                var connection = mysql.createConnection(config.mysql); 
                connection.connect(handleError);
                connection.on('error', handleError);
                connection.query(sql,function (err, result) {
                if(err){
                    console.log('[SELECT ERROR] - ',err.message);
                    return;
                }
                    resolve(result)
                });
                connection.end();
            }
            connect()
        })
    }
}
module.exports = DB;