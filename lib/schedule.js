/**
 * @author      hc
 * @time        2019-11-13
 * @change      2020-04-23
 *      日程模块
 *  设定定时任务，到指定时间或者每间隔多少时间自动执行
 */

const schedule = require('node-schedule');
const logger = require('./logger');
const spider = require('./spider');
const tasks = {};

// 秒  分  时  日  月  周几
tasks.newSpider = function () {
    logger.info('定时任务开启：每日数据更新');
    // 每日凌晨12点整开始爬虫任务
    schedule.scheduleJob('spider task', '0 0 0 * * *', async () => {
        logger.info('定时任务： 爬虫更新---开始');
        await new Promise(async (res, rej) => {
            try {
                await spider.getNews();
                res();
            } catch {
                rej();
            }
        });
        logger.info('定时任务： 爬虫更新---结束');
        logger.info('定时任务： 图片识别---开始');
        await new Promise(async (res, rej) => {
            try {
                await spider.imageTypes();
                res();
            } catch {
                rej();
            }
        });
        logger.info('定时任务： 图片识别---结束');
    });
};

// 获取当前所有定时作业任务
tasks.getAllTasks = function () {
    return schedule.scheduledJobs;
};

// 关闭定时任务
tasks.closeTask = function (jobName) {
    return schedule.cancelJob(jobName);
};

// 新建定时任务
tasks.newTask = function (taskName, taskPattern, taskCallBack) {
    return schedule.scheduleJob(taskName, taskPattern, taskCallBack);
};

module.exports = tasks;
