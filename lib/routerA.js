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

// TODO 所有的请求响应放在会调用处理， 统一代码风格

// 获取用户登陆信息    用于允许使用  QQ、微信、手机号码、网站账户登陆
router.post('/post/user/login/', async (ctx) => {
    const body = ctx.request.body;
    const userAccount = body.userAccount;
    const userPasswd = tool.Encryption(body.userPasswd);
    await new Promise(async (resolve) => {
        const result = await dao.userLogin(userAccount, userPasswd);
        if (result) {
            const token = jwt.getToken({ userAccount: userAccount });
            ctx.body = {
                code: 0,
                msg: 'ok',
                token: token,
                account: userAccount,
            };
        } else {
            ctx.body = {
                code: 1,
                msg: '用户名或者密码错误',
            };
        }
        resolve();
    });
});

// 关键字搜索
router.get('/get/home/keyworld', async (ctx) => {
    const kw = ctx.query.kw;
    const count = ctx.query.count || 0;
    const len = ctx.query.len || 30;
    await Promise.all([
        new Promise((res, rej) => {
            dao.getByKeyWord(kw, count, len, (data) => (data ? res(data) : rej(data)));
        }),
        new Promise((res, rej) => {
            dao.getCountByKeyWord(kw, (data) => (data ? res(data) : rej(data)));
        }),
    ]).then(
        (res) => {
            ctx.body = {
                code: 0,
                msg: 'ok',
                len: res[0].length,
                total: res[1] && res[1][0].total,
                data: res[0],
            };
        },
        (rej) => {
            logger.warn('请求响应错误:', '/a/get/home/keyworld', `kw:${kw}`, `count:${count}`, `len:${len}`, rej);
            ctx.statusCode = 500;
        }
    );
});

// 获取所有的图片分类数据
router.get('/get/getImageCategory', async (ctx) => {
    await new Promise((res, rej) => {
        dao.getAllImageType((data) => {
            if (!data) {
                ctx.res.statusCode = 404;
                rej();
            } else {
                data = data.map((item) => item.category);
                ctx.body = {
                    code: 0,
                    msg: 'ok',
                    len: data.length,
                    data,
                };
                res();
            }
        });
    });
});

// 获取图片的指定分类数据
router.get('/get/getImageByCategory', async (ctx) => {
    const category = ctx.query.category;
    const count = ctx.query.count || 0;
    const len = ctx.query.len || 30;
    if (!category) {
        ctx.res.statusCode = 404;
        ctx.body.msg = '404';
        return;
    }
    await Promise.all([
        new Promise((res, rej) => {
            dao.getImageByCategory(category, count, len, (data) => (data ? res(data) : rej(data)));
        }),
        new Promise((res, rej) => {
            dao.getImageLenByCategory(category, (data) => (data ? res(data) : rej(data)));
        }),
    ]).then(
        (res) => {
            ctx.body = {
                code: 0,
                msg: 'ok',
                len: res[0].length,
                total: res[1] && res[1][0].total,
                data: res[0],
            };
        },
        (rej) => {
            logger.warn(
                `请求响应错误: /a/get/getImageByCategory category:${category} count:${count} len:${len} ${rej}`
            );
            ctx.statusCode = 500;
        }
    );
});

// 获取必应最近7日数据
router.get('/get/getBingDaily', async (ctx) => {
    await new Promise((res, rej) => dao.getBiyingServenDay((data) => (data ? res(data) : rej(data)))).then(
        (res) => {
            ctx.body = {
                code: 0,
                msg: 'ok',
                len: res.length,
                data: res,
            };
        },
        () => {
            ctx.body = {
                code: 1,
                msg: '查询错误',
                len: 0,
                data: [],
            };
            ctx.statusCode = 500;
        }
    );
});
