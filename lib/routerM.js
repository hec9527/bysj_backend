/**
 * @author     hc
 * @time       2019-11-12
 * @change     2019-11-12
 *
 *      后台管理API
 *
 * 该后台API需要验证用户并且用户为管理员
 *
 */

const Router = require('koa-router');
const logger = require('./logger');
const config = require('./config');
const dao = require('./dao');
const { spawn } = require('child_process');
const tool = require('./tool');
const path = require('path');
const jwt = require('./jwt');
const router = new Router({ prefix: '/m', sensitive: 'true', strict: 'true' });

module.exports = router;

// 手动爬取新的数据
router.get('/spiderNewData', async (ctx) => {
    const enter = path.join(__dirname, '../main.py');
    const id = ctx.query.id;
    const lis = ['360', 'jinshan', 'bing'];
    const spider = lis[id] || undefined;
    if (spider) {
        console.log(`python3 ${enter} ${spider}`);
        const cp = spawn(`python3`, [enter, spider]);
        cp.on('message', (msg) => {
            console.log(msg);
        });
        cp.on('close', () => {
            logger.debug(`爬虫任务《${spider}》运行结束...`);
        });
        ctx.body = {
            code: 0,
            msg: '爬虫处理时间比较长，先看点别的吧',
            body: [],
        };
    } else {
        ctx.body = {
            code: 1,
            msg: `未知参数${id}`,
            body: [],
        };
    }
});

// 获取所有用户信息
router.get('/get/allUserInfo', async (ctx) => {
    const len = ctx.query.len || 100; // 长度
    const count = ctx.query.count || 0; // 偏移
    await new Promise((res, rej) => {
        dao.getAllUserInfo(count, len, (data) => (data ? res(data) : rej(data)));
    }).then(
        (res) => {
            //  过滤掉用户的密码等隐私信息
            const data = res.map((item) => {
                Reflect.deleteProperty(item, 'passwd');
                return item;
            });
            ctx.body = {
                code: 0,
                msg: 'ok',
                data: data,
                len: data.length,
            };
        },
        () => {
            ctx.status.code = 500;
        }
    );
});

// 删除用户信息
router.get('/delete/userInfo', async (ctx) => {
    const id = Number(ctx.query.id) || undefined;
    if (id) {
        await new Promise((res, rej) => {
            dao.deleteUserInfo(id, (data) => (data ? res(data) : rej(data)));
        }).then(
            () => (ctx.body = { code: 0, msg: '删除成功' }),
            () => (ctx.statusCode = 500)
        );
    } else {
        logger.debug(`删除用户未知参数:${id}`);
        ctx.body = { code: 1, msg: '未知参数' };
    }
});

// 修改用户信息
router.post('/update/userInfo', async (ctx) => {
    const body = ctx.request.body || undefined;
    if (body && body.count) {
        await new Promise((res, rej) => {
            dao.getUserExistsByCount(body.count, (data) => (data ? res(data) : rej(data)));
        }).then(
            async (res) => {
                if (res.length < 1) {
                    ctx.body = { code: 1, msg: '找不到该用户，请先注册' };
                } else {
                    if (body.passwd) {
                        body.passwd = tool.Encryption(body.passwd);
                    }
                    await new Promise((res, rej) => {
                        dao.updateUserInfo(body, (data) => (data ? res(data) : rej(data)));
                    }).then(
                        () => (ctx.body = { code: 0, msg: '修改成功' }),
                        () => (ctx.body = { code: 1, msg: '修改失败，未知错误' })
                    );
                }
            },
            () => (ctx.statusCode = 500)
        );
    }
});

// 增加用户信息
router.post('/add/userInfo', async (ctx) => {
    const body = ctx.request.body || undefined;
    if (body && body.count) {
        await new Promise((res, rej) => {
            dao.getUserExistsByCount(body.count, (data) => (data ? res(data) : rej(data)));
        }).then(
            async (res) => {
                if (res.length >= 1) {
                    ctx.body = { code: 1, msg: '用户已存在' };
                } else {
                    await new Promise((res, rej) => {
                        dao.addUserInfo(body, (data) => (data ? res(data) : rej(data)));
                    }).then(
                        () => (ctx.body = { code: 0, msg: '新增用户成功' }),
                        () => (ctx.statusCode = 500)
                    );
                }
            },
            () => (ctx.statusCode = 500)
        );
    } else {
        logger.debug(`增加用户未知参数:${body}`);
        ctx.body = { code: 1, msg: '未知参数' };
    }
});

// 获取系统日志
router.get('/get/systemLogs', async (ctx) => {
    const data = await tool.getLogFileData();
    if (data === false) {
        ctx.statusCode = 500;
    } else {
        ctx.body = {
            code: 0,
            msg: 'ok',
            data,
        };
    }
});

// 获取图片信息
router.get('/get/imageInfo', async (ctx) => {
    const len = ctx.query.len || 10;
    const count = ctx.query.count || 0;
    await Promise.all([
        new Promise((res, rej) => {
            dao.getImageInfo(count, len, (data) => (data ? res(data) : rej(data)));
        }),
        new Promise((res, rej) => {
            dao.getImageInfoCount((data) => (data ? res(data) : rej(data)));
        }),
    ]).then(
        (res) => {
            ctx.body = {
                code: 0,
                msg: 'ok',
                data: res[0],
                total: res[1][0].TOTAL,
            };
        },
        () => {
            ctx.statusCode = 500;
        }
    );
});

// 删除图片信息
router.get('/del/imageInfo', async (ctx) => {
    const id = ctx.query.id;
    if (id) {
        await new Promise((res, rej) => {
            dao.delImageInfo(id, (data) => (data ? res(data) : rej(daya)));
        }).then(
            () => (ctx.body = { code: 0, msg: '删除成功' }),
            () => (ctx.statusCode = 500)
        );
    } else {
        ctx.body = {
            code: 1,
            msg: '删除的图片ID错误',
        };
    }
});
