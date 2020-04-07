/**
 * @author     hc
 * @time       2019-10-18
 * @change     2019-10-18
 * 日志打印模块，将日志信息同时输出到控制台以及日志文件
 */

const log4js = require('log4js');
const config = require('./config');

log4js.configure({
    appenders: {
        out: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[%d %f{1} %p %l: %m %]',
            },
        },
        out1: {
            type: 'dateFile',
            filename: config.logPath || 'log.log',
            pattern: '-yyyy-MM-dd.log',
            layout: {
                type: 'basic',
            },
        },
    },
    categories: {
        default: {
            appenders: ['out', 'out1'],
            level: 'all',
            enableCallStack: true,
        },
    },
});

module.exports = log4js.getLogger();
