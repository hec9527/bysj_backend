/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-10-18
 * 服务器主进程: 
 *    创建Koa服务器，并且引入路由模块
 */


const Koa = require("koa");
const app = new Koa();
const body = require("koa-body");
const static = require("koa-static");
const logger = require("./logger");
const config = require("./config");
const routerA = require("./routerA");
const routerV = require("./routerV");
// const dao = require("./dao");


app.listen("80", "localhost", () => logger.info("服务器已启动！"));
app.use(static(config.staticPath));


// 全局中间件，处理完成静态资源之后
app.use(async (ctx, next) => {
    logger.info(`${ctx.protocol} ${ctx.method} ${ctx.ip} ${ctx.path} `);
    await next();
    // if (!ctx.body) {
    //     // console.log("404");
    //     ctx.res.statusCode = 404;
    //     ctx.body = "404";
    // }
})


app.use(routerA.routes()).use(routerA.allowedMethods());
app.use(routerV.routes()).use(routerV.allowedMethods());