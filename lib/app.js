/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-11-12
 * 服务器主进程: 
 *    创建Koa服务器，并且引入路由模块
 *    加载中间件
 */

const static = require("koa-static");
const klog = require("koa-logger");
const body = require("koa-body");
const Koa = require("koa");
const app = new Koa();
const logger = require("./logger");
const config = require("./config");
const routerA = require("./routerA");
const routerV = require("./routerV");
const routerM = require("./routerM");


// 默认配置
app.listen(config.servePort, config.serveHost, () => logger.info("服务器已启动！"));
app.use(static(config.staticPath));
app.use(klog());
app.use(body());



// 全局中间件，处理完成静态资源之后
app.use(async (ctx, next) => {
  logger.info(`${ctx.protocol} ${ctx.method} ${ctx.ip} ${ctx.path} `);
  await next();
})


// 挂载其它的路由模块
app.use(routerA.routes()).use(routerA.allowedMethods());
app.use(routerV.routes()).use(routerV.allowedMethods());
app.use(routerM.routes()).use(routerM.allowedMethods());