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
    // async find(tanleName,options,filter,orderBy,startPops,limit){ 
    //     var  sql = `select ${options} from ${tanleName} where ${filter} order by ${orderBy} limit ${startPops},${limit}`;

    //     let res = await this.ConnectDB(sql)
    //     return res;
    // }
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
        function filterSring(filters){
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
            return f;
        }
        
        let sql = "select "+options+" from "+tablename+" "+filterSring(filter)+" "
        let res = await this.ConnectDB(sql)
        return res;
    }
}
module.exports = Server;