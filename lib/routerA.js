/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-10-18
 * 路由模块   /a
 *    匹配  /a 下面的所有请求
 *    此处的请求不需要登陆验证也不需要请求方式验证
 */

const Router = require('koa-router');
const router = new Router({ prefix: '/a', strict: true, sensitive: true });
const logger = require('./logger');
const tool = require('./tool');
const dao = require('./dao');
const jwt = require('./jwt');

module.exports = router;

// 路由中间件
// router.use(async (ctx, next) => {
//   await next();
// })

// 获取用户登陆信息    用于允许使用  QQ、微信、手机号码、网站账户登陆
router.post('/post/user/login/', async ctx => {
    const body = ctx.request.body;
    const userAccount = body.userAccount;
    const userPasswd = tool.Encryption(body.userPasswd);
    await new Promise(async resolve => {
        const result = await dao.userLogin(userAccount, userPasswd);
        if (result) {
            const token = jwt.getToken({ userAccount: userAccount });
            ctx.body = {
                code: 0,
                msg: 'ok',
                token: token,
                account: userAccount
            };
        } else {
            ctx.body = {
                code: 1,
                msg: '用户名或者密码错误'
            };
        }
        resolve();
    });
});
