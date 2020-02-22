const Koa = require("koa")
const Router = require("koa-router");
const static = require("koa-static");
// const koaBody = require("koa-body");


let app = new Koa();
app.use(static(__dirname + "/static"));
// app.use(koaBody());
let router = new Router();


router.get("/",ctx=>{
    ctx.render("index.pug");
})

router.get("/world", ctx=>{
    ctx.body = 'world'
})

router.get("/world_restaurant", ctx=>{
    ctx.body = 'world_restua'
})

router.get("/us_restaurant", ctx=>{
    ctx.body = 'us'
})

app.use(router.routes());
app.listen(8787);