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
const jwt = require('./jwt');
const router = new Router({ prefix: '/m', sensitive: 'true', strict: 'true' });

module.exports = router;

router.get('/login', (ctx) => {
    ctx.body = 4231;
});
