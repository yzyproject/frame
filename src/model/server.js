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
        let fieldsArray = fields.replace(" ","").split(",")
        let fieldValues=[];
        fieldsArray.map(f=>{
            fieldValues.push("'"+fieldValue[f]+"'")
        })
        fieldValues.join(",")
        let updataValues = "ON DUPLICATE KEY UPDATE "
        function creatUpdataValues(){
             fieldsArray.map((f,i)=>{
                 if(i>0){
                    updataValues += ""+f+"='"+fieldValue[f]+"'"+`${i===fieldsArray.length-1?'':','}`+""
                 }
            })
        }
        creatUpdataValues()
        let sql = "insert into "+tablename+" ("+fields+") values ("+fieldValues+") "+updataValues+" ";
        let res = await this.ConnectDB(sql)
        let result = {
            status:"success",
            code:"200"
        }
        return result;
    }
    //一次插入多条数据
    async addMany(tablename,fieldValue){
        let fieldValueKeys=[];
        let fieldValues=[];
        let fields = _.keys(fieldValue[0]);
        fields = fields.join(",");
        function valueMany(fieldValue){
            fieldValue.map( f =>{
                let fv = _.values(f);
                let fvArray = [];
                fv.map(v=>{
                    fvArray.push("'"+v+"'");
                })
                fv = "("+fvArray.join(",")+")";
                fieldValues.push(fv);
            });
        };
        valueMany(fieldValue);
        // "INSERT INTO [表名]([列名],[列名]) VALUES ([列值],[列值])),([列值],[列值])), ([列值],[列值]));"
        let sql = "insert into "+tablename+" ("+fields+") values "+fieldValues.join(",")+" ";
        let res = await this.ConnectDB(sql);
        let result = {
            status:"success",
            code:"200"
        }
        return result;
    }
    //修改数据
    async udateOne(tablename,fieldValue,whereOpation){
        let keys = _.keys(fieldValue);
        let fieldOption = "";
        let whereValue = "";
        keys.map((k,i)=>{
            fieldOption += `${k}='${fieldValue[k]}'${i===keys.length-1?"":","}`
        })
        let whereKeys = _.keys(whereOpation);
        whereKeys.map((w,i)=>{
            whereValue += `${w}='${whereOpation[w]}'${i===whereKeys.length-1?"":" end "}`
        })
        let values = _.values(fieldValue);
        let updateSql = `UPDATE  ${tablename} SET ${fieldOption} where ${whereValue}`
        let res = await this.ConnectDB(updateSql);
        let result = {
            status:"success",
            code:"200"
        }
        return result;
    }
}
module.exports = Server;