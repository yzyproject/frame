const config= {
    host:"149.129.100.214:3005",
    dbURL:"mongodb://149.129.100.214:27017/",
    db:"ymblock",
    whiteList:"149.129.100.214:3000,149.129.100.214:3002,http://localhost:3000,http://localhost:3001",
    mysql:{
        host     : 'localhost',       
        user     : 'root',              
        password : '123456',       
        port: '3306',                   
        database: 'total' 
    }
}
module.exports = config
