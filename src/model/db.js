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
                const pool = mysql.createPool(config.mysql);
                let query = function(sql,callback){  
                    pool.getConnection(function(err,connection){
                        if(err){
                            console.log("=======err:",err);
                        }  
                        connection.query(sql,function(err,results){  
                            callback(err, results) // 结果回调
                            connection.release() // 释放连接资源 | 跟 connection.destroy() 不同，它是销毁
                       })
                    })
                }
                // 随机分配一个连接
                pool.query(sql, function (err, result) {
                    if(err){
                        console.log('[SELECT ERROR] - ',err.message);
                        return;
                    }
                    resolve(result)
                })
            }
            connect()
        })
    }
}
module.exports = DB;