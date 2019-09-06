const Upload = require("./upload");
const Server = require("../model/server")
const bodyParser = require('koa-bodyparser')
const util = require("util");
const Com = require ( "./_common")
const _ = require("underscore")
let com = new Com()
let server = new Server();
let upload = new Upload();
class IndexPage {
    constructor () {}
    async getFunctions ( ctx ) {
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let agnet =util.inspect(ctx.userAgent)
        let result = await server.find("functions",options,filter,orderBy,startPops,limit);
        let res = {
            type:"000"
        };
        if(result[0]){
            res = {
                status:"success",
                array:result,
                code:200
            }
        }else{
            res = {
                status:"success",
                code:500,
                info:"服务器连接成功，没有查到数据"
            }
        }
        ctx.response.body = res ;
    }
    async getMenu(ctx){
        let obj = {};
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let result = await server.find("menu",options,filter,orderBy,startPops,limit);
        let res = {
            type:"000"
        };
        if(result[0]){
            let menuObj = {};
            //一级菜单
            let subFirst = [];
            result.map(r=>{
                if(!r.parent_id){
                    subFirst.push(r)
                }
            })
            subFirst.map(s=>{
                getChild(s.id,s,result)
            })
            menuObj.menu = subFirst;
            function getChild(id,menu,menuAll){
                let childList = [];
                menuAll.map(m=>{
                    if(m.parent_id){
                        if(id === m.parent_id){
                            childList.push(m)
                            getChild(m.id,m,menuAll)
                        }
                    }
                })
                if(childList.length>0){
                    menu.child = childList
                }
            }
            console.log("=============menuObj:",menuObj)
            res = {
                status:"success",
                menuObj:menuObj,
                code:200
            }
        }else{
            res = {
                status:"success",
                code:500,
                info:"服务器连接成功，没有查到数据"
            }
        }
        ctx.response.body = res ;
        // INSERT INTO menu( admin_id,parent_id,title,menu_url,icon,default_selected_keys,default_open_keys )
        //                VALUES
        //                ( "1","sub0004","四级菜单","/page3","user","false","false");
    }
    async addMenu( ctx ){
        let {options,fieldValue} = JSON.parse(ctx.request.body);
        let result = await server.addOne("menu",fieldValue);
        ctx.response.body = result; 
    }

    async addMenuMany( ctx ){
        let {fieldValue} = JSON.parse(ctx.request.body);
        let result = await server.addMany("menu",fieldValue);
        ctx.response.body = result; 
    }

    async udateOne( ctx ){
        let {fieldValue,whereOption} = JSON.parse(ctx.request.body);
        let result = await server.udateOne("menu",fieldValue,whereOption);
        ctx.response.body = result; 
    }

    async getCurryMenu(ctx){
        let {options,filter,orderBy,startPops,limit} = JSON.parse(ctx.request.body);
        let result = await server.find("menu",options,filter,orderBy,startPops,limit);
        let res = {
            status:"success",
            data:result[0],
            code:200
        }
        ctx.response.body = res; 
    }
    //上传图片
    async UploadFile( ctx ){
        upload.UploadImage( ctx )
        let res = {
            status:"success",
            code:200
        }
        ctx.response.body = res; 
    }
}
module.exports = IndexPage