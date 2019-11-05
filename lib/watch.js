/**
 * @author   hc
 * @time     2019-10-18
 * @change   2019-10-18
 * 守护进程：
 *     1. 当配置文件修改的时候，重启服务器
 *     2. 检测服务器信息，当服务器异常退出的时候，重启服务器
 */


const logger = require("./logger");
const fs = require("fs");
let config = require("./config");
const argv = process.argv.splice(2);






// 检测配置文件更改重启服务器
fs.watch(config.configPath, () => {
    logger.info(`修改配置文件，重启服务器！`);
    config = require("./config");
})


