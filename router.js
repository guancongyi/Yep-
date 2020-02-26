const Koa = require("koa")
const Router = require("koa-router");
const views = require("koa-views");
const static = require("koa-static");
const koaBody = require("koa-body");


let app = new Koa();
let router = new Router();

app.use(views(__dirname+"/views"),{
    extension:"html"
});

app.use(static(__dirname + "/static"));
app.use(koaBody({}));

router.get("/", ctx=>{
    ctx.redirect("/world");
});

router.post("/setFilter",  ctx=>{
    let {typeOfDb, filterData} = ctx.request.body;
    console.log(typeOfDb, filterData);
    // console.log(JSON.parse(ctx.request.body))
    // if (ctx.request.body['typeOfDb'] == 'world'){
    //     console.log('got it')
    //     // ctx.redirect("/world");
    // }
    ctx.body = "sss"
});

router.get("/world",async ctx=>{
    await ctx.render("index.html", );
});

router.get("/world_restaurant", async ctx=>{
    // await ctx.render("world_restaurant.pug");
})

router.get("/us_restaurant", async ctx=>{
    // await ctx.render("us_restaurant.pug");
    
})

app.use(router.routes());
app.listen(8787);