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
        let filterValues = [];
        let fl = {
            "%lf":"leftLike",
            "rt%":"rightLike",
            "double%":"doubleLike",
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
                        let betweenValue = filters[k].fl.split("between");
                        filterValues = filterValues.concat(betweenValue);
                        f = f + creatFilter.execute(k,fl["between"],f,filters[k]) + `${index===keys.length-1?'':' and '}`
                    }else{
                        if( filters[k].fl === "%lf"){
                            filterValues.push(`%${filters[k].value}`)
                        }else if( filters[k].fl === "rt%"){
                            filterValues.push(`${filters[k].value}%`)
                        }else if( filters[k].fl === "double%"){
                            filterValues.push(`%${filters[k].value}%`)
                        }else{
                            filterValues.push(`${filters[k].value}`)
                        }
                        f = f + creatFilter.execute(k,fl[filters[k].fl],f,filters[k]) + `${index===keys.length-1?'':' and '}`
                    }
                }else if(filters[k].value){
                    filterValues.push(`'${filters[k].value}'`)
                    f = f + `${k}=? ${index===keys.length-1?'':'and '}`
                }else{
                    filterValues.push(`${filters[k]}`)
                    f = f + `${k}=? ${index===keys.length-1?'':'and '}`
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
        sql = mysql.format(sql,filterValues);
        let res = await this.ConnectDB(sql)
        return res;
    }
    async addOne(tablename,fieldValue){
        let fields = _.keys(fieldValue);
        let fildStation = [];
        fields.map(f=>{
            fildStation.push(`?`);
        });
        let fieldValues=_.values(fieldValue);
        let updataValues = "ON DUPLICATE KEY UPDATE "
        function creatUpdataValues(){
            fields.map((f,i)=>{
                 if(i>0){
                    updataValues += `${f}='${fieldValue[f]}'${i===fields.length-1?'':','}`;
                 }
            })
        }
        creatUpdataValues();
        // let sql = "insert into "+tablename+" ("+fields+") values ("+fieldValues+") "+updataValues+" ";
        let sql = `insert into ?? (${fields}) values (${fildStation}) ${updataValues}`;
        fieldValues.unshift(tablename);
        sql = mysql.format(sql,fieldValues);
        let res = await this.ConnectDB(sql);
        let result = {
            status:"success",
            code:"200"
        }
        return result;
    }
    //一次插入多条数据
    async addMany(tablename,fieldValue){
        let fieldValueKeys=[];
        let fildStation=[];
        let fields = _.keys(fieldValue[0]);
        fields = fields.join(",");
        let fieldValues = [];
        function valueMany(fieldValue){
            fieldValue.map( f =>{
                let fv = _.values(f);
                let fvArray = [];
                fv.map(v=>{
                    fvArray.push(`?`);
                    fieldValues.push(`${v}`);
                })
                fv = `(${fvArray.join(",")})`;
                fildStation.push(fv);
            });
        };
        valueMany(fieldValue);
        // "INSERT INTO [表名]([列名],[列名]) VALUES ([列值],[列值])),([列值],[列值])), ([列值],[列值]));"
        let sql = "insert into ?? ("+fields+") values "+fildStation.join(",")+" ";
        fieldValues.unshift(tablename);
        sql = mysql.format(sql,fieldValues);
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
        let whereOpationValue = _.values(whereOpation);
        keys.map((k,i)=>{
            fieldOption += `${k}=?${i===keys.length-1?"":","}`
        })
        let whereKeys = _.keys(whereOpation);
        whereKeys.map((w,i)=>{
            whereValue += `${w}=?${i===whereKeys.length-1?"":" end "}`
        })
        let values = _.values(fieldValue);
        values.unshift(tablename);
        let c = values.concat(whereOpationValue)
        let updateSql = `UPDATE  ?? SET ${fieldOption} where ${whereValue}`
        let sql = mysql.format(updateSql,c);
        let res = await this.ConnectDB(sql);
        let result = {
            status:"success",
            code:"200"
        }
        return result;
    }
     //删除一条数据
    async Delete(tablename,whereOpation){
        let whereValue = "";
        let whereKeys = _.keys(whereOpation);
        let inserts = _.values(whereOpation);
        inserts.unshift(tablename);
        whereKeys.map((w,i)=>{
            whereValue += `${w}='?'${i===whereKeys.length-1?"":" or "}`
        })
       let sql =`delete from ?? where ${whereValue}`;
       sql = mysql.format(sql, inserts);
       let res = await this.ConnectDB(sql);
       let result = {
           status:"success",
           code:"200"
       }
    }
}
module.exports = Server;