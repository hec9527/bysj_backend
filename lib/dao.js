/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-11-12
 * 数据库持久层
 *    1， 提供操作数据库的方法
 *    2， 防止sql注入攻击
 *    3,  如果数据库不存在则初始化数据库
 *
 *     记得归还连接    ----------    你还欠我一个连接
 */

const mysql = require('mysql');
const config = require('./config');
const logger = require('./logger');

// 创建数据库连接
const cnnPool = mysql.createPool({
    host: config.dbHost || 'localhost',
    port: config.dbPort || '3306',
    user: config.dbUser || 'root',
    password: config.dbPasswd || '123',
    database: config.dbDatabase || 'bysj',
    connectionLimit: config.dbPool || 10,
    connectTimeout: config.dbTimeOut || 30,
    stringifyObjects: true, // 序列化对象
    typeCast: true, // 转换列值为本地JavaScript数据类型
});

// 数据库初始化
(function () {
    setTimeout(() => {
        checkCnnPool();
    }, 100);
    // delete sqls;
})();

/**
 * 测试数据库连接池
 */
function checkCnnPool() {
    const sql = 'SELECT 1 + 1 AS result';
    myQuery(sql, (data) => {
        if (data === false) {
            logger.error('数据库连接池初始化失败');
        } else {
            logger.info('数据库连接池初始化成功');
        }
    });
    process.once('uncaughtException', processEixt);
    process.once('beforeExit', processEixt);
    process.once('exit', processEixt);
    process.once('SIGINT', processEixt);
    function processEixt() {
        logger.info(`关闭数据库`);
        cnnPool.end();
        process.exit();
    }
}

/**
 * 简单封装的查询语句，自动从连接池里获取连接，完成查询之后自动放回连接池
 * @param {*} String  SQL语句
 * @param {*} callback 回调函数
 */
function myQuery(sql, callback) {
    cnnPool.getConnection((error, cnn) => {
        if (error) return callback(false);
        cnn.query(sql, (error, data, feild) => {
            if (error) {
                logger.error(error);
                callback(false);
            } else {
                callback(data);
            }
        });
        cnn.release();
    });
}

module.exports = {
    /**
     * 获取指定文件名的缩略图路径     回调函数的参数为false 的时候查询失败
     * @param {*} String  文件名
     * @param {*} callback 回调函数，参数为获取到的数据
     */
    getNailImage: function (fileName, callback) {
        const sql = `SELECT * FROM images WHERE fName='${fileName}';`;
        myQuery(sql, callback);
    },

    /**
     * 获取指定文件名的高清图， 回调函数的参数为false的时候查询失败
     * @param {*} String 文件名
     * @param {*} String 文件的分辨率
     * @param {*} callback 回调函数
     */
    getHDImage: function (fName, fSize, callback) {
        if (!fSize) return this.getNailImage(fName, callback);
        const sql = `SELECT * FROM imagepath WHERE fName='${fName}' AND fResolution='${fSize}';`;
        myQuery(sql, callback);
    },

    /**
     * 获取最新的图片信息    回调函数为返回的数据列表
     * @param {*} begin 起始位置
     * @param {*} len    结束位置
     * @param {*} callback   回调函数
     */
    getNewImage: function (begin, len, callback) {
        const sql = `SELECT * FROM images ORDER BY fUpTime desc LIMIT ${begin},${begin + len};`;
        myQuery(sql, callback);
    },

    /**
     * 获取热度最高的图片
     * @param {*} begin 起始位置
     * @param {*} len 数据长度
     * @param {*} callback 回调函数
     */
    getHotImage: function (begin, len, callback) {
        const sql = `SELECT * FROM images ORDER BY fStar desc LIMIT ${begin},${begin + len};`;
        myQuery(sql, callback);
    },

    /**
     * 通过上传的用户来获取图片
     * @param {*} user 用户名
     * @param {*} begin 起始位置
     * @param {*} len 结束位置
     * @param {*} callback 回调函数
     */
    getImageByUser: function (user, begin, len, callback) {
        const sql = `SELECT * FROM images WHERE userAccount=${user} LIMIT ${begin},${begin + len};`;
        mysql(sql, callback);
    },

    /**
     * 通过图片的大小查询图片的信息
     * @param {*} size 图片大小
     * @param {*} begin 起始位置
     * @param {*} len 结束位置
     * @param {*} callback 回调函数
     */
    getImageBySize: function (size, begin, len, callback) {
        var size = ['720p', '1080p', '2k', '4k', '8k'].includes(size) ? size : 'other';
        const sql = `SELECT * FROM imagepath WHERE fResolution=${size} LIMIT ${begin},${begin + len};`;
        myQuery(sql, callback);
    },

    /**
     * 通过标签名来获取图片
     * @param {*} tag 标签名
     * @param {*} begin 起始位置
     * @param {*} size 结束位置
     * @param {*} callback 回调函数
     */
    getImageByTag: function (tag, begin, size, callback) {
        const sql = `SELECT imagepath.* from imagepath,tag1 WHERE imagepath.tagname='${tag}' AND imagepath.tagname=tag1.tagname;`;
        myQuery(sql, callback);
    },

    /**
     * 通过标签名获取用户数据
     * @param {*} tag 标签名
     * @param {*} begin 起始位置
     * @param {*} size 结束位置
     * @param {*} callback 回调函数
     */
    getUserByTag: function (tag, begin, size, callback) {
        const sql = `SELECT user.* FROM user,tag1 WHERE user.userTag='${tag}' AND user.usertag=tag1.tagname;`;
        myQuery(sql, callback);
    },

    /**
     * 可能存在某些问题，比如某人的QQ和微信同号或其他同号
     * 通过指定参数查找用户
     * QQ、微信、手机号码、网站账户、邮箱
     * @param {*} user String 用户名
     * @param {*} passwd String 用户密码
     */
    userLogin: async function (user, passwd) {
        const sql = `SELECT * FROM user WHERE (userAccount='${user}' OR userQQ='${user}'
     OR userWeChat='${user}' OR userPhone='${user}' OR userEmail='${user}') AND userPasswd='${passwd}';`;
        let result = false;
        await new Promise((resolve) => {
            myQuery(sql, (data) => {
                if (data !== false) {
                    result = true;
                }
                resolve();
            });
        });
        return result;
    },

    /**
     * 获取用户信息
     * 用户可能使用的是 QQ | 微信 | 手机 | 邮箱 | 网站账户
     * @param {*} user 用户账户
     * @param {*} callback 回调函数
     */
    getUserInfo: function (user, callback) {
        const sql = `SELECT * FROM user WHERE userAccount='${user}' OR userQQ='${user}' OR userWeChat='${user}' OR userPhone='${user}' OR userEmail='${user}'`;
        myQuery(sql, callback);
    },

    /**
     * 修改用户的个人信息
     * @param {*} user String 用户账户名
     * @param {*} kv String 所有键值对组成的字符串
     * @param {*} callback 回调函数
     */
    setUserInfo: function (user, kv, callback) {
        const sql = `UPDATE user SET ${kv} WHERE userAccount='${user}'`;
        myQuery(sql, callback);
    },

    /**
     * 通过关键字模糊查询
     * @param {*} kw 关键字
     * @param {*} bg 起始位置
     * @param {*} len 结束位置
     * @param {*} callback 会掉函数
     */
    getByKeyWord(kw, bg, len, callback) {
        const sql = `SELECT  *  FROM images WHERE TAG LIKE '%${kw}%' limit ${bg},${len};`;
        myQuery(sql, callback);
    },

    /**
     * 通过关键字查询
     * @param {*} kw 关键字
     * @param {*} callback 回调函数
     */
    getCountByKeyWord(kw, callback) {
        const sql = "SELECT COUNT(*) AS total FROM images WHERE TAG LIKE '%" + kw + "%';";
        myQuery(sql, callback);
    },

    /**
     * 从图片表中查找所有的图片分类
     * @param {*} callback
     */
    getAllImageType(callback) {
        const sql = 'SELECT distinct category FROM images';
        myQuery(sql, callback);
    },

    /**
     * 获取指定图片类型的数据
     * @param {String} category 分类信息
     * @param {number} count  便宜量
     * @param {number} len  长度
     * @param {Function} callback  回调函数
     */
    getImageByCategory(category, count, len, callback) {
        const sql = `SELECT  *  FROM images WHERE category='${category}' limit ${count},${len};`;
        myQuery(sql, callback);
    },

    /**
     * 获取指定分类图片 的数量
     * @param {String} category 分类信息
     * @param {Function} callback  回调函数
     */
    getImageLenByCategory(category, callback) {
        const sql = `SELECT COUNT(*) AS total FROM images WHERE category='${category}';`;
        myQuery(sql, callback);
    },

    /**
     * 获取必应最近7日的数据
     * @param {Function} callback
     */
    getBiyingServenDay(callback) {
        const sql = `SELECT * FROM biying ORDER BY date desc limit 0,7;`;
        myQuery(sql, callback);
    },
};
