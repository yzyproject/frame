const Koa  = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const static = require('koa-static');
const Router = require('koa-router');
const router = require("./router");
const userAgent = require('koa-useragent');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(static('/static'));
app.use(bodyParser({
    enableTypes:['json', 'form', 'text']
}))
app.use(userAgent);
router(app)
app.listen(3005, () => {
    console.log('demo2 is run 3005 ')
})