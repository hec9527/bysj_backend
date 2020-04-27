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
const { spawn } = require('child_process');
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
