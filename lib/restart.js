/**
 * @author   hec9257
 * @time     2020-5-3
 * @change   2020-5-3
 * 重启服务
 */

const { spawn } = require('child_process');
const logger = require('./logger');

console.log(process.argv);
logger.fatal(process.argv);
