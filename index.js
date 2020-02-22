const Koa = require("koa")
const Router = require("koa-router");
const views = require("koa-views");
const static = require("koa-static");
const koaBody = require("koa-body");

let app = new Koa();
let router = new Router();

app.use(views(__dirname+"/views"),{
    extension:"pug"
});
app.use(router.routes());
app.use(static(__dirname + "/static"));
app.use(koaBody());

app.listen(8787);


router.get("/", ctx=>{
    ctx.redirect("/world");
});

router.get("/index",ctx=>{
    ctx.redirect("/world");
});

router.post("/switch",  ctx=>{
    // console.log(ctx.request.body['typeOfDb'])
    // if (ctx.request.body['typeOfDb'] == 'world'){
        ctx.redirect("/world");
    // }
});

router.get("/world",async ctx=>{
    await ctx.render("world.pug");
});

router.get("/world_restaurant", async ctx=>{
    await ctx.render("world_restaurant.pug");
})

router.get("/us_restaurant", async ctx=>{
    await ctx.render("us_restaurant.pug");
    
})

