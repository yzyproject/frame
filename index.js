const Koa  = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router');
const router = require("./router");
app.use(bodyParser())
router(app)
let a=5;
let b = 3;
app.listen(3000, () => {
    console.log('demo2 is run 3000 ')
})