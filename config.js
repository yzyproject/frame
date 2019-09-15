const config= {
    host:"149.129.100.214:3005",
    db:"ymblock",
    whiteList:"149.129.100.214:3000,149.129.100.214:3002,http://localhost:3000,http://localhost:3001",
    tokenKey:"9972c73c381fbd2d",
    mysql:{
        host     : 'localhost',       
        user     : 'root',              
        password : '123456',       
        port: '3306',                   
        database: 'total' 
    },
    upload_type:"OssUpload",
    oss:{
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAImtdqTNtyFo5T',
        accessKeySecret: 'yTXzYEcrgGAKrEbCvpqoqq52bGGW1r',
        bucket: 'mk-dev',
    }
}
module.exports = config
