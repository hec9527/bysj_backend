/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-10-18
 * 路由模块   /a 
 *    匹配  /a 下面的所有请求
 *    此处的请求不需要登陆验证也不需要请求方式验证
 */

const Router = require("koa-router");
const router = new Router({ "prefix": "/a", "strict": true, "sensitive": true });


module.exports = router;

// /a 路由中间件
router.use(async (ctx, next) => {
    console.log(1);
    await next();
})






router.get("/new", ctx => {
    ctx.body = "xxxx";
})


