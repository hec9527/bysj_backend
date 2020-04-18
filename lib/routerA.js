/**
 * @author    hc
 * @time      2019-10-18
 * @change    2020-04-18
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
const fs = require('fs');

module.exports = router;

// 路由层中间件，包含next方法，否则后续路由不会执行
router.use(async (ctx, next) => {
    await next();
});

// 获取用户登陆信息
router.post('/post/userLogin', async (ctx) => {
    const body = ctx.request.body;
    // 使用账号登录
    if (body.loginType === 0) {
        const count = body.userName.replace("'", ''); // 防止SQL注入攻击，禁止使用'
        const passwd = tool.Encryption(body.userPasswd); // 加密用户密码，对比数据库
        if (tool.isEmty(count) || tool.isEmty(passwd)) {
            return (ctx.body = { code: 1, msg: '用户名和密码不能为空' });
        }
        await new Promise((res, rej) => {
            dao.getUserByCount(count, passwd, (data) => (data ? res(data) : rej(data)));
        }).then(
            (res) => {
                // 正常是1条或者0条数据
                if (res.length === 1) {
                    ctx.body = {
                        code: 0,
                        msg: '登录成功',
                        token: jwt.getToken({
                            id: res[0].id,
                            count: res[0].count,
                            name: res[0].name,
                        }),
                    };
                } else if (res.length === 0) {
                    ctx.body = { code: 1, msg: '用户名或者密码错误' };
                } else {
                    logger.warn(`脏数据：${count}`);
                    ctx.statusCode = 500;
                }
            },
            () => (ctx.statusCode = 500)
        );
    } else {
        ctx.body = '暂不支持的方式登录！';
    }
});

// 用户注册
router.post('/post/userRegist', async (ctx) => {
    const body = ctx.request.body;
    const count = body.userName.replace("'", ''); // 防止SQL注入攻击，禁止使用'
    const passwd = tool.Encryption(body.userPasswd); // 加密用户密码，对比数据库
    if (tool.isEmty(count) || tool.isEmty(passwd)) {
        return (ctx.body = { code: 1, msg: '用户名和密码不能为空' });
    }
    await new Promise((res, rej) => {
        dao.getUserExistsByCount(count, (data) => (data ? res(data) : rej(data)));
    }).then(
        async (res) => {
            if (res.length >= 1) {
                ctx.body = { code: 1, msg: '用户名已存在' };
            } else {
                await new Promise((res, rej) => {
                    dao.addUserByCount(count, passwd, (data) => (data ? res(data) : rej(data)));
                }).then(
                    (res) => {
                        // 注册成功  id: insertId
                        if (res.affectedRows === 1) {
                            ctx.body = { code: 0, msg: '注册成功' };
                        } else {
                            logger.warn(res);
                            ctx.body = { code: 1, msg: '注册失败，未知错误' };
                        }
                    },
                    () => (ctx.statusCode = 500)
                );
            }
        },
        () => (ctx.statusCode = 500)
    );
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
            logger.warn(`请求响应错误: ${ctx.req.url} category:${category} count:${count} len:${len} ${rej}`);
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

// 获取最新金山词典数据
router.get('/get/getEnglishDaily', async (ctx) => {
    await new Promise((res, rej) => dao.getEnglishDaily((data) => (data ? res(data) : rej(data)))).then(
        (res) => {
            ctx.body = {
                code: 0,
                msg: 'ok',
                len: 1,
                data: res,
            };
        },
        () => (ctx.statusCode = 500)
    );
});

// TODO 可以将所有的图片上传接口统一成一个接口，根据参数的不同调用不同的功能实现
// 以图搜图
router.post('/post/imageIdentify', async (ctx) => {
    ctx.body = { code: 1, msg: 'API暂停使用' };
    return;
    const ext = ctx.request.files.file.name.split('.')[1];
    const fileName = tool.getTimeString() + ((Math.random() * 20000000) | 0) + `.${ext}`;
    const file = ctx.request.files.file;

    await new Promise((res, rej) => {
        const reader = fs.createReadStream(file.path);
        const stream = fs.createWriteStream(__dirname + '/../temp/' + fileName);
        reader.pipe(stream);
        reader.on('close', () => {
            // 上传完成
            // 存在的问题 不能快速索引数据库表
            // dao.getImageByIdentify();
            // 暂时不处理这个API的请求
        });
    });
});
