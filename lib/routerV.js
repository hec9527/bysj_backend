/**
 * @author     hc
 * @time       2019-10-18
 * @change     2019-11-12
 *  路由模块：
 *      匹配 /v 路径下的路由
 *      该模块下的路由，在配置文件开启请求验证之后，需要验证用户的登陆信息才能访问
 */

const Router = require('koa-router');
const router = new Router({ prefix: '/v', strict: true, sensitive: true });
const logger = require('./logger');
const config = require('./config');
const tool = require('./tool');
const jwt = require('./jwt');
const dao = require('./dao');

module.exports = router;

// ===========================================  中间件  ===========================================

// 中间件  /v 路由中间件     验证登陆信息以及请求方式
router.use(async (ctx, next) => {
    // 过滤未许可的请求方式
    if (!['GET', 'POST', 'OPTION'].includes(ctx.method)) {
        ctx.res.statusCode = 403;
        ctx.body = {
            code: 1,
            msg: '未许可的请求方式！',
            statusCode: 403
        };
        return false;
    }
    // 过滤用户token验证
    if (config.enableVerify && !jwt.verifyToken(ctx.header.token)) {
        ctx.res.statusCode = 403;
        ctx.body = {
            code: 1,
            msg: '身份信息验证失败，请登陆后再试',
            statusCode: 403
        };
        return false;
    }
    await next();
});

// 中间件    所有用户信息相关的请求都需要先过滤
router.post('/post/user/*', async (ctx, next) => {
    const account = jwt.decodeToken(ctx.header.token);
    if (account === false) {
        // 二次检测，防止在没有开启请求验证的时候出现权限错误
        ctx.body = {
            code: 1,
            msg: '用户信息验证失败'
        };
        return (ctx.res.statusCode = 403);
    }
    await next();
});

// ===========================================  后端API  ===========================================

// 通过文件路径获取图片    任意图
router.get('/get/image/data', async ctx => {
    const fPath = ctx.query.url || '';
    if (fPath) {
        await new Promise(async resolve => {
            await getImageData(ctx, fPath, resolve);
        });
    }
});

// 获取单个图片的数据   缩略图
router.get('/get/image/nail/:fileName', async ctx => {
    await new Promise((resolve, reject) => {
        dao.getNailImage(ctx.params.fileName, async data => {
            await getImageData(ctx, data[0]['fThumbnail'], resolve);
        });
    });
});

// 获取单个图片的数据    高清图
router.get('/get/image/hd/:fileName/:fSize?', async ctx => {
    const fSize = ctx.params.fSize || '';
    await new Promise((resolve, reject) => {
        dao.getHDImage(ctx.params.fileName, fSize, async data => {
            data = fSize ? data[0]['fPath'] : data[0]['fThumbnail'];
            await getImageData(ctx, data, resolve);
        });
    });
});

// 获取用户信息
router.post('/post/user/info', async ctx => {
    await new Promise(resolve => {
        dao.getUserInfo(
            jwt.decodeToken(ctx.header.token)['userAccount'],
            data => {
                data = data[0];
                delete data['userPasswd'];
                ctx.body = {
                    code: 0,
                    msg: 'ok',
                    data: data
                };
                resolve();
            }
        );
    });
});

// 用户修改用户信息
router.post('/post/user/update', async ctx => {
    await new Promise(resolve => {
        const userAccount = jwt.decodeToken(ctx.header.token)['userAccount'];
        dao.setUserInfo(
            userAccount,
            tool.objToString(ctx.request.body),
            data => {
                if (data.affectedRows >= 1) {
                    ctx.body = {
                        code: 0,
                        msg: 'ok'
                    };
                } else {
                    ctx.res.statusCode = 500;
                }
                resolve();
            }
        );
    });
});

// 分页查询   获取最新的图片，给定起始位置和长度   len允许值1-300
router.get(
    '/get/list/new/:begin/:len?',
    async ctx => await getJSON(ctx, dao.getNewImage)
);

// 分页查询   获取热度最高的图片，给定起始位置和长度   len允许值1-300
router.get(
    '/get/list/hot/:begin/:len?',
    async ctx => await getJSON(ctx, dao.getHotImage)
);

// 分页查询   根据分辨率获取图片，给定分辨率大小，起始位置，长度
router.get(
    '/get/list/size/:size/:begin/:len?',
    async ctx => await getJSONByParmas(ctx, dao.getImageBySize)
);

// 分页查询   根据图片的标签获取图片，给定图片的类型，起始位置，长度
router.get(
    '/get/list/tag/image/:param/:begin/:len?',
    async ctx => await getJSONByParmas(ctx, dao.getImageByTag)
);

// 分页查询   根据标签查询用户，给定查询的方式，起始位置，长度
router.get(
    '/get/list/tag/user/:param/:begin/:len?',
    async ctx => await getJSONByParmas(ctx, dao.getUserByTag)
);

// 分页查询   获取用户上传的所有图片 并且按照时间排序
router.get(
    '/get/list/user/:user/:begin/:len?',
    async ctx => await getJSONByParmas(ctx, dao.getImageByUser)
);

// ============================  该模块中重复用到的函数提取出来写成公共函数，方便调用以及减少代码 ============================

/**
 * 获取图片的数据，并且返回到前端界面
 * @param {*} ctx 上下文菜单
 * @param {*} fPath 读取文件的路径
 * @param {*} resolve 异步成功之后执行
 */
function getImageData(ctx, fPath, resolve) {
    if (fPath === undefined) {
        ctx.res.statusCode = 404;
        resolve();
    } else {
        tool.readFile(fPath, data => {
            if (data === false) {
                ctx.res.statusCode = 404;
            } else {
                ctx.res.writeHead(200, { 'content-type': data.type });
                ctx.body = data.data;
            }
            resolve();
        });
    }
}

/**
 * 获取基本的JSON数据，可通过此函数查询的数据应该只包含，起始位置，长度
 * @param {*} ctx 上下文对象
 * @param {*} callback 回调函数
 */
async function getJSON(ctx, callback) {
    let result = {};
    try {
        const begin = parseInt(ctx.params.begin) || 0;
        const len = parseInt(ctx.params.len) || 30;
        if (len > 300 || len < 0 || begin < 0) {
            throw `Unexpected parmas, argument "len" must be int and 1-300, argument "begin" must be int and no less 0`;
        }
        await new Promise((resolve, reject) => {
            callback(begin, len, data => {
                if (data === false) {
                    logger.error('Unexprected error, dao module returns false');
                    result = {
                        code: '1',
                        msg: 'DataBase query result as null'
                    };
                    reject();
                } else {
                    result = {
                        code: '0',
                        msg: 'ok',
                        len: len,
                        data: tool.Parse(data)
                    };
                    ctx.res.statusCode = 200;
                    resolve();
                }
            });
        });
    } catch (error) {
        ctx.res.statusCode = 400;
        result = {
            code: 1,
            msg: error
        };
    }
    ctx.body = result;
}

/**
 * 通过指定参数来获取对应的JSON信息，通常包含用户、文件大小等， 该函数适合处理包含3个参数的请求
 * @param {*} ctx 上下文对象
 * @param {*} callback 回调函数
 */
async function getJSONByParmas(ctx, callback) {
    try {
        const param = ctx.params.param;
        const begin = ctx.params.begin || 0;
        const len = ctx.params.len || 30;
        if (len < 0 || len > 300 || begin < 0)
            throw 'Unexpected parmas, 0 <= len <= 300，and begin >= 0';
        await new Promise((resolve, reject) => {
            callback(param, begin, len, data => {
                if (data === false) {
                    ctx.res.statusCode = 500;
                    reject();
                } else {
                    ctx.body = {
                        code: 0,
                        msg: 'ok',
                        len: len,
                        data: data
                    };
                    resolve();
                }
            });
        });
    } catch (error) {
        ctx.res.statusCode = 400;
        ctx.body = {
            code: 1,
            msg: error
        };
    }
}

// 解析post请求发送的数据
// function parsePostData(ctx) {
//   return new Promise((resolve, reject) => {
//     try {
//       let postdata = "";
//       ctx.req.addListener('data', (data) => {
//         postdata += data
//       })
//       ctx.req.addListener("end", function () {
//         let parseData = parseQueryStr(postdata)
//         resolve(parseData)
//       })
//     } catch (err) {
//       reject(err)
//     }
//   })
// }
