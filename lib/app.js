/**
 * @author    hc
 * @time      2019-10-18
 * @change    2020-04-26
 * 服务器主进程:
 *    创建Koa服务器，并且引入路由模块
 *    加载中间件
 */

const static = require('koa-static');
const klog = require('koa-logger');
const body = require('koa-body');
const Koa = require('koa');
const app = new Koa();
const logger = require('./logger');
const config = require('./config');
const routerA = require('./routerA');
const routerV = require('./routerV');
const routerM = require('./routerM');
const schedule = require('./schedule');

// 默认配置
// TODO 可以尝试使用https协议 加密传输
app.listen(config.servePort, config.serveHost, () => {
    logger.info(`服务器已启动：http://${config.serveHost}:${config.servePort}`);
});
app.use(static(config.staticPath));
app.use(klog());
app.use(
    body({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024,
        },
    })
);

// 全局中间件，统一处理所有的请求
app.use(async (ctx, next) => {
    // 允许跨域 或者直接制定某些 域名可以访问
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,X-Requested-With,Accept,authorization');
    ctx.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PATCH');
    ctx.set('Access-Control-Allow-Credentials', true);
    logger.info(`${ctx.protocol} ${ctx.method} ${ctx.ip} ${ctx.path} `);

    // option 请求直接返回 200
    if (/OPTIONS/gi.test(ctx.request.method)) {
        ctx.response.status = 200;
        ctx.body = { code: 0, msg: 'ok' };
    } else {
        // 非OPTION请求继续处理
        await next();
    }
});

// 全局属性 挂载在global上
global.myArgs = {
    // 允许执行的爬虫模块
    spiders: ['360', 'bing', 'jinshan'],
};

// 开启定时任务
schedule.newSpider();

// 挂载其它的路由模块
app.use(routerA.routes()).use(routerA.allowedMethods());
app.use(routerV.routes()).use(routerV.allowedMethods());
app.use(routerM.routes()).use(routerM.allowedMethods());
