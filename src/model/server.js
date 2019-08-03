const mysql  = require('mysql');
const config = require("../../config.js");
const _ = require("underscore");
const CreatFilter = require("./creat_filter")
const creatFilter = new CreatFilter();
const DB = require("./db.js")
class Server extends DB{
    constructor(){
        super()
    }
    async find(tablename,options,filter,orderBy,startPops,limits){  
        let fl = {
            "lf%":"leftLike",
            "rt%":"rightLike",
            ">":"exceed",
            ">=":"exceedOrEqual",
            "<":"below",
            "<=":"belowOrEqual",
            "between":"between",
        }
        function filterString(filters){
            let f= ' where '
            let keys = _.keys(filters)
            if(keys.length<=0){
                f=""
            }
            keys.map((k,index)=>{
                if(filters[k] && filters[k].fl){
                    if(filters[k].fl.indexOf("between")>-1){
                        f = f + creatFilter.execute(k,fl["between"],f,filters[k]) + `${index===keys.length-1?'':' and '}`
                    }else{
                        f = f + creatFilter.execute(k,fl[filters[k].fl],f,filters[k]) + `${index===keys.length-1?'':' and '}`
                    }
                }else if(filters[k].target){
                    f = f + `${k}="${filters[k].target}" ${index===keys.length-1?'':'and '}`
                }else{
                    f = f + `${k}="${filters[k]}" ${index===keys.length-1?'':'and '}`
                }
            })
            if(limits){
                if(startPops){
                    f = f + "limit "+startPops+","+limits+" "
                }else{
                    f = f + "limit "+limits+" "
                }
            }
            return f;
        }
        if(!options){
            options = "*"
        }
        let sql = "select "+options+" from "+tablename+" "+filterString(filter)+"  "
        let res = await this.ConnectDB(sql)
        return res;
    }
    async addOne(tablename,fields,fieldValue){
        let fieldsArray = fields.split(",")
        let fieldValueArray = fieldValue.split(",")
        let updataValues = "ON DUPLICATE KEY UPDATE "
        function creatUpdataValues(){
             fieldsArray.map((f,i)=>{
                 if(i>0){
                    updataValues += ""+f+"="+fieldValueArray[i]+""+`${i===fieldValueArray.length-1?'':','}`+""
                 }
            })
        }
        creatUpdataValues()
        let sql = "insert into "+tablename+" ("+fields+") values ("+fieldValue+") "+updataValues+" ";
        let res = await this.ConnectDB(sql)
        let a = "aa"
    }
}
module.exports = Server;