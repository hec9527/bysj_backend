import logger from 'log4js';

const { spawn } = require('child_process');

module.exports = {
    // 获取最新
    getNew: function () {
        try {
            spawn('python3 ../lib/spider/spiderNew.py');
        } catch (error) {
            logger.error('获取最近数据失败，请查看日志文件');
        }
    },

    // 获取所有
    getAll: function () {
        try {
            spawn('python3 ../lib/spider/spiderAll.py');
        } catch (error) {
            logger.error('拉取所有数据失败，请查看日志文件');
        }
    },

    // 初始化数据库
    initDao: function () {
        try {
            spawn('python3 ../lib/spider/dao.py');
        } catch (error) {
            logger.error('初始化数据库失败，请查看日志文件');
        }
    },

    // 调用tx接口
    imageTypes: function () {
        try {
            spawn('python3 ../lib/spider/spiderall.py imageSpier');
        } catch (error) {
            logger.error('图片识别失败');
        }
    },
};
