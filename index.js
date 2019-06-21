const Koa  = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router');
const router = require("./router");
app.use(bodyParser())
router(app)
app.listen(3005, () => {
    console.log('demo2 is run 3005 ')
})