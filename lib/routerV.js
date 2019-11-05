/**
 * @author     hc
 * @time       2019-10-18
 * @chang      2019-11-5
 *  路由模块： 
 *      匹配 /v 路径下的路由
 *      该模块下的路由，在配置文件开启请求验证之后，需要验证用户的登陆信息才能访问
 */




const Router = require("koa-router");
const router = new Router({ "prefix": "/v", "strict": true, "sensitive": true });
const logger = require("./logger");
const config = require("./config");
const tool = require("./tool");
const jwt = require("./jwt");
const dao = require("./dao");

module.exports = router;

//  /v 路由中间件     验证登陆信息以及请求方式
router.use(async (ctx, next) => {
    // 过滤未许可的请求方式
    if (!['GET', 'POST', 'OPTION'].includes(ctx.method)) {
        ctx.res.statusCode = 403;
        ctx.body = {
            "code": 1,
            "msg": "未许可的请求方式！",
            "statusCode": 403
        }
        return false;
    }
    // 过滤用户token验证
    if (config.enableVerify && !jwt.verifyToken(ctx.req.token)) {
        ctx.res.statusCode = 403;
        ctx.body = {
            "code": 1,
            "msg": "用户登陆验证失败，请登陆后再试",
            "statusCode": 403
        }
        return false;
    }
    await next();
})



// 拦截 /v/get/image/ 路径下的请求  检测请求的文件名是否为空
router.get("/get/image/:fileType/:fileName?", async (ctx, next) => {
    const fileName = ctx.params.fileName || "";
    if (fileName === "") {
        ctx.res.statusCode = 400;
        ctx.body = {
            code: 1,
            msg: "invalid request fileName"
        };
        logger.info(`错误的请求: ${ctx.ip}  ${ctx.req.url}`);
    } else {
        await next();
    }
})

// 获取单个图片的数据   缩略图
router.get("/get/image/nail/:fileName", ctx => {
    const fileName = ctx.params.fileName;
    dao.getThumbnailByfName(fileName, function () {
        console.log(arguments);
    })
})



// 获取图片数据    高清图
router.get("/get/image/hd/:fileName", async ctx => {
    const fileName = ctx.params.fileName || "";
    await new Promise((resolve, reject) => {
        dao.getThumbnailByfName(fileName, data => {
            const fPath = data.fThumbnail;
            tool.getImageData(fPath, data => {
                if (data.data) {
                    ctx.res.writeHead(200, {
                        "content-type": data.type
                    });
                    ctx.body = data.data;
                } else {
                    ctx.res.statusCode = 404;
                }
                resolve();
            })
        })
    })
})


// 获取图片的所有可选项   图片地址
router.get("/get/image/list/:fileName", ctx => {
    const fileName = ctx.params.fileName || "";
})



